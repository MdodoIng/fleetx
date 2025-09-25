'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { FunnelType, User, Zone } from '../../types/useSalesFunnel';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import AccountManagerSelect from '@/shared/components/selectors/AccountManagerSelect';

interface Props {
  types: FunnelType[];
  zones: Zone[];
  selectedType: string;
  selectedZone: string;
  selectedManager: string;
  searchUser: string;
  onTypeChange: (id: string) => void;
  onZoneChange: (id: string) => void;
  onManagerChange: (id: string) => void;
  onSearchChange: (val: string) => void;
  onShowFunnel: () => void;
}

export default function FunnelFilterHeader({
  types,
  zones,
  selectedType,
  selectedZone,
  selectedManager,
  searchUser,
  onTypeChange,
  onZoneChange,
  onManagerChange,
  onSearchChange,
  onShowFunnel,
}: Props) {
  return (
    <div className="p-4 bg-white shadow rounded mb-6 flex flex-wrap gap-4">
      {/* Type */}
      <div className="flex flex-col w-60">
        <label className="text-sm font-medium text-gray-600 mb-1">Type</label>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Zone */}
      <div className="flex flex-col w-60">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Filter by Zone
        </label>
        <Select value={selectedZone} onValueChange={onZoneChange}>
          <SelectTrigger>
            <SelectValue placeholder="Zone" />
          </SelectTrigger>
          <SelectContent>
            {zones.map((z) => (
              <SelectItem key={z.id} value={z.id}>
                {z.region_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Account Manager */}
      <AccountManagerSelect
        value={selectedManager}
        onChangeAction={onManagerChange}
      
      />

      {/* Search */}
      <div className="flex flex-col w-60">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Search User
        </label>
        <Input
          placeholder="User Name"
          value={searchUser}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
        />
      </div>

      {/* Show Funnel */}
      <div className="flex items-end">
        <Button variant="default" onClick={onShowFunnel}>
          Show Funnel
        </Button>
      </div>
    </div>
  );
}
