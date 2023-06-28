"use client";
import { ConnectButton, Connected } from "@/components";
import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.scss";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 z-[200] w-full sm:px-16 px-6 py-6",
        scrolled && styles.scrolled
      )}
    >
      <div className="flex items-end justify-end mx-auto inset-0 max-w-7xl">
        <Connected>
          <ConnectButton />
        </Connected>
      </div>
    </div>
  );
};
