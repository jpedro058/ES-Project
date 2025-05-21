// src/components/PaymentModal.jsx
import { Dialog } from "@headlessui/react";

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  onConfirmPayment,
}) {
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
          Confirm Payment
        </Dialog.Title>

        <p className="text-lg text-white mb-6">
          Amount to pay:&nbsp;
          <span className="font-semibold text-green-400">€{amount}</span>
        </p>

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
            onClick={onConfirmPayment}
            className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition cursor-pointer"
          >
            Pagar
          </button>
        </div>
      </div>
    </Dialog>
  );
}
