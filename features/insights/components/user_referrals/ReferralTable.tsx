import ReferralRow from "./ReferralRow";

export default function ReferralTable({ data }: { data: any[] }) {
  return (
    <div className="w-full">
      {/* Table Header */}
      <div className="flex bg-[#b9cbd7] rounded-md text-white text-sm font-bold py-2 px-2">
        <div className="flex-1 text-center">Referral</div>
        <div className="flex-1 text-center">Order Date</div>
        <div className="flex-1 text-center">Order</div>
        <div className="flex-1 text-center">Vendor</div>
        <div className="flex-1 text-center">Branch</div>
        <div className="flex-1 text-center">Delivery Fee</div>
      </div>

      {/* Table Rows */}
      {data.map((item, index) => (
        <ReferralRow key={index} item={item} index={index} />
      ))}
    </div>
  );
}
