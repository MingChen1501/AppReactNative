import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const UseDataFetching = (url, responsePayload) => {
  const jwt = useSelector(state => state.jwt);
  const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
    },
  };
  const [data, setData] = useState(responsePayload);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const response = await fetch(url, option);
      const dataFetched = await response.json();
      setData(dataFetched);
      setIsLoading(false);
    } catch (e) {
      setError(e);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return [{data, isLoading, error}, fetchData];
};

export default UseDataFetching;
