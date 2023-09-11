import {useEffect, useState} from 'react';

const jwt =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNjk0NDAzNDA0LCJleHAiOjE2OTQ0MDcwMDQsIm5iZiI6MTY5NDQwMzQwNCwianRpIjoiV283OXFHczQ1U1hrc1pKMiIsInN1YiI6IjciLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3IiwiMCI6InhtY2tlbnppZSIsIjEiOiJSZXltdW5kbyIsIjIiOiJMYW5nIn0.-9Rzvl1wlHookSL3RJP2Lc9ONSdx_BzJUWEXNSUi9Bw';
const option = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + jwt,
  },
};
const UseDataFetching = (url, responsePayload) => {
  const [data, setData] = useState(responsePayload);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const response = await fetch(url, option);
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
