import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course","Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
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

    getPublishedCourse: builder.query({
      query: () => ({
        url: "/published-courses",
        method: "GET",
      }),
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
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    // ✅ Get course by ID (GET)
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
    }),

    // ✅ Create lecture (POST)
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
    }),
    getCourseLecture: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Refetch_Lecture"],
    }),
    editLecture: builder.mutation({
      query: ({
        lectureTitle,
        videoInfo,
        isPreviewFree,
        courseId,
        lectureId,
      }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "POST",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
    }),
    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Lecture"],
    }),
    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "GET",
      }),
    }),
    publishCourse: builder.mutation({
      query:({courseId,query}) => ({
        url:`/${courseId}?publish=${query}`,
        method:"PATCH"
      })
    })
  }), 
});

// ✅ Export auto-generated hooks
export const {
  useCreateCourseMutation,
  useGetPublishedCourseQuery,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
} = courseApi;
