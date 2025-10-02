
import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  unit?: string;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', placeholder, unit, className }) => (
  <div className={`flex flex-col ${className}`}>
    <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={e => onChange(e)}
        placeholder={placeholder}
        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-base"
      />
      {unit && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">{unit}</span>}
    </div>
  </div>
);

interface RadioGroupProps {
  label: string;
  name: string;
  value: string;
  options: { label: string; value: string }[];
  // FIX: Widen onChange prop type to accept a general handler.
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, value, options, onChange, className }) => (
  <div className={className}>
    <p className="mb-3 text-sm font-medium text-gray-700">{label}</p>
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-2">
      {options.map(option => (
        <div key={option.value} className="flex items-center">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={e => onChange(e)}
            className="h-5 w-5 sm:h-4 sm:w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
          />
          <label htmlFor={`${name}-${option.value}`} className="ml-2 block text-sm text-gray-800">{option.label}</label>
        </div>
      ))}
    </div>
  </div>
);

interface CheckboxGroupProps {
  label: string;
  name: string;
  values: string[];
  options: { label: string; value: string }[];
  // FIX: Widen onChange prop type to accept a general handler.
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, name, values, options, onChange, className }) => (
  <div className={className}>
    <p className="mb-3 text-sm font-medium text-gray-700">{label}</p>
    <div className="flex flex-col gap-3 sm:gap-2">
      {options.map(option => (
        <div key={option.value} className="flex items-center">
          <input
            type="checkbox"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={values.includes(option.value)}
            onChange={e => onChange(e)}
            className="h-5 w-5 sm:h-4 sm:w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          />
          <label htmlFor={`${name}-${option.value}`} className="ml-2 block text-sm text-gray-800">{option.label}</label>
        </div>
      ))}
    </div>
  </div>
);


interface CheckboxFieldProps {
    label: string;
    name: string;
    checked: boolean;
    // FIX: Widen onChange prop type to accept a general handler.
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, name, checked, onChange, className }) => (
    <div className={`flex items-center ${className}`}>
        <input
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            onChange={e => onChange(e)}
            className="h-5 w-5 sm:h-4 sm:w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
        />
        <label htmlFor={name} className="ml-2 block text-sm text-gray-800">{label}</label>
    </div>
);


interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  // FIX: Widen onChange prop type to accept a general handler.
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({ label, name, value, onChange, placeholder, rows = 3, className }) => (
  <div className={`flex flex-col ${className}`}>
    <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={e => onChange(e)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-base resize-vertical"
    />
  </div>
);

interface SliderFieldProps {
  label: string;
  name: string;
  value: number;
  // FIX: Widen onChange prop type to accept a general handler.
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const SliderField: React.FC<SliderFieldProps> = ({ label, name, value, onChange, min = 0, max = 10, step = 1, className }) => (
  <div className={`flex flex-col ${className}`}>
    <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-700 flex justify-between items-center">
      <span className="flex-1">{label}</span>
      <span className="font-bold text-teal-600 bg-teal-100 rounded-md px-2 py-1 text-sm ml-2">{value}</span>
    </label>
    <input
      type="range"
      id={name}
      name={name}
      value={value}
      onChange={e => onChange(e)}
      min={min}
      max={max}
      step={step}
      className="w-full h-3 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
    />
  </div>
);


interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  // FIX: Widen onChange prop type to accept a general handler.
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options, className }) => (
  <div className={`flex flex-col ${className}`}>
    <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={e => onChange(e)}
      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-white text-base"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);