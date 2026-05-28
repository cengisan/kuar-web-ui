"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function CashierPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const businessId = params.id;

  useEffect(() => {
    router.replace(`/business/${businessId}/areas?mode=cashier`);
  }, [router, businessId]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
