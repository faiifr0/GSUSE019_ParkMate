import React, { useState, useEffect } from "react";
import { useParams} from "next/navigation";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Badge from "../ui/badge/Badge";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";
import { parkBranchUpdateModel } from "@/lib/model/parkBranchUpdateModel";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

type ErrorMessages = {
  name?: string;
  address?: string;
  openTime?: string;
  closeTime?: string;
  time?: string;
};

export default function OverviewInfoCard () {
  const { isOpen, openModal, closeModal } = useModal();
  const { currUser } = useAuth();

  const params = useParams();
  const id = params.id ? String(params.id) : '0';

  const [branchInfo, setBranchInfo] = useState<parkBranchResponse>();
  const [formData, setFormData] = useState<parkBranchUpdateModel>({});
  const [errors, setErrors] = useState<ErrorMessages>();

  const fetchParkBranch = async () => {
    const response = await parkBranchService.getParkBranchById(id);
    setBranchInfo(response);  
    setFormData({
      name: response.name ?? '',
      address: response.address ?? '',
      location: response.location ?? '',
      openTime: response.openTime ?? '',
      closeTime: response.closeTime ?? '',
      status: response.status ?? false
    });
  }
  
  // Fetch Park Branch Overview Info
  useEffect(() => {
    try {
      fetchParkBranch();  
    } catch (err) {
      console.log(err);
      const message = 'Fetch chi nhánh công viên id ' + id + ' thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    } 
  }, [])

  // clear errors when the modal opens
  useEffect(() => {
    try {
      if (isOpen) {
        setErrors({});
        fetchParkBranch();
      }
    } catch (err) {
      console.log(err);
      const message = 'Fetch chi nhánh công viên id ' + id + ' thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    }
  }, [isOpen]);

  // Handle save logic here
  const handleSave = async () => {  
    const newErrors: ErrorMessages = {};

    const isValidTimeFormat = (time: string) => {
      return /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(time);
    };

    const isOpenBeforeClose = (open: string, close: string) => {
      const today = new Date().toISOString().split('T')[0];
      const openDate = new Date(`${today}T${open}`);
      const closeDate = new Date(`${today}T${close}`);
      return openDate < closeDate;
    };

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = "Tên chi nhánh không được để trống.";
    } else if (formData.name.length > 255) {
      newErrors.name = "Tên chi nhánh không được vượt quá 255 ký tự.";
    }

    if (!formData.address || formData.address.trim() === '') {
      newErrors.address = "Địa chỉ không được để trống.";
    } else if (formData.address.length > 500) {
      newErrors.address = "Địa chỉ không được vượt quá 500 ký tự.";
    }

    // Time validation
    if (!formData.openTime || !isValidTimeFormat(formData.openTime)) {
      newErrors.openTime = "Giờ mở cửa phải có định dạng HH:mm:ss.";
    } else if (!formData.closeTime || !isValidTimeFormat(formData.closeTime)) {
      newErrors.closeTime = "Giờ đóng cửa phải có định dạng HH:mm:ss.";
    } else if (!isOpenBeforeClose(formData.openTime, formData.closeTime)) {
      newErrors.time = "Giờ mở cửa phải trước giờ đóng cửa.";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        await parkBranchService.updateParkBranch(id, formData);         
        fetchParkBranch();
        closeModal();
        const message = 'Cập nhật chi nhánh công viên thành công!';
        toast.success(message, {
          duration: 3000,
          position: 'top-right',
        }) 
      } catch (err) {
        const message = 'Cập nhật chi nhánh công viên thất bại!' + (err instanceof Error ? err.message : '');
        toast.error(message, {
          duration: 3000,
          position: 'top-right',
        });   
        fetchParkBranch();         
        closeModal();
      }
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6 p-6 border border-gray-200 rounded-2xl dark:border-gray-800">
      <div className="col-span-2 col-start-2 grid grid-cols-2 gap-6 py-5 border border-gray-200 rounded-2xl">
        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            Tên chi nhánh
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {branchInfo?.name}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            Địa chỉ
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {branchInfo?.address}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            Vị trí
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {branchInfo?.location}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            Trạng thái
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            <Badge size="sm" 
              color="success">
              <Badge
                size="sm"                        
                color={
                  branchInfo?.status === true
                    ? "success"
                    : branchInfo?.status === false
                    ? "error"
                    : "info"
                }
              >
                {
                  branchInfo?.status === true
                    ? "Đang hoạt động"
                    : branchInfo?.status === false
                    ? "Ngừng hoạt động"
                    : "Unknown"                        
                }
              </Badge>
            </Badge>
          </p>
        </div>

        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            Giờ mở cửa
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {branchInfo?.openTime}
          </p>
        </div>
      
        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            Giờ đóng cửa
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {branchInfo?.closeTime}
          </p>
        </div>
      </div>

      <div className="col-span-2 col-start-4 flex justify-end items-start">
        <button
          onClick={openModal}
          className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Cập nhật
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-9 ml-10 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
              Cập nhật thông tin chung của chi nhánh
            </h4>
          </div>
          <form className="flex flex-col"
                onSubmit = {(e) => {
                  e.preventDefault();
                }}>
            <div className="custom-scrollbar h-[275px] overflow-y-auto px-2 pb-3">
              <div>                
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Tên chi nhánh</Label>
                    <Input
                      type="text"
                      defaultValue={formData?.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors?.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label>Địa chỉ</Label>
                    <Input
                      type="text"
                      defaultValue={formData?.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                    {errors?.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <Label>Vị trí</Label>
                    <Input
                      type="text"
                      defaultValue={formData?.location}
                      // onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled
                    />
                  </div>

                  <div>
                    <Label>Trạng thái</Label>
                    <input
                      type="checkbox"
                      checked={formData?.status ?? false}                     
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked })} 
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      disabled={!(currUser?.roles?.includes("ADMIN"))}          
                    />
                  </div>
                  <div>
                    <Label>Giờ mở cửa</Label>
                    <Input
                      type="time"
                      defaultValue={formData?.openTime}                    
                      onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                    />
                    {errors?.openTime && <p className="text-red-500 text-sm mt-1">{errors.openTime}</p>}
                  </div>
                  <div>
                    <Label>Giờ đóng cửa</Label>
                    <Input
                      type="time"
                      defaultValue={formData?.closeTime}
                      onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                    />
                    {errors?.closeTime && <p className="text-red-500 text-sm mt-1">{errors.closeTime}</p>}
                  </div>
                  <div className="col-span-2 text-center">
                    {errors?.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                  </div>
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
    </div>
  )
}