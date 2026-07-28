"use client";

import { useReveal } from "@/hooks/useReveal";

type RevealProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  threshold?: number;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Reveal<T extends React.ElementType = "div">({
  as,
  className = "",
  children,
  threshold = 0.18,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as React.ElementType;
  const { ref, className: revealClass } = useReveal<HTMLElement>(threshold);

  return (
    <Tag
      ref={ref}
      className={[revealClass, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
