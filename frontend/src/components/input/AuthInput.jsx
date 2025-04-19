import {useState} from "react";

import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6'

function AuthInput({value, onChange, label, placeholder, type}) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="">
            <label className="text-[13px] text-slate-800">
                {label}
            </label>
            <div className="input-box">
                <input
                    type={type === 'password' ? showPassword ? 'text' : 'password' : 'text'}
                    value={value}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                    onChange={onChange}
                />
                {type === 'password' && (
                    showPassword ? (
                        <FaRegEyeSlash
                            onClick={toggleShowPassword}
                            className="text-slate-400 cursor-pointer"
                            size={20}
                        />
                    ) : (
                        <FaRegEye
                            onClick={toggleShowPassword}
                            className="text-primary cursor-pointer"
                            size={20}
                        />
                    )
                )}

            </div>
        </div>
    );
}

export default AuthInput;