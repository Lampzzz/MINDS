import { getShelters } from "../shelter";
import { getManagers } from "./get-managers";
import { Manager } from "@/types";

export const getManagersByAssigned = async (
  isAssigned: boolean
): Promise<Manager[]> => {
  try {
    const shelters = await getShelters();
    const managers = await getManagers();

    const assignedManagerIds = shelters
      .filter(
        (shelter) =>
          shelter.managerId !== null && shelter.managerId !== undefined
      )
      .map((shelter) => shelter.managerId!);

    const filteredManagers = managers.filter((manager) => {
      const isManagerAssigned = assignedManagerIds.includes(manager.id!);
      return isAssigned ? isManagerAssigned : !isManagerAssigned;
    });

    return filteredManagers;
  } catch (error) {
    console.error(error);
    return [];
  }
};
