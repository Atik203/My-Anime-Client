import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      className="bg-gray-800 text-white cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle>{anime.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p>{anime.description}</p>
      </CardContent>
    </Card>
  );
};

export default AddedCard;
