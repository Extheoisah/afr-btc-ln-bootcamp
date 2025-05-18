import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBootcampWithDetails } from "@/lib/data";
import { ArrowLeft, MapPin, Calendar, ExternalLink } from "lucide-react";
import Image from "next/image";

interface BootcampPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BootcampPage(props: BootcampPageProps) {
  const params = await props.params;
  const bootcamp = await getBootcampWithDetails(params.id);

  if (!bootcamp) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/bootcamps" className="mb-6 flex items-center text-sm hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all bootcamps
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative mb-8 h-64 overflow-hidden">
            <Image
              src={
                bootcamp.image || `/placeholder.svg?height=400&width=800&text=${bootcamp.location}`
              }
              alt={`${bootcamp.location} Bootcamp`}
              fill
              className="object-cover"
            />
          </div>

          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold">{bootcamp.location} Bootcamp</h1>
            <div className="mb-4 flex flex-wrap gap-4">
              <div className="text-muted-foreground flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(bootcamp.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-muted-foreground flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {bootcamp.location}
              </div>
            </div>
          </div>

          <Tabs defaultValue="students">
            <TabsList className="mb-4">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="instructors">Instructors</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-6">
              <h2 className="mb-4 text-2xl font-bold">Students</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bootcamp.students.length > 0 ? (
                  bootcamp.students.map((student) => (
                    <Card key={student.id}>
                      <div className="relative mx-auto mt-6 h-32 w-32 overflow-hidden rounded-full">
                        <Image
                          src={
                            student.image ||
                            `/images/person-placeholder.webp?height=200&width=200&text=${student.name}`
                          }
                          alt={student.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{student.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" /> {student.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{student.role}</p>
                        {student.bio && (
                          <p className="text-muted-foreground mt-2 text-sm">{student.bio}</p>
                        )}
                        {student.githubUrl && (
                          <a
                            href={student.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary mt-2 flex items-center text-sm hover:underline"
                          >
                            GitHub <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex h-full flex-col items-start justify-start gap-2">
                    <p className="text-black">No students</p>
                    <p className="text-muted-foreground">
                      Were you a student?{" "}
                      <Link href="/profile" className="text-primary hover:underline">
                        Add your profile
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="instructors" className="space-y-6">
              <h2 className="mb-4 text-2xl font-bold">Instructors</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bootcamp.instructors.length > 0 ? (
                  bootcamp.instructors.map((instructor) => (
                    <Card key={instructor.id}>
                      <div className="relative mx-auto mt-6 h-32 w-32 overflow-hidden rounded-full">
                        <Image
                          src={
                            instructor.image ||
                            `/placeholder.svg?height=200&width=200&text=${instructor.name}`
                          }
                          alt={instructor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{instructor.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" /> {instructor.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{instructor.expertise}</p>
                        {instructor.bio && (
                          <p className="text-muted-foreground mt-2 text-sm">{instructor.bio}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-black">No instructors</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <h2 className="mb-4 text-2xl font-bold">Projects</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {bootcamp.projects.length > 0 ? (
                  bootcamp.projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{project.description}</p>
                        <div className="mt-4 flex gap-4">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary flex items-center text-sm hover:underline"
                            >
                              GitHub <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary flex items-center text-sm hover:underline"
                            >
                              Demo <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex h-full flex-col items-start justify-start gap-2">
                    <p className="text-black">No projects</p>
                    <p className="text-muted-foreground">
                      Were you a student?{" "}
                      <Link href="/projects" className="text-primary hover:underline">
                        Add your project
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Bootcamp Sponsors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bootcamp.sponsors.length > 0 ? (
                bootcamp.sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="flex items-center space-x-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded">
                      <Image
                        src={
                          sponsor.logo || `/placeholder.svg?height=50&width=50&text=${sponsor.name}`
                        }
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{sponsor.name}</h3>
                      <p className="text-muted-foreground text-sm">{sponsor.type}</p>
                      {sponsor.website && (
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary mt-1 flex items-center text-sm hover:underline"
                        >
                          Website <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-black">No sponsors</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
