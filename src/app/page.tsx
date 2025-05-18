import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllBootcampsWithDetails } from "@/lib/data";
import { Bitcoin } from "lucide-react";
import Image from "next/image";

export default async function HomePage() {
  const bootcamps = await getAllBootcampsWithDetails();

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <div className="mb-4 flex justify-center">
          <Bitcoin className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="mb-4 text-4xl font-bold">Africa Bitcoin Lightning Bootcamp</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Training the next generation of Bitcoin developers across Africa
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Our Bootcamps</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bootcamps.map((bootcamp) => (
            <Card key={bootcamp.id} className="overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={
                    bootcamp.image ||
                    `/placeholder.svg?height=200&width=400&text=${bootcamp.location}`
                  }
                  alt={`${bootcamp.location} Bootcamp`}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{bootcamp.location}</CardTitle>
                <CardDescription>
                  {new Date(bootcamp.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  {bootcamp.students?.length || 0}{" "}
                  {bootcamp.students?.length === 1 ? "Student" : "Students"}
                </p>
                <p className="mb-2">
                  {bootcamp.instructors?.length || 0}{" "}
                  {bootcamp.instructors?.length === 1 ? "Instructor" : "Instructors"}
                </p>
                <p>
                  {bootcamp.projects?.length || 0}{" "}
                  {bootcamp.projects?.length === 1 ? "Project" : "Projects"}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/bootcamp/${bootcamp.id}`} className="w-full">
                  <Button variant="default" className="w-full cursor-pointer">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Bitcoin Projects</h2>
        <p className="mb-6">Explore projects built during our bootcamps or submit your own</p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/projects">
            <Button className="cursor-pointer">View Projects</Button>
          </Link>
          <Link href="/projects/submit">
            <Button variant="outline" className="cursor-pointer">
              Submit Your Project
            </Button>
          </Link>
        </div>
      </section>

      <section className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Are you a bootcamp student?</h2>
        <p className="mb-6">Update your profile and showcase your projects</p>
        <Link href="/profile">
          <Button className="cursor-pointer">Add Your Profile</Button>
        </Link>
      </section>
    </div>
  );
}
