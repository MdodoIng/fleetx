export const paymentMap: Record<number, string> = {
  1: 'K-Net (Paid)',
  2: 'COD',
};

export const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-800',
  BUDDY_QUEUED: 'bg-yellow-100 text-yellow-800',
  ACTIVE: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
