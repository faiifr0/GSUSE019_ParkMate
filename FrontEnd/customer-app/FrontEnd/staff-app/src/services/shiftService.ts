import axiosClient from "../api/axiosClient";
import { Shift } from "../types/Shift";

// Lấy tất cả ca làm
export const getShifts = async (): Promise<Shift[]> => {
  const res = await axiosClient.get<Shift[]>("/shift");
  return res.data;
};

// Lấy ca làm theo ID
export const getShiftById = async (id: number): Promise<Shift> => {
  const res = await axiosClient.get<Shift>(`/shift/${id}`);
  return res.data;
};

// Tạo ca làm
export const createShift = async (data: Omit<Shift, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">): Promise<Shift> => {
  const res = await axiosClient.post<Shift>("/shift", data);
  return res.data;
};

// Cập nhật ca làm
export const updateShift = async (id: number, data: Partial<Shift>): Promise<Shift> => {
  const res = await axiosClient.put<Shift>(`/shift/${id}`, data);
  return res.data;
};

// Xóa ca làm
export const deleteShift = async (id: number): Promise<void> => {
  await axiosClient.delete(`/shift/${id}`);
};
