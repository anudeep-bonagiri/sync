
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from './icons';

interface ToastProps {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />,
    bg: 'bg-white dark:bg-[#1A1A1A] border-2 border-green-500',
    textColor: 'text-green-800 dark:text-green-300',
  },
  warning: {
    icon: <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
    bg: 'bg-white dark:bg-[#1A1A1A] border-2 border-yellow-500',
    textColor: 'text-yellow-800 dark:text-yellow-300',
  },
  error: {
    icon: <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />,
    bg: 'bg-white dark:bg-[#1A1A1A] border-2 border-red-500',
    textColor: 'text-red-800 dark:text-red-300',
  },
  info: {
    icon: <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    bg: 'bg-white dark:bg-[#1A1A1A] border-2 border-blue-500',
    textColor: 'text-blue-800 dark:text-blue-300',
  },
};

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
    if (!isVisible) return null;

  const { icon, bg, textColor } = toastConfig[type];

  return (
    <div 
        className={`fixed top-5 right-5 z-[10000] w-full max-w-sm p-4 rounded-lg ${bg} shadow-2xl flex items-center gap-4 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        role="alert"
    >
      {icon}
      <p className={`flex-1 text-sm font-medium ${textColor}`}>{message}</p>
      <button onClick={onClose} className={`p-1 rounded-full ${textColor} hover:bg-black/10 dark:hover:bg-white/20 transition-colors`}>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};