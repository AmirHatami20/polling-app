import {useState} from 'react';
import {IoCloseOutline, IoFilterOutline} from "react-icons/io5";
import {POLL_TYPE} from "../../utils/data.js";

function HeaderWithFilter({title, filterType, setFilterType}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="sm:text-xl font-medium text-black">
                    {title}
                </h2>

                <button
                    className={`flex items-center gap-3 text-sm text-white bg-primary px-4 py-2 cursor-pointer ${
                        open ? 'rounded-t-lg' : 'rounded-lg'
                    }`}
                    onClick={() => {
                        if (filterType === "") setFilterType("");
                        setOpen(prev => !prev);
                    }}
                >
                    {open ? (
                        <>
                            <span>پاک کردن</span>
                            <IoCloseOutline className="text-lg"/>
                        </>
                    ) : (
                        <>
                            <span>فیلتر</span>
                            <IoFilterOutline className="text-lg"/>
                        </>
                    )}
                </button>
            </div>
            {open && (
                <div className="flex flex-wrap gap-4 bg-primary p-4 rounded-r-lg rounded-b-lg [direction:ltr]">
                    {[{label: "همه", value: ""}, ...POLL_TYPE].map((type, index) => (
                        <button
                            key={index}
                            className={`text-[12px] px-4 py-1 rounded-lg text-nowrap ${
                                filterType === type.value
                                    ? "text-white bg-sky-900"
                                    : "text-[13px] bg-sky-100"
                            }`}
                            onClick={() => setFilterType(type.value)}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}

export default HeaderWithFilter;