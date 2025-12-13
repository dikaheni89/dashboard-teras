import { useCallback, useEffect, useState } from "react";

export default function useGetData<T>(url: string, additional?: { [key: string]: unknown }) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const res = await fetch(url, additional);

      if (!res.ok) {
        console.error(`Error ${res.status}: ${res.statusText}`);
        setIsError(true);
        setIsLoading(false);
        return;
      }

      try {
        const jsonResponse = await res.json();
        setData(jsonResponse);
      } catch (jsonError: unknown) {
        if (jsonError instanceof Error) {
          console.error("Failed to parse JSON:", jsonError.message);
        } else {
          console.error("Unexpected JSON parse error:", jsonError);
        }
        setIsError(true);
      }

    } catch (networkError: unknown) {
      if (networkError instanceof Error) {
        console.error("Network Error:", networkError.message);
      } else {
        console.error("Unexpected error:", networkError);
      }
      setIsError(true);
    }

    setIsLoading(false);
  }, [url, additional]);

  useEffect(() => {
    getData();
  }, [getData]);

  return {
    data,
    isLoading,
    isError,
    getData,
  };
}
