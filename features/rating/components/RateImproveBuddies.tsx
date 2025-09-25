'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { rateService } from '@/shared/services/rate';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

interface Buddy {
  buddy_id: string;
  name: string;
  phone: string;
  rating: number;
}

interface RateImproveBuddiesProps {
  improvementType?: number;
  resBuddyList?: { data: Buddy[]; count: number };
  isDetailedPopup?: boolean;
}

export default function RateImproveBuddies({
  improvementType,
  resBuddyList,
  isDetailedPopup = false,
}: RateImproveBuddiesProps) {
  const [buddyList, setBuddyList] = useState<Buddy[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10; // Replace with commonConstants.rateBuddyListPerPage if defined
  const [loading, setLoading] = useState(false);

  // Fetch buddies based on mode
  const fetchBuddies = useCallback(async () => {
    setLoading(true);
    try {
      if (isDetailedPopup && improvementType && resBuddyList) {
        setBuddyList(resBuddyList.data || []);
        setTotalCount(resBuddyList.count || 0);
      } else {
        const response = await rateService.getBuddyList(currentPage, perPage, search);
        
        setBuddyList(response.data || []);
        setTotalCount(response.count || 0);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch buddy list');
      console.error('Error fetching buddy list:', err);
    } finally {
      setLoading(false);
    }
  }, [isDetailedPopup, improvementType, resBuddyList, currentPage, search]);

  useEffect(() => {
    fetchBuddies();
  }, [fetchBuddies]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on search
    fetchBuddies();
  };

  // Export function (placeholder)
  const handleExport = () => {
    console.log('Export triggered');
    // Implement export logic (e.g., using useTableExport or file download)
  };

  return (
    <div className="p-4">
      {!isDetailedPopup && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search (Driver Name/Driver Id/Contact Number)"
                className="w-full md:w-[350px] h-10 border border-gray-300 rounded-md"
              />
              <Button
                variant="default"
                onClick={handleSearch}
                className="bg-green-500 text-white ml-2 h-10"
              >
                Search
              </Button>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              onClick={handleExport}
              className="bg-primary text-white border-primary hover:bg-primary/90 h-10"
            >
              <span className="mr-2">📥</span> Export All
            </Button>
          </div>
        </div>
      )}

      <Card className={isDetailedPopup ? 'w-[800px]' : ''}>
        <CardContent>
          <div className="bg-gray-200 p-2 rounded-t-md">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-gray-500 text-white rounded-md p-2">Driver Name</div>
              <div className="bg-gray-500 text-white rounded-md p-2">Driver Id</div>
              <div className="bg-gray-500 text-white rounded-md p-2">Contact Number</div>
              <div className="bg-gray-500 text-white rounded-md p-2">Rating</div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <span className="animate-pulse">Loading...</span>
            </div>
          ) : buddyList.length === 0 ? (
            <div className="text-center py-4">
              <span>Whoops! No data found</span>
            </div>
          ) : (
            buddyList.map((buddy, index) => (
              <div
                key={buddy.buddy_id}
                className={cn(
                  'grid grid-cols-4 gap-4 p-2 items-center',
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                )}
              >
                <div>
                  <h4
                    className={cn(
                      'text-sm font-semibold text-gray-800',
                      !isDetailedPopup && 'text-green-500 cursor-pointer'
                    )}
                    // onClick={!isDetailedPopup ? () => showDetails(improvementType || 1) : undefined}
                  >
                    {buddy.name}
                  </h4>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{buddy.buddy_id}</h4>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{buddy.phone}</h4>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-orange-500">
                    {buddy.rating.toFixed(1)}
                  </h4>
                </div>
              </div>
            ))
          )}

          {totalCount > perPage && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="mr-2"
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * perPage >= totalCount}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}