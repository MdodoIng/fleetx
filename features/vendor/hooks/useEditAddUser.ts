'use client';

import { useAuthStore, useVendorStore } from '@/store';
import { UseFormReturn } from 'react-hook-form';
import {
  TypeEditVendorBranchSchema,
  TypeEditVendorNameSchema,
} from '../validations/editVendor';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  TypeAddVendorReq,
  TypeBranch,
  TypeEditVendorReq,
  TypeUpdateVendorUserReq,
  TypeVendor,
  TypeVendorListItem,
  TypeVendorType,
  TypeVendorUserList,
} from '@/shared/types/vendor';
import { vendorService } from '@/shared/services/vendor';
import { hasValue } from '@/shared/lib/helpers';
import { TypeEditUserSchema } from '../validations/editAddForm';

type Props = {
  editUserForm: UseFormReturn<TypeEditUserSchema>;
  data?: TypeVendorUserList[];
  isBranch?: {
    branch: TypeBranch;
    vendor: TypeVendorListItem | TypeVendor;
  };
  setIsBranchAction: Dispatch<
    SetStateAction<
      | {
          branch: TypeBranch;
          vendor: TypeVendorListItem | TypeVendor;
        }
      | undefined
    >
  >;
  isAdd: boolean;
  setIsAddAction: Dispatch<SetStateAction<boolean>>;
};

export const useEditAddUser = ({
  editUserForm,
  data,
  isBranch,
  setIsBranchAction,
  isAdd,
  setIsAddAction,
}: Props) => {
  const {
    setValue,
    isEditUser,
    branchDetails,
    vendorList: vendorList,
    selectedBranch,
    selectedVendor,
  } = useVendorStore.getState();
  const { user } = useAuthStore.getState();

  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const validateFormsAsync = async (
    type?: 'Add' | undefined
  ): Promise<boolean> => {
    if (type === 'Add') {
      try {
        // Trigger validation on both forms
        const editUserFormValid = await editUserForm.trigger([
          'first_name',
          'email',
          'phone',
        ]);

        const vendorFieldsValid = hasValue(editUserFormValues.first_name);

        return editUserFormValid && vendorFieldsValid;
      } catch (error) {
        console.error('Validation error:', error);
        return false;
      }
    } else {
      try {
        const editUserFormValid = await editUserForm.trigger();

        const editUserFormVFieldsValid =
          hasValue(editUserFormValues.first_name) &&
          hasValue(editUserFormValues.phone) &&
          hasValue(editUserFormValues.email) &&
          hasValue(editUserFormValues.password);

        return editUserFormValid && editUserFormVFieldsValid;
      } catch (error) {
        console.error('Validation error:', error);
        return false;
      }
    }
  };

  const editUserFormValues = editUserForm.watch();

  const updateUserDetailsForFromApi = () => {
    if (!isEditUser) return;

    setIsLoadingForm(true);
    Object.entries(isEditUser!).forEach(([key, value]) => {
      editUserForm.setValue(key as keyof TypeEditUserSchema, value);
    });

    setIsLoadingForm(false);
  };

  const request: TypeUpdateVendorUserReq = {
    vendor_id: isBranch?.vendor ? isBranch?.vendor.id : '',
    branch_id: isBranch?.branch ? isBranch?.branch.id : '',
    cod_counter_type: isEditUser ? isEditUser.vendor.cod_counter_type! : 2,
    email: editUserFormValues.email,
    first_name: editUserFormValues.first_name,
    last_name: editUserFormValues.last_name || '',
    phone: editUserFormValues.phone,
    ...(editUserFormValues.password && {
      password: editUserFormValues.password,
    }),
  };

  const handleSubmit = async (fetchVendorUserList: () => Promise<void>) => {
    const isFormValid = await validateFormsAsync(
      isAdd === false ? 'Add' : undefined
    );

    if (!isFormValid) {
      console.warn('Please complete all required fields before update');
      // Optional: Highlight invalid fields or show error message
      return;
    }
    if (isAdd === true) {
      try {
        const res = await vendorService.createVendorUser(request as any);

        if (res.data) {
          editUserForm.clearErrors();
          editUserForm.reset();
          await fetchVendorUserList();
          setIsAddAction(false);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const res = await vendorService.updateVendorUser(
          isEditUser?.vendor.user!,
          request
        );

        editUserForm.clearErrors();
        editUserForm.reset();
        setIsBranchAction(undefined);
        setValue('isEditUser', undefined);
        await fetchVendorUserList();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return {
    validateFormsAsync,
    updateUserDetailsForFromApi,
    handleSubmit,
    isLoadingForm,
  };
};
