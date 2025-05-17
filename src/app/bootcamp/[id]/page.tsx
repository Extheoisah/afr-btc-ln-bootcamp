import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getBootcamps,
  getInstructors,
  getProjects,
  getSponsors,
  getStudents,
} from "@/lib/data";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import Image from "next/image";

interface BootcampPageProps {
  params: {
    id: string;
  };
}

export default function BootcampPage({ params }: BootcampPageProps) {
  const bootcamp = getBootcamps().find((b) => b.id === params.id);

  if (!bootcamp) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="flex items-center mb-6 text-sm hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all bootcamps
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-64 overflow-hidden relative mb-8">
            <Image
              src={
                bootcamp.image ||
                `/placeholder.svg?height=400&width=800&text=${bootcamp.location}`
              }
              alt={`${bootcamp.location} Bootcamp`}
              fill
              className="object-cover"
            />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              {bootcamp.location} Bootcamp
            </h1>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(bootcamp.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {bootcamp.location}
              </div>
            </div>
            <p className="text-lg">{bootcamp.description}</p>
          </div>

          <Tabs defaultValue="students">
            <TabsList className="mb-4">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="instructors">Instructors</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Students</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getStudents()
                  .filter((student) => bootcamp.studentIds.includes(student.id))
                  .map((student) => (
                    <Card key={student.id}>
                      <div className="h-32 w-32 overflow-hidden rounded-full relative">
                        <Image
                          src={
                            student.image ||
                            `/placeholder.svg?height=200&width=200&text=${student.name}`
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
                        <p className="text-sm text-muted-foreground">
                          {student.role}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="instructors" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Instructors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getInstructors()
                  .filter((instructor) =>
                    bootcamp.instructorIds.includes(instructor.id)
                  )
                  .map((instructor) => (
                    <Card key={instructor.id}>
                      <div className="h-32 w-32 overflow-hidden rounded-full relative">
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
                          <MapPin className="mr-1 h-3 w-3" />{" "}
                          {instructor.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {instructor.expertise}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getProjects()
                  .filter((project) => bootcamp.projectIds.includes(project.id))
                  .map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>
                          By: {project.studentName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{project.description}</p>
                      </CardContent>
                    </Card>
                  ))}
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
              {getSponsors()
                .filter((sponsor) => bootcamp.sponsorIds.includes(sponsor.id))
                .map((sponsor) => (
                  <div key={sponsor.id} className="flex items-center space-x-4">
                    <div className="h-12 w-12 overflow-hidden rounded relative">
                      <Image
                        src={
                          sponsor.logo ||
                          `/placeholder.svg?height=50&width=50&text=${sponsor.name}`
                        }
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{sponsor.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {sponsor.type}
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
