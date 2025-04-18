import { formatImageSize } from "@/lib/utils";
import { X } from "lucide-react";

export default function ShelterImage({
  image,
  removeImage,
}: {
  image: File | string;
  removeImage: (image: string | File) => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img
          src={typeof image === "string" ? image : URL.createObjectURL(image)}
          alt={getFileName(image)}
          className="object-contain w-10 h-10"
        />
        <div>
          <p className="text-muted-foreground text-sm mb-1">
            {getFileName(image)}
          </p>
          {typeof image !== "string" && (
            <p className="text-muted-foreground text-xs">
              {formatImageSize(image?.size)}
            </p>
          )}
        </div>
      </div>
      <button onClick={() => removeImage(image)}>
        <X size={20} className="text-muted-foreground" />
      </button>
    </div>
  );
}

function getFileName(image: File | string) {
  if (typeof image === "string") {
    const parts = image.split("-");
    return `${parts[2]}-${parts[3].split("?")[0]}`;
  } else {
    return image.name;
  }
}
