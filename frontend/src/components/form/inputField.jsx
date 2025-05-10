const InputField = ({
  label,
  type,
  id,
  placeholder,
  value,
  onChange,
  required,
}) => (
  <div>
    <label className="block text-md font-medium mb-2" htmlFor={id}>
      {label}
    </label>
    <input
      type={type}
      id={id}
      className="w-full px-4 py-2 bg-[#0F3D57] border border-[#1F5F77] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8D9]"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default InputField;
