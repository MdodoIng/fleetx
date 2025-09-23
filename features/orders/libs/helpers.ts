'use clinet';
import { TypeDropOffs, TypePickUp } from '@/shared/types/orders';
import { TypeDropOffSchema, TypePickUpSchema } from '../validations/order';


export const usePickUpFormValuesForPickUp = ({
  pickUpFormValues,
}: {
  pickUpFormValues: TypePickUpSchema;
}): TypePickUp => {
  return {
    address: pickUpFormValues.additional_address,
    area: pickUpFormValues.area,
    area_id: pickUpFormValues.area_id as any,
    block: pickUpFormValues.block,
    block_id: pickUpFormValues.block_id as any,
    street: pickUpFormValues.street,
    street_id: pickUpFormValues.street_id as any,
    building: pickUpFormValues.building,
    building_id: pickUpFormValues.building_id as any,
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
    id: new Date() as any,
    vendor_order_id: vendorId!,
    address: '',
    customer_name: dropOffFormValues.customer_name,
    area: dropOffFormValues.area,
    area_id: dropOffFormValues.area_id as any,
    block: dropOffFormValues.block,
    block_id: dropOffFormValues.block_id as any,
    street: dropOffFormValues.street,
    street_id: dropOffFormValues.street_id as any,
    building: dropOffFormValues.building,
    building_id: dropOffFormValues.building_id as any,
    floor: dropOffFormValues.floor,
    room_number: '',
    latitude: dropOffFormValues.latitude,
    longitude: dropOffFormValues.latitude,
    landmark: dropOffFormValues.additional_address!,
    mobile_number: dropOffFormValues.mobile_number,
    order_index: dropOffFormValues.order_index as any,
    amount_to_collect: dropOffFormValues.amount_to_collect as any,
    display_address: dropOffFormValues.additional_address!,
    quantity: 1,
    payment_type: isCOD,
    paci_number: '',
    specific_driver_instructions: dropOffFormValues.additional_address!,
  };
};

export const emptyDropOff: TypeDropOffSchema = {
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
