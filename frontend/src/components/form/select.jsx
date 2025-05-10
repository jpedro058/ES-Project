import Select from "react-select";

const SelectComponent = ({ options, ...props }) => {
  return (
    <Select
      options={options}
      className="basic-single"
      classNamePrefix="select"
      name="device"
      isSearchable
      {...props}
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: "#0F3D57",
          borderColor: "#1F5F77",
          color: "white",
          "&:hover": {
            borderColor: "#00B8D9",
          },
        }),
        input: (base) => ({
          ...base,
          color: "white",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#145374",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "#00B8D9"
            : state.isFocused
            ? "#1F5F77"
            : "#145374",
          color: "white",
          cursor: "pointer",
        }),
        singleValue: (base) => ({
          ...base,
          color: "white",
        }),
      }}
    />
  );
};

export default SelectComponent;
