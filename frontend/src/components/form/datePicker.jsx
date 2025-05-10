// components/DatePickerField.js
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerField = ({ selectedDate, setSelectedDate }) => {
  return (
    <div>
      <label className="block text-md font-medium mb-2" htmlFor="date">
        Choose a Date
      </label>
      <DatePicker
        selected={selectedDate ? new Date(selectedDate) : null}
        onChange={(date) => {
          if (date) {
            const formatted = date.toISOString().split("T")[0];
            setSelectedDate(formatted);
          }
        }}
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
        className={
          "w-full px-4 py-2 bg-[#0F3D57] border border-[#1F5F77] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8D9]"
        }
        placeholderText="Select a date"
        id="date"
        required
        dayClassName={(date) => {
          const isToday =
            date.toISOString().split("T")[0] ===
            new Date().toISOString().split("T")[0];
          return isToday;
        }}
        highlightDates={[new Date()]}
      />
    </div>
  );
};

export default DatePickerField;
