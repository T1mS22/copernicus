export type PortCategory =
  | "Web"
  | "Remote access"
  | "Mail"
  | "Databases"
  | "Directory and auth"
  | "File sharing"
  | "Infrastructure"
  | "Messaging"
  | "VPN"
  | "Containers"
  | "Monitoring";

export type PortEntry = {
  port: string;
  protocol: "TCP" | "UDP" | "TCP/UDP";
  service: string;
  category: PortCategory;
  description: string;
  notes?: string;
  // Should never be reachable from the internet.
  internalOnly?: boolean;
  // Plain-text protocol with a secure replacement.
  insecure?: boolean;
};

export const PORT_CATEGORIES: PortCategory[] = [
  "Web",
  "Remote access",
  "Mail",
  "Databases",
  "Directory and auth",
  "File sharing",
  "Infrastructure",
  "Messaging",
  "VPN",
  "Containers",
  "Monitoring",
];

export const PORTS: PortEntry[] = [
  {
    port: "20, 21",
    protocol: "TCP",
    service: "FTP",
    category: "File sharing",
    description:
      "File Transfer Protocol: 21 for control, 20 for data in active mode.",
    notes: "Credentials travel in plain text. Use SFTP (22) or FTPS instead.",
    insecure: true,
  },
  {
    port: "22",
    protocol: "TCP",
    service: "SSH / SFTP / SCP",
    category: "Remote access",
    description: "Encrypted remote shell and file transfer.",
    notes:
      "Use keys instead of passwords. On Azure, reach VMs through Bastion or just-in-time access rather than opening 22 publicly.",
  },
  {
    port: "23",
    protocol: "TCP",
    service: "Telnet",
    category: "Remote access",
    description: "Unencrypted remote shell.",
    notes: "Replace with SSH. Still found on old network gear.",
    insecure: true,
    internalOnly: true,
  },
  {
    port: "25",
    protocol: "TCP",
    service: "SMTP",
    category: "Mail",
    description: "Mail transfer between servers.",
    notes:
      "Azure blocks outbound 25 from most subscription types; send through a relay or service on 587.",
  },
  {
    port: "53",
    protocol: "TCP/UDP",
    service: "DNS",
    category: "Infrastructure",
    description:
      "Name resolution. UDP for normal queries, TCP for large responses and zone transfers.",
    notes: "Azure's internal resolver is 168.63.129.16.",
  },
  {
    port: "67, 68",
    protocol: "UDP",
    service: "DHCP",
    category: "Infrastructure",
    description: "Automatic IP configuration: 67 server, 68 client.",
  },
  {
    port: "69",
    protocol: "UDP",
    service: "TFTP",
    category: "File sharing",
    description:
      "Trivial file transfer, used for network boot (PXE) and device firmware.",
    insecure: true,
    internalOnly: true,
  },
  {
    port: "80",
    protocol: "TCP",
    service: "HTTP",
    category: "Web",
    description: "Unencrypted web traffic.",
    notes:
      "Only use it to redirect to HTTPS (and for ACME HTTP-01 certificate challenges).",
    insecure: true,
  },
  {
    port: "88",
    protocol: "TCP/UDP",
    service: "Kerberos",
    category: "Directory and auth",
    description: "Authentication in Active Directory domains.",
    internalOnly: true,
  },
  {
    port: "110",
    protocol: "TCP",
    service: "POP3",
    category: "Mail",
    description: "Mail retrieval, unencrypted.",
    notes: "Use POP3S (995).",
    insecure: true,
  },
  {
    port: "123",
    protocol: "UDP",
    service: "NTP",
    category: "Infrastructure",
    description:
      "Time synchronization. Kerberos and TLS break when clocks drift.",
  },
  {
    port: "135",
    protocol: "TCP",
    service: "MS-RPC endpoint mapper",
    category: "Infrastructure",
    description:
      "Windows RPC and DCOM; services then use dynamic ports 49152–65535.",
    internalOnly: true,
  },
  {
    port: "137–139",
    protocol: "TCP/UDP",
    service: "NetBIOS",
    category: "File sharing",
    description: "Legacy Windows name service and file sharing.",
    internalOnly: true,
    insecure: true,
  },
  {
    port: "143",
    protocol: "TCP",
    service: "IMAP",
    category: "Mail",
    description: "Mail access, unencrypted.",
    notes: "Use IMAPS (993).",
    insecure: true,
  },
  {
    port: "161, 162",
    protocol: "UDP",
    service: "SNMP",
    category: "Monitoring",
    description: "Network device monitoring: 161 queries, 162 traps.",
    notes: "v1/v2c send the community string in plain text; use SNMPv3.",
    internalOnly: true,
  },
  {
    port: "179",
    protocol: "TCP",
    service: "BGP",
    category: "Infrastructure",
    description:
      "Routing between networks; also used by Azure VPN Gateway and ExpressRoute.",
  },
  {
    port: "389",
    protocol: "TCP/UDP",
    service: "LDAP",
    category: "Directory and auth",
    description: "Directory queries (Active Directory).",
    notes: "Prefer LDAPS (636) or LDAP signing and channel binding.",
    internalOnly: true,
  },
  {
    port: "443",
    protocol: "TCP/UDP",
    service: "HTTPS",
    category: "Web",
    description: "Encrypted web traffic. UDP 443 is HTTP/3 (QUIC).",
    notes:
      "Also used by most Azure management, Azure Arc and VPN (SSTP) traffic.",
  },
  {
    port: "445",
    protocol: "TCP",
    service: "SMB",
    category: "File sharing",
    description: "Windows file sharing; also Azure Files.",
    notes:
      "Never expose it to the internet (WannaCry). Many ISPs block it, which is why Azure Files over SMB often fails from home.",
    internalOnly: true,
  },
  {
    port: "465",
    protocol: "TCP",
    service: "SMTPS",
    category: "Mail",
    description: "Mail submission with implicit TLS.",
  },
  {
    port: "500",
    protocol: "UDP",
    service: "IKE",
    category: "VPN",
    description: "IPsec key exchange for site-to-site and many client VPNs.",
  },
  {
    port: "514",
    protocol: "UDP",
    service: "Syslog",
    category: "Monitoring",
    description: "Log forwarding.",
    notes: "Unencrypted; use TCP 6514 with TLS where possible.",
    insecure: true,
  },
  {
    port: "587",
    protocol: "TCP",
    service: "SMTP submission",
    category: "Mail",
    description:
      "Mail submission from clients and apps, with STARTTLS and authentication.",
  },
  {
    port: "636",
    protocol: "TCP",
    service: "LDAPS",
    category: "Directory and auth",
    description: "LDAP over TLS.",
    internalOnly: true,
  },
  {
    port: "853",
    protocol: "TCP",
    service: "DNS over TLS",
    category: "Infrastructure",
    description: "Encrypted DNS (DoT).",
  },
  {
    port: "989, 990",
    protocol: "TCP",
    service: "FTPS",
    category: "File sharing",
    description: "FTP with implicit TLS.",
  },
  {
    port: "993",
    protocol: "TCP",
    service: "IMAPS",
    category: "Mail",
    description: "IMAP over TLS.",
  },
  {
    port: "995",
    protocol: "TCP",
    service: "POP3S",
    category: "Mail",
    description: "POP3 over TLS.",
  },
  {
    port: "1080",
    protocol: "TCP",
    service: "SOCKS proxy",
    category: "Infrastructure",
    description: "Generic proxy protocol.",
  },
  {
    port: "1194",
    protocol: "UDP",
    service: "OpenVPN",
    category: "VPN",
    description:
      "OpenVPN default; also used by Azure point-to-site VPN in OpenVPN mode (TCP 443 there).",
  },
  {
    port: "1433",
    protocol: "TCP",
    service: "SQL Server",
    category: "Databases",
    description: "Microsoft SQL Server and Azure SQL Database.",
    notes:
      "Azure SQL's Redirect connection policy also needs 11000–11999 from inside Azure. Restrict with firewall rules or private endpoints.",
    internalOnly: true,
  },
  {
    port: "1434",
    protocol: "UDP",
    service: "SQL Server Browser",
    category: "Databases",
    description: "Finds named SQL Server instances.",
    internalOnly: true,
  },
  {
    port: "1521",
    protocol: "TCP",
    service: "Oracle",
    category: "Databases",
    description: "Oracle database listener.",
    internalOnly: true,
  },
  {
    port: "1701",
    protocol: "UDP",
    service: "L2TP",
    category: "VPN",
    description: "Layer 2 tunnelling, usually with IPsec.",
  },
  {
    port: "1812, 1813",
    protocol: "UDP",
    service: "RADIUS",
    category: "Directory and auth",
    description:
      "Network authentication (Wi-Fi 802.1X, VPN): 1812 auth, 1813 accounting.",
    internalOnly: true,
  },
  {
    port: "1883",
    protocol: "TCP",
    service: "MQTT",
    category: "Messaging",
    description: "IoT messaging, unencrypted.",
    notes: "Use 8883 (MQTT over TLS).",
    insecure: true,
  },
  {
    port: "2049",
    protocol: "TCP",
    service: "NFS",
    category: "File sharing",
    description: "Network file system; Azure Files NFS and Azure NetApp Files.",
    internalOnly: true,
  },
  {
    port: "2375, 2376",
    protocol: "TCP",
    service: "Docker API",
    category: "Containers",
    description: "Docker daemon remote API: 2375 plain, 2376 TLS.",
    notes: "An exposed 2375 gives anyone root on the host.",
    internalOnly: true,
  },
  {
    port: "2379, 2380",
    protocol: "TCP",
    service: "etcd",
    category: "Containers",
    description: "Kubernetes cluster state: 2379 clients, 2380 peers.",
    internalOnly: true,
  },
  {
    port: "3268, 3269",
    protocol: "TCP",
    service: "AD Global Catalog",
    category: "Directory and auth",
    description: "Forest-wide directory search: 3268 LDAP, 3269 LDAPS.",
    internalOnly: true,
  },
  {
    port: "3306",
    protocol: "TCP",
    service: "MySQL / MariaDB",
    category: "Databases",
    description: "MySQL and Azure Database for MySQL.",
    internalOnly: true,
  },
  {
    port: "3389",
    protocol: "TCP/UDP",
    service: "RDP",
    category: "Remote access",
    description: "Windows Remote Desktop.",
    notes:
      "One of the most attacked ports. Use Azure Bastion, a VPN or just-in-time access instead of opening it.",
    internalOnly: true,
  },
  {
    port: "4500",
    protocol: "UDP",
    service: "IPsec NAT-T",
    category: "VPN",
    description: "IPsec when there's NAT between the peers.",
  },
  {
    port: "5060, 5061",
    protocol: "TCP/UDP",
    service: "SIP",
    category: "Messaging",
    description: "VoIP signalling: 5060 plain, 5061 TLS.",
  },
  {
    port: "5432",
    protocol: "TCP",
    service: "PostgreSQL",
    category: "Databases",
    description: "PostgreSQL and Azure Database for PostgreSQL.",
    internalOnly: true,
  },
  {
    port: "5671, 5672",
    protocol: "TCP",
    service: "AMQP",
    category: "Messaging",
    description:
      "Message queues: 5671 TLS, 5672 plain. Azure Service Bus and Event Hubs use 5671.",
    notes:
      "If 5671 is blocked, the Azure SDKs can switch to AMQP over WebSockets on 443.",
  },
  {
    port: "5900",
    protocol: "TCP",
    service: "VNC",
    category: "Remote access",
    description: "Remote desktop for Linux and macOS.",
    notes: "Often weakly protected; tunnel it through SSH or a VPN.",
    internalOnly: true,
  },
  {
    port: "5985, 5986",
    protocol: "TCP",
    service: "WinRM",
    category: "Remote access",
    description: "PowerShell remoting: 5985 HTTP, 5986 HTTPS.",
    internalOnly: true,
  },
  {
    port: "6379, 6380",
    protocol: "TCP",
    service: "Redis",
    category: "Databases",
    description:
      "Redis: 6379 plain, 6380 TLS on Azure Cache for Redis (non-TLS is disabled by default).",
    internalOnly: true,
  },
  {
    port: "6443",
    protocol: "TCP",
    service: "Kubernetes API",
    category: "Containers",
    description: "Kubernetes API server.",
    notes: "Limit with authorized IP ranges or a private cluster.",
  },
  {
    port: "8080",
    protocol: "TCP",
    service: "HTTP alternative",
    category: "Web",
    description: "Common for app servers, proxies and development.",
  },
  {
    port: "8443",
    protocol: "TCP",
    service: "HTTPS alternative",
    category: "Web",
    description: "Common for admin interfaces and app servers.",
  },
  {
    port: "8883",
    protocol: "TCP",
    service: "MQTT over TLS",
    category: "Messaging",
    description: "Encrypted MQTT, used by Azure IoT Hub.",
  },
  {
    port: "9090",
    protocol: "TCP",
    service: "Prometheus",
    category: "Monitoring",
    description: "Prometheus server and UI.",
    internalOnly: true,
  },
  {
    port: "9092, 9093",
    protocol: "TCP",
    service: "Kafka",
    category: "Messaging",
    description:
      "Kafka brokers. Azure Event Hubs' Kafka endpoint listens on 9093 (TLS).",
  },
  {
    port: "9200, 9300",
    protocol: "TCP",
    service: "Elasticsearch",
    category: "Databases",
    description: "9200 REST API, 9300 cluster traffic.",
    notes: "Exposed instances are a classic source of data leaks.",
    internalOnly: true,
  },
  {
    port: "10250",
    protocol: "TCP",
    service: "Kubelet API",
    category: "Containers",
    description: "API on every Kubernetes node.",
    internalOnly: true,
  },
  {
    port: "11211",
    protocol: "TCP/UDP",
    service: "Memcached",
    category: "Databases",
    description: "In-memory cache.",
    notes: "Exposed UDP 11211 was abused for huge DDoS amplification attacks.",
    internalOnly: true,
  },
  {
    port: "27017",
    protocol: "TCP",
    service: "MongoDB",
    category: "Databases",
    description: "MongoDB, and Azure Cosmos DB for MongoDB (port 10255 there).",
    internalOnly: true,
  },
  {
    port: "51820",
    protocol: "UDP",
    service: "WireGuard",
    category: "VPN",
    description: "WireGuard VPN default port.",
  },
];

function portNumbers(entry: PortEntry): number[] {
  return entry.port.split(/,\s*/).flatMap((part) => {
    const [from, to] = part.split(/[–-]/).map(Number);
    return to
      ? Array.from({ length: to - from + 1 }, (_, i) => from + i)
      : [from];
  });
}

export function searchPorts(
  query: string,
  category: PortCategory | null,
): PortEntry[] {
  const q = query.trim().toLowerCase();
  return PORTS.filter((entry) => {
    if (category && entry.category !== category) return false;
    if (!q) return true;
    if (/^\d+$/.test(q))
      return portNumbers(entry).some((n) => String(n).startsWith(q));
    const text = [
      entry.port,
      entry.service,
      entry.description,
      entry.notes,
      entry.category,
      entry.protocol,
    ]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((term) => text.includes(term));
  });
}

export function portAnchor(entry: PortEntry): string {
  return `port-${portNumbers(entry)[0]}`;
}
