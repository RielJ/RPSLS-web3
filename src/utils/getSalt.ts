import { Address, fromHex, parseEther } from "viem";

export const getSalt = ({
  address1,
  address2,
  stake,
  chainId,
}: {
  address1: Address | undefined;
  address2: Address;
  stake: string;
  chainId: number | undefined;
}): bigint => {
  const saltBN =
    (fromHex(address1 || "0x", "bigint") +
      fromHex(address2 || "0x", "bigint") +
      parseEther(stake)) /
    BigInt(chainId || 1);
  return saltBN;
};
