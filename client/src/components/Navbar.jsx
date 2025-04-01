import { School } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuContent,
    DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import DarkMode from '@/DarkMode';
import {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from './ui/sheet';
import { Menu } from "lucide-react";
import { Separator } from '@radix-ui/react-dropdown-menu';

const Navbar = () => {
    const user = false;

    return (
        <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
            <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4'>
                <div className='flex items-center gap-2'>
                    <School size={"30"} className="text-black dark:text-white" />
                    <h1 className='hidden md:block font-extrabold text-2xl text-black dark:text-white'>E-Learning</h1>
                </div>
                <div className='flex items-center gap-8'>
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
                                    <DropdownMenuItem>My Learning</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Log out</DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <Button className="text-black dark:text-white border-black dark:border-white" variant="outline">
                                Login
                            </Button>
                            <Button className="text-black dark:text-white border-black dark:border-white" variant="outline">
                                Signup
                            </Button>

                        </div>
                    )}
                    <DarkMode />
                </div>
            </div>
            <div className='flex md:hidden items-center justify-between px-4 h-full'>
                <h1 className='font-extrabold text-2xl '>E-Learning</h1>
                <MobileNavbar />
            </div>
        </div>
    );
};

export default Navbar;

const MobileNavbar = () => {
    const role = "instructor"
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' className="rounded-full bg-gray-200 hover:bg-gray-200" variant="outline">
                    <Menu className="dark:white"/>
                </Button>
            </SheetTrigger>

            <SheetContent className="flex flex-col bg-white text-black dark:bg-black dark:text-white">

                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle>E-Learning</SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <Separator />
                <nav className='flex flex-col space-y-4'>
                    <span>My Learning</span>
                    <span>Edit Profile</span>
                    <p>Log out</p>
                </nav>
                {
                    role === "instructor" && (
                        <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Dashboard</Button>
                    </SheetClose>
                </SheetFooter>
                    )
                }
            </SheetContent>
        </Sheet>
    )
}