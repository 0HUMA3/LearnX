import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";


const Profile = () => {
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);

    const { data, isLoading, refetch} = useLoadUserQuery();
    const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess }] = useUpdateUserMutation();

    useEffect(() => {
        if (data?.user) {
            setName(data.user.name);
        }
    }, [data]);

    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setProfilePhoto(file);
    };

    const updateUserHandler = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        if (profilePhoto) {
            formData.append("profilePhoto", profilePhoto);
        }
        await updateUser(formData);
    };

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (isSuccess && updateUserData) {
            refetch();
            toast.success(updateUserData.message || "Profile updated.");
        } 
        if (isError && error) {
            toast.error(error.message || "Failed to update profile.");
        }
    }, [updateUserData, error, isSuccess, isError]);

    if (isLoading) return <h1>Profile Loading...</h1>;
    if (!data || !data.user) return <h1>Error loading profile</h1>;

    const { user } = data;

    return (
        <div className="max-w-4xl mx-auto px-4 my-24">
            <h1 className="font-bold text-2xl text-center md:text-left">Profile Page</h1>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
                <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
                        <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <div className="mb-2">
                        <h1 className="font-bold text-black-900 dark:text-gray-300 ml-2">
                            Name:
                            <span className="font-semibold text-black-700 dark:text-gray-400 ml-2">
                                {user.name}
                            </span>
                        </h1>
                    </div>
                    <div className="mb-2">
                        <h1 className="font-bold text-black-900 dark:text-gray-300 ml-2">
                            Email:
                            <span className="font-semibold text-black-700 dark:text-gray-400 ml-2">
                                {user.email}
                            </span>
                        </h1>
                    </div>
                    <div className="mb-2">
                        <h1 className="font-bold text-black-900 dark:text-gray-300 ml-2">
                            Role:
                            <span className="font-semibold text-black-700 dark:text-gray-400 ml-2">
                                {user.role.toUpperCase()}
                            </span>
                        </h1>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="mt-2">Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-lg p-6 bg-white text-black dark:bg-black dark:text-white">
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-black dark:text-white"> Name </Label>
                                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-black dark:text-white"> Profile Photo </Label>
                                    <Input onChange={onChangeHandler} type="file" accept="image/*" className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button disabled={updateUserIsLoading} onClick={updateUserHandler} className="bg-gray-800 text-white dark:bg-gray-200 dark:text-black">
                                    {updateUserIsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                        </>
                                    ) : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
                    {user.enrolledCourses.length === 0 ? (
                        <h1>You haven't enrolled yet</h1>
                    ) : (
                        user.enrolledCourses.map((course) => <Course course={course} key={course._id} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
