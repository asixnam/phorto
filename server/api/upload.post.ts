import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import fs from 'node:fs'
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

    // Ensure the uploads directory exists in public folder
    const uploadDir = path.resolve(process.cwd(), 'public/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Create a unique filename
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`
    const filePath = path.join(uploadDir, uniqueName)

    // Write the buffer to the filesystem
    fs.writeFileSync(filePath, file.data)

    // Return the relative URL
    return {
      success: true,
      url: `/uploads/${uniqueName}`
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal Server Error'
    })
  }
})
