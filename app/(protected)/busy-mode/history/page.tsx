'use client';

import Export from '@/shared/components/Export';
import { TableFallback } from '@/shared/components/fetch/fallback';
import LoadMore from '@/shared/components/fetch/LoadMore';
import NoData from '@/shared/components/fetch/NoData';
import DateSelect from '@/shared/components/selectors/DateSelect';
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
  TableSingleListContents,
  TableSingleListContentTitle,
  TableSingleListHeader,
  TableSingleListHeaderLeft,
  TableSingleListHeaderRight,
} from '@/shared/components/ui/tableList';
import { configService } from '@/shared/services/config';
import { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

export default function BusyModeHistoryDashboard() {
  const [data, setData] = useState<TypeBusyModeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(10);

  const [date, setDate] = useState<DateRange>();
  const [nextSetItemsToken, setNextSetItemsToken] = useState<any>();

  const fetchBusyModeHistory = useCallback(async () => {
    try {
      const url = configService.getBusyModeHistoryUrl(
        1,
        page,
        date?.from,
        date?.to
      );
      const res = await configService.getBusyModeHistory(url);
      if (res.data) {
        setData(res.data);
      }
      setNextSetItemsToken(res.data?.length < page ? null : true);
    } catch (err) {
      console.error('Error fetching busy mode history', err);
    } finally {
      setIsLoading(false);
    }
  }, [date?.from, date?.to, page]);

  useEffect(() => {
    fetchBusyModeHistory();
  }, [fetchBusyModeHistory]);

  if (isLoading) return <TableFallback />;

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderRight />
        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-md:flex-wrap">
          {/* Date Filters */}
          <DateSelect value={date} onChangeAction={setDate} />

          <Export data={data} title="Busy mode history" />
        </div>
      </DashboardHeader>
      <DashboardContent>
        {data?.length ? (
          <Table>
            <TableLists>
              {data.map((item, idx) => (
                <TableSingleList key={idx}>
                  <TableSingleListHeader>
                    <TableSingleListHeaderLeft>
                      <span className="text-sm font-medium text-primary-blue">
                        Warned At: {new Date(item.warned_at!).toLocaleString()}
                      </span>
                    </TableSingleListHeaderLeft>
                    <TableSingleListHeaderRight>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          item.active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {item.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableSingleListHeaderRight>
                  </TableSingleListHeader>

                  <TableSingleListContents>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Activated At
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {new Date(item.activated_at!).toLocaleString()}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Expired At
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {new Date(item.expired_at!).toLocaleString()}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Reason
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.reason}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Duration
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.duration}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Drivers
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        Busy: {item.busy_drivers_count}, Free:{' '}
                        {item.free_drivers_count}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Mode Type
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.mode_type}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
                  </TableSingleListContents>
                </TableSingleList>
              ))}
              <LoadMore
                setPage={setPage}
                nextSetItemTotal={nextSetItemsToken!}
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
