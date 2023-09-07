import {useEffect, useState} from 'react';

const UseDataFetching = (url, responsePayload) => {
  const [data, setData] = useState(responsePayload);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const dataFetched = await response.json();
      setIsLoading(false);
      setData(dataFetched);
    } catch (e) {
      setIsLoading(false);
      setError(e);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return [{data, isLoading, error}, fetchData];
};

export default UseDataFetching;
