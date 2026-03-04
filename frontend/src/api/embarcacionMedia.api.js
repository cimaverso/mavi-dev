import httpClient from "./httpClient";

const BUCKET_URL =
  "https://utgcdfbcvbkmjblrvrrh.supabase.co//storage/v1/object/public/embarcaciones";

const embarcacionMediaApi = {

  getByEmbarcacion: async (id) => {

    const res = await httpClient.get(`/api/embarcaciones-media/${id}`);

    if (!res.success) return res;

    return {
      success: true,
      data: res.data.map(m => ({
        ...m,
        url: `${BUCKET_URL}/${m.embmed_path}`
      }))
    };

  }

};

export default embarcacionMediaApi;