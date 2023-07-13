import { useMutation } from "@tanstack/react-query";

interface IInputData {
  move: string;
  moveIV: string;
}

interface IOutputData {
  data: string;
}

export const useDecrypt = () => {
  return useMutation<IOutputData, unknown, IInputData>({
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
      return response.json();
    },
  });
};
