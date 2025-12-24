"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, TrendingUp } from "lucide-react";

export function StatusCards() {
  const [isOnline, setIsOnline] = useState(true);
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setIsProduction(
      window.location.hostname !== "localhost" &&
        !window.location.hostname.startsWith("127.") &&
        !window.location.hostname.startsWith("192.168.")
    );

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Website</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              isOnline ? "text-green-600" : "text-red-600"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </div>
          <p className="text-xs text-muted-foreground">madura.dev</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              isProduction ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {isProduction ? "Active" : "Development"}
          </div>
          <p className="text-xs text-muted-foreground">
            {isProduction ? "Komunitas aktif" : "Mode lokal"}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
