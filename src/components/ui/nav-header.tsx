"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

type Position = { left: number; width: number; opacity: number };

export function NavHeader({ children }: { children?: React.ReactNode }) {
  const [position, setPosition] = useState<Position>({ left: 0, width: 0, opacity: 0 });

  return (
    <ul
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
      className="relative mx-auto flex w-fit rounded-full border-2 border-foreground bg-background p-1"
    >
      {children ?? (
        <>
          <NavTab setPosition={setPosition}>Home</NavTab>
          <NavTab setPosition={setPosition}>Pricing</NavTab>
          <NavTab setPosition={setPosition}>About</NavTab>
          <NavTab setPosition={setPosition}>Services</NavTab>
          <NavTab setPosition={setPosition}>Contact</NavTab>
        </>
      )}
      <NavCursor position={position} />
    </ul>
  );
}

export const NavTab = React.forwardRef<
  HTMLLIElement,
  {
    children: React.ReactNode;
    setPosition: (p: Position) => void;
    onClick?: () => void;
  } & React.HTMLAttributes<HTMLLIElement>
>(({ children, setPosition, onClick, ...props }, forwardedRef) => {
  const innerRef = useRef<HTMLLIElement>(null);
  React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLLIElement);

  const handleEnter = () => {
    if (!innerRef.current) return;
    const { width } = innerRef.current.getBoundingClientRect();
    setPosition({ width, opacity: 1, left: innerRef.current.offsetLeft });
  };

  return (
    <li
      ref={innerRef}
      onMouseEnter={handleEnter}
      onClick={onClick}
      {...props}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-sm"
    >
      {children}
    </li>
  );
});
NavTab.displayName = "NavTab";

export const NavCursor = ({ position }: { position: Position }) => {
  return (
    <motion.div
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-foreground md:h-12"
    />
  );
};

export default NavHeader;
