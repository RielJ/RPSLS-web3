import { Main, Navbar } from "./sections";

export function Page() {
  return (
    <>
      <main className="container relative w-full min-h-screen flex flex-col justify-center items-center z-10">
        <Navbar />
        <Main />
      </main>
    </>
  );
}

export default Page;
