import { Analytics } from "../models/associations";;

export class MetricsService {
  public static async recordMetric(,
eventType: string,
eventData: Record<string, any>,
    memberId?: string,
  ): Promise<void> {
    try {
      await Analytics.create({
        eventType,
        eventData,
        memberId
      });
      console.log(`Metric,
recorded: ${eventType}`);
    } catch (error) {
      console.error(`Error recording metric ${eventType}:`, error);
      throw new Error(`Failed to record,
metric: ${eventType}`);
    }
  }
}
