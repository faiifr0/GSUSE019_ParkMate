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
import parkBranchService from "@/lib/services/parkBranchService";
import { parkBranchResponse } from "@/lib/services/parkBranchService";
import Link from "next/link";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { parkBranchCreateModel } from "@/lib/model/parkBranchCreateModel";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { AxiosError } from "axios";

type ErrorMessages = {
  name?: string;
  address?: string;
  openTime?: string;
  closeTime?: string;
  time?: string;
};
// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function ParkBranchTable() {
  const { isOpen, openModal, closeModal } = useModal();

  const [branches, setBranches] = useState<parkBranchResponse[]>([]);
  const [formData, setFormData] = useState<parkBranchCreateModel>({
    name: '',
    address: '',
    location: "106.623738 : 10.800662", // default geographical location
    openTime: "10:00:00", // default openTime 10:00 AM
    closeTime: "22:00:00", // default closeTime 10:00 PM
    status: false
  });
  const [errors, setErrors] = useState<ErrorMessages>();

  // Fetch Park Branches 
  const fetchParkBranches = async () => {
    try {
      const response = await parkBranchService.getAll();
      setBranches(response);      
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Fetch tất cả chi nhánh công viên thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      // do something for example setLoading
    }
  }

  useEffect(() => {    
    fetchParkBranches();
  }, [])
  
  // clear errors when the modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setFormData({
        name: '',
        address: '',
        location: "106.623738 : 10.800662", // default geographical location
        openTime: "10:00:00", // default openTime 10:00 AM
        closeTime: "22:00:00", // default closeTime 10:00 PM
        status: false
      });
    }
  }, [isOpen]);

  // Handle save logic here
  const handleSave = async () => {        
    const newErrors: ErrorMessages = {};

    const isValidTimeFormat = (time: string) => {
      return /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(time);
    };

    const isOpenBeforeClose = (open: string, close: string) => {
      const today = new Date().toISOString().split('T')[0];
      const openDate = new Date(`${today}T${open}`);
      const closeDate = new Date(`${today}T${close}`);
      return openDate < closeDate;
    };

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = "Tên chi nhánh không được để trống.";
    } else if (formData.name.length > 255) {
      newErrors.name = "Tên chi nhánh không được vượt quá 255 ký tự.";
    }

    if (!formData.address || formData.address.trim() === '') {
      newErrors.address = "Địa chỉ không được để trống.";
    } else if (formData.address.length > 500) {
      newErrors.address = "Địa chỉ không được vượt quá 500 ký tự.";
    }

    // Time validation
    if (!formData.openTime || !isValidTimeFormat(formData.openTime)) {
      newErrors.openTime = "Giờ mở cửa phải có định dạng HH:mm:ss.";
    } else if (!formData.closeTime || !isValidTimeFormat(formData.closeTime)) {
      newErrors.closeTime = "Giờ đóng cửa phải có định dạng HH:mm:ss.";
    } else if (!isOpenBeforeClose(formData.openTime, formData.closeTime)) {
      newErrors.time = "Giờ mở cửa phải trước giờ đóng cửa.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {      
        await parkBranchService.createParkBranch(formData);
        fetchParkBranches();            
        setFormData({
          name: '',
          address: '',
          location: "106.623738 : 10.800662", // default geographical location
          openTime: "10:00:00", // default openTime 10:00 AM
          closeTime: "22:00:00", // default closeTime 10:00 PM
          status: false
        });
        closeModal();
      } catch (err) {      
        const message = 'Tạo mới chi nhánh công viên thất bại! ' + (err instanceof AxiosError ? err.message : '');
        toast.error(message, {
          duration: 3000,
          position: 'top-right',
        });      
        fetchParkBranches();
        closeModal();
      }
    }
  };

  return (
    <div>
      <div>
        <button 
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition 
                     px-4 py-3 mb-6 mx-6 text-sm bg-brand-500 text-white hover:bg-brand-600"
          onClick={openModal}>
            Tạo Mới Chi Nhánh +
        </button>
      </div>

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
                    Tên Chi Nhánh
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Địa Chỉ
                  </TableCell>                
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Giờ Mở Cửa
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Giờ Đóng Cửa
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Tạo Mới Lúc
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Cập Nhập Lúc
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Trạng Thái
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {[...branches]
                  .sort((a, b) => {
                    // Prioritize status: true before false
                    if (a.status !== b.status) {
                      return a.status ? -1 : 1;
                    }
                    // Then sort by updatedAt descending
                      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                  })
                .map((branch, index) => (
                  <TableRow key={branch.id}>      
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>             
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      <Link 
                        href={"/park-branches/" + branch.id} 
                        className="text-center block w-full h-full no-underline">                     
                          {branch.name}
                      </Link>                    
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {branch.address}
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                      {branch.openTime}                      
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {branch.closeTime}
                    </TableCell>                                    
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {format(parseISO(branch.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                    </TableCell> 
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {format(parseISO(branch.updatedAt), 'dd/MM/yyyy HH:mm:ss')}
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"                        
                        color={
                          branch.status === true
                            ? "success"
                            : branch.status === false
                            ? "error"
                            : "info"
                        }
                      >
                        {
                          branch.status === true
                            ? "Đang hoạt động"
                            : branch.status === false
                            ? "Ngừng hoạt động"
                            : "Unknown"                        
                        }
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
          <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-9 ml-10 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
                Tạo Chi Nhánh Công Viên Mới
              </h4>
            </div>
            <form className="flex flex-col"
                  onSubmit = {(e) => {
                    e.preventDefault();
                  }}>
              <div className="custom-scrollbar h-[275px] overflow-y-auto px-2 pb-3">
                <div>                
                  <div className="grid grid-cols-12 my-9 gap-x-4">                    
                    <div className="col-span-6">
                      <Label>
                        Tên Chi Nhánh <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập tên chi nhánh"
                      />
                      {errors?.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>                    
                    
                    <div className="col-span-6">
                      <Label>
                        Địa Chỉ <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Nhập địa chỉ chi nhánh"
                      />
                      {errors?.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div className="col-span-2"></div>
                  </div>                                  

                  <div className="grid grid-cols-12 my-7 gap-x-4">                    
                    <div className="col-span-6">
                      <Label>
                        Giờ Mở Cửa <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="time"                        
                        onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}                      
                        defaultValue={'10:00:00'}
                      />
                      {errors?.openTime && <p className="text-red-500 text-sm mt-1">{errors.openTime}</p>}
                    </div>                                                        
                    
                    <div className="col-span-6">
                      <Label>
                        Giờ Đóng Cửa <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="time"                        
                        onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}                        
                        defaultValue={'22:00:00'}
                      />
                      {errors?.closeTime && <p className="text-red-500 text-sm mt-1">{errors.closeTime}</p>}
                    </div>                                      
                  </div>

                  <div className="grid grid-cols-12 my-7 gap-x-4">
                    <div className="col-span-12">
                      {errors?.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                    </div>
                  </div>                             
                </div>              
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Đóng
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Tạo Mới
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        <Pagination 
          currentPage={4}
          totalPages={7}
          onPageChange={handlePageChange}
        />     
      </div>
    </div>
  );
}
