"use server"

import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { getBootcamps } from "./data"
import type { Bootcamp } from "@/types/bootcamp"

interface ProfileData {
  name: string
  location: string
  role: string
  bootcampId: string
  bio?: string
  image?: string | null
}

export async function saveProfile(profileData: ProfileData) {
  try {
    // Read the current data file
    const dataFilePath = path.join(process.cwd(), "public", "data", "bootcamps.json")

    // Create directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "public", "data")
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Read existing data or create new if file doesn't exist
    let bootcampsData = getBootcamps()
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf8")
      bootcampsData = JSON.parse(fileContent) as Bootcamp[]
    }

    // Find the bootcamp
    const bootcampIndex = bootcampsData.findIndex((b: Bootcamp) => b.id === profileData.bootcampId)
    if (bootcampIndex === -1) {
      throw new Error("Bootcamp not found")
    }

    // Handle image if provided
    let imagePath = undefined
    if (profileData.image && profileData.image.startsWith("data:image")) {
      const imageId = uuidv4()
      const imageDir = path.join(process.cwd(), "public", "uploads")

      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true })
      }

      // Extract base64 data and save as file
      const matches = profileData.image.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        const imageType = matches[1]
        const imageData = Buffer.from(matches[2], "base64")
        const fileName = `${imageId}.${imageType}`
        const filePath = path.join(imageDir, fileName)

        fs.writeFileSync(filePath, imageData)
        imagePath = `/uploads/${fileName}`
      }
    }

    // Create new student object
    const newStudent = {
      id: uuidv4(),
      name: profileData.name,
      location: profileData.location,
      role: profileData.role,
      bio: profileData.bio,
      image: imagePath,
    }

    // Initialize students array if it doesn't exist
    if (!bootcampsData[bootcampIndex].studentIds) {
      bootcampsData[bootcampIndex].studentIds = []
    }

    // Add student ID to bootcamp
    bootcampsData[bootcampIndex].studentIds.push(newStudent.id)

    // Save updated data back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(bootcampsData, null, 2))

    // Save student data
    const studentsFilePath = path.join(process.cwd(), "public", "data", "students.json")
    let studentsData = []
    if (fs.existsSync(studentsFilePath)) {
      const fileContent = fs.readFileSync(studentsFilePath, "utf8")
      studentsData = JSON.parse(fileContent)
    }
    studentsData.push(newStudent)
    fs.writeFileSync(studentsFilePath, JSON.stringify(studentsData, null, 2))

    return { success: true }
  } catch (error) {
    console.error("Error saving profile:", error)
    throw new Error("Failed to save profile")
  }
}
