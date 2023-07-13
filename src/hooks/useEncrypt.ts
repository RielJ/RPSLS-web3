import { useMutation } from "@tanstack/react-query";

interface IOutputData {
  data: {
    move: string;
    moveIV: string;
  };
}

interface IInputData {
  move: number;
}

export const useEncrypt = () => {
  return useMutation<IOutputData, unknown, IInputData>({
    mutationFn: async ({ move }) => {
      const response = await fetch(`/api/crypt/encrypt?move=${move}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
};
