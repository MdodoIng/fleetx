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
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type JSX } from 'react';
import page from '../../wallet/balance-report/page';

function VenderUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>(null);
  const { setValue, selectedBranch, selectedVendor, branchDetails } =
    useVenderStore();
  const [isCentralWallet, setIsCentralWallet] = useState(false);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [data, setData] = useState<TypeVendorUserList[] | undefined>(undefined);

  // Updated main function
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
  }, [page, selectedBranch?.id]);

  console.log(data, 'aeefeafsafaaf');

  const { exportOrdersToCSV } = useTableExport();

  const handleEditClick = (item: TypeVendorUserList) => {
    console.log(item);
  };

  const tableData = data?.map((item) => {
    return [
      {
        icon: User2,
        title: 'first_name',
        value: item.first_name,
      },
      {
        icon: User2,
        title: 'last_name',
        value: item.last_name,
      },
      {
        icon: Mail,
        title: 'Branch',
        value: item.email,
      },
      {
        icon: Phone,
        title: 'Phone',
        value: item.phone,
      },
      {
        icon: Axis3dIcon,
        title: 'Vendor',
        value: branchDetails?.find((x) => x.id === item.vendor.branch_id)?.vendor.name,
      },
      {
        icon: MagnetIcon,
        title: 'Branch',
        value: branchDetails?.find((x) => x.id === item.vendor.branch_id)?.name,
      },
      {
        icon: Edit,
        title: ' Action',
        value: <Edit />,
        onClick: () => handleEditClick(item),
      },
    ];
  });

  return (
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
              // onClick={() => exportOrdersToCSV(data!, 'balance-report', ``)}
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
  );
}

export default withAuth(VenderUser, [
  'OPERATION_MANAGER',
  'VENDOR_ACCOUNT_MANAGER',
  'SALES_HEAD',
]);
