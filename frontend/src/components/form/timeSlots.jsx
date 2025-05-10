const TimeSlots = ({
  timeSlots,
  bookedSlots,
  selectedTime,
  setSelectedTime,
}) => (
  <div>
    <span className="block text-md font-medium mb-2">Available Time Slots</span>
    <div className="flex flex-wrap gap-2">
      {timeSlots.map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedTime === slot;
        return (
          <button
            type="button"
            key={slot}
            disabled={isBooked}
            onClick={() => setSelectedTime(slot)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isBooked
                ? "bg-gray-500 cursor-not-allowed"
                : isSelected
                ? "bg-[#00B8D9] text-[#0F3D57]"
                : "bg-[#1F5F77] hover:bg-[#2c6b8e]"
            }`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  </div>
);

export default TimeSlots;
