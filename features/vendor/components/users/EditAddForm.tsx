'use client';
import { Input } from '@/shared/components/ui/input';
import { TypeBranch, TypeVendorListItem } from '@/shared/types/vendor';
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import { useVendorStore } from '@/store';
import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { TypeEditUserSchema } from '../../validations/editAddForm';
import UserAndBranchSelecter from '@/shared/components/selectors/UserAndBranchSelecter';
import { vendorService } from '@/shared/services/vendor';

type Props = {
  form: UseFormReturn<TypeEditUserSchema>;
  setIsBranchAction: Dispatch<
    SetStateAction<
      | {
        branch: TypeBranch;
        vendor: TypeVendorListItem;
      }
      | undefined
    >
  >;
  isBranch: {
    branch: TypeBranch;
    vendor: TypeVendorListItem;
  };
};

const EditAddForm = ({ form, isBranch, setIsBranchAction }: Props) => {
  const vendorStore = useVendorStore();
  

  const handleSumbit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChangeBranch = (e: string) => {
    const branch = vendorStore.branchDetails?.find((r) => r.id === e);
    setIsBranchAction({
      branch: branch!,
      vendor: isBranch.vendor,
    });
  };
  const handleChangeVendor = (e: string) => {
    const vendor = vendorStore.vendorList?.find((r) => r.id === e);
    setIsBranchAction({
      vendor: vendor!,
      branch: undefined as any,
    });
  };

  const setBranchDetails = useCallback(async () => {
    try {
      const res = await vendorService.getBranchDetails(isBranch?.vendor?.id);

      vendorStore.setValue('branchDetails', res.data);
    } catch (error) {
      console.log(error);
    }
  }, [isBranch?.vendor?.id]);

  useEffect(() => {
    setBranchDetails();
  }, [setBranchDetails]);

  return (
    <Form {...form}>
      <form onSubmit={handleSumbit} className="grid grid-cols-2 gap-5 w-full">
        <div className="col-span-2 flex justify-start ">
          <UserAndBranchSelecter
            handleChangeBranch={handleChangeBranch}
            handleChangeVendor={handleChangeVendor}
            selectedVendorValue={isBranch?.vendor}
            selectedBranchValue={isBranch?.branch}
            classNameFroInput="border"
          />
        </div>
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile</FormLabel>
              <FormControl>
                <Input placeholder="mobile" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default EditAddForm;
