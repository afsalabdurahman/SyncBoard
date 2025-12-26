import axios from "axios";
const CLOUDINARY_URL = import.meta.env.VITE_BASE_CLOUDINARY;
const CLOUDINARY_URL_VIDEO = import.meta.env.VITE_BASE_CLOUDINARY_VIDEO;
export const uploadAttachment = async (file: File): Promise<string> => {
console.log(file,"filFromUpload")
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "My_frist_cloud");

    try {
        const response = await axios.post(
            CLOUDINARY_URL,
           
            formData
        );

        const imageUrl = response.data.secure_url;
        return imageUrl;
    } catch (error) {

        return Promise.reject(error);
    }
};
export const audioUpload = async (audioBlob:Blob)=>{

try {
      const formData = new FormData();
    formData.append("file", audioBlob, `voice-${Date.now()}.webm`);
    formData.append("upload_preset", "My_frist_cloud");
    
      const response = await axios.post(
            CLOUDINARY_URL_VIDEO,
            formData,{
     
      timeout: 60000, 
    }
        );

        const audioUrl = response.data.secure_url;
        return audioUrl;
} catch (error) {
    console.log(error)
}

  
}
export const uploadVideo = async ( videoFile: File | Blob):Promise<string>=>{
const formData = new FormData();
    formData.append("file", videoFile, videoFile instanceof File ? videoFile.name : `video-${Date.now()}.mp4`);
    formData.append("upload_preset", "My_frist_cloud");
 const response = await axios.post(
            CLOUDINARY_URL_VIDEO,
            formData,{
     
      timeout: 60000, 
    }
        );
 const url=  response.data.secure_url;
 return url

}