import type { Bootcamp, Student, Instructor, Project, Sponsor } from "@/types/bootcamp"

async function fetchJson<T>(path: string): Promise<T> {
  // Use window.location.origin in client components, or hardcode the base URL in server components
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return response.json();
}

export async function getBootcamps(): Promise<Bootcamp[]> {
  return fetchJson<Bootcamp[]>("/data/bootcamps.json");
}

export async function getStudents(): Promise<Student[]> {
  return fetchJson<Student[]>("/data/students.json");
}

export async function getInstructors(): Promise<Instructor[]> {
  return fetchJson<Instructor[]>("/data/instructors.json");
}

export async function getProjects(): Promise<Project[]> {
  return fetchJson<Project[]>("/data/projects.json");
}

export async function getSponsors(): Promise<Sponsor[]> {
  return fetchJson<Sponsor[]>("/data/sponsors.json");
}

export async function getBootcampWithDetails(bootcampId: string): Promise<(Bootcamp & {
  students: Student[];
  instructors: Instructor[];
  projects: Project[];
  sponsors: Sponsor[];
}) | null> {
  const [bootcamps, students, instructors, projects, sponsors] = await Promise.all([
    getBootcamps(),
    getStudents(),
    getInstructors(),
    getProjects(),
    getSponsors(),
  ]);

  const bootcamp = bootcamps.find((b: Bootcamp) => b.id === bootcampId);
  if (!bootcamp) return null;

  return {
    ...bootcamp,
    students: bootcamp.studentIds?.map(id => students.find(s => s.id === id)).filter((s): s is Student => s !== undefined) || [],
    instructors: bootcamp.instructorIds?.map(id => instructors.find(i => i.id === id)).filter((i): i is Instructor => i !== undefined) || [],
    projects: bootcamp.projectIds?.map(id => projects.find(p => p.id === id)).filter((p): p is Project => p !== undefined) || [],
    sponsors: bootcamp.sponsorIds?.map(id => sponsors.find(s => s.id === id)).filter((s): s is Sponsor => s !== undefined) || [],
  };
}

export async function getAllBootcampsWithDetails(): Promise<(Bootcamp & {
  students: Student[];
  instructors: Instructor[];
  projects: Project[];
  sponsors: Sponsor[];
})[]> {
  const [bootcamps, students, instructors, projects, sponsors] = await Promise.all([
    getBootcamps(),
    getStudents(),
    getInstructors(),
    getProjects(),
    getSponsors(),
  ]);

  return bootcamps.map((bootcamp: Bootcamp) => ({
    ...bootcamp,
    students: bootcamp.studentIds?.map(id => students.find(s => s.id === id)).filter((s): s is Student => s !== undefined) || [],
    instructors: bootcamp.instructorIds?.map(id => instructors.find(i => i.id === id)).filter((i): i is Instructor => i !== undefined) || [],
    projects: bootcamp.projectIds?.map(id => projects.find(p => p.id === id)).filter((p): p is Project => p !== undefined) || [],
    sponsors: bootcamp.sponsorIds?.map(id => sponsors.find(s => s.id === id)).filter((s): s is Sponsor => s !== undefined) || [],
  }));
}
