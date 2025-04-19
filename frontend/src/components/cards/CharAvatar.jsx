import React from 'react';
import {getInitial} from "../../utils/helper.js";

function CharAvatar({fullName, width, height, style}) {
    return (
        <div className={`${width || "w-12"} ${height || "h-12"} ${style || ""} flex items-center justify-center rounded-full text-gray-900 font-medium bg-gray-100`}>
            {getInitial(fullName || "")}
        </div>
    );
}

export default CharAvatar;