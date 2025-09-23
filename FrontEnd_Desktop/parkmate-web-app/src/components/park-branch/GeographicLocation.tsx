'use client'
import { parkBranchUpdateModel } from "@/lib/model/parkBranchUpdateModel";
import parkBranchService, { parkBranchResponse } from "@/lib/services/parkBranchService";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import trackasiagl from 'trackasia-gl';

export default function GeographicLocation () {
  const params = useParams();
  const id = params.id ? String(params.id) : '0';

  const [branchInfo, setBranchInfo] = useState<parkBranchResponse>();
  const [formData, setFormData] = useState<parkBranchUpdateModel>();
  const [clickedCoords, setClickedCoords] = useState<{ lng: number; lat: number }>({
    lng: 106.694945,
    lat: 10.769034,
  });
  
  const markerRefs = useRef<trackasiagl.Marker[]>([]);
  const mapRef = useRef<trackasiagl.Map | null>(null);
  
  const fetchParkBranch = async () => {
    try {
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
    } catch (err) {
      console.log(err);
      const message = 'Fetch chi nhánh công viên id ' + id + ' thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    }
  }

  const handleSave = async () => {
    try {
      const response = await parkBranchService.updateParkBranch(id, formData); 
      const message = 'Lưu vị trí địa lý thành công!';
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
      const message = 'Lưu vị trí địa lý thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    }
  }

  useEffect(() => {
    fetchParkBranch();
  }, []);

  useEffect(() => { 
    const coords = parseAndValidateLocation(branchInfo?.location!);

    const map = new trackasiagl.Map({
      container: "map",
      style: "https://maps.track-asia.com/styles/v2/streets.json?key=5c175761088372c925182847abb3df5aef",
      center: coords!, // [lng, lat]
      zoom: 15,
    });

    setClickedCoords({ lng: coords[0], lat: coords[1] });
  
    mapRef.current = map;
  
    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
    
      // Update state
      setClickedCoords({ lng, lat });

      // Update formData.location with "longitude : latitude"
      setFormData((prev) => ({
        ...prev!,
        location: `${lng.toFixed(6)} : ${lat.toFixed(6)}`
      }));
    
      // If there are already a marker, remove the newest one
      if (markerRefs.current.length >= 1) {
      const newest = markerRefs.current.pop();
      newest?.remove();
      }
    
      // Add new marker
      const newMarker = new trackasiagl.Marker({ color: "#2229ffff" })
      .setLngLat([lng, lat])
      .addTo(map);
    
      markerRefs.current.push(newMarker);
    });
  
    // Add a marker at the center
    new trackasiagl.Marker({ color: "#FF0000" }) // red marker
      .setLngLat(coords!)
      .setPopup(new trackasiagl.Popup().setText("Địa điểm ban đầu")) // optional popup
      .addTo(map);    
  }, [branchInfo]);
  
    const handleGetLocation = () => {
      if (!navigator.geolocation) {
        console.log("Trình duyệt của bạn không hỗ trợ định vị.");
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setClickedCoords({ lat: latitude, lng: longitude });
  
          setFormData((prev) => ({
            ...prev!,
            location: `${longitude.toFixed(6)} : ${latitude.toFixed(6)}`
          }));

          // Remove newest marker if already 1
          if (markerRefs.current.length >= 1) {
            const newest = markerRefs.current.pop();
            newest?.remove();
          }
  
          const newMarker = new trackasiagl.Marker({ color: "#2229ffff" }) // green
            .setLngLat([longitude, latitude])
            .setPopup(new trackasiagl.Popup().setText("Vị trí của bạn"))
            .addTo(mapRef.current!);
  
          markerRefs.current.push(newMarker);
  
          mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 16 });
        },
        (error) => {
          alert("Không thể lấy vị trí: " + error.message);
        },
        { enableHighAccuracy: true }
      );
    };

  return (
    <div className="h-[408px] w-full rounded shadow">
      <div id="map" className="h-full w-full"></div>
      <div>
        <div className="mt-16 space-y-2 grid grid-cols-2 gap-x-4 text-center">
          <div className="col-span-2 mx-auto w-full max-w-sm text-center">
            <label className="block text-md font-medium text-gray-700">Kinh Độ : Vĩ độ (Longitude : Latitude)</label>
            <input
              type="text"
              value={`${clickedCoords!.lng.toFixed(6)} : ${clickedCoords!.lat.toFixed(6)}`}
              readOnly
              className="w-full border rounded px-3 py-2 text-sm text-center"
            />
          </div>                    
        </div>

        <div className="grid grid-cols-2 gap-x-4 text-center">
          <div className="col-span-1">
            <button
            onClick={handleGetLocation}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Lấy vị trí hiện tại 📍
            </button>
          </div>
          <div className="col-span-1">
            <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Lưu vị trí địa lý
            </button>
          </div> 
        </div>    
      </div>
    </div>
  )
}

function parseAndValidateLocation(location: string): [number, number] {
  if (!location || typeof location !== "string") return [106.694945, 10.769034];

  const [lngStr, latStr] = location.split(" : ");
  const lng = parseFloat(lngStr);
  const lat = parseFloat(latStr);

  const isLngValid = !isNaN(lng) && lng >= -180 && lng <= 180;
  const isLatValid = !isNaN(lat) && lat >= -90 && lat <= 90;

  // a random default location if location is not formatted correctly
  return isLngValid && isLatValid ? [lng, lat] : [106.694945, 10.769034];
}