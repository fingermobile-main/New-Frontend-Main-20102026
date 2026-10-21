import { useState, useEffect, useCallback } from 'react';
import autoReplyService, { AutoReplyExecutionLog } from '../../../services/autoReplyService';
import { AutoReplySettings, QuickReplyItem } from '../../gems/types';

export { GemAutoReplyModal as AutoReplyModal } from '../../gems/GemAutoReplyModal';
export { GemAutoReplyManager as AutoReplyConfigManager } from '../../gems/GemAutoReplyManager';
export { QuickReplyPicker } from './QuickReplyPicker';
export { default as autoReplyService } from '../../../services/autoReplyService';

/**
 * Universal useAutoReply hook for any screen/feature in FingerMobile Protocol
 */
export function useAutoReply() {
  const [settings, setSettings] = useState<AutoReplySettings>(() => autoReplyService.getSettings());
  const [logs, setLogs] = useState<AutoReplyExecutionLog[]>(() => autoReplyService.getExecutionLogs());

  useEffect(() => {
    setSettings(autoReplyService.getSettings());
    setLogs(autoReplyService.getExecutionLogs());
  }, []);

  const updateSettings = useCallback((newSettings: AutoReplySettings) => {
    autoReplyService.saveSettings(newSettings);
    setSettings(newSettings);
  }, []);

  const evaluateMessage = useCallback(
    (message: string, recipientName: string = 'Client', options = {}) => {
      return autoReplyService.evaluateAutoReply(message, recipientName, options);
    },
    []
  );

  const dispatchAutoReply = useCallback(
    (params: {
      recipientId?: string | number;
      recipientName: string;
      sourceContext: 'gems_broadcast' | 'direct_chat' | 'forum' | 'event_inquiry' | 'general';
      triggerType: 'greeting' | 'away' | 'quick_reply' | 'event_management';
      shortcutUsed?: string;
      subject?: string;
      renderedText: string;
    }) => {
      autoReplyService.recordExecution(params);
      setLogs(autoReplyService.getExecutionLogs());
      return { success: true, log: params };
    },
    []
  );

  return {
    settings,
    logs,
    updateSettings,
    evaluateMessage,
    dispatchAutoReply,
    quickReplies: settings.quickReplies,
    interpolate: autoReplyService.interpolateVariables.bind(autoReplyService)
  };
}
