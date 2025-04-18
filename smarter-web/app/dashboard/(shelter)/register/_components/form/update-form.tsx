"use client";

import useShelterStore from "@/store/shelter-store";
import ShelterImage from "../shelter-image";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getPendingShelters,
  updateShelter,
} from "@/firebase/firestore/shelter";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { shelterAddresses, shelterStatuses } from "@/constants/data";
import { useFetch } from "@/hooks/use-fetch";

type ShelterImage = string | File;

export function ShelterUpdateForm({ shelterId }: { shelterId: string }) {
  const router = useRouter();
  const form = useForm();

  const { data: shelterDevices } = useFetch(getPendingShelters);
  const { shelter, fetchShelter } = useShelterStore();
  const [shelterImages, setShelterImages] = useState<ShelterImage[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchShelter(shelterId)]);
    };

    fetchData();
  }, [shelterId]);

  useEffect(() => {
    form.reset({ ...shelter });
    setShelterImages(shelter?.images || []);
  }, [shelter, form]);

  const onSubmit = async (data: any) => {
    try {
      const response = await updateShelter(
        { ...data, images: shelterImages },
        shelterId,
        shelter?.shelterDeviceId
      );

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      router.replace("/dashboard/register");
      toast.success(response.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file && file.size > 4 * 1024 * 1024) {
      toast.error("The image file size exceeds the 4MB limit");
      return;
    }

    if (shelterImages.length >= 4) {
      toast.error("You can only upload a maximum of 4 images");
      return;
    }

    setShelterImages((prevImages) => {
      const newImages = [...prevImages, file];
      return newImages;
    });
  };

  const removeShelterImage = (image: File | string) => {
    setShelterImages((prev) => prev.filter((img) => img !== image));
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          Update Shelter Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <div>
                <div
                  className="relative border-2 border-dashed rounded-lg p-16 text-center cursor-pointer hover:bg-muted/50 transition-colors duration-300"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <div className="p-4 border rounded-full inline-flex justify-center items-center mb-2">
                    <Upload size={20} />
                  </div>
                  <p className="text-lg text-muted-foreground">
                    Click to select files
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You can upload files (up to 4mbs)
                  </p>
                </div>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>

            {shelterImages?.length > 0 &&
              shelterImages.map((image) => (
                <ShelterImage
                  key={typeof image === "string" ? image : image.name}
                  image={image}
                  removeImage={removeShelterImage}
                />
              ))}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="shelterDeviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shelter Device</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shelter device" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shelterDevices?.length === 0 && (
                          <SelectItem value="none" disabled>
                            No available shelter device
                          </SelectItem>
                        )}
                        {shelter && (
                          <SelectItem value={shelter?.shelterDeviceId}>
                            {shelter?.name}
                          </SelectItem>
                        )}
                        {shelterDevices?.map((data) => (
                          <SelectItem key={data.id} value={data.id!}>
                            {data.name}
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shelterAddresses.map((address) => (
                          <SelectItem key={address.value} value={address.value}>
                            {address.label}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shelterStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
