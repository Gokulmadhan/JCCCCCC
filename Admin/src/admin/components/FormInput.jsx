import React from "react";

export default function FormInput({ label, name, type = "text", placeholder, value, onChange, required = true }) {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        required={required}
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
