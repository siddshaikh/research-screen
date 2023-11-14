import axios from "axios";
import { useEffect, useState, useMemo } from "react";

const useFetchData = (url, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const memoizedOptions = useMemo(() => options, [options]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(url, memoizedOptions);
        setData(res);
      } catch (error) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;
