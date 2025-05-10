import { motion } from "framer-motion";

export default function Toast({ message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50"
    >
      <span className="text-lg">✅</span>
      <p className="text-sm">{message}</p>
      <button onClick={onClose} className="ml-auto text-white hover:opacity-75 text-lg">✕</button>
    </motion.div>
  );
}
