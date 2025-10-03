'use client';
import PickUpForm from '@/features/orders/components/create/PickUpForm';
import {
  Dashboard,
  DashboardContent,
  DashboardFooter,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import AlertMessage from '@/features/orders/components/AlertMessage';
import WalletCard from '@/features/orders/components/WalletCard';
import { useOrderStore, useVendorStore, useSharedStore } from '@/store';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  dropOffSchema,
  pickUpSchema,
  TypeDropOffSchema,
  TypePickUpSchema,
} from '@/features/orders/validations/order';
import useOrderCreate from '@/features/orders/hooks/useOrderCreate';
import { vendorService } from '@/shared/services/vendor';
import { orderService } from '@/shared/services/orders';
import { CreateFallback } from '@/shared/components/fetch/fallback';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { TypeDropOffs } from '@/shared/types/orders';
import { usepickUpFormValuesForPickUp } from '@/features/orders/libs/helpers';
import { fleetService } from '@/shared/services/fleet';
import DriverSelect from '@/shared/components/selectors/DriverSelect';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Card, CardContent } from '@/shared/components/ui/card';
import { classForInput, Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { commonConstants } from '@/shared/constants/storageConstants';

// Define interfaces for bulk drop-off data and driver
interface BulkDropOff {
  id: number;
  vendorOrderId: string;
  customerName: string;
  mobileNumber: string;
  address: string;
  driverInstructions: string;
  amountToCollect: number;
  paymentDisplayType: string;
  enableChecked: boolean;
}

export default function BulkOrderPage() {
  const { branchId, vendorId, selectedBranch, selectedVendor } =
    useVendorStore();

  const [loading, setLoading] = useState(true);
  const [bulkDropOffs, setBulkDropOffs] = useState<BulkDropOff[]>([]);
  const [selectedDropOffs, setSelectedDropOffs] = useState<BulkDropOff[]>([]);
  const [selectedDriver, setSelectedDriver] = useState();
  const [enableHeaderChecked, setEnableHeaderChecked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize forms
  const pickUpForm = useForm<TypePickUpSchema>({
    resolver: zodResolver(pickUpSchema),
    defaultValues: {
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
      apartment_no: '',
      floor: '',
      additional_address: '',
      latitude: '',
      longitude: '',
    },
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  // Update pickup form with branch details
  const updatePickUpDetailsForBranchUser = useCallback(async () => {
    if (branchId && selectedBranch) {
      Object.entries(selectedBranch.address).forEach(([key, value]) => {
        pickUpForm.setValue(key as keyof TypePickUpSchema, value);
      });
      pickUpForm.setValue('customer_name', selectedBranch.name);
      pickUpForm.setValue('mobile_number', selectedBranch.mobile_number);
    }
    setLoading(false);
  }, [branchId, pickUpForm, selectedBranch]);

  // Handle file upload
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!vendorId) {
        toast.error('Please select a vendor');
        return;
      }
      const file = event.target.files?.[0];
      if (!file) return;

      const validExtensions = ['xlsx', 'csv'];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !validExtensions.includes(ext)) {
        toast.error('Invalid file type. Please upload .xlsx or .csv files.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
          toast.error('Uploaded file is empty');
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        const dropOffs: BulkDropOff[] = jsonData.map(
          (row: any, index: number) => ({
            id: index + 1,
            vendorOrderId: row['Order Id'] || `Order_${index + 1}`,
            customerName: row['Customer Name'] || '',
            mobileNumber: row['Mobile Number'] || '',
            address: row['Address'] || '',
            driverInstructions: row['Driver Instructions'] || '',
            amountToCollect: parseFloat(row['COD']) || 0,
            paymentDisplayType:
              row['Payment Type'] ||
              (parseFloat(row['COD']) > 0 ? 'COD' : 'Prepaid'),
            enableChecked: false,
          })
        );

        setBulkDropOffs(dropOffs);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsBinaryString(file);
    },
    [vendorId]
  );

  // Handle checkbox selection
  const handleHeaderSelect = (checked: boolean) => {
    setEnableHeaderChecked(checked);
    const updatedDropOffs = bulkDropOffs.map((dropOff) => ({
      ...dropOff,
      enableChecked: checked,
    }));
    setBulkDropOffs(updatedDropOffs);
    setSelectedDropOffs(checked ? updatedDropOffs : []);
  };

  const handleRowSelect = (dropOff: BulkDropOff, checked: boolean) => {
    const updatedDropOffs = bulkDropOffs.map((d) =>
      d.id === dropOff.id ? { ...d, enableChecked: checked } : d
    );
    setBulkDropOffs(updatedDropOffs);
    setSelectedDropOffs(
      checked
        ? [...selectedDropOffs, { ...dropOff, enableChecked: checked }]
        : selectedDropOffs.filter((d) => d.id !== dropOff.id)
    );
    setEnableHeaderChecked(
      updatedDropOffs.every((d) => d.enableChecked) &&
        updatedDropOffs.length > 0
    );
  };

  // Place bulk order
  const placeOrder = async () => {
    pickUpForm.trigger();
    if (!vendorId) {
      toast.error('Please select a vendor');
      return;
    }
    if (!branchId) {
      toast.error('Please select a branch');
      return;
    }
    if (!pickUpForm.formState.isValid) {
      toast.error('Please fill in all required pickup fields');
      return;
    }
    if (selectedDropOffs.length < commonConstants.bulkOrderLimit) {
      toast.error(
        `Minimum ${commonConstants.bulkOrderLimit} drop-off(s) required`
      );
      return;
    }
    if (!selectedDriver) {
      toast.error('Please select a driver');
      return;
    }

    try {
      const updatedPickUp = usepickUpFormValuesForPickUp({
        pickUpFormValues: pickUpForm.getValues(),
      });

      const dropOffs = selectedDropOffs.map((dropOff) => ({
        order_index: dropOff.vendorOrderId,
        customer_name: dropOff.customerName,
        mobile_number: dropOff.mobileNumber,
        address: dropOff.address,
        specific_driver_instructions: dropOff.driverInstructions,
        amount_to_collect: dropOff.amountToCollect,
        payment_type: dropOff.amountToCollect > 0 ? 1 : 2,
        vendor_id: vendorId!,
        address: dropOff.display_address,
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
      }));

      const orders = {
        branch_id: branchId,
        vendor_id: vendorId,

        pick_up: updatedPickUp,
        drop_offs: dropOffs,
        driver_id: selectedDriver ?? null,
        order_meta: { vendor_name: selectedVendor?.name },
      };

      const createOrderRes = await orderService.createBulkOrders(orders);
      console.log(createOrderRes);
      toast.success('Bulk order placed successfully!');
      setBulkDropOffs(
        bulkDropOffs.filter((d) => !selectedDropOffs.includes(d))
      );
      setSelectedDropOffs([]);
      setEnableHeaderChecked(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error placing bulk order:', error);
      toast.error('Failed to place bulk order');
    }
  };

  useEffect(() => {
    updatePickUpDetailsForBranchUser();
  }, [updatePickUpDetailsForBranchUser]);

  if (loading) return <CreateFallback />;

  console.log(pickUpForm.formState.errors);

  return (
    <>
      <AlertMessage type="mobile" />
      <Dashboard className="h-auto">
        <DashboardHeader>
          <DashboardHeaderRight>
            <AlertMessage type="laptop" />
          </DashboardHeaderRight>
          <WalletCard className="max-sm:w-full" />
        </DashboardHeader>
        <DashboardContent className="grid md:grid-cols-2 gap-4">
          <PickUpForm senderForm={pickUpForm} />
          <div className="space-y-4 h-full flex flex-col">
            <Input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="border-dark-grey/10 "
            />
            <DriverSelect
              value={selectedDriver}
              onChangeAction={setSelectedDriver}
              className="sm:w-full"
              classNameFroInput="h-14"
            />

            {bulkDropOffs.length > 0 && (
              <Card>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-off-white">
                        <TableRow>
                          <TableHead>
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                handleHeaderSelect(e.target.checked)
                              }
                              checked={enableHeaderChecked}
                            />
                          </TableHead>

                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer Name</TableHead>
                          <TableHead>Mobile Number</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Driver Instructions</TableHead>
                          <TableHead>COD</TableHead>
                          <TableHead>Payment Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bulkDropOffs.map((drop, index) => (
                          <TableRow
                            key={drop.id}
                            className={
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }
                          >
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={drop.enableChecked}
                                onChange={(e) =>
                                  handleRowSelect(drop, e.target.checked)
                                }
                              />
                            </TableCell>
                            <TableCell>{drop.vendorOrderId}</TableCell>
                            <TableCell>{drop.customerName}</TableCell>
                            <TableCell>{drop.mobileNumber}</TableCell>
                            <TableCell>{drop.address}</TableCell>
                            <TableCell>{drop.driverInstructions}</TableCell>
                            <TableCell>{drop.amountToCollect}</TableCell>
                            <TableCell>{drop.paymentDisplayType}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DashboardContent>
        <DashboardFooter className="md:relative">
          <Card className="w-full max-md:hidden bg-white py-4 ">
            <CardContent className="sm:rounded-[8px]  bg-white   flex  items-center justify-end   text-sm flex-wrap gap-x-10 gap-y-4 ">
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => {
                    setBulkDropOffs([]);
                    setSelectedDropOffs([]);
                    setEnableHeaderChecked(false);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  variant={'ghost'}
                  className="cursor-pointer bg-[#6750A414] text-[#1D1B20] w-1/3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={placeOrder}
                  disabled={selectedDropOffs.length === 0 || !selectedDriver}
                  className=""
                >
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </DashboardFooter>
      </Dashboard>
    </>
  );
}
