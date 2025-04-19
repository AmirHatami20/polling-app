import {useState} from 'react';
import {HiOutlineTrash, HiMiniPlus} from "react-icons/hi2";

function OptionInput({optionList, setOptionList}) {
    const [option, setOption] = useState("")

    // Function to adding an option
    const handleAddOption = () => {
        if (option.trim() && optionList.length < 4) {
            setOptionList([...optionList, option.trim()]);
            setOption("");
        }
    }

    // Function to remove an option
    const handleRemoveOption = (index) => {
        const updatedArray = optionList.filter((_,idx) => idx !== index);
        setOptionList(updatedArray);
    }

    return (
        <div>
            {optionList.map((option, index) => (
                <div
                    className="flex justify-between bg-gray-200/20 px-4 py-2 rounded-md mb-3"
                    key={index}
                >
                    <p className="text-xs font-medium text-black">{option}</p>

                    <button
                        onClick={() => {
                            handleRemoveOption(index)
                        }}
                    >
                        <HiOutlineTrash className="text-lg text-red-500"/>
                    </button>
                </div>
            ))}
            {optionList.length < 4 && (
                <div className="flex items-center gap-5 mt-4">
                    <input
                        type="text"
                        placeholder="گزینه..."
                        value={option}
                        onChange={(event) => setOption(event.target.value)}
                        className="w-full text-[13px] text-black outline-none bg-gray-200/80 px-3 py-[6px] rounded-md"
                    />

                    <button
                        className="btn-small text-nowrap p-1.5"
                        onClick={handleAddOption}
                    >
                        <span>اضافه کردن</span>
                        <HiMiniPlus className="text-lg "/>
                    </button>
                </div>
            )}
        </div>
    );
}

export default OptionInput;