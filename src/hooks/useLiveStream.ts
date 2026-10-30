import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../api/client';
import { LiveAnomalyEvent } from '../types';
import { useAppStore } from '../store/useAppStore';

export interface LiveStreamPoint {
  timestamp: string;
  [metric: string]: number | string;
}

export function useLiveStream(_initialSystemId?: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastAnomaly, setLastAnomaly] = useState<LiveAnomalyEvent | null>(null);
  const [streamPoints, setStreamPoints] = useState<LiveStreamPoint[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [bufferSize, setBufferSize] = useState<number>(0);
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addLiveAlert = useAppStore((state) => state.addLiveAlert);

  useEffect(() => {
    // Connect to /live namespace on the backend
    const socket = io(`${API_BASE_URL}/live`, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
    });

    socket.on('anomaly', (event: LiveAnomalyEvent) => {
      setLastAnomaly(event);
      addLiveAlert(event);
    });

    socket.on('metrics:ack', (ack: { systemId: string; timestamp: string; bufferSize: number }) => {
      setBufferSize(ack.bufferSize);
    });

    return () => {
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
      }
      socket.disconnect();
    };
  }, [addLiveAlert]);

  const emitMetric = useCallback(
    (payload: { systemId: string; timestamp?: string; values: Record<string, number> }) => {
      const ts = payload.timestamp || new Date().toLocaleTimeString();
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('metrics:stream', {
          ...payload,
          timestamp: ts,
        });
      }

      // Also append to local streamPoints window for visualization
      setStreamPoints((prev) => {
        const point: LiveStreamPoint = {
          timestamp: ts,
          ...payload.values,
        };
        const next = [...prev, point];
        return next.length > 40 ? next.slice(next.length - 40) : next;
      });
    },
    [],
  );

  const startSimulation = useCallback(
    (targetSystemId: string, intervalMs = 1500) => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
      setIsSimulating(true);

      let step = 0;
      simTimerRef.current = setInterval(() => {
        step++;
        // Generate pseudo-sensor telemetry with occasional synthetic spikes
        const injectSpike = step % 14 === 0;
        const temp = +(72 + Math.sin(step / 3) * 4 + (injectSpike ? 28 : Math.random() * 2)).toFixed(2);
        const vibration = +(0.15 + Math.cos(step / 4) * 0.05 + (injectSpike ? 0.95 : Math.random() * 0.03)).toFixed(3);
        const pressure = +(101.3 + Math.sin(step / 2) * 1.5 + (injectSpike ? 15 : Math.random() * 0.8)).toFixed(2);
        const rpm = +(1800 + Math.sin(step / 5) * 40 + (injectSpike ? 350 : (Math.random() - 0.5) * 20)).toFixed(1);

        emitMetric({
          systemId: targetSystemId,
          timestamp: new Date().toLocaleTimeString(),
          values: {
            temperature: temp,
            vibration: vibration,
            pressure: pressure,
            rpm: rpm,
          },
        });
      }, intervalMs);
    },
    [emitMetric],
  );

  const stopSimulation = useCallback(() => {
    if (simTimerRef.current) {
      clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
    setIsSimulating(false);
  }, []);

  return {
    isConnected,
    lastAnomaly,
    streamPoints,
    bufferSize,
    isSimulating,
    emitMetric,
    startSimulation,
    stopSimulation,
  };
}
