import { ChartBar, Library } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="w-[250px] sm:w-[300px] border-r border-gray-400 dark:border-gray-600 p-5 min-h-screen">
            <div className="mt-20 space-y-4">
                <Link to="dashboard" className="flex items-center gap-2">
                    <ChartBar size={22} />
                    <h1>Dashboard</h1>
                </Link>
                <Link to="course" className="flex items-center gap-2">
                    <Library size={22} />
                    <h1>Courses</h1>
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;
