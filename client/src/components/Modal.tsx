import React, {useState} from "react";

interface ModalProps {
    title: string;
    children: React.ReactNode,
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (projectName: string) => void;
    submitLabel: string;
}

export const Modal = ({ isOpen, onClose, onSubmit, title, children, submitLabel }: ModalProps) => {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    return (
        // 1. Overlay / Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

            {/* 2. Modal Card */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Body */}
                {children}

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onSubmit(name); setName(''); }}
                        className="px-4 py-2 bg-indigo text-black text-sm font-bold rounded-lg hover:bg-indigo-700 transition shadow-md"
                    >
                        {submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
