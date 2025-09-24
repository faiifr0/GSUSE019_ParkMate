import { useState } from 'react';

const BranchImageCard = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="col-span-6 space-y-6">      
        <div className="space-y-4">
          <img
            src={imagePreview || '/images/stock/amusement-park-1.jpg'}
            alt="Ảnh chi nhánh"
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
    </div>
  );
};

export default BranchImageCard;
