"use client";
import { useState } from "react";
import { OnTransactionsParameter } from "viem";
import { useWatchPendingTransactions } from "wagmi";
import { TransactionToast } from "./TransactionToast";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";

// TODO: Synchronize Transaction Notifications across multiple tabs.
export const Transactions = () => {
  const [transactions, setTransactions] = useState<
    OnTransactionsParameter | undefined
  >([]);

  useWatchPendingTransactions({
    listener: (hashes) => {
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
