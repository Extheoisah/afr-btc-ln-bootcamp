"use server";

import { createPullRequest } from "./github";
import { getBootcamps, getProjects } from "./data";
import type { Project } from "@/types/bootcamp";
import type { Bootcamp } from "@/types/bootcamp";

interface ProjectData {
  name: string;
  description: string;
  bootcampId: string;
  githubUrl?: string;
  demoUrl?: string;
  image?: string | null;
}

export async function submitProject(projectData: ProjectData) {
  try {
    // Fetch current data
    const [currentProjects, currentBootcamps] = await Promise.all([getProjects(), getBootcamps()]);

    // Create deep copies to avoid mutating the original data
    const projects = JSON.parse(JSON.stringify(currentProjects));
    const bootcamps = JSON.parse(JSON.stringify(currentBootcamps));

    // Create new project object with UUID
    const projectId = crypto.randomUUID();
    const newProject: Project = {
      id: projectId,
      name: projectData.name,
      description: projectData.description,
      githubUrl: projectData.githubUrl,
      demoUrl: projectData.demoUrl,
      image: projectData.image || undefined,
    };

    // Add new project to the array without removing existing ones
    projects.push(newProject);

    // Find the bootcamp
    const bootcampIndex = bootcamps.findIndex((b: Bootcamp) => b.id === projectData.bootcampId);
    if (bootcampIndex === -1) {
      throw new Error("Bootcamp not found");
    }

    // Initialize projectIds array if it doesn't exist
    if (!bootcamps[bootcampIndex].projectIds) {
      bootcamps[bootcampIndex].projectIds = [];
    }

    // Add project ID to bootcamp's projectIds array without removing existing ones
    bootcamps[bootcampIndex].projectIds.push(projectId);

    // If there's an image, prepare it for the pull request
    const files = [
      {
        path: "public/data/projects.json",
        content: JSON.stringify(projects, null, 2),
      },
      {
        path: "public/data/bootcamps.json",
        content: JSON.stringify(bootcamps, null, 2),
      },
    ];

    if (projectData.image && projectData.image.startsWith("data:image")) {
      const imageId = crypto.randomUUID();
      const matches = projectData.image.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const imageType = matches[1];
        const fileName = `${imageId}.${imageType}`;
        const imagePath = `/uploads/projects/${fileName}`;
        newProject.image = imagePath;

        files.push({
          path: `public${imagePath}`,
          content: matches[2], // base64 content
        });
      }
    }

    // Create pull request with both project and bootcamp updates
    const result = await createPullRequest({
      title: `Add new project: ${projectData.name}`,
      body: `
## New Project Submission

- **Project Name**: ${projectData.name}
- **Description**: ${projectData.description}
- **Bootcamp**: ${bootcamps[bootcampIndex].location}
${projectData.githubUrl ? `- **GitHub**: ${projectData.githubUrl}` : ""}
${projectData.demoUrl ? `- **Demo URL**: ${projectData.demoUrl}` : ""}

### Technical Details
- Project ID: \`${projectId}\`
- Added to bootcamp: \`${projectData.bootcampId}\`
      `,
      files,
    });

    return { success: true, pullRequestUrl: result.pullRequestUrl };
  } catch (error) {
    console.error("Error submitting project:", error);
    throw new Error("Failed to submit project");
  }
}
