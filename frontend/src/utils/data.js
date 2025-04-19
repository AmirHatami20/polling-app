import {
    LuBadgeCheck,
    LuBookmark,
    LuLayoutDashboard,
    LuLogOut,
    LuVote
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
    {
        id: 1,
        label: "داشبورد",
        name:"Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: 2,
        label: "ساخت نظرسنجی",
        name:"Create Poll",
        icon: LuVote,
        path: "/create-poll",
    },
    {
        id: 3,
        label: "نظرسنجی های من",
        name:"My Polls",
        icon: LuBadgeCheck,
        path: "/my-polls",
    },
    {
        id: 4,
        label: "نظرسنجی های ثبت شده",
        name:"Voted Poll",
        icon: LuBadgeCheck,
        path: "/voted-polls",
    },
    {
        id: 5,
        label: "نظر سنجی های ذخیره شده",
        name:"Bookmarks",
        icon: LuBookmark,
        path: "/bookmarked-polls",
    },
    {
        id: 6,
        label: "خروج",
        name:"",
        icon: LuLogOut,
        path: "/logout",
    },
]

export const POLL_TYPE = [
    {id: "1", label: "آره/نه", value: "yes/no"},
    {id: "2", label: "تک انتخاب", value: "single-choice"},
    {id: "3", label: "نمره دهی", value: "rating"},
    {id: "4", label: "بر پایه تصویر", value: "image-based"},
    {id: "5", label: "پاسخ آزاد", value: "open-ended"},
]