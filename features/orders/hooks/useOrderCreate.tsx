import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { debounce } from 'lodash';

import {
  useAuthStore,
  useSharedStore,
  useVendorStore,
  useOrderStore,
  useNotificationStore,
} from '@/store';
import { vendorService } from '@/shared/services/vendor';
import { orderService } from '@/shared/services/orders';
import {
  TypeDropOffs,
  TypeEstimatedDelivery,
  TypeEstimatedDeliveryReturnFromApi,
  TypeOrders,
} from '@/shared/types/orders';
import {
  dropOffSchema,
  pickUpSchema,
  TypeDropOffSchema,
  TypePickUpSchema,
} from '@/features/orders/validations/order';

import { hasValue } from '@/shared/lib/helpers/index';
import {
  emptyDropOff,
  usedropOffFormValuesForDropffs,
  usePickUpFormValuesForPickUp,
} from '../libs/helpers';

// Custom Hook: useFunctionsDropoffs
export default function useOrderCreate(
  pickUpForm: ReturnType<typeof useForm<TypePickUpSchema>>,
  dropOffForm: ReturnType<typeof useForm<TypeDropOffSchema>>,
  isCOD: 1 | 2,
  setIsCOD: (cod: 1 | 2) => void,
  isDropIndex: number,
  setIsDropofIndex: (index: number) => void
) {
  const { user } = useAuthStore();
  const orderStore = useOrderStore();
  const {
    currentZoneId,
    defaultZoneId,
    currentStatusZoneETPTrend,
  } = useSharedStore();
  const { branchId, vendorId, selectedVendorName } = useVendorStore();

  const pickUpFormValues = pickUpForm.watch();
  const dropOffFormValues = dropOffForm.watch();

  const validateFormsAsync = async (): Promise<boolean> => {
    try {
      const [pickUpValid, dropOffValid] = await Promise.all([
        pickUpForm.trigger(),
        dropOffForm.trigger(),
      ]);

      const pickUpFieldsValid =
        hasValue(pickUpFormValues.customer_name) &&
        hasValue(pickUpFormValues.mobile_number) &&
        hasValue(pickUpFormValues.street_id);

      const dropOffFieldsValid =
        hasValue(dropOffFormValues.order_index) &&
        hasValue(dropOffFormValues.customer_name) &&
        hasValue(dropOffFormValues.mobile_number) &&
        hasValue(dropOffFormValues.street_id) &&
        (isCOD === 1 ? hasValue(dropOffFormValues.amount_to_collect) : true);

      return (
        pickUpValid && dropOffValid && pickUpFieldsValid && dropOffFieldsValid
      );
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const updateCalculateDeliveryEstimate = async (
    data: TypeEstimatedDelivery
  ): Promise<TypeEstimatedDeliveryReturnFromApi | undefined> => {
    try {
      const res = await orderService.calculateDeliveryEstimate(data);
      useOrderStore.setState({
        estimatedDeliveryReturnFromApi: res.data,
      });
      orderStore.setEstimatedDeliveryReturnFromApi(res.data);
      console.log(res.data, 'EstimatedDeliveryReturnFromApi');
      return res.data;
    } catch (error) {
      console.log(error, 'sgfdsg');
      return undefined;
    }
  };

  const handleSaveCurrentDropOff = async () => {
    const newDropOffs = [...orderStore.dropOffs];
    const estimatedDeliveryData: TypeEstimatedDelivery = {
      branch_id: branchId!,
      vendor_id: vendorId!,
      drop_offs: newDropOffs,
      delivery_model: orderStore.deliveryModel.key,
      order_session_id: orderStore.estimatedDelivery?.order_session_id || null,
      pickup: usePickUpFormValuesForPickUp({
        pickUpFormValues: pickUpFormValues,
      }),
    };
    try {
      const res = await updateCalculateDeliveryEstimate(estimatedDeliveryData!);

      if (res) {
        useOrderStore.setState((state) => {
          newDropOffs[isDropIndex] = {
            ...usedropOffFormValuesForDropffs({
              dropOffFormValues: dropOffFormValues,
              vendorId: vendorId!,
              isCOD: isCOD,
            }),
          } as any;

          return {
            ...state,
            dropOffs: newDropOffs,
            estimatedDelivery: estimatedDeliveryData,
          };
        });
        console.log(
          'Successfully added and calculated estimate for new drop-off'
        );
      }
      return res;
    } catch (error) {
      console.error('Error in handleAddOneDropoffImproved:', error);
      return undefined;
    }
  };

  const functionsDropoffs = async (
    type:
      | 'addOneDropoff'
      | 'editOneDropoff'
      | 'saveCurrentDropOff'
      | 'editDropOffWithSave'
      | 'deleteDropOff'
      | 'order'
      | 'cancle',
    index: number = 0
  ) => {
    const isFormValid = await validateFormsAsync();

    if (!isFormValid && type !== 'deleteDropOff' && type !== 'cancle') {
      console.warn(
        'Please complete all required fields before adding drop-off'
      );
      return;
    }

    switch (type) {
      case 'addOneDropoff':
        try {
          const newDropOff: TypeDropOffs = usedropOffFormValuesForDropffs({
            dropOffFormValues: dropOffFormValues,
            vendorId: vendorId!,
            isCOD: isCOD,
          });

          const newDropOffs = [...orderStore.dropOffs, newDropOff];

          const updatedPickUp = usePickUpFormValuesForPickUp({
            pickUpFormValues: pickUpFormValues,
          });

          const estimatedDeliveryData: TypeEstimatedDelivery = {
            branch_id: branchId!,
            vendor_id: vendorId!,
            drop_offs: newDropOffs,
            delivery_model: orderStore.deliveryModel.key,
            order_session_id:
              orderStore.estimatedDeliveryReturnFromApi?.order_session_id! ||
              null,
            pickup: updatedPickUp,
          };

          const res = await updateCalculateDeliveryEstimate(
            estimatedDeliveryData!
          );

          if (res) {
            useOrderStore.setState((state) => {
              const updatedDropOffs = [...state.dropOffs];
              if (state.dropOffs === undefined || state.dropOffs.length === 0) {
                updatedDropOffs.push(newDropOff);
                updatedDropOffs.push(emptyDropOff as any);
              } else {
                updatedDropOffs.length - 1 <= isDropIndex
                  ? ((updatedDropOffs[isDropIndex] = newDropOff),
                    updatedDropOffs.push(emptyDropOff as any))
                  : updatedDropOffs.push(newDropOff);
              }

              setIsDropofIndex(updatedDropOffs.length - 1);
              return {
                ...state,
                dropOffs: updatedDropOffs,
                pickUp: updatedPickUp,
                estimatedDelivery: estimatedDeliveryData,
              };
            });

            setIsCOD(1);
            dropOffForm.reset(emptyDropOff);
            dropOffForm.clearErrors();
            console.log(
              'Successfully added and calculated estimate for new drop-off'
            );
          }
        } catch (error) {
          console.error('Error in handleAddOneDropoffImproved:', error);
        }
        break;
      case 'editOneDropoff':
        if (
          dropOffFormValues &&
          index >= 0 &&
          index < orderStore.dropOffs.length
        ) {
          const updatedDropOffs = [...orderStore.dropOffs];

          updatedDropOffs[index] = {
            ...usedropOffFormValuesForDropffs({
              dropOffFormValues: dropOffFormValues,
              vendorId: vendorId!,
              isCOD: isCOD,
            }),
          } as any;

          useOrderStore.setState((state) => ({
            ...state,
            dropOffs: updatedDropOffs,
          }));
        }
        break;
      case 'saveCurrentDropOff':
        handleSaveCurrentDropOff();
        break;
      case 'editDropOffWithSave':
        try {
          if (typeof index !== 'number' || isNaN(index)) {
            console.error(
              `Invalid index type: ${index}. Expected a valid number.`
            );
            return;
          }
          const isCurrentFormValid = await validateFormsAsync(); // Validate the form before switching

          if (isDropIndex !== index && isCurrentFormValid) {
            await handleSaveCurrentDropOff(); // Save changes to the currently active dropoff
          }

          if (index < 0 || index >= orderStore.dropOffs.length) {
            console.error(
              `Invalid index: ${index}. Array length: ${orderStore.dropOffs.length}`
            );
            return;
          }

          setIsDropofIndex(index);
          const dropOffData = orderStore.dropOffs[index];

          if (!dropOffData) {
            console.error(`No drop-off data found at index ${index}`);
            return;
          }
          dropOffForm.reset(dropOffData); // Populate form with selected drop-off data
          setIsCOD(dropOffData.amount_to_collect > 0 ? 1 : 2); // Set COD based on loaded data

          console.log(`Editing drop-off at index ${index}`);
        } catch (error) {
          console.error('Error loading drop-off for editing:', error);
        }
        break;
      case 'deleteDropOff':
        try {
          if (orderStore.dropOffs.length <= 1) {
            console.warn(
              'Cannot delete the last drop-off. At least one drop-off is required.'
            );
            return;
          }

          if (index < 0 || index >= orderStore.dropOffs.length) {
            console.error(
              `Invalid index: ${index}. Valid range: 0-${orderStore.dropOffs.length - 1}`
            );
            return;
          }

          // If the form is currently valid and we're deleting a different drop-off, save the current one
          const isCurrentFormValid = await validateFormsAsync();
          if (isCurrentFormValid && isDropIndex !== index) {
            await handleSaveCurrentDropOff();
          }

          useOrderStore.setState((state) => {
            const updatedDropOffs = [...state.dropOffs];
            updatedDropOffs.splice(index, 1);
            return {
              ...state,
              pickUp: {
                ...(pickUpFormValues as any),
              },
              dropOffs: updatedDropOffs,
            };
          });

          // Handle editing index adjustment
          if (isDropIndex === index) {
            setIsDropofIndex(0); // If deleted current, switch to first
            const firstDropOff = orderStore.dropOffs[0];
            if (firstDropOff) {
              dropOffForm.reset(firstDropOff);
            }
          } else if (isDropIndex > index) {
            setIsDropofIndex(isDropIndex - 1);
          }
          console.log(`Successfully deleted drop-off at index ${index}`);
        } catch (error) {
          console.error('Error deleting drop-off:', error);
        }
        break;

      case 'order':
        try {
          useOrderStore.setState({
            estimatedDeliveryReturnFromApi: undefined,
          });
          const res = await handleSaveCurrentDropOff();

          if (res) {
            const ot_trend = () => {
              if (currentStatusZoneETPTrend) {
                let displayValue =
                  currentStatusZoneETPTrend.etpMins?.toString();
                if (currentStatusZoneETPTrend.etpMoreThanConfigValue) {
                  displayValue = '>' + displayValue;
                } else {
                  displayValue = '<' + displayValue;
                }
                return displayValue;
              }
              return '';
            };

            const order_meta: TypeOrders['order_meta'] = {
              vendor_name:
                selectedVendorName! ||
                user?.user.first_name! + ' ' + user?.user.last_name!,
              ot_trend: ot_trend(),
              ot_free_drivers: currentStatusZoneETPTrend?.freeBuddies || 0,
            };

            console.log(res?.order_session_id, 'dgfds');

            const orders: TypeOrders = {
              branch_id: res.branch_id!,
              vendor_id: res.vendor_id!,
              driver_id: 0,
              order_session_id: res.order_session_id!,
              payment_type: isCOD,
              order_meta: order_meta,
              pick_up: res?.pickup!,
              drop_offs: res.drop_offs!,
            };

            try {
              const createOrderRes =
                await orderService.createOnDemandOrders(orders);
              console.log(createOrderRes, 'orders');
            } catch (error) {
              console.log(error);
            }
          }
        } catch (error) {
          console.error(error, type);
        }
        break;

      case 'cancle':
        useOrderStore.setState({
          dropOffs: [],
          estimatedDelivery: undefined,
          deliverySummary: undefined,
        });
        console.log('cancle');
        setIsCOD(1);

        break;

        break;
      default:
        console.warn(`Unhandled action type: ${type}`);
        break;
    }
  };

  return { functionsDropoffs, validateFormsAsync };
}
