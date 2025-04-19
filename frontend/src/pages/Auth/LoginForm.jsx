import {useContext, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {validateEmail} from "../../utils/helper.js";

import AuthLayout from "../../components/layout/AuthLayout.jsx";
import AuthInput from "../../components/input/AuthInput.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import {API_PATHS} from "../../utils/apiPaths.js";
import {UserContext} from "../../context/UserContext.jsx";

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const {updateUser} = useContext(UserContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setError("لطفا ایمیل معتبری وارد نمایید.");
            return;
        }

        if (!password) {
            setError("لطفا رمز عبور را وارد نمایید.");
            return;
        }

        setError("");

        // Login Api
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            })

            const {token, user} = response.data;

            if (token) {
                localStorage.setItem("token", token);
                updateUser(user)
                navigate("/dashboard");
            }

        } catch (err) {
            if (err.response && err.response.data.message) {
                setError(err.response.data.message)
            } else {
                setError("Something went wrong. please try again later");
            }
        }
    }

    return (
        <AuthLayout>
            <div className="xl:w-[75%] md:h-full h-3/4 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">
                    خوش برگشتی به سایت.
                </h3>
                <p className="text-xs text-slate-700 mt-1.5 mb-6">
                    لطفا اطلاعات شخصی خود را برای ورود وارد نمایید.
                </p>
                <form onSubmit={onSubmitHandler}>
                    <AuthInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="آدرس ایمیل:"
                        placeholder="ایمیل..."
                        type="text"
                    />
                    <AuthInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="رمز عبور:"
                        placeholder="بیشتر از 8 کاراکتر..."
                        type="password"
                    />
                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                    <button className="btn-primary">
                        ورود
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        حساب کاربری ندارید؟{" "}
                        <Link to="/signUp"
                              className="font-medium text-primary underline"
                        >
                            ثبت نام
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
}

export default LoginForm;