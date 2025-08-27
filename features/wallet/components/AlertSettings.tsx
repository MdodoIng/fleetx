"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";


export function AlertSettings() {
  const [alertValue, setAlertValue] = useState("12");
  const [method, setMethod] = useState<"email" | "phone">("email");

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Alert Settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Get notified before your balance runs out
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Enter amount"
            value={alertValue}
            onChange={(e) => setAlertValue(e.target.value)}
            className="w-40"
          />
          <span>KD</span>
        </div>

        <div className="flex gap-4">
          <Button
            variant={method === "email" ? "default" : "outline"}
            onClick={() => setMethod("email")}
          >
            Email
          </Button>
          <Button
            variant={method === "phone" ? "default" : "outline"}
            onClick={() => setMethod("phone")}
          >
            Phone
          </Button>
        </div>

        <p className="text-xs text-green-600">
          You’ll receive an {method} notification when your balance falls below{" "}
          {alertValue} KD
        </p>

        <Button>Save Settings</Button>
      </CardContent>
    </Card>
  );
}
