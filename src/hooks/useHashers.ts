import { useHasherHash } from "@/generated";
import { HASHER_ADDRESS } from "@/constants";

const salt = process.env.SALT;

export const useHashers = () => {
  // TODO Implement a per chain basis of hasher address
  // const { chain, chains } = useNetwork()
  const address = HASHER_ADDRESS["MUMBAI"];
  const { data: rock } = useHasherHash({
    address,
    args: [1, BigInt(salt || "0")],
  });
  const { data: paper } = useHasherHash({
    address,
    args: [2, BigInt(salt || "0")],
  });
  const { data: scissor } = useHasherHash({
    address,
    args: [3, BigInt(salt || "0")],
  });
  const { data: spock } = useHasherHash({
    address,
    args: [4, BigInt(salt || "0")],
  });
  const { data: lizard } = useHasherHash({
    address,
    args: [5, BigInt(salt || "0")],
  });

  return { data: [rock, paper, scissor, spock, lizard] };
};
