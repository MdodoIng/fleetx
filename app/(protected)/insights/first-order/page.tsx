'use client';

import DateSelect from '@/shared/components/selectors/DateSelect';
import {
    Card,
    CardContent,
    CardDescription, CardTitle
} from '@/shared/components/ui/card';
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
import { RATE_REASONS_EN } from '@/shared/constants/storageConstants';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { cn } from '@/shared/lib/utils';
import { getFirstOrderInsight, getFirstOrderList } from '@/shared/services';
import { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

function FirstOrderInsights() {
  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedVendor, setSelectedVendor] = useState<string | undefined>();
  const [driverRating, setDriverRating] = useState<number>(0);
  const [insightTiles, setInsightTiles] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [page, setPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { exportOrdersToCSV } = useTableExport();

  const fetchInsights = useCallback(async () => {
    try {
      const res = await getFirstOrderInsight(date?.from, date?.to);

      setDriverRating(res.data?.avg_rating || 0);
      const tiles = RATE_REASONS_EN.map((reason) => {
        const match = res.data?.improvements?.find(
          (x) => x.improvement_type === reason.id
        );
        return {
          type: reason.name,
          count: match?.count || 0,
        };
      });
      setInsightTiles(tiles);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  }, [date?.from, date?.to]);

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getFirstOrderList(1, page, date?.from, date?.to);
      const transformed =
        res?.data?.map((item: any) => ({
          orderId: item.order_id,
          vendor: item.vendor_name,
          branch: item.branch_name,
          rating: item.rating?.toFixed(1),
          improvementType:
            RATE_REASONS_EN.find((r) => r.id === item.improvement_type)?.name ||
            '',
          orderNumbers: item.order_numbers?.join(', '),
        })) || [];
      setTableData(transformed);
      setTotalCount(res.count || 0);
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [date?.from, date?.to, page]);

  useEffect(() => {
    fetchInsights();
    fetchTableData();
  }, [fetchInsights, fetchTableData]);

  return (
    <Dashboard className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />

        <DateSelect value={date} onChangeAction={setDate} />
      </DashboardHeader>

      <DashboardContent className="flex-col w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <Card className="bg-primary-blue text-white relative">
            <CardContent className="justify-between flex flex-col h-full">
              <CardTitle className="">PICKUP RATING</CardTitle>

              <CardContent className="px-0">
                <CardDescription
                  className={cn('text-2xl font-medium text-white')}
                >
                  {driverRating?.toFixed(1) ?? '0.0'}
                </CardDescription>
              </CardContent>
            </CardContent>
          </Card>

          <div className="md:col-span-2 grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-4">
            {insightTiles.map((item, idx) => (
              <Card key={idx} className="py-4">
                <CardContent className="gap-6 flex flex-col px-4">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className={cn('text-sm opacity-70')}>
                      {item.type}
                    </CardTitle>
                  </div>
                  <CardContent className="px-0">
                    <CardDescription className={cn('text-2xl font-medium')}>
                      {item.count}
                    </CardDescription>
                  </CardContent>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Table */}
        {tableData.length > 0 ? (
          <Table>
            <TableLists>
              {tableData.map((item, idx) => (
                <TableSigleList key={idx}>
                  <TableSigleListContents>
                    <TableSigleListContent>
                      <TableSigleListContentTitle>
                        Order ID
                      </TableSigleListContentTitle>
                      <TableSigleListContentDetailsTitle>
                        {item.orderId}
                      </TableSigleListContentDetailsTitle>
                    </TableSigleListContent>
                    <TableSigleListContent>
                      <TableSigleListContentTitle>
                        Vendor
                      </TableSigleListContentTitle>
                      <TableSigleListContentDetailsTitle>
                        {item.vendor}
                      </TableSigleListContentDetailsTitle>
                    </TableSigleListContent>
                    <TableSigleListContent>
                      <TableSigleListContentTitle>
                        Branch
                      </TableSigleListContentTitle>
                      <TableSigleListContentDetailsTitle>
                        {item.branch}
                      </TableSigleListContentDetailsTitle>
                    </TableSigleListContent>
                    <TableSigleListContent>
                      <TableSigleListContentTitle>
                        Rating
                      </TableSigleListContentTitle>
                      <TableSigleListContentDetailsTitle>
                        {item.rating}
                      </TableSigleListContentDetailsTitle>
                    </TableSigleListContent>
                    <TableSigleListContent>
                      <TableSigleListContentTitle>
                        Improvement Type
                      </TableSigleListContentTitle>
                      <TableSigleListContentDetailsTitle>
                        {item.improvementType}
                      </TableSigleListContentDetailsTitle>
                    </TableSigleListContent>
                    <TableSigleListContent>
                      <TableSigleListContentTitle>
                        Order Numbers
                      </TableSigleListContentTitle>
                      <TableSigleListContentDetailsTitle>
                        {item.orderNumbers}
                      </TableSigleListContentDetailsTitle>
                    </TableSigleListContent>
                  </TableSigleListContents>
                </TableSigleList>
              ))}
            </TableLists>
          </Table>
        ) : (
          ''
        )}
      </DashboardContent>
    </Dashboard>
  );
}

export default FirstOrderInsights;
