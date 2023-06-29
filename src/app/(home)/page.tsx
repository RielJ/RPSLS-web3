"use client";
import { useState, useEffect } from "react";
import { Main, Navbar } from "./sections";
import { CursorEffects } from "@/components";

export function Page() {
  const [width, setWidth] = useState<number>(0);

  // TODO: Determine how to disable CursorEffects when
  // it's on touch only devices.
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    setWidth(window.innerWidth);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;
  return (
    <>
      {!isMobile && <CursorEffects />}
      <main className="container relative w-full min-h-screen flex flex-col justify-center items-center z-10">
        <Navbar />
        <Main />
      </main>
    </>
  );
}

export default Page;
