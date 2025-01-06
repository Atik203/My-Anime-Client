import AddedCard from "@/components/ui/custom/AddedCard";
import { useGetMyDataQuery } from "@/redux/features/anime/animeApi";
import { useCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { TExternalAPi } from "@/types";

const AddedAnime = () => {
  const token = useAppSelector(useCurrentToken);

  const { data, isLoading, isFetching } = useGetMyDataQuery(token);

  if (isLoading || isFetching) return <h1>Loading...</h1>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.data?.map((anime: TExternalAPi) => (
        <AddedCard key={anime._id} anime={anime} />
      ))}
    </div>
  );
};

export default AddedAnime;
