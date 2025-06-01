// This function uploads a file to S3 using a presigned URL.
// You need an API endpoint (e.g. /api/upload-url) that returns a presigned URL for a given file name and type.
// The function returns the final S3 URL upon success.

export async function uploadImageToS3(file) {
    // // 1. Get the presigned URL from your backend
    // You may need to adjust this endpoint to your backend
    const getPresignedUrlEndpoint = "https://vitaldev.vitalinsights.in/user/s3-signed-url";
    const fileName = `${Date.now()}-${file.name}`; // Unique file name
    const fileType = file.type;
  
    // Step 1: Get presigned URL and S3 file URL from backend
    const res = await fetch(
      `${getPresignedUrlEndpoint}?file_name=${encodeURIComponent(fileName)}&file_type=${encodeURIComponent(fileType)}`
    );
    if (!res.ok) throw new Error("Failed to get upload URL from server");
  
    const { uploadUrl, fileUrl } = await res.json();
    if (!uploadUrl || !fileUrl) throw new Error("Invalid upload URL response");
  
    // Step 2: Upload to S3
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": fileType,
      },
      body: file,
    });
    if (!uploadRes.ok) throw new Error("Failed to upload file to S3");
  
    // Step 3: Return the S3 public URL
    return fileUrl;
    // return `https://vital-insights.s3.ap-south-1.amazonaws.com/dev/reports/dexa/${file.name}`;
  }