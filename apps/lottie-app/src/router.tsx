import { Route, Navigate, Routes, useLocation } from "react-router-dom";

import { RootLayout } from "./components";
import AnimationDetailPage from "./pages/AnimationDetailPage";
import HomePage, { Detail } from "./pages/HomePage";

export function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="animation/:animationId"
            element={<AnimationDetailPage />}
          />
          <Route path="animation" element={<Navigate to="/" />} />
        </Route>
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      )}
    </>
  );
}
