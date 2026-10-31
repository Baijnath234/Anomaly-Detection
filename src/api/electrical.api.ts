import { apiClient } from './client';

export interface BuildingTree {
  id: string;
  name: string;
  address?: string;
  mainsSupplyType: string;
  nominalVoltage: number;
  floors: {
    id: string;
    name: string;
    rooms: {
      id: string;
      name: string;
      roomType: string;
      switchboards: {
        id: string;
        name: string;
        controllerId?: string;
        devices: {
          id: string;
          name: string;
          category: string;
          ratedWatts: number;
          state: 'ON' | 'OFF';
          relayChannel: number;
        }[];
      }[];
    }[];
  }[];
  panels: {
    id: string;
    panelName: string;
    ratedAmperage: number;
    circuits: {
      id: string;
      circuitNumber: string;
      name: string;
      breakerRatingAmps: number;
      wireGaugeMm2: number;
    }[];
  }[];
}

export interface LiveTelemetry {
  circuitId: string;
  timestamp: string;
  voltageRms: number;
  currentRms: number;
  activePowerWatts: number;
  powerFactor: number;
  temperatureCelsius: number;
  leakageCurrentMa: number;
  relayState: 'ON' | 'OFF';
  mcbTripStatus: 'CLOSED' | 'TRIPPED';
}

export interface ElectricalFault {
  id: string;
  circuitId: string;
  faultType: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  triggerValue: number;
  thresholdValue: number;
  parameter: string;
  message: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: string;
}

export interface ComponentHealth {
  id: string;
  entityType: string;
  entityId: string;
  healthScore: number;
  failureRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedRulDays: number;
  thermalStressAccumulated: number;
  degradationReason?: string;
  lastEvaluatedAt: string;
}

export interface AutomationScene {
  id: string;
  buildingId: string;
  name: string;
  description?: string;
  actionsJson: { deviceId: string; state: 'ON' | 'OFF' }[];
}

export interface MaintenanceTicket {
  id: string;
  circuitId: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  assignedTechnician?: string;
  createdAt: string;
}

export const electricalApi = {
  // Topology
  getBuildings: async () => (await apiClient.get('/api/topology/buildings')).data,
  getBuildingTree: async (id: string): Promise<BuildingTree> =>
    (await apiClient.get(`/api/topology/buildings/${id}/tree`)).data,
  toggleDevice: async (deviceId: string, state: 'ON' | 'OFF') =>
    (await apiClient.post(`/api/topology/devices/${deviceId}/toggle`, { state })).data,

  // Telemetry
  getLiveReading: async (circuitId: string): Promise<LiveTelemetry> =>
    (await apiClient.get(`/api/telemetry/live/${circuitId}`)).data,
  getEnergyMetrics: async (circuitId: string) =>
    (await apiClient.get(`/api/telemetry/energy/${circuitId}`)).data,

  // Faults
  getActiveFaults: async (): Promise<ElectricalFault[]> =>
    (await apiClient.get('/api/faults/active')).data,
  acknowledgeFault: async (id: string) =>
    (await apiClient.post(`/api/faults/${id}/acknowledge`)).data,

  // Maintenance
  getHealthOverview: async (): Promise<ComponentHealth[]> =>
    (await apiClient.get('/api/maintenance/health')).data,

  // Automation & Scenes
  getScenes: async (): Promise<AutomationScene[]> =>
    (await apiClient.get('/api/automation/scenes')).data,
  executeScene: async (id: string) =>
    (await apiClient.post(`/api/automation/scenes/${id}/execute`)).data,
  getTickets: async (): Promise<MaintenanceTicket[]> =>
    (await apiClient.get('/api/automation/tickets')).data,
};
