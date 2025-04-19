export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        GET_USER_INFO: "/auth/get-user",
        UPDATE_PROFILE: "/auth/update",
    },
    POLLS: {
        CREATE: "/poll",
        GET_ALL: "/poll",
        GET_BY_ID: (pollId) => `/poll/${pollId}`,
        VOTE: (pollId) => `/poll/${pollId}/vote`,
        CLOSE: (pollId) => `/poll/${pollId}/close`,
        BOOKMARK: (pollId) => `/poll/${pollId}/bookmark`,
        GET_BOOKMARKED: "/poll/user/bookmarked",
        GET_VOTED_POLLS: "/poll/user/voted",
        DELETE: (pollId) => `/poll/${pollId}`,
    },
    IMAGES: {
        UPLOAD_IMAGES: "/auth/upload-image",
    }
}
