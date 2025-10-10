'use client';

import clsx from 'clsx';
import { FunnelRow } from '../../types/useSalesFunnel';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/shared/components/ui/dialog';
import { useState } from 'react';
import { funnelStage } from '@/shared/constants/storageConstants';

interface Props {
  type: string;
  first: FunnelRow[];
  second: FunnelRow[];
  third: FunnelRow[];
  fourth: FunnelRow[];
  fifth: FunnelRow[];
  isNoData: boolean;
  isLoadMoreCompleted: boolean;
  loadMore: () => void;
  moveToTop: () => void;
  showNote: (row: FunnelRow) => void;
}

export default function FunnelTable({
  type,
  first,
  second,
  third,
  fourth,
  fifth,
  isNoData,
  isLoadMoreCompleted,
  loadMore,
  moveToTop,
  showNote,
}: Props) {
  const [selectedRow, setSelectedRow] = useState<FunnelRow | null>(null);

  const headersMap: Record<string, string[]> = {
    '1': ['NO RECHARGE', 'FOLLOW UP1', 'RECHARGED', 'FOLLOW UP2', 'ACTIVATED'],
    '2': ['NO RECHARGE', 'FOLLOW UP1', 'RECHARGED', 'FOLLOW UP2', 'RETENTION'],
    '3': [
      'HAS WALLET',
      'FOLLOW UP1',
      'FOLLOW UP2',
      'RETAINED',
      'REPEATED CHURN',
    ],
    '4': ['CHURNED', 'CONTACTED', 'RE-ACTIVATING', 'RE-ACTIVATED', 'DORMANT'],
  };

  const columns = [first, second, third, fourth, fifth];
  const headers = headersMap[type] || [];

  if (isNoData) {
    return (
      <div className="text-center py-10">
        <img
          src="/images/nodata.png"
          alt="No data"
          className="mx-auto mb-4 w-24"
        />
        <p className="text-gray-600">Whoops! No data found</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white shadow rounded-lg p-4">
      <div id="greyBgRow" className="flex mb-2">
        {headers.map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-400 text-white text-center py-2 rounded mr-1"
          >
            <h5 className="font-bold text-sm">{h}</h5>
          </div>
        ))}
      </div>

      <div className="flex gap-1">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 space-y-1">
            {col.map((row, idx) => (
              <div
                key={idx}
                className={clsx(
                  'p-2 rounded cursor-pointer',
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                )}
                onClick={() => {
                  setSelectedRow(row);
                  showNote(row);
                }}
              >
                <h4 className="text-center text-teal-500 font-semibold">
                  {row.user_name}
                </h4>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col items-center gap-2">
        {!isNoData && type === '4' && !isLoadMoreCompleted && (
          <Button variant="outline" onClick={loadMore}>
            LOAD MORE
          </Button>
        )}
        {!isNoData && (
          <Button
            variant="ghost"
            onClick={moveToTop}
            className="text-xl p-2"
            aria-label="Scroll to top"
          >
            ↑
          </Button>
        )}
      </div>

      <Dialog open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
        <DialogContent className="sm:max-w-md p-6">
          <div className="flex items-center justify-between">
            <DialogTitle>User Note</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" aria-label="Close note dialog">
                &times;
              </Button>
            </DialogClose>
          </div>
          <div className="mt-4">
            <p>Note for {selectedRow?.user_name}</p>
            {/* Add note content or form here, similar to AddShowNotesComponent */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
