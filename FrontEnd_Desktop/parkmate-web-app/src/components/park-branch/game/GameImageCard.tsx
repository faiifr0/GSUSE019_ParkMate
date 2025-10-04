import gameService from '@/lib/services/gameService';
import { GameResponse } from '@/lib/services/gameService';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const GameImageCard = () => {
  const params = useParams();
  const id = params.id ? String(params.id) : '0';
  const gameId = params['game-id'] ? String(params['game-id']) : null;

  const [gameInfo, setGameInfo] = useState<GameResponse>();    

  const fetchGame = async () => {
    const response = await gameService.getGameById(gameId!);
    setGameInfo(response);  
  }

  // Fetch Park Branch Overview Info
    useEffect(() => {
    try {
      fetchGame();  
    } catch (err) {
      console.log(err);
    } finally {
      // do something
    }
  }, [])

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', 'unsigned_parkmate');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dgvsqetgz/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      const imageUrl = data.secure_url;
      setUploadedUrl(imageUrl);

      const message = 'Upload ảnh trò chơi thành công!';
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
      });
      // update imageUrl to backend
      gameService.updateGameImage(gameId!, imageUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      const message = 'Upload ảnh trò chơi thất bại!';
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='grid grid-cols-12'>
      <div className="col-span-3 space-y-6"></div>
      <div className="col-span-6 space-y-6">
        <div className="space-y-4">
            <img
            src={imagePreview || gameInfo?.imageUrl || '/images/stock/no_image.png'}
            alt="Ảnh tiện nghi"
            className="w-full h-auto rounded shadow"
            />
        </div>

        <div className="flex justify-center">
            <label className="flex flex-col border-2 rounded-lg px-2 pb-2">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            </label>
        </div>

        <div className="flex justify-center">
            <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`px-4 py-2 rounded text-white font-semibold ${
                uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : selectedFile
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            >
            {uploading ? 'Đang tải lên...' : 'Tải ảnh lên'}
            </button>
        </div>

        {/* {uploadedUrl && (
            <div className="text-center text-sm text-green-600">
            Ảnh đã tải lên: <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">{uploadedUrl}</a>
            </div>
        )} */}
      </div>
      <div className="col-span-3 space-y-6"></div>
    </div>
  );
};

export default GameImageCard;
