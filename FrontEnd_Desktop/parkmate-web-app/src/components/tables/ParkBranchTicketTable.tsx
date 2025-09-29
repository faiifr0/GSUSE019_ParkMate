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
import branchTicketTypeService from "@/lib/services/branchTicketTypeService";
import { branchTicketTypeResponse } from "@/lib/services/branchTicketTypeService";
import { useParams } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { branchTicketTypeCreateModel } from "@/lib/model/branchTicketTypeCreateModel";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { toast } from "react-hot-toast";
import { branchTicketTypeUpdateModel } from "@/lib/model/branchTicketTypeUpdateModel";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function ParkBranchTicketTable() {
  const params = useParams();
  const id = String(params.id);
  
  const { isOpen, openModal, closeModal } = useModal();

  const [ticketTypes, setTicketTypes] = useState<branchTicketTypeResponse[]>([]);
  const [formData, setFormData] = useState<branchTicketTypeCreateModel>();
  const [selectedTicket, setSelectedTicket] = useState<branchTicketTypeResponse | null>(null);
  const [mode, setMode] = useState<'Tạo mới' | 'Cập Nhật'>('Tạo mới');

  // Fetch Park Branches List
  const fetchBranchTicketTypes = async () => {
    try {
      const response = await branchTicketTypeService.getAllOfBranch(id);
      setTicketTypes(response);

      setFormData(prev => ({
        ...prev,
        isCancelable: false, // default to be false
      }));
    } catch (err) {
      console.log(err);
      const message = 'Fetch các loại vé thất bại';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      // do something
    }
  }

  useEffect(() => {    
    fetchBranchTicketTypes();
    setFormData
  }, [])

  const openCreateModal = () => {
      setMode('Tạo mới');
      setFormData({
        parkBranchId: id,
        basePrice: undefined,
        description: undefined,
        name: undefined,
        status: true
      });
      setSelectedTicket(null);
      openModal();
    };
  
    const openEditModal = (ticket: branchTicketTypeResponse) => {
      setMode('Cập Nhật');
      setSelectedTicket(ticket);
      setFormData({
        parkBranchId: id,
        basePrice: ticket.basePrice,
        description: ticket.description,
        name: ticket.name,
        status: ticket.status,
      });
      openModal();
    };

  // Handle save logic here
  const handleSave = async () => {        
    try {      
      if (mode === 'Cập Nhật' && selectedTicket) {
        await branchTicketTypeService.updateTicketType(selectedTicket.id, formData as branchTicketTypeUpdateModel);
      } else {
        await branchTicketTypeService.createTicketType(formData);
      }
      fetchBranchTicketTypes();      
      setFormData(undefined);
      setFormData(form => ({ ...form, parkBranchId: id }));
      closeModal();
      const message = mode + " loại vé thành công!";
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err) {
      console.log(err);
      const message = mode + " loại vé thất bại!";
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    }
  };
  
  return (
    <div>
      <div>
        <button 
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition 
                     px-4 py-3 mb-6 mx-6 text-sm bg-brand-500 text-white hover:bg-brand-600"
          onClick={openCreateModal}>
            Tạo loại vé mới +
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
                    Tên vé
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
                    Giả cơ bản (vnđ)
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
                {ticketTypes.map((ticketType, index) => (
                  <TableRow key={ticketType.name}>    
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {index + 1}                    
                    </TableCell>               
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {ticketType.name}                    
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {ticketType.description}
                    </TableCell>                  
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {ticketType.basePrice}
                    </TableCell>                                                                                              
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"                        
                        color={
                          ticketType.status === true
                            ? "success"
                            : "error"                            
                        }
                      >
                        {ticketType.status ? "Đang hoạt động" : "Ngừng hoạt động"}                                                
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                      <Button size="sm" onClick={() => openEditModal(ticketType)}>Cập Nhật</Button>
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
                {mode === 'Cập Nhật' ? 'Cập Nhật Loại Vé' : 'Tạo Loại Vé Mới'}
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
                      <Label>Tên vé</Label>
                      <Input
                        type="text"   
                        value={formData?.name !== undefined ? formData.name : ''}                                             
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}                      
                      />
                    </div>                    
                    
                    <div className="col-span-6">
                      <Label>Giá cơ bản (vnđ)</Label>
                      <Input
                        type="number"                        
                        value={formData?.basePrice !== undefined ? formData.basePrice : 1000}
                        min={1000}
                        max={5000000}
                        step={1000}
                        onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}                      
                      />
                    </div>
                    <div className="col-span-2"></div>
                  </div>

                  <div className="grid grid-cols-12 my-9">                    
                    <div className="col-span-12">
                      <Label>Mô tả</Label>
                      <Input
                        type="text"    
                        value={formData?.description !== undefined ? formData.description : ''}                    
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}                   
                      />
                    </div>                                        
                  </div>

                  { mode === 'Cập Nhật' && (
                  <div className="grid grid-cols-12 my-9 gap-x-4">                                          
                    <div className="col-span-6">
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
                  Lưu
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
