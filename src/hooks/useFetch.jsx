import React, { useState } from "react";

const useFetch = (cb) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  async function fetchData(...args) {
    setLoading(true);
    setError(null);

    try {
      const res = await cb(...args);
      setData(res);
      setLoading(false);
      setError(null);
    } catch (error) {
      setError(error);
    }
  }

  return { data, error, loading, fetchData };
};

export default useFetch;
