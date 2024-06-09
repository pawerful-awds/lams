import React from 'react';
import { Outlet } from 'react-router-dom';

export const RootLayout: React.FC = () => (
    <>
      <header>
        Header here
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        Footer here
      </footer>
    </>
  );