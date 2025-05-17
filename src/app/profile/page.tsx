"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllBootcampsWithDetails } from "@/lib/data"
import { saveProfile } from "@/lib/profile-service"
import { toast } from "sonner"
import Image from "next/image"

export default function ProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const bootcamps = getAllBootcampsWithDetails()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const profileData = {
        name: formData.get("name") as string,
        location: formData.get("location") as string,
        role: formData.get("role") as string,
        bootcampId: formData.get("bootcampId") as string,
        bio: formData.get("bio") as string,
        image: imagePreview,
      }

      await saveProfile(profileData)

      toast.success("Profile Updated", {
        description: "Your profile has been successfully updated.",
      })

      // Reset form or redirect
    } catch (error) {
      toast.error("Error", {
        description: "There was a problem updating your profile.",
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Update Your Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile information to be displayed on the bootcamp page</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Nairobi, Kenya" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" name="role" placeholder="Developer / Student" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bootcampId">Bootcamp Attended</Label>
                <Select name="bootcampId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bootcamp" />
                  </SelectTrigger>
                  <SelectContent>
                    {bootcamps.map((bootcamp) => (
                      <SelectItem key={bootcamp.id} value={bootcamp.id}>
                        {bootcamp.location} -{" "}
                        {new Date(bootcamp.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself and your experience with Bitcoin"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile Image</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                  <div className="border rounded-md flex items-center justify-center h-32 overflow-hidden relative">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground">Image preview</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
