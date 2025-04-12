import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: '',
    subTitle: '',
    description: '',
    category: '',
    courseLevel: '',
    coursePrice: '',
    courseThumbnail: ''
  });

  const params = useParams();  
  const courseId = params.courseId;
  const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId,{refetchOnMountOrArgChange:true});
  useGetCourseByIdQuery(courseId);

  const [publishCourse, {}] = usePublishCourseMutation();


  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData?.course
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      })
    }
  }, [courseByIdData])

  const [previewThumbnail, setPreviewThumbnail] = useState('');
  const navigate = useNavigate();

  const [editCourse, { isLoading, isSuccess, error }] = useEditCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    try {
      const formData = new FormData();
      formData.append("courseTitle", input.courseTitle);
      formData.append("subTitle", input.subTitle);
      formData.append("description", input.description);
      formData.append("category", input.category); // ✅ Fixed typo
      formData.append("courseLevel", input.courseLevel);
      formData.append("coursePrice", input.coursePrice);

      if (input.courseThumbnail) {
        formData.append("courseThumbnail", input.courseThumbnail);
      }

      await editCourse({ formData, courseId });
    } catch (err) {
      toast.error("Something went wrong while updating the course.");
    }
  };

  const publicStatusHandler = async (action) => {
    try {
      const response = await publishCourse({courseId, query:action});
      if(response.data){
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to publish or unpublish course");
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course updated successfully!");
    } else if (error) {
      toast.error(error?.data?.message || "Failed to update course");
    }
  }, [isSuccess, error]);

  if(courseByIdLoading) return <h1>Loading...</h1>

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you are done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button disabled={courseByIdData?.course.lectures.length === 0} variant="outline" onClick={() => publicStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
            {courseByIdData?.course.isPublished ? 'Unpublished' : 'Publish'}
          </Button>
          <Button className="bg-black text-white hover:bg-gray-900">
            Remove Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack developer"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a fullstack developer from zero to hero in two months."
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select onValueChange={selectCategory}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="z-50 mt-2 bg-white shadow-lg rounded-md">
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {[
                      'Next JS',
                      'Data Science',
                      'Frontend Development',
                      'Fullstack Development',
                      'MERN Stack Development',
                      'Javascript',
                      'Python',
                      'Docker',
                      'MongoDB',
                      'HTML'
                    ].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select onValueChange={selectCourseLevel}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent className="z-50 mt-2 bg-white shadow-lg rounded-md">
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    {['Beginner', 'Medium', 'Advanced'].map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="h-40 w-40 my-2 object-cover rounded-md border"
                alt="Course Thumbnail"
              />
            )}
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/admin/course')} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={updateCourseHandler}
              className="bg-black text-white hover:bg-gray-900"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
