'use client';

import { useVendorStore } from '@/store';
import { UseFormReturn } from 'react-hook-form';
import {
  TypeEditVendorBranchSchema,
  TypeEditVendorNameSchema,
} from '../validations/editVendor';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  TypeAddVendorReq,
  TypeEditVendorReq,
  TypeVendor,
  TypeVendorType,
} from '@/shared/types/vendor';
import { vendorService } from '@/shared/services/vendor';
import { hasValue } from '@/shared/lib/helpers';
import { toast } from 'sonner';

const branchTemplate: TypeEditVendorReq['branches'][number] = {
  id: '',
  name: '',
  name_ar: null,
  code: null,
  mobile_number: '',
  main_branch: false,
  address: {
    area: '',
    area_id: 0,
    block: '',
    block_id: 0,
    street: '',
    street_id: 0,
    building: '',
    building_id: 0,
    landmark: '',
    latitude: '0',
    longitude: '0',
    paci_number: '',
  },
  vendor: {
    id: '',
    name: '',
    name_ar: null,
    cod_counter_type: 0,
    code: null,
    vendor_affiliation: null,
    official_name: null,
    ref_type: 0,
    ref_by: null,
    is_vendor_central_wallet_enabled: false,
    required_min_wallet_balance: '',
    account_manager_id: null,
    is_strategic_vendor: false,
    strategic_vendor_fee_share: 0,
  },
  required_min_wallet_balance: '',
  branch_zone: [
    {
      tookan_region: {
        region_id: '',
      },
    },
  ],
};

const newVendorBranchTemplate = {
  name: '',
  name_ar: null,
  mobile_number: '',
  code: '',
  main_branch: false,
  address: {
    area: '',
    area_id: 0,
    block: '',
    block_id: 0,
    landmark: '',
    latitude: '',
    longitude: '',
    paci_number: '',
    street: '',
    street_id: 0,
    building: '',
    building_id: null,
  },
};

export const useAddUpdateVendor = (
  editVendorNameForm: UseFormReturn<TypeEditVendorNameSchema>,
  editVendorBranchForm: UseFormReturn<TypeEditVendorBranchSchema>,
  vendorData: TypeVendor,
  codType: 1 | 2
) => {
  const vendorStore = useVendorStore.getState();
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [branches, setBranches] = useState<
    TypeEditVendorReq['branches'][number][] | undefined
  >(undefined);

  const validateFormsAsync = async (
    type?: 'save' | undefined
  ): Promise<boolean> => {
    if (type === 'save') {
      try {
        // Trigger validation on both forms
        const vendorNameValid = await editVendorNameForm.trigger();

        const vendorFieldsValid = hasValue(editVendorNameFormValues.name);

        return vendorNameValid && vendorFieldsValid;
      } catch (error) {
        console.error('Validation error:', error);
        return false;
      }
    } else {
      try {
        // Trigger validation on both forms
        const [vendorBranchValid, vendorNameValid] = await Promise.all([
          editVendorBranchForm.trigger(),
          editVendorNameForm.trigger(),
        ]);

        const vendorFieldsValid = hasValue(editVendorNameFormValues.name);

        const vendorBranchFieldsValid =
          hasValue(editVendorBranchFormValues.name) &&
          hasValue(editVendorBranchFormValues.mobile_number) &&
          hasValue(editVendorBranchFormValues.address.street);

        return vendorStore.isEditVendorBranchId
          ? vendorBranchValid
          : true &&
              vendorNameValid &&
              vendorBranchFieldsValid &&
              vendorFieldsValid;
      } catch (error) {
        console.error('Validation error:', error);
        return false;
      }
    }
  };

  const editVendorNameFormValues = editVendorNameForm.watch();
  const editVendorBranchFormValues = editVendorBranchForm.watch();

  function mapBranchDynamic(
    data: Partial<TypeEditVendorReq['branches'][number]>,
    template: TypeEditVendorReq['branches'][number],
    isCreateNewBranch?: boolean,
    resVendor?: any,
    type?: 'add'
  ): TypeEditVendorReq['branches'][number] {
    const result = structuredClone(template); // safer than {...template}

    (
      Object.keys(template) as (keyof TypeEditVendorReq['branches'][number])[]
    ).forEach((key) => {
      // @ts-ignore
      if (data[key] !== undefined) {
        // @ts-ignore
        result[key] = data[key] as any;
      }
    });

    if (type !== 'add') {
      // Always ensure vendor object exists
      result.vendor = {
        ...(result.vendor ?? {}),
        ...(isCreateNewBranch && resVendor?.data ? resVendor.data : {}),
        name: editVendorNameFormValues.name,
        name_ar: editVendorNameFormValues.name_ar!,
        cod_counter_type: codType,
      };
    }

    return result;
  }

  const updateVendorDetailsForFromApi = () => {
    if (!vendorData?.id) return;
    setIsLoadingForm(true);

    // Populate vendor-level form
    if (vendorData && Object.keys(vendorData).length) {
      editVendorNameForm.setValue(
        'cod_counter_type',
        vendorData.cod_counter_type
      );
      editVendorNameForm.setValue('name', vendorData.name);
      editVendorNameForm.setValue('name_ar', vendorData.name_ar ?? '');
    }

    // Find selected branch
    const branch = vendorData.branches?.find(
      (item) => item.id === vendorStore.isEditVendorBranchId
    );

    if (branch) {
      Object.entries(branch).forEach(([key, value]) => {

        editVendorBranchForm.setValue(
          key as keyof TypeEditVendorBranchSchema,
          value ?? '',
          { shouldValidate: true }
        );
      });
    }
    setIsLoadingForm(false);
  };

  const handleUpdate = async (
    type: 'updateAll' | 'updateBranch' = 'updateBranch',
    isCreateNewBranch: boolean,
    setIsCreateNewBranch: Dispatch<SetStateAction<boolean>>,
    fetchVendorDetails: () => Promise<void>
  ) => {
    const isFormValid = await validateFormsAsync(
      type === 'updateAll' ? 'save' : undefined
    );

    if (!isFormValid) {
      console.warn('Please complete all required fields before update');
      // Optional: Highlight invalid fields or show error message
      return;
    }

    const resVendor = await vendorService.getVendorDetails(vendorData?.id);

    const isBranch = vendorData?.branches?.find(
      (item) => item.id === vendorStore.isEditVendorBranchId
    );
    const formFixBranches = vendorData?.branches.map((item) => {
      return mapBranchDynamic(
        item as Partial<TypeEditVendorReq['branches'][number]>,
        branchTemplate,
        isCreateNewBranch,
        resVendor
      );
    });

    const formFixBranch = isBranch
      ? mapBranchDynamic(
          isBranch as Partial<TypeEditVendorReq['branches'][number]>,
          branchTemplate,
          isCreateNewBranch,
          resVendor
        )
      : mapBranchDynamic(
          editVendorBranchFormValues! as any,
          newVendorBranchTemplate! as any,
          isCreateNewBranch,
          resVendor
        );

    const formFixBranchVal = formFixBranch
      ? mapBranchDynamic(editVendorBranchFormValues! as any, formFixBranch)
      : false;

    const editBranchIndex = vendorData?.branches.findIndex(
      (item) => item.id === vendorStore.isEditVendorBranchId
    );

    const req: TypeEditVendorReq = {
      id: vendorData?.id,
      cod_counter_type: codType,
      name: editVendorNameFormValues.name,
      name_ar: editVendorNameFormValues.name_ar!,
      branches: (type === 'updateAll'
        ? formFixBranches!
        : [formFixBranchVal!]) as any,
    };
    const res = await vendorService.update(req);

    if (res) {
      editVendorBranchForm.clearErrors();
      editVendorNameForm.clearErrors();

      editVendorBranchForm.reset();
      type === 'updateAll'
        ? vendorStore.setValue('isEditVendorId', undefined)
        : await fetchVendorDetails();
      vendorStore.setValue('isEditVendorBranchId', undefined);
      toast.success(
        type === 'updateAll'
          ? 'Vendor Updated successfully'
          : 'Branch Updated successfully'
      );
      setIsCreateNewBranch(false);
    }
  };

  const handleAddBranch = async () => {
    const isFormValid = await validateFormsAsync();

    if (!isFormValid) {
      console.warn('Please complete all required fields before update');
      // Optional: Highlight invalid fields or show error message
      return;
    }
    setIsLoadingForm(true);

    const formFixBranch = mapBranchDynamic(
      editVendorBranchFormValues! as any,
      newVendorBranchTemplate as any,
      undefined,
      null,
      'add'
    );

    setBranches((prev) => [...(prev ?? ([] as any)), formFixBranch] as any);
    editVendorBranchForm.reset();
    setIsLoadingForm(false);
  };

  const handleRemoveBranch = (index: number) => {
    setBranches((prev: any) => {
      if (!prev) return prev;
      const newBranches = [...prev];
      newBranches.splice(index, 1);
      return newBranches;
    });
  };

  const handleSaveVendor = async (
    isVendorType: (keyof typeof TypeVendorType)[]
  ) => {
    const isFormValid = await validateFormsAsync('save');

    if (!isFormValid) {
      console.warn('Please complete all required fields before adding');
      return;
    }

    setIsLoadingForm(true);

    try {
      let vendor_type: (typeof TypeVendorType)[keyof typeof TypeVendorType];

      if (
        isVendorType.includes('B2B_Vendor') &&
        isVendorType.includes('B2C_Vendor')
      ) {
        vendor_type = TypeVendorType.B2C_and_B2B_Vendor;
      } else if (isVendorType.includes('B2C_Vendor')) {
        vendor_type = TypeVendorType.B2C_Vendor;
      } else {
        vendor_type = TypeVendorType.B2B_Vendor;
      }

      const branchToPut: TypeAddVendorReq['branches'] = branches?.map(
        (item, idx) => {
          return {
            address: {
              area: item.address.area,
              area_id: item.address.area_id,
              block: item.address.block,
              block_id: item.address.block_id,
              street: item.address.street,
              street_id: item.address.street_id,
              ...(item.address.building
                ? {
                    building: item.address.building ?? '',
                    building_id: item.address.building_id ?? null,
                  }
                : {}),
              paci_number: item.address.paci_number,
              landmark: item.address.landmark,
              latitude: item.address.latitude,
              longitude: item.address.longitude,
            },
            name: item.name,
            name_ar: item.name_ar,
            code: item.code ?? null,
            mobile_number: item.mobile_number,
            main_branch:
              branches.filter((el) => el.main_branch).length > 0
                ? item.main_branch
                : idx === 0
                  ? true
                  : false,
          };
        }
      ) as any;

      const vendorDataToSave: TypeAddVendorReq = {
        cod_counter_type: codType,
        name: editVendorNameFormValues.name,
        name_ar: editVendorNameFormValues.name_ar!,
        branches: branchToPut,
        vendor_type: vendor_type,
        code: '' as any,
      };

      if (vendorDataToSave) {
        const createRes = await vendorService.create(vendorDataToSave);

        if (createRes) {
          editVendorBranchForm.clearErrors();
          editVendorNameForm.clearErrors();
          editVendorNameForm.reset();
          editVendorBranchForm.reset();
          setBranches(undefined);

          console.log('Vendor created successfully');
          toast.success('Vendor created successfully');
          // Optionally, redirect or clear the form
        } else {
          console.error('Failed to create vendor');
        }
        setIsLoadingForm(false);
      }
    } catch (error) {
      console.error('Error during save:', error);
    } finally {
      setIsLoadingForm(false);
    }
  };

  return {
    validateFormsAsync,
    updateVendorDetailsForFromApi,
    handleUpdate,
    isLoadingForm,
    handleAddBranch,
    branches,
    handleRemoveBranch,
    handleSaveVendor,
  };
};
