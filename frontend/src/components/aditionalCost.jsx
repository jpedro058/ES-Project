// src/components/AditionalCostModal.jsx
import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";

export default function AditionalCostModal({
  isOpen,
  onClose,
  currentValue = 0,
  onConfirm,
}) {
  const [value, setValue] = useState(currentValue);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!Number.isNaN(currentValue)) {
      setValue(currentValue.toFixed(2));
    } else {
      setValue(currentValue);
    }
  }, [currentValue, isOpen]);

  const handleConfirm = () => {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      onConfirm(parsed);
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="bg-[#123C55] border border-cyan-700 text-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md z-50">
        <Dialog.Title className="text-2xl font-bold text-cyan-400 mb-4">
          Add Additional Cost
        </Dialog.Title>

        <div className="mb-6">
          <label htmlFor="additional-cost" className="block mb-2 text-white">
            Additional Cost (€)
          </label>
          <input
            id="additional-cost"
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-600 hover:bg-zinc-700 text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </Dialog>
  );
}
