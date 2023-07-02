import { useMutation } from "@tanstack/react-query";

interface IInputData {
  move: number;
}

export const useKeccak256 = () => {
  return useMutation<string, unknown, IInputData>({
    mutationFn: async ({ move }) => {
      const response = await fetch(`/api/crypt/keccak256?move=${move}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log({ response });
      return response.json();
    },
  });
};
