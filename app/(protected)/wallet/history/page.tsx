'use client';
import {
  CalendarIcon,
  Download,
  Search,
  ListFilter,
  CreditCard,
  Clock,
  User,
  Phone,
  MapPin,
  DollarSign,
  Dot,
  User2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { useOrderStore } from '@/store/useOrderStore';
import { useVenderStore, useSharedStore } from '@/store';
import { Button } from '@/shared/components/ui/button';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { cn } from '@/shared/lib/utils';
import { reportService } from '@/shared/services/report';
import { TypeWalletTransactionHistoryRes } from '@/shared/types/report';
import { vendorService } from '@/shared/services/vender';
import { TypeBranch } from '@/shared/types/vender';
import {
  Dashboard,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useTranslations } from 'next-intl';
import {
  Table,
  TableLists,
  TableSigleList,
  TableSigleListContent,
  TableSigleListContentDetailsItem,
  TableSigleListContentDetailsTitle,
  TableSigleListContents,
  TableSigleListContentTitle,
  TableSigleListHeader,
  TableSigleListHeaderLeft,
  TableSigleListHeaderRight,
} from '@/shared/components/ui/tableList';
import { OperationType } from '@/shared/types/orders';
import { TypePayment } from '@/shared/types/payment';

export default function OrderTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const { appConstants } = useSharedStore();

  const [searchOrder, setSearchOrder] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<string | null>();

  const [date, setDate] = useState<{ from: Date; to: Date }>();

  const [walletHistory, setWalletHistory] = useState<
    (TypeWalletTransactionHistoryRes['data'][number] & {
      branch: TypeBranch | undefined;
    })[]
  >();
  const venderStore = useVenderStore();

  const fetchVendorWalletBalance = useCallback(async () => {
    try {
      const walletHistoryUrl = reportService.getWalletHistoryUrl(
        page,
        searchOrder,
        date?.from,
        date?.to,
        null
      );
      const walletHistoryRes =
        await reportService.getWalletHistory(walletHistoryUrl);

      const walletHistorydata = await Promise.all(
        walletHistoryRes.data.map(async (item) => {
          const branchRes = (
            await vendorService.getBranchDetails(item.vendor_id)
          ).data.find((x) => x.id === item.branch_id);
          return { ...item, branch: branchRes };
        })
      );
      setWalletHistory(walletHistorydata);
      setNextSetItemTotal(walletHistoryRes.NEXT_SET_ITEMS_TOKEN);
    } catch (err: unknown) {
      const errorMessage =
        (err as { error?: { message?: string }; message?: string }).error
          ?.message ||
        (err as { message?: string }).message ||
        'An unknown error occurred while fetching wallet balance.';
      console.error('Error in fetchVendorWalletBalance:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchOrder, date?.from, date?.to]);

  useEffect(() => {
    const loadInitialWalletBalance = async () => {
      await fetchVendorWalletBalance();
    };
    loadInitialWalletBalance();
  }, [fetchVendorWalletBalance]);

  const { exportOrdersToCSV } = useTableExport();

  const t = useTranslations();

  return (
    <Dashboard className="h-auto">
      <DashboardHeader>
        <DashboardHeaderRight />

        {/* Search and Filter */}
        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between">
          <div className="relative max-sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by Order No, Customer, Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0 "
            />
          </div>

          <div className="flex items-center justify-center gap-1.5  max-sm:w-full">
            <Select
              value={selectedFilter}
              onValueChange={(value) => setSelectedFilter(value)}
            >
              <SelectTrigger className="sm:w-[180px]  max-sm:w-full bg-white border-none relative pl-10">
                <ListFilter className="absolute left-3" />
                <SelectValue
                  placeholder="All Transactions"
                  className="text-dark-grey"
                >
                  {selectedFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Orders">All Transactions</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
                <SelectItem value="Debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 relative z-0 bg-white rounded-[8px]">
            <Popover>
              <PopoverTrigger
                asChild
                className="!ring-0 border-none text-dark-grey"
              >
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(' justify-start text-left font-normal')}
                >
                  <CalendarIcon className=" h-4 w-4" />
                  {date?.from ? (
                    date?.to ? (
                      <>
                        {format(date.from, 'PP')} - {format(date.to, 'PP')}
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
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              className={cn(
                date?.to
                  ? 'text-primary-blue cursor-pointer'
                  : 'pointer-events-none'
              )}
              onClick={() => console.log('Apply with:', date)}
            >
              Apply
            </Button>
          </div>

          <Button
            onClick={() =>
              exportOrdersToCSV(
                walletHistory!,
                'wallet history',
                `wallet history ${date?.from ? format(date.from, 'yyyy-MM-dd') : ''} - ${
                  date?.to ? format(date.to, 'yyyy-MM-dd') : ''
                }`
              )
            }
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      </DashboardHeader>

      {walletHistory?.length ? (
        <Table>
          <TableLists>
            {walletHistory.map((txn, idx) => {
              const isCredit = Number(txn.txn_amount) > 0;

              const operation_type = OperationType.find(
                (x) => x.key === txn?.operation_type
              );

              return (
                <TableSigleList key={idx}>
                  <TableSigleListHeader className="">
                    <TableSigleListHeaderRight>
                      <span className="font-semibold text-primary-blue flex">
                        {txn.txn_number}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-medium ${operation_type?.color}`}
                      >
                        {operation_type?.value}
                      </span>
                      {txn.branch && (
                        <span className="text-xs text-primary-teal flex items-center">
                          <Dot />
                          {txn.branch.name}
                        </span>
                      )}
                    </TableSigleListHeaderRight>
                    <TableSigleListHeaderLeft className="flex items-center gap-1">
                      <Clock size={12} />
                      {format(new Date(txn.txn_at), 'PPp')}
                    </TableSigleListHeaderLeft>
                  </TableSigleListHeader>
                  <TableSigleListContents>
                    <TableSigleListContent>
                      <TableSigleListContentTitle>
                        <User2 size={14} />
                        {t('component.features.wallet.user')}
                      </TableSigleListContentTitle>
                      <TableSigleListContentDetailsTitle>
                        {txn.branch?.vendor.name}
                      </TableSigleListContentDetailsTitle>
                    </TableSigleListContent>
                    <TableSigleListContent>
                      <TableSigleListContentTitle>
                        <DollarSign size={14} />
                        {t(
                          'component.features.orders.create.form.amount.default'
                        )}
                      </TableSigleListContentTitle>
                      <TableSigleListContentDetailsTitle
                        className={`${operation_type?.color.replaceAll('bg', 'text')}`}
                      >
                        {isCredit ? '+' : ''}
                        {txn.txn_amount} {appConstants?.currency}
                      </TableSigleListContentDetailsTitle>
                    </TableSigleListContent>
                    <TableSigleListContent>
                      <TableSigleListContentTitle>
                        <CreditCard size={14} />
                        {t('component.features.wallet.balence')}
                      </TableSigleListContentTitle>
                      <TableSigleListContentDetailsTitle>
                        {txn.balance.balance_amount} {appConstants?.currency}
                      </TableSigleListContentDetailsTitle>
                    </TableSigleListContent>
                  </TableSigleListContents>
                </TableSigleList>
              );
            })}
          </TableLists>
        </Table>
      ) : (
        <>no data</>
      )}
    </Dashboard>
  );
}
