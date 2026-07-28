export const getApiUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return process.env.NEXT_PUBLIC_DEV_API_URL || "http://localhost:3001/api/v1";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://kids-oasis-api.vercel.app/api/v1";
};

export const API_URL = getApiUrl();

