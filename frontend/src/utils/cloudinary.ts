const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "v6a0axho"); // ⚠️ create this in Cloudinary

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dddvbg9tm/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await res.json();
  return data.secure_url;
};

export default uploadToCloudinary;
