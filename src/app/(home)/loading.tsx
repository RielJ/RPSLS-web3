import { LoadingSpinner } from "@/components";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
}
