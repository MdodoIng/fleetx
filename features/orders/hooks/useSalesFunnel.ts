import { useCallback, useEffect, useState } from 'react';

import { funnelStage } from '@/shared/constants/storageConstants';
import { orderService } from '@/shared/services/orders';
import { reportService } from '@/shared/services/report';
import { getAccountManagerList } from '@/shared/services/user';
import { FunnelRow, FunnelType, User, Zone } from '../types/useSalesFunnel';

export function useSalesFunnel() {
  // filter options
  const [types] = useState<FunnelType[]>([
    { id: 1, name: 'Activation' },
    { id: 2, name: 'Retention' },
    { id: 3, name: 'Retention 2' },
    { id: 4, name: 'Reactivation' },
  ]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [managers, setManagers] = useState<User[]>([]);

  // filters
  const [selectedType, setSelectedType] = useState<number>(1);
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [searchUser, setSearchUser] = useState<string>('');

  // raw data for current type
  const [salesFunnelData, setSalesFunnelData] = useState<FunnelRow[]>([]);

  // columns
  const [firstColumn, setFirstColumn] = useState<FunnelRow[]>([]);
  const [secondColumn, setSecondColumn] = useState<FunnelRow[]>([]);
  const [thirdColumn, setThirdColumn] = useState<FunnelRow[]>([]);
  const [fourthColumn, setFourthColumn] = useState<FunnelRow[]>([]);
  const [fifthColumn, setFifthColumn] = useState<FunnelRow[]>([]);

  // flags
  const [isNoData, setIsNoData] = useState<boolean>(false);
  const [isLoadMoreCompleted, setIsLoadMoreCompleted] =
    useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(1);

  const PAGE_SIZE = 50;

  useEffect(() => {
    orderService.getZone().then((res) => setZones(res.data));
    getAccountManagerList(1, 1000, null).then((res: any) =>
      setManagers(res.data)
    );
  }, []);

  useEffect(() => {
    const load = async () => {
      let res;
      if (selectedType === 1)
        res = await reportService.getSalesFunnelActivation();
      else if (selectedType === 2)
        res = await reportService.getSalesFunnelRetention();
      else if (selectedType === 3)
        res = await reportService.getSalesFunnelRetention2();
      else res = await reportService.getSalesFunnelReactivationUsers();

      console.log(res)
      setSalesFunnelData(res.data);
      setPageCount(1);
    };
    load();
  }, [selectedType]);

  const filterAndPaginate = useCallback(() => {
    if (!salesFunnelData) return;
    let filtered = salesFunnelData
      .filter((u) => !selectedZone || u.region_id === selectedZone)
      .filter((u) =>
        searchUser
          ? u.user_name.toLowerCase().includes(searchUser.toLowerCase())
          : true
      )
      .filter((u) =>
        selectedManager ? u.account_manager === selectedManager : true
      );

    if (selectedType === 4) {
      const max = pageCount * PAGE_SIZE;
      filtered = filtered.slice(0, max);
      setIsLoadMoreCompleted(filtered.length < salesFunnelData.length);
    }

    // helper: set “no data” flag
    const checkNoData = (
      a: number,
      b: number,
      c: number,
      d: number,
      e: number
    ) => a + b + c + d + e === 0;

    let col1: FunnelRow[] = [];
    let col2: FunnelRow[] = [];
    let col3: FunnelRow[] = [];
    let col4: FunnelRow[] = [];
    let col5: FunnelRow[] = [];

    switch (selectedType) {
      case 1:
        col1 = filtered.filter(
          (u) => u.funnel_stage === funnelStage.NoOrderNoRecharge
        );
        col2 = filtered.filter(
          (u) => u.funnel_stage === funnelStage.NoOrderFollowUp1
        );
        col3 = filtered.filter(
          (u) => u.funnel_stage === funnelStage.NoOrderRecharged
        );
        col4 = filtered.filter(
          (u) => u.funnel_stage === funnelStage.NoOrderFollowUp2
        );
        col5 = filtered.filter((u) => u.funnel_stage === funnelStage.Activated);
        break;
      case 2:
        col1 = filtered.filter(
          (u) => u.funnel_stage === funnelStage.NoRecharge
        );
        col2 = filtered.filter((u) => u.funnel_stage === funnelStage.FollowUp1);
        col3 = filtered.filter((u) => u.funnel_stage === funnelStage.Recharged);
        col4 = filtered.filter((u) => u.funnel_stage === funnelStage.FollowUp2);
        col5 = filtered.filter((u) => u.funnel_stage === funnelStage.Retained);
        break;
      case 3:
        col1 = filtered.filter(
          (u) => u.funnel_stage === funnelStage.NoOrderHasWallet
        );
        col2 = filtered.filter(
          (u) => u.funnel_stage === funnelStage.NoOrderHasWalletFollowUp1
        );
        col3 = filtered.filter(
          (u) => u.funnel_stage === funnelStage.NoOrderHasWalletFollowUp2
        );
        col4 = filtered.filter(
          (u) => u.funnel_stage === funnelStage.NoOrderHasWalletRetained
        );
        col5 = salesFunnelData // repeatedChurn was handled server-side in Angular
          .filter((u) => u.funnel_stage === funnelStage.PotentialChurn);
        break;
      case 4:
        col1 = filtered.filter((u) => u.funnel_stage === funnelStage.Churned);
        col2 = filtered.filter((u) => u.funnel_stage === funnelStage.Contacted);
        col3 = filtered.filter(
          (u) => u.funnel_stage === funnelStage.ReActivating
        );
        col4 = filtered.filter(
          (u) => u.funnel_stage === funnelStage.ReActivated
        );
        col5 = filtered.filter((u) => u.funnel_stage === funnelStage.Dormant);
        break;
    }

    setFirstColumn(col1);
    setSecondColumn(col2);
    setThirdColumn(col3);
    setFourthColumn(col4);
    setFifthColumn(col5);

    setIsNoData(
      checkNoData(
        col1.length,
        col2.length,
        col3.length,
        col4.length,
        col5.length
      )
    );
  }, [
    salesFunnelData,
    selectedType,
    selectedZone,
    selectedManager,
    searchUser,
    pageCount,
  ]);

  // re-filter whenever dependencies change
  useEffect(() => {
    filterAndPaginate();
  }, [filterAndPaginate]);

  // handlers
  const onTypeChange = (id: string) => {
    setSelectedType(Number(id));
  };
  const onZoneChange = (id: string) => {
    setSelectedZone(id);
  };
  const onManagerChange = (id: string) => {
    setSelectedManager(id);
  };
  const onSearchChange = (val: string) => {
    setSearchUser(val);
  };
  const loadMore = () => setPageCount((p) => p + 1);
  const moveToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const showNote = (row: FunnelRow) =>
    window.alert(`Note for ${row.user_name}`);
  const showFunnelModal = () =>
    window.alert(`Open funnel modal for type ${selectedType}`);

  return {
    types,
    zones,
    managers,
    selectedType: String(selectedType),
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
    showFunnelModal,
  };
}
