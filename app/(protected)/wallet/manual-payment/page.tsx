'use client';
import TableComponent from '@/features/vendor/components/list/TableComponent';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
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
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { cn } from '@/shared/lib/utils';
import { paymentService } from '@/shared/services/payment';
import { vendorService } from '@/shared/services/vender';
import {
  TypeManualPaymentHistoryReportRes,
  TypePayment,
} from '@/shared/types/payment';
import { useVenderStore } from '@/store';
import { format } from 'date-fns';
import {
  Axis3dIcon,
  CalendarIcon,
  Columns,
  Download,
  MagnetIcon,
  Notebook,
  ReceiptPoundSterling,
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
  const [tableData, setTableData] = useState<any[]>([]);
  const [paymentType, setPaymentType] =
    useState<(typeof TypePayment)[number]['id']>();
  const venderStore = useVenderStore();

  const fetchPaymentHistoryReport = async () => {
    setIsLoading(true);
    try {
      const url = paymentService.getManualPaymentHistoryReportUrl(
        1,
        100,
        date?.from!,
        date?.to!,
        venderStore.selectedVendor?.id!,
        venderStore.selectedBranch?.id!,
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
    venderStore.selectedVendor?.id,
    venderStore.selectedBranch?.id,
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
    <div className="flex bg-gray-50 flex-col items-center overflow-hidden">
      {/* Left Panel - Orders List */}

      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        <div className="flex items-center justify-between gap-10 ">
          <Select
            value={String(paymentType)}
            onValueChange={(value) => setPaymentType(value as any)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent>
              {TypePayment.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
            {paymentType && (
              <span onClick={() => setPaymentType(undefined)} className="">
                <X />
              </span>
            )}
          </Select>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !date?.from && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date?.to ? (
                      <>
                        From {format(date.from, 'PP')} - To{' '}
                        {format(date.to, 'PP')}
                      </>
                    ) : (
                      format(date.from, 'PPP')
                    )
                  ) : (
                    <span>From Date - To Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 flex">
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  // @ts-ignore
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              className="text-primary"
              onClick={() => console.log('Apply with:', date)}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-center gap-1.5">
          <Button
            // onClick={() =>
            //   exportOrdersToCSV(
            //     data!,
            //     'wallet history',
            //     `wallet history ${date?.from ? format(date.from, 'yyyy-MM-dd') : ''} - ${
            //       date?.to ? format(date.to, 'yyyy-MM-dd') : ''
            //     }`
            //   )
            // }
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      </div>

      {data?.length ? (
        <TableComponent
          data={tableData}
          page={page}
          setPage={setPage}
          nextSetItemTotal={null}
        />
      ) : (
        <>no data</>
      )}
    </div>
  );
}
export default withAuth(ManualReport, ['FINANCE_MANAGER']);
