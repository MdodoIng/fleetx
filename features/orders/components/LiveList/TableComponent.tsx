'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  MapPin,
  User,
  Phone,
  CreditCard,
  Clock,
  Truck,
  Navigation,
  Info,
  Receipt,
  Dot,
} from 'lucide-react';
import { paymentMap } from '@/features/orders/constants';
import { useOrderStore, useSharedStore } from '@/store';
import EditReceiver from '../ui/EditReceiver';
import EditPayment from '../ui/EditPayment';
import {
  Table,
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
import { useTranslations } from 'next-intl';
import LoadMore from '@/shared/components/fetch/LoadMore';
import { vendorService } from '@/shared/services/vendor';

interface OrdersPageProps {
  setPage: Dispatch<SetStateAction<number>>;
  nextSetItemTotal: unknown;
  fetchOrderDetails: () => Promise<void>;
}

export default function TableComponent({
  setPage,
  nextSetItemTotal,
  fetchOrderDetails,
}: OrdersPageProps) {
  const { appConstants } = useSharedStore();
  const orderStore = useOrderStore();
  const [branchNames, setBranchNames] = useState<Record<any, string>>({});

  useEffect(() => {
    const fetchBranchNames = async () => {
      const results = await Promise.all(
        orderStore.orderStatusListData!.map(async (item) => {
          try {
            const res = await vendorService.getBranchDetails(item.vendor_id!);
            const brand = res.data.find((b) => b.id === item.branch_id);
            const branchName = brand?.name ?? 'Unnamed';
            const isMain = brand?.main_branch;

            return {
              idx: item.id, // or item.order_id if unique
              name: isMain
                ? `Main Branch ${branchName}`
                : `Branch ${branchName}`,
            };
          } catch (err) {
            return { idx: item.id, name: 'Unknown Branch' };
          }
        })
      );

      const nameMap = Object.fromEntries(results.map((r) => [r.idx, r.name]));
      setBranchNames(nameMap);
    };

    fetchBranchNames();
  }, [orderStore.orderStatusListData]);

  const t = useTranslations();
  return (
    <Table>
      <TableLists>
        {orderStore?.orderStatusListData?.map((item, idx) => (
          <TableSingleList key={idx}>
            <TableSingleListHeader className="">
              <TableSingleListHeaderRight>
                <span className="font-semibold text-primary-blue flex">
                  <p className="ltr:hidden">#FleetX </p>{' '}
                  {item.fleetx_order_number}{' '}
                  <p className="rtl:hidden">&nbsp; #FleetX</p>
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    item.class_status
                  }`}
                >
                  {t(item.status)}
                </span>
                <span
                  className={`text-xs text-primary-teal flex items-center `}
                >
                  <Dot />
                  {branchNames[item.id] ?? 'Loading...'}
                </span>
              </TableSingleListHeaderRight>
              <TableSingleListHeaderLeft className="flex items-center gap-1">
                <Clock size={12} />
                {item.creation_date}
              </TableSingleListHeaderLeft>
            </TableSingleListHeader>
            <TableSingleListContents>
              <TableSingleListContent>
                <TableSingleListContentTitle>
                  <Receipt size={14} />
                  {t('component.features.orders.live.details.orderNo')}
                </TableSingleListContentTitle>
                <TableSingleListContentDetailsTitle>
                  {item.fleetx_order_number}
                </TableSingleListContentDetailsTitle>
              </TableSingleListContent>
              <TableSingleListContent>
                <TableSingleListContentTitle>
                  <User size={14} />{' '}
                  {t('component.features.orders.live.details.sender')}
                </TableSingleListContentTitle>
                <TableSingleListContentDetailsTitle>
                  {item.customer_name_sender}
                </TableSingleListContentDetailsTitle>
                <TableSingleListContentDetailsItem>
                  <Phone size={12} /> {item.phone_number_sender}
                </TableSingleListContentDetailsItem>
                <TableSingleListContentDetailsItem>
                  <MapPin size={12} /> {item.from}
                </TableSingleListContentDetailsItem>
              </TableSingleListContent>
              <TableSingleListContent>
                <TableSingleListContentTitle>
                  <User size={14} />{' '}
                  {t('component.features.orders.live.details.receiver')}
                </TableSingleListContentTitle>
                <TableSingleListContentDetailsTitle>
                  {item.customer_name}
                </TableSingleListContentDetailsTitle>
                <TableSingleListContentDetailsItem>
                  <Phone size={12} /> {item.phone_number}
                </TableSingleListContentDetailsItem>
                <TableSingleListContentDetailsItem>
                  <MapPin size={12} /> {item.to}
                </TableSingleListContentDetailsItem>

                {item.is_delivery_address_edit_enabled && (
                  <EditReceiver
                    data={item}
                    fetchOrderDetails={fetchOrderDetails}
                  />
                )}
              </TableSingleListContent>
              <TableSingleListContent
                className={!item.driver_name ? 'bg-[#F9F8714D]' : ''}
              >
                {item.driver_name ? (
                  <>
                    <TableSingleListContentTitle>
                      <Truck size={14} />{' '}
                      {t(
                        'component.features.orders.live.tracking.driver.defult'
                      )}
                    </TableSingleListContentTitle>
                    <TableSingleListContentDetailsTitle className="text-sm font-medium text-gray-800">
                      {item.driver_name}
                    </TableSingleListContentDetailsTitle>
                    <TableSingleListContentDetailsItem>
                      <Phone size={12} /> {item.driver_phone}
                    </TableSingleListContentDetailsItem>
                    <TableSingleListContentDetailsItem>
                      <Navigation size={12} /> {item.delivery_distance} km
                    </TableSingleListContentDetailsItem>
                  </>
                ) : (
                  <>
                    <TableSingleListContentTitle className="text-[#915A0B]">
                      <Clock size={14} className="!text-[#915A0B]" />
                      {t(
                        'component.features.orders.live.details.noDriverAssigned'
                      )}
                    </TableSingleListContentTitle>
                    <TableSingleListContentDetailsItem className="">
                      {t('component.features.orders.live.details.driverQueued')}
                    </TableSingleListContentDetailsItem>
                  </>
                )}
              </TableSingleListContent>
              <TableSingleListContent>
                <TableSingleListContentTitle>
                  <Info size={14} />{' '}
                  {t('component.features.orders.live.details.delivery-fee')}
                </TableSingleListContentTitle>
                <TableSingleListContentDetailsTitle>
                  {' '}
                  {item.amount_collected} {appConstants?.currency}
                </TableSingleListContentDetailsTitle>
              </TableSingleListContent>
              <TableSingleListContent className="h-full">
                <TableSingleListContentTitle>
                  <CreditCard size={14} />{' '}
                  {t('component.features.orders.live.details.payment')}
                </TableSingleListContentTitle>
                <TableSingleListContentDetailsTitle>
                  {paymentMap[item.payment_type] || 'Unknown'}
                </TableSingleListContentDetailsTitle>

                {item.is_delivery_address_edit_enabled && (
                  <EditPayment
                    data={item}
                    fetchOrderDetails={fetchOrderDetails}
                  />
                )}
              </TableSingleListContent>
            </TableSingleListContents>
          </TableSingleList>
        ))}
        <LoadMore
          setPage={setPage}
          nextSetItemTotal={nextSetItemTotal!}
          type="table"
        />
      </TableLists>
    </Table>
  );
}
