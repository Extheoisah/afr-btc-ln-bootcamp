import Link from "next/link";
import { Bitcoin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12 border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center space-x-2 md:mb-0">
            <Bitcoin className="h-5 w-5 text-amber-500" />
            <span className="font-bold">Bitcoin Lightning Bootcamp</span>
          </div>

          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
            <Link href="/" className="text-muted-foreground hover:text-primary text-sm">
              Home
            </Link>
            <Link href="/bootcamps" className="text-muted-foreground hover:text-primary text-sm">
              Bootcamps
            </Link>
            <Link href="/instructors" className="text-muted-foreground hover:text-primary text-sm">
              Instructors
            </Link>
            <Link href="/sponsors" className="text-muted-foreground hover:text-primary text-sm">
              Sponsors
            </Link>
            <Link href="/projects" className="text-muted-foreground hover:text-primary text-sm">
              Projects
            </Link>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Bitcoin Lightning Bootcamp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
