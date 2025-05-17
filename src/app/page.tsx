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
import { bootcamps } from "@/lib/data";
import { Bitcoin } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <div className="flex justify-center mb-4">
          <Bitcoin className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Bitcoin Lightning Bootcamp</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Training the next generation of Bitcoin developers across Africa
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Our Bootcamps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bootcamps.map((bootcamp) => (
            <Card key={bootcamp.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden relative">
                <Image
                  src={bootcamp.image || `/placeholder.svg?height=200&width=400&text=${bootcamp.location}`}
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
                <p className="mb-2">{bootcamp.students.length} Students</p>
                <p className="mb-2">
                  {bootcamp.instructors.length} Instructors
                </p>
                <p>{bootcamp.projects.length} Projects</p>
              </CardContent>
              <CardFooter>
                <Link href={`/bootcamp/${bootcamp.id}`} className="w-full">
                  <Button variant="default" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Are you a bootcamp student?</h2>
        <p className="mb-6">Update your profile and showcase your projects</p>
        <Link href="/profile">
          <Button>Update Your Profile</Button>
        </Link>
      </section>
    </div>
  );
}
