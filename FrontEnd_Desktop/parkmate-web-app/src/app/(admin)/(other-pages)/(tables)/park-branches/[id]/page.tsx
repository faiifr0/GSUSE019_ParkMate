"use client"
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BranchImageCard from "@/components/park-branch/BranchImageCard";
import OverviewInfoCard from "@/components/park-branch/OverviewInfoCard";
import React, { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import trackasiagl from 'trackasia-gl';
import 'trackasia-gl/dist/trackasia-gl.css';

export default function ParkBranchOverview() { 
  const [clickedCoords, setClickedCoords] = useState<{ lng: number; lat: number }>({
    lng: 106.694945,
    lat: 10.769034,
  });

  const markerRefs = useRef<trackasiagl.Marker[]>([]);
  const mapRef = useRef<trackasiagl.Map | null>(null);

  useEffect(() => {
    const map = new trackasiagl.Map({
      container: "map",
      style: "https://maps.track-asia.com/styles/v2/streets.json?key=5c175761088372c925182847abb3df5aef",
      center: [106.694945, 10.769034], // [lng, lat]
      zoom: 15,
    });

    mapRef.current = map;

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      // Update state
      setClickedCoords({ lat, lng });

      // If there are already 2 markers, remove the newest one
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
    .setLngLat([106.694945, 10.769034])
    .setPopup(new trackasiagl.Popup().setText("Địa điểm ban đầu")) // optional popup
    .addTo(map);    
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      console.log("Trình duyệt của bạn không hỗ trợ định vị.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setClickedCoords({ lat: latitude, lng: longitude });

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
    <div>
      <PageBreadcrumb 
        pageTitle="Thông tin chung của chi nhánh" 
        items={[
          { name: "Danh sách chi nhánh", path: "/park-branches" },          
        ]}
      />
      <Toaster
        reverseOrder={false}
        toastOptions={{
          style: {
            marginTop: '70px',            
            zIndex: 100000, // cao hơn modal
          },
      }}/>
      <ComponentCard title="Thông tin chung của chi nhánh">
        <div>
          <OverviewInfoCard></OverviewInfoCard>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-6 space-y-6">
            <ComponentCard title="Ảnh chi nhánh">
              <div>
                <BranchImageCard></BranchImageCard>                          
              </div>
            </ComponentCard>
          </div>
          <div className="col-span-6 space-y-6">
            <ComponentCard title="Vị trí địa lý">
              <div className="h-[408px] w-full rounded shadow">    
                <div id="map" className="h-full w-full">                     
                </div>
                <div>
                  <div className="mt-8 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Vĩ độ (Latitude)</label>
                    <input
                      type="text"
                      value={clickedCoords!.lat.toFixed(6)}
                      readOnly
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <label className="block text-sm font-medium text-gray-700">Kinh độ (Longitude)</label>
                    <input
                      type="text"
                      value={clickedCoords!.lng.toFixed(6)}
                      readOnly
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    onClick={handleGetLocation}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    📍 Lấy vị trí hiện tại
                  </button> 
                </div>                
              </div>
            </ComponentCard>
          </div>    
        </div>        
      </ComponentCard>
    </div>
  );
}