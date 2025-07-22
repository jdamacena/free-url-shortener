"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";

export function ToastButton() {
  const { toast } = useToast();
  return (
    <button
      onClick={() =>
        toast({
          title: "Hello",
          description: "This is a client-side toast",
        })
      }
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
    >
      Show Toast
    </button>
  );
}
