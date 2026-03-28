import Link from "next/link";
import React from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const Navbar = () => {
  return (
    <nav className="sticky top-0 w-full h-10  border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold tracking-wider font-mono text-primary"
            >
              Socially
            </Link>
          </div>
          <DesktopNav />
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
