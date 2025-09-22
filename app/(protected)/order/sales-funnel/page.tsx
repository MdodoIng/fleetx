'use client';

import { useState, useCallback } from 'react';
import FunnelFilterHeader from '@/features/orders/components/funnel/FunnelFilterHeader';
import FunnelTable from '@/features/orders/components/funnel/FunnelTable';
import ShowSalesFunnel from '@/features/orders/components/funnel/ShowSalesFunnel';
import { useSalesFunnel } from '@/features/orders/hooks/useSalesFunnel';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

function FunnelPage() {
  const {
    types,
    zones,
    managers,
    selectedType,
    selectedZone,
    selectedManager,
    searchUser,
    firstColumn,
    secondColumn,
    thirdColumn,
    fourthColumn,
    fifthColumn,
    isNoData,
    isLoadMoreCompleted,
    onTypeChange,
    onZoneChange,
    onManagerChange,
    onSearchChange,
    loadMore,
    moveToTop,
    showNote,
  } = useSalesFunnel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <div className="p-6 space-y-6 relative">
      <h1 className="text-2xl font-bold">Sales Funnel</h1>

      <FunnelFilterHeader
        types={types}
        zones={zones}
        managers={managers}
        selectedType={selectedType}
        selectedZone={selectedZone}
        selectedManager={selectedManager}
        searchUser={searchUser}
        onTypeChange={onTypeChange}
        onZoneChange={onZoneChange}
        onManagerChange={onManagerChange}
        onSearchChange={onSearchChange}
        // swap hook’s showFunnelModal for our openModal
        onShowFunnel={openModal}
      />

      <FunnelTable
        type={selectedType}
        first={firstColumn}
        second={secondColumn}
        third={thirdColumn}
        fourth={fourthColumn}
        fifth={fifthColumn}
        isNoData={isNoData}
        isLoadMoreCompleted={isLoadMoreCompleted}
        loadMore={loadMore}
        moveToTop={moveToTop}
        showNote={showNote}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>

        <DialogContent
          showCloseButton={false}
          className="sm:max-w-fit  mx-auto p-4"
        >
          <div className="flex items-center justify-between">
            <DialogTitle>Funnel Insights</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost">&times;</Button>
            </DialogClose>
          </div>

          <ShowSalesFunnel type={Number(selectedType) as 1 | 2 | 3 | 4} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FunnelPage;
