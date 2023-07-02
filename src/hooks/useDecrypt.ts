import { useMutation } from "@tanstack/react-query";

interface IInputData {
  move: string;
  moveIV: string;
}

export const useDecrypt = () => {
  return useMutation<number, unknown, IInputData>({
    mutationFn: async ({ move, moveIV }) => {
      const response = await fetch(
        `/api/crypt/decrypt?move=${move}&moveIV=${moveIV}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log({ response });
      return response.json();
    },
  });
};
