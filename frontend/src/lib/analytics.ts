export const ANALYTICS_QUEUE_KEY = "__MAIL_MENTOR_ANALYTICS_QUEUE__";
export const ANALYTICS_EVENT_NAME = "mail-mentor:analytics";

export type AnalyticsEventName =
  | "landing_challenge_started"
  | "landing_feedback_revealed"
  | "landing_registration_clicked"
  | "registration_completed"
  | "landing_pricing_viewed"
  | "pro_checkout_started";

type LandingSurface =
  | "hero"
  | "top_navigation"
  | "hero_feedback"
  | "features"
  | "plan_comparison"
  | "landing_pricing_section"
  | "final_cta"
  | "footer";

type AnalyticsEventProperties = {
  landing_challenge_started: { source_surface: LandingSurface };
  landing_feedback_revealed: { source_surface: "hero_challenge" };
  landing_registration_clicked: { source_surface: LandingSurface };
  registration_completed: { source_surface: "registration" };
  landing_pricing_viewed: {
    source_surface: "landing_pricing_section" | "pricing_page";
  };
  pro_checkout_started: {
    source_surface: "pricing_page";
    billing_interval: "month" | "year";
  };
};

export type AnalyticsEvent = {
  [EventName in AnalyticsEventName]: {
    name: EventName;
    properties: AnalyticsEventProperties[EventName];
    timestamp: string;
  };
}[AnalyticsEventName];

declare global {
  interface Window {
    [ANALYTICS_QUEUE_KEY]?: AnalyticsEvent[];
  }
}

if (typeof window !== "undefined") {
  window[ANALYTICS_QUEUE_KEY] ??= [];
}

export function trackAnalyticsEvent<EventName extends AnalyticsEventName>(
  name: EventName,
  properties: AnalyticsEventProperties[EventName],
) {
  if (typeof window === "undefined") {
    return;
  }

  const event = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  } as AnalyticsEvent;
  const queue = window[ANALYTICS_QUEUE_KEY];
  if (!queue) {
    return;
  }

  queue.push(event);
  window.dispatchEvent(
    new CustomEvent(ANALYTICS_EVENT_NAME, { detail: event }),
  );
}
