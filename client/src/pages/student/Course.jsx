import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Badge } from '@/components/ui/badge';

import React from 'react';
import { Link } from 'react-router-dom';

const Course = ({course}) => {
  // Define the course object
  

  return (
    <Link to={`course-detail/${course._id}`}>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-900 bg-gray-100 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      {/* Image Section */}
      <div className="relative">
        <img
          src={course.courseThumbnail}
          alt="course"
          className="w-full h-40 object-cover"
        />
      </div>

      {/* Separate Content Below the Image */}
      <CardContent className="bg-white dark:bg-gray-800 px-5 py-4 text-black dark:text-white">
        <h1 className="hover:underline font-bold text-lg truncate">{course.courseTitle}</h1>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={course.creator?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="font-medium text-sm">{course.creator?.name}</p>
          </div>
          <Badge className={'bg-blue-600 text-white px-2 py-1 text-xs rounded-full'}>
            {course.courseLevel}
          </Badge>
        </div>
        <div className="text-lg font-bold">
          <span>{course.coursePrice}</span>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default Course;
