import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllBootcampsWithDetails } from "@/lib/data";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import type { Sponsor } from "@/types/bootcamp";

export default async function SponsorsPage() {
  const bootcamps = await getAllBootcampsWithDetails();

  // Collect all sponsors from all bootcamps
  const allSponsors = bootcamps.flatMap((bootcamp) =>
    (bootcamp.sponsors || []).map((sponsor) => ({
      ...sponsor,
      bootcampLocation: bootcamp.location,
      bootcampId: bootcamp.id,
    }))
  );

  // Remove duplicates (sponsors who supported multiple bootcamps)
  const uniqueSponsors = Array.from(
    new Map(allSponsors.map((sponsor) => [sponsor.id, sponsor])).values()
  ) as (Sponsor & { bootcampLocation: string; bootcampId: string })[];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Our Sponsors</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {uniqueSponsors.map((sponsor) => (
          <Card key={sponsor.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded">
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
                  className="text-primary flex items-center text-sm hover:underline"
                >
                  Visit Website <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
