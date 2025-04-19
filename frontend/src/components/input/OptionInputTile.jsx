import React from 'react';
import {MdRadioButtonChecked, MdRadioButtonUnchecked} from "react-icons/md";

function OptionInputTile(
    {
        isSelected,
        label,
        onSelect
    }
) {

    console.log(label)
    return (
        <button
            className={`w-full flex items-center gap-2 px-3 py-1 mb-4 border rounded-md ${
                isSelected
                    ?"text-white bg-primary border-sky-400"
                    :"text-black bg-slate-200/20 border-slate-200"
            }`}
            onClick={onSelect}
        >
            {isSelected ? (
                <MdRadioButtonChecked className="text-lg text-white"/>
            ) : (
                <MdRadioButtonUnchecked className="text-lg text-slate-400"/>
            )}

            <span className="text-[13px]">
                {label === "Yes" ? "آره" : label === "No" ? "نه" : label}
            </span>
        </button>
    );
}

export default OptionInputTile;