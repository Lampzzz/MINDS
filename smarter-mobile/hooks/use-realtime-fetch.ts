import { ErrorHandler } from "@/lib/utils";
import { useState, useEffect } from "react";

export const useRealTimeFetch = <T>(
  fetchFunction: (
    setData: (data: T) => void,
    setError: (error: string) => void
  ) => () => void
) => {
  const [data, setData] = useState<T | []>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = fetchFunction(
      (data: T) => {
        setData(data);
        setLoading(false);
      },
      (error: string) => {
        setError(error);
        ErrorHandler(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [fetchFunction]);

  const reset = () => {
    setData([]);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, reset };
};
