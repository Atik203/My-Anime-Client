import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAxiosSecure from "@/hooks/axiosSecure";
import { useAddAnimeMutation } from "@/redux/features/anime/animeApi";
import {
  useCurrentToken,
  useCurrentUser,
} from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const formSchema = z.object({
  url: z.string().url({ message: "Invalid URL" }),
  time: z.string().nonempty({ message: "Airing time is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Setting = () => {
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const axiosSecure = useAxiosSecure();

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const [AddAnime] = useAddAnimeMutation();
  const onSubmit = async (data: FormValues) => {
    const toastId = toast.loading("Adding anime...");

    try {
      // get the anime data from the url
      const response = await axiosSecure.post(`/myanime?url=${data.url}`);
      const animeData = response.data;
      if (animeData.success === false) {
        toast.error("Failed to add anime", { id: toastId });
        return;
      }
      if (!user || !token) {
        toast.error("Failed to add anime", { id: toastId });
        return;
      }

      // add the anime to the database

      const result = await AddAnime({
        data: {
          ...animeData.data,
          schedule: {
            day: selectedDays,
            time: data.time,
          },
          status: "ongoing",
          user: user._id,
        },
      }).unwrap();

      if (result.success === false) {
        toast.error("Failed to add anime", { id: toastId });
        return;
      }
      navigate("/added-anime");
      toast.success("Anime added successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to add anime", { id: toastId });
    }
  };

  return (
    <div className="py-12 lg:py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Add favorite anime from{" "}
        <a
          target="_blank"
          href="https://myanime.live"
          className="text-indigo-400"
        >
          My Anime Live
        </a>{" "}
        page
      </h1>
      <div className="max-w-3xl w-full p-6 mx-auto">
        <p className="mb-2 ">1. Go to My Anime Live page</p>
        <p className="mb-2 ">2. Click on the anime episode you want to add</p>
        <p className="mb-2 ">3. Click on the "Add" button</p>
        <p className="mb-4 ">
          4. The anime will be added to your added anime list
        </p>

        <div className="mb-8">
          <h1 className="text-xl font-semibold mb-2">Remove favorite anime</h1>
          <p className="mb-2">
            1. Click on the "Remove" button on the anime you want to remove
          </p>
          <p className="mb-4">
            2. The anime will be removed from your added anime list
          </p>
        </div>
      </div>
      <div className="max-w-3xl w-full p-6 mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="animeUrl">Anime Episode URL</FormLabel>
                  <FormControl>
                    <Input
                      id="animeUrl"
                      type="url"
                      placeholder="https://myanime.live/2025/01/05/battle-through-the-heavens-season-5-episode-128-english-sub/"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.url?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel htmlFor="airingDays">Airing Days</FormLabel>
              <FormControl>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-gray-950 text-white py-2 px-4 text-start rounded"
                    onClick={() =>
                      document
                        .getElementById("dropdown")
                        ?.classList.toggle("hidden")
                    }
                  >
                    {selectedDays.length > 0
                      ? selectedDays.join(", ")
                      : "Select days"}
                  </button>
                  <div
                    id="dropdown"
                    className="absolute mt-2 w-full bg-gray-900 text-white rounded shadow-lg hidden"
                  >
                    {daysOfWeek.map((day) => (
                      <div key={day} className="px-4 py-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            value={day}
                            checked={selectedDays.includes(day)}
                            onChange={() => handleDayChange(day)}
                            className="mr-2"
                          />
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="airingTime">Airing Time</FormLabel>
                  <FormControl>
                    <Input id="airingTime" type="time" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.time?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Setting;
