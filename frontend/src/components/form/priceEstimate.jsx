const PriceEstimate = ({
  client,
  device,
  serviceType,
  issueDescription,
  selectedDate,
  selectedTime,
  estimatedPrice,
}) =>
  client &&
  device &&
  serviceType &&
  issueDescription &&
  selectedDate &&
  selectedTime && (
    <div>
      <p className="text-md font-medium mb-2">
        Estimated Price
        <span className="text-[#00B8D9] font-semibold">
          : ${estimatedPrice}
        </span>
      </p>
    </div>
  );

export default PriceEstimate;
