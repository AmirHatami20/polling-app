import React from 'react';
import CharAvatar from "./CharAvatar.jsx";
import moment from "moment";

function UserProfileInfo({imgUrl, fullName, username, createdAt}) {
    return (
        <div className="flex items-center gap-4">
            {imgUrl ? (
                <img
                    src={imgUrl}
                    alt="profile picture"
                    className="w-10 h-10 rounded-full border-none"
                />
            ) : (
                <CharAvatar
                    fullName={fullName}
                    style="text-[13px]"
                />
            )}

            <div>
                <p className="text-sm text-black font-medium leading-4">
                    <span className="text-[10px] text-slate-500">
                    {createdAt && moment(createdAt).fromNow()}
                    </span>
                    <span className="mx-1.5 text-sm text-slate-500">•</span>
                    {fullName}

                </p>
                <span className="text-[11.5px] text-slate-500 leading-4">
                    {username}
                </span>
            </div>

        </div>

    );
}

export default UserProfileInfo;