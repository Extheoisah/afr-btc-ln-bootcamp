import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllBootcampsWithDetails } from "@/lib/data"
import { GithubIcon, LinkedinIcon, MapPin, TwitterIcon } from "lucide-react"
import Image from "next/image"
import type { Instructor } from "@/types/bootcamp"

export default async function InstructorsPage() {
  const bootcamps = await getAllBootcampsWithDetails()
  
  // Collect all instructors from all bootcamps
  const allInstructors = bootcamps.flatMap((bootcamp) =>
    (bootcamp.instructors || []).map((instructor) => ({
      ...instructor,
      bootcampLocation: bootcamp.location,
      bootcampId: bootcamp.id,
    }))
  )

  // Remove duplicates (instructors who taught at multiple bootcamps)
  const uniqueInstructors = Array.from(
    new Map(allInstructors.map((instructor) => [instructor.id, instructor])).values()
  ) as (Instructor & { bootcampLocation: string; bootcampId: string })[]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Instructors</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueInstructors.map((instructor) => (
          <Card key={instructor.id}>
            <div className="h-48 w-48 overflow-hidden relative rounded-full mx-auto mt-6 border-4 border-primary/20 shadow-md">
              <Image
                src={instructor.image || `/images/person-placeholder.webp?height=200&width=200&text=${instructor.name}`}
                alt={instructor.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <CardHeader>
              <CardTitle>{instructor.name}</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" /> {instructor.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-2"><span className="text-muted-foreground">Expertise:</span> {instructor.expertise}</p>
              <p className="font-medium mb-2"><span className="text-muted-foreground">Company:</span> {instructor.company}</p>
              {instructor.bio && <p className="text-sm text-muted-foreground mb-4">{instructor.bio}</p>}
              <div className="flex gap-2">
                {instructor.twitter && (
                  <a href={instructor.twitter} target="_blank" rel="noopener noreferrer">
                    <TwitterIcon className="h-4 w-4 hover:text-blue-500" />
                  </a>
                )}
                {instructor.linkedin && (
                  <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer">
                    <LinkedinIcon className="h-4 w-4 hover:text-blue-500" />
                  </a>
                )}
                {instructor.github && (
                  <a href={instructor.github} target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="h-4 w-4 hover:text-gray-500" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
