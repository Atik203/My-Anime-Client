import { Card, CardHeader } from "@/components/ui/card";
import { TExternalAPi } from "@/types";
import { useNavigate } from "react-router-dom";

const AddedCard = ({ anime }: { anime: TExternalAPi }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // 2024/12/30/yongheng-jian-zu-eternal-sword-ancestor-episode-06

    // get the year ,month, day, and slug from  anime.slug
    const [year, month, day, ...slug] = anime.slug.split("/");
    navigate(`/added-anime/${year}/${month}/${day}/${slug.join("/")}`);
  };
  return (
    <Card
      className="bg-gray-800 my-8 h-[500px] text-white cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={anime.image}
        alt={anime.title}
        className="w-full max-h-96 object-contain rounded-md"
      />
      <CardHeader>
        <h1>{anime.title}</h1>
        {anime.status === "ongoing" ? (
          <p className="text-green-500">Airing Date: {anime.schedule.day}</p>
        ) : null}
      </CardHeader>
    </Card>
  );
};

export default AddedCard;
