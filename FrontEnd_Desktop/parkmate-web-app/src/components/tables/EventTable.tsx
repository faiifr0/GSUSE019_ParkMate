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
import { gameCreateModel } from "@/lib/model/gameCreateModel";
import eventService, { EventResponse } from "@/lib/services/eventService";
import { gameUpdateModel } from "@/lib/model/gameUpdateModel";
import { eventCreateModel } from "@/lib/model/eventCreateModel";
import { eventUpdateModel } from "@/lib/model/eventUpdateModel";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function EventTable() {
  const params = useParams();
  const id = String(params.id);

  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState<eventCreateModel>();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(null);
  const [mode, setMode] = useState<'Tạo mới' | 'Cập Nhật'>('Tạo mới');

  // Fetch Branch Amenities List
  const fetchevents = async () => {
    try {
      const response = await eventService.getAllOfBranch(id);
      setEvents(response);
    } catch (err) {
      console.log(err);
      notFound();
    } finally {
    // do something
    }
  }
  
  useEffect(() => {    
    fetchevents();      
  }, [])

  const openCreateModal = () => {
      setMode('Tạo mới');
      setFormData({
        parkBranchId: id,
        startAt: undefined,
        endAt: undefined,                
        name: undefined,
        description: undefined,        
        status: true,
      });
      setSelectedEvent(null);
      openModal();
    };
  
    const openEditModal = (event: EventResponse) => {
      setMode('Cập Nhật');
      setSelectedEvent(event);
      setFormData({
        parkBranchId: id,
        startAt: event.startAt,
        endAt: event.endAt,       
        name: event.name,
        description: event.description,        
        status: event.status,
      });
      openModal();
    };

  // Handle save logic here
  const handleSave = async () => {        
    try {      
      if (mode === 'Cập Nhật' && selectedEvent) {
        await eventService.updateEvent(selectedEvent.id, formData as eventUpdateModel);
      } else {        
        await eventService.createEvent(formData);
      }
      fetchevents();      
      setFormData(undefined);
      setFormData(form => ({ ...form, parkBranchId: id }));
      closeModal();
      const message = mode + " sự kiện chi nhánh thành công!";
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err) {
      console.log(err);
      const message = mode + " sự kiện chi nhánh thất bại!";
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  // Handle delete logic here
  const handleDelete = async (event: EventResponse) => {        
    try {      
      await eventService.deleteEvent(event.id);
      fetchevents();      
      setFormData(undefined);
      setFormData(form => ({ ...form, parkBranchId: id }));
      closeModal();
      const message = "Xóa sự kiện của chi nhánh thành công!";
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err) {
      console.log(err);
      const message = "Xóa sự kiện chi nhánh thất bại!";
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  // Handle seeImage logic here
  const seeImage = async (event: EventResponse) => {        
    try {      
      window.location.href = "/park-branches/" + id + "/events/" + event.id;
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
            Tạo sự kiện mới
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
                  Tên sự kiện
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
                  Bắt đầu từ
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Kết thúc lúc
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
              {events.map((game, index) => (
                <TableRow key={game.id}>    
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {index + 1}                    
                  </TableCell>               
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {game.name}                    
                  </TableCell>                                    
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {game.description}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {
                      game.startAt ? 
                        `${new Date(game.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${new Date(game.startAt).toLocaleDateString('en-GB')}`
                        : ''
                    }
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {
                      game.endAt ? 
                        `${new Date(game.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${new Date(game.endAt).toLocaleDateString('en-GB')}`
                        : ''
                    }
                  </TableCell>                                                                                                           
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge                      
                      color={
                        game.status === true
                          ? "success"
                          : game.status === false
                          ? "error"
                          : "warning"
                      }
                    >
                      {
                        game.status === true
                          ? "Đang hoạt động"
                          : game.status === false
                          ? "Ngừng hoạt động"
                          : "Error"
                      }                      
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                    <Button size="sm" onClick={() => openEditModal(game)} className="mr-3">Cập Nhật</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(game)} className="mr-3">Xóa</Button>
                    <Button size="sm" variant="outline" onClick={() => seeImage(game)}>Xem Ảnh</Button>
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
                {mode === 'Cập Nhật' ? 'Cập Nhật Sự Kiện' : 'Tạo Sự Kiện Mới'}
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
                      <Label>Tên sự kiện</Label>
                      <Input
                        type="text"
                        value={formData?.name !== undefined ? formData.name : ''} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}                        
                      />
                    </div>                                        
                    <div className="col-span-2"></div>                    
                  </div>                  

                  <div className="grid grid-cols-12 mt-3 mb-9 gap-x-4">   
                    <div className="col-span-2"></div>                                     
                    <div className="col-span-8">
                      <Label>Mô tả</Label>
                      <textarea
                        value={formData?.description ?? ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full h-45 text-base px-4 py-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả chi tiết..."
                      />
                    </div>                                        
                    <div className="col-span-2"></div>                    
                  </div>

                  <div className="grid grid-cols-12 my-9 gap-x-4">                    
                    <div className="col-span-6">
                      <Label>Bắt đầu từ</Label>
                      <Input
                        type="datetime-local"
                        value={formData?.startAt ?? ''}                        
                        onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}                   
                      />
                    </div>  

                    <div className="col-span-6">
                      <Label>Kết thúc lúc</Label>
                      <Input
                        type="datetime-local"
                        value={formData?.endAt ?? ''}                       
                        onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}                   
                      />
                    </div>                                                          
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
