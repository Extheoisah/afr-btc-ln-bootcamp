"use server"

import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { getBootcamps } from "./data"
import { createPullRequest } from "./github"
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

    // Read current students data
    const studentsFilePath = path.join(process.cwd(), "public", "data", "students.json")
    let studentsData = []
    if (fs.existsSync(studentsFilePath)) {
      const fileContent = fs.readFileSync(studentsFilePath, "utf8")
      studentsData = JSON.parse(fileContent)
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

    // Add new student to the array
    studentsData.push(newStudent)

    // Read bootcamps data
    const bootcampsFilePath = path.join(process.cwd(), "public", "data", "bootcamps.json")
    let bootcampsData = getBootcamps()
    if (fs.existsSync(bootcampsFilePath)) {
      const fileContent = fs.readFileSync(bootcampsFilePath, "utf8")
      bootcampsData = JSON.parse(fileContent) as Bootcamp[]
    }

    // Find the bootcamp and add student ID
    const bootcampIndex = bootcampsData.findIndex((b: Bootcamp) => b.id === profileData.bootcampId)
    if (bootcampIndex === -1) {
      throw new Error("Bootcamp not found")
    }

    // Initialize students array if it doesn't exist
    if (!bootcampsData[bootcampIndex].studentIds) {
      bootcampsData[bootcampIndex].studentIds = []
    }

    // Add student ID to bootcamp
    bootcampsData[bootcampIndex].studentIds.push(newStudent.id)

    // Create pull request
    const result = await createPullRequest({
      title: `Add student profile: ${profileData.name}`,
      body: `
## New Student Profile

- **Name**: ${profileData.name}
- **Location**: ${profileData.location}
- **Role**: ${profileData.role}
- **Bootcamp**: ${bootcampsData[bootcampIndex].location}

${profileData.bio ? `\n### Bio\n${profileData.bio}` : ""}
      `,
      files: [
        {
          path: "public/data/students.json",
          content: JSON.stringify(studentsData, null, 2),
        },
        {
          path: "public/data/bootcamps.json",
          content: JSON.stringify(bootcampsData, null, 2),
        },
      ],
    })

    return { success: true, pullRequestUrl: result.pullRequestUrl }
  } catch (error) {
    console.error("Error saving profile:", error)
    throw new Error("Failed to save profile")
  }
}
