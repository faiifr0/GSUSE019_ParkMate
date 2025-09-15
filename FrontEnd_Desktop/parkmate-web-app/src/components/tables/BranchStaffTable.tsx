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
import Link from "next/link";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import branchStaffService, { branchStaffResponse } from "@/services/branchStaffService";
import { branchStaffCreateModel } from "@/model/branchStaffCreateModel";
import { useParams } from "next/navigation";
import userService, { UserResponse } from "@/services/userService";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function BranchStaffTable() {
  const params = useParams();
  const id = String(params.id);

  const { isOpen, openModal, closeModal } = useModal();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [branchStaffs, setBranchStaffs] = useState<branchStaffResponse[]>([]);
  const [formData, setFormData] = useState<branchStaffCreateModel>();
  const [error, setError] = useState<string | null>(null);

  // Fetch Park Branch Staffs
  const fetchBranchStaffs = async () => {
    try {
      const response = await branchStaffService.getAll();
      setBranchStaffs(response);
    } catch (err) {
      console.log(err);
    } finally {
      // do something for example setLoading
    }
  }

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response);
    } catch (err) {
      console.log(err);
    } finally {
      // do something for example setLoading
    }
  }

  useEffect(() => {    
    fetchBranchStaffs();
    fetchUsers();
    setFormData(form => ({ ...form, parkBranchId: parseInt(id) }));
  }, [])
  
  // Handle save logic here
  const handleSave = async () => {        
    try {      
      await branchStaffService.createBranchStaff(formData);
      fetchBranchStaffs();      
      setFormData(undefined);
      closeModal();
    } catch (err) {
      console.log(err);
      setError("Failed to create new branch staff!");
    }
  };

  return (
    <div>
      <div>
        <button 
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition 
                     px-4 py-3 mb-6 mx-6 text-sm bg-brand-500 text-white hover:bg-brand-600"
          onClick={openModal}>
            Add Branch Staff +
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
                    Full Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Park Branch Name
                  </TableCell>                
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Role
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Description
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Created At
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Updated At
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {branchStaffs.map((staff, index) => (
                  <TableRow key={staff.id}>      
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>             
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      <Link 
                        href={"/park-branches/" + staff.id} 
                        className="text-center block w-full h-full no-underline">                     
                          {staff.userFullName}
                      </Link>                    
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {staff.parkBranchName}
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {staff.role}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {staff.description}
                    </TableCell>                                   
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {staff.createdAt}
                    </TableCell> 
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {staff.updatedAt}
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color="error"
                        // color={
                        //   branch.status === "Active"
                        //     ? "success"
                        //     : branch.status === "Pending"
                        //     ? "warning"
                        //     : "error"
                        // }
                      >
                        {/* {branch.status} */}
                        Dubious
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
                Add New Branch Staff
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
                      <Label>User</Label>
                      <select                        
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) })}
                      >
                        {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.username} - {user.email}
                        </option>
                        ))}
                      </select>
                    </div>                    
                    
                    <div className="col-span-6">
                      <Label>Park Branch Id</Label>
                      <Input
                        type="number"                        
                        defaultValue={parseInt(id)}
                        disabled
                      />
                    </div>
                    <div className="col-span-2"></div>
                  </div>

                  <div className="grid grid-cols-12 my-9">                    
                    <div className="col-span-12">
                      <Label>Role</Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}                   
                      />
                    </div>                                        
                  </div> 

                  <div className="grid grid-cols-12 my-9">                    
                    <div className="col-span-12">
                      <Label>Description</Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}                                          
                      />
                    </div>                                        
                  </div>                                                                
                </div>              
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save Changes
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
