import { AZURE_REGIONS, type AzureRegion } from "./data/azure-regions.ts";
import { AZURE_ROLES, type AzureRole } from "./data/azure-roles.ts";

// Microsoft Learn pages the reference data and rules come from.
export const MICROSOFT_DOCS = {
  roles:
    "https://learn.microsoft.com/azure/role-based-access-control/built-in-roles",
  regions: "https://learn.microsoft.com/azure/reliability/regions-list",
  vnetFaq:
    "https://learn.microsoft.com/azure/virtual-network/virtual-networks-faq",
  gatewaySubnet:
    "https://learn.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings",
  bastionSubnet:
    "https://learn.microsoft.com/azure/bastion/configuration-settings",
  firewallSubnet: "https://learn.microsoft.com/azure/firewall/firewall-faq",
  routeServerSubnet:
    "https://learn.microsoft.com/azure/route-server/route-server-faq",
  appGatewaySubnet:
    "https://learn.microsoft.com/azure/application-gateway/configuration-infrastructure",
} as const;

export function roleDocsUrl(role: AzureRole): string {
  return `${MICROSOFT_DOCS.roles}#${role.anchor}`;
}

export const ROLE_CATEGORIES = [
  ...new Set(AZURE_ROLES.map((role) => role.category)),
];

export function searchRoles(
  query: string,
  category: string | null,
): AzureRole[] {
  const q = query.trim().toLowerCase();
  return AZURE_ROLES.filter((role) => {
    if (category && role.category !== category) return false;
    if (!q) return true;
    if (/^[0-9a-f-]{8,}$/.test(q)) return role.id.startsWith(q);
    const text =
      `${role.name} ${role.description} ${role.category}`.toLowerCase();
    return q.split(/\s+/).every((term) => text.includes(term));
  });
}

export const GEOGRAPHIES = [
  ...new Set(AZURE_REGIONS.map((region) => region.geography)),
].sort();

export function searchRegions(
  query: string,
  onlyWithZones: boolean,
): AzureRegion[] {
  const q = query.trim().toLowerCase();
  return AZURE_REGIONS.filter((region) => {
    if (onlyWithZones && region.zones === 0) return false;
    if (!q) return true;
    const text =
      `${region.name} ${region.id} ${region.location} ${region.geography} ${region.paired ?? ""}`.toLowerCase();
    return q.split(/\s+/).every((term) => text.includes(term));
  });
}

export function regionByName(name: string): AzureRegion | undefined {
  return AZURE_REGIONS.find((region) => region.name === name);
}
