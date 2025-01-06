import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAxiosSecure from "@/hooks/axiosSecure";
import {
  useAddAnimeMutation,
  useDeletePreviousEpMutation,
} from "@/redux/features/anime/animeApi";
import {
  useCurrentToken,
  useCurrentUser,
} from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { TExternalAPi } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const AddedAnimeDetails = () => {
  const { year, month, day, slug } = useParams();
  const fullSlug = `${year}/${month}/${day}/${slug}`;
  const navigate = useNavigate();
  const token = useAppSelector(useCurrentToken);
  const user = useAppSelector(useCurrentUser);
  const [DeletePreviousAnime] = useDeletePreviousEpMutation();

  const axiosSecure = useAxiosSecure();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animeData, setAnimeData] = useState<any | null>(null);
  const [selectedServer, setSelectedServer] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [AddAnime] = useAddAnimeMutation();
  useEffect(() => {
    const getAnimeData = async () => {
      try {
        if (fullSlug) {
          const response = await axiosSecure.post(`/myanime/my-data/single`, {
            headers: {
              Authorization: `${token}`,
            },

            slug: fullSlug,
          });
          setAnimeData(response.data as TExternalAPi);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAnimeData();
  }, [axiosSecure, fullSlug, token]);

  if (!animeData) return <h1>Loading...</h1>;

  const anime = animeData.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleServerChange = (server: any) => {
    setSelectedServer(server);
    const selectedLink = anime.streamingLinks.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (link: any) => link.source === server
    );
    if (selectedLink) {
      setVideoUrl(selectedLink.link);
    }
  };

  const handleNextEpisode = async () => {
    if (anime.nextEpisode) {
      try {
        const response = await axiosSecure.post(
          `/myanime?url=${anime.nextEpisode}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const animeData = response.data;
        if (animeData.success === false) {
          toast.error("Failed to fetch next episode data");
          return;
        }
        if (!user || !token) {
          toast.error("User not authenticated");
          return;
        }

        const result = await AddAnime({
          data: {
            ...animeData.data,
            schedule: {
              day: anime.schedule.day,
            },
            status: anime.status,
            user: user._id,
            image: anime.image,
          },
        }).unwrap();
        if (result.success === false) {
          toast.error("Failed to add anime to database");
          return;
        }

        const [year, month, day, ...remaining] = result.data.slug.split("/");
        const remainingSlug = remaining.join("/");

        const deletePrevious = await DeletePreviousAnime({
          token,
          slug: fullSlug,
        }).unwrap();

        if (deletePrevious.success === false) {
          toast.error("Failed to delete previous episode");
          return;
        }
        toast.success("Next Episode Fetched Successfully");
        navigate(`/added-anime/${year}/${month}/${day}/${remainingSlug}`);
      } catch (error) {
        toast.error("Failed to go to next episode");
      }
    }
  };
  const handlePrevEpisode = async () => {
    if (anime.previousEpisode) {
      try {
        const response = await axiosSecure.post(
          `/myanime?url=${anime.previousEpisode}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const animeData = response.data;
        if (animeData.success === false) {
          toast.error("Failed to fetch next episode data");
          return;
        }
        if (!user || !token) {
          toast.error("User not authenticated");
          return;
        }

        const result = await AddAnime({
          data: {
            ...animeData.data,
            schedule: {
              day: anime.schedule.day,
            },
            status: anime.status,
            user: user._id,
            image: anime.image,
          },
        }).unwrap();
        const [year, month, day, ...remaining] = result.data.slug.split("/");

        const remainingSlug = remaining.join("/");
        const deletePrevious = await DeletePreviousAnime({
          token,
          slug: fullSlug,
        }).unwrap();

        if (deletePrevious.success === false) {
          toast.error("Failed to delete previous episode");
          return;
        }
        toast.success("Previous Episode Fetched Successfully");
        navigate(`/added-anime/${year}/${month}/${day}/${remainingSlug}`);
        if (result.success === false) {
          toast.error("Failed to add anime to database");
          return;
        }
      } catch (error) {
        toast.error("Failed to go to next episode");
      }
    }
  };

  return (
    <div className="p-6  min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">{anime.title}</h1>
        <div className="flex justify-center my-2 items-center gap-5">
          <p className=" text-center">Select Server :</p>
          <div className=" max-w-md">
            <Select onValueChange={handleServerChange} value={selectedServer}>
              <SelectTrigger className="w-full bg-gray-200 dark:bg-gray-800 p-2 rounded">
                <SelectValue placeholder="Select a server" />
              </SelectTrigger>
              <SelectContent className="bg-gray-200 dark:bg-gray-800  p-2 rounded mt-1">
                {anime.streamingLinks.map((link) => (
                  <SelectItem key={link.source} value={link.source}>
                    {link.source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <iframe
            src={videoUrl}
            title="Anime Video"
            width="100%"
            height="500px"
            allowFullScreen
            className="rounded"
          ></iframe>
        </div>
        <div className="mb-4 text-center">
          <p>Episode: {anime.episode}</p>
          <p>Airing Date: {anime.schedule.day}</p>
          <p>Status: {anime.status}</p>
          <p>Release Date: {anime.releaseDate}</p>
          <p className="mb-4 text-center">{anime.description}</p>
        </div>
        <div className="flex justify-between">
          <Button onClick={handlePrevEpisode} disabled={!anime.previousEpisode}>
            Previous Episode
          </Button>
          <Button onClick={handleNextEpisode} disabled={!anime.nextEpisode}>
            Next Episode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddedAnimeDetails;
