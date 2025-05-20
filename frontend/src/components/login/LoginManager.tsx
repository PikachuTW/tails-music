import React, { useState, useEffect, useCallback } from 'react';
import LoginCard from './LoginCard';
import ToastDisplay from '../ToastDisplay';
import type { ToastInfo } from '../ToastDisplay';
import { api, getIo } from '../../utils/api';

const LoginManager: React.FC = () => {
  const [currentCode, setCurrentCode] = useState<string>('----');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  // Socket state is not used in this version, but kept for potential future use or direct manipulation.
  // const [socket, setSocket] = useState<Socket | null>(null);

  const showToast = useCallback(
    (
      message: string,
      type:
        | 'alert-success'
        | 'alert-error'
        | 'alert-info'
        | 'alert-warning' = 'alert-success',
    ) => {
      setToast({ message, type, id: Date.now() });
    },
    [],
  );

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleCopyInCard = useCallback(
    (_textToCopy: string, message: string, type?: string) => {
      navigator.clipboard.writeText(_textToCopy);
      showToast(message, type || 'alert-info');
    },
    [showToast],
  );

  useEffect(() => {
    async function fetchLoginCodeAndUpdateDisplay() {
      setIsLoading(true);
      try {
        const response = await api.get('/api/getcode');
        if (response.data.code) {
          setCurrentCode(response.data.code);
        } else {
          throw new Error('Code not found in API response');
        }
      } catch (error) {
        console.error('Failed to fetch login code:', error);
        setCurrentCode('錯誤');
        showToast('無法獲取登入碼，請稍後再試。', 'alert-error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLoginCodeAndUpdateDisplay();

    const newSocket = getIo();

    newSocket.on('connect', () => {
      console.log('WebSocket connected:', newSocket.id);
    });

    newSocket.on('login_success', (data: { code: string }) => {
      if (data.code === currentCode) {
        window.location.reload();
      }
    });

    newSocket.on('disconnect', (reason: string) => {
      console.log('WebSocket disconnected:', reason);
      // Consider if a toast is needed here, might be too noisy if brief
      // showToast("與登入服務的連線已中斷", "alert-warning");
    });

    newSocket.on('connect_error', (error: Error) => {
      console.error('WebSocket connection error:', error);
      showToast('無法連接到即時登入服務。', 'alert-error');
      setCurrentCode('離線');
      setIsLoading(false); // Ensure loading state is false if connection fails
    });

    return () => {
      newSocket.disconnect();
    };
  }, [showToast]);

  return (
    <>
      <LoginCard
        code={currentCode}
        isLoading={isLoading}
        onCopy={handleCopyInCard}
      />
      <ToastDisplay toast={toast} onDismiss={dismissToast} />
    </>
  );
};

export default LoginManager;
