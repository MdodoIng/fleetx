'use client';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { vendorService } from '@/shared/services/vender';
import {
  TypeEditVenderReq,
  TypeVenderList,
  TypeVendorType,
} from '@/shared/types/vender';
import { useVenderStore } from '@/store';
import { useEffect, useState, type JSX } from 'react';
import VendersList from '@/features/vendor/components/list/VendersList';
import EditVender from '@/features/vendor/components/list/EditVender';
import { useForm } from 'react-hook-form';
import {
  editVendorBranchSchema,
  editVendorNameSchema,
  TypeEditVendorBranchSchema,
  TypeEditVendorNameSchema,
} from '@/features/vendor/validations/editVender';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddUpdateVender } from '@/features/vendor/hooks/useAddUpdateVender';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import TableComponent from '@/features/vendor/components/list/TableComponent';
import BranchEditForm from '@/features/vendor/components/BranchEditForm';
import { Contact, MapPin, Trash, User2 } from 'lucide-react';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Table,
  TableLists,
  TableSigleList,
  TableSigleListContent,
  TableSigleListContentDetailsTitle,
  TableSigleListContents,
  TableSigleListContentTitle,
} from '@/shared/components/ui/tableList';
import { Separator } from '@/shared/components/ui/separator';

function VenderAdd(): JSX.Element {
  const venderStore = useVenderStore();
  const [codType, setCodType] = useState<1 | 2>(2);
  const [isVendorType, setIsVendorType] = useState<
    (keyof typeof TypeVendorType)[]
  >(['B2B_Vendor']);

  const editVendorNameForm = useForm<TypeEditVendorNameSchema>({
    resolver: zodResolver(editVendorNameSchema),
    defaultValues: {
      cod_counter_type: 1,
      name: '',
      name_ar: '',
    },

    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const editVendorBranchForm = useForm<TypeEditVendorBranchSchema>({
    resolver: zodResolver(editVendorBranchSchema),
    defaultValues: {
      name: '',
      name_ar: '',
      mobile_number: '',
      main_branch: false,
      address: {
        address: '',
        area: '',
        area_id: '',
        block: '',
        block_id: '',
        street: '',
        street_id: '',
        building: '',
        building_id: '',
        floor: '',
        landmark: '',
        latitude: '',
        longitude: '',
        paci_number: '',
        room_number: '',
      },
    },

    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const {
    handelAddBranch,
    branchs,
    isLoadingForm,
    handleRemoveBranch,
    handelSaveVender,
  } = useAddUpdateVender(
    editVendorNameForm,
    editVendorBranchForm,
    '' as any,
    codType
  );

  console.log(venderStore.selectedBranch?.id);

  const tableData = branchs
    ? branchs?.map((item: any, idx) => {
        return [
          {
            icon: User2,
            title: 'name',
            value: item.name,
          },
          {
            icon: User2,
            title: 'Name_ar',
            value: item.name_ar,
          },
          {
            icon: MapPin,
            title: 'Area',
            value: item.address.area,
          },
          {
            icon: Contact,
            title: 'Contact',
            value: item.mobile_number,
          },
          {
            icon: User2,
            title: 'Type',
            value: item.main_branch ? 'Main Branch' : 'Normal',
          },

          {
            icon: User2,
            title: ' Action',
            value: <Trash />,
            onClick: () => handleRemoveBranch(idx),
          },
        ];
      })
    : [];

  const { register: vendorNameRegister } = editVendorNameForm;

  const toggleVendorType = (value: (typeof isVendorType)[number]) => {
    setIsVendorType((prev: typeof isVendorType) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  return (
    <Dashboard className="">
      <DashboardHeader>
        <DashboardHeaderRight />
      </DashboardHeader>
      <Card className="relative z-0 flex-col">
        <CardContent className="space-y-6 w-full">
          <div className="space-y-4 w-full">
            {/* Row with inputs + checkboxes */}
            <div className="grid grid-cols-[300px_300px_auto] items-center gap-6">
              {/* Vendor Name */}
              <div className="space-y-1">
                <Label htmlFor="vendorName">Vendor Name*</Label>
                <Input
                  id="vendorName"
                  {...vendorNameRegister('name')}
                  placeholder="TestBusiness2"
                  defaultValue="TestBusiness2"
                />
              </div>

              {/* Name-ar */}
              <div className="space-y-1">
                <Label htmlFor="nameAr">Name-ar*</Label>
                <Input
                  id="nameAr"
                  {...vendorNameRegister('name_ar')}
                  placeholder="Name-ar"
                />
              </div>
              <div className="flex flex-col space-y-3 pointer-events-none opacity-70">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="b2b"
                    checked={isVendorType.includes('B2B_Vendor')}
                    onCheckedChange={() => toggleVendorType('B2B_Vendor')}
                  />
                  <Label htmlFor="b2b">B2B Vendor</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="b2c"
                    checked={isVendorType.includes('B2C_Vendor')}
                    onCheckedChange={() => toggleVendorType('B2C_Vendor')}
                  />
                  <Label htmlFor="b2c">B2C Vendor</Label>
                </div>
              </div>

              {/* Cashless */}
              <div className="flex flex-col gap-3.5">
                {/* Cashless */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cashless"
                    checked={codType === 1}
                    onCheckedChange={() => setCodType(1)}
                  />
                  <Label htmlFor="cashless">Cashless</Label>
                </div>

                {/* Pay at counter */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payCounter"
                    checked={codType === 2}
                    onCheckedChange={() => setCodType(2)}
                  />
                  <Label htmlFor="payCounter">Pay at counter</Label>
                </div>
              </div>
            </div>
          </div>

          {!isLoadingForm && (
            <>
              <Separator />
              <div className=" space-y-4">
                <BranchEditForm form={editVendorBranchForm} />
                <Button onClick={() => handelAddBranch()} type="submit">
                  Add Brach
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {tableData.length ? (
        <>
          <Table>
            <TableLists>
              {tableData.map((item, idx) => (
                <TableSigleListContents key={idx}>
                  {item.map((i, listIdx) => (
                    <TableSigleListContent key={listIdx}>
                      <TableSigleListContentTitle>
                        <i.icon size={14} />
                        {i.title}
                      </TableSigleListContentTitle>
                      <TableSigleListContentDetailsTitle
                        className="line-clamp-2"
                        onClick={i.onClick ? () => i.onClick() : undefined}
                      >
                        {i.value}
                      </TableSigleListContentDetailsTitle>
                    </TableSigleListContent>
                  ))}
                </TableSigleListContents>
              ))}
            </TableLists>
          </Table>
          <Button onClick={() => handelSaveVender(isVendorType)} type="submit">
            Save All
          </Button>
        </>
      ) : (
        ''
      )}
    </Dashboard>
  );
}

export default VenderAdd;
