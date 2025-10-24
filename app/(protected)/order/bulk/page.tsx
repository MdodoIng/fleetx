'use client';
import AlertMessage from '@/features/orders/components/AlertMessage';
import PickUpForm from '@/features/orders/components/create/PickUpForm';
import WalletCard from '@/features/orders/components/WalletCard';
import { usePickUpFormValuesForPickUp } from '@/features/orders/libs/helpers';
import {
  pickUpSchema,
  TypePickUpSchema,
} from '@/features/orders/validations/order';
import { CreateFallback } from '@/shared/components/fetch/fallback';
import DriverSelect from '@/shared/components/selectors/DriverSelect';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dashboard,
  DashboardContent,
  DashboardFooter,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Input } from '@/shared/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { commonConstants } from '@/shared/constants/storageConstants';
import { orderService } from '@/shared/services/orders';
import { BulkDropOff } from '@/shared/types/orders';
import { useVendorStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ExcelJS from 'exceljs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function BulkOrderPage() {
  const { branchId, vendorId, selectedBranch, selectedVendor } =
    useVendorStore();

  const [loading, setLoading] = useState(true);
  const [bulkDropOffs, setBulkDropOffs] = useState<BulkDropOff[]>([]);
  const [selectedDropOffs, setSelectedDropOffs] = useState<BulkDropOff[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<any>();
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
        toast.warning('Please select a vendor');
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
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (!data) return;

        try {
          const workbook = new ExcelJS.Workbook();

          if (ext === 'xlsx') {
            await workbook.xlsx.load(data as ArrayBuffer);
          } else if (ext === 'csv') {
            // For CSV files, we'll read as text and parse manually
            const text = new TextDecoder().decode(data as ArrayBuffer);
            const lines = text.split('\n');
            const headers = lines[0].split(',').map((h) => h.trim());
            const jsonData = lines.slice(1).map((line) => {
              const values = line.split(',');
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index]?.trim() || '';
              });
              return row;
            });

            if (jsonData.length === 0) {
              toast.warning('Uploaded file is empty');
              if (fileInputRef.current) fileInputRef.current.value = '';
              return;
            }

            const dropOffs: BulkDropOff[] = jsonData.map(
              (row: any, index: number) => {
                const amountToCollect = parseFloat(row['COD']) || 0;
                const paymentDisplayType =
                  amountToCollect > 0 ? 'COD' : 'Prepaid';
                const address =
                  `${row['Area'] || ''}, Block: ${row['Block'] || ''}, Street: ${row['Street'] || ''}, House: ${row['House'] || ''}, Avenue: ${row['Avenue'] || ''}`.trim();
                return {
                  id: index + 1,
                  customer_name: row['Customer Name'] || '',
                  mobile_number: row['Phone Number'] || '',
                  address: address,
                  driver_instructions: row['Note'] || '',
                  amount_to_collect: amountToCollect,
                  payment_display_type: paymentDisplayType,
                  enableChecked: false,
                  area: row['Area'],
                  block: row['Block'],
                  House: row['House'],
                  building: row['Building'],
                  street: row['Street'],
                  avenue: row['Avenue'],
                };
              }
            );

            setBulkDropOffs(dropOffs);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
          }

          const worksheet = workbook.worksheets[0];
          if (!worksheet) {
            toast.warning('No worksheet found in the file');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
          }

          const jsonData: any[] = [];
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header row
            const rowData: any = {};
            row.eachCell((cell, colNumber) => {
              const header =
                worksheet.getRow(1).getCell(colNumber).value?.toString() || '';
              rowData[header] = cell.value?.toString() || '';
            });
            jsonData.push(rowData);
          });

          if (jsonData.length === 0) {
            toast.warning('Uploaded file is empty');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
          }

          const dropOffs: BulkDropOff[] = jsonData.map(
            (row: any, index: number) => {
              const amountToCollect = parseFloat(row['COD']) || 0;
              const paymentDisplayType =
                amountToCollect > 0 ? 'COD' : 'Prepaid';
              const address =
                `${row['Area'] || ''}, Block: ${row['Block'] || ''}, Street: ${row['Street'] || ''}, House: ${row['House'] || ''}, Avenue: ${row['Avenue'] || ''}`.trim();
              return {
                id: index + 1,

                customer_name: row['Customer Name'] || '',
                mobile_number: row['Phone Number'] || '',
                address: address,
                driver_instructions: row['Note'] || '',
                amount_to_collect: amountToCollect,
                payment_display_type: paymentDisplayType,
                enableChecked: false,
                area: row['Area'],
                block: row['Block'],
                House: row['House'],
                building: row['Building'],
                street: row['Street'],
                avenue: row['Avenue'],
              };
            }
          );

          setBulkDropOffs(dropOffs);
          if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
          console.error('Error reading file:', error);
          toast.error('Error reading file. Please check the file format.');
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };

      if (ext === 'xlsx') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
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
    const isPickupFormValid = await pickUpForm.trigger();
    if (!vendorId) {
      toast.error('Please select a vendor');
      return;
    }
    if (!branchId) {
      toast.error('Please select a branch');
      return;
    }
    if (!isPickupFormValid) {
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
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const updatedPickUp = usePickUpFormValuesForPickUp({
        pickUpFormValues: pickUpForm.getValues(),
      });

      const dropOffs = selectedDropOffs.map((dropOff) => ({
        order_index: dropOff.vendor_order_id,
        customer_name: dropOff.customer_name,
        mobile_number: dropOff.mobile_number,
        address: dropOff.address,
        specific_driver_instructions: dropOff.driver_instructions,
        amount_to_collect: dropOff.amount_to_collect,
        payment_type: dropOff.amount_to_collect > 0 ? 1 : 2,
        vendor_id: vendorId!,
        ...(dropOff.area && { area: dropOff.area }),
        ...(dropOff.block && { block: dropOff.block }),
        ...(dropOff.building && { building: dropOff.building }),
        ...(dropOff.street && { street: dropOff.street }),
        ...(dropOff.avenue && { avenue: dropOff.avenue }),
      }));

      const orders = {
        branch_id: branchId,
        vendor_id: vendorId,
        vendor_order_id: null,
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

                          {/*<TableHead>Order ID</TableHead>*/}
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
                            {/*<TableCell>{drop.vendor_order_id}</TableCell>*/}
                            <TableCell>{drop.customer_name}</TableCell>
                            <TableCell>{drop.mobile_number}</TableCell>
                            <TableCell>{drop.address}</TableCell>
                            <TableCell>{drop.driver_instructions}</TableCell>
                            <TableCell>{drop.amount_to_collect}</TableCell>
                            <TableCell>{drop.payment_display_type}</TableCell>
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
        <DashboardFooter>
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
