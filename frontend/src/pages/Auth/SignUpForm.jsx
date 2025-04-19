import React, {useContext, useState} from 'react';
import AuthLayout from "../../components/layout/AuthLayout.jsx";
import AuthInput from "../../components/input/AuthInput.jsx";
import {Link, useNavigate} from "react-router-dom";
import ProfilePhotoSelector from "../../components/input/ProfilePhotoSelector.jsx";
import {validateEmail} from "../../utils/helper.js";
import {API_PATHS} from "../../utils/apiPaths.js";
import axiosInstance from "../../utils/axiosInstance.js";
import {UserContext} from "../../context/UserContext.jsx";
import {uploadImage} from "../../utils/uploadImage.js";

function SignUpForm() {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);

    const {updateUser} = useContext(UserContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        let profileImageUrl = "";

        if (!fullName) {
            setError("لطفا نام و نام خانوادگی خود را وارد کنید!");
            return;
        }
        if (!validateEmail(email)) {
            setError("لطفا ایمیل خود را وارد کنید!");
            return;
        }
        if (!username) {
            setError("لطفا نام کاربری خود را وارد کنید!");
            return;
        }
        if (!password) {
            setError("لطفا رمز عبور خود را وارد کنید!");
            return;
        }
        setError('');

        // SignUp api
        try {
            // Upload image if exist
            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic)
                profileImageUrl = imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                fullName,
                email,
                username,
                password,
                profileImageUrl
            })

            const {token, user} = response.data;

            if (token) {
                localStorage.setItem('token', token);
                updateUser(user);
                navigate("/dashboard");
            }

        } catch (err) {
            if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("مشکلی پیش آمده است. لطفا مجددا تکرار کنید!");
            }
        }
    }

    return (
        <AuthLayout>
            <div className="xl:w-[90%] md:h-full h-3/4 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">
                    ثبت نام در سایت
                </h3>
                <p className="text-xs text-slate-700 mt-1.5 mb-6">
                    با نوشتن اطلاعات شخصی خود به ما بپیوندید
                </p>
                <form onSubmit={onSubmitHandler}>
                    <ProfilePhotoSelector
                        image={profilePic}
                        setImage={setProfilePic}
                    />
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                        <AuthInput
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            label="نام و نام خانوادگی:"
                            placeholder="نام و نام خانوادگی..."
                            type="text"
                        />
                        <AuthInput
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="آدرس ایمیل:"
                            placeholder="ایمیل..."
                            type="text"
                        />
                        <AuthInput
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            label="نام کاربری:"
                            placeholder="نام کاربری:"
                            type="text"
                        />
                        <AuthInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="رمز عبور:"
                            placeholder="بیشتر از 8 کاراکتر..."
                            type="password"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                    <button className="btn-primary">
                        ثبت نام
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        قبلا ثبت نام کرده اید؟{" "}
                        <Link to="/login"
                              className="font-medium text-primary underline"
                        >
                            ورود
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
}

export default SignUpForm;