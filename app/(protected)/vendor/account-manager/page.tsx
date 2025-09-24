'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Plus,
  Pencil,
  User,
  Users,
  BarChart,
  Dot,
  Phone,
  Mail,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { AddEditAccountManagerForm } from '@/features/vendor/components/addEditAccountManagerForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  TableLists,
  TableSingleList,
  TableSingleListContent,
  TableSingleListContentDetailsItem,
  TableSingleListContentDetailsTitle,
  TableSingleListContents,
  TableSingleListContentTitle,
  TableSingleListHeader,
  TableSingleListHeaderLeft,
  TableSingleListHeaderRight,
} from '@/shared/components/ui/tableList';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import userService from '@/shared/services/user';

export function AccountManagers() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [search, setSearch] = useState();
  const [page, setPage] = useState(10);

  const fetchData = useCallback(async () => {
    try {
      const newData = await userService.getAccountManagerList(1, page, search);

      console.log(newData);
      setData(newData.data);
      setTotalCount(newData.count);
    } catch (error) {
      toast('Failed to refresh account managers.');
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Dashboard className="">
      <DashboardHeader>
        <DashboardHeaderRight />
        {/* Search and Add Button */}
        <div className="flex sm:justify-center gap-1.5 max-sm:w-full justify-between">
          <div className="relative max-sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Seacrh a Account Manager"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0 "
            />
          </div>

          <AddEditAccountManagerForm onSave={fetchData} />
        </div>
      </DashboardHeader>
      <DashboardContent className="flex w-full flex-col items-center justify-start">
        {/* Account Managers List */}
        <div className="space-y-4 max-h-[1000px] overflow-y-auto w-full">
          {data.length > 0 ? (
            <Table>
              <TableLists>
                {data.map((manager, idx) => (
                  <TableSingleList key={manager.id}>
                    <TableSingleListHeader className="">
                      <TableSingleListHeaderRight>
                        <span className="font-semibold text-primary-blue flex">
                          {manager.first_name} {manager.last_name}
                        </span>
                        <span className="text-xs text-primary-teal flex items-center">
                          <Dot />
                          {manager.email}
                        </span>
                      </TableSingleListHeaderRight>
                      <TableSingleListHeaderLeft className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Phone size={12} />
                          {manager.phone}
                        </div>
                      </TableSingleListHeaderLeft>
                    </TableSingleListHeader>

                    <TableSingleListContents>
                      {/* First Name */}
                      <TableSingleListContent>
                        <TableSingleListContentTitle>
                          <User size={14} />
                          First Name
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle>
                          {manager.first_name}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContent>

                      {/* Last Name */}
                      <TableSingleListContent>
                        <TableSingleListContentTitle>
                          <User size={14} />
                          Last Name
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle>
                          {manager.last_name}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContent>

                      {/* Phone Number */}
                      <TableSingleListContent>
                        <TableSingleListContentTitle>
                          <Phone size={14} />
                          Phone Number
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle>
                          {manager.phone}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContent>

                      {/* Email */}
                      <TableSingleListContent>
                        <TableSingleListContentTitle>
                          <Mail size={14} />
                          Email
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle>
                          {manager.email}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContent>

                      {/* Vendor Count */}
                      <TableSingleListContent>
                        <TableSingleListContentTitle>
                          <Users size={14} />
                          Vendor Count
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle>
                          {manager.vendor_count}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContent>

                      {/* Action */}
                      <TableSingleListContent>
                        <TableSingleListContentTitle>
                          <Pencil size={14} />
                          Action
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsItem>
                          <AddEditAccountManagerForm
                            editDetails={manager}
                            onSave={fetchData}
                          />
                        </TableSingleListContentDetailsItem>
                      </TableSingleListContent>
                    </TableSingleListContents>
                  </TableSingleList>
                ))}
              </TableLists>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="mt-4 text-gray-500">Whoops! No data found</span>
            </div>
          )}
        </div>
      </DashboardContent>
    </Dashboard>
  );
}

export default AccountManagers;
