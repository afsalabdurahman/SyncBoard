import axios from "axios";
const CLOUDINARY_URL = import.meta.env.VITE_BASE_CLOUDINARY;
export const uploadAttachment = async (file: File): Promise<string> => {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "My_frist_cloud");

    try {
        const response = await axios.post(
            CLOUDINARY_URL,
            // "https://api.cloudinary.com/v1_1/ddoxcgkv2/image/upload",
            formData
        );

        const imageUrl = response.data.secure_url;
        return imageUrl;
    } catch (error) {

        return Promise.reject(error);
    }
};