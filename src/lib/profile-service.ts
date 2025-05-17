"use server"

import { createPullRequest } from "./github"
import { getBootcamps, getStudents } from "./data"
import type { Student } from "@/types/bootcamp"

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
    // Fetch current data
    const [students, bootcamps] = await Promise.all([
      getStudents(),
      getBootcamps(),
    ]);

    // Create new student object
    const newStudent: Student = {
      id: crypto.randomUUID(),
      name: profileData.name,
      location: profileData.location,
      role: profileData.role,
      bio: profileData.bio,
      image: profileData.image || undefined,
    };

    // Add new student to the array
    students.push(newStudent);

    // Find the bootcamp and add student ID
    const bootcampIndex = bootcamps.findIndex(b => b.id === profileData.bootcampId);
    if (bootcampIndex === -1) {
      throw new Error("Bootcamp not found");
    }

    // Initialize students array if it doesn't exist
    if (!bootcamps[bootcampIndex].studentIds) {
      bootcamps[bootcampIndex].studentIds = [];
    }

    // Add student ID to bootcamp
    bootcamps[bootcampIndex].studentIds.push(newStudent.id);

    // If there's an image, prepare it for the pull request
    const files = [
      {
        path: "public/data/students.json",
        content: JSON.stringify(students, null, 2),
      },
      {
        path: "public/data/bootcamps.json",
        content: JSON.stringify(bootcamps, null, 2),
      },
    ];

    if (profileData.image && profileData.image.startsWith("data:image")) {
      const imageId = crypto.randomUUID();
      const matches = profileData.image.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const imageType = matches[1];
        const fileName = `${imageId}.${imageType}`;
        const imagePath = `/uploads/${fileName}`;
        newStudent.image = imagePath;
        
        files.push({
          path: `public${imagePath}`,
          content: matches[2], // Get the base64 content without the prefix
        });
      }
    }

    // Create pull request
    const result = await createPullRequest({
      title: `Add student profile: ${profileData.name}`,
      body: `
## New Student Profile

- **Name**: ${profileData.name}
- **Location**: ${profileData.location}
- **Role**: ${profileData.role}
- **Bootcamp**: ${bootcamps[bootcampIndex].location}

${profileData.bio ? `\n### Bio\n${profileData.bio}` : ""}
      `,
      files,
    });

    return { success: true, pullRequestUrl: result.pullRequestUrl };
  } catch (error) {
    console.error("Error saving profile:", error);
    throw new Error("Failed to save profile");
  }
}
