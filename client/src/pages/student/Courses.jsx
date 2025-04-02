import { Skeleton } from "@/components/ui/skeleton";
import React, { useState, useEffect } from "react";
import Course from "./Course";

const Courses = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState([]);

    // Simulating API call (replace with actual API call)
    useEffect(() => {
        setTimeout(() => {
            setCourses([
                { id: 1, title: "React Basics", instructor: "John Doe" },
                { id: 2, title: "Advanced JavaScript", instructor: "Jane Smith" },
                { id: 3, title: "Full-Stack Development", instructor: "Mark Taylor" },
                { id: 4, title: "UI/UX Design Principles", instructor: "Emily White" },
                { id: 5, title: "Full-Stack Development", instructor: "Mark Taylor" },
                { id: 6, title: "UI/UX Design Principles", instructor: "Emily White" }
            ]);
            setIsLoading(false);
        }, 2000); // Simulating a 2-second API delay
    }, []);

    return (
        <div className="bg-gray-200 min-h-screen py-10">
            <div className="max-w-7xl mx-auto p-6">
                <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <CourseSkeleton key={index} />
                        ))
                    ) : (
                        courses.map((course) => (
                            <Course key={course.id} {...course} /> // ✅ Corrected
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses;

// Skeleton Loader Component
const CourseSkeleton = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <Skeleton className="w-full h-40 rounded-md bg-gray-300" />
            <div className="mt-4 space-y-3">
                <Skeleton className="h-6 w-3/4 bg-gray-300" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full bg-gray-300" />
                        <Skeleton className="h-4 w-24 bg-gray-300" />
                    </div>
                    <Skeleton className="h-4 w-16 bg-gray-300" />
                </div>
                <Skeleton className="h-4 w-1/4 bg-gray-300" />
            </div>
        </div>
    );
};
