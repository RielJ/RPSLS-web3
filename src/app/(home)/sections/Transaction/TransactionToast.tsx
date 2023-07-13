import { useToastLoader, ToasterToast } from "@/components";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWaitForTransaction } from "wagmi";

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

  const { data, isError, isLoading } = useWaitForTransaction({
    hash,
    enabled: loaded,
  });

  useEffect(() => {
    async function load() {
      const transaction = await publicClient.getTransaction({ hash });

      if (transaction.from === address) {
        if (transaction.blockNumber) {
          removeTransaction({ hash });
        } else {
          setCurrentToast(
            toastLoader({
              title: "Creating an RPS Game",
              description: "Deploying Contract...",
            })
          );
          setLoaded(true);
        }
      } else removeTransaction({ hash });
    }

    load();
  }, []);

  if (!loaded) return null;
};
