"use client";
import { ConnectButton, Connected } from "@/components";
import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.scss";
import { FaHandScissors } from "react-icons/fa";

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
        "fixed top-0 left-0 z-[200] w-full py-6",
        scrolled && styles.scrolled
      )}
    >
      <nav className="flex items-center justify-between mx-auto inset-0 max-w-7xl">
        <div className="w-full font-logo">
          <FaHandScissors />
        </div>
        <div className="w-full flex items-end justify-end">
          <Connected>
            <ConnectButton />
          </Connected>
        </div>
      </nav>
    </div>
  );
};
