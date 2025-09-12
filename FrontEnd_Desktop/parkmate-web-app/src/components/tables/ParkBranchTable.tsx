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
import parkBranchService from "@/services/parkBranchService";
import { parkBranchResponse } from "@/services/parkBranchService";
import Link from "next/link";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { parkBranchCreateModel } from "@/model/parkBranchCreateModel";

// Handle what happens when you click on the pagination
const handlePageChange = (page: number) => {};

export default function ParkBranchTable() {
  const { isOpen, openModal, closeModal } = useModal();

  const [branches, setBranches] = useState<parkBranchResponse[]>([]);
  const [formData, setFormData] = useState<parkBranchCreateModel>();
  const [error, setError] = useState<string | null>(null);

  // Fetch Park Branches 
  const fetchParkBranches = async () => {
    try {
      const response = await parkBranchService.getAll();
      setBranches(response);
    } catch (err) {
      console.log(err);
    } finally {
      // do something for example setLoading
    }
  }

  useEffect(() => {    
    fetchParkBranches();
    
    setFormData(form => ({ ...form, location: "test location" }));
    setFormData(form => ({ ...form, open: "2025-09-12T06:00:00.165" }));
    setFormData(form => ({ ...form, close: "2025-09-12T20:00:00.165" }));
  }, [])
  
  // Handle save logic here
  const handleSave = async () => {        
    try {      
      await parkBranchService.createParkBranch(formData);
      fetchParkBranches();      
      setFormData(undefined);
      closeModal();
    } catch (err) {
      console.log(err);
      setError("Failed to create new user!");
    }
  };

  return (
    <div>
      <div>
        <button 
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition 
                     px-4 py-3 mb-6 mx-6 text-sm bg-brand-500 text-white hover:bg-brand-600"
          onClick={openModal}>
            Add Park Branch +
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
                    Branch Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Address
                  </TableCell>                
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Open Hour
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-800 text-center text-theme-xs dark:text-gray-400"
                  >
                    Close Hour
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
                {branches.map((branch, index) => (
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
                      {
                        branch?.open ? 
                        new Date(branch.open).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ''
                      }
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {
                        branch?.close ? 
                        new Date(branch.close).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ''
                      }
                    </TableCell>                                    
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {branch.createdAt}
                    </TableCell> 
                    <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                      {branch.updatedAt}
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
                Add New Park Branch
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
                      <Label>Park Branch Name</Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>                    
                    
                    <div className="col-span-6">
                      <Label>Address</Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2"></div>
                  </div>

                  <div className="grid grid-cols-12 my-9">                    
                    <div className="col-span-12">
                      <Label>Location</Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        disabled
                        defaultValue="test location"
                      />
                    </div>                                        
                  </div>                  

                  <div className="grid grid-cols-12 my-7 gap-x-4">                    
                    <div className="col-span-6">
                      <Label>Open Hour</Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, open: e.target.value })}
                        disabled
                        defaultValue={'2025-09-12T06:00:00.165'}
                      />
                    </div>                                                        
                    
                    <div className="col-span-6">
                      <Label>Close Hour</Label>
                      <Input
                        type="text"                        
                        onChange={(e) => setFormData({ ...formData, close: e.target.value })}
                        disabled
                        defaultValue={'2025-09-12T20:00:00.165'}
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
