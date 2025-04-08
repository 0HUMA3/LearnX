import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include", // Include cookies if needed
    prepareHeaders: (headers, { endpoint }) => {
      // ✅ Skip setting Content-Type for FormData (editCourse)
      if (endpoint !== "editCourse") {
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // ✅ Create course (POST)
    createCourse: builder.mutation({
      query: ({ title, category }) => ({
        url: "/",
        method: "POST",
        body: { title, category },
      }),
      transformErrorResponse: (response) => {
        console.error("API Error:", response);
        return response.data;
      },
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    // ✅ Get all courses for the logged-in creator (GET)
    getCreatorCourse: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    // ✅ Edit course (PUT with FormData)
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData, // ✔️ FormData sets its own headers
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method:"GET"
      })
    })
  }),
});

// ✅ Export auto-generated hooks
export const {
  useCreateCourseMutation,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery
} = courseApi;
