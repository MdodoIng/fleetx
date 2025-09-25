'use client';
import TableComponent from '@/features/vendor/components/list/TableComponent';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import SearchableSelect from '@/shared/components/selectors';
import DateSelect from '@/shared/components/selectors/DateSelect';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Table,
  TableLists,
  TableSingleList,
  TableSingleListContent,
  TableSingleListContentDetailsTitle,
  TableSingleListContents,
  TableSingleListContentTitle,
  TableSingleListHeader,
  TableSingleListHeaderLeft,
  TableSingleListHeaderRight,
} from '@/shared/components/ui/tableList';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { cn } from '@/shared/lib/utils';
import { paymentService } from '@/shared/services/payment';
import { vendorService } from '@/shared/services/vendor';
import {
  TypeManualPaymentHistoryReportRes,
  TypePayment,
} from '@/shared/types/payment';
import { useVendorStore } from '@/store';
import { format } from 'date-fns';
import {
  Axis3dIcon,
  CalendarIcon,
  Columns,
  Download,
  LucideProps,
  MagnetIcon,
  Notebook,
  ReceiptPoundSterling,
  Search,
  ServerCrash,
  Type,
  X,
} from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';

function ManualReport(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const [ordernNumber, setOrdernNumber] = useState('');

  const [isEditDetails, setIsEditDetails] = useState(false);

  const [searchOrder, setSearchOrder] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchDriver, setSearchDriver] = useState('');

  const [selectedSorting, setSelectedSorting] = useState<string | undefined>(
    undefined
  );

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>();

  const [date, setDate] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });
  const [data, setData] = useState<TypeManualPaymentHistoryReportRes['data']>(
    []
  );
  const [tableData, setTableData] = useState<
    Array<
      Array<{
        icon: React.ForwardRefExoticComponent<
          Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
        >;
        title: string;
        value: string | 'Credit' | 'Debit' | undefined;
      }>
    >
  >([]);
  const [paymentType, setPaymentType] =
    useState<(typeof TypePayment)[number]['id']>();
  const vendorStore = useVendorStore();

  const fetchPaymentHistoryReport = async () => {
    setIsLoading(true);
    try {
      const url = paymentService.getManualPaymentHistoryReportUrl(
        1,
        100,
        date?.from!,
        date?.to!,
        vendorStore.selectedVendor?.id!,
        vendorStore.selectedBranch?.id!,
        paymentType!
      );
      const res = await paymentService.getManualPaymentHistoryReport(url);
      console.log(res);

      setData(res.data!);
    } catch (err: any) {
      const errorMessage =
        err.error?.message ||
        err.message ||
        'An unknown error occurred while fetching wallet balance.';
      console.error('Error in fetchVendorWalletBalance:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialPaymentHistoryReport = async () => {
      await fetchPaymentHistoryReport();
    };
    loadInitialPaymentHistoryReport();
  }, [
    vendorStore.selectedVendor?.id,
    vendorStore.selectedBranch?.id,
    page,
    date?.from,
    date?.to,
    paymentType,
  ]);

  useEffect(() => {
    const fetchTableData = async () => {
      if (!data) return;
      const resolvedData = await Promise.all(
        data.map(async (item) => {
          const res = await vendorService.getBranchDetails(item.vendor_id);
          const branch = res.data?.find((x) => x.id === item?.branch_id);
          return [
            {
              icon: Columns,
              title: 'Create Date',
              value: formatDate(item.created_at),
            },
            {
              icon: Type,
              title: 'Type',
              value: TypePayment.find((i) => i.id === item.operation_type)
                ?.name,
            },
            { icon: ServerCrash, title: 'Amount', value: item.amount },
            {
              icon: ReceiptPoundSterling,
              title: 'Payment Id',
              value: item.id,
            },
            {
              icon: Axis3dIcon,
              title: 'Vendor',
              value: branch?.vendor.name || item.vendor_id,
            },
            {
              icon: MagnetIcon,
              title: 'Branch',
              value: branch?.name || item.branch_id,
            },
            {
              icon: Notebook,
              title: 'Note',
              value: item.note,
            },
          ];
        })
      );
      setTableData(resolvedData);
    };

    if (data) fetchTableData();
  }, [data]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'dd MMM yyyy hh:mm a');
  };

  const { exportOrdersToCSV } = useTableExport();

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderRight />
        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-sm:flex-wrap">
          <div className="relative max-sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0"
            />
          </div>
          <SearchableSelect
            options={TypePayment}
            value={paymentType}
            onChangeAction={setPaymentType}
          />

          <DateSelect value={date} onChangeAction={setDate} />
          <Button
            onClick={() =>
              exportOrdersToCSV(
                tableData,
                'manual_payment_history',
                `manual_payment_history_${date?.from ? format(date.from, 'yyyy-MM-dd') : ''}_${
                  date?.to ? format(date.to, 'yyyy-MM-dd') : ''
                }`
              )
            }
            className="max-sm:w-full"
          >
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      </DashboardHeader>
      <DashboardContent>
        {tableData?.length ? (
          <Table>
            <TableLists>
              {tableData.map((item, idx) => (
                <TableSingleList key={idx}>
            
                  <TableSingleListContents>
                    {item.map((itemSingle, singlIdx) => (
                      <TableSingleListContent key={singlIdx}>
                        <TableSingleListContentTitle>
                          <itemSingle.icon size={14} />
                          {itemSingle.title}
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle>
                          {itemSingle.value}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContent>
                    ))}
                  </TableSingleListContents>
                </TableSingleList>
              ))}
            </TableLists>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-full w-full text-muted-foreground">
            No data available
          </div>
        )}
      </DashboardContent>
    </Dashboard>
  );
}
export default ManualReport;
