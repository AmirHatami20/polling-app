import React, {useContext, useState} from 'react';
import {SIDE_MENU_DATA} from "../../utils/data.js";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../context/UserContext.jsx";
import Modal from "../modal/modal.jsx";

function SideMenu({activeMenu}) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const {clearUser} = useContext(UserContext);

    const handleClick = (route) => {
        if (route === "/logout") {
            setShowLogoutModal(true);
            return;
        }
        navigate(route);
    }

    const handleModalAcceptAction = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    }
    const handleModalRejectAction = () => {
        setShowLogoutModal(false);
    }

    return (
        <div
            className="w-64 h-[calc(100vh-61px)] bg-slate-50 border-r border-slate-100/70 py-5 px-1 sticky top-[61px] z-20">
            {SIDE_MENU_DATA.map((menu) => (
                <button
                    key={menu.id}
                    className={`w-full flex items-center gap-4 py-4 px-6 rounded-md text-[15px] mb-3 cursor-pointer ${
                        activeMenu === menu.name ? "text-white bg-primary" : ""
                    }`}
                    onClick={() => handleClick(menu.path)}
                >
                    {menu.icon && <menu.icon className="text-xl"/>}
                    <span>{menu.label}</span>
                </button>
            ))}

            {showLogoutModal && (
                <Modal
                    title="آیا از خروج خود اطمینان دارید؟"
                    onAccept={handleModalAcceptAction}
                    onReject={handleModalRejectAction}
                />
            )}
        </div>
    );
}

export default SideMenu;