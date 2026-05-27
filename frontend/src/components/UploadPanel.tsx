import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import type { UploadedImage } from '../types/analysis';
import { absoluteUrl } from '../api/client';

interface Props {
  uploaded: UploadedImage | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onReset: () => void;
}

export function UploadPanel({ uploaded, isUploading, onUpload, onReset }: Props) {
  const onDrop = useCallback(
    (files: File[]) => {
      if (files[0]) onUpload(files[0]);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/bmp': ['.bmp'],
    },
    maxFiles: 1,
    disabled: isUploading || !!uploaded,
  });

  if (uploaded) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <ImageIcon className="w-4 h-4" />
            <span className="truncate max-w-[180px]">{uploaded.original_name}</span>
          </div>
          <button
            onClick={onReset}
            className="text-slate-400 hover:text-red-400 transition"
            title="Yeni görüntü"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <img
          src={absoluteUrl(uploaded.image) ?? ''}
          alt="uploaded"
          className="w-full h-48 object-contain rounded-lg bg-black/40"
        />
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`rounded-2xl border-2 border-dashed transition cursor-pointer p-8 text-center
        ${isDragActive ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 bg-slate-900/30 hover:bg-slate-900/60'}
        ${isUploading ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
      <p className="text-sm text-slate-300">
        {isUploading
          ? 'Yükleniyor...'
          : isDragActive
          ? 'Bırak!'
          : 'Görüntü sürükle veya tıkla'}
      </p>
      <p className="text-xs text-slate-500 mt-2">JPG, PNG, GIF, BMP</p>
    </div>
  );
}
