import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCourse = () => {
  const [title, setTitle] = useState(""); // 🛠 Changed to match API
  const [category, setCategory] = useState("");

  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const navigate = useNavigate();

  const handleCategoryChange = (value) => setCategory(value);

  const createCourseHandler = async () => {

    if (!title || !category) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await createCourse({ title, category }).unwrap();
      toast.success(response?.message || "Course created successfully!");
      navigate("/admin/course");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create course.");
      console.error("Error creating course:", err);
    }
  };

  return (
    <div className="flex-1 mx-10 mt-20 p-5">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add a course, add some basic course details for your new course
        </h1>
        <p className="text-sm">Fill out the fields below to continue.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your Course Name"
          />
        </div>

        <div className="relative">
          <Label>Category</Label>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="z-50 mt-2 bg-white shadow-lg rounded-md">
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {[
                  "Next JS",
                  "Data Science",
                  "Frontend Development",
                  "Fullstack Development",
                  "MERN Stack Development",
                  "Javascript",
                  "Python",
                  "Docker",
                  "MongoDB",
                  "HTML"
                ].map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
