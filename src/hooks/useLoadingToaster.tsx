import { ToastType, useToast } from "@/components";
import { ReactNode } from "react";

const DescriptionElement = (description: ReactNode) => <div>{description}</div>;

export const useLoadingToaster = () => {
  const { toast: toastRaw, ...props } = useToast();

  const toast = ({ ...props }: ToastType) => {
    return toastRaw({
      ...props,
      duration: 0,
      description: DescriptionElement(props.description),
    });
  };

  return { toast, ...props };
};
