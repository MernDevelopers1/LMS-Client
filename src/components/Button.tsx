"use client";

import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

type SharedButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
};

type ButtonAsButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLinkProps = SharedButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-sm",
};

const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const buttonClasses = cn(
    "inline-flex items-center justify-center rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link
        href={href}
        className={buttonClasses}
        {...(linkProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
      type={props.type ?? "button"}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
