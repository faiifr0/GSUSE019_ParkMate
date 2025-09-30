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
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import branchStaffService, { branchStaffResponse } from "@/lib/services/branchStaffService";
import { branchStaffCreateModel } from "@/lib/model/branchStaffCreateModel";
import { useParams } from "next/navigation";
import userService, { UserResponse } from "@/lib/services/userService";
import { branchStaffUpdateModel } from "@/lib/model/branchStaffUpdateModel";
import toast from "react-hot-toast";
import { parseISO, format } from 'date-fns';

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function BranchStaffTable() {
  const params = useParams();
  const id = String(params.id);

  const { isOpen, openModal, closeModal } = useModal();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [branchStaffs, setBranchStaffs] = useState<branchStaffResponse[]>([]);
  const [formData, setFormData] = useState<branchStaffCreateModel>();
  const [selectedStaff, setSelectedStaff] = useState<branchStaffResponse | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  // Fetch Park Branch Staffs
  const fetchBranchStaffs = async () => {
    try {
      const response = await branchStaffService.getAll();
      setBranchStaffs(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Fetch nhân viên chi nhánh thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
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
    fetchBranchStaffs();
    fetchUsers();    
  }, [])
  
  // Handle save logic here
  const handleSave = async () => {        
    try {
      //console.log("Form userId: " + formData?.userId);
      //console.log("Form parkBranchId: " + formData?.parkBranchId);
      //console.log("Form role: " + formData?.role);
      //console.log("Form description: " + formData?.description);
      if (mode === 'edit' && selectedStaff) {
        await branchStaffService.updateBranchStaff(String(selectedStaff.id), formData as branchStaffUpdateModel);
      } else {
        await branchStaffService.createBranchStaff(formData);
      }      
      fetchBranchStaffs();      
      setFormData(undefined);
      setSelectedStaff(null);
      closeModal();
    } catch (err) {
      console.log(err);
      const message =
        err instanceof Error ? err.message : 'Failed to' + mode + 'branch staff!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const openCreateModal = () => {
    setMode('create');
    setFormData({
      userId: undefined, // or leave as undefined if optional
      parkBranchId: parseInt(id),
      role: '',
      description: '',      
    });
    setSelectedStaff(null);
    openModal();
  };

  const openEditModal = (staff: branchStaffResponse) => {
    setMode('edit');
    setSelectedStaff(staff);
    setFormData({
      userId: 1, // ### should be user.id need changes in what return from api
      parkBranchId: parseInt(id),
      role: staff.role,
      description: staff.description,
      status: staff.status
    });
    openModal();
  };

  return (
    <div>
      <div>
        <button 
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition 
                     px-4 py-3 mb-6 mx-6 text-sm bg-brand-500 text-white hover:bg-brand-600"
          onClick={openCreateModal}>
            Thêm Nhân Viên +
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
                    Tên Nhân Viên
                  </TableCell>                                  
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Vai trò
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Mô tả vai trò
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
                    Trạng thái
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {[...branchStaffs]
                  .sort((a, b) => {
                    // Prioritize status: true before false
                    if (a.status !== b.status) {
                      return a.status ? -1 : 1;
                    }
                    // Then sort by updatedAt descending
                      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                  })
                  .map((staff, index) => (
                  <TableRow key={staff.id}>      
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>             
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {staff.username} - {staff.userFullName}
                    </TableCell>                                                       
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {staff.role}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {staff.description}
                    </TableCell>                                   
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                      {format(parseISO(staff.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                    </TableCell> 
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {format(parseISO(staff.updatedAt), 'dd/MM/yyyy HH:mm:ss')}
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"                        
                        color={
                          staff.status
                            ? "success"
                            : !staff.status
                            ? "error"
                            : "warning"
                        }
                      >
                        {staff.status ? "Đang làm việc" : "Ngừng làm việc"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      <Button size="sm" onClick={() => openEditModal(staff)}>Cập Nhật</Button>
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
                {mode === 'edit' ? 'Cập Nhật Nhân Viên Chi Nhánh' : 'Thêm Nhân Viên Chi Nhánh'}
              </h4>
            </div>
            <form className="flex flex-col"
                  onSubmit = {(e) => {
                    e.preventDefault();
                  }}>
              <div className="custom-scrollbar h-[275px] overflow-y-auto px-2 pb-3">
                <div>                
                  <div className="grid grid-cols-12 my-9 gap-x-4"
                       style={{ display: mode === 'edit' ? 'none' : 'block' }}>   
                    <div className="col-span-3"></div>                 
                    <div className="col-span-6">
                      <Label>Nhân viên</Label>
                      <select            
                        value={formData?.userId !== undefined ? formData.userId : ''}            
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-[12px] text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) })}
                      >
                        <option value="" disabled>
                          -- Chọn 1 nhân viên --
                        </option>
                        {users.filter(u => u.roles?.[0]?.roleName === "STAFF" &&
                        !branchStaffs.some(staff => staff.userId === u.id)
                        )
                        .map(user => (
                        <option key={user.id} value={user.id}>
                            {user.username} - {user.email}
                        </option>
                        ))}
                      </select>
                    </div>  
                    <div className="col-span-3"></div>                  
                    
                    <div 
                      className=""
                      style={{ display: 'none' }}>
                      <Label>Id Chi Nhánh</Label>
                      <input                        
                        type="number"                        
                        defaultValue={parseInt(id)}
                        disabled                                              
                      />
                    </div>                    
                  </div>

                  <div className="grid grid-cols-12 my-9">                    
                    <div className="col-span-12">
                      <Label>Vai trò</Label>
                      <Input
                        type="text"                    
                        value={formData?.role ?? ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}                   
                      />
                    </div>                                        
                  </div> 

                  <div className="grid grid-cols-12 my-9">                    
                    <div className="col-span-12">
                      <Label>Mô tả</Label>
                      <Input
                        type="text"
                        value={formData?.description ?? ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}                                          
                      />
                    </div>                                        
                  </div> 

                  { mode === 'edit' && (
                  <div className="grid grid-cols-6 my-9 gap-x-4">                                     
                    <div className="col-span-6 flex items-start gap-3">
                      <Label>Trạng thái</Label>
                      <input
                        type="checkbox"
                        checked={formData?.status ?? false}                     
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked })} 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"            
                      />
                    </div>                                                                         
                  </div>
                  )}                                                                
                </div>              
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Đóng
                </Button>
                <Button size="sm" onClick={handleSave}>
                  {mode === 'edit' ? 'Cập Nhật' : 'Tạo Mới'}
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
