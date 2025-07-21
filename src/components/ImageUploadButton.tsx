import React, { useRef } from 'react';
import './ImageUploadButton.css';

interface ImageUploadButtonProps {
  onImageUpload: (dataUrl: string) => void;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onImageUpload(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button className="upload-button" onClick={handleButtonClick}>
        じぶんのぬりえをよみこむ
      </button>
    </>
  );
};

export default ImageUploadButton;
