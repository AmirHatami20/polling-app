import React from 'react';
import OptionInputTile from "../input/OptionInputTile.jsx";
import Rating from "../input/Rating.jsx";
import ImageOptionInputTile from "../input/ImageOptionInputTile.jsx";

function PollContent(
    {
        type,
        options,
        selectedOptionIndex,
        onOptionSelect,
        rating,
        onRatingChange,
        userResponse,
        onResponseChange
    }
) {
    switch (type) {
        case 'single-choice':
        case 'yes/no':
            return (
                <>
                    {options.map((option, index) => (
                        <OptionInputTile
                            key={index}
                            isSelected={selectedOptionIndex === index}
                            label={option.optionText || ""}
                            onSelect={() => onOptionSelect(index)}
                        />
                    ))
                    }
                </>
            )
        case 'rating':
            return (
                <Rating
                    value={rating}
                    onChange={onRatingChange}
                />
            )
        case 'image-based':
            return (
                <div className="grid grid-cols-2 gap-4">
                    {options.map((option, index) => (
                        <ImageOptionInputTile
                            key={index}
                            isSelected={selectedOptionIndex === index}
                            imgUrl={option.optionText || ""}
                            onSelect={() => onOptionSelect(index)}
                        />
                    ))}
                </div>
            )

        case 'open-ended':
            return (
                <div className="mt-3">
                    <textarea
                        placeholder="your Response"
                        className="w-full text-[13px] outline-none bg-slate-200/80 p-2 rounded-md"
                        rows={4}
                        value={userResponse}
                        onChange={event => onResponseChange(event.target.value)}
                    />
                </div>
            )
        default:
            return null;
    }
}

export default PollContent;