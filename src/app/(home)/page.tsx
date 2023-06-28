import { ConnectButton, Connected, NotConnected } from "@/components";
import { Navbar } from "./sections/Navbar";

export function Page() {
  return (
    <main className="container relative w-full min-h-screen flex flex-col justify-center items-center">
      <Navbar />
      <h1>Kleros RPS</h1>

      <NotConnected>
        <ConnectButton />
      </NotConnected>
      <Connected>
        <div></div>
      </Connected>
    </main>
  );
}

export default Page;
