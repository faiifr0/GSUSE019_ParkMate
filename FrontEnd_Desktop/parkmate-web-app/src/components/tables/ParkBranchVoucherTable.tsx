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
import { voucherCreateModel } from "@/lib/model/voucherCreateModel";
import { useParams } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { voucherUpdateModel } from "@/lib/model/voucherUpdateModel";
import toast from "react-hot-toast";
import voucherService, { VoucherResponse } from "@/lib/services/voucherService";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function ParkBranchVoucherTable() {
  const params = useParams();
  const id = String(params.id);

  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState<voucherCreateModel>();
  const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherResponse | null>(null);
  const [mode, setMode] = useState<'Tạo mới' | 'Cập Nhật'>('Tạo mới');

  // Fetch Vouchers List
  const fetchVouchers = async () => {
    try {
      const response = await voucherService.getAll();
      setVouchers(response);
    } catch (err) {
      console.log(err);
      const message = 'Failed voucher của chi nhánh thất bại';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
    // do something
    }
  }
  
  useEffect(() => {    
    fetchVouchers();    
  }, [])

  const openCreateModal = () => {
      setMode('Tạo mới');
      setFormData({
        parkBranchId: id,
        code: undefined,
        percent: undefined,
        maxDiscount: undefined,        
        startAt: undefined,
        endAt: undefined,
        active: true,
      });
      setSelectedVoucher(null);
      openModal();
    };
  
    const openEditModal = (voucher: VoucherResponse) => {
      setMode('Cập Nhật');
      setSelectedVoucher(voucher);
      setFormData({
        parkBranchId: id,
        code: voucher.code,
        percent: voucher.percent,
        maxDiscount: voucher.maxDiscount,
        startAt: voucher.startAt,
        endAt: voucher.endAt,
        active: voucher.active,
      });
      openModal();
    };

  // Handle save logic here
  const handleSave = async () => {        
    try {      
      if (mode === 'Cập Nhật' && selectedVoucher) {
        await voucherService.updateVoucher(selectedVoucher.id, formData as voucherUpdateModel);
      } else {
        await voucherService.createVoucher(formData);
      }
      fetchVouchers();      
      setFormData(undefined);
      setFormData(form => ({ ...form, parkBranchId: id }));
      closeModal();
      const message = mode + " voucher thành công!";
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (err) {
      console.log(err);
      const message = mode + " voucher thất bại!";
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
            Tạo voucher mới
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
                  Mã voucher
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Giảm giá (%)
                </TableCell>                
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Giảm giá tối đa (VNĐ)
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
              {vouchers.filter(v => v.parkBranchId == id).map((v, index) => (
                <TableRow key={v.id}>    
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {index + 1}                    
                  </TableCell>               
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {v.code}                    
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {v.percent * 100}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {v.maxDiscount}
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {
                      v.startAt ? 
                      `${new Date(v.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${new Date(v.startAt).toLocaleDateString('en-GB')}`
                      : ''
                    }
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {
                      v.endAt ? 
                      `${new Date(v.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${new Date(v.endAt).toLocaleDateString('en-GB')}`
                      : ''
                    }
                  </TableCell>                                                                       
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge                      
                      color={
                        v.active === true
                          ? "success"
                          : v.active === false
                          ? "error"
                          : "warning"
                      }
                    >
                      {
                        v.active === true
                          ? "Đang hoạt động"
                          : v.active === false
                          ? "Ngừng hoạt động"
                          : "Error"
                      }                      
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                    <Button size="sm" onClick={() => openEditModal(v)}>Cập Nhật</Button>
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
                {mode === 'Cập Nhật' ? 'Cập Nhật Voucher' : 'Tạo Voucher Mới'}
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
                      <Label>Mã voucher</Label>
                      <Input
                        type="text"
                        value={formData?.code !== undefined ? formData.code : ''} 
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}                        
                      />
                    </div>                                        
                    <div className="col-span-2"></div>                    
                  </div>

                  <div className="grid grid-cols-12 my-9 gap-x-4">                    
                    <div className="col-span-6">
                      <Label>Giảm giá</Label>
                      <Input
                        type="number"
                        min={0}
                        max={0.5}
                        step={0.01}
                        value={formData?.percent !== undefined ? formData.percent : ''}
                        onChange={(e) => setFormData({ ...formData, percent: Number(e.target.value) })}                   
                      />
                    </div>  

                    <div className="col-span-6">
                      <Label>Giảm giá tối đa (VNĐ)</Label>
                      <Input
                        type="number"
                        min={1000}
                        max={500000}
                        step={1000}
                        value={formData?.maxDiscount !== undefined ? formData.maxDiscount : ''}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}                   
                      />
                    </div>                                      
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
                    <div className="col-span-6">
                      <Label>Trạng thái</Label>
                      <input
                        type="checkbox"
                        checked={formData?.active ?? false}                     
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })} 
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
                  {mode === 'Cập Nhật' ? 'Cập Nhật' : 'Lưu thay đổi'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* <Pagination 
            currentPage={4}
            totalPages={7}
            onPageChange={handlePageChange}
        />      */}
      </div>
    </div>
  );
}
