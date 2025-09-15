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
import branchTicketTypeService from "@/services/branchTicketTypeService";
import { branchTicketTypeResponse } from "@/services/branchTicketTypeService";
import { useParams } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { branchTicketTypeCreateModel } from "@/model/branchTicketTypeCreateModel";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function ParkBranchTicketTable() {
  const params = useParams();
  const id = String(params.id);
  
  const { isOpen, openModal, closeModal } = useModal();

  const [ticketTypes, setTicketTypes] = useState<branchTicketTypeResponse[]>([]);
  const [formData, setFormData] = useState<branchTicketTypeCreateModel>();
  const [error, setError] = useState<string | null>(null);

  // Fetch Park Branches List
  const fetchBranchTicketTypes = async () => {
    try {
      const response = await branchTicketTypeService.getAll();
      setTicketTypes(response);
    } catch (err) {
        console.log(err);
    } finally {
      // do something for example setLoading
    }
  }

  useEffect(() => {    
    fetchBranchTicketTypes();
  }, [])

  // Handle save logic here
  const handleSave = async () => {        
    try {      
      await branchTicketTypeService.createTicketType(formData);
      fetchBranchTicketTypes();      
      setFormData(undefined);
      closeModal();
    } catch (err) {
      console.log(err);
      setError("Failed to create new branch ticket!");
    }
  };
  
  return (
    <div>
      <div>
        <button 
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition 
                     px-4 py-3 mb-6 mx-6 text-sm bg-brand-500 text-white hover:bg-brand-600"
          onClick={openModal}>
            Add Branch Ticket +
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
                    Ticket Name
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
                    Base Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    IsCancelable
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Start Time
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    End Time
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
                      {ticketType.isCancelable}
                    </TableCell>                                    
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {ticketType.startTime}
                    </TableCell> 
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {ticketType.endTime}
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
                Add New Branch Ticket Type
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
                      <Label>Type Name</Label>
                      <Input
                        type="text"                                                
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}                      
                      />
                    </div>                    
                    
                    <div className="col-span-6">
                      <Label>Base Price</Label>
                      <Input
                        type="number"                        
                        defaultValue={0}
                        onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}                      
                      />
                    </div>
                    <div className="col-span-2"></div>
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

                  <div className="grid grid-cols-12 my-9 gap-x-4">                    
                    <div className="col-span-6">
                      <Label>Start Time</Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}                                          
                      />
                    </div>

                    <div className="col-span-6">
                      <Label>End Time</Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}                                          
                      />
                    </div>                                        
                  </div>

                  <div className="grid grid-cols-12 my-9 gap-x-4">
                    <div className="col-span-4"></div>                   
                    <div className="col-span-4">
                      <Label>Is Cancelable?</Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, isCancelable: true })}                                          
                      />
                    </div>                                       
                    <div className="col-span-4"></div>                   
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
