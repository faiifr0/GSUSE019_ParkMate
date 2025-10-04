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
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";
import { branchAmenityCreateModel } from "@/lib/model/branchAmenityCreateModel";
import branchAmenityService, { branchAmenityResponse } from "@/lib/services/branchAmenityService";
import { branchAmenityUpdateModel } from "@/lib/model/branchAmenityUpdateModel";
import amenityTypeService, { amenityTypeResponse } from "@/lib/services/amenityTypeService";

type ErrorMessages = {
  amenityTypeId?: string;
  name?: string;
  description?: string;
};

export default function AmenityTable() {
  const params = useParams();
  const id = String(params.id);

  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState<branchAmenityCreateModel>();
  const [amenities, setAmenities] = useState<branchAmenityResponse[]>([]);
  const [amenityTypes, setAmenityTypes] = useState<amenityTypeResponse[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState<branchAmenityResponse | null>(null);
  const [mode, setMode] = useState<'Tạo mới' | 'Cập Nhật'>('Tạo mới');
  const [errors, setErrors] = useState<ErrorMessages>({});

  // Fetch Branch Amenities List
  const fetchAmenities = async () => {
    try {
      const response = await branchAmenityService.getAllOfBranch(id);
      setAmenities(response);
    } catch (err) {
      console.log(err);
      notFound();
    } finally {
    // do something
    }
  }

  // Fetch Amenity Types List
  const fetchAmenityTypes = async () => {
    try {
      const response = await amenityTypeService.getAll();
      setAmenityTypes(response);
    } catch (err) {
      console.log(err);
      const message = 'Fetch các loại tiện nghi thất bại';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
    // do something
    }
  }
  
  useEffect(() => {    
    fetchAmenities(); 
    fetchAmenityTypes();  
  }, [])

  // clear errors when the modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});      
    }
  }, [isOpen]);

  const openCreateModal = () => {
      setMode('Tạo mới');
      setFormData({
        parkBranchId: id,
        amenityTypeId: undefined,
        name: undefined,
        description: undefined,        
        status: true,
      });
      setSelectedAmenity(null);
      openModal();
    };
  
    const openEditModal = (amenity: branchAmenityResponse) => {
      setMode('Cập Nhật');
      setSelectedAmenity(amenity);
      setFormData({
        parkBranchId: id,
        amenityTypeId: amenity.amenityTypeId,
        name: amenity.name,
        description: amenity.description,        
        status: amenity.status,
      });
      openModal();
    };

  // Handle save logic here
  const handleSave = async () => {  
    const newErrors: ErrorMessages = {};
    
    if (!formData?.amenityTypeId || formData.amenityTypeId.trim() === '') {
      newErrors.amenityTypeId = 'Vui lòng chọn loại tiện nghi.';
    }

    if (!formData?.name || formData.name.trim() === '') {
      newErrors.name = 'Tên tiện nghi không được để trống.';
    } else if (formData.name.length > 255) {
      newErrors.name = 'Tên tiện nghi không được vượt quá 255 ký tự.';
    }

    if (!formData?.description || formData.description.trim() === '') {
      newErrors.description = 'Mô tả không được để trống.';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Mô tả không được vượt quá 1000 ký tự.';
    }
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {      
      if (mode === 'Cập Nhật' && selectedAmenity) {
        await branchAmenityService.updateBranchAmenity(selectedAmenity.id, formData as branchAmenityUpdateModel);
      } else {        
        await branchAmenityService.createBranchAmenity(formData);
      }
      fetchAmenities();      
      setFormData(undefined);
      setFormData(form => ({ ...form, parkBranchId: id }));
      closeModal();
      const message = mode + " tiện nghi chi nhánh thành công!";
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err) {
      console.log(err);
      const message = mode + " tiện nghi chi nhánh thất bại!";
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  // Handle delete logic here
  const handleDelete = async (amenity: branchAmenityResponse) => {        
    try {      
      await branchAmenityService.deleteBranchAmenity(amenity.id);
      fetchAmenities();      
      setFormData(undefined);
      setFormData(form => ({ ...form, parkBranchId: id }));
      closeModal();
      const message = "Xóa tiện nghi chi nhánh thành công!";
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err) {
      console.log(err);
      const message = "Xóa tiện nghi chi nhánh thất bại!";
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  // Handle seeImage logic here
  const seeImage = async (amenity: branchAmenityResponse) => {        
    try {      
      window.location.href = "/park-branches/" + id + "/amenities/" + amenity.id;
    } catch (err) {
      console.log(err);
      notFound();
    }
  };

  return (
    <div>
      <div>
        <button 
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition 
                     px-4 py-3 mb-6 mx-6 text-sm bg-brand-500 text-white hover:bg-brand-600"
          onClick={openCreateModal}>
            Tạo tiện nghi mới
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
                  Tên tiện nghi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Loại tiện nghi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Mô tả
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
              {amenities.map((amenity, index) => (
                <TableRow key={amenity.id}>    
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {index + 1}                    
                  </TableCell>               
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {amenity.name}                    
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                    
                    {amenityTypes.find(type => type.id == amenity.amenityTypeId)?.name || "Unknown Type"}                                        
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {amenity.description}
                  </TableCell>                                                                                                           
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge                      
                      color={
                        amenity.status === true
                          ? "success"
                          : amenity.status === false
                          ? "error"
                          : "warning"
                      }
                    >
                      {
                        amenity.status === true
                          ? "Đang hoạt động"
                          : amenity.status === false
                          ? "Ngừng hoạt động"
                          : "Error"
                      }                      
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                    <Button size="sm" onClick={() => openEditModal(amenity)} className="mr-3">Cập Nhật</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(amenity)} className="mr-3">Xóa</Button>
                    <Button size="sm" variant="outline" onClick={() => seeImage(amenity)}>Xem Ảnh</Button>
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
              <h4 className="mb-3 ml-10 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
                {mode === 'Cập Nhật' ? 'Cập Nhật Tiện Nghi' : 'Tạo Tiện Nghi Mới'}
              </h4>
            </div>
            <form className="flex flex-col"
                  onSubmit = {(e) => {
                    e.preventDefault();
                  }}>
              <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
                <div>                
                  <div className="grid grid-cols-12 mt-3 mb-9 gap-x-4">   
                    <div className="col-span-2"></div>                                     
                    <div className="col-span-8">
                      <Label>
                        Tên tiện nghi <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        value={formData?.name !== undefined ? formData.name : ''} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập tên tiện nghi"                     
                      />
                      {errors?.name && (
                        <p className="mt-1 text-xs text-error-500">{errors.name}</p>
                      )}
                    </div>                                        
                    <div className="col-span-2"></div>                    
                  </div>

                  <div className="grid grid-cols-12 mt-3 mb-9 gap-x-4">
                    <div className="col-span-3"></div>                 
                    <div className="col-span-6">
                      <Label>
                        Loại tiện nghi <span className="text-error-500">*</span>
                      </Label>
                      <select            
                        value={formData?.amenityTypeId !== undefined ? formData.amenityTypeId : ''}            
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-[12px] text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onChange={(e) => setFormData({ ...formData, amenityTypeId: e.target.value })}
                      >
                        <option value="" disabled>
                          -- Chọn 1 loại tiện nghi --
                        </option>
                        
                        {amenityTypes.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                        ))}
                      </select>
                      {errors?.amenityTypeId && (
                        <p className="mt-1 text-xs text-error-500">{errors.amenityTypeId}</p>
                      )}
                    </div>  
                    <div className="col-span-3"></div>
                  </div>

                  <div className="grid grid-cols-12 mt-3 mb-9 gap-x-4">   
                    <div className="col-span-2"></div>                                     
                    <div className="col-span-8">
                      <Label>
                        Mô tả <span className="text-error-500">*</span>
                      </Label>
                      <textarea
                        value={formData?.description ?? ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full h-45 text-base px-4 py-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả chi tiết..."
                      />
                      {errors?.description && (
                        <p className="mt-1 text-xs text-error-500">{errors.description}</p>
                      )}
                    </div>                                        
                    <div className="col-span-2"></div>                    
                  </div>                  

                  { mode === 'Cập Nhật' && (
                  <div className="grid grid-cols-12 my-9 gap-x-4">  
                    <div className="col-span-4"></div>
                    <div className="col-span-4 flex items-center gap-2 ml-5">
                      <Label>Trạng thái</Label>
                      <input
                        type="checkbox"
                        checked={formData?.status ?? false}                     
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked })} 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"            
                      />
                    </div>
                    <div className="col-span-4"></div>                                   
                  </div>                
                  )}                                                  
                </div>              
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Đóng
                </Button>
                <Button size="sm" onClick={handleSave}>
                  {mode === 'Cập Nhật' ? 'Cập Nhật' : 'Lưu thay đổi'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* <Pagination 
            currentPage={1}
            totalPages={1}
            onPageChange={handlePageChange}
        />      */}
      </div>
    </div>
  );
}
