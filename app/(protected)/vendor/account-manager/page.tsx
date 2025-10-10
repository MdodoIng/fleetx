'use client';

import { useCallback, useEffect, useState } from 'react';

import { AddEditAccountManagerForm } from '@/features/vendor/components/addEditAccountManagerForm';
import { TableFallback } from '@/shared/components/fetch/fallback';
import LoadMore from '@/shared/components/fetch/LoadMore';
import NoData from '@/shared/components/fetch/NoData';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Input } from '@/shared/components/ui/input';
import { Table } from '@/shared/components/ui/table';
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
import userService from '@/shared/services/user';
import { Dot, Mail, Pencil, Phone, Search, User, Users } from 'lucide-react';

export function AccountManagers() {
  const [data, setData] = useState([]);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await userService.getAccountManagerList(1, page, search);
      console.log(res, 'data');

      setData(res.data);

      setNextSetItemTotal(res.data.length < page ? null : true);
    } catch (error) {
      console.error('Failed to refresh account managers.', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) return <TableFallback />;

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
              placeholder="Search a Account Manager"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0 "
            />
          </div>

          <AddEditAccountManagerForm onSaveAction={fetchData} />
        </div>
      </DashboardHeader>
      <DashboardContent className="flex w-full flex-col items-center justify-start">
        {/* Account Managers List */}
        <div className="space-y-4 max-h-[1000px] overflow-y-auto w-full">
          {data.length > 0 ? (
            <Table>
              <TableLists>
                {data.map((manager: any, idx) => (
                  <TableSingleList key={idx}>
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
                            onSaveAction={fetchData}
                          />
                        </TableSingleListContentDetailsItem>
                      </TableSingleListContent>
                    </TableSingleListContents>
                  </TableSingleList>
                ))}
                <LoadMore
                  setPage={setPage}
                  nextSetItemTotal={nextSetItemTotal}
                  type="table"
                />
              </TableLists>
            </Table>
          ) : (
            <NoData />
          )}
        </div>
      </DashboardContent>
    </Dashboard>
  );
}

export default AccountManagers;
