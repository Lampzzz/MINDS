import { createShelter, uploadShelterImage } from "./create-shelter";
import { deleteShelterById } from "./delete-shelter";
import { getShelterById, getShelterByManagerId } from "./get-shelter";
import { getShelters } from "./get-shelters";
import { updateShelter } from "./update-shelter";
import { getPendingShelters } from "./get-pending-shelters";
import { getShelterDevice } from "./get-shelter-device";

export {
  createShelter,
  deleteShelterById,
  getShelterById,
  getShelters,
  updateShelter,
  getPendingShelters,
  getShelterDevice,
  uploadShelterImage,
  getShelterByManagerId,
};
