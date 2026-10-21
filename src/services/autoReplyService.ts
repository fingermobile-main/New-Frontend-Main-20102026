import {
  AutoReplySettings,
  QuickReplyItem,
  GreetingMessageConfig,
  AwayMessageConfig,
  EventAutoReplySuiteConfig
} from '../components/gems/types';
import { DEFAULT_AUTO_REPLY_SETTINGS } from '../components/gems/defaultAutoReplyData';

export interface AutoReplyExecutionLog {
  id: string;
  timestamp: string;
  recipientId?: string | number;
  recipientName: string;
  sourceContext: 'gems_broadcast' | 'direct_chat' | 'forum' | 'event_inquiry' | 'general';
  triggerType: 'greeting' | 'away' | 'quick_reply' | 'event_management';
  shortcutUsed?: string;
  subject?: string;
  renderedText: string;
}

class AutoReplyService {
  private storageKey = 'fingermobile_autoreply_settings';
  private logsKey = 'fingermobile_autoreply_logs';
  private settings: AutoReplySettings = DEFAULT_AUTO_REPLY_SETTINGS;
  private logs: AutoReplyExecutionLog[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.settings = { ...DEFAULT_AUTO_REPLY_SETTINGS, ...JSON.parse(saved) };
      }
      const savedLogs = localStorage.getItem(this.logsKey);
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (e) {
      console.warn('Failed to load auto-reply settings from storage', e);
    }
  }

  public getSettings(): AutoReplySettings {
    this.loadFromStorage();
    return this.settings;
  }

  public saveSettings(newSettings: AutoReplySettings): void {
    this.settings = newSettings;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(newSettings));
      } catch (e) {
        console.warn('Failed to save auto-reply settings to storage', e);
      }
    }
  }

  public interpolateVariables(
    template: string,
    vars: {
      recipientName?: string;
      businessName?: string;
      phone?: string;
      emergencyName?: string;
      portfolioUrl?: string;
      faqUrl?: string;
      bookingUrl?: string;
      email?: string;
      workingHours?: string;
      daysActive?: string;
      date?: string;
      time?: string;
    } = {}
  ): string {
    const s = this.settings;
    const business = vars.businessName || s.eventManagement.agencyName || 'FingerMobile Protocol™';
    const emergencyPhone = vars.phone || s.eventManagement.emergencyPhone;
    const emergencyContact = vars.emergencyName || s.eventManagement.emergencyContactName;
    const portfolio = vars.portfolioUrl || s.eventManagement.portfolioUrl;
    const faq = vars.faqUrl || s.eventManagement.faqPricingUrl;
    const booking = vars.bookingUrl || s.eventManagement.bookingCalendarUrl;
    const email = vars.email || s.away.emergencyEmail;
    const hours = vars.workingHours || s.away.workingHours;
    const days = vars.daysActive || s.away.daysActive;

    return template
      .replace(/\[First Name\]/g, vars.recipientName || 'Valued Member')
      .replace(/\[Business Name\]/g, business)
      .replace(/\[Event Agency Name\]/g, business)
      .replace(/\[Phone Number\]/g, emergencyPhone)
      .replace(/\[Name\]/g, emergencyContact)
      .replace(/\[Link to Portfolio\/Services\]/g, portfolio)
      .replace(/\[Link to FAQ \/ Pricing Guide\]/g, faq)
      .replace(/\[Booking Link\]/g, booking)
      .replace(/\[Email Address\]/g, email)
      .replace(/\[X am\]/g, '9:00 AM')
      .replace(/\[X pm\]/g, '6:00 PM')
      .replace(/\[Monday–Saturday\]/g, days)
      .replace(/\[Start Date\]/g, s.away.holidayStartDate || 'Dec 24')
      .replace(/\[End Date\]/g, s.away.holidayEndDate || 'Jan 2')
      .replace(/\[Date\]/g, vars.date || 'Monday')
      .replace(/\[Address\]/g, 'Victoria Island Innovation District, Lagos')
      .replace(/\[Days\]/g, days)
      .replace(/\[Opening Time\]/g, '9:00 AM')
      .replace(/\[Closing Time\]/g, '7:00 PM')
      .replace(/\[Time, e\.g\., 9:00 AM tomorrow\]/g, vars.time || '9:00 AM tomorrow')
      .replace(/\[Link\]/g, portfolio);
  }

  /**
   * Determine matching auto-reply response for an incoming inquiry or message
   */
  public evaluateAutoReply(
    incomingMessage: string,
    recipientName: string = 'Client',
    options: {
      isFirstTimeContact?: boolean;
      daysSinceLastActivity?: number;
      isOutsideBusinessHours?: boolean;
    } = {}
  ): {
    matched: boolean;
    type: 'greeting' | 'away' | 'quick_reply' | 'event_management';
    subject?: string;
    text: string;
    shortcut?: string;
  } {
    const s = this.settings;
    const lower = incomingMessage.toLowerCase().trim();

    // 1. Check quick replies shortcuts (e.g. /pricing, /hours, /portfolio)
    const matchedQuickReply = s.quickReplies.find(
      (qr) => lower === qr.shortcut.toLowerCase() || lower.startsWith(`${qr.shortcut.toLowerCase()} `)
    );
    if (matchedQuickReply) {
      return {
        matched: true,
        type: 'quick_reply',
        subject: `Quick Reply: ${matchedQuickReply.title}`,
        text: this.interpolateVariables(matchedQuickReply.content, { recipientName }),
        shortcut: matchedQuickReply.shortcut
      };
    }

    // 2. Check Event Management keywords
    if (
      s.eventManagement.enabled &&
      (lower.includes('event') || lower.includes('inquiry') || lower.includes('quote') || lower.includes('booking'))
    ) {
      return {
        matched: true,
        type: 'event_management',
        subject: this.interpolateVariables(s.eventManagement.generalInquirySubject, { recipientName }),
        text: this.interpolateVariables(s.eventManagement.generalInquiryText, { recipientName })
      };
    }

    // 3. Away Message check (outside business hours or offline)
    if (s.away.enabled && options.isOutsideBusinessHours) {
      return {
        matched: true,
        type: 'away',
        subject: 'After-Hours Notice',
        text: this.interpolateVariables(
          s.away.selectedPreset === 'holiday' ? s.away.holidayText : s.away.afterHoursText,
          { recipientName }
        )
      };
    }

    // 4. Greeting Message check (first time contact or >14 days of no activity)
    if (
      s.greeting.enabled &&
      (options.isFirstTimeContact || (options.daysSinceLastActivity && options.daysSinceLastActivity >= s.greeting.inactivityDays))
    ) {
      return {
        matched: true,
        type: 'greeting',
        subject: `Welcome to ${s.eventManagement.agencyName}`,
        text: this.interpolateVariables(
          s.greeting.selectedPreset === 'booking' ? s.greeting.bookingText : s.greeting.standardText,
          { recipientName }
        )
      };
    }

    // Default fallback to standard welcome
    return {
      matched: true,
      type: 'greeting',
      subject: `Welcome to ${s.eventManagement.agencyName}`,
      text: this.interpolateVariables(s.greeting.standardText, { recipientName })
    };
  }

  public recordExecution(log: Omit<AutoReplyExecutionLog, 'id' | 'timestamp'>): void {
    const newLog: AutoReplyExecutionLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.logs.unshift(newLog);
    if (this.logs.length > 100) this.logs = this.logs.slice(0, 100);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.logsKey, JSON.stringify(this.logs));
      } catch (e) {
        // non-fatal
      }
    }
  }

  public getExecutionLogs(): AutoReplyExecutionLog[] {
    this.loadFromStorage();
    return this.logs;
  }
}

export const autoReplyService = new AutoReplyService();
export default autoReplyService;
