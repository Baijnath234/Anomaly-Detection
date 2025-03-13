import React, { PropsWithChildren, ReactNode } from "react";

interface ContextValue {
  hasPermission: (permission: any, action: any) => boolean;
  hasPermissions: (permissions: any, isAllActions?: any) => boolean;
}

export const PermissionsContext = React.createContext<ContextValue>({
  hasPermission: () => true, 
  hasPermissions: () => true,
});

const PermissionsProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const hasPermission = (permission: any, action: any): boolean => {
    return true;
  };

  const hasPermissions = (permissions: any, isAllActions?: any): boolean => {
    return true; // For now, always true
  };

  return (
    <PermissionsContext.Provider value={{ hasPermission, hasPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsProvider;
