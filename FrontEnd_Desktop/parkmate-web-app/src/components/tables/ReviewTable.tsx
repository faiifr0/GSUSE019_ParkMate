'use client';
import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Pagination from "./Pagination";
import { notFound, useParams } from "next/navigation";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";
import reviewService, { ReviewResponse } from "@/lib/services/reviewService";
import { reviewUpdateModel } from "@/lib/model/reviewUpdateModel";
import { parseISO, format } from "date-fns";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function ReviewTable() {
  const params = useParams();
  const id = String(params.id);

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);

  // Fetch Branch Amenities List
  const fetchReviews = async () => {
    try {
      const response = await reviewService.getAllOfBranch(id);
      setReviews(response);
    } catch (err) {
      console.log(err);
      notFound();
    } finally {
    // do something
    }
  }
  
  useEffect(() => {    
    fetchReviews();      
  }, [])

  // Handle update logic here
  const handleUpdateStatus = async (review: ReviewResponse) => {        
    try {      
      const updatedData: reviewUpdateModel = {
        userId: review.userId,
        branchId: review.branchId,
        approved: !review.approved,
        rating: review.rating,
        comment: review.comment,
      };

      console.log("Cập nhật đánh giá chi nhánh: ", updatedData);

      await reviewService.updateReview(review.id, updatedData);      

      fetchReviews();      
          
      const message = "Cập nhật đánh giá chi nhánh thành công!";
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err) {
      console.log(err);
      const message = "Cập nhật đánh giá chi nhánh thất bại!";
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  return (
    <div>      
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">             
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>                
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Điểm đánh giá (1 - 5)
                </TableCell>                
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Nhận xét
                </TableCell> 
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Tạo lúc
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Cập nhật lúc
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Trạng thái chấp thuận
                </TableCell>                                          
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {reviews.map((review, index) => (
                <TableRow key={review.id}>    
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {index + 1}                    
                  </TableCell>               
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {review.email}                    
                  </TableCell>                                    
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {review.rating} / 5
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {review.comment}
                  </TableCell>   
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {format(parseISO(review.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {format(parseISO(review.updatedAt), 'dd/MM/yyyy HH:mm:ss')}
                  </TableCell>                                                                                                        
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge                      
                      color={
                        review.approved === true
                          ? "success"
                          : review.approved === false
                          ? "error"
                          : "warning"
                      }
                    >
                      {
                        review.approved === true
                          ? "Được chấp thuận"
                          : review.approved === false
                          ? "Không được chấp thuận"
                          : "Error"
                      }                      
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                    <Button size="sm" onClick={() => handleUpdateStatus(review)}>Cập Nhật Trạng Thái</Button>                    
                  </TableCell> 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </div>

        <Pagination 
            currentPage={1}
            totalPages={1}
            onPageChange={handlePageChange}
        />     
      </div>
    </div>
  );
}
