import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllBootcampsWithDetails } from "@/lib/data";
import { Github, Globe } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/types/bootcamp";

export default async function ProjectsPage() {
  const bootcamps = await getAllBootcampsWithDetails();

  // Collect all projects from all bootcamps
  const allProjects = bootcamps.flatMap((bootcamp) =>
    (bootcamp.projects || []).map((project) => ({
      ...project,
      bootcampLocation: bootcamp.location,
      bootcampId: bootcamp.id,
    }))
  );

  // Remove duplicates (projects that are part of multiple bootcamps)
  const uniqueProjects = Array.from(
    new Map(allProjects.map((project) => [project.id, project])).values()
  ) as (Project & { bootcampLocation: string; bootcampId: string })[];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/projects/submit">
          <Button>Submit Your Project</Button>
        </Link>
      </div>

      {uniqueProjects.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">No projects yet</h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
            Be the first to submit a Bitcoin Lightning project from one of our bootcamps!
          </p>
          <Link href="/projects/submit">
            <Button size="lg">Submit Your Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {uniqueProjects.map((project) => (
            <Card key={project.id} className="flex h-full flex-col">
              {project.image && (
                <div className="relative h-48 overflow-hidden">
                  <Image src={project.image} alt={project.name} fill className="object-cover" />
                </div>
              )}
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.bootcampLocation} Bootcamp</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mb-4 text-sm">{project.description}</p>
              </CardContent>
              <CardFooter className="flex gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary flex items-center text-sm"
                  >
                    <Github className="mr-1 h-4 w-4" /> Code
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary flex items-center text-sm"
                  >
                    <Globe className="mr-1 h-4 w-4" /> Demo
                  </a>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
