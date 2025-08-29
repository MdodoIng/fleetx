'use client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Edit, LocateIcon, Phone, Pin, Type, User2, X } from 'lucide-react';
import TableComponent from './TableComponent';
import {
  TypeBranch,
  TypeEditVenderReq,
  TypeVender,
} from '@/shared/types/vender';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useVenderStore } from '@/store';
import { vendorService } from '@/shared/services/vender';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editVendorBranchSchema,
  editVendorNameSchema,
  TypeEditVendorBranchSchema,
  TypeEditVendorNameSchema,
} from '../../validations/editVender';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import BranchEditForm from '../BranchEditForm';
import { getAccountManagerList } from '@/shared/services/user';
import { useAddUpdateVender } from '../../hooks/useAddUpdateVender';

type Props = {
  page: number;
  nextSetItemTotal: any;
  setPage: Dispatch<SetStateAction<number>>;
};

const EditVender = ({ page, nextSetItemTotal, setPage }: Props) => {
  const venderStore = useVenderStore();
  const [venderData, setVenderData] = useState<TypeVender | undefined>(
    undefined
  );

  const [codType, setCodType] = useState<1 | 2>(2);
  const [branchs, setBranchs] =
    useState<TypeEditVenderReq['branches'][number][]>();
  const [accountManagerList, setAccountManagerList] = useState();
  const [isCreateNewBranch, setIsCreateNewBranch] = useState(false);

  const handleEditBranchClick = (item: TypeVender['branches'][number]) => {
    venderStore.setValue('isEditVenderBranchId', item.id);
    console.log(item.id);
  };

  const fetchVenderDetails = async () => {
    if (venderStore.isEditVenderId) {
      try {
        const res = await vendorService.getVendorDetails(
          venderStore.isEditVenderId!
        );

        setVenderData(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  async function fetchAccountManagerList() {
    try {
      const res = await getAccountManagerList(1, 1000, null);

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
    const loadFetchVenderDetails = async () => {
      await fetchVenderDetails();
      await fetchAccountManagerList();
    };
    loadFetchVenderDetails();
  }, []);

  const tableData = venderData?.branches.map((item) => {
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
    updateVenderDetailsForFromApi,
    isLoadingForm,
    handelUpdate,
  } = useAddUpdateVender(
    editVendorNameForm,
    editVendorBranchForm,
    venderData!,
    codType
  );

  useEffect(() => {
    if (venderData) {
      updateVenderDetailsForFromApi();
    }
  }, [
    venderData,
    venderStore.isEditVenderBranchId,
    venderStore.isEditVenderId,
  ]);

  const { register: vendorNameRegister } = editVendorNameForm;

  return (
    <>
      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        <div className="flex items-center justify-between gap-10 ">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Vendor Details
          </h2>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-center gap-1.5">
          <Button
            onClick={() => venderStore.setValue('isEditVenderId', undefined)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" /> Close
          </Button>
        </div>
      </div>

      <div className="space-y-4 w-full py-10 px-10">
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
        <Button
          type="button"
          onClick={() => setIsCreateNewBranch(true)}
          className="text-teal-500 font-semibold hover:underline"
        >
          ADD NEW BRANCH
        </Button>
      </div>

      {tableData?.length ? (
        <>
          <TableComponent
            data={tableData as any}
            page={page}
            setPage={setPage}
            nextSetItemTotal={nextSetItemTotal}
          />
          <Button
            onClick={() =>
              handelUpdate(
                'updateAll',
                isCreateNewBranch,
                setIsCreateNewBranch,
                fetchVenderDetails
              )
            }
            type="submit"
          >
            Update All
          </Button>
        </>
      ) : (
        <>no data</>
      )}

      {!isLoadingForm && (
        <Dialog open={!!venderStore.isEditVenderBranchId || isCreateNewBranch}>
          <DialogContent
            showCloseButton={false}
            className="sm:w-[min(90%,700px)] sm:max-w-full"
          >
            <DialogHeader>
              <DialogTitle>Update branch</DialogTitle>
              <DialogClose
                asChild
                onClick={() =>
                  venderStore.setValue('isEditVenderBranchId', undefined)
                }
              >
                <X />
              </DialogClose>
            </DialogHeader>

            <BranchEditForm form={editVendorBranchForm} />

            <DialogFooter>
              <Button
                onClick={() =>
                  handelUpdate(
                    'updateBranch',
                    isCreateNewBranch,
                    setIsCreateNewBranch,
                    fetchVenderDetails
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

export default EditVender;
