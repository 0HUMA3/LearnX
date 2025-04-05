import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include", // Include cookies if needed
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // ✅ POST endpoint to create a course
    createCourse: builder.mutation({
      query: ({ title, category }) => ({
        url: "", // ✅ Update this if your endpoint is /create
        method: "POST",
        body: { title, category },
      }),
      transformErrorResponse: (response) => {
        console.error("API Error:", response);
        return response.data;
      },
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    // ✅ GET endpoint to fetch creator's courses
    getCreatorCourse: builder.query({
      query: () => ({
        url: "/", // ✅ Notice it's just /course, no /get-courses
        method: "GET",
      }),
      credentials: "include", // ✅ only if using cookies for session/auth
      providesTags: ["Refetch_Creator_Course"],
    }),    
  }),
});

// ✅ Export auto-generated hooks
export const { useCreateCourseMutation, useGetCreatorCourseQuery } = courseApi;
