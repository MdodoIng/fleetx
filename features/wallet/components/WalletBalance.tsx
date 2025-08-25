"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card";


export function WalletBalance() {
  return (
    <Card className=" bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-lg">Wallet Balance</CardTitle>
          <p className="text-3xl font-bold mt-2">4.50 KD</p>
          <p className="text-sm mt-1">
            Low Balance Alert: Add credit to continue placing orders
          </p>
        </div>
        <Button className="bg-white text-indigo-600 hover:bg-gray-100">
          + Add Credit
        </Button>
      </CardHeader>
    </Card>
  );
}
