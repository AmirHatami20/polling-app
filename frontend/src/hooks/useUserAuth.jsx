import {useContext, useEffect} from 'react';
import {UserContext} from "../context/UserContext.jsx";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";
import {API_PATHS} from "../utils/apiPaths.js";

function UseUserAuth() {
    const {user, updateUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) return;

        let isMounted = true;

        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

                if (isMounted && response.data) {
                    updateUser(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch user info", err)

                if (isMounted) {
                    navigate("/login");
                }
            }
        }

        fetchUserInfo();

        return () => {
            isMounted = false;
        }
    }, [user, updateUser])
}

export default UseUserAuth;