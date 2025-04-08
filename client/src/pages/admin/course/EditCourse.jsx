import { Button } from '@/components/ui/button';
import React from 'react';
import { Link } from 'react-router-dom';
import CourseTab from './CourseTab';

const EditCourse = () => {
    return (
        <div className='flex-1 pt-16 px-4'>
            <div className='flex items-center justify-between mb-5'>
                <h1 className='text-xl font-semibold'>Add detailed information regarding the course.</h1>
                <Link to="lecture">
                    <Button className='hover:text-blue-600' variant='link'>
                        Go to lectures page
                    </Button>
                </Link>
            </div>
            <CourseTab/>
        </div>
    );
};

export default EditCourse;
