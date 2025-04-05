import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const Dashboard = () => {
  return (
    <div className="pt-10 p-10 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Card className="mt-6 max-w-[200px] mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-sm text-gray-700">Total Sales</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Dashboard;
