import { useToastLoader, useToast, ToasterToast } from "@/components";
import { useState } from "react";

export const useRPSToast = () => {
  const { toast: toastLoader } = useToastLoader();
  const { toast } = useToast();
  const [currentToast, setCurrentToast] = useState<
    | {
        id: string;
        dismiss: () => void;
        update: (props: ToasterToast) => void;
      }
    | undefined
  >();

  return { toastLoader, toast, currentToast, setCurrentToast };
};
