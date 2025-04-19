import React from 'react';

function Modal({onAccept, onReject, title}) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay*/}
            <div
                onClick={onReject}
                className="absolute inset-0 bg-black/40 cursor-pointer"
            />

            {/* Modal */}
            <div className="relative bg-white py-7 px-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h3>

                <div className="flex justify-center gap-5">
                    <button
                        onClick={onReject}
                        className="px-4 py-2 border border-sky-200 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                        خیر
                    </button>
                    <button
                        onClick={onAccept}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-sky-200 hover:text-primary cursor-pointer"
                    >
                        بله
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Modal;