"use client";

import * as z from "zod";
import useManagerStore from "@/store/manager-store";
import useShelterStore from "@/store/shelter-store";
import useAuthStore from "@/store/auth-store";
import useReturnShelterStore from "@/store/return-shelter-store";
import { createReturnShelter } from "@/firebase/firestore/return-shelter";
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

interface NewReleaseShelterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  returnById: z.string().min(1, {
    message: "Required",
  }),
});

export function NewReturnShelterModal({
  isOpen,
  onClose,
}: NewReleaseShelterModalProps) {
  const { fetchReturnShelters } = useReturnShelterStore();
  const { assignedManagers, fetchAssignedManager } = useManagerStore();
  const { fetchShelters } = useShelterStore();
  const { currentUser } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      returnById: undefined,
    },
  });

  useEffect(() => {
    fetchAssignedManager(true);
    fetchShelters();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await createReturnShelter({
        ...values,
        returnToId: currentUser?.id,
      });

      if (response.success) {
        toast.error(response.message);
      }

      modalClose();
      fetchReturnShelters();
      toast.success(response.message);
    } catch (error) {
      console.error(error);
    }
  };

  const modalClose = () => {
    onClose();
    form.setValue("returnById", "");
  };

  return (
    <Modal
      title="Return Shelter Information"
      isOpen={isOpen}
      onClose={modalClose}
    >
      <Separator className="mb-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="returnById"
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
                          No available assigned manager
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

export function NewReturnShelterModalButton() {
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
        Add Return Shelter
      </Button>
      <NewReturnShelterModal onClose={onClose} isOpen={isOpen} />
    </>
  );
}
