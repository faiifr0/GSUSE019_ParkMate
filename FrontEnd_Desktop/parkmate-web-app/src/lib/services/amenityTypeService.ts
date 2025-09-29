import axiosClient from "../axiosClient";
import { amenityTypeCreateModel } from "@/lib/model/amenityTypeCreateModel";
import { amenityTypeUpdateModel } from "@/lib/model/amenityTypeUpdateModel";

export type amenityTypeResponse = {
  id: string;
  name: string;
};

const amenityTypeService = {
  getAll: async(): 
    Promise<amenityTypeResponse[]> => {
    try {
      const res = await axiosClient.get<amenityTypeResponse[]>("/amenity-type");
      return res.data;
    } catch (error) {
      console.error("❌ Error get all amenity types: ", error);
      throw error;
    }
  },

  getAmenityTypeById: async (id: string): Promise<amenityTypeResponse> => {
    try {
      const res = await axiosClient.get<amenityTypeResponse>(`/amenity-type/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching amenity type id {" + id + "} : ", error);
      throw error;
    }
  },

  createAmenityType: async (model: amenityTypeCreateModel): Promise<amenityTypeResponse> => {
    try {
      const res = await axiosClient.post<amenityTypeResponse>(`/amenity-type`);
      return res.data;
    } catch (error) {
      console.error("❌ Error create amenity type : ", error);
      throw error;
    }
  },

  updateAmenityType: async (
    id: string, 
    model: amenityTypeUpdateModel
  ): Promise<amenityTypeResponse> => {
    try {
      const res = await axiosClient.put<amenityTypeResponse>(`/branch-promotion/${id}`, model);
      return res.data;
    } catch (error) {
      console.error("❌ Error update amenity type id {" + id + "} : ", error);
      throw error;
    }
  },
};

export default amenityTypeService;
