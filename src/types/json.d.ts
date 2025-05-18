import type { Bootcamp, Student, Instructor, Project, Sponsor } from "./bootcamp";

declare module "@/public/data/bootcamps.json" {
  const value: Bootcamp[];
  export default value;
}

declare module "@/public/data/students.json" {
  const value: Student[];
  export default value;
}

declare module "@/public/data/instructors.json" {
  const value: Instructor[];
  export default value;
}

declare module "@/public/data/projects.json" {
  const value: Project[];
  export default value;
}

declare module "@/public/data/sponsors.json" {
  const value: Sponsor[];
  export default value;
}
