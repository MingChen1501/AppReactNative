import {useEffect, useState} from 'react';

const UseDataFetching = url => {
  const [data, setData] = useState({
    id: '',
    title: '',
    thumbnail: '',
    pages: [
      {
        id: '',
        page_numbers: '',
        texts: [
          {
            id: '',
            text: '',
          },
        ],
      },
    ],
  });
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
