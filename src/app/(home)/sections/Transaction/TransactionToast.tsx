import { type ToasterToast, useToastLoader } from "@/components";
import { useEffect, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
} from "wagmi";

interface ITransactionToast {
  hash: `0x${string}`;
  removeTransaction: ({ hash }: { hash: `0x${string}` }) => void;
}

export const TransactionToast = ({
  hash,
  removeTransaction,
}: ITransactionToast) => {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [loaded, setLoaded] = useState(false);
  const { toast: toastLoader } = useToastLoader();
  const [currentToast, setCurrentToast] = useState<
    | {
        id: string;
        dismiss: () => void;
        update: (props: ToasterToast) => void;
      }
    | undefined
  >();

  const { data, isError, isLoading } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: loaded,
    },
  });

  useEffect(() => {
    async function load() {
      if (!publicClient) return;
      const transaction = await publicClient.getTransaction({ hash });

      if (transaction.from === address) {
        if (transaction.blockNumber) {
          removeTransaction({ hash });
        } else {
          setCurrentToast(
            toastLoader({
              title: "Creating an RPS Game",
              description: "Deploying Contract...",
            }),
          );
          setLoaded(true);
        }
      } else removeTransaction({ hash });
    }

    load();
  }, []);

  if (!loaded) return null;
};
