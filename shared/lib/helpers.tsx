import { TypePickUpSchema } from '@/features/wallet/validations/order';
import { useOrderStore } from '@/store/useOrderStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function makeLoc(
  type: string,
  name: string,
  id: any,
  landmarkValues: TypePickUpSchema
): Locs {
  // Validate required parameters
  if (!type || !name || id === null || id === undefined) {
    throw new Error('makeLoc requires type, name, and id parameters');
  }

  return {
    id,
    name_ar: name,
    name_en: name,
    latitude: landmarkValues?.latitude ?? 0,
    longitude: landmarkValues?.longitude ?? 0,
    governorate_id: 0,
    loc_type: type,
  };
}

export const hasErrors = (form: any) =>
  Object.entries(form.formState.errors).length > 0;
export const hasValue = (value: any) => Boolean(value);
