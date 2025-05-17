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
import { getBootcamps } from "@/lib/data";
import { MapPin, Calendar, Users } from "lucide-react";
import Image from "next/image";
import type { Bootcamp } from "@/types/bootcamp";

export default async function BootcampsPage() {
  const bootcamps = await getBootcamps();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Bootcamps</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bootcamps.map((bootcamp: Bootcamp) => (
          <Card key={bootcamp.id} className="flex flex-col">
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
              <CardDescription className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(bootcamp.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{bootcamp.studentIds.length} Students</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{bootcamp.location}</span>
                </div>
              </div>
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
    </div>
  );
}
