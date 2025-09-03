import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon, Download } from 'lucide-react';


export default function FilterHeader({
  users,
  selectedUser,
  onUserChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onApplyFilter,
  onExport,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b bg-gray-100 rounded-t-md">
      {/* User Dropdown */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-muted-foreground mb-1">
          Users
        </label>
        <Select value={selectedUser} onValueChange={onUserChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.first_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Picker */}
      <div className="flex items-end gap-2">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-muted-foreground mb-1">
            From
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[160px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, 'dd MMM yyyy') : 'Select'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={onFromDateChange}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-muted-foreground mb-1">
            To
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[160px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, 'dd MMM yyyy') : 'Select'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={onToDateChange}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button variant="default" onClick={onApplyFilter}>
          Select
        </Button>
      </div>

      {/* Export Button */}
      <Button
        variant="outline"
        onClick={onExport}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export
      </Button>
    </div>
  );
}
