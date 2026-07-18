import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    // Find the file field
    const file = formData.find(item => item.name === 'file')
    if (!file || !file.filename || !file.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file found in the request'
      })
    }

    // Validate file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const fileExt = path.extname(file.filename).toLowerCase()
    if (!allowedExtensions.includes(fileExt)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Only image files (jpg, jpeg, png, webp, gif) are allowed'
      })
    }

    // Convert the buffer to a Base64 data URL since Vercel's filesystem is read-only at runtime
    let mimeType = 'image/jpeg'
    if (fileExt === '.png') mimeType = 'image/png'
    else if (fileExt === '.webp') mimeType = 'image/webp'
    else if (fileExt === '.gif') mimeType = 'image/gif'

    const base64 = file.data.toString('base64')
    const dataUrl = `data:${mimeType};base64,${base64}`

    // Return the data URL
    return {
      success: true,
      url: dataUrl
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal Server Error'
    })
  }
})
