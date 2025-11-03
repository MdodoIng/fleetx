'use client';

import { TableFallback } from '@/shared/components/fetch/fallback';
import NoData from '@/shared/components/fetch/NoData';
import SearchableSelect, {
  TypeSearchableSelectOption,
} from '@/shared/components/selectors';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { orderService } from '@/shared/services/orders';
import { reportService } from '@/shared/services/report';
import { TypeZoneData } from '@/shared/types/orders';
import { TypeZoneGrowth } from '@/shared/types/report';
import { useCallback, useEffect, useState } from 'react';

export default function ZoneGrowthPage() {
  const [zoneList, setZoneList] = useState<TypeZoneData[]>([]);
  const [growthData, setGrowthData] = useState<TypeZoneGrowth[]>([]);
  const [selectedZone, setSelectedZone] = useState<number | undefined>(
    undefined
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch zones
  useEffect(() => {
    async function loadZones() {
      try {
        const zones = await orderService.getZone();
        setZoneList(zones.data || []);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch zones';
        console.error('Error fetching zones:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    loadZones();
  }, []);

  const fetchGrowth = useCallback(async () => {
    if (!selectedYear) {
      return;
    }

    try {
      const data = await reportService.getZoneGrowth(
        selectedZone!,
        selectedYear
      );
      setGrowthData(data.data || []);
    } catch (err: any) {
      // Consider a more specific error type if possible
      const errorMessage = err.message || 'Failed to fetch growth data';
      console.error('Error fetching growth data:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedZone, selectedYear]);

  // Fetch growth data
  useEffect(() => {
    async function loadGrowth() {
      await fetchGrowth();
    }
    loadGrowth();
  }, [fetchGrowth]);

  // Map zones to searchable select options
  const searchZoneOption: TypeSearchableSelectOption[] =
    zoneList?.map((item) => ({
      id: String(item.id), // Convert to string for SearchableSelect
      name: item.region_name,
    })) || [];

  // Generate year options (2020 to current year)
  const currentYear = new Date().getFullYear();
  const searchYearOption: TypeSearchableSelectOption[] = Array.from(
    { length: currentYear - 2010 + 1 },
    (_, i) => currentYear - i
  ).map((year) => ({
    id: String(year), // Convert to string for SearchableSelect
    name: String(year),
  }));

  // Sort growth data by month
  const orderData = growthData?.sort((a, b) => a.month - b.month);

  // Month names mapping
  const monthNames: Record<number, string> = {
    0: '',
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  if (isLoading) return <TableFallback />;

  return (
    <Dashboard className="h-auto">
      <DashboardHeader>
        <DashboardHeaderRight />
        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-sm:flex-wrap">
          <SearchableSelect
            onChangeAction={(value) =>
              setSelectedZone(value ? Number(value) : undefined)
            }
            options={searchZoneOption}
            placeholder="Select Zone"
            value={String(selectedZone)}
            classNameFroInput="border-none"
          />
          <SearchableSelect
            onChangeAction={setSelectedYear}
            options={searchYearOption}
            placeholder="Select Year"
            value={String(selectedYear)}
            classNameFroInput="border-none"
          />
        </div>
      </DashboardHeader>
      <DashboardContent className="flex-col w-full items-center">
        {orderData && orderData.length > 0 ? (
          <Card className="w-full">
            <CardContent>
              <Table className="w-full overflow-x-auto">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Month</TableHead>
                    <TableHead>Total Branches</TableHead>
                    <TableHead>Retained</TableHead>
                    <TableHead>Non Retained</TableHead>
                    <TableHead>Not Ordered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderData.map((row, idx) => (
                    <TableRow
                      key={row.month}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <TableCell>{monthNames[row.month]}</TableCell>
                      <TableCell>{row.all_branches_count}</TableCell>
                      <TableCell>{row.active_branches_count}</TableCell>
                      <TableCell>{row.inactive_branches_count}</TableCell>
                      <TableCell>{row.not_ordered_branches_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <NoData />
        )}
      </DashboardContent>
    </Dashboard>
  );
}
