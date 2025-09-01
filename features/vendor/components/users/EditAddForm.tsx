'use client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Edit, LocateIcon, Phone, Pin, Type, User2, X } from 'lucide-react';
import TableComponent from './TableComponent';
import {
  TypeBranch,
  TypeEditVenderReq,
  TypeVender,
  TypeVenderListItem,
} from '@/shared/types/vender';
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useVenderStore } from '@/store';
import { vendorService } from '@/shared/services/vender';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editVendorBranchSchema,
  editVendorNameSchema,
  TypeEditVendorBranchSchema,
  TypeEditVendorNameSchema,
} from '../../validations/editVender';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import BranchEditForm from '../BranchEditForm';
import { getAccountManagerList } from '@/shared/services/user';
import { useAddUpdateVender } from '../../hooks/useAddUpdateVender';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { TypeEditUserSchema } from '../../validations/editAddForm';
import UserAndBranchSelecter from '@/shared/components/Layout/ProtectedLayout/Header/UserAndBranchSelecter';

type Props = {
  form: UseFormReturn<TypeEditUserSchema>;
  setIsBranchAction: Dispatch<
    SetStateAction<
      | {
          branch: TypeBranch;
          vendor: TypeVenderListItem;
        }
      | undefined
    >
  >;
  isBranch: {
    branch: TypeBranch;
    vendor: TypeVenderListItem;
  };
  branchList: TypeBranch[] | undefined;
};

const EditAddForm = ({
  form,
  isBranch,
  setIsBranchAction,
  branchList,
}: Props) => {
  const venderStore = useVenderStore();

  const handleSumbit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChangeBranch = (e: string) => {
    const branch = branchList?.find((r) => r.id === e);
    setIsBranchAction({
      branch: branch!,
      vendor: isBranch.vendor,
    });
  };
  const handleChangeVender = (e: string) => {
    const vender = venderStore.venderList?.find((r) => r.id === e);
    setIsBranchAction({
      vendor: vender!,
      branch: undefined as any,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSumbit} className=" flex flex-wrap gap-5">
        <UserAndBranchSelecter
          handleChangeBranch={handleChangeBranch}
          handleChangeVender={handleChangeVender}
          branchs={branchList}
          selectedVendorValue={isBranch?.vendor}
          selectedBranchValue={isBranch?.branch}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
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
