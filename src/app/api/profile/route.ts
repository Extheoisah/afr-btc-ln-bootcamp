import { NextResponse } from "next/server";
import { createPullRequest } from "@/lib/github";
import { headers } from "next/headers";
import type { Bootcamp } from "@/types/bootcamp";

export async function POST(request: Request) {
  try {
    const profileData = await request.json();
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Handle image upload if provided
    let imagePath = undefined;
    if (profileData.image && profileData.image.startsWith("data:image")) {
      // Generate a unique filename
      const imageId = crypto.randomUUID();
      const matches = profileData.image.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const imageType = matches[1];
        const fileName = `${imageId}.${imageType}`;
        imagePath = `/uploads/${fileName}`;
      }
    }

    // Fetch current data from the public JSON files
    const studentsResponse = await fetch(`${protocol}://${host}/data/students.json`);
    const bootcampsResponse = await fetch(`${protocol}://${host}/data/bootcamps.json`);

    const studentsData = await studentsResponse.json();
    const bootcampsData = (await bootcampsResponse.json()) as Bootcamp[];

    // Create new student object
    const newStudent = {
      id: crypto.randomUUID(),
      name: profileData.name,
      location: profileData.location,
      role: profileData.role,
      bio: profileData.bio,
      image: imagePath,
    };

    // Add new student to the array
    studentsData.push(newStudent);

    // Find the bootcamp and add student ID
    const bootcampIndex = bootcampsData.findIndex((b: Bootcamp) => b.id === profileData.bootcampId);
    if (bootcampIndex === -1) {
      return NextResponse.json({ error: "Bootcamp not found" }, { status: 404 });
    }

    // Initialize students array if it doesn't exist
    if (!bootcampsData[bootcampIndex].studentIds) {
      bootcampsData[bootcampIndex].studentIds = [];
    }

    // Add student ID to bootcamp
    bootcampsData[bootcampIndex].studentIds.push(newStudent.id);

    // If there's an image, prepare it for the pull request
    const files = [
      {
        path: "public/data/students.json",
        content: JSON.stringify(studentsData, null, 2),
      },
      {
        path: "public/data/bootcamps.json",
        content: JSON.stringify(bootcampsData, null, 2),
      },
    ];

    if (imagePath && profileData.image) {
      files.push({
        path: `public${imagePath}`,
        content: profileData.image.split(",")[1], // Get the base64 content without the prefix
      });
    }

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
      files,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
