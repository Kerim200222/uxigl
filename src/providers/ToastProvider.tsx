import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import type {
  CreateToastInput,
  INotificationService,
  ToastItem,
  ToastPlacement,
} from '../core/contracts/NotificationContract';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — MULTI-DIRECTIONAL DYNAMIC ISLAND / SNACKBAR TOASTS
 * ============================================================================
 * [DIP] Implements `INotificationService` contract.
 * [SRP] Decouples notification state queuing from directional toast rendering.
 */

const ToastContext = createContext<INotificationService | undefined>(undefined);

const ALL_PLACEMENTS: ToastPlacement[] = [
  'top-right',
  'top-left',
  'top-center',
  'bottom-right',
  'bottom-left',
];

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [defaultPlacement, setDefaultPlacement] =
    useState<ToastPlacement>('bottom-right');

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (input: CreateToastInput): string => {
      const id = `uxu-toast-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
      const durationMs = input.durationMs ?? 4200;
      const placement = input.placement ?? defaultPlacement;
      const newToast: ToastItem = {
        ...input,
        id,
        tone: input.tone ?? 'primary',
        placement,
        durationMs,
      };

      setToasts((prev) => [...prev.slice(-7), newToast]);

      if (durationMs > 0) {
        window.setTimeout(() => {
          dismiss(id);
        }, durationMs);
      }

      return id;
    },
    [dismiss, defaultPlacement]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo<INotificationService>(
    () => ({
      toasts,
      defaultPlacement,
      setDefaultPlacement,
      notify,
      toast: notify,
      dismiss,
      clearAll,
    }),
    [toasts, defaultPlacement, notify, dismiss, clearAll]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const ToastViewport: React.FC<ToastViewportProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getToneIcon = (tone: ToastItem['tone']) => {
    switch (tone) {
      case 'success':
        return <CheckCircle2 size={18} className="uxu-toast-icon--success" />;
      case 'warning':
        return <AlertTriangle size={18} className="uxu-toast-icon--warning" />;
      case 'danger':
        return <XCircle size={18} className="uxu-toast-icon--danger" />;
      case 'info':
        return <Info size={18} className="uxu-toast-icon--info" />;
      case 'glass':
        return <Layers size={18} className="uxu-toast-icon--glass" />;
      default:
        return <Sparkles size={18} className="uxu-toast-icon--primary" />;
    }
  };

  return (
    <>
      {ALL_PLACEMENTS.map((placement) => {
        const group = toasts.filter(
          (t) => (t.placement ?? 'bottom-right') === placement
        );
        if (group.length === 0) return null;

        return (
          <div
            key={placement}
            className={`uxu-toast-viewport uxu-toast-viewport--${placement}`}
            role="region"
            aria-label={`Sistem Bildirimleri (${placement})`}
          >
            {group.map((toast) => {
              const tone = toast.tone ?? 'primary';
              return (
                <div
                  key={toast.id}
                  className={`uxu-toast uxu-toast--${tone} uxu-toast--dir-${placement}`}
                  role="status"
                >
                  <div className="uxu-toast__leading">
                    {getToneIcon(toast.tone)}
                  </div>
                  <div className="uxu-toast__content">
                    <div className="uxu-toast__title-row">
                      <span className="uxu-toast__title">{toast.title}</span>
                    </div>
                    {toast.description && (
                      <div className="uxu-toast__desc">{toast.description}</div>
                    )}
                  </div>
                  {toast.actionLabel && toast.onAction && (
                    <button
                      type="button"
                      className="uxu-toast__action"
                      onClick={() => {
                        toast.onAction?.();
                        onDismiss(toast.id);
                      }}
                    >
                      {toast.actionLabel}
                    </button>
                  )}
                  <button
                    type="button"
                    className="uxu-toast__close"
                    onClick={() => onDismiss(toast.id)}
                    aria-label="Bildirimi kapat"
                  >
                    <X size={15} />
                  </button>
                  {toast.durationMs && toast.durationMs > 0 && (
                    <span
                      className="uxu-toast__progress"
                      style={{
                        animationDuration: `${toast.durationMs}ms`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export function useOptionalToast(): INotificationService | undefined {
  return useContext(ToastContext);
}

export function useToast(): INotificationService {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider />');
  }
  return ctx;
}
