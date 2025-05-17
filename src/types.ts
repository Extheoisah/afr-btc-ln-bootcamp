export interface Student {
  id: string;
  name: string;
  location: string;
  role: string;
  image?: string;
  bio?: string;
}

export interface Instructor {
  id: string;
  name: string;
  location: string;
  expertise: string;
  image?: string;
  bio?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  studentId: string;
  studentName: string;
  githubUrl?: string;
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
  description: string;
  image?: string;
  students: Student[];
  instructors: Instructor[];
  projects: Project[];
  sponsors: Sponsor[];
}

export interface BootcampData {
  bootcamps: Bootcamp[];
}
