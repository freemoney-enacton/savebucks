import { useTranslation } from '@/i18n/client';
import { ArrowUpTrayIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

const InputFileUpload = ({
  label,
  onChange,
  errorMessage,
  accept = '.jpeg, .jpg, .png',
  value,
}: {
  label?: string;
  onChange?: (file: File | null) => void;
  errorMessage?: string;
  accept?: string;
  value?: string;
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      onChange?.(selectedFile);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setFilePreview(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
      onChange?.(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div>
      {file ? (
        <div className={`max-w-full pr-4 p-3 flex items-center gap-4 bg-black rounded-lg`}>
          {file.type.startsWith('image/') && filePreview && (
            <div className="flex-shrink-0 size-16 bg-black-600 rounded-lg">
              {filePreview ? (
                <Image
                  src={filePreview}
                  alt={file.name}
                  className="h-full w-full object-cover rounded-lg"
                  width={80}
                  height={80}
                />
              ) : null}
            </div>
          )}
          <div className="flex items-center gap-4 w-full">
            <div className="w-full text-sm font-medium space-y-1">
              <p className="break-all line-clamp-1">{file.name}</p>
              <p>
                {(file.size / (1024 * 1024)).toFixed(3)} {t('mb')}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <button type="button" onClick={handleCancel}>
                <XCircleIcon className="size-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : value ? (
        <div className={`w-full flex justify-center items-center self-center p-3 bg-black rounded-lg`} onClick={handleClick}>
          <div className="flex-shrink-0 size-16 bg-black-600 rounded-lg self-center">
            <Image src={value} alt={''} className="h-full w-full object-cover rounded-lg" width={80} height={80} />
          </div>
        </div>
      ) : (
        <div
          className="w-full p-4 flex flex-col items-center justify-center gap-2.5 bg-black cursor-pointer rounded-lg"
          role="button"
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ArrowUpTrayIcon className="size-7 text-gray-500" />
          <span className="text-xs text-gray-500">{label ? label : t('file_upload')}</span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept={accept}
        // accept=".jpeg, .jpg, .gif, .bmp, .png"
      />
      {errorMessage && <p className="text-red text-xs mt-1">{errorMessage}</p>}
    </div>
  );
};

export default InputFileUpload;
