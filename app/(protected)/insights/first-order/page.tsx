'use client';

import React, { useState, useEffect } from 'react';
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
import { cn } from '@/shared/lib/utils';
import { reportService } from '@/shared/services/report';
import { format } from 'date-fns';
import { CalendarIcon, Download } from 'lucide-react';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import TableComponent from '@/features/vendor/components/list/TableComponent';
import { getFirstOrderInsight, getFirstOrderList } from '@/shared/services';
import { RATE_REASONS_EN } from '@/shared/constants/storageConstants';
import DateSelect from '@/shared/components/selectors/DateSelect';

function FirstOrderInsights() {
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>();
  const [selectedVendor, setSelectedVendor] = useState<string | undefined>();
  const [driverRating, setDriverRating] = useState<number>(0);
  const [insightTiles, setInsightTiles] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [page, setPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { exportOrdersToCSV } = useTableExport();

  const fetchInsights = async () => {
    try {
      const res = await getFirstOrderInsight(date?.from!, date?.to!);

      setDriverRating(res.data?.avg_rating || 0);
      const tiles = RATE_REASONS_EN.map((reason) => {
        const match = res.data?.improvements?.find(
          (x: any) => x.improvement_type === reason.id
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
  };

  const fetchTableData = async () => {
    setIsLoading(true);
    try {
      const res = await getFirstOrderList(1, page, date?.from!, date?.to!);
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
  };

  useEffect(() => {
    fetchInsights();
    fetchTableData();
  }, [date, selectedVendor, page]);

  return (
    <div className="flex flex-col gap-6 bg-gray-50 p-4">
      {/* Filters */}
      <DateSelect value={date} onChangeAction={setDate}  />

      {/* Rating Card + Insight Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#30d9c4] rounded-xl p-6 shadow-lg text-white relative">
          <img
            src="/images/star.svg"
            className="absolute top-4 left-4 w-12 h-12"
          />
          <h3 className="text-2xl font-bold tracking-widest">
            PICKUP <span className="font-light">RATING</span>
          </h3>
          <div className="bg-white text-[#30d9c4] text-xl font-bold rounded-md mt-4 px-6 py-2 text-center">
            {driverRating?.toFixed(1) ?? '0.0'}
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {insightTiles.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-4 text-center"
            >
              <span className="text-[48px] font-bold text-[#30d9c4] block">
                {item.count}
              </span>
              <span className="text-[14px] font-semibold text-[#30d9c4] mt-2 block">
                {item.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      {tableData.length > 0 ? (
        <TableComponent
          data={tableData}
          page={page}
          setPage={setPage}
          total={totalCount}
        />
      ) : (
        <div className="text-center text-gray-500 mt-10">
          <img src="/images/nodata.png" className="mx-auto mb-4 w-24" />
          <p>Whoops! No data found</p>
        </div>
      )}
    </div>
  );
}

export default FirstOrderInsights;
