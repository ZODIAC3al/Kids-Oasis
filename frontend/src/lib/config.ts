export const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In browser dev, use local backend. In production build, use production backend.
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:3001/api/v1";
  }
  return "https://kids-oasis-api.vercel.app/api/v1";
};

export const API_URL = getApiUrl();
