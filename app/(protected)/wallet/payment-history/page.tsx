'use client';

import Export from '@/shared/components/Export';
import { TableFallback } from '@/shared/components/fetch/fallback';
import LoadMore from '@/shared/components/fetch/LoadMore';
import NoData from '@/shared/components/fetch/NoData';
import DateSelect from '@/shared/components/selectors/DateSelect';
import VendorSelector from '@/shared/components/selectors/VendorSelector';
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
  TableSingleListContentDetailsItem,
  TableSingleListContentDetailsTitle,
  TableSingleListContents,
  TableSingleListContentTitle,
  TableSingleListHeader,
  TableSingleListHeaderLeft,
  TableSingleListHeaderRight,
} from '@/shared/components/ui/tableList';
import { paymentService } from '@/shared/services/payment';
import { vendorService } from '@/shared/services/vendor';
import { TypeManualPaymentHistoryReportRes } from '@/shared/types/payment';
import { format } from 'date-fns';
import {
  Axis3dIcon,
  Columns,
  MagnetIcon,
  Notebook,
  ReceiptPoundSterling,
  Search,
  ServerCrash,
  Type,
} from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';
import { DateRange } from 'react-day-picker';

function PaymentHistory(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string | undefined>(
    undefined
  );
  const [invoicePaymentId, setInvoicePaymentId] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>();
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });
  const [data, setData] = useState<TypeManualPaymentHistoryReportRes['data']>(
    []
  );
  const [tableData, setTableData] = useState<any[]>([]);

  // Fetch payment history data
  const fetchPaymentHistoryReport = async () => {
    try {
      const url = paymentService.getPaymentHistoryReportUrl(
        1,
        page,
        date.from!,
        date.to!,
        invoicePaymentId!,
        selectedVendor!
      );
      const res = await paymentService.getPaymentHistoryReport(url);
      setData(res.data || []);
      setNextSetItemTotal(res.count! < page ? null : true);
    } catch (err: any) {
      const errorMessage =
        err.error?.message ||
        err.message ||
        'An unknown error occurred while fetching payment history.';
      console.error('Error in fetchPaymentHistoryReport:', errorMessage);
    }
  };

  // Effect to fetch payment history on mount and when dependencies change
  useEffect(() => {
    fetchPaymentHistoryReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, date.from, date.to, selectedVendor, invoicePaymentId]);

  // Transform data for table display
  useEffect(() => {
    const fetchTableData = async () => {
      if (!data) return;
      const resolvedData = await Promise.all(
        data.map(async (item: any) => {
          const res = await vendorService.getBranchDetails(item.vendor_id);
          const branch = res.data?.find((x: any) => x.id === item?.branch_id);
          return {
            vendor:
              item.payment_meta?.vendor_name || branch?.vendor.name || 'N/A',
            branch:
              item.branch_payment[0]?.payment_meta?.branch_name ||
              branch?.name ||
              'N/A',
            paymentId: item.payment_id || 'N/A',
            invoiceId: item.invoice_id || 'N/A',
            invoiceReference: item.invoice_reference || 'N/A',
            transactionDate: (() => {
              let transactionDate: string | undefined;
              item?.success_response?.Data?.InvoiceTransactions?.forEach(
                (x: any) => {
                  if (x.TransactionStatus === 'Success') {
                    transactionDate = x?.TransactionDate;
                  }
                }
              );
              return transactionDate
                ? format(new Date(transactionDate), 'dd MMM yyyy hh:mm a')
                : 'N/A';
            })(),
            paymentGateway: (() => {
              let paymentGateway: string | undefined;
              item?.success_response?.Data?.InvoiceTransactions?.forEach(
                (x: any) => {
                  paymentGateway = x?.PaymentGateway;
                }
              );
              return paymentGateway || 'N/A';
            })(),
            customer: item.customer_email || 'N/A',
            customerRef: item.customer_ref || 'N/A',
            amount: item.amount || 'N/A',
          };
        })
      );
      setTableData(resolvedData);

      setIsLoading(false);
    };

    if (data) fetchTableData();
  }, [data]);

  if (isLoading) return <TableFallback />;

  return (
    <Dashboard className="h-auto">
      <DashboardHeader>
        <DashboardHeaderRight />
        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-sm:flex-wrap">
          <div className="relative max-sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0"
            />
          </div>

          <div className="relative max-sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Invoice Payment Id"
              value={invoicePaymentId}
              onChange={(e) => setInvoicePaymentId(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0"
            />
          </div>

          <VendorSelector
            classNameFroInput="border-none"
            selectedVendorValue={selectedVendor}
            handleChangeVendor={setSelectedVendor}
          />

          <DateSelect value={date} onChangeAction={setDate} />
          <Export data={tableData!} title="payment_history" exclude={[]} />
        </div>
      </DashboardHeader>
      <DashboardContent>
        {tableData?.length ? (
          <Table>
            <TableLists>
              {tableData.map((item, idx) => (
                <TableSingleList key={idx}>
                  <TableSingleListHeader>
                    <TableSingleListHeaderRight>
                      <span className="font-semibold text-primary-blue">
                        Payment ID: {item.paymentId}
                      </span>
                      <span className="text-xs text-primary-teal flex items-center">
                        <ReceiptPoundSterling size={12} />
                        {item.invoiceReference}
                      </span>
                    </TableSingleListHeaderRight>
                    <TableSingleListHeaderLeft>
                      <div className="flex items-center gap-1">
                        <Columns size={12} />
                        {item.transactionDate}
                      </div>
                    </TableSingleListHeaderLeft>
                  </TableSingleListHeader>
                  <TableSingleListContents>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <Axis3dIcon size={14} />
                        Vendor
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.vendor}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <MagnetIcon size={14} />
                        Branch
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.branch}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <ReceiptPoundSterling size={14} />
                        Invoice ID
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.invoiceId}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <Type size={14} />
                        Gateway
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.paymentGateway}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <Notebook size={14} />
                        Customer
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.customer}
                      </TableSingleListContentDetailsTitle>
                      <TableSingleListContentDetailsItem>
                        {item.customerRef}
                      </TableSingleListContentDetailsItem>
                    </TableSingleListContent>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <ServerCrash size={14} />
                        Amount
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.amount}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
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

export default PaymentHistory;
