import {
  addressSchema,
  TypeAddressSchema,
} from '@/features/orders/validations/editResiver';
import AddressLandmarkFields from '@/shared/components/InputSearch';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { hasValue } from '@/shared/lib/helpers';
import { orderService } from '@/shared/services/orders';
import {
  TypeOrderHistoryList,
  TypeUpdateAddressReq,
} from '@/shared/types/orders';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const EditResiver = ({
  data,
  fetchOrderDetails,
}: {
  data: TypeOrderHistoryList;
  fetchOrderDetails: () => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TypeAddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: data?.drop_off?.address || '',
      latitude: data?.drop_off?.latitude || '',
      longitude: data?.drop_off?.longitude || '',
      floor: data?.drop_off?.floor || '',
      room_number: data?.drop_off?.room_number || '',
      landmark: data?.drop_off?.landmark || '',
      area: data?.drop_off?.area || '',
      area_id: data?.drop_off?.area_id || undefined,
      block: data?.drop_off?.block || '',
      block_id: data?.drop_off?.block_id || undefined,
      street: data?.drop_off?.street || '',
      street_id: data?.drop_off?.street_id || undefined,
      building: data?.drop_off?.building || '',
      building_id: data?.drop_off?.building_id || undefined,
    },
  });

  const validateFormsAsync = async (): Promise<boolean> => {
    try {
      const editFormValid = await form.trigger([
        'area',
        'block',
        'latitude',
        'longitude',
      ]);

      return editFormValid;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const formValues = form.watch();

  const handleSumbitAction = async () => {
    const isValid = await validateFormsAsync();
    if (!isValid) {
      console.log('not valid');
      return;
    }
    const requst: TypeUpdateAddressReq = {
      address: formValues.address,
      area: formValues.area!,
      area_id: formValues.area_id!,
      block: formValues.block!,
      block_id: formValues.block_id!,
      floor: formValues.floor!,
      landmark: formValues.landmark!,
      latitude: formValues.latitude!,
      longitude: formValues.longitude!,
      room_number: formValues.room_number!,
      street: formValues.street!,
      street_id: formValues.street_id!,
      ...(formValues.building
        ? {
            building: formValues.building,
            building_id: formValues.building_id,
          }
        : {}),
    };

    try {
      const res = await orderService.updateAddress(
        requst,
        data.fleetx_order_number
      );
      console.log('Address updated successfully:', res);
      await fetchOrderDetails();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <form>
        <DialogTrigger asChild>
          <Button className="absolute !p-1 h-auto top-2 right-2">
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-fit">
          <DialogHeader>
            <DialogTitle>Edit Drope Location</DialogTitle>
          </DialogHeader>
          <hr />
          <Form {...form}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="grid gap-6 md:grid-cols-2"
            >
              {/* Address */}
              <AddressLandmarkFields
                form={form}
                landmarkFieldName="address"
                isMap
              />

              {/* Additional Info */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Additional Info</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Landmark, directions, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Floor */}
              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3rd Floor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Room */}
              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room No.</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 302" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Latitude */}
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input placeholder="29.38530684" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Longitude */}
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input placeholder="47.99402565" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <hr />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={async () => await handleSumbitAction()}
              type="submit"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditResiver;
