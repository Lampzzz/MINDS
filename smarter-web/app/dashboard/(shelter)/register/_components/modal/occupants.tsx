"use client";

import { Modal } from "@/components/modal";
import { getShelterResident } from "@/firebase/firestore/member";
import { Member } from "@/types";
import { Manager } from "@/types";
import { useEffect, useState } from "react";
import { RoleBadge } from "../role-badge";
import { Separator } from "@/components/ui/separator";
import { ViewBadge } from "../shelter-badge";

function OccupantsModal({
  isOpen,
  onClose,
  residents,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  residents: (Manager & Member)[] | undefined;
  isLoading: boolean;
}) {
  return (
    <Modal
      title="Occupant List"
      description="List of occupants in the shelter"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Separator className="mb-4" />
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        ) : residents && residents.length > 0 ? (
          residents.map((resident) => (
            <div
              key={resident.id}
              className="flex items-center justify-between"
            >
              <p className=" text-sm">{resident.fullName}</p>
              <RoleBadge role={resident.managerId ? "Member" : "Manager"} />
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-24">
            <p className="text-muted-foreground text-sm">No occupants found</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function OccupantsButton({ managerId }: { managerId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [residents, setResidents] = useState<(Manager & Member)[] | undefined>(
    undefined
  );

  useEffect(() => {
    let isMounted = true;

    const fetchResidents = async () => {
      setIsLoading(true);
      try {
        const data = await getShelterResident(managerId);
        if (isMounted) {
          setResidents(data);
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
  }, [managerId, isOpen]);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        <ViewBadge label="View residents" />
      </button>
      <OccupantsModal
        isOpen={isOpen}
        onClose={onClose}
        residents={residents}
        isLoading={isLoading}
      />
    </>
  );
}
