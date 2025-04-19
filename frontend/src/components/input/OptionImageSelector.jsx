import React from 'react';
import {HiMiniPlus, HiOutlineTrash} from "react-icons/hi2";

function OptionImageSelector({imageList, setImageList}) {

    // Function to adding an image
    const handleAddImage = (event) => {
        const file = event.target.files[0];

        if (file && imageList.length < 4) {
            const reader = new FileReader();

            reader.onload = () => {
                // Add object with base64 and file to the array
                setImageList([
                    ...imageList,
                    {base64: reader.result, file}
                ])
            }
            reader.readAsDataURL(file);
            event.target.value = null
        }
    }

    // Function to adding an image
    const handleRemoveImage = (index) => {
        const updatedArray = imageList.filter((_, inx) => inx !== index);
        setImageList(updatedArray);
    }

    return (
        <div>
            {imageList?.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {imageList?.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-500/10 rounded-md relative"
                        >
                            <img
                                className="w-full h-36 object-contain rounded-md"
                                src={item.base64}
                                alt="image-option"
                            />
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute right-3 top-2 bg-gray-100 text-red-500 rounded-full p-2 cursor-pointer"
                            >
                                <HiOutlineTrash className="text-lg"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {imageList.length < 4 && (
                <div className="flex items-center gap-5">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAddImage}
                        className="hidden"
                        id="imageInput"
                    />

                    {/* Also we can use useRef() */}
                    <label
                        htmlFor="imageInput"
                        className="btn-small"
                    >
                        اضافه کردن تصویر
                        <HiMiniPlus className="text-lg"/>
                    </label>
                </div>
            )}
        </div>
    );
}

export default OptionImageSelector;