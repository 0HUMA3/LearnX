import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

const Courses = () => {
  const { data, isLoading, isError, error } = useGetPublishedCourseQuery();

  if (isError) {
    console.error("Fetch error:", error);
    return (
      <div className="text-center text-red-600 mt-10">
        <h2>❌ Failed to fetch courses</h2>
        <p className="text-sm mt-2">{error?.error || error?.data?.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen py-10">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : data?.courses?.length === 0 ? (
            <div className="col-span-full text-center text-gray-600">
              No published courses available.
            </div>
          ) : (
            data.courses.map((course, index) => (
              <Course key={index} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;

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
