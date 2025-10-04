'use client';
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Image from "next/image";
import Pagination from "./Pagination";
import userService, { UserResponse } from "@/lib/services/userService";
import { format, set } from "date-fns";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { userCreateModel } from "@/lib/model/userCreateModel";
import { EyeCloseIcon, EyeIcon } from "@/components/icons";
import toast from "react-hot-toast";

type ErrorMessages = {
  email?: string;
  password?: string;
  username?: string;
};

export default function UserTable() {
  const { isOpen, openModal, closeModal } = useModal();

  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [formData, setFormData] = useState<userCreateModel>({
    email: '',
    password: '',
    username: ''
  }); 
  const [errors, setErrors] = useState<ErrorMessages>();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of reviews per page

  // Handle what happens when you click on the pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch Park Branches List
  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();        
      setUsers(response);
    } catch (err) {
      console.log(err);
      const message = 'Fetch người dùng thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      // do something for example setLoading
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  // clear errors when the modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setFormData({
        email: '',
        password: '',
        username: ''
      });
    }
  }, [isOpen]);

  // Handle save logic here
  const handleSave = async () => {        
    const newErrors: ErrorMessages = {};

    if (!formData.email) {
      newErrors.email = "Email không được để trống.";
    } else if (formData.email.length > 255) {
      newErrors.email = "Email không được vượt quá 255 ký tự.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống.";
    } else if (formData.password.length < 6) {
    newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    } else if (formData.password.length > 255) {
      newErrors.password = "Mật khẩu không được vượt quá 255 ký tự.";
    }

    if (!formData.username) {
      newErrors.username = "Tên người dùng không được để trống.";
    } else if (formData.username.length > 50) {
      newErrors.username = "Tên người dùng không được vượt quá 50 ký tự.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await userService.createUser(formData);
        fetchUsers();
        setShowPassword(false);
        setFormData({
          email: '',
          password: '',
          username: ''
        }); 
        closeModal();
      } catch (err) {
        console.log(err);
        const message = 'Tạo nhân viên mới thất bại!';
        toast.error(message, {
          duration: 3000,
          position: 'top-right',
        });      
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
            Tạo nhân viên mới +
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
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    No.
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Tên người dùng
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Vai trò
                  </TableCell>                  
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Tạo lúc
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-lg dark:text-gray-400"
                  >
                    Cập nhật lúc
                  </TableCell>                                                                    
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {/* {users.map((user, index) => ( */}
                {[...users]
                    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) // or use b.updatedBy - a.updatedBy if it's a number or date
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={"/images/user/" + (user?.roles?.[0].roleName ?? "user-04") + ".jpg"}
                            alt={user.username}
                          />
                        </div>
                        <div>
                          <a href={"/users/" + user.id}>
                            <span className="block text-gray-500 text-theme-sm dark:text-white/90">
                              {user.username}
                            </span>
                          </a>                          
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {user.email}
                    </TableCell>                    
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {user.roles?.[0]?.roleName}
                    </TableCell>                    
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {format(new Date(user.createdAt), 'HH:mm dd-MM-yyyy')}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {format(new Date(user.updatedAt), 'HH:mm dd-MM-yyyy')}
                    </TableCell>
                    {/* <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        // color={
                        //   user.status === "Active"
                        //     ? "success"
                        //     : user.status === "Pending"
                        //     ? "warning"
                        //     : "error"
                        // }
                        color="warning"
                      >
                        Dubious
                      </Badge>
                    </TableCell>*/}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
          <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-9 ml-10 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
                Tạo người dùng mới
              </h4>
            </div>
            <form className="flex flex-col"
                  onSubmit = {(e) => {
                    e.preventDefault();
                  }}>
              <div className="custom-scrollbar h-[275px] overflow-y-auto px-2 pb-3">
                <div>                
                  <div className="grid grid-cols-12 my-2">
                    <div className="col-span-2"></div>
                    <div className="col-span-8">
                      <Label>
                        Email <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="info@gmail.com"
                      />
                      {errors?.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="col-span-2"></div>
                  </div>
                  
                  <div className="grid grid-cols-12 my-2">
                    <div className="col-span-2"></div>
                    <div className="col-span-8">
                      <Label>
                        Mật khẩu <span className="text-error-500">*</span>{" "}
                        </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}                      
                        >
                        </Input>
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        > 
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                          )}
                        </span>
                        {errors?.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      </div>                
                    </div>    
                    <div className="col-span-2"></div>                                  
                  </div>

                  <div className="grid grid-cols-12 my-2">
                    <div className="col-span-2"></div>
                    <div className="col-span-8">
                      <Label>
                        Tên người dùng <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Nhập tên người dùng"
                      />
                      {errors?.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>
                    <div className="col-span-2"></div>
                  </div>
                </div>              
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Đóng
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(users.length / pageSize)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
