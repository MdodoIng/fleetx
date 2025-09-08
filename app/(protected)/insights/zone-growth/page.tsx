'use client';

import ZoneGrowthFilter from '@/features/insights/components/zone-growth/ZoneGrowthFilter';
import ZoneGrowthTable from '@/features/insights/components/zone-growth/ZoneGrowthTable';
import { orderService } from '@/shared/services/orders';
import { reportService } from '@/shared/services/report';
import { TypeZoneData } from '@/shared/types/orders';
import { TypeZoneGrowth } from '@/shared/types/report';
import { useState, useEffect } from 'react';

export default function ZoneGrowthPage() {
  const [zoneList, setZoneList] = useState<TypeZoneData[]>();
  const [growthData, setGrowthData] = useState<TypeZoneGrowth[]>();
  const [selectedZone, setSelectedZone] = useState<number>();
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    async function loadZones() {
      const zones = await orderService.getZone();
      console.log(zones);
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
      console.log(data);
      setGrowthData(data.data!);
    }
    loadGrowth();
  }, [selectedZone, selectedYear]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Zone Growth Report</h1>
      <ZoneGrowthFilter
        zones={zoneList!}
        selectedZone={selectedZone!}
        onZoneChange={setSelectedZone!}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <ZoneGrowthTable data={growthData!} />
    </div>
  );
}
