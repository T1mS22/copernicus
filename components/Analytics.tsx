"use client";

import {
  type BeforeSend,
  Analytics as VercelAnalytics,
} from "@vercel/analytics/next";

// Page views are counted by path only. Query strings and fragments are
// dropped, so nothing that ends up in a URL can reach the analytics data.
const pathOnly: BeforeSend = (event) => {
  const url = new URL(event.url);
  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
};

export default function Analytics() {
  return <VercelAnalytics beforeSend={pathOnly} />;
}
