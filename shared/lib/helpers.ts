import { TypeLandMarkScema } from '@/features/orders/validations/order';

export function makeLoc(
  type: any,
  name: string,
  id: number,
  landmarkValues: TypeLandMarkScema
): Locs {
  return {
    id,
    name_ar: name,
    name_en: name,
    latitude: Number(landmarkValues.latitude) || 0,
    longitude: Number(landmarkValues.longitude) || 0,
    governorate_id: 0,
    loc_type: type,
  };
}
