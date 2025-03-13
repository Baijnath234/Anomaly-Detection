import React from "react";

export interface RouteModel {
  path: string;
  component?: React.LazyExoticComponent<React.FC> | React.FC<{ routes?: RouteModel[] }>;
  redirect?: string;
  routes?: RouteModel[] | undefined;
  fallback?: React.ReactNode;
}
