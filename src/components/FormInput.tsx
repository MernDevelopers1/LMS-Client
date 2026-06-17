type FormInputProps = {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  error?: string | null;
  onChange: (value: string) => void;
};

export default function FormInput({
  label,
  id,
  name,
  type = "text",
  value,
  placeholder,
  autoComplete,
  disabled,
  error,
  onChange,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-2xl border px-4 py-3 text-base transition focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-100 ${
          error
            ? "border-rose-400 bg-rose-50 focus:border-rose-500"
            : "border-slate-300 bg-white focus:border-blue-400"
        }`}
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
