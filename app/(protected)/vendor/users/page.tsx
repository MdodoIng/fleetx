'use client';
import EditVender from '@/features/vendor/components/list/EditVender';
import VendersList from '@/features/vendor/components/list/VendersList';
import TableComponent from '@/features/vendor/components/list/TableComponent';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { vendorService } from '@/shared/services/vender';
import {
  TypeBranch,
  TypeVenderList,
  TypeVenderListItem,
  TypeVendorUserList,
} from '@/shared/types/vender';
import { useVenderStore } from '@/store';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Activity,
  Axis3dIcon,
  Download,
  Edit,
  GitBranch,
  MagnetIcon,
  Mail,
  Minus,
  Phone,
  PlusSquare,
  Search,
  User,
  User2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type JSX } from 'react';
import page from '../../wallet/balance-report/page';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import EditAddForm from '@/features/vendor/components/users/EditAddForm';
import { useForm } from 'react-hook-form';
import {
  editUserSchema,
  TypeEditUserSchema,
} from '@/features/vendor/validations/editAddForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEditAddUser } from '@/features/vendor/hooks/useEditAddUser';

function VenderUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>(null);
  const {
    setValue,
    selectedBranch,
    selectedVendor,
    isEditUser,
    venderList,
    branchDetails,
  } = useVenderStore();

  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [data, setData] = useState<TypeVendorUserList[] | undefined>(undefined);
  const [isBranch, setIsBranchAction] = useState<
    | {
        branch: TypeBranch;
        vendor: TypeVenderListItem;
      }
    | undefined
  >({
    branch: selectedBranch!,
    vendor: selectedVendor!,
  });
  const [isAdd, setIsAddAction] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);

  const fetchVendorUserList = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const res = await vendorService.getVendorUserList(
        page,
        searchValue,
        selectedVendor?.id,
        selectedBranch?.id
      );
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadFetchVendorUserList = async () => {
      await fetchVendorUserList();
    };
    loadFetchVendorUserList();
  }, [selectedBranch?.id, page]);

  const handleEditClick = async (
    item: TypeVendorUserList,
    branch: TypeBranch | undefined
  ) => {
    setIsBranchAction(undefined);
    const vender = venderList?.find((r) => r.id === item.vendor.vendor_id);
    setIsBranchAction({
      vendor: vender!,
      branch: branch!,
    });
    if (!branch) {
      const branch = branchDetails?.find((r) => r.id === item.vendor.branch_id);
      setIsBranchAction({
        branch: branch!,
        vendor: vender!,
      });
    }
    setValue('isEditUser', item);
  };

  const handleAddClick = () => {
    editUserForm.clearErrors();
    editUserForm.reset();
    setIsAddAction(true);
  };

  useEffect(() => {
    const fetchTableData = async () => {
      if (!data) return;
      const resolvedData = await Promise.all(
        data.map(async (item) => {
          const res = await vendorService.getBranchDetails(
            item.vendor.vendor_id!
          );
          const branch = res.data?.find((x) => x.id === item.vendor.branch_id);
          return [
            { icon: User2, title: 'first_name', value: item.first_name },
            { icon: User2, title: 'last_name', value: item.last_name },
            { icon: Mail, title: 'Branch', value: item.email },
            { icon: Phone, title: 'Phone', value: item.phone },
            {
              icon: Axis3dIcon,
              title: 'Vendor',
              value: branch?.vendor.name || item.vendor.vendor_id,
            },
            {
              icon: MagnetIcon,
              title: 'Branch',
              value: branch?.name || item.vendor.branch_id,
            },
            {
              icon: Edit,
              title: 'Action',
              value: <Edit />,
              onClick: () => handleEditClick(item, branch),
            },
          ];
        })
      );
      setTableData(resolvedData);
    };

    if (data) fetchTableData();
  }, [data]);
  const editUserForm = useForm<TypeEditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const { isLoadingForm, updateUserDetailsForFromApi, handelSumbit } =
    useEditAddUser({
      editUserForm,
      data: data!,
      isBranch,
      setIsBranchAction,
      isAdd,
      setIsAddAction,
    });

  useEffect(() => {
    if (isEditUser) {
      updateUserDetailsForFromApi();
    }
  }, [isEditUser]);

  console.log(isEditUser?.vendor.user);

  return (
    <>
      <div className="flex bg-gray-50 flex-col items-center overflow-hidden">
        <>
          <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
            <div className="flex items-center justify-between gap-10 ">
              <div className="flex items-center justify-center gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button
                    onClick={async () => await fetchVendorUserList()}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Search className="w-5 h-5" /> Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center justify-center gap-1.5">
              <Button
                onClick={() => handleAddClick()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <PlusSquare className="w-5 h-5" /> Add User
              </Button>
            </div>
          </div>

          {tableData?.length ? (
            <TableComponent
              data={tableData as any}
              page={page}
              setPage={setPage}
              nextSetItemTotal={nextSetItemTotal}
            />
          ) : (
            <>no data</>
          )}
        </>
      </div>
      {!isLoadingForm && (
        <Dialog open={!!isEditUser || isAdd}>
          <DialogContent
            showCloseButton={false}
            className="sm:w-[min(90%,700px)] sm:max-w-full"
          >
            <DialogHeader>
              <DialogTitle>
                {' '}
                {!!isEditUser ? 'Update User' : 'Create User'}
              </DialogTitle>
              <DialogClose
                asChild
                onClick={() => {
                  setValue('isEditUser', undefined);
                  setIsAddAction(false);
                }}
              >
                <X />
              </DialogClose>
            </DialogHeader>

            <EditAddForm
              form={editUserForm}
              isBranch={isBranch!}
              setIsBranchAction={setIsBranchAction}
            />

            <DialogFooter>
              <Button
                onClick={async () => await handelSumbit(fetchVendorUserList)}
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
}

export default VenderUser;
