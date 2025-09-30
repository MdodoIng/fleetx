'use client';
import { TableFallback } from '@/shared/components/fetch/fallback';
import LoadMore from '@/shared/components/fetch/LoadMore';
import NoData from '@/shared/components/fetch/NoData';
import SearchableSelect from '@/shared/components/selectors';
import DateSelect from '@/shared/components/selectors/DateSelect';
import { Button } from '@/shared/components/ui/button';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Input } from '@/shared/components/ui/input';
import {
  Table,
  TableLists,
  TableSingleList,
  TableSingleListContent,
  TableSingleListContentDetailsTitle,
  TableSingleListContents,
  TableSingleListContentTitle,
} from '@/shared/components/ui/tableList';
import useTableExport from '@/shared/lib/hooks/useTableExport';
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
  Columns,
  Download,
  LucideProps,
  MagnetIcon,
  Notebook,
  ReceiptPoundSterling,
  Search,
  ServerCrash,
  Type,
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

  const [isLoading, setIsLoading] = useState(true);
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
  const { vendorId, branchId } = useVendorStore();

  const fetchPaymentHistoryReport = async () => {
    try {
      const url = paymentService.getManualPaymentHistoryReportUrl(
        1,
        page,
        date?.from,
        date?.to,
        vendorId!,
        branchId!,
        paymentType!
      );
      const res = await paymentService.getManualPaymentHistoryReport(url);
      console.log(res);

      setData(res.data!);
      setNextSetItemTotal(res.count < page ? null : true);
    } catch (err: any) {
      const errorMessage =
        err.error?.message ||
        err.message ||
        'An unknown error occurred while fetching wallet balance.';
      console.error('Error in fetchVendorWalletBalance:', errorMessage);
    }
  };

  useEffect(() => {
    const loadInitialPaymentHistoryReport = async () => {
      await fetchPaymentHistoryReport();
    };
    loadInitialPaymentHistoryReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, branchId, page, date.from, date.to, paymentType]);

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
      setIsLoading(false);
    };

    if (data) fetchTableData();
  }, [data]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'dd MMM yyyy hh:mm a');
  };

  const { exportOrdersToCSV } = useTableExport();

  if (isLoading) return <TableFallback />;

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
              <LoadMore
                setPage={setPage}
                nextSetItemTotal={nextSetItemTotal}
                type="table"
              />
            </TableLists>
          </Table>
        ) : (
          <NoData />
        )}
      </DashboardContent>
    </Dashboard>
  );
}
export default ManualReport;
