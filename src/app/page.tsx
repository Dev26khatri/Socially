import React from "react";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
const RootPage = () => {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

export default RootPage;
