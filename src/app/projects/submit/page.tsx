"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllBootcampsWithDetails } from "@/lib/data";
import { toast } from "sonner";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Bootcamp } from "@/types/bootcamp";
import { submitProject } from "../../../lib/project-service";

export default function SubmitProjectPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pullRequestUrl, setPullRequestUrl] = useState<string | null>(null);
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBootcamps() {
      try {
        const data = await getAllBootcampsWithDetails();
        setBootcamps(data);
      } catch (error) {
        console.error("Error loading bootcamps:", error);
        toast.error("Failed to load bootcamps");
      } finally {
        setIsLoading(false);
      }
    }

    loadBootcamps();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (1MB limit)
      if (file.size > 1024 * 1024) {
        toast.error("Image is too large", {
          description: "Please select an image smaller than 1MB.",
        });
        e.target.value = "";
        setImagePreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    // Reset the file input if we have a reference to it
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const projectData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        bootcampId: formData.get("bootcampId") as string,
        githubUrl: formData.get("githubUrl") as string,
        demoUrl: formData.get("demoUrl") as string,
        image: imagePreview,
      };

      const result = await submitProject(projectData);
      setPullRequestUrl(result.pullRequestUrl);

      toast.success("Project Submitted", {
        description: "A pull request has been created with your project submission.",
      });

      // Don't reset the form so user can see their submission
    } catch (error) {
      toast.error("Error", {
        description: "There was a problem submitting your project.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
              <CardDescription>Please wait while we load the bootcamp data.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Submit Your Project</h1>

        {pullRequestUrl ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Project Submitted Successfully!</CardTitle>
              <CardDescription>
                Your project has been submitted as a pull request. Click below to view and track
                your submission.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={pullRequestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center hover:underline"
              >
                View Pull Request <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>
              Submit your Bitcoin project to be featured on the bootcamp page
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" name="name" placeholder="My Lightning Project" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your project and what problems it solves"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub Repository</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  placeholder="https://github.com/username/repo"
                  type="url"
                  pattern="https://github.com/.*"
                  title="Please enter a valid GitHub repository URL"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demoUrl">Demo URL (Optional)</Label>
                <Input id="demoUrl" name="demoUrl" placeholder="https://myproject.com" type="url" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bootcampId">Related Bootcamp</Label>
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
                <Label htmlFor="image">Project Screenshot (Optional)</Label>
                <p className="text-muted-foreground mt-1 text-xs">Maximum file size: 1MB</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex-1"
                    />
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteImage}
                        className="cursor-pointer whitespace-nowrap"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-md border">
                    {imagePreview ? (
                      <div className="absolute inset-0">
                        <Image
                          src={imagePreview}
                          alt="Project screenshot preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Screenshot preview</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="mt-4 h-12 w-full cursor-pointer"
                disabled={isSubmitting || !!pullRequestUrl}
              >
                {isSubmitting
                  ? "Submitting..."
                  : pullRequestUrl
                    ? "Project Submitted"
                    : "Submit Project"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
