import React from 'react';

function EmptyCard({icon: Icon, btnText, message, onClick}) {
    return (
        <div className="bg-gray-100/50 flex flex-col items-center justify-center mt-6 py-20 rounded-lg">
            {Icon && (
                <Icon className="text-primary w-48 h-48"/>
            )}

            <p className="w-2/3 md:text-[14px] text-xs text-slate-900 text-center leading-6 mt-7">
                {message}
            </p>

            {btnText && (
                <button
                    className="btn-small px-6 py-2 mt-7"
                    onClick={onClick}
                >
                    {btnText}
                </button>
            )}
        </div>
    );
}

export default EmptyCard;