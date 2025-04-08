import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
    const [lectureTitle, setLectureTitle] = useState("")
    const params = useParams()
    const courseId = params.courseId
    const navigate = useNavigate()

    const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation()

    const {
        data: lectureData,
        isLoading: lectureLoading,
        isError: lectureError,
        refetch,
    } = useGetCourseLectureQuery(courseId)

    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId })
    }

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(data.message)
            setLectureTitle("") // Clear input after success
        }
        if (error) {
            toast.error(error.data.message)
        }
    }, [isSuccess, error])

    // Group lectures by semester and also keep ungrouped separately
    const groupedLectures = {}
    const ungroupedLectures = []

    if (lectureData?.lectures) {
        lectureData.lectures.forEach((lecture) => {
            if (lecture.semester !== undefined && lecture.semester !== null) {
                const sem = lecture.semester
                if (!groupedLectures[sem]) groupedLectures[sem] = []
                groupedLectures[sem].push(lecture)
            } else {
                ungroupedLectures.push(lecture)
            }
        })
    }

    return (
        <div className="flex-1 mx-10 mt-20 p-5">
            <div className="mb-4">
                <h1 className="font-bold text-xl">
                    Let's add lectures, add some basic details for your new lecture
                </h1>
                <p className="text-sm">Fill out the fields below to continue.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        name="title"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder="Your Lecture Name"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)}>
                        Back to Course
                    </Button>
                    <Button disabled={isLoading} onClick={createLectureHandler}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Create Lecture"
                        )}
                    </Button>
                </div>

                <div className="mt-10">
                    {lectureLoading ? (
                        <p>Loading lectures...</p>
                    ) : lectureError ? (
                        <p>Failed to load lectures.</p>
                    ) : Object.keys(groupedLectures).length === 0 && ungroupedLectures.length === 0 ? (
                        <p>No lectures available</p>
                    ) : (
                        <>
                            {Object.entries(groupedLectures).map(([semester, lectures]) => (
                                <div key={semester} className="mb-6">
                                    <h2 className="text-lg font-semibold mb-2">Semester {semester}</h2>
                                    {lectures.map((lecture, index) => (
                                        <Lecture
                                            key={lecture._id}
                                            lecture={lecture}
                                            courseId={courseId}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ))}

                            {/* Render lectures with no semester (but no heading) */}
                            {ungroupedLectures.length > 0 && (
                                <div className="mb-6">
                                    {ungroupedLectures.map((lecture, index) => (
                                        <Lecture
                                            key={lecture._id}
                                            lecture={lecture}
                                            courseId={courseId}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateLecture;
