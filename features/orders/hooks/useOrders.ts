'use clinet';
import { TypeDropOffs, TypePickUp } from '@/shared/types/orders';
import { TypeDropOffSchema, TypePickUpSchema } from '../validations/order';
import { useStorageStore } from '@/store/useStorageStore';

export const usePickUpFormValuesForPickUp = ({
  pickUpFormValues,
}: {
  pickUpFormValues: TypePickUpSchema;
}): TypePickUp => {
  return {
    address: pickUpFormValues.additional_address,
    area: pickUpFormValues.area,
    area_id: Number(pickUpFormValues.area_id),
    block: pickUpFormValues.block,
    block_id: Number(pickUpFormValues.block_id),
    street: pickUpFormValues.street,
    street_id: Number(pickUpFormValues.street_id),
    building: pickUpFormValues.building,
    building_id: Number(pickUpFormValues.building_id),
    latitude: pickUpFormValues.latitude,
    longitude: pickUpFormValues.longitude,
    floor: pickUpFormValues.floor,
    room_number: pickUpFormValues.apartment_no,
    landmark: pickUpFormValues.apartment_no,
    mobile_number: pickUpFormValues.mobile_number,
    customer_name: pickUpFormValues.customer_name,
    paci_number: '',
  };
};

export const usedropOffFormValuesForDropffs = ({
  dropOffFormValues,
  vendorId,
  isCOD,
}: {
  dropOffFormValues: TypeDropOffSchema;
  vendorId: string;
  isCOD: 1 | 2;
}): TypeDropOffs => {
  return {
    id: Number(new Date()),
    vendor_order_id: vendorId!,
    address: '',
    customer_name: dropOffFormValues.customer_name,
    area: dropOffFormValues.area,
    area_id: Number(dropOffFormValues.area_id),
    block: dropOffFormValues.block,
    block_id: Number(dropOffFormValues.block_id),
    street: dropOffFormValues.street,
    street_id: Number(dropOffFormValues.street_id),
    building: dropOffFormValues.building,
    building_id: Number(dropOffFormValues.building_id),
    floor: dropOffFormValues.floor,
    room_number: '',
    latitude: dropOffFormValues.latitude,
    longitude: dropOffFormValues.latitude,
    landmark: dropOffFormValues.additional_address!,
    mobile_number: dropOffFormValues.mobile_number,
    order_index: Number(dropOffFormValues.order_index),
    amount_to_collect: Number(dropOffFormValues.amount_to_collect),
    display_address: dropOffFormValues.additional_address!,
    quantity: 1,
    payment_type: isCOD,
    paci_number: '',
    specific_driver_instructions: dropOffFormValues.additional_address!,
  };
};

export const emptyDropOff:TypeDropOffSchema = {
  order_index: '',
  customer_name: '',
  mobile_number: '',
  area: '',
  area_id: '',
  block: '',
  block_id: '',
  street: '',
  street_id: '',
  building: '',
  building_id: '',
  latitude: '',
  longitude: '',
  apartment_no: '',
  floor: '',
  additional_address: '',
  amount_to_collect: '',
};


