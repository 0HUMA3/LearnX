import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import React from "react";
import { useNavigate } from "react-router-dom";

// Fallback demo data if API fails or is empty
const invoices = [ 
  { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
  { invoice: "INV004", paymentStatus: "Paid", totalAmount: "$450.00", paymentMethod: "Credit Card" },
  { invoice: "INV005", paymentStatus: "Paid", totalAmount: "$550.00", paymentMethod: "PayPal" },
  { invoice: "INV006", paymentStatus: "Pending", totalAmount: "$200.00", paymentMethod: "Bank Transfer" },
  { invoice: "INV007", paymentStatus: "Unpaid", totalAmount: "$300.00", paymentMethod: "Credit Card" },
];

const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if (isLoading) return <h1>Loading...</h1>;

  const courses = data?.courses;

  const totalAmount = courses
    ? courses.reduce((sum, course) => sum + Number(course.price || 0), 0)
    : invoices.reduce((sum, invoice) => sum + Number(invoice.totalAmount.replace("$", "")), 0);

  return (
    <div className="p-4">
      <Button
        className="mt-10 mb-4 bg-black text-white hover:bg-gray-800"
        onClick={() => navigate("/admin/course/create")}
      >
        Create a new course
      </Button>

      <div className="overflow-x-auto">
        <Table className="w-full border">
          <TableCaption>
            {courses ? "A list of your created courses." : "A list of your recent invoices."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses ? (
              courses.map((course) => (
                <TableRow key={course._id}>

<TableCell className="font-medium">{course.coursePrice ? `₹${course.coursePrice}` : '₹NA'}</TableCell>

                  
                  <TableCell> <Badge>{course.isPublished ? "Published" : "Draft"}</Badge> </TableCell>
                  <TableCell>{course.courseTitle}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      className="text-blue-600"
                      variant="ghost"
                      onClick={() => navigate(`${course._id}`)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">{invoice.totalAmount}</TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseTable;
