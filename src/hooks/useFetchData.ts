import { useEffect, useState } from 'react';

export const useFetchData = () => {
  const [allData, setAllData] = useState<string[]>([]);

  useEffect(() => {
    fetch('/auto-complete/data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json();
      })
      .then((data: Array<{ email: string }>) => setAllData(data.map((item) => item.email)))
      .catch((error) => {
        console.error('Failed to load data', error);
        throw error;
      });
  }, []);

  return {
    allData,
  };
};
