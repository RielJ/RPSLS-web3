"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/shadcn/ui/toast";
import { useToastLoader } from "@/components/shadcn/ui/use-toast-loader";

export function ToasterLoader() {
  const { toasts } = useToastLoader();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1 relative">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <span className="absolute top-4 right-4">
              <LoadingSpinner />
            </span>
            {action}
          </Toast>
        );
      })}
      <ToastViewport className="space-y-2" />
    </ToastProvider>
  );
}
