
import React, { useState } from 'react';

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const simulateUpload = (file: File) => {
    setFileName(file.name);
    setIsUploading(true);
    // Mimic storage interaction
    setTimeout(() => {
      setIsUploading(false);
      onUploadComplete('https://mock-storage-url.com/' + file.name);
      alert(`Archivo "${file.name}" subido correctamente a Firebase Storage.`);
    }, 2000);
  };

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
        isDragging ? 'border-[#EE2523] bg-[#EE2523]/5' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        onChange={handleFileChange}
        accept="image/*,.pdf"
      />
      
      {!isUploading ? (
        <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          </div>
          <div>
            <p className="text-white font-medium">Haz clic para subir o arrastra un archivo</p>
            <p className="text-white/40 text-xs mt-1">PNG, JPG o PDF hasta 10MB</p>
          </div>
        </label>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-[#EE2523] border-white/10 animate-spin"></div>
          <p className="text-white text-sm font-medium">Subiendo {fileName}...</p>
          <div className="w-48 bg-white/10 h-1 rounded-full overflow-hidden">
             <div className="bg-[#EE2523] h-full animate-progress-ind"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
