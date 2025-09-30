'use clinet';
import { TypeDropOffs, TypePickUp } from '@/shared/types/orders';
import { TypeDropOffSchema, TypePickUpSchema } from '../validations/order';

export const usepickUpFormValuesForPickUp = ({
  pickUpFormValues,
}: {
  pickUpFormValues: TypePickUpSchema;
}): TypePickUp => {
  // Base object with common fields
  const basePickUp: any = {
    address: pickUpFormValues.additional_address,
    area: pickUpFormValues.area,
    area_id: pickUpFormValues.area_id as any,
    block: pickUpFormValues.block,
    block_id: pickUpFormValues.block_id as any,
    street: pickUpFormValues.street,
    street_id: pickUpFormValues.street_id as any,
    latitude: pickUpFormValues.latitude,
    longitude: pickUpFormValues.longitude,
    floor: pickUpFormValues.floor,
    room_number: pickUpFormValues.apartment_no,
    landmark: pickUpFormValues.apartment_no,
    mobile_number: pickUpFormValues.mobile_number,
    customer_name: pickUpFormValues.customer_name,
    paci_number: '',
  };

  // Conditionally add building and building_id only if building is not empty
  if (
    pickUpFormValues.building_id
    // &&
    // pickUpFormValues.building_id.trim() !== ''
  ) {
    basePickUp.building = pickUpFormValues.building;
    basePickUp.building_id = pickUpFormValues.building_id as any;
  }

  return basePickUp;
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
  // Base object with common fields
  const baseDropOff = {
    id: new Date(),
    vendor_order_id: null, //TODO: add vendor order id input from user
    address: '',
    customer_name: dropOffFormValues.customer_name,
    area: dropOffFormValues.area,
    area_id: dropOffFormValues.area_id,
    block: dropOffFormValues.block,
    block_id: dropOffFormValues.block_id,
    street: dropOffFormValues.street,
    street_id: dropOffFormValues.street_id,
    floor: dropOffFormValues.floor ?? '',
    room_number: dropOffFormValues.apartment_no ?? '',
    apartment_no: dropOffFormValues.apartment_no,
    latitude: dropOffFormValues.latitude,
    longitude: dropOffFormValues.longitude,
    landmark: dropOffFormValues.additional_address!,
    additional_address: dropOffFormValues.additional_address,
    mobile_number: dropOffFormValues.mobile_number,
    order_index: dropOffFormValues.order_index,
    display_address: dropOffFormValues.additional_address!,
    payment_type: isCOD,
    paci_number: '',
    specific_driver_instructions: dropOffFormValues.additional_address!,
  };

  // Conditionally add building and building_id only if building is not empty
  if (
    dropOffFormValues.building_id
    // &&
    // dropOffFormValues.building_id?.trim() !== ''
  ) {
    baseDropOff.building = dropOffFormValues.building;
    baseDropOff.building_id = dropOffFormValues.building_id as any;
  }

  // Conditionally add amount_to_collect only if payment_type is 1 (COD)
  if (isCOD === 1 && dropOffFormValues.amount_to_collect) {
    // Convert to number if it's a valid string, otherwise use 0
    const amount = parseFloat(dropOffFormValues.amount_to_collect.toString());
    baseDropOff.amount_to_collect = isNaN(amount) ? 0 : amount;
  }

  return baseDropOff;
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
