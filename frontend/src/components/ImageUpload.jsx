import React, { useRef, useState } from 'react';
import { UploadCloud, X, Image } from 'lucide-react';

/**
 * ImageUpload – drag-and-drop / click image picker with preview.
 * Props:
 *   onChange       – callback(File | null) when a file is selected or cleared
 *   currentImage   – URL string of an existing image (shown when no new file chosen)
 *   label          – optional label text
 *   accept         – file types string, default "image/*"
 */
const ImageUpload = ({ onChange, currentImage, label = 'Upload Image', accept = 'image/*' }) => {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [dragging, setDragging] = useState(false);

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
        onChange(file);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        setPreview(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const displayImage = preview || currentImage;

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
            )}

            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden
                    ${dragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40'
                    }
                    ${displayImage ? 'h-48' : 'h-36'}
                `}
            >
                {displayImage ? (
                    <>
                        <img
                            src={displayImage}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm font-semibold flex items-center gap-2">
                                <UploadCloud size={16} /> Click to change
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-700 rounded-full p-1 shadow transition-colors z-10"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 px-4 text-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Image size={22} className="text-blue-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">
                            {dragging ? 'Drop image here' : 'Click or drag & drop an image'}
                        </p>
                        <p className="text-xs text-slate-400">PNG, JPG, WebP up to 5 MB</p>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
};

export default ImageUpload;
