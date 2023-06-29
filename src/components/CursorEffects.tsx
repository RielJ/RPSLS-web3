"use client";
import React, { useEffect, useRef } from "react";
import styles from "./CursorEffects.module.scss";

export const CursorEffects = () => {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: PointerEvent) => {
      const { pageX, pageY } = event;
      blobRef.current &&
        blobRef.current.animate(
          {
            left: `${pageX - 20}px`,
            top: `${pageY - 20}px`,
          },
          { duration: 500, fill: "forwards" }
        );
    };
    window.addEventListener("pointermove", listener as EventListener);
    return () => {
      window.removeEventListener("pointermove", listener as EventListener);
    };
  }, [blobRef]);

  return (
    <div>
      {/* <div */}
      {/*   ref={blobRef} */}
      {/*   className="pointer-events-none absolute left-0 top-0 z-[99] h-10 w-10 rounded-full bg-white mix-blend-difference duration-75 ease-in-out" */}
      {/* > */}
      <div className={styles.blob} ref={blobRef}></div>
      <div className={styles.blur}></div>
      {/* </div> */}
    </div>
  );
};
