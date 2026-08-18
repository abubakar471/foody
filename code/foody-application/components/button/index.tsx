import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blue" | "outline" | "default" | "green";
  children?: React.ReactNode;
}

export default function Button({
  children,
  variant = "default",
  disabled = false,
  onClick,
  className = "",
  ...props
}: ButtonProps) {
  // Base classes for a modern button
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Tailwind variants replacing CSS Module styles
  const variants = {
    default: "bg-gray-100 text-gray-400 hover:bg-gray-200 focus:ring-gray-400",
    blue: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    green: "bg-green-500 text-white hover:text-green-700 focus:ring-green-500",
    outline:
      "border border-gray-300 text-gray-400 hover:bg-gray-50 focus:ring-blue-500",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
