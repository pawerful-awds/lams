import React from 'react';
import { useParams } from 'react-router-dom';

import { AnimationViewer } from '../components';

const AnimationDetail: React.FC = () => {
  const { animationId } = useParams<{ animationId: string }>();

  return (
    <div>
      <h2>Animation Detail</h2>
      <p>Animation ID: {animationId}</p>
      <AnimationViewer animationId={animationId ?? ''} />
    </div>
  );
};

export default AnimationDetail;