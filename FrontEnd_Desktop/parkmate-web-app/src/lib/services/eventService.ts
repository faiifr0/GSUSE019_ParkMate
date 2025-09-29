import axiosClient from "../axiosClient";
import { eventCreateModel } from "../model/eventCreateModel";
import { eventUpdateModel } from "../model/eventUpdateModel";
import { updateImageModel } from "../model/updateImageModel";

export type EventResponse = {
  id: string,
  name: string,
  description: string,
  startAt: string,
  endAt: string,
  parkBranchId: string,
  imageUrl: string,
  status: boolean
};

const eventService = {
  getAllOfBranch: async (id: string): 
    Promise<EventResponse[]> => {
    try {
      const res = await axiosClient.get<EventResponse[]>(`/events/of-branch/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error get all branch events: ", error);
      throw error;
    }
  },

  getEventById: async (id: string): Promise<EventResponse> => {
    try {
      const res = await axiosClient.get<EventResponse>(`/events/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching branch event id {" + id + "} : ", error);
      throw error;
    }
  },

  createEvent: async (model?: eventCreateModel): Promise<EventResponse> => {
    try {
      const res = await axiosClient.post<EventResponse>(`/events`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error create branch event : ", error);
      throw error;
    }
  },

  updateEvent: async (
    id: string, 
    model?: eventUpdateModel
    
  ): Promise<EventResponse> => {
    try {
      const res = await axiosClient.put<EventResponse>(`/events/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update branch event id {" + id + "} : ", error);
      throw error;
    }
  },

  deleteEvent: async (
    id: string,     
  ): Promise<void> => {
    try {
      await axiosClient.delete<void>(`/events/${id}`);      
    } catch (error) {
      console.error("❌ Error delete branch event id {" + id + "} : ", error);
      throw error;
    }
  },

  updateEventImage: async (
    id: string, 
    model?: updateImageModel
  ): Promise<void> => {
    try {
      const res = await axiosClient.put<updateImageModel>(`/events/${id}/image`, model);
    } catch (error) {
      console.error("❌ Error update event image :", error);
      throw error;
    }
  },
};

export default eventService;
