"use client";

import { Modal } from "@/components/modal";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ViewBadge } from "../shelter-badge";

interface ShelterImageModalProps {
  isOpen: boolean;
  images: string[];
  name: string;
  loading: boolean;
  onClose: () => void;
}

function ShelterImageModal({
  isOpen,
  onClose,
  images,
  name,
  loading,
}: ShelterImageModalProps) {
  const shelterName = name ? name + " Images" : "Shelter Images";
  const [currentImage, setCurrentImage] = useState(0);

  const changeImage = (direction: "left" | "right") => {
    if (direction === "left") {
      if (currentImage > 0) {
        setCurrentImage(currentImage - 1);
      } else {
        setCurrentImage(images.length - 1);
      }
    } else {
      if (currentImage < images.length - 1) {
        setCurrentImage(currentImage + 1);
      } else {
        setCurrentImage(0);
      }
    }
  };

  return (
    <Modal
      title={shelterName}
      isOpen={isOpen}
      onClose={onClose}
      styles="max-w-2xl"
    >
      {loading ? (
        <div className="flex justify-center items-center max-h-[400px] bg-red-100">
          <p>Loading...</p>
        </div>
      ) : images.length > 0 ? (
        <>
          {images.length > 1 && (
            <button
              onClick={() => changeImage("left")}
              className="flex justify-center items-center absolute top-1/2 transform -translate-y-1/2 -left-16 bg-muted/90 p-3 rounded-full hover:bg-muted/50 transition-colors"
            >
              <ChevronLeft size={24} className="text-muted-foreground" />
            </button>
          )}
          <Separator className="mb-4" />
          <div className="max-h-[400px] overflow-hidden flex justify-center items-center">
            <img
              src={images[currentImage]}
              alt={images[currentImage]}
              className="max-h-full w-auto"
            />
          </div>
          {images.length > 1 && (
            <button
              onClick={() => changeImage("right")}
              className="flex justify-center items-center absolute top-1/2 transform -translate-y-1/2 -right-16 bg-muted/90 p-3 rounded-full hover:bg-muted/50 transition-colors"
            >
              <ChevronRight size={24} className="text-muted-foreground" />
            </button>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center h-24">
          <p className="text-muted-foreground text-sm">No images</p>
        </div>
      )}
    </Modal>
  );
}

export function ShelterImagesButton({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ images, name });

  useEffect(() => {
    let isMounted = true;

    const fetchResidents = async () => {
      setIsLoading(true);

      try {
        if (isMounted) {
          setData({
            name,
            images,
          });
        }
      } catch (error) {
        console.error("Error fetching residents:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchResidents();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, name, images]);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        <ViewBadge label="See images" />
      </button>
      <ShelterImageModal
        isOpen={isOpen}
        onClose={onClose}
        images={data.images}
        name={data.name}
        loading={isLoading}
      />
    </>
  );
}
