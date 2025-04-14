import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGetSearchCourseQuery } from '@/features/api/courseApi';
import Filter from './Filter';
import SearchResult from './SearchResult';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchPage = () => {
  // ✅ Define searchParams and query
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  // ✅ Only guard against null, not empty string
  if (query === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
        <h1 className="font-bold text-2xl">Invalid Search Query</h1>
        <p>Please provide a valid search query.</p>
      </div>
    );
  }

  // ✅ Define states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("asc");

  // ✅ Fetch courses using API
  const { data, isLoading, isError } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  const isEmpty = data?.courses?.length === 0;

  const handleFilterChange = (categories, price) => {
    setSelectedCategories(categories);
    setSortByPrice(price);
  };

  // ✅ Error UI
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
        <h1 className="font-bold text-2xl">Error fetching data</h1>
        <p>Something went wrong. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mt-11 my-6">
        <h1 className="font-bold text-xl md:text-2xl">Results for "{query}"</h1>
        <p>
          Showing results for{" "}
          <span className="text-blue-800 font-bold italic">{query}</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <Filter handleFilterChange={handleFilterChange} />

        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => <CourseSkeleton key={idx} />)
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            data?.courses?.map((course) => (
              <SearchResult key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

// 🧩 Support Components

const CourseNotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
    <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
    <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
      Course Not Found
    </h1>
    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
      Sorry, we couldn't find any courses.
    </p>
    <Link to="/" className="italic">
      <Button variant="link">Browse All Courses</Button>
    </Link>
  </div>
);

const CourseSkeleton = () => (
  <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 py-4">
    <div className="h-32 w-full md:w-64">
      <Skeleton className="h-full w-full object-cover" />
    </div>
    <div className="flex flex-col gap-2 flex-1 px-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-20 mt-2" />
    </div>
    <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
      <Skeleton className="h-6 w-12" />
    </div>
  </div>
);
