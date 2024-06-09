import React from 'react';
import { useSearchParams } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');

  return (
    <div>
      <h1>Welcome to LAMS</h1>
      { q && <p>with search: {q}</p>}
    </div>
  );
};

export default HomePage;
