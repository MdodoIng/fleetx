import * as ExcelJS from 'exceljs';

type ExportType = 'xlsx' | 'csv';

export interface TableExportProps {
  data: any[];
  exclude?: string[];
  title: string;
  type?: ExportType;
}

//   Helper: Flatten nested objects (e.g. dropoff.id → dropoff.id)
const flattenObject = (obj: any, parentKey = '', res: any = {}) => {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${parentKey}-${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, newKey, res);
    } else {
      res[newKey] = value;
    }
  }
  return res;
};

export default function tableExport({
  data,
  exclude = [],
  title,
  type = 'xlsx',
}: TableExportProps) {
  if (!data || data.length === 0) return;

  // 1️⃣ Flatten and prepare data
  const flattenedData = data.map((d) => flattenObject(d));

  // 2️⃣ Determine all unique keys (columns)
  let keys = Array.from(
    new Set(flattenedData.flatMap((obj) => Object.keys(obj)))
  );

  // 3️⃣ Exclude unwanted keys
  if (exclude.length > 0) {
    keys = keys.filter((key) => !exclude.includes(key));
  }

  // 4️⃣ Create final dataset for export
  const exportData = flattenedData.map((obj) => {
    const filtered: Record<string, any> = {};
    keys.forEach((key) => {
      filtered[key] =
        obj[key] !== null && obj[key] !== undefined ? obj[key] : '';
    });
    return filtered;
  });

  // 5️⃣ Export logic
  if (type === 'xlsx') {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title || 'Sheet1');

    // Add headers
    worksheet.addRow(keys);

    // Add data rows
    exportData.forEach((row) => {
      const values = keys.map((key) => row[key] || '');
      worksheet.addRow(values);
    });

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6E6' }
    };

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      column.width = Math.max(column.width || 10, 15);
    });

    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title || 'export'}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  } else if (type === 'csv') {
    // Create CSV content
    const csvContent = [
      keys.join(','),
      ...exportData.map(row =>
        keys.map(key => {
          const value = row[key] || '';
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title || 'export'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
