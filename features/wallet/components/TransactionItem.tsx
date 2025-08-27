import { cn } from "@/shared/lib/utils";

type Props = {
  id: string;
  amount: number;
  type: "fee" | "recharge";
  date: string;
};

export function TransactionItem({ id, amount, type, date }: Props) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div>
        <p className="text-sm font-semibold">{id}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
      <div className="flex flex-col items-end">
        <p
          className={cn(
            "font-bold",
            amount > 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {amount > 0 ? "+" : ""}
          {amount} KD
        </p>
        <span
          className={cn(
            "text-xs rounded-full px-2 py-0.5 mt-1",
            type === "fee"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          )}
        >
          {type === "fee" ? "Delivery Fee" : "Wallet Recharged"}
        </span>
      </div>
    </div>
  );
}
