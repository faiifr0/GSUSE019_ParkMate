import { useEffect, useRef } from "react";
import QRCode from 'qrcode';

export const QrFromJson = ({ data }: { data: object }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const jsonString = JSON.stringify(data);

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, jsonString, { width: 200 }, (error: unknown) => {
        if (error) console.error(error);
      });
    }
  }, [data]);

  return <canvas ref={canvasRef} />;
};
