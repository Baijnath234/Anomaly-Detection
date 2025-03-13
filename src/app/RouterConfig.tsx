import { SignInPage } from '../pages';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

export const getRoutes = (): RouteConfig[] => {
  return [
    {
      path: '/login',
      element: <SignInPage />,
    },
  ];
};
