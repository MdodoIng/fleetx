'use client';

import { useEffect, useState, useCallback } from 'react';
import DateSelect from '@/shared/components/selectors/DateSelect';
import {
  Table,
  TableLists,
  TableSingleList,
  TableSingleListHeader,
  TableSingleListHeaderLeft,
  TableSingleListHeaderRight,
  TableSingleListContents,
  TableSingleListContent,
  TableSingleListContentTitle,
  TableSingleListContentDetailsTitle,
} from '@/shared/components/ui/tableList';
import NoData from '@/shared/components/fetch/NoData';
import LoadMore from '@/shared/components/fetch/LoadMore';
import { TableFallback } from '@/shared/components/fetch/fallback';
import { configService } from '@/shared/services/config';
import { DateRange } from 'react-day-picker';
import ZoneSelect from '@/shared/components/selectors/ZoneSelect';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Badge } from '@/shared/components/ui/badge';

type BusyModeItem = {
  id: string;
  zone_name: string;
  warned_at: string;
  activated_at: string;
  expired_at: string;
  is_revoked: boolean;
  active: boolean;
  activated_by: string;
  duration: string;
  actual_duration: string;
  mode_type: string;
};

export default function ZoneBusyModeHistory() {
  const [zoneList, setZoneList] = useState<
    { id: string; region_name: string }[]
  >([]);
  const [selectedZone, setSelectedZone] = useState<string>();
  const [date, setDate] = useState<DateRange>();
  const [busyModeList, setBusyModeList] = useState<BusyModeItem[]>([]);
  const [totalActualDuration, setTotalActualDuration] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(10);
  const [nextSetItemsToken, setNextSetItemsToken] = useState<any>();
  const [totalCount, setTotalCount] = useState(0);

  const fetchHistory = useCallback(async () => {
    const url = configService.getZoneBusyModeHistoryUrl(
      1,
      page,
      selectedZone,
      date?.from,
      date?.to
    );

    try {
      const res = await configService.getOnlyZoneBusyModeHistory(url);

      console.log(res);

      const dataList = res.data.data || [];
      setBusyModeList(dataList);
      setTotalCount(res.data.count || 0);
      setNextSetItemsToken(dataList.length < page ? null : true);
      calculateTotalDuration(dataList);
    } catch (error) {
      console.error('Error fetching history:', error);
      // Optionally show a user-facing error message here
    } finally {
      setIsLoading(false);
    }
  }, [date?.from, date?.to, page, selectedZone]);

  const calculateTotalDuration = (list: BusyModeItem[]) => {
    let totalMins = 0;
    list.forEach((x) => {
      const [h, m] = x.actual_duration.split(':').map(Number);
      totalMins += h * 60 + m;
    });
    const hours = Math.floor(totalMins / 60);
    const minutes = totalMins % 60;
    setTotalActualDuration(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    );
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (isLoading) return <TableFallback />;

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderRight>
          <Badge hidden={!!totalActualDuration}>
            Total Duration: {totalActualDuration}
          </Badge>
        </DashboardHeaderRight>
        <div className="flex flex-wrap gap-4 items-end">
          <ZoneSelect value={selectedZone} onChangeAction={setSelectedZone} />
          <DateSelect value={date} onChangeAction={setDate} />
        </div>
      </DashboardHeader>

      <DashboardContent>
        {busyModeList.length > 0 ? (
          <Table>
            <TableLists>
              {busyModeList.map((value, idx) => (
                <TableSingleList key={idx}>
                  <TableSingleListHeader>
                    <TableSingleListHeaderLeft>
                      <span className="text-sm font-medium text-primary-blue">
                        Zone: {value.zone_name} | Warned At:{' '}
                        {new Date(value.warned_at).toLocaleString()}
                      </span>
                    </TableSingleListHeaderLeft>
                    <TableSingleListHeaderRight>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          value.active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {value.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableSingleListHeaderRight>
                  </TableSingleListHeader>

                  <TableSingleListContents>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Activated At
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {new Date(value.activated_at).toLocaleString()}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Expired At
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {new Date(value.expired_at).toLocaleString()}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Revoked
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {value.is_revoked ? 'Yes' : 'No'}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Activated By
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {value.activated_by}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Duration
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {value.duration}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Actual Duration
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {value.actual_duration}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        Mode Type
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {value.mode_type}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
                  </TableSingleListContents>
                </TableSingleList>
              ))}
              <LoadMore
                setPage={setPage}
                nextSetItemTotal={nextSetItemsToken}
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
