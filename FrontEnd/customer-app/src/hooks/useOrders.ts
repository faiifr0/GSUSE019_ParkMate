import { useState, useCallback } from "react";
import orderService from "../services/orderService";
import { Order, CreateOrderPayload, UpdateOrderPayload } from "../types/Order";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersByUser = useCallback(async (userId: number) => {
  console.log("[useOrders] fetchOrdersByUser called with userId:", userId);
  setLoading(true);
  try {
    const data = await orderService.getByUserId(userId);
    console.log("[useOrders] fetched orders data:", data);
    setOrders(data);
    setError(null);
  } catch (err: any) {
    console.error("[useOrders] fetchOrdersByUser error:", err);
    setError(err.message || "Lỗi tải danh sách đơn hàng");
  } finally {
    setLoading(false);
  }
}, []);


  const fetchOrderById = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await orderService.getById(id);
      setCurrentOrder(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Lỗi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (payload: CreateOrderPayload) => {
    setLoading(true);
    try {
      const data = await orderService.create(payload);
      setCurrentOrder(data);
      setOrders((prev) => [...prev, data]);
      setError(null);
      return data;
    } catch (err: any) {
      setError(err.message || "Lỗi tạo đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (id: number, payload: UpdateOrderPayload) => {
    setLoading(true);
    try {
      const data = await orderService.update(id, payload);
      setCurrentOrder(data);
      setOrders((prev) =>
        prev.map((order) => (order.orderId === id ? data : order))
      );
      setError(null);
      return data;
    } catch (err: any) {
      setError(err.message || "Lỗi cập nhật đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await orderService.delete(id);
      setOrders((prev) => prev.filter((order) => order.orderId !== id));
      if (currentOrder?.orderId === id) setCurrentOrder(null);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Lỗi xóa đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  return {
    orders,
    currentOrder,
    loading,
    error,
    fetchOrdersByUser,
    fetchOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
