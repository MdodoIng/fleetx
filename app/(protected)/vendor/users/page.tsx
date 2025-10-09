'use client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { vendorService } from '@/shared/services/vendor';
import {
  TypeBranch,
  TypeVendor,
  TypeVendorListItem,
  TypeVendorUserList,
} from '@/shared/types/vendor';
import { useVendorStore } from '@/store';
import {
  Axis3dIcon,
  Edit,
  LucideProps,
  MagnetIcon,
  Mail,
  Phone,
  PlusSquare,
  Search,
  User2,
} from 'lucide-react';
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Dialog,
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
  TableSingleList,
  TableSingleListContent,
  TableSingleListContentDetailsTitle,
  TableSingleListContentTitle,
  TableSingleListContents,
} from '@/shared/components/ui/tableList';
import { TableFallback } from '@/shared/components/fetch/fallback';
import LoadMore from '@/shared/components/fetch/LoadMore';

function VendorUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>(null);
  const {
    setValue,
    selectedBranch,
    selectedVendor,
    isEditUser,
    vendorList: vendorList,
    branchDetails,
  } = useVendorStore();

  const [searchValue, setSearchValue] = useState<string>('');
  const [data, setData] = useState<TypeVendorUserList[] | undefined>(undefined);
  const [isBranch, setIsBranchAction] = useState<
    | {
        branch: TypeBranch;
        vendor: TypeVendorListItem | TypeVendor;
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
  const [first, setFirst] = useState(true);
  const searchParams = useSearchParams();

  const search = searchParams.get('id');

  const fetchVendorUserList = useCallback(async (): Promise<void> => {
    try {
      const res = await vendorService.getVendorUserList(
        page,
        first ? (search ? searchValue : searchValue) : searchValue,
        selectedVendor?.id,
        selectedBranch?.id
      );
      setData(res.data);
      setNextSetItemTotal(res.data.length < page ? null : true);
    } catch (error) {
      console.log(error);
    } finally {
      setFirst(false);
    }
  }, [
    page,
    first,
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
    const vendor = vendorList?.find((r) => r.id === item.vendor.vendor_id);
    if (vendor) {
      setIsBranchAction({
        vendor: vendor!,
        branch: branch!,
      });
    }
    if (!branch) {
      const branch = branchDetails?.find((r) => r.id === item.vendor.branch_id);
      setIsBranchAction({
        branch: branch!,
        vendor: vendor!,
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
      // @ts-ignore
      setTableData(resolvedData);
      setIsLoading(false);
    };

    if (data) fetchTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const { isLoadingForm, updateUserDetailsForFromApi, handleSubmit } =
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditUser]);

  if (isLoading) return <TableFallback />;

  return (
    <Dashboard className="">
      <DashboardHeader>
        <DashboardHeaderRight />
        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-sm:flex-wrap">
          <div className="relative max-sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={'Search Vendor'}
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
                          onClick={i.onClick ? () => i.onClick!() : undefined}
                        >
                          {i.value}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContent>
                    ))}
                  </TableSingleListContents>
                </TableSingleList>
              ))}
              <LoadMore
                setPage={setPage}
                nextSetItemTotal={nextSetItemTotal}
                type="table"
              />
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
                  onClick={async () => await handleSubmit(fetchVendorUserList)}
                  type="submit"
                >
                  {isAdd ? 'Create Branch' : 'Update Branch'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DashboardContent>
    </Dashboard>
  );
}

export default VendorUser;
