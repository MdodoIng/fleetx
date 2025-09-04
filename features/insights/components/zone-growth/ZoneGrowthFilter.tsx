'use client';

import { Card, CardHeader } from '@/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { TypeZoneData } from '@/shared/types/orders';
import { Dispatch, SetStateAction, useMemo } from 'react';

interface Props {
  zones: TypeZoneData[];
  selectedZone: number;
  onZoneChange: Dispatch<SetStateAction<number | undefined>>;
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export default function ZoneGrowthFilter({
  zones,
  selectedZone,
  onZoneChange,
  selectedYear,
  onYearChange,
}: Props) {
  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: current - 2020 + 1 }, (_, i) => current - i);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-end gap-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Select Zone
          </label>
          <Select
            value={String(selectedZone)}
            onValueChange={(value) => onZoneChange(Number(value))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Zones" />
            </SelectTrigger>
            <SelectContent>
              {zones?.map((z) => (
                <SelectItem key={z.id} value={z.id}>
                  {z.region_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Select Year
          </label>
          <Select
            value={String(selectedYear)}
            onValueChange={(v) => onYearChange(Number(v))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
    </Card>
  );
}
