export interface Student {
  id: string;
  name: string;
  location: string;
  role: string;
  bio?: string;
  image?: string;
}

export interface Instructor {
  id: string;
  name: string;
  location: string;
  expertise: string;
  bio?: string;
  image?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  type: string;
  logo?: string;
  website?: string;
}

export interface Bootcamp {
  id: string;
  location: string;
  date: string;
  image?: string;
  studentIds: string[];
  instructorIds: string[];
  projectIds: string[];
  sponsorIds: string[];
  // Populated arrays after data fetching
  students?: Student[];
  instructors?: Instructor[];
  projects?: Project[];
  sponsors?: Sponsor[];
} 