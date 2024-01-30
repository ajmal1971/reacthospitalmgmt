/* eslint-disable react/prop-types */
import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-gray-700 text-lg font-bold mb-2"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        className={`shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;
