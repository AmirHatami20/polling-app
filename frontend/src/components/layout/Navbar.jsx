import {useState} from 'react';
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi";
import SideMenu from "./SideMenu.jsx";

function Navbar({activeMenu}) {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <div
            className="flex gap-5 border-b border-slate-100/70 bg-slate-50/50 backdrop-blur-[2px] p-4 sticky top-0 z-50 ">
            <button
                className="lg:hidden block text-black"
                onClick={() => {
                    setOpenSidebar(!openSidebar);
                }}
            >
                {openSidebar ? (
                    <HiOutlineX className="text-2xl cursor-pointer"/>
                ) : (
                    <HiOutlineMenu className="text-2xl cursor-pointer"/>
                )}
            </button>
            <h2 className="text-xl font-bold text-shadow-md text-shadow-primary/10 text-black tracking-wid">
                نظر کده
            </h2>

            {openSidebar && (
                <div className="fixed top-[61px] -ml-4">
                    <SideMenu activeMenu={activeMenu}/>
                </div>
            )}
        </div>
    );
}

export default Navbar;