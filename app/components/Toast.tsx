"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  isVisible: boolean;
  message: string;
}

export default function Toast({ isVisible, message }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-gray-900/90 backdrop-blur-md border border-gray-700 text-white rounded-xl shadow-2xl"
        >
          <CheckCircle2 className="text-green-400 w-6 h-6" />
          <span className="font-medium">{message}</span>
          
          {/* Progress Bar */}
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 2, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-green-500/50 rounded-b-xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}