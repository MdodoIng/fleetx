'use client';

import ZoneGrowthFilter from '@/features/insights/components/zone-growth/ZoneGrowthFilter';
import ZoneGrowthTable from '@/features/insights/components/zone-growth/ZoneGrowthTable';
import SearchableSelect, {
  TypeSearchableSelectOption,
} from '@/shared/components/selectors';
import DateSelect from '@/shared/components/selectors/DateSelect';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '@/shared/components/ui/table';
import { orderService } from '@/shared/services/orders';
import { reportService } from '@/shared/services/report';
import { TypeZoneData } from '@/shared/types/orders';
import { TypeZoneGrowth } from '@/shared/types/report';

import { useState, useEffect } from 'react';

export default function ZoneGrowthPage() {
  const [zoneList, setZoneList] = useState<TypeZoneData[]>();
  const [growthData, setGrowthData] = useState<TypeZoneGrowth[]>();
  const [selectedZone, setSelectedZone] = useState<string>();
  const [selectedYear, setSelectedYear] = useState<string>();

  useEffect(() => {
    async function loadZones() {
      const zones = await orderService.getZone();
      setZoneList(zones.data);
    }
    loadZones();
  }, []);

  useEffect(() => {
    async function loadGrowth() {
      const data = await reportService.getZoneGrowth(
        selectedZone!,
        selectedYear
      );
      setGrowthData(data.data!);
    }
    loadGrowth();
  }, [selectedZone, selectedYear]);

  const searchZoneOption: TypeSearchableSelectOption[] =
    zoneList?.map((item) => ({
      id: item.id,
      name: item.region_name,
    })) || [];

  const current = new Date().getFullYear();
  const searchYearOption: TypeSearchableSelectOption[] = Array.from(
    { length: current - 2020 + 1 },
    (_, i) => current - i
  ).map((item) => {
    return {
      id: String(item),
      name: String(item),
    };
  });

  const orderData = growthData?.sort((a, b) => a.month - b.month);

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

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderRight />

        <div className="flex items-center justify-between  gap-2">
          <SearchableSelect
            onChangeAction={setSelectedZone}
            options={searchZoneOption}
            placeholder="Select Zone"
          />

          <SearchableSelect
            onChangeAction={setSelectedYear}
            options={searchYearOption}
            placeholder="Select Year"
          />
        </div>
      </DashboardHeader>

      <DashboardContent className="flex-col w-full items-center">
        {orderData && (
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
                  {orderData?.map((row, idx) => (
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
        )}
      </DashboardContent>
    </Dashboard>
  );
}
