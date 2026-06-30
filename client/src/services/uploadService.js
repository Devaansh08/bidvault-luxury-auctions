import API from './api'

/** Get a signed upload signature from the backend, then upload to Cloudinary directly */
export const uploadService = {
  getSignature: () => API.get('/upload/signature'),

  uploadToCloudinary: async (file, onProgress) => {
    // 1. Get signature from our server
    const { data } = await API.get('/upload/signature')
    const { signature, timestamp, cloudName, apiKey, folder } = data

    // 2. Build form data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('signature', signature)
    formData.append('timestamp', timestamp)
    formData.append('api_key', apiKey)
    if (folder) formData.append('folder', folder)

    // 3. Upload directly to Cloudinary
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!res.ok) throw new Error('Image upload failed')

    const result = await res.json()
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    }
  },
}
