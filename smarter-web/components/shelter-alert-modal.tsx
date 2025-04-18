"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { thresholdAlertMessage } from "@/lib/utils";
import { useThresholdAlertStore } from "@/store/use-threshold-alert-store";

export const ShelterAlertModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { thresholdAlert, fetchThresholdAlert, cleanup } =
    useThresholdAlertStore();

  useEffect(() => {
    setIsMounted(true);
    fetchThresholdAlert();
    return () => cleanup();
  }, [isMounted, fetchThresholdAlert, cleanup]);

  if (!isMounted) return null;
  if (!thresholdAlert) return null;

  return (
    <Modal
      title={"Shelter Alert"}
      description=""
      isOpen={thresholdAlert ? true : false}
      onClose={() => cleanup()}
    >
      <div className="flex justify-center items-center mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#DC2626"
          className="size-60"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <p className="text-center">
        {thresholdAlertMessage(thresholdAlert.sensor) || ""}
      </p>
    </Modal>
  );
};
