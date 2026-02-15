"use client";
import { config } from "@/lib";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { useState } from "react";
import { useWatchPendingTransactions } from "wagmi";
import { TransactionToast } from "./TransactionToast";

// TODO: Synchronize Transaction Notifications across multiple tabs.
export const Transactions = () => {
  const [transactions, setTransactions] = useState<`0x${string}`[]>([]);

  useWatchPendingTransactions({
    onTransactions: (hashes) => {
      setTransactions(hashes);
    },
  });

  const removeTransaction = ({ hash }: { hash: `0x${string}` }) => {
    setTransactions(transactions?.filter((t) => t !== hash));
  };

  return (
    <ToastProvider>
      {transactions?.map((transaction) => (
        <TransactionToast
          key={transaction}
          hash={transaction}
          removeTransaction={removeTransaction}
        />
      ))}
      <ToastViewport className="space-y-2" />
    </ToastProvider>
  );
};
