'use client';

import { useAuthStore, useVenderStore } from '@/store';
import { UseFormReturn } from 'react-hook-form';
import {
  TypeEditVendorBranchSchema,
  TypeEditVendorNameSchema,
} from '../validations/editVender';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  TypeAddVenderReq,
  TypeBranch,
  TypeEditVenderReq,
  TypeUpdateVendorUserReq,
  TypeVender,
  TypeVenderListItem,
  TypeVendorType,
  TypeVendorUserList,
} from '@/shared/types/vender';
import { vendorService } from '@/shared/services/vender';
import { hasValue } from '@/shared/lib/helpers';
import { TypeEditUserSchema } from '../validations/editAddForm';

type Props = {
  editUserForm: UseFormReturn<TypeEditUserSchema>;
  data?: TypeVendorUserList[];
  isBranch?: {
    branch: TypeBranch;
    vendor: TypeVenderListItem;
  };
  setIsBranchAction: Dispatch<
    SetStateAction<
      | {
          branch: TypeBranch;
          vendor: TypeVenderListItem;
        }
      | undefined
    >
  >;
  branchList: TypeBranch[] | undefined;
  isAdd: boolean;
  setIsAddAction: Dispatch<SetStateAction<boolean>>;
};

export const useEditAddUser = ({
  editUserForm,
  data,
  isBranch,
  setIsBranchAction,
  branchList,
  isAdd,
  setIsAddAction,
}: Props) => {
  const { setValue, isEditUser, branchDetails, venderList } =
    useVenderStore.getState();
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

        const venderFieldsValid = hasValue(editUserFormValues.first_name);

        return editUserFormValid && venderFieldsValid;
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
      editUserForm.setValue(key as keyof TypeEditUserSchema, value as any);
    });

    setIsLoadingForm(false);
  };

  const requst: TypeUpdateVendorUserReq = {
    branch_id: isBranch?.branch ? isBranch?.branch.id : '',
    vendor_id: isBranch?.vendor ? isBranch?.vendor.id : '',
    cod_counter_type: isEditUser ? isEditUser.vendor.cod_counter_type! : 2,
    email: editUserFormValues.email,
    first_name: editUserFormValues.first_name,
    last_name: editUserFormValues.last_name || '',
    phone: editUserFormValues.phone,
    ...(editUserFormValues.password && {
      password: editUserFormValues.password,
    }),
  };

  const handelSumbit = async (fetchVendorUserList: () => Promise<void>) => {
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
        const res = await vendorService.createVendorUser(requst as any);

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
          requst
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
    handelSumbit,
    isLoadingForm,
  };
};
