import Link from "next/link";
import { Bitcoin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Bitcoin className="h-5 w-5 text-amber-500" />
            <span className="font-bold">Bitcoin Lightning Bootcamp</span>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/bootcamps"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Bootcamps
            </Link>
            <Link
              href="/instructors"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Instructors
            </Link>
            <Link
              href="/sponsors"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Sponsors
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Bitcoin Lightning Bootcamp. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
