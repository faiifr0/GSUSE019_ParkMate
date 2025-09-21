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
import branchPromotionService, { branchPromotionResponse } from "@/lib/services/branchPromotionService";
import { branchPromotionCreateModel } from "@/lib/model/branchPromotionCreateModel";
import { useParams } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { branchPromotionUpdateModel } from "@/lib/model/branchPromotionUpdateModel";
import toast from "react-hot-toast";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function ParkBranchVoucherTable() {
  const params = useParams();
  const id = String(params.id);

  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState<branchPromotionCreateModel>();
  const [branchPromotions, setBranchPromotions] = useState<branchPromotionResponse[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<branchPromotionResponse | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [error, setError] = useState<string | null>(null);

  // Fetch Park Branches List
  const fetchBranchPromotions = async () => {
    try {
      const response = await branchPromotionService.getAll();
      setBranchPromotions(response);
    } catch (err) {
      console.log(err);
      const message =
        err instanceof Error ? err.message : 'Failed to fetch branch vouchers!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
    // do something for example setLoading
    }
  }
  
  useEffect(() => {    
    fetchBranchPromotions();    
  }, [])

  const openCreateModal = () => {
      setMode('create');
      setFormData({
        parkBranchId: id,
        description: '',
        discount: undefined,
        from: undefined,
        to: undefined,
        isActive: false,
      });
      setSelectedVoucher(null);
      openModal();
    };
  
    const openEditModal = (voucher: branchPromotionResponse) => {
      setMode('edit');
      setSelectedVoucher(voucher);
      setFormData({
        parkBranchId: id,
        description: voucher.description,
        discount: voucher.discount,
        from: voucher.from,
        to: voucher.to,
        isActive: voucher.isActive,
      });
      openModal();
    };

  // Handle save logic here
  const handleSave = async () => {        
    try {      
      if (mode === 'edit' && selectedVoucher) {
        await branchPromotionService.updateBranchPromotion(selectedVoucher.id, formData as branchPromotionUpdateModel);
      } else {
        await branchPromotionService.createBranchPromotion(formData);
      }
      fetchBranchPromotions();      
      setFormData(undefined);
      setFormData(form => ({ ...form, parkBranchId: id }));
      closeModal();
    } catch (err) {
      console.log(err);
      setError("Failed to " + mode + "branch voucher!");
    }
  };

  return (
    <div>
      <div>
        <button 
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition 
                     px-4 py-3 mb-6 mx-6 text-sm bg-brand-500 text-white hover:bg-brand-600"
          onClick={openCreateModal}>
            Add Branch Voucher +
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
                  Voucher Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Discount (%)
                </TableCell>                
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Available From
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Available To
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                >
                  Active Status
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
              {branchPromotions.map((promotion, index) => (
                <TableRow key={promotion.id}>    
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {index + 1}                    
                  </TableCell>               
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {promotion.description}                    
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {promotion.discount}
                  </TableCell>                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {
                      promotion.from ? 
                      `${new Date(promotion.from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${new Date(promotion.from).toLocaleDateString('en-GB')}`
                      : ''
                    }
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {
                      promotion.to ? 
                      `${new Date(promotion.to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${new Date(promotion.to).toLocaleDateString('en-GB')}`
                      : ''
                    }
                  </TableCell>                                                                       
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge                      
                      color={
                        promotion.isActive === true
                          ? "success"
                          : promotion.isActive === false
                          ? "info"
                          : "error"
                      }
                    >
                      {
                        promotion.isActive === true
                          ? "Active"
                          : promotion.isActive === false
                          ? "Disabled"
                          : "Error"
                      }                      
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">                      
                      <Button size="sm" onClick={() => openEditModal(promotion)}>Edit</Button>
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
                {mode === 'edit' ? 'Edit Branch Voucher' : 'Add New Branch Voucher'}
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
                      <Label>Voucher Description</Label>
                      <Input
                        type="text"
                        value={formData?.description !== undefined ? formData.description : ''} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}                        
                      />
                    </div>                                        
                    <div className="col-span-2"></div>                    
                  </div>

                  <div className="grid grid-cols-12 my-9 gap-x-4">                    
                    <div className="col-span-6">
                      <Label>Discount (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={formData?.discount !== undefined ? formData.discount : ''}
                        onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}                   
                      />
                    </div>  

                    <div className="col-span-6">
                      <Label>Active Status</Label>
                      <input
                        type="checkbox"
                        checked={formData?.isActive ?? false}                     
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"            
                      />
                    </div>                                      
                  </div> 

                  <div className="grid grid-cols-12 my-9 gap-x-4">                    
                    <div className="col-span-6">
                      <Label>Available From</Label>
                      <Input
                        type="datetime-local"
                        value={formData?.from ?? ''}                        
                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}                   
                      />
                    </div>  

                    <div className="col-span-6">
                      <Label>Available To</Label>
                      <Input
                        type="datetime-local"
                        value={formData?.to ?? ''}                       
                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}                   
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
                  {mode === 'edit' ? 'Edit' : 'Save Changes'}
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
