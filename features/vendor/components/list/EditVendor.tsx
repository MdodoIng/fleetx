'use client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Edit, LocateIcon, Phone, Pin, Type, User2, X } from 'lucide-react';
import TableComponent from './TableComponent';
import {
  TypeBranch,
  TypeEditVendorReq,
  TypeVendor,
} from '@/shared/types/vendor';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useVendorStore } from '@/store';
import { vendorService } from '@/shared/services/vendor';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editVendorBranchSchema,
  editVendorNameSchema,
  TypeEditVendorBranchSchema,
  TypeEditVendorNameSchema,
} from '../../validations/editVendor';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import BranchEditForm from '../BranchEditForm';

import { useAddUpdateVendor } from '../../hooks/useAddUpdateVendor';
import userService from '@/shared/services/user';
import {
  Table,
  TableLists,
  TableSingleList,
  TableSingleListContent,
  TableSingleListContentDetailsTitle,
  TableSingleListContents,
  TableSingleListContentTitle,
  TableSingleListHeader,
} from '@/shared/components/ui/tableList';
import { Card, CardContent } from '@/shared/components/ui/card';
import NoData from '@/shared/components/fetch/NoData';

type Props = {
  page: number;
  nextSetItemTotal: any;
  setPage: Dispatch<SetStateAction<number>>;
};

const EditVendor = ({ page, nextSetItemTotal, setPage }: Props) => {
  const vendorStore = useVendorStore();
  const [vendorData, setVendorData] = useState<TypeVendor | undefined>(
    undefined
  );

  const [codType, setCodType] = useState<1 | 2>(2);
  const [branchs, setbranches] =
    useState<TypeEditVendorReq['branches'][number][]>();
  const [accountManagerList, setAccountManagerList] = useState();
  const [isCreateNewBranch, setIsCreateNewBranch] = useState(false);

  const handleEditBranchClick = (item: TypeVendor['branches'][number]) => {
    vendorStore.setValue('isEditVendorBranchId', item.id);
  };

  const fetchVendorDetails = useCallback(async () => {
    if (vendorStore.isEditVendorId) {
      try {
        const res = await vendorService.getVendorDetails(
          vendorStore.isEditVendorId!
        );

        setVendorData(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [vendorStore.isEditVendorId]);

  async function fetchAccountManagerList() {
    try {
      const res = await userService.getAccountManagerList(1, 1000, null);

      // @ts-ignore
      if (res?.data) {
        // @ts-ignore
        setAccountManagerList(res.data);
      }
    } catch (err: any) {
      console.log(err);
    }
  }

  useEffect(() => {
    const loadFetchVendorDetails = async () => {
      await fetchVendorDetails();
      await fetchAccountManagerList();
    };
    loadFetchVendorDetails();
  }, [fetchVendorDetails]);

  const tableData = vendorData?.branches.map((item) => {
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
        icon: Phone,
        title: 'Phone',
        value: item.mobile_number,
      },
      {
        icon: Type,
        title: 'Type',
        value: item.main_branch ? 'Main Branch' : 'Normal',
      },
      {
        icon: LocateIcon,
        title: 'Address',
        value: [
          item.address.area,
          item.address.block,
          item.address.street,
        ].join(', '),
      },
      {
        icon: Pin,
        title: 'Latitude',
        value: item.address.latitude,
      },
      {
        icon: Pin,
        title: 'Longitude',
        value: item.address.longitude,
      },
      {
        icon: Edit,
        title: ' Action',
        value: <Edit />,
        onClick: () => handleEditBranchClick(item),
      },
    ];
  });

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
    validateFormsAsync,
    updateVendorDetailsForFromApi,
    isLoadingForm,
    handleUpdate,
  } = useAddUpdateVendor(
    editVendorNameForm,
    editVendorBranchForm,
    vendorData!,
    codType
  );

  useEffect(() => {
    if (vendorData) {
      updateVendorDetailsForFromApi();
    }
  }, [
    vendorData,
    vendorStore.isEditVendorBranchId,
    vendorStore.isEditVendorId,
  ]);

  const { register: vendorNameRegister } = editVendorNameForm;

  return (
    <>
      <Card className="w-full p-4 space-y-4 items-start">
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

        {/* Add new branch link */}
        <Button type="button" onClick={() => setIsCreateNewBranch(true)}>
          ADD NEW BRANCH
        </Button>
      </Card>

      {tableData?.length && (
        <>
          <Table>
            <TableLists>
              {tableData.map((item, idx) => (
                <TableSingleList key={idx}>
                  <TableSingleListContents>
                    {item.map((i, listIdx) => (
                      <TableSingleListContent key={listIdx}>
                        <TableSingleListContentTitle>
                          <i.icon size={14} />
                          {i.title}
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle
                          className="line-clamp-2"
                          onClick={i.onClick ? () => i.onClick() : undefined}
                        >
                          {i.value}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContent>
                    ))}
                  </TableSingleListContents>
                </TableSingleList>
              ))}
            </TableLists>
          </Table>
          <Button
            onClick={() =>
              handleUpdate(
                'updateAll',
                isCreateNewBranch,
                setIsCreateNewBranch,
                fetchVendorDetails
              )
            }
            type="submit"
          >
            Update All
          </Button>
        </>
      )}

      {!isLoadingForm && (
        <Dialog open={!!vendorStore.isEditVendorBranchId || isCreateNewBranch}>
          <DialogContent
            // showCloseButton={false}
            closeButtonOnClick={() =>
              vendorStore.setValue('isEditVendorBranchId', undefined)
            }
            className="sm:w-[min(90%,700px)] sm:max-w-full"
          >
            <DialogHeader>
              <DialogTitle>Update branch</DialogTitle>
            </DialogHeader>

            <BranchEditForm form={editVendorBranchForm} />

            <DialogFooter>
              <Button
                onClick={() =>
                  handleUpdate(
                    'updateBranch',
                    isCreateNewBranch,
                    setIsCreateNewBranch,
                    fetchVendorDetails
                  )
                }
                type="submit"
              >
                Update Branch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EditVendor;
