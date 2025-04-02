import { School, Menu } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "./ui/sheet";

const Navbar = () => {
  const user = false; // Change based on authentication

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <School size={30} className="text-black dark:text-white" />
          <h1 className="hidden md:block font-extrabold text-2xl text-black dark:text-white">
            <Link to="/">E-Learning</Link>
          </h1>
        </div>

        {/* Navbar Actions */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/edit-profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/logout">Log out</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild className="text-black dark:text-white border border-black dark:border-white">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="text-black dark:text-white border border-black dark:border-white">
                <Link to="/signup">Signup</Link>
              </Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">
          <Link to="/">E-Learning</Link>
        </h1>
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const role = "instructor"; // Replace with dynamic role if needed

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300">
          <Menu className="dark:text-white" />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col bg-white text-black dark:bg-black dark:text-white">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>E-Learning</SheetTitle>
          <DarkMode />
        </SheetHeader>

        <nav className="flex flex-col space-y-4 mt-4">
          <Link to="/my-learning" className="cursor-pointer">
            My Learning
          </Link>
          <Link to="/edit-profile" className="cursor-pointer">
            Edit Profile
          </Link>
          <Link to="/logout" className="cursor-pointer">
            Log out
          </Link>
        </nav>

        {role === "instructor" && (
          <SheetFooter className="mt-4">
            <SheetClose asChild>
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
