import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { bootcamps } from "@/lib/data"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

export default function SponsorsPage() {
  // Collect all sponsors from all bootcamps
  const allSponsors = bootcamps.flatMap((bootcamp) =>
    bootcamp.sponsors.map((sponsor) => ({
      ...sponsor,
      bootcampLocation: bootcamp.location,
      bootcampId: bootcamp.id,
    })),
  )

  // Remove duplicates (sponsors who supported multiple bootcamps)
  const uniqueSponsors = Array.from(new Map(allSponsors.map((sponsor) => [sponsor.id, sponsor])).values())

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Sponsors</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueSponsors.map((sponsor) => (
          <Card key={sponsor.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded relative">
                <Image
                  src={sponsor.logo || `/placeholder.svg?height=100&width=100&text=${sponsor.name}`}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <CardTitle>{sponsor.name}</CardTitle>
                <CardDescription>{sponsor.type}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {sponsor.website && (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-primary hover:underline"
                >
                  Visit Website <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
