import React from 'react';

function ImageOptionInputTile({isSelected, imgUrl, onSelect}) {
    return (
        <button
            className={`w-full flex items-center gap-2 bg-slate-200/40 mb-4 rounded-md overflow-hidden border-2 cursor-pointer ${
                isSelected ? "border-primary" : "border-transparent"
            }`}
            onClick={onSelect}
        >
            <img
                className="w-full h-36 object-contain "
                src={imgUrl}
                alt="item image"
            />
        </button>
    );
}

export default ImageOptionInputTile;