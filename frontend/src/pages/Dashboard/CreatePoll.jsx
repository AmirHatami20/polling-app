import {useContext, useState} from 'react';
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import useUserAuth from "../../hooks/useUserAuth.jsx";
import {POLL_TYPE} from "../../utils/data.js";
import OptionInput from "../../components/input/OptionInput.jsx";
import OptionImageSelector from "../../components/input/OptionImageSelector.jsx";
import {uploadImage} from "../../utils/uploadImage.js";
import {API_PATHS} from "../../utils/apiPaths.js";
import {UserContext} from "../../context/UserContext.jsx";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance.js";

function CreatePoll() {
    const {user, onPollCreateAndDelete} = useContext(UserContext);

    useUserAuth()

    const [pollData, setPollData] = useState({
        question: "",
        type: "",
        options: [],
        imageOptions: [],

        error: ""
    })

    // Upload Image and Get Image Url
    const updateImageAndGetLink = async (imageOptions) => {
        const optionPromise = imageOptions.map(async (imageOptions) => {
            try {
                const imgUploadRes = await uploadImage(imageOptions.file);
                return imgUploadRes.imageUrl || "";
            } catch {
                toast.error(`${imageOptions.file.name}ارور در فرستادن عکس : `);
                return "";
            }
        });

        return await Promise.all(optionPromise);

    }

    const getOption = async () => {
        switch (pollData.type) {
            case "single-choice": {
                return pollData.options;
            }

            case "image-based": {
                return await updateImageAndGetLink(pollData.imageOptions);
            }

            default: {
                return [];
            }
        }
    }

    const handleValueChange = (key, value) => {
        setPollData(prevPollData => ({
            ...prevPollData,
            [key]: value
        }))
    }

    const clearData = () => {
        setPollData({
            question: "",
            type: "",
            options: [],
            imageOptions: [],

            error: ""
        })
    }

    const handleCreatePoll = async () => {
        const {question, type, options, imageOptions} = pollData;

        if (!question || !type) {
            handleValueChange("error", "سوال و نوع نظر سنجی آن الزامی است.")
            return;
        }

        if (type === "single-choice" && options.length < 2) {
            handleValueChange("error", "باید بیشتر از 1 انتخاب باشد.");
            return;
        }

        if (type === "image-based" && imageOptions.length < 2) {
            handleValueChange("error", "باید بیشتر از 1 انتخاب باشد.");
            return;
        }

        handleValueChange("error", "");

        const optionData = await getOption();

        try {
            const response = await axiosInstance.post(API_PATHS.POLLS.CREATE, {
                question,
                type,
                options: optionData,
                creatorId: user._id
            });

            if (response) {
                toast.success("نظرسنجی با موفقیت ساخته شد.");
                onPollCreateAndDelete();
                clearData();
            }

        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
                handleValueChange("error", error.response.data.message);
            } else {
                handleValueChange("error", "مشکلی پیش آمده است.");
            }
        }
    }

    return (
        <DashboardLayout activeMenu="Create Poll">
            <div className="bg-gray-100/80 my-5 p-5 rounded-lg mx-auto">
                <h2 className="text-lg text-black font-medium">
                    ساخت نظر سنجی
                </h2>

                {/* Question */}
                <div className="mt-3">
                    <label className="text-xs font-medium text-slate-600">
                        سوال:
                    </label>
                    <textarea
                        placeholder="چی در ذهنت میگذره؟..."
                        className="w-full text-[13px] text-black outline-none bg-slate-200/80 p-2 rounded-md"
                        rows={4}
                        value={pollData?.question}
                        onChange={(event) => {
                            handleValueChange("question", event.target.value);
                        }}
                    />
                </div>

                {/* Pull type */}
                <div className="mt-3">
                    <label className="text-xs font-medium text-slate-600">
                        نوع نظرسنجی:
                    </label>
                    <div className="flex gap-4 flex-wrap mt-3">
                        {POLL_TYPE.map((item) => (
                            <div
                                key={item.id}
                                className={`option-btn ${
                                    pollData.type === item.value
                                        ? "text-white bg-primary border-primary"
                                        : ""
                                }`}
                                onClick={() => {
                                    handleValueChange("type", item.value);
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Single Choice */}
                {pollData.type === "single-choice" && (
                    <div className="mt-3">
                        <label className="text-xs font-medium text-slate-600">
                            گزینه ها:
                        </label>

                        <div className="mt-3">
                            <OptionInput
                                optionList={pollData.options}
                                setOptionList={(value) => {
                                    handleValueChange("options", value)
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Image Based */}
                {pollData.type === "image-based" && (
                    <div className="mt-3">
                        <label className="text-xs font-medium text-slate-600">
                            تصویر گزینه ها:
                        </label>

                        <div className="mt-3">
                            <OptionImageSelector
                                imageList={pollData.imageOptions}
                                setImageList={(value) => {
                                    handleValueChange("imageOptions", value)
                                }}
                            />

                        </div>
                    </div>
                )}

                {/* Error */}
                {pollData.error && (
                    <p className="text-xs text-red-500 font-medium mt-5">
                        {pollData.error}
                    </p>
                )}

                {/* Create Btn    */}
                <button
                    onClick={handleCreatePoll}
                    className="btn-primary py-2 mt-6">
                    ساخت
                </button>

            </div>

        </DashboardLayout>
    );
}

export default CreatePoll;