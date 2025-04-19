import React from 'react';
import CharAvatar from "./CharAvatar.jsx";

function StateInfo ({label,value}) {
    return (
        <div className="text-center">
            <p className="font-medium text-sm text-gray-950">{label}</p>
            <p className="text-xs text-slate-700/80 mt-1">{value}</p>
        </div>
    )
}

function UserDetailsCard(
    {
        profileImageUrl,
        fullName,
        username,
        totalPollsBookmarked,
        totalPollsCreated,
        totalPollsVotes,
    }
) {
    return (
        <div className="bg-slate-100/50 rounded-lg mt-5 overflow-hidden">
            <div className="w-full h-32 bg-primary/70 flex justify-center items-center relative">
                <div className="absolute -bottom-12 rounded-full overflow-hidden border-2 border-primary">
                    {profileImageUrl ? (
                        <img
                            src={profileImageUrl}
                            alt="Profile Image"
                            className="w-25 h-25 bg-slate-400 rounded-full"
                        />
                    ) : (
                        <CharAvatar
                            fullName={fullName}
                            width="w-20"
                            height="h-20"
                            style="text-xl"
                        />
                    )}
                </div>
            </div>

            <div className="mt-12 px-5">
                <div className="text-center pt-1">
                    <h5 className="text-lg text-gray-950 font-medium leading-6">
                        {fullName}
                    </h5>
                    <span className="text-[13px] font-medium text-slate-700/60">
                        {username}
                    </span>
                </div>

                <div className="flex items-center justify-center gap-5 flex-wrap my-5 mx-5">
                    <StateInfo
                        label="ساخته شده"
                        value={totalPollsCreated || 0}
                    />
                    <StateInfo
                        label="ثبت شده"
                        value={totalPollsVotes || 0}
                    />
                    <StateInfo
                        label="ذخیره شده"
                        value={totalPollsBookmarked || 0}
                    />
                </div>
            </div>
        </div>
    );
}

export default UserDetailsCard;