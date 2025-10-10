import * as XLSX from 'xlsx';

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
    // Create a worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData, { header: keys });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title || 'Sheet1');

    // Adjust column width dynamically
    const colWidths = keys.map((k) => ({
      wch: Math.max(k.length, 15), // auto width
    }));
    worksheet['!cols'] = colWidths;

    // Generate Excel file
    XLSX.writeFile(workbook, `${title || 'export'}.xlsx`);
  } else if (type === 'csv') {
    const worksheet = XLSX.utils.json_to_sheet(exportData, { header: keys });
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title || 'export'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
