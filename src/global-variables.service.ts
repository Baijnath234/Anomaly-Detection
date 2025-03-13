// if you need to add new variable here, do not forget to add it to .env file
export interface IEnvs {
    ENV: string;
    BACKEND_URL: string;
    SOCKET_URL: string;
    GRAFANA_MODEL: string;
  }
  
  declare global {
    interface Window {
      _env_: IEnvs;
    }
  }
  
  if (!window._env_) {
    throw new Error('ALL REQUIRED ENVIRONMENT VARIABLES HAVE BEEN MISSED');
  }
  
  Object.entries(window._env_).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`REQUIRED ENVIRONMENT VARIABLE HAS BEEN MISSED: ${key}`);
    }
  });
  
  export const BACKEND_URL = window._env_?.BACKEND_URL;
  export const GRAFANA_MODEL = window._env_?.GRAFANA_MODEL;
  export const SOCKET_URL = window._env_?.SOCKET_URL;
  export const ENV = window._env_?.ENV;
  