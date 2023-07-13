import { Games, Navbar } from "./sections";

function Page() {
  return (
    <>
      <main className="container relative w-full min-h-screen flex flex-col justify-center items-center z-10">
        <Navbar />
        <Games />
        {/* <Transactions /> */}
      </main>
    </>
  );
}

export default Page;
