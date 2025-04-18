"use client";

import { useState } from "react";
import useAuthStore from "@/store/auth-store";

export const useEmailVerificationCheck = () => {
  const { isEmailVerified } = useAuthStore();
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const checkVerification = async () => {
    if (!isEmailVerified) {
      setShowVerificationModal(true);
      return false;
    }

    return true;
  };

  return {
    showVerificationModal,
    setShowVerificationModal,
    checkVerification,
    isEmailVerified,
  };
};
