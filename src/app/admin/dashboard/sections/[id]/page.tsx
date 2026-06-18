"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";

export default function SectionIdIndex() {
  const router = useRouter();
  const params = useParams();
  const idString =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  React.useEffect(() => {
    if (idString)
      router.replace(`/admin/dashboard/sections/${idString}/detail`);
  }, [idString, router]);

  return <div className="p-6">Redirecting to detail...</div>;
}
