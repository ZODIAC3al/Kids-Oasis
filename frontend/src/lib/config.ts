export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "https://kids-oasis-api.vercel.app/api/v1";
};

export const API_URL = getApiUrl();
