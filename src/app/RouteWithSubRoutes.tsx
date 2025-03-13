import React from 'react';
import { Route } from 'react-router-dom';
import { RouteConfig } from './RouterConfig';

interface RouteWithSubRoutesProps extends RouteConfig {}

export const RouteWithSubRoutes: React.FC<RouteWithSubRoutesProps> = ({ path, element }) => {
  return <Route path={path} element={element} />;
};
