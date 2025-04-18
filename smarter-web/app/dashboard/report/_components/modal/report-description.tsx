"use client";

import { Modal } from "@/components/modal";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ViewBadge } from "../shelter-badge";

function ReportDescriptionModal({
  isOpen,
  onClose,

  category,
  description,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  description: string;
}) {
  return (
    <Modal title={category} isOpen={isOpen} onClose={onClose}>
      <Separator className="mb-4" />
      <p className="text-muted-foreground text-sm">{description}</p>
    </Modal>
  );
}

export function ReportDescriptionButton({
  category,
  description,
}: {
  category: string;
  description: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchResidents = async () => {
      setIsLoading(true);
      try {
        if (isMounted) {
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
  }, [isOpen]);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        <ViewBadge label="Read" />
      </button>
      <ReportDescriptionModal
        category={category}
        isOpen={isOpen}
        onClose={onClose}
        description={description}
      />
    </>
  );
}
