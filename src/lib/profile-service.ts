"use server";

import { createPullRequest } from "./github";
import { getBootcamps, getStudents } from "./data";
import type { Student, Bootcamp } from "@/types/bootcamp";

interface ProfileData {
  name: string;
  location: string;
  role: string;
  bootcampId: string;
  bio?: string;
  image?: string | null;
  githubUrl?: string;
}

export async function saveProfile(profileData: ProfileData) {
  try {
    // Fetch current data
    const [currentStudents, currentBootcamps] = await Promise.all([getStudents(), getBootcamps()]);

    // Create deep copies to avoid mutating the original data
    const students = JSON.parse(JSON.stringify(currentStudents));
    const bootcamps = JSON.parse(JSON.stringify(currentBootcamps));

    // Create new student object with UUID
    const studentId = crypto.randomUUID();
    const newStudent: Student = {
      id: studentId,
      name: profileData.name,
      location: profileData.location,
      role: profileData.role,
      bio: profileData.bio,
      image: profileData.image || undefined,
      githubUrl: profileData.githubUrl,
    };

    // Add new student to the array without removing existing ones
    students.push(newStudent);

    // Find the bootcamp
    const bootcampIndex = bootcamps.findIndex((b: Bootcamp) => b.id === profileData.bootcampId);
    if (bootcampIndex === -1) {
      throw new Error("Bootcamp not found");
    }

    // Initialize studentIds array if it doesn't exist
    if (!bootcamps[bootcampIndex].studentIds) {
      bootcamps[bootcampIndex].studentIds = [];
    }

    // Add student ID to bootcamp's studentIds array without removing existing ones
    bootcamps[bootcampIndex].studentIds.push(studentId);

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
          content: matches[2], // base64 content
        });
      }
    }

    // Create pull request with both student and bootcamp updates
    const result = await createPullRequest({
      title: `Add new student profile: ${profileData.name}`,
      body: `
## New Student Profile

- **Name**: ${profileData.name}
- **Location**: ${profileData.location}
- **Role**: ${profileData.role}
- **Bootcamp**: ${bootcamps[bootcampIndex].location}
${profileData.githubUrl ? `- **GitHub**: ${profileData.githubUrl}` : ""}

${profileData.bio ? `\n### Bio\n${profileData.bio}` : ""}

### Technical Details
- Student ID: \`${studentId}\`
- Added to bootcamp: \`${profileData.bootcampId}\`
      `,
      files,
    });

    return { success: true, pullRequestUrl: result.pullRequestUrl };
  } catch (error) {
    console.error("Error saving profile:", error);
    throw new Error("Failed to save profile");
  }
}
