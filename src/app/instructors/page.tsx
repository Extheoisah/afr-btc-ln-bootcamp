import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { bootcamps } from "@/lib/data"
import { MapPin } from "lucide-react"
import Image from "next/image"

export default function InstructorsPage() {
  // Collect all instructors from all bootcamps
  const allInstructors = bootcamps.flatMap((bootcamp) =>
    bootcamp.instructors.map((instructor) => ({
      ...instructor,
      bootcampLocation: bootcamp.location,
      bootcampId: bootcamp.id,
    })),
  )

  // Remove duplicates (instructors who taught at multiple bootcamps)
  const uniqueInstructors = Array.from(
    new Map(allInstructors.map((instructor) => [instructor.id, instructor])).values(),
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Instructors</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueInstructors.map((instructor) => (
          <Card key={instructor.id}>
            <div className="h-48 overflow-hidden relative">
              <Image
                src={instructor.image || `/placeholder.svg?height=200&width=200&text=${instructor.name}`}
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
              <p className="font-medium mb-2">Expertise: {instructor.expertise}</p>
              {instructor.bio && <p className="text-sm text-muted-foreground">{instructor.bio}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
