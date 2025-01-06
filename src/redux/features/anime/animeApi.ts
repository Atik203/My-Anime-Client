import { baseApi } from "@/redux/api/baseApi";

const animeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addAnime: builder.mutation({
      query: (payload) => ({
        url: "/myanime/save",
        method: "POST",
        body: payload.data,
        headers: new Headers({
          Authorization: `${payload.token}`,
        }),
      }),
    }),
    getMyData: builder.query({
      query: (token) => ({
        url: "/myanime/my-data",
        headers: new Headers({
          Authorization: `${token}`,
        }),
      }),
    }),
    getSingleMyData: builder.query({
      query: ({ token, slug }) => ({
        url: `/myanime/my-data/single`,
        body: { slug },
        headers: new Headers({
          Authorization: `${token}`,
        }),
      }),
    }),
  }),
});

export const {
  useAddAnimeMutation,
  useGetMyDataQuery,
  useGetSingleMyDataQuery,
} = animeApi;
