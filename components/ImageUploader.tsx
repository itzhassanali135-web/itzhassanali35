
import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  image: string | null;
  onImageSelect: (base64: string) => void;
  description: string;
  icon: React.ReactNode;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageSelect, description, icon }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{label}</label>
      <div 
        onClick={() => inputRef.current?.click()}
        className={`relative h-64 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden
          ${image ? 'border-transparent' : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50'}
        `}
      >
        {image ? (
          <>
            <img src={image} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-sm font-medium">Change Image</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center px-6 text-center">
            <div className="p-4 rounded-full bg-slate-800 mb-4 text-indigo-400">
              {icon}
            </div>
            <p className="text-slate-300 font-medium mb-1">Click to upload</p>
            <p className="text-slate-500 text-xs">{description}</p>
          </div>
        )}
      </div>
      <input 
        type="file" 
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
