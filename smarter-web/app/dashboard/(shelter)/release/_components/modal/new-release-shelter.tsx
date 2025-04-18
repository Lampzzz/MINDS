"use client";

import * as z from "zod";
import useManagerStore from "@/store/manager-store";
import useShelterStore from "@/store/shelter-store";
import useReleaseShelterStore from "@/store/release-shelter-store";
import useAuthStore from "@/store/auth-store";
import { createReleaseShelter } from "@/firebase/firestore/release-shelter";
import { Modal } from "@/components/modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/use-fetch";

interface NewReleaseShelterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  shelterId: z.string().min(1, {
    message: "Required",
  }),
  releaseToId: z.string().min(1, {
    message: "Required",
  }),
});

export function NewReleaseShelterModal({
  isOpen,
  onClose,
}: NewReleaseShelterModalProps) {
  const { fetchReleaseShelters } = useReleaseShelterStore();
  const { assignedManagers, fetchAssignedManager } = useManagerStore();
  const { fetchShelters, shelters } = useShelterStore();
  const { currentUser } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shelterId: undefined,
      releaseToId: undefined,
    },
  });

  useEffect(() => {
    fetchAssignedManager(false);
    fetchShelters();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await createReleaseShelter({
        ...values,
        releaseById: currentUser?.id,
      });

      if (response.success) {
        modalClose();
        fetchReleaseShelters();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const modalClose = () => {
    onClose();
    form.setValue("shelterId", "");
    form.setValue("releaseToId", "");
  };

  return (
    <Modal
      title="Release Shelter Information"
      isOpen={isOpen}
      onClose={modalClose}
    >
      <Separator className="mb-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="releaseToId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assignedManagers?.length === 0 && (
                        <SelectItem value="none" disabled>
                          No available unassigned manager
                        </SelectItem>
                      )}
                      {assignedManagers?.map((data) => (
                        <SelectItem key={data.id} value={data.id!}>
                          {data?.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shelterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shelter</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select available shelter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shelters?.filter((data) => data.status === "available")
                        .length === 0 && (
                        <SelectItem value="none" disabled>
                          No available shelter
                        </SelectItem>
                      )}
                      {shelters
                        ?.filter((data) => data.status === "available")
                        .map((data) => (
                          <SelectItem key={data.id} value={data.id!}>
                            {data?.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

export function NewReleaseShelterModalButton() {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(buttonVariants({ variant: "default" }))}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Release Shelter
      </Button>
      <NewReleaseShelterModal onClose={onClose} isOpen={isOpen} />
    </>
  );
}
