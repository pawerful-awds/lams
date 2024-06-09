import { Route, Navigate, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { RootLayout } from './components';
import AnimationDetailPage from './pages/AnimationDetailPage';
import HomePage from './pages/HomePage';

export const getAppRouter = () => {

  return createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="animation/:animationId" element={<AnimationDetailPage />} />
          <Route path="animation" element={<Navigate to="/" />} />
        </Route>
      </>
    )
  );
};