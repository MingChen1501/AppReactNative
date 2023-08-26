import {useEffect, useState} from 'react';

const UseDataFetching = url => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    const response = await fetch(url);
    return await response.json();
    //TODO: handle response, error
  };
  useEffect(() => {
    fetchData()
      .then(dataFetched => {
        if (dataFetched) {
          setIsLoading(false);
          setData(dataFetched);
        }
        setIsLoading(false);
      })
      .catch(e => setError(e));
  }, []);
  const refreshState = () => {
    fetchData()
      .then(dataFetched => {
        if (dataFetched) {
          setIsLoading(false);
          setData(dataFetched);
        }
        setIsLoading(false);
      })
      .catch(e => setError(e));
  };
  return [{data, isLoading, error}, refreshState];
};

export default UseDataFetching;
