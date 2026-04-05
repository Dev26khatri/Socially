import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const UnauthCard = () => {
  return (
    <Card className="p-6 sticky top-20 ">
      <CardHeader className="flex justify-center flex-col items-center">
        <CardTitle className="text-2xl font-bold">Welcom Back!</CardTitle>
        <CardDescription className="text-center text-muted-foreground mb-4">
          Loggin to access your porfile and connect with others
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 ">
        <SignInButton mode="modal">
          <Button className="text-lg " variant={"outline"}>
            Login
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="text-lg" variant={"default"}>
            Sign Up
          </Button>
        </SignUpButton>
      </CardContent>
    </Card>
  );
};

export default UnauthCard;
