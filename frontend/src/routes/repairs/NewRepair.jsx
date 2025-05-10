import { useEffect, useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosSave } from "react-icons/io";
import { useLocation } from "react-router-dom";
import Footer from "../../components/footer";
import DatePickerField from "../../components/form/datePicker";
import InputField from "../../components/form/inputField";
import PriceEstimate from "../../components/form/priceEstimate";
import SelectComponent from "../../components/form/select";
import TimeSlots from "../../components/form/timeSlots";
import Navbar from "../../components/navbar";
import "./datepicker.css";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const generateTimeSlots = (startHour, endHour) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
  }
  return slots;
};

export default function NewRepair() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [client, setClient] = useState("");
  const [device, setDevice] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [email, setEmail] = useState("");
  const estimatedPrice = 100;

  const deviceOptions = [
    { value: "laptop", label: "Laptop" },
    { value: "desktop", label: "Desktop" },
    { value: "tablet", label: "Tablet" },
    { value: "phone", label: "Phone" },
  ];

  const servicesOptions = [
    { value: "screen-replacement", label: "Screen Replacement" },
    { value: "battery-replacement", label: "Battery Replacement" },
    { value: "software-issues", label: "Software Issues" },
    { value: "virus-removal", label: "Virus Removal" },
  ];

  const query = useQuery();
  const selectedType = query.get("type");

  const [selectedServiceOption, setSelectedServiceOption] = useState(null);

  useEffect(() => {
    if (selectedType) {
      const defaultOption = servicesOptions.find(
        (opt) => opt.value === selectedType
      );
      if (defaultOption) {
        setServiceType(defaultOption.value);
        setSelectedServiceOption(defaultOption);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  useEffect(() => {
    if (selectedDate) {
      const stored = JSON.parse(localStorage.getItem("bookings") || "{}");
      setBookedSlots(stored[selectedDate] || []);
      setTimeSlots(generateTimeSlots(9, 18));
    }
  }, [selectedDate]);

  const handleBooking = (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }

    console.log("Booking confirmed!", {
      client,
      email,
      device,
      serviceType,
      issueDescription,
      date: selectedDate,
      time: selectedTime,
    });
  };

  return (
    <div className="bg-[#0F3D57] text-white font-sans min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow px-6 md:px-12 py-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#00B8D9] mb-10">
          New Repair
        </h2>

        <form
          className="bg-[#145374] p-8 rounded-lg shadow-lg max-w-2xl mx-auto space-y-6"
          onSubmit={handleBooking}
        >
          <InputField
            label="Name"
            type="text"
            id="client"
            placeholder="Client's name"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />

          <InputField
            label="Email"
            type="email"
            id="email"
            placeholder="Client's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <label className="block text-md font-medium mb-2" htmlFor="device">
              Device
            </label>
            <SelectComponent
              options={deviceOptions}
              required
              onChange={(option) => setDevice(option.value)}
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2" htmlFor="device">
              Service Type
            </label>
            <SelectComponent
              options={servicesOptions}
              value={selectedServiceOption}
              onChange={(option) => {
                setServiceType(option.value);
                setSelectedServiceOption(option);
              }}
              required
            />
          </div>

          <InputField
            label="Issue Description"
            type="textarea"
            id="issue"
            placeholder="Describe the problem with the device..."
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            required
          />

          <DatePickerField
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          {selectedDate && (
            <TimeSlots
              timeSlots={timeSlots}
              bookedSlots={bookedSlots}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          )}

          <PriceEstimate
            client={client}
            device={device}
            serviceType={serviceType}
            issueDescription={issueDescription}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            estimatedPrice={estimatedPrice}
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#00B8D9] text-[#0F3D57] font-semibold px-6 py-3 rounded-lg hover:bg-[#00a0c0] transition cursor-pointer"
          >
            <IoIosSave size={20} />
            Book Repair
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
