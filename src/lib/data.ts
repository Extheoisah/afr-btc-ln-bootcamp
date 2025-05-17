import type { Bootcamp, Student, Instructor, Project, Sponsor } from "@/types/bootcamp"

// Import JSON files directly
import bootcampsData from '../../public/data/bootcamps.json'
import studentsData from '../../public/data/students.json'
import instructorsData from '../../public/data/instructors.json'
import projectsData from '../../public/data/projects.json'
import sponsorsData from '../../public/data/sponsors.json'

export async function getBootcamps(): Promise<Bootcamp[]> {
  return bootcampsData as Bootcamp[];
}

export async function getStudents(): Promise<Student[]> {
  return studentsData as Student[];
}

export async function getInstructors(): Promise<Instructor[]> {
  return instructorsData as Instructor[];
}

export async function getProjects(): Promise<Project[]> {
  return projectsData as Project[];
}

export async function getSponsors(): Promise<Sponsor[]> {
  return sponsorsData as Sponsor[];
}

export async function getBootcampWithDetails(bootcampId: string): Promise<(Bootcamp & {
  students: Student[];
  instructors: Instructor[];
  projects: Project[];
  sponsors: Sponsor[];
}) | null> {
  const bootcamp = (bootcampsData as Bootcamp[]).find((b) => b.id === bootcampId);
  if (!bootcamp) return null;

  return {
    ...bootcamp,
    students: bootcamp.studentIds?.map(id => (studentsData as Student[]).find(s => s.id === id)).filter(Boolean) as Student[] || [],
    instructors: bootcamp.instructorIds?.map(id => (instructorsData as Instructor[]).find(i => i.id === id)).filter(Boolean) as Instructor[] || [],
    projects: bootcamp.projectIds?.map(id => (projectsData as Project[]).find(p => p.id === id)).filter(Boolean) as Project[] || [],
    sponsors: bootcamp.sponsorIds?.map(id => (sponsorsData as Sponsor[]).find(s => s.id === id)).filter(Boolean) as Sponsor[] || [],
  };
}

export async function getAllBootcampsWithDetails(): Promise<(Bootcamp & {
  students: Student[];
  instructors: Instructor[];
  projects: Project[];
  sponsors: Sponsor[];
})[]> {
  return (bootcampsData as Bootcamp[]).map((bootcamp) => ({
    ...bootcamp,
    students: bootcamp.studentIds?.map(id => (studentsData as Student[]).find(s => s.id === id)).filter(Boolean) as Student[] || [],
    instructors: bootcamp.instructorIds?.map(id => (instructorsData as Instructor[]).find(i => i.id === id)).filter(Boolean) as Instructor[] || [],
    projects: bootcamp.projectIds?.map(id => (projectsData as Project[]).find(p => p.id === id)).filter(Boolean) as Project[] || [],
    sponsors: bootcamp.sponsorIds?.map(id => (sponsorsData as Sponsor[]).find(s => s.id === id)).filter(Boolean) as Sponsor[] || [],
  }));
}
