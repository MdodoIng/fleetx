import {
  addressSchema,
  TypeAddressSchema,
} from '@/features/orders/validations/editResiver';
import AddressLandmarkFields from '@/shared/components/selectors/InputSearch';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { useDir } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';
import { orderService } from '@/shared/services/orders';
import {
  TypeOrderHistoryList,
  TypeUpdateAddressReq,
} from '@/shared/types/orders';
import { useVenderStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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

  const t = useTranslations();
  const { dirState } = useDir();
  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <form>
        <DialogTrigger asChild>
          <Button
            className={cn(
              'absolute !p-1 h-auto top-2 ',
              dirState ? 'left-2' : 'right-2'
            )}
          >
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-fit">
          <DialogHeader className="flex justify-start">
            <DialogTitle>
              {t('component.features.orders.live.edit-drope-location')}
            </DialogTitle>
          </DialogHeader>
          <hr className="border-dark-grey/10 " />
          <Form {...form}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="grid gap-6 md:grid-cols-2"
            >
              {/* Address */}
              <AddressLandmarkFields
                form={form}
                landmarkFieldName={t(
                  'component.features.orders.create.form.address.label'
                )}
                isMap
              />

              {/* Additional Info */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      {t(
                        'component.features.orders.create.form.additionalAddress.label'
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'component.features.orders.create.form.additionalAddress.placeholder'
                        )}
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
                    <FormLabel>
                      {t('component.features.orders.create.form.floor.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'component.features.orders.create.form.floor.placeholder'
                        )}
                        {...field}
                      />
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
                    <FormLabel>
                      {t(
                        'component.features.orders.create.form.latitude.label'
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'component.features.orders.create.form.latitude.placeholder'
                        )}
                        {...field}
                      />
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
                    <FormLabel>
                      {t(
                        'component.features.orders.create.form.longitude.label'
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'component.features.orders.create.form.longitude.placeholder'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-none bg-[#6750A414] text-[#1D1B20]"
              >
                {t('component.features.orders.create.footer.button.cancel')}
              </Button>
            </DialogClose>
            <Button
              onClick={async () => await handleSumbitAction()}
              type="submit"
            >
              {t('component.features.orders.save-changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditResiver;
