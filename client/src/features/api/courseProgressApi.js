import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "http://localhost:8080/api/v1/progress";

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: 'include', // If using cookies for auth
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token; // Adjust path if your token is stored differently
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
    }),
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/view`,
        method: "POST", // ✅ Corrected from "mathod"
      }),
    }),
    completeCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/complete`,
        method: "POST",
      }),
    }),
    inCompleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/incomplete`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useInCompleteCourseMutation,
} = courseProgressApi;
