import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAxiosSecure from "@/hooks/axiosSecure";
import { useCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { TExternalAPi } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddedAnimeDetails = () => {
  const { year, month, day, slug } = useParams();
  const fullSlug = `${year}/${month}/${day}/${slug}`;
  const navigate = useNavigate();
  const token = useAppSelector(useCurrentToken);

  const axiosSecure = useAxiosSecure();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animeData, setAnimeData] = useState<any | null>(null);
  const [selectedServer, setSelectedServer] = useState("Server 1");
  const [videoUrl, setVideoUrl] = useState("");

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

  const handleServerChange = (server) => {
    setSelectedServer(server);
    const selectedLink = anime.streamingLinks.find(
      (link) => link.source === server
    );
    if (selectedLink) {
      setVideoUrl(selectedLink.link);
    }
  };

  const handleNextEpisode = () => {
    if (anime.nextEpisode) {
      navigate(`/added-anime/${anime.nextEpisode}`);
    }
  };

  const handlePrevEpisode = () => {
    if (anime.previousEpisode) {
      navigate(`/added-anime/${anime.previousEpisode}`);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">{anime.title}</h1>
        <p className="mb-4 text-center">{anime.description}</p>
        <div className="mb-4 max-w-sm mx-auto">
          <p className="mb-2 text-center">Select Server</p>
          <Select onValueChange={handleServerChange} value={selectedServer}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a server" />
            </SelectTrigger>
            <SelectContent>
              {anime.streamingLinks.map((link) => (
                <SelectItem key={link.source} value={link.source}>
                  {link.source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <p>Status: {anime.status}</p>
          <p>Release Date: {anime.releaseDate}</p>
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
