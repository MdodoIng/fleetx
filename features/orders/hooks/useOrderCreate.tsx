/** eslint-disable @typescript-eslint/no-unused-expressions */
import { useForm } from 'react-hook-form';

import { useVendorStore, useOrderStore } from '@/store';
import { orderService } from '@/shared/services/orders';
import {
  TypeDropOffs,
  TypeEstimatedDelivery,
  TypeEstimatedDeliveryReturnFromApi,
  TypeOrders,
} from '@/shared/types/orders';
import {
  TypeDropOffSchema,
  TypePickUpSchema,
} from '@/features/orders/validations/order';

import { hasValue } from '@/shared/lib/helpers/index';
import {
  emptyDropOff,
  useDropOffFormValuesForDropOffs,
  usePickUpFormValuesForPickUp,
} from '../libs/helpers';
import { toast } from 'sonner';
import { getVendorWalletBalanceInit } from '@/store/useWalletStore';

// Custom Hook: useFunctionsDropOffs
export default function useOrderCreate(
  pickUpForm: ReturnType<typeof useForm<TypePickUpSchema>>,
  dropOffForm: ReturnType<typeof useForm<TypeDropOffSchema>>,
  isCOD: 1 | 2,
  setIsCOD: (cod: 1 | 2) => void,
  isDropIndex: number,
  setIsDropOffIndex: (index: number) => void
) {
  const orderStore = useOrderStore();
  const { branchId, vendorId } = useVendorStore();

  const pickUpFormValues = pickUpForm.watch();
  const dropOffFormValues = dropOffForm.watch();

  const validateFormsAsync = async (): Promise<boolean> => {
    try {
      const [pickUpValid, dropOffValid] = await Promise.all([
        pickUpForm.trigger(),
        dropOffForm.trigger(),
      ]);

      const pickUpFieldsValid = true;

      const dropOffFieldsValid =
        isCOD === 1 ? hasValue(dropOffFormValues.amount_to_collect) : true;

      console.log(dropOffForm.formState.errors);
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
      if (res) {
        useOrderStore.getState().setEstimatedDeliveryReturnFromApi(res.data);

        console.log(res.data, 'EstimatedDeliveryReturnFromApi');
        return res.data;
      }
    } catch {
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
      // eslint-disable-next-line react-hooks/rules-of-hooks
      pickup: usePickUpFormValuesForPickUp({
        pickUpFormValues: pickUpFormValues,
      }),
    };
    try {
      const res = await updateCalculateDeliveryEstimate(estimatedDeliveryData!);

      if (res) {
        useOrderStore.setState((state) => {
          newDropOffs[isDropIndex] = {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            ...useDropOffFormValuesForDropOffs({
              dropOffFormValues: dropOffFormValues,
              vendorId: vendorId!,
              isCOD: isCOD,
            }),
          };

          return {
            ...state,
            dropOffs: newDropOffs,
            estimatedDelivery: estimatedDeliveryData,
          };
        });
        console.log(
          'Successfully added and calculated estimate for new drop-off'
        );

        console.log(res.order_session_id);
      }
      return res;
    } catch (error) {
      console.error('Error in handleAddOneDropOffImproved:', error);
      return undefined;
    }
  };

  const functionsDropOffs = async (
    type:
      | 'addOneDropOff'
      | 'editDropOffWithSave'
      | 'deleteDropOff'
      | 'order'
      | 'cancel',
    index: number = 0
  ) => {
    const isFormValid = await validateFormsAsync();

    if (!vendorId) {
      toast.message('Please Select a vendor');
      return;
    }
    if (!branchId) {
      toast.message('Please Select a branch');
      return;
    }
    if (!isFormValid && type !== 'deleteDropOff' && type !== 'cancel') {
      console.warn(
        'Please complete all required fields before adding drop-off'
      );
      return;
    }

    switch (type) {
      case 'addOneDropOff':
        try {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const newDropOff: TypeDropOffs = useDropOffFormValuesForDropOffs({
            dropOffFormValues: dropOffFormValues,
            vendorId: vendorId!,
            isCOD: isCOD,
          });

          const newDropOffs = [...orderStore.dropOffs, newDropOff];

          // eslint-disable-next-line react-hooks/rules-of-hooks
          const updatedPickUp = usePickUpFormValuesForPickUp({
            pickUpFormValues: pickUpFormValues,
          });

          const estimatedDeliveryData: TypeEstimatedDelivery = {
            branch_id: branchId!,
            vendor_id: vendorId!,
            drop_offs: newDropOffs,
            delivery_model: orderStore.deliveryModel.key,
            order_session_id:
              orderStore.estimatedDeliveryReturnFromApi?.order_session_id ||
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
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                updatedDropOffs.length - 1 <= isDropIndex
                  ? ((updatedDropOffs[isDropIndex] = newDropOff),
                    updatedDropOffs.push(emptyDropOff as any))
                  : updatedDropOffs.push(newDropOff);
              }

              setIsDropOffIndex(updatedDropOffs.length - 1);
              return {
                ...state,
                dropOffs: updatedDropOffs,
                pickUp: updatedPickUp,
                estimatedDelivery: estimatedDeliveryData,
              };
            });

            setIsCOD(2);
            dropOffForm.reset(emptyDropOff);
            dropOffForm.clearErrors();
            console.log(
              'Successfully added and calculated estimate for new drop-off'
            );
          }
        } catch (error) {
          console.error('Error in handleAddOneDropOffImproved:', error);
        }
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
            await handleSaveCurrentDropOff(); // Save changes to the currently active dropOff
          }

          if (index < 0 || index >= orderStore.dropOffs.length) {
            console.error(
              `Invalid index: ${index}. Array length: ${orderStore.dropOffs.length}`
            );
            return;
          }

          setIsDropOffIndex(index);
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

      case 'order':
        try {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const newDropOff: TypeDropOffs = useDropOffFormValuesForDropOffs({
            dropOffFormValues: dropOffFormValues,
            vendorId: vendorId!,
            isCOD: isCOD,
          });

          const isSaved = orderStore.dropOffs.find(
            (item) => item.order_index === newDropOff.order_index
          );
          const newDropOffs = isSaved
            ? orderStore.dropOffs
            : [...orderStore.dropOffs, newDropOff].filter(
                (item) => item.customer_name
              );

          // eslint-disable-next-line react-hooks/rules-of-hooks
          const updatedPickUp = usePickUpFormValuesForPickUp({
            pickUpFormValues: pickUpFormValues,
          });

          const estimatedDeliveryData: TypeEstimatedDelivery = {
            branch_id: branchId!,
            vendor_id: vendorId!,
            drop_offs: newDropOffs,
            delivery_model: orderStore.deliveryModel.key,
            order_session_id:
              orderStore.estimatedDeliveryReturnFromApi?.order_session_id ||
              null,
            pickup: updatedPickUp,
          };

          const res = await updateCalculateDeliveryEstimate(
            estimatedDeliveryData!
          );

          if (res) {
            const orders: TypeOrders = {
              branch_id: res.branch_id,
              vendor_id: res.vendor_id!,
              order_session_id:
                orderStore.estimatedDeliveryReturnFromApi?.order_session_id ||
                res.order_session_id!,
              pick_up: updatedPickUp,
              drop_offs: newDropOffs,
            };

            try {
              const createOrderRes =
                await orderService.createOnDemandOrders(orders);

              //TODO: Show success alert message and clear form fields
              console.log(createOrderRes, 'orders');

              toast.success('Successfully added Your Order');
              getVendorWalletBalanceInit();
              functionsDropOffs('cancel');
            } catch (error) {
              console.log(error);
            }
          }
        } catch (error) {
          console.error(error, type);
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
            setIsDropOffIndex(0); // If deleted current, switch to first
            const firstDropOff = orderStore.dropOffs[0];
            if (firstDropOff) {
              dropOffForm.reset(firstDropOff);
            }
          } else if (isDropIndex > index) {
            setIsDropOffIndex(isDropIndex - 1);
          }
          console.log(`Successfully deleted drop-off at index ${index}`);
        } catch (error) {
          console.error('Error deleting drop-off:', error);
        }
        break;

      case 'cancel':
        useOrderStore.setState({
          dropOffs: [],
          estimatedDelivery: undefined,
          deliverySummary: undefined,
          estimatedDeliveryReturnFromApi: undefined,
        });
        dropOffForm.reset(emptyDropOff);
        dropOffForm.clearErrors();
        setIsCOD(2);

        break;

        break;
      default:
        console.warn(`Unhandled action type: ${type}`);
        break;
    }
  };

  return { functionsDropOffs, validateFormsAsync };
}
