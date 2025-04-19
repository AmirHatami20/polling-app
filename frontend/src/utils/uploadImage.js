import {API_PATHS} from "./apiPaths.js";
import axiosInstance from "./axiosInstance.js";

export const uploadImage = async (imageFile) => {
    const formData = new FormData();

    // Append image file to form data
    formData.append("image", imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGES.UPLOAD_IMAGES, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Send header for file upload
            }
        });
        return response.data; // return response
    } catch (error) {
        console.error("Error uploading image:", error)
        throw error; //Rethrow error for handling
    }

}