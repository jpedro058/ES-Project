import { useContext, useEffect, useMemo, useState } from "react";
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
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Datepicker.css";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function NewRepair() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [client, setClient] = useState("");
  const [device, setDevice] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const estimatedPrice = 100;

  const { currentUser } = useContext(AuthContext);

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
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return;

      const [year, month] = selectedDate.split("-");

      try {
        const response = await fetch(
          `http://django-env.eba-gmvprtui.us-east-1.elasticbeanstalk.com/available-slots/?year=${year}&month=${month}`
        );

        if (!response.ok) {
          throw new Error("Erro ao obter horários disponíveis.");
        }

        const data = await response.json();

        const slotsForSelectedDay = data.filter((slot) => {
          const slotDate = new Date(slot.start_time)
            .toISOString()
            .split("T")[0];
          return slotDate === selectedDate;
        });

        const availableTimeSlots = slotsForSelectedDay
          .filter((slot) => !slot.is_booked)
          .map((slot) => {
            const date = new Date(slot.start_time);
            const hours = String(date.getUTCHours()).padStart(2, "0");
            return `${hours}:00`;
          });

        const booked = slotsForSelectedDay
          .filter((slot) => slot.is_booked)
          .map((slot) => {
            const date = new Date(slot.start_time);
            const hours = String(date.getUTCHours()).padStart(2, "0");
            return `${hours}:00`;
          });

        setTimeSlots(availableTimeSlots);
        setBookedSlots(booked);
      } catch (error) {
        console.error("Erro ao buscar slots:", error);
        setTimeSlots([]);
        setBookedSlots([]);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }

    if (issueDescription.length < 10) {
      alert("Issue description must be at least 10 characters long.");
      return;
    }

    try {
      const appointmentDateTime = `${selectedDate}T${selectedTime}:00Z`;

      const body = {
        device,
        service_type: serviceType,
        description: issueDescription,
        appointment_date: appointmentDateTime,
        customer_id: currentUser.toString() || "5",
        initial_cost: estimatedPrice,
      };

      const response = await fetch(
        "http://django-env.eba-gmvprtui.us-east-1.elasticbeanstalk.com/new-repair/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to book repair.");
      }
      // Reset form fields
      setClient("");
      setDevice("");
      setServiceType("");
      setIssueDescription("");
      setSelectedDate("");
      setSelectedTime("");
      setSelectedServiceOption(null);
      alert("Repair booked successfully!");
    } catch (error) {
      console.error("Error booking repair:", error);
      alert("There was an error booking the repair.");
    }
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
            value={client}
            placeholder="Client's name"
            onChange={(e) => setClient(e.target.value)}
            required
          />

          <div>
            <label className="block text-md font-medium mb-2" htmlFor="device">
              Device
            </label>
            <SelectComponent
              options={deviceOptions}
              required
              value={deviceOptions.find((opt) => opt.value === device) || null}
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
