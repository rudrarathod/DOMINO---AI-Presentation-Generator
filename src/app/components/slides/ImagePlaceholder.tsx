import React, { useRef, useState } from "react";
import { Camera, ImageIcon, Upload } from "lucide-react";

interface ImagePlaceholderProps {
  imageUrl?: string;
  onImageUpload?: (dataUrl: string) => void;
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
  className?: string;
  /** Variant: 'card' for large areas, 'avatar' for circular team photos, 'icon' for small icon boxes */
  variant?: "card" | "avatar" | "icon";
}

function compressImage(file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;

        if (w > maxWidth) {
          h = (h * maxWidth) / w;
          w = maxWidth;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context unavailable"));

        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/webp", quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function ImagePlaceholder({
  imageUrl,
  onImageUpload,
  fallbackIcon,
  fallbackText,
  className = "",
  variant = "card",
}: ImagePlaceholderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    if (!onImageUpload) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    try {
      const maxWidth = variant === "avatar" ? 256 : variant === "icon" ? 128 : 800;
      const dataUrl = await compressImage(file, maxWidth, 0.75);
      onImageUpload(dataUrl);
    } catch (err) {
      console.error("Image compression failed:", err);
    }

    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const isClickable = !!onImageUpload;

  if (variant === "avatar") {
    return (
      <div
        className={`relative overflow-hidden ${isClickable ? "cursor-pointer group" : ""} ${className}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          fallbackIcon || (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-600">
              <ImageIcon size={16} className="text-white/60" />
            </div>
          )
        )}

        {/* Upload overlay */}
        {isClickable && (
          <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${isHovering ? "opacity-100" : "opacity-0"}`}>
            <Camera size={12} className="text-white" />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  if (variant === "icon") {
    return (
      <div
        className={`relative overflow-hidden ${isClickable ? "cursor-pointer group" : ""} ${className}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          fallbackIcon
        )}

        {isClickable && (
          <div className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg transition-opacity duration-200 ${isHovering ? "opacity-100" : "opacity-0"}`}>
            <Upload size={12} className="text-white" />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  // Default: card variant
  return (
    <div
      className={`relative overflow-hidden ${isClickable ? "cursor-pointer group" : ""} ${className}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          {fallbackIcon && (
            <div className="relative text-center">
              {fallbackIcon}
              {fallbackText && (
                <p className="text-white/40 text-xs mt-1">{fallbackText}</p>
              )}
            </div>
          )}
          {!fallbackIcon && (
            <div className="relative text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
                <ImageIcon size={28} className="text-white/30" />
              </div>
              <p className="text-white/40 text-xs">{fallbackText || "Click to upload image"}</p>
            </div>
          )}
        </>
      )}

      {/* Upload hover overlay */}
      {isClickable && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${isHovering ? "opacity-100" : "opacity-0"}`}>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
            <Camera size={18} className="text-white" />
          </div>
          <p className="text-white/80 text-[10px] font-medium">
            {imageUrl ? "Replace image" : "Upload image"}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
