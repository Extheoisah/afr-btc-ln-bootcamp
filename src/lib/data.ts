import fs from "fs"
import path from "path"
import type { Bootcamp, Student, Instructor, Project, Sponsor } from "@/types/bootcamp"

function loadJson<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "public", "data", filename)
  const fileContents = fs.readFileSync(filePath, "utf8")
  return JSON.parse(fileContents)
}

export function getBootcamps(): Bootcamp[] {
  return loadJson<Bootcamp[]>("bootcamps.json")
}

export function getStudents(): Student[] {
  return loadJson<Student[]>("students.json")
}

export function getInstructors(): Instructor[] {
  return loadJson<Instructor[]>("instructors.json")
}

export function getProjects(): Project[] {
  return loadJson<Project[]>("projects.json")
}

export function getSponsors(): Sponsor[] {
  return loadJson<Sponsor[]>("sponsors.json")
}

export function getBootcampWithDetails(bootcampId: string) {
  const bootcamps = getBootcamps()
  const students = getStudents()
  const instructors = getInstructors()
  const projects = getProjects()
  const sponsors = getSponsors()

  const bootcamp = bootcamps.find(b => b.id === bootcampId)
  if (!bootcamp) return null

  return {
    ...bootcamp,
    students: students.filter(s => bootcamp.studentIds.includes(s.id)),
    instructors: instructors.filter(i => bootcamp.instructorIds.includes(i.id)),
    projects: projects.filter(p => bootcamp.projectIds.includes(p.id)),
    sponsors: sponsors.filter(s => bootcamp.sponsorIds.includes(s.id)),
  }
}

export function getAllBootcampsWithDetails() {
  const bootcamps = getBootcamps()
  const students = getStudents()
  const instructors = getInstructors()
  const projects = getProjects()
  const sponsors = getSponsors()

  return bootcamps.map(bootcamp => ({
    ...bootcamp,
    students: students.filter(s => bootcamp.studentIds.includes(s.id)),
    instructors: instructors.filter(i => bootcamp.instructorIds.includes(i.id)),
    projects: projects.filter(p => bootcamp.projectIds.includes(p.id)),
    sponsors: sponsors.filter(s => bootcamp.sponsorIds.includes(s.id)),
  }))
}
