'use client';

import ZoneGrowthFilter from '@/features/insights/components/zone-growth/ZoneGrowthFilter';
import ZoneGrowthTable from '@/features/insights/components/zone-growth/ZoneGrowthTable';
import { orderService } from '@/shared/services/orders';
import { reportService } from '@/shared/services/report';
import { useState, useEffect } from 'react';

export default function ZoneGrowthPage() {
  const [zoneList, setZoneList] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // fetch zones on mount
  useEffect(() => {
    async function loadZones() {
      const zones = await orderService.getZone();
      setZoneList(zones.data);
    }
    loadZones();
  }, []);

  useEffect(() => {
    async function loadGrowth() {
      if (!selectedZone) return;
      const data = await reportService.getZoneGrowth(
        selectedZone,
        selectedYear
      );
      setGrowthData(data.data);
    }
    loadGrowth();
  }, [selectedZone, selectedYear]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Zone Growth Report</h1>
      <ZoneGrowthFilter
        zones={zoneList}
        selectedZone={selectedZone}
        onZoneChange={setSelectedZone}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <ZoneGrowthTable data={growthData} />
    </div>
  );
}
