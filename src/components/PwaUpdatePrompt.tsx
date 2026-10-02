import React, { useState, useEffect, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import './PwaUpdatePrompt.css';

export const PwaUpdatePrompt: React.FC = () => {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | undefined>();
  const [dismissed, setDismissed] = useState(false);
  const [remoteVersion, setRemoteVersion] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const isReloadingRef = useRef(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swUrl, r) {
      if (r) {
        setSwRegistration(r);
        
        // Initial background check
        setTimeout(() => {
          r.update().catch(() => {});
        }, 1500);

        // Check for updates when user returns to app/tab (critical for iOS Safari PWA)
        const checkUpdate = () => {
          if (document.visibilityState === 'visible') {
            r.update().catch(() => {});
          }
        };

        document.addEventListener('visibilitychange', checkUpdate);
        window.addEventListener('focus', checkUpdate);

        // Polling check every 15 minutes
        const intervalId = setInterval(checkUpdate, 15 * 60 * 1000);

        return () => {
          document.removeEventListener('visibilitychange', checkUpdate);
          window.removeEventListener('focus', checkUpdate);
          clearInterval(intervalId);
        };
      }
    },
    onRegisterError(error) {
      console.debug('PWA registration note:', error);
    },
  });

  // Auto-reload once when a new service worker takes control
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const onControllerChange = () => {
      if (!isReloadingRef.current) {
        isReloadingRef.current = true;
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  // Periodic version.json comparison to guarantee detection even with frozen SWs
  useEffect(() => {
    const checkVersionJson = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const serverVer = data?.version;
          if (serverVer && typeof __APP_VERSION__ !== 'undefined' && serverVer !== __APP_VERSION__) {
            setRemoteVersion(serverVer);
            if (swRegistration) {
              swRegistration.update().catch(() => {});
            }
          }
        }
      } catch {
        // Offline or network error, silently ignore
      }
    };

    checkVersionJson();
    const interval = setInterval(checkVersionJson, 10 * 60 * 1000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkVersionJson();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [swRegistration]);

  const handleApplyUpdate = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      // 1. Tell waiting service worker to skip waiting and take control
      await updateServiceWorker(true);

      // 2. Clear old caches to ensure fresh assets load
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
      }
    } catch (e) {
      console.warn('Update trigger note:', e);
    } finally {
      // 3. Fallback reload
      setTimeout(() => {
        window.location.reload();
      }, 350);
    }
  };

  const isUpdateAvailable = (needRefresh || Boolean(remoteVersion)) && !dismissed;

  if (!isUpdateAvailable) return null;

  return (
    <div className="pwa-update-banner" role="alert" aria-live="assertive">
      <div className="pwa-update-icon-wrap">
        <Sparkles size={16} />
      </div>

      <div className="pwa-update-text">
        <span className="pwa-update-title">
          Update available{remoteVersion ? `: v${remoteVersion}` : ''}
        </span>
        <span className="pwa-update-desc">
          Tap update to get the latest features & fixes.
        </span>
      </div>

      <div className="pwa-update-actions">
        <button 
          className="pwa-update-btn" 
          onClick={handleApplyUpdate}
          disabled={isUpdating}
          aria-label="Update app now"
        >
          <RefreshCw size={12} className={isUpdating ? 'animate-spin' : ''} />
          {isUpdating ? 'Updating...' : 'Update'}
        </button>

        <button 
          className="pwa-dismiss-btn" 
          onClick={() => {
            setDismissed(true);
            setNeedRefresh(false);
          }}
          aria-label="Dismiss update notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
