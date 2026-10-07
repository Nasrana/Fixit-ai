import React, { useRef } from 'react';
import { Camera, Image, X, UploadCloud, Check } from 'lucide-react';

interface EvidenceUploaderProps {
  evidenceBase64?: string;
  evidenceName?: string;
  onImageSelected: (base64: string, name: string) => void;
  onClear: () => void;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({
  evidenceBase64,
  evidenceName,
  onImageSelected,
  onClear
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB for base64 storage
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onImageSelected(result, file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      {evidenceBase64 ? (
        <div className="relative inline-block rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-slate-900 group shadow-lg">
          <img
            src={evidenceBase64}
            alt="Evidence preview"
            className="w-48 h-32 object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
            <span className="text-[11px] text-white font-medium text-center truncate max-w-full">
              {evidenceName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600/90 text-white hover:bg-rose-500 shadow-md"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-semibold flex items-center space-x-1">
            <Check className="w-3 h-3" />
            <span>Evidence Attached</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium flex items-center space-x-1.5 transition-all"
          >
            <Camera className="w-3.5 h-3.5 text-teal-400" />
            <span>Attach Photo / Evidence</span>
          </button>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            (JPG, PNG, WEBP)
          </span>
        </div>
      )}
    </div>
  );
};
