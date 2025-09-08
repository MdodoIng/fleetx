import { BalanceReportItem } from '@/features/wallet/type';
import { TypeOrderHistoryList } from '@/shared/types/orders';
import { TypeWalletTransactionHistoryRes } from '@/shared/types/report';
import { useOrderStore } from '@/store/useOrderStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function useTableExport() {
  const exportOrdersToPDF = (data: TypeOrderHistoryList[]) => {
    if (!data || data.length === 0) return;

    const doc = new jsPDF();

    const head = [
      [
        'Order No',
        'Customer',
        'Phone',
        'From',
        'To',
        'Amount',
        'Status',
        'Driver',
        'Driver Phone',
        'Created At',
      ],
    ];

    const rows = data.map((o: any) => [
      o.fleetx_order_number,
      o.customer_name,
      o.phone_number,
      o.from,
      o.to,
      o.amount_to_collect,
      o.class_status,
      o.driver_name,
      o.driver_phone,
      o.creation_date ? new Date(o.creation_date).toLocaleString() : '',
    ]);

    autoTable(doc, {
      head,
      body: rows,
      styles: { fontSize: 8 },
    });

    doc.save('orders.pdf');
  };

  const exportOrdersToCSV = (
    data:
      | TypeOrderHistoryList[]
      | TypeWalletTransactionHistoryRes['data']
      | BalanceReportItem[],
    type: 'wallet history' | 'order history' | 'balance-report',
    fname?: string
  ) => {
    if (!data || data.length === 0) return;

    const separator = ',';
    const filename = fname ?? type + '.csv';
    let keys;
    switch (type) {
      case 'order history':
        keys = [
          'fleetx_order_number',
          'customer_name',
          'phone_number',
          'from',
          'to',
          'amount_to_collect',
          'class_status',
          'driver_name',
          'driver_phone',
          'creation_date',
        ];
        break;
      case 'wallet history':
        keys = [
          'balance.balance_amount',
          'updated_at',
          'txn_number',
          'txn_amount',
          'txn_type',
          'txn_at',
          'operation_type',
          'vendor_id',
          'branch_id',
          'initial_amount',
          'tax_amount',
          'wallet_type',
          'source',
          'delivery_model',
          'delivery_distance',
        ];
        break;
      case 'balance-report':
        const firstItem = data[0];
        keys = firstItem ? Object.keys(firstItem) : [];
        break;
    }

    const csvContent =
      keys.join(separator) +
      '\n' +
      data
        .map((order: any) =>
          keys
            .map((k) => {
              let cell =
                order[k] === null || order[k] === undefined ? '' : order[k];
              cell = cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator)
        )
        .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    exportOrdersToPDF,
    exportOrdersToCSV,
  };
}

export default useTableExport;
