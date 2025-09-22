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
  TypeVender,
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
  LucideProps,
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
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useEffect,
  useState,
  type JSX,
} from 'react';
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
import { useSearchParams } from 'next/navigation';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import {
  Table,
  TableLists,
  TableSigleList,
  TableSigleListContent,
  TableSigleListContentDetailsTitle,
  TableSigleListContents,
  TableSigleListContentTitle,
} from '@/shared/components/ui/tableList';

function VenderUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState(null);
  const {
    setValue,
    selectedBranch,
    selectedVendor,
    isEditUser,
    venderList,
    branchDetails,
  } = useVenderStore();

  const [searchValue, setSearchValue] = useState<string>('');
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
  const [tableData, setTableData] = useState<
    {
      icon: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
      >;
      title: string;
      value: string;
      onClick?: () => void;
    }[][]
  >([]);
  const [frist, setFrist] = useState(true);
  const searchParams = useSearchParams();

  const search = searchParams.get('id');

  const fetchVendorUserList = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const res = await vendorService.getVendorUserList(
        page,
        frist ? (search ? searchValue : searchValue) : searchValue,
        selectedVendor?.id,
        selectedBranch?.id
      );
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setFrist(false);
    }
  }, [
    page,
    frist,
    search,
    searchValue,
    selectedVendor?.id,
    selectedBranch?.id,
  ]);

  useEffect(() => {
    const loadFetchVendorUserList = async () => {
      await fetchVendorUserList();
    };
    loadFetchVendorUserList();
  }, [fetchVendorUserList]);

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
      setTableData(resolvedData!);
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
      isAdd: isAdd,
      setIsAddAction: setIsAddAction,
    });

  useEffect(() => {
    if (isEditUser) {
      updateUserDetailsForFromApi();
    }
  }, [isEditUser]);

  console.log(isEditUser?.vendor.user);

  return (
    <Dashboard className="">
      <DashboardHeader>
        <DashboardHeaderRight />
        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-sm:flex-wrap">
          <div className="relative max-sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={'Search Vender'}
              value={searchValue!}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0 "
            />
          </div>
          <Button onClick={() => handleAddClick()}>
            <PlusSquare className="w-5 h-5" /> Add User
          </Button>
        </div>
      </DashboardHeader>
      <DashboardContent className="relative z-0 flex-col">
        {tableData?.length ? (
          <Table>
            <TableLists>
              {tableData.map((item, idx) => (
                <TableSigleList key={idx}>
                  <TableSigleListContents>
                    {item.map((i, listIdx) => (
                      <TableSigleListContent key={listIdx}>
                        <TableSigleListContentTitle>
                          <i.icon size={14} />
                          {i.title}
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle
                          className="line-clamp-2"
                          onClick={i.onClick ? () => i.onClick!() : undefined}
                        >
                          {i.value}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                    ))}
                  </TableSigleListContents>
                </TableSigleList>
              ))}
            </TableLists>
          </Table>
        ) : (
          ''
        )}

        {!isLoadingForm && (
          <Dialog open={!!isEditUser || isAdd}>
            <DialogContent
              closeButtonOnClick={() => {
                setValue('isEditUser', undefined);
                setIsAddAction(false);
              }}
              className="sm:w-[min(90%,700px)] sm:max-w-full"
            >
              <DialogHeader>
                <DialogTitle>
                  {' '}
                  {!!isEditUser ? 'Update User' : 'Create User'}
                </DialogTitle>
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
      </DashboardContent>
    </Dashboard>
  );
}

export default VenderUser;
