import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sliders,
  Plus,
  Trash2,
  Edit3,
  Save,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Radio,
  Power,
  Zap,
  ShieldCheck,
  Download,
  Copy,
  RefreshCw,
  SlidersHorizontal,
  Home,
  Check,
  Server,
  Layers,
  Thermometer,
  ShieldAlert,
  Activity,
  HelpCircle,
} from 'lucide-react';

export type ApplianceCategory =
  | 'LIGHT'
  | 'FAN'
  | 'AC'
  | 'SOCKET'
  | 'HEATER'
  | 'REFRIGERATOR'
  | 'TV'
  | 'PUMP'
  | 'APPLIANCE';

export interface ConfigSwitch {
  id: string;
  name: string;
  channel: number;
  category: ApplianceCategory;
  ratedWatts: number;
  state: 'ON' | 'OFF';
  speedLevel?: number;
  isHeavyDuty?: boolean;
}

export interface ConfigSwitchboard {
  id: string;
  name: string;
  room: string;
  location: string;
  controllerId: string;
  maxLoadWatts: number;
  switches: ConfigSwitch[];
}

export interface ConfigController {
  id: string;
  model: string;
  ipAddress: string;
  macAddress: string;
  mqttTopic: string;
  relayCount: number;
  firmware: string;
  rssi: number;
  status: 'ONLINE' | 'OFFLINE';
  lastPingMs: number;
}

export interface SafetyThresholds {
  overvoltageLimit: number;
  undervoltageLimit: number;
  maxBranchCurrentAmps: number;
  earthLeakageTripMa: number;
  overheatCutoffCelsius: number;
  looseTerminalResistanceOhms: number;
  autoPowerCutoffEnabled: boolean;
  sirenOnCriticalEnabled: boolean;
}

const DEFAULT_CONTROLLERS: ConfigController[] = [
  {
    id: 'ESP32_LR_01',
    model: 'ESP32-S3-WROOM-1 (4CH Relay)',
    ipAddress: '192.168.1.185',
    macAddress: '74:4D:BD:8A:2F:10',
    mqttTopic: 'v1/home/livingroom/board1',
    relayCount: 4,
    firmware: 'v2.4.1-ota',
    rssi: -52,
    status: 'ONLINE',
    lastPingMs: 18,
  },
  {
    id: 'ESP32_LR_02',
    model: 'ESP32 Dual-Contactor 30A',
    ipAddress: '192.168.1.186',
    macAddress: '24:0A:C4:9B:1E:55',
    mqttTopic: 'v1/home/livingroom/climate',
    relayCount: 3,
    firmware: 'v2.4.1-ota',
    rssi: -56,
    status: 'ONLINE',
    lastPingMs: 22,
  },
  {
    id: 'ESP32_BR_01',
    model: 'ESP32 4CH SmartTouch Module',
    ipAddress: '192.168.1.190',
    macAddress: '3C:71:BF:4E:91:80',
    mqttTopic: 'v1/home/bedroom/board1',
    relayCount: 4,
    firmware: 'v2.4.0-ota',
    rssi: -61,
    status: 'ONLINE',
    lastPingMs: 24,
  },
  {
    id: 'ESP32_KT_01',
    model: 'ESP32 Heavy Appliance Contactor',
    ipAddress: '192.168.1.192',
    macAddress: '58:BF:25:DA:03:77',
    mqttTopic: 'v1/home/kitchen/power',
    relayCount: 5,
    firmware: 'v2.4.1-ota',
    rssi: -59,
    status: 'ONLINE',
    lastPingMs: 20,
  },
];

const DEFAULT_SWITCHBOARDS: ConfigSwitchboard[] = [
  {
    id: 'sb-1',
    name: 'Living Room Main Board 1',
    room: 'Living Room',
    location: 'Near Entrance Archway',
    controllerId: 'ESP32_LR_01',
    maxLoadWatts: 2500,
    switches: [
      { id: 'dev-1', name: 'Main Ambient Light', channel: 1, category: 'LIGHT', ratedWatts: 60, state: 'ON' },
      { id: 'dev-2', name: 'Warm Recessed Spotlights', channel: 2, category: 'LIGHT', ratedWatts: 40, state: 'ON' },
      { id: 'dev-3', name: 'Ceiling Fan (BLDC)', channel: 3, category: 'FAN', ratedWatts: 75, state: 'ON', speedLevel: 4 },
      { id: 'dev-4', name: 'Smart Wall Socket', channel: 4, category: 'SOCKET', ratedWatts: 65, state: 'OFF' },
    ],
  },
  {
    id: 'sb-2',
    name: 'Living Room Media & Climate Board',
    room: 'Living Room',
    location: 'Entertainment TV Wall',
    controllerId: 'ESP32_LR_02',
    maxLoadWatts: 3500,
    switches: [
      { id: 'dev-5', name: 'Dual Inverter AC (1.5 Ton)', channel: 1, category: 'AC', ratedWatts: 1850, state: 'ON', isHeavyDuty: true },
      { id: 'dev-6', name: 'OLED TV & Soundbar Socket', channel: 2, category: 'TV', ratedWatts: 140, state: 'ON' },
      { id: 'dev-7', name: 'Ambient TV Backlight Strip', channel: 3, category: 'LIGHT', ratedWatts: 25, state: 'OFF' },
    ],
  },
  {
    id: 'sb-3',
    name: 'Master Bedside Switchboard',
    room: 'Master Bedroom',
    location: 'Left Bedside Table Wall',
    controllerId: 'ESP32_BR_01',
    maxLoadWatts: 2500,
    switches: [
      { id: 'dev-8', name: 'Bedside Reading Lamp', channel: 1, category: 'LIGHT', ratedWatts: 20, state: 'OFF' },
      { id: 'dev-9', name: 'Silent BLDC Ceiling Fan', channel: 2, category: 'FAN', ratedWatts: 35, state: 'ON', speedLevel: 3 },
      { id: 'dev-10', name: 'Master Room Recessed Lights', channel: 3, category: 'LIGHT', ratedWatts: 60, state: 'ON' },
      { id: 'dev-11', name: 'Phone/Laptop Charger Socket', channel: 4, category: 'SOCKET', ratedWatts: 85, state: 'OFF' },
    ],
  },
  {
    id: 'sb-4',
    name: 'Kitchen Power Distribution Board',
    room: 'Kitchen',
    location: 'Main Counter Top Panel',
    controllerId: 'ESP32_KT_01',
    maxLoadWatts: 4500,
    switches: [
      { id: 'dev-13', name: 'Inverter Refrigerator', channel: 1, category: 'REFRIGERATOR', ratedWatts: 250, state: 'ON' },
      { id: 'dev-14', name: 'Microwave & Oven Socket', channel: 2, category: 'SOCKET', ratedWatts: 1200, state: 'OFF', isHeavyDuty: true },
      { id: 'dev-15', name: 'Counter Task Lights', channel: 3, category: 'LIGHT', ratedWatts: 30, state: 'ON' },
      { id: 'dev-16', name: 'Kitchen Exhaust Chimney', channel: 4, category: 'FAN', ratedWatts: 180, state: 'OFF' },
    ],
  },
];

const DEFAULT_SAFETY: SafetyThresholds = {
  overvoltageLimit: 250,
  undervoltageLimit: 190,
  maxBranchCurrentAmps: 16,
  earthLeakageTripMa: 30,
  overheatCutoffCelsius: 65,
  looseTerminalResistanceOhms: 0.45,
  autoPowerCutoffEnabled: true,
  sirenOnCriticalEnabled: true,
};

export const ConfiguratorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BOARDS' | 'CONTROLLERS' | 'SAFETY' | 'JSON'>('BOARDS');
  const [switchboards, setSwitchboards] = useState<ConfigSwitchboard[]>(() => {
    const saved = localStorage.getItem('smart_home_switchboards');
    return saved ? JSON.parse(saved) : DEFAULT_SWITCHBOARDS;
  });
  const [controllers, setControllers] = useState<ConfigController[]>(() => {
    const saved = localStorage.getItem('smart_home_controllers');
    return saved ? JSON.parse(saved) : DEFAULT_CONTROLLERS;
  });
  const [safety, setSafety] = useState<SafetyThresholds>(() => {
    const saved = localStorage.getItem('smart_home_safety');
    return saved ? JSON.parse(saved) : DEFAULT_SAFETY;
  });

  const [selectedBoardId, setSelectedBoardId] = useState<string>(switchboards[0]?.id || 'sb-1');
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);
  const [showAddControllerModal, setShowAddControllerModal] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Form states for adding switchboard
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardRoom, setNewBoardRoom] = useState('Living Room');
  const [newBoardLocation, setNewBoardLocation] = useState('');
  const [newBoardController, setNewBoardController] = useState(controllers[0]?.id || 'ESP32_LR_01');
  const [newBoardMaxWatts, setNewBoardMaxWatts] = useState('3000');

  // Form states for adding controller
  const [newCtrlId, setNewCtrlId] = useState('');
  const [newCtrlModel, setNewCtrlModel] = useState('ESP32-S3 4-Channel Touch Module');
  const [newCtrlIp, setNewCtrlIp] = useState('192.168.1.195');
  const [newCtrlMac, setNewCtrlMac] = useState('A4:CF:12:8E:44:02');
  const [newCtrlTopic, setNewCtrlTopic] = useState('v1/home/new/board');
  const [newCtrlRelays, setNewCtrlRelays] = useState('4');

  // Persist whenever state changes
  useEffect(() => {
    localStorage.setItem('smart_home_switchboards', JSON.stringify(switchboards));
  }, [switchboards]);

  useEffect(() => {
    localStorage.setItem('smart_home_controllers', JSON.stringify(controllers));
  }, [controllers]);

  useEffect(() => {
    localStorage.setItem('smart_home_safety', JSON.stringify(safety));
  }, [safety]);

  const currentBoard = switchboards.find((b) => b.id === selectedBoardId) || switchboards[0];

  // Save changes & deploy
  const handleDeploy = () => {
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  // Toggle switch live test
  const handleToggleSwitchState = (boardId: string, switchId: string) => {
    setSwitchboards((prev) =>
      prev.map((b) => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          switches: b.switches.map((s) => {
            if (s.id !== switchId) return s;
            return { ...s, state: s.state === 'ON' ? 'OFF' : 'ON' };
          }),
        };
      })
    );
  };

  // Update a single switch parameter
  const handleUpdateSwitch = (
    boardId: string,
    switchId: string,
    field: keyof ConfigSwitch,
    value: any
  ) => {
    setSwitchboards((prev) =>
      prev.map((b) => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          switches: b.switches.map((s) => {
            if (s.id !== switchId) return s;
            return { ...s, [field]: value };
          }),
        };
      })
    );
  };

  // Add new relay channel to current board
  const handleAddChannelToBoard = (boardId: string) => {
    setSwitchboards((prev) =>
      prev.map((b) => {
        if (b.id !== boardId) return b;
        const nextChannelNum = b.switches.length + 1;
        const newSwitch: ConfigSwitch = {
          id: `dev-${Date.now()}-${nextChannelNum}`,
          name: `Relay Channel ${nextChannelNum}`,
          channel: nextChannelNum,
          category: 'LIGHT',
          ratedWatts: 50,
          state: 'OFF',
        };
        return {
          ...b,
          switches: [...b.switches, newSwitch],
        };
      })
    );
  };

  // Remove a channel
  const handleRemoveChannel = (boardId: string, switchId: string) => {
    setSwitchboards((prev) =>
      prev.map((b) => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          switches: b.switches.filter((s) => s.id !== switchId),
        };
      })
    );
  };

  // Create new switchboard
  const handleCreateSwitchboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    const newBoard: ConfigSwitchboard = {
      id: `sb-${Date.now()}`,
      name: newBoardName,
      room: newBoardRoom,
      location: newBoardLocation || `${newBoardRoom} Wall Panel`,
      controllerId: newBoardController,
      maxLoadWatts: parseInt(newBoardMaxWatts, 10) || 3000,
      switches: [
        { id: `dev-${Date.now()}-1`, name: 'Appliance 1', channel: 1, category: 'LIGHT', ratedWatts: 60, state: 'OFF' },
        { id: `dev-${Date.now()}-2`, name: 'Appliance 2', channel: 2, category: 'FAN', ratedWatts: 75, state: 'OFF', speedLevel: 3 },
      ],
    };

    setSwitchboards([...switchboards, newBoard]);
    setSelectedBoardId(newBoard.id);
    setShowAddBoardModal(false);
    setNewBoardName('');
    setNewBoardLocation('');
  };

  // Create new controller
  const handleCreateController = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCtrlId.trim()) return;

    const newCtrl: ConfigController = {
      id: newCtrlId.trim().toUpperCase(),
      model: newCtrlModel,
      ipAddress: newCtrlIp,
      macAddress: newCtrlMac,
      mqttTopic: newCtrlTopic,
      relayCount: parseInt(newCtrlRelays, 10) || 4,
      firmware: 'v2.4.1-ota',
      rssi: -55,
      status: 'ONLINE',
      lastPingMs: 22,
    };

    setControllers([...controllers, newCtrl]);
    setShowAddControllerModal(false);
    setNewCtrlId('');
  };

  // Ping controller simulation
  const handlePingController = (ctrlId: string) => {
    setControllers((prev) =>
      prev.map((c) => {
        if (c.id !== ctrlId) return c;
        const newPing = Math.floor(Math.random() * 15) + 12;
        return { ...c, lastPingMs: newPing, status: 'ONLINE' };
      })
    );
  };

  // Delete switchboard
  const handleDeleteBoard = (boardId: string) => {
    if (switchboards.length <= 1) {
      alert('You must retain at least one configured switchboard.');
      return;
    }
    const filtered = switchboards.filter((b) => b.id !== boardId);
    setSwitchboards(filtered);
    setSelectedBoardId(filtered[0].id);
  };

  // Export JSON configuration
  const configJson = JSON.stringify(
    {
      version: '2.0-cloud',
      lastDeployed: new Date().toISOString(),
      controllers,
      switchboards,
      safetyThresholds: safety,
    },
    null,
    2
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(configJson);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart-home-switchboard-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Smart Switchboard & Device Configurator
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Provision ESP32 controllers, map physical relay channels, set appliance ratings, and calibrate safety interlocks.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddBoardModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Switchboard</span>
          </button>

          <button
            onClick={() => setShowAddControllerModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
          >
            <Radio className="w-3.5 h-3.5 text-blue-500" />
            <span>+ Pair Controller</span>
          </button>

          <button
            onClick={handleDeploy}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Deploy to Fleet</span>
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccessToast && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Configuration deployed! All {switchboards.length} switchboards and {controllers.length} ESP32 controllers synchronized.</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
            MQTT SYNCHRONIZED
          </span>
        </div>
      )}

      {/* 4 Tabs Segmented Control */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('BOARDS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'BOARDS'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Switchboard Builder ({switchboards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CONTROLLERS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'CONTROLLERS'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>ESP32 Hardware Nodes ({controllers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SAFETY')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'SAFETY'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Safety Protection & Interlocks</span>
        </button>

        <button
          onClick={() => setActiveTab('JSON')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'JSON'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>JSON Schema & Sync</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: SWITCHBOARD BUILDER & CHANNEL MAPPER
         ========================================================================= */}
      {activeTab === 'BOARDS' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Switchboard Selection List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Select Switchboard
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                {switchboards.length} Boards Registered
              </span>
            </div>

            <div className="space-y-2">
              {switchboards.map((board) => {
                const isSelected = board.id === selectedBoardId;
                const activeWatts = board.switches
                  .filter((s) => s.state === 'ON')
                  .reduce((sum, s) => sum + s.ratedWatts, 0);

                return (
                  <div
                    key={board.id}
                    onClick={() => setSelectedBoardId(board.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition text-left space-y-1.5 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {board.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {board.room}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{board.switches.length} Relays</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
                        ⚡ {activeWatts} W
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Wifi className="w-2.5 h-2.5 text-emerald-500" />
                      <span>{board.controllerId}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowAddBoardModal(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 transition text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Board</span>
            </button>
          </div>

          {/* Right 3 Columns: Active Switchboard Configuration & Relay Channels */}
          <div className="lg:col-span-3 space-y-5">
            {currentBoard ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                {/* Board Overview & Metadata Edit Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        {currentBoard.name}
                      </h2>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {currentBoard.room}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Mounted at: {currentBoard.location} • Controller:{' '}
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                        {currentBoard.controllerId}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddChannelToBoard(currentBoard.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Relay Channel</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBoard(currentBoard.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                      title="Delete this switchboard"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Board Parameters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Target Room Name
                    </label>
                    <input
                      type="text"
                      value={currentBoard.room}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSwitchboards((prev) =>
                          prev.map((b) => (b.id === currentBoard.id ? { ...b, room: val } : b))
                        );
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Assigned Controller
                    </label>
                    <select
                      value={currentBoard.controllerId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSwitchboards((prev) =>
                          prev.map((b) => (b.id === currentBoard.id ? { ...b, controllerId: val } : b))
                        );
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    >
                      {controllers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.id} ({c.model})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Max Board Load Rating (Watts)
                    </label>
                    <input
                      type="number"
                      value={currentBoard.maxLoadWatts}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 1000;
                        setSwitchboards((prev) =>
                          prev.map((b) => (b.id === currentBoard.id ? { ...b, maxLoadWatts: val } : b))
                        );
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    />
                  </div>
                </div>

                {/* Relay Channels Table / Mapping Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      Physical Relay Channels ({currentBoard.switches.length})
                    </h3>
                    <span className="text-[11px] text-slate-400 italic">
                      Click the live toggle to test actual physical relay actuation
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {currentBoard.switches.map((sw, index) => {
                      const isOn = sw.state === 'ON';
                      return (
                        <div
                          key={sw.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
                        >
                          {/* Channel Badge & Name Input */}
                          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                            <span className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-700 dark:text-slate-200">
                              #{index + 1}
                            </span>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={sw.name}
                                onChange={(e) =>
                                  handleUpdateSwitch(currentBoard.id, sw.id, 'name', e.target.value)
                                }
                                className="w-full font-bold text-xs text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 focus:outline-none py-0.5"
                                placeholder="Appliance name"
                              />
                              <span className="text-[10px] text-slate-400 block font-mono">
                                Relay Channel {sw.channel}
                              </span>
                            </div>
                          </div>

                          {/* Category Selector */}
                          <div className="w-36">
                            <select
                              value={sw.category}
                              onChange={(e) =>
                                handleUpdateSwitch(
                                  currentBoard.id,
                                  sw.id,
                                  'category',
                                  e.target.value as ApplianceCategory
                                )
                              }
                              className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                            >
                              <option value="LIGHT">💡 Light Bulb</option>
                              <option value="FAN">🌀 Ceiling Fan</option>
                              <option value="AC">❄️ Air Conditioner</option>
                              <option value="SOCKET">🔌 Power Socket</option>
                              <option value="HEATER">🔥 Water Geyser</option>
                              <option value="REFRIGERATOR">🧊 Refrigerator</option>
                              <option value="TV">📺 TV / Media</option>
                              <option value="PUMP">💧 Water Pump</option>
                              <option value="APPLIANCE">⚙️ Heavy Appliance</option>
                            </select>
                          </div>

                          {/* Rated Wattage */}
                          <div className="flex items-center gap-1.5 w-28">
                            <input
                              type="number"
                              value={sw.ratedWatts}
                              onChange={(e) =>
                                handleUpdateSwitch(
                                  currentBoard.id,
                                  sw.id,
                                  'ratedWatts',
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              className="w-16 text-xs font-mono font-bold px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            />
                            <span className="text-xs font-semibold text-slate-400">Watts</span>
                          </div>

                          {/* Fan Speed Setting (if fan) */}
                          {sw.category === 'FAN' && (
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((spd) => (
                                <button
                                  key={spd}
                                  onClick={() =>
                                    handleUpdateSwitch(currentBoard.id, sw.id, 'speedLevel', spd)
                                  }
                                  className={`w-5 h-5 rounded text-[10px] font-bold ${
                                    (sw.speedLevel || 3) === spd
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  {spd}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Live Relay Test Button */}
                          <button
                            onClick={() => handleToggleSwitchState(currentBoard.id, sw.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              isOn
                                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                            }`}
                          >
                            <Power className="w-3 h-3" />
                            <span>{isOn ? 'RELAY ON' : 'RELAY OFF'}</span>
                          </button>

                          {/* Remove button */}
                          <button
                            onClick={() => handleRemoveChannel(currentBoard.id, sw.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition"
                            title="Remove channel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                Please select or create a switchboard to configure.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ESP32 IOT HARDWARE CONTROLLERS
         ========================================================================= */}
      {activeTab === 'CONTROLLERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black uppercase text-slate-400 tracking-wider">
                Connected ESP32 Hardware Gateways & Relays
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Microcontroller nodes handling hardware relay actuation, CT current sensing, and temperature monitoring.
              </p>
            </div>
            <button
              onClick={() => setShowAddControllerModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Controller</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {controllers.map((ctrl) => (
              <div
                key={ctrl.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {ctrl.id}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {ctrl.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{ctrl.model}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePingController(ctrl.id)}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono transition"
                  >
                    <RefreshCw className="w-3 h-3 text-blue-500" />
                    <span>{ctrl.lastPingMs} ms</span>
                  </button>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">IP Address</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ctrl.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">MAC Address</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ctrl.macAddress}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">MQTT Base Topic</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 truncate block">
                      {ctrl.mqttTopic}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Signal & Relays</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {ctrl.rssi} dBm • {ctrl.relayCount} Relays
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] text-slate-400">Firmware: {ctrl.firmware}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePingController(ctrl.id)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-500"
                    >
                      Test Heartbeat
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <button
                      onClick={() => alert(`Sent reboot command to ${ctrl.id}`)}
                      className="text-xs font-bold text-rose-500 hover:text-rose-400"
                    >
                      Restart ESP32
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SAFETY THRESHOLDS & PROTECTION INTERLOCKS
         ========================================================================= */}
      {activeTab === 'SAFETY' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-sm font-black uppercase text-slate-400 tracking-wider">
              Autonomous Electrical Protection & Trip Limits
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Calibrate sensor trip parameters for automatic power isolation and emergency alarms across all connected circuits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overvoltage */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Overvoltage Cut-Off
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {safety.overvoltageLimit} V
                </span>
              </div>
              <input
                type="range"
                min="235"
                max="280"
                value={safety.overvoltageLimit}
                onChange={(e) =>
                  setSafety({ ...safety, overvoltageLimit: parseInt(e.target.value, 10) })
                }
                className="w-full accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">
                Immediately trips main relays if mains voltage exceeds this value for &gt; 150ms.
              </p>
            </div>

            {/* Undervoltage */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-500" /> Undervoltage Protection
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {safety.undervoltageLimit} V
                </span>
              </div>
              <input
                type="range"
                min="160"
                max="210"
                value={safety.undervoltageLimit}
                onChange={(e) =>
                  setSafety({ ...safety, undervoltageLimit: parseInt(e.target.value, 10) })
                }
                className="w-full accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">
                Protects compressor induction motors and electronics from brownout burnout.
              </p>
            </div>

            {/* Earth Leakage RCD */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Earth Leakage (RCD)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {safety.earthLeakageTripMa} mA
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={safety.earthLeakageTripMa}
                onChange={(e) =>
                  setSafety({ ...safety, earthLeakageTripMa: parseInt(e.target.value, 10) })
                }
                className="w-full accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">
                IEC 61008 standard 30mA residual current threshold for human shock prevention.
              </p>
            </div>

            {/* Switchboard Overheat */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-rose-500" /> Overheat Cut-off Limit
                </span>
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                  {safety.overheatCutoffCelsius} °C
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="85"
                value={safety.overheatCutoffCelsius}
                onChange={(e) =>
                  setSafety({ ...safety, overheatCutoffCelsius: parseInt(e.target.value, 10) })
                }
                className="w-full accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">
                Shuts down circuits if internal enclosure or busbar temperature exceeds threshold.
              </p>
            </div>

            {/* Branch Current Limit */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-500" /> Branch Overload Limit
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {safety.maxBranchCurrentAmps} A
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="32"
                value={safety.maxBranchCurrentAmps}
                onChange={(e) =>
                  setSafety({ ...safety, maxBranchCurrentAmps: parseInt(e.target.value, 10) })
                }
                className="w-full accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">
                MCB continuous overload protection based on wire gauge rating.
              </p>
            </div>

            {/* Loose Terminal Resistance */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-purple-500" /> Loose Connection Delta
                </span>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  &gt; {safety.looseTerminalResistanceOhms} Ω
                </span>
              </div>
              <input
                type="range"
                step="0.05"
                min="0.2"
                max="1.0"
                value={safety.looseTerminalResistanceOhms}
                onChange={(e) =>
                  setSafety({
                    ...safety,
                    looseTerminalResistanceOhms: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">
                Flags loose screw terminals when contact resistance rise causes excessive I²R heating.
              </p>
            </div>
          </div>

          {/* Master Protection Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Automatic Circuit Breaker Disconnection
                </span>
                <span className="text-[11px] text-slate-400">
                  Automatically isolates affected circuit when critical fault is detected
                </span>
              </div>
              <button
                onClick={() =>
                  setSafety({
                    ...safety,
                    autoPowerCutoffEnabled: !safety.autoPowerCutoffEnabled,
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  safety.autoPowerCutoffEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {safety.autoPowerCutoffEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Audible Emergency Siren Alarm (95 dB)
                </span>
                <span className="text-[11px] text-slate-400">
                  Activates hardware piezo siren during dangerous electrical conditions
                </span>
              </div>
              <button
                onClick={() =>
                  setSafety({
                    ...safety,
                    sirenOnCriticalEnabled: !safety.sirenOnCriticalEnabled,
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  safety.sirenOnCriticalEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {safety.sirenOnCriticalEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: JSON SCHEMA & FLEET SYNC
         ========================================================================= */}
      {activeTab === 'JSON' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase text-slate-400 tracking-wider">
                Compiled IoT Configuration Payload
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                JSON configuration deployed to ESP32 flash memory and MQTT broker subscribers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copySuccess ? 'Copied!' : 'Copy JSON'}</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800 leading-relaxed">
            {configJson}
          </pre>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW SWITCHBOARD
         ========================================================================= */}
      {showAddBoardModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Add New Switchboard
                </h3>
              </div>
              <button
                onClick={() => setShowAddBoardModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSwitchboard} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Switchboard Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guest Bedroom Main Board"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Room *
                </label>
                <select
                  value={newBoardRoom}
                  onChange={(e) => setNewBoardRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Living Room">Living Room</option>
                  <option value="Master Bedroom">Master Bedroom</option>
                  <option value="Guest Bedroom">Guest Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Balcony">Balcony</option>
                  <option value="Corridor">Corridor</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Mount Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Entry Doorway"
                  value={newBoardLocation}
                  onChange={(e) => setNewBoardLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Bind Controller (ESP32)
                </label>
                <select
                  value={newBoardController}
                  onChange={(e) => setNewBoardController(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {controllers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Max Safe Wattage (W)
                </label>
                <input
                  type="number"
                  value={newBoardMaxWatts}
                  onChange={(e) => setNewBoardMaxWatts(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBoardModal(false)}
                  className="px-3.5 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                >
                  Create Switchboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PAIR / REGISTER NEW CONTROLLER
         ========================================================================= */}
      {showAddControllerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Register ESP32 Hardware Controller
                </h3>
              </div>
              <button
                onClick={() => setShowAddControllerModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateController} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Controller ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ESP32_GB_01"
                  value={newCtrlId}
                  onChange={(e) => setNewCtrlId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Hardware Model
                </label>
                <input
                  type="text"
                  value={newCtrlModel}
                  onChange={(e) => setNewCtrlModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    IP Address
                  </label>
                  <input
                    type="text"
                    value={newCtrlIp}
                    onChange={(e) => setNewCtrlIp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    MAC Address
                  </label>
                  <input
                    type="text"
                    value={newCtrlMac}
                    onChange={(e) => setNewCtrlMac(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  MQTT Base Topic
                </label>
                <input
                  type="text"
                  value={newCtrlTopic}
                  onChange={(e) => setNewCtrlTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Relay Channels Count
                </label>
                <select
                  value={newCtrlRelays}
                  onChange={(e) => setNewCtrlRelays(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="2">2 Channels</option>
                  <option value="4">4 Channels</option>
                  <option value="6">6 Channels</option>
                  <option value="8">8 Channels</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddControllerModal(false)}
                  className="px-3.5 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                >
                  Register Controller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
