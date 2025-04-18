"use client";

import { useControllersStore } from "@/store/controllers-store";
import { Modal } from "@/components/modal";
import { useCallback, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ViewBadge } from "../shelter-badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  updateDoorController,
  updateInverterController,
} from "@/firebase/firestore/iot-controllers";

interface Controller {
  door?: string;
  inverter?: string;
}

function ShelterCameraModal({
  isOpen,
  onClose,
  shelterDeviceId,
  cameraUrl,
  name,
}: {
  isOpen: boolean;
  onClose: () => void;
  shelterDeviceId: string;
  name: string;
  cameraUrl: string;
}) {
  const { fetchControllers, controllers, cleanup } = useControllersStore();

  useEffect(() => {
    if (isOpen) {
      fetchControllers(shelterDeviceId);
      return () => cleanup();
    }
  }, [isOpen, shelterDeviceId]);

  const handleDoorUpdate = useCallback(async () => {
    if (controllers.door) {
      await updateDoorController(shelterDeviceId);
    }

    toast.success("Door Open");
  }, [shelterDeviceId, controllers.door]);

  const handleInverterUpdate = useCallback(async () => {
    if (controllers.inverter) {
      await updateInverterController(shelterDeviceId, controllers.inverter);
    }

    toast.success(
      controllers.inverter === "off" ? "Inverter On" : "Inverter Off"
    );
  }, [shelterDeviceId, controllers.inverter]);

  return (
    <Modal title={`${name} Camera`} isOpen={isOpen} onClose={onClose}>
      <Separator className="mb-4" />
      <div className="w-full h-[300px] flex items-center justify-center mb-4">
        {cameraUrl ? (
          <iframe
            src="http://192.168.208.151/stream"
            className="w-full h-full"
          ></iframe>
        ) : (
          <div className="text-gray-500">No camera feed</div>
        )}
      </div>
      <div className="flex gap-x-2">
        <Button
          variant="default"
          className="flex-1"
          onClick={() => handleDoorUpdate()}
        >
          Door
        </Button>
        <Button
          variant="default"
          className="flex-1"
          onClick={() => handleInverterUpdate()}
        >
          Inverter
        </Button>
      </div>
    </Modal>
  );
}

export function ShelterCameraButton({
  shelterDeviceId,
  cameraUrl,
  shelterName,
}: {
  shelterDeviceId: string;
  cameraUrl: string;
  shelterName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();

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
  }, [shelterDeviceId, isOpen]);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        <ViewBadge label="View stream" />
      </button>
      <ShelterCameraModal
        name={shelterName}
        cameraUrl={cameraUrl}
        isOpen={isOpen}
        onClose={onClose}
        shelterDeviceId={shelterDeviceId}
      />
    </>
  );
}
