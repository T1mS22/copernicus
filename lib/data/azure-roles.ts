// Generated from Microsoft's "Azure built-in roles" documentation
// (github.com/MicrosoftDocs/azure-docs, role-based-access-control/built-in-roles.md),
// retrieved 2026-10-31. Regenerate rather than editing by hand.

export type AzureRole = {
  name: string;
  description: string;
  id: string;
  category: string;
  // Anchor of the role on the Microsoft Learn built-in roles page.
  anchor: string;
};

export const AZURE_ROLES: AzureRole[] = [
  {
    name: "Contributor",
    description:
      "Grants full access to manage all resources, but does not allow you to assign roles in Azure RBAC, manage assignments in Azure Blueprints, or share image galleries.",
    id: "b24988ac-6180-42a0-ab88-20f7382dd24c",
    category: "Privileged",
    anchor: "contributor",
  },
  {
    name: "Owner",
    description:
      "Grants full access to manage all resources, including the ability to assign roles in Azure RBAC.",
    id: "8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
    category: "Privileged",
    anchor: "owner",
  },
  {
    name: "Reservations Administrator",
    description: "Lets one read and manage all the reservations in a tenant",
    id: "a8889054-8d42-49c9-bc1c-52486c10e7cd",
    category: "Privileged",
    anchor: "reservations-administrator",
  },
  {
    name: "Role Based Access Control Administrator",
    description:
      "Manage access to Azure resources by assigning roles using Azure RBAC. This role does not allow you to manage access using other ways, such as Azure Policy.",
    id: "f58310d9-a9f6-439a-9e8d-f62e7b41a168",
    category: "Privileged",
    anchor: "role-based-access-control-administrator",
  },
  {
    name: "User Access Administrator",
    description: "Lets you manage user access to Azure resources.",
    id: "18d7d88d-d35e-4fb5-a5c3-7773c20a72d9",
    category: "Privileged",
    anchor: "user-access-administrator",
  },
  {
    name: "Reader",
    description:
      "View all resources, but does not allow you to make any changes.",
    id: "acdd72a7-3385-48ef-bd42-f606fba81ae7",
    category: "General",
    anchor: "reader",
  },
  {
    name: "Azure Arc VMware VM Contributor",
    description:
      "Arc VMware VM Contributor has permissions to perform all VM actions.",
    id: "b748a06d-6150-4f8a-aaa9-ce3940cd96cb",
    category: "Compute",
    anchor: "azure-arc-vmware-vm-contributor",
  },
  {
    name: "Azure Batch Account Contributor",
    description:
      "Grants full access to manage all Batch resources, including Batch accounts, pools and jobs.",
    id: "29fe4964-1e60-436b-bd3a-77fd4c178b3c",
    category: "Compute",
    anchor: "azure-batch-account-contributor",
  },
  {
    name: "Azure Batch Account Reader",
    description:
      "Lets you view all resources including pools and jobs in the Batch account.",
    id: "11076f67-66f6-4be0-8f6b-f0609fd05cc9",
    category: "Compute",
    anchor: "azure-batch-account-reader",
  },
  {
    name: "Azure Batch Data Contributor",
    description:
      "Grants permissions to manage Batch pools and jobs but not to modify accounts.",
    id: "6aaa78f1-f7de-44ca-8722-c64a23943cae",
    category: "Compute",
    anchor: "azure-batch-data-contributor",
  },
  {
    name: "Azure Batch Job Submitter",
    description: "Lets you submit and manage jobs in the Batch account.",
    id: "48e5e92e-a480-4e71-aa9c-2778f4c13781",
    category: "Compute",
    anchor: "azure-batch-job-submitter",
  },
  {
    name: "Classic Virtual Machine Contributor",
    description:
      "Lets you manage classic virtual machines, but not access to them, and not the virtual network or storage account they're connected to.",
    id: "d73bb868-a0df-4d4d-bd69-98a00b01fccb",
    category: "Compute",
    anchor: "classic-virtual-machine-contributor",
  },
  {
    name: "Compute Fleet Contributor",
    description: "Allows users to manage Compute Fleet resources.",
    id: "2bed379c-9fba-455b-99e4-6b911073bcf2",
    category: "Compute",
    anchor: "compute-fleet-contributor",
  },
  {
    name: "Compute Gallery Artifacts Publisher",
    description: "This is the role for publishing gallery artifacts.",
    id: "85a2d0d9-2eba-4c9c-b355-11c2cc0788ab",
    category: "Compute",
    anchor: "compute-gallery-artifacts-publisher",
  },
  {
    name: "Compute Gallery Image Reader",
    description: "This is the role for reading gallery images.",
    id: "cf7c76d2-98a3-4358-a134-615aa78bf44d",
    category: "Compute",
    anchor: "compute-gallery-image-reader",
  },
  {
    name: "Compute Gallery Sharing Admin",
    description:
      "This role allows user to share gallery to another subscription/tenant or share it to the public.",
    id: "1ef6a3be-d0ac-425d-8c01-acb62866290b",
    category: "Compute",
    anchor: "compute-gallery-sharing-admin",
  },
  {
    name: "Compute Limit Operator",
    description:
      "Read and manage compute limits using compute limit operations.",
    id: "980cf6f7-edec-4fd1-8e9e-28f70b1d5258",
    category: "Compute",
    anchor: "compute-limit-operator",
  },
  {
    name: "Data Operator for Managed Disks",
    description:
      "Provides permissions to upload data to empty managed disks, read, or export data of managed disks (not attached to running VMs) and snapshots using SAS URIs and Azure AD authentication.",
    id: "959f8984-c045-4866-89c7-12bf9737be2e",
    category: "Compute",
    anchor: "data-operator-for-managed-disks",
  },
  {
    name: "Desktop Virtualization Application Group Contributor",
    description: "Contributor of the Desktop Virtualization Application Group.",
    id: "86240b0e-9422-4c43-887b-b61143f32ba8",
    category: "Compute",
    anchor: "desktop-virtualization-application-group-contributor",
  },
  {
    name: "Desktop Virtualization Application Group Reader",
    description: "Reader of the Desktop Virtualization Application Group.",
    id: "aebf23d0-b568-4e86-b8f9-fe83a2c6ab55",
    category: "Compute",
    anchor: "desktop-virtualization-application-group-reader",
  },
  {
    name: "Desktop Virtualization Contributor",
    description: "Contributor of Desktop Virtualization.",
    id: "082f0a83-3be5-4ba1-904c-961cca79b387",
    category: "Compute",
    anchor: "desktop-virtualization-contributor",
  },
  {
    name: "Desktop Virtualization Host Pool Contributor",
    description: "Contributor of the Desktop Virtualization Host Pool.",
    id: "e307426c-f9b6-4e81-87de-d99efb3c32bc",
    category: "Compute",
    anchor: "desktop-virtualization-host-pool-contributor",
  },
  {
    name: "Desktop Virtualization Host Pool Reader",
    description: "Reader of the Desktop Virtualization Host Pool.",
    id: "ceadfde2-b300-400a-ab7b-6143895aa822",
    category: "Compute",
    anchor: "desktop-virtualization-host-pool-reader",
  },
  {
    name: "Desktop Virtualization Power On Contributor",
    description:
      "Provide permission to the Azure Virtual Desktop Resource Provider to start virtual machines.",
    id: "489581de-a3bd-480d-9518-53dea7416b33",
    category: "Compute",
    anchor: "desktop-virtualization-power-on-contributor",
  },
  {
    name: "Desktop Virtualization Power On Off Contributor",
    description:
      "Provide permission to the Azure Virtual Desktop Resource Provider to start and stop virtual machines.",
    id: "40c5ff49-9181-41f8-ae61-143b0e78555e",
    category: "Compute",
    anchor: "desktop-virtualization-power-on-off-contributor",
  },
  {
    name: "Desktop Virtualization Reader",
    description: "Reader of Desktop Virtualization.",
    id: "49a72310-ab8d-41df-bbb0-79b649203868",
    category: "Compute",
    anchor: "desktop-virtualization-reader",
  },
  {
    name: "Desktop Virtualization Session Host Operator",
    description: "Operator of the Desktop Virtualization Session Host.",
    id: "2ad6aaab-ead9-4eaa-8ac5-da422f562408",
    category: "Compute",
    anchor: "desktop-virtualization-session-host-operator",
  },
  {
    name: "Desktop Virtualization User",
    description: "Allows user to use the applications in an application group.",
    id: "1d18fff3-a72a-46b5-b4a9-0b38a3cd7e63",
    category: "Compute",
    anchor: "desktop-virtualization-user",
  },
  {
    name: "Desktop Virtualization User Session Operator",
    description: "Operator of the Desktop Virtualization User Session.",
    id: "ea4bfff8-7fb4-485a-aadd-d4129a0ffaa6",
    category: "Compute",
    anchor: "desktop-virtualization-user-session-operator",
  },
  {
    name: "Desktop Virtualization Virtual Machine Contributor",
    description:
      "This role is in preview and subject to change. Provide permission to the Azure Virtual Desktop Resource Provider to create, delete, update, start, and stop virtual machines.",
    id: "a959dbd1-f747-45e3-8ba6-dd80f235f97c",
    category: "Compute",
    anchor: "desktop-virtualization-virtual-machine-contributor",
  },
  {
    name: "Desktop Virtualization Workspace Contributor",
    description: "Contributor of the Desktop Virtualization Workspace.",
    id: "21efdde3-836f-432b-bf3d-3e8e734d4b2b",
    category: "Compute",
    anchor: "desktop-virtualization-workspace-contributor",
  },
  {
    name: "Desktop Virtualization Workspace Reader",
    description: "Reader of the Desktop Virtualization Workspace.",
    id: "0fa44ee9-7a7d-466b-9bb2-2bf446b1204d",
    category: "Compute",
    anchor: "desktop-virtualization-workspace-reader",
  },
  {
    name: "Disk Backup Reader",
    description: "Provides permission to backup vault to perform disk backup.",
    id: "3e5e47e6-65f7-47ef-90b5-e5dd4d455f24",
    category: "Compute",
    anchor: "disk-backup-reader",
  },
  {
    name: "Disk Pool Operator",
    description:
      "Provide permission to StoragePool Resource Provider to manage disks added to a disk pool.",
    id: "60fc6e62-5479-42d4-8bf4-67625fcc2840",
    category: "Compute",
    anchor: "disk-pool-operator",
  },
  {
    name: "Disk Restore Operator",
    description: "Provides permission to backup vault to perform disk restore.",
    id: "b50d9833-a0cb-478e-945f-707fcc997c13",
    category: "Compute",
    anchor: "disk-restore-operator",
  },
  {
    name: "Disk Snapshot Contributor",
    description:
      "Provides permission to backup vault to manage disk snapshots.",
    id: "7efff54f-a5b4-42b5-a1c5-5411624893ce",
    category: "Compute",
    anchor: "disk-snapshot-contributor",
  },
  {
    name: "Quantum Workspace Data Contributor",
    description:
      "Create, read, and modify jobs and other Workspace data. This role is in preview and subject to change.",
    id: "c1410b24-3e69-4857-8f86-4d0a2e603250",
    category: "Compute",
    anchor: "quantum-workspace-data-contributor",
  },
  {
    name: "Virtual Machine Administrator Login",
    description:
      "View Virtual Machines in the portal and login as administrator",
    id: "1c0163c0-47e6-4577-8991-ea5c82e286e4",
    category: "Compute",
    anchor: "virtual-machine-administrator-login",
  },
  {
    name: "Virtual Machine Contributor",
    description:
      "Create and manage virtual machines, manage disks, install and run software, reset password of the root user of the virtual machine using VM extensions, and manage local user accounts using VM extensions. This role does not grant you management access to the virtual network or storage account the virtual machines are connected to. This role does not allow you to assign roles in Azure RBAC.",
    id: "9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
    category: "Compute",
    anchor: "virtual-machine-contributor",
  },
  {
    name: "Virtual Machine Data Access Administrator (preview)",
    description:
      "Manage access to Virtual Machines by adding or removing role assignments for the Virtual Machine Administrator Login and Virtual Machine User Login roles. Includes an ABAC condition to constrain role assignments.",
    id: "66f75aeb-eabe-4b70-9f1e-c350c4c9ad04",
    category: "Compute",
    anchor: "virtual-machine-data-access-administrator-preview",
  },
  {
    name: "Virtual Machine Local User Login",
    description:
      "View Virtual Machines in the portal and login as a local user configured on the Arc server.",
    id: "602da2ba-a5c2-41da-b01d-5360126ab525",
    category: "Compute",
    anchor: "virtual-machine-local-user-login",
  },
  {
    name: "Virtual Machine User Login",
    description:
      "View Virtual Machines in the portal and login as a regular user.",
    id: "fb879df8-f326-4884-b1cf-06f3ad86be52",
    category: "Compute",
    anchor: "virtual-machine-user-login",
  },
  {
    name: "VM Restore Operator",
    description:
      "Create and Delete resources during VM Restore. This role is in preview and subject to change.",
    id: "dfce8971-25e3-42e3-ba33-6055438e3080",
    category: "Compute",
    anchor: "vm-restore-operator",
  },
  {
    name: "Windows 365 Network Interface Contributor",
    description:
      "This role is used by Windows 365 to provision required network resources and join Microsoft-hosted VMs to network interfaces.",
    id: "1f135831-5bbe-4924-9016-264044c00788",
    category: "Compute",
    anchor: "windows-365-network-interface-contributor",
  },
  {
    name: "Windows 365 Network User",
    description:
      "This role is used by Windows 365 to read virtual networks and join the designated virtual networks.",
    id: "7eabc9a4-85f7-4f71-b8ab-75daaccc1033",
    category: "Compute",
    anchor: "windows-365-network-user",
  },
  {
    name: "Windows Admin Center Administrator Login",
    description:
      "Let's you manage the OS of your resource via Windows Admin Center as an administrator.",
    id: "a6333a3e-0164-44c3-b281-7a577aff287f",
    category: "Compute",
    anchor: "windows-admin-center-administrator-login",
  },
  {
    name: "Azure Front Door Domain Contributor",
    description:
      "For internal use within Azure. Can manage Azure Front Door domains, but can't grant access to other users.",
    id: "0ab34830-df19-4f8c-b84e-aa85b8afa6e8",
    category: "Networking",
    anchor: "azure-front-door-domain-contributor",
  },
  {
    name: "Azure Front Door Domain Reader",
    description:
      "For internal use within Azure. Can view Azure Front Door domains, but can't make changes.",
    id: "0f99d363-226e-4dca-9920-b807cf8e1a5f",
    category: "Networking",
    anchor: "azure-front-door-domain-reader",
  },
  {
    name: "Azure Front Door Profile Reader",
    description:
      "Can view AFD standard and premium profiles and their endpoints, but can't make changes.",
    id: "662802e2-50f6-46b0-aed2-e834bacc6d12",
    category: "Networking",
    anchor: "azure-front-door-profile-reader",
  },
  {
    name: "Azure Front Door Secret Contributor",
    description:
      "For internal use within Azure. Can manage Azure Front Door secrets, but can't grant access to other users.",
    id: "3f2eb865-5811-4578-b90a-6fc6fa0df8e5",
    category: "Networking",
    anchor: "azure-front-door-secret-contributor",
  },
  {
    name: "Azure Front Door Secret Reader",
    description:
      "For internal use within Azure. Can view Azure Front Door secrets, but can't make changes.",
    id: "0db238c4-885e-4c4f-a933-aa2cef684fca",
    category: "Networking",
    anchor: "azure-front-door-secret-reader",
  },
  {
    name: "CDN Endpoint Contributor",
    description:
      "Can manage CDN endpoints, but can't grant access to other users.",
    id: "426e0c7f-0c7e-4658-b36f-ff54d6c29b45",
    category: "Networking",
    anchor: "cdn-endpoint-contributor",
  },
  {
    name: "CDN Endpoint Reader",
    description: "Can view CDN endpoints, but can't make changes.",
    id: "871e35f6-b5c1-49cc-a043-bde969a0f2cd",
    category: "Networking",
    anchor: "cdn-endpoint-reader",
  },
  {
    name: "CDN Profile Contributor",
    description:
      "Can manage CDN and Azure Front Door standard and premium profiles and their endpoints, but can't grant access to other users.",
    id: "ec156ff8-a8d1-4d15-830c-5b80698ca432",
    category: "Networking",
    anchor: "cdn-profile-contributor",
  },
  {
    name: "CDN Profile Reader",
    description:
      "Can view CDN profiles and their endpoints, but can't make changes.",
    id: "8f96442b-4075-438f-813d-ad51ab4019af",
    category: "Networking",
    anchor: "cdn-profile-reader",
  },
  {
    name: "Classic Network Contributor",
    description: "Lets you manage classic networks, but not access to them.",
    id: "b34d265f-36f7-4a0d-a4d4-e158ca92e90f",
    category: "Networking",
    anchor: "classic-network-contributor",
  },
  {
    name: "DNS Zone Contributor",
    description:
      "Lets you manage DNS zones and record sets in Azure DNS, but does not let you control who has access to them.",
    id: "befefa01-2a29-4197-83a8-272ff33ce314",
    category: "Networking",
    anchor: "dns-zone-contributor",
  },
  {
    name: "Network Contributor",
    description:
      "Lets you manage networks, but not access to them. This role does not grant you permission to deploy or manage Virtual Machines.",
    id: "4d97b98b-1d4f-4787-a291-c67834d212e7",
    category: "Networking",
    anchor: "network-contributor",
  },
  {
    name: "Private DNS Zone Contributor",
    description:
      "Lets you manage private DNS zone resources, but not the virtual networks they are linked to.",
    id: "b12aa53e-6015-4669-85d0-8515ebb3ae7f",
    category: "Networking",
    anchor: "private-dns-zone-contributor",
  },
  {
    name: "Traffic Manager Contributor",
    description:
      "Lets you manage Traffic Manager profiles, but does not let you control who has access to them.",
    id: "a4b10055-b0c7-44c2-b00f-c7b5b3550cf7",
    category: "Networking",
    anchor: "traffic-manager-contributor",
  },
  {
    name: "Avere Contributor",
    description: "Can create and manage an Avere vFXT cluster.",
    id: "4f8fab4f-1852-4a58-a46a-8eaf358af14a",
    category: "Storage",
    anchor: "avere-contributor",
  },
  {
    name: "Avere Operator",
    description: "Used by the Avere vFXT cluster to manage the cluster",
    id: "c025889f-8102-4ebf-b32c-fc0c6f0c6bd9",
    category: "Storage",
    anchor: "avere-operator",
  },
  {
    name: "Azure File Sync Administrator",
    description:
      "Provides full access to manage all Azure File Sync (Storage Sync Service) resources. Also allows read/write access to all data contained in a storage account via access to storage account keys.",
    id: "92b92042-07d9-4307-87f7-36a593fc5850",
    category: "Storage",
    anchor: "azure-file-sync-administrator",
  },
  {
    name: "Azure File Sync Reader",
    description:
      "Provides read access to Azure File Sync service (Storage Sync Service).",
    id: "754c1a27-40dc-4708-8ad4-2bffdeee09e8",
    category: "Storage",
    anchor: "azure-file-sync-reader",
  },
  {
    name: "Backup Contributor",
    description:
      "Lets you manage backup service, but can't create vaults and give access to others",
    id: "5e467623-bb1f-42f4-a55d-6e525e11384b",
    category: "Storage",
    anchor: "backup-contributor",
  },
  {
    name: "Backup MUA Admin",
    description:
      "Backup MultiUser-Authorization. Can create/delete ResourceGuard",
    id: "c2a970b4-16a7-4a51-8c84-8a8ea6ee0bb8",
    category: "Storage",
    anchor: "backup-mua-admin",
  },
  {
    name: "Backup MUA Operator",
    description:
      "Backup MultiUser-Authorization. Allows user to perform critical operation protected by resourceguard",
    id: "f54b6d04-23c6-443e-b462-9c16ab7b4a52",
    category: "Storage",
    anchor: "backup-mua-operator",
  },
  {
    name: "Backup Operator",
    description:
      "Lets you manage backup services, except removal of backup, vault creation and giving access to others",
    id: "00c29273-979b-4161-815c-10b084fb9324",
    category: "Storage",
    anchor: "backup-operator",
  },
  {
    name: "Backup Reader",
    description: "Can view backup services, but can't make changes",
    id: "a795c7a0-d4a2-40c1-ae25-d81f01202912",
    category: "Storage",
    anchor: "backup-reader",
  },
  {
    name: "Classic Storage Account Contributor",
    description:
      "Lets you manage classic storage accounts, but not access to them.",
    id: "86e8f5dc-a6e9-4c67-9d15-de283e8eac25",
    category: "Storage",
    anchor: "classic-storage-account-contributor",
  },
  {
    name: "Classic Storage Account Key Operator Service Role",
    description:
      "Classic Storage Account Key Operators are allowed to list and regenerate keys on Classic Storage Accounts",
    id: "985d6b00-f706-48f5-a6fe-d0ca12fb668d",
    category: "Storage",
    anchor: "classic-storage-account-key-operator-service-role",
  },
  {
    name: "Data Box Contributor",
    description:
      "Lets you manage everything under Data Box Service except giving access to others.",
    id: "add466c9-e687-43fc-8d98-dfcf8d720be5",
    category: "Storage",
    anchor: "data-box-contributor",
  },
  {
    name: "Data Box Reader",
    description:
      "Lets you manage Data Box Service except creating order or editing order details and giving access to others.",
    id: "028f4ed7-e2a9-465e-a8f4-9c0ffdfdc027",
    category: "Storage",
    anchor: "data-box-reader",
  },
  {
    name: "Data Lake Analytics Developer",
    description:
      "Lets you submit, monitor, and manage your own jobs but not create or delete Data Lake Analytics accounts.",
    id: "47b7735b-770e-4598-a7da-8b91488b4c88",
    category: "Storage",
    anchor: "data-lake-analytics-developer",
  },
  {
    name: "Defender for Storage Data Scanner",
    description:
      "Grants access to read blobs and update index tags. This role is used by the data scanner of Defender for Storage.",
    id: "1e7ca9b1-60d1-4db8-a914-f2ca1ff27c40",
    category: "Storage",
    anchor: "defender-for-storage-data-scanner",
  },
  {
    name: "Elastic SAN Network Admin",
    description:
      "Allows access to create Private Endpoints on SAN resources, and to read SAN resources",
    id: "fa6cecf6-5db3-4c43-8470-c540bcb4eafa",
    category: "Storage",
    anchor: "elastic-san-network-admin",
  },
  {
    name: "Elastic SAN Owner",
    description:
      "Allows for full access to all resources under Azure Elastic SAN including changing network security policies to unblock data path access",
    id: "80dcbedb-47ef-405d-95bd-188a1b4ac406",
    category: "Storage",
    anchor: "elastic-san-owner",
  },
  {
    name: "Elastic SAN Reader",
    description: "Allows for control path read access to Azure Elastic SAN",
    id: "af6a70f8-3c9f-4105-acf1-d719e9fca4ca",
    category: "Storage",
    anchor: "elastic-san-reader",
  },
  {
    name: "Elastic SAN Volume Group Owner",
    description:
      "Allows for full access to a volume group in Azure Elastic SAN including changing network security policies to unblock data path access",
    id: "a8281131-f312-4f34-8d98-ae12be9f0d23",
    category: "Storage",
    anchor: "elastic-san-volume-group-owner",
  },
  {
    name: "Reader and Data Access",
    description:
      "Lets you view everything but will not let you delete or create a storage account or contained resource. It will also allow read/write access to all data contained in a storage account via access to storage account keys.",
    id: "c12c1c16-33a1-487b-954d-41c89c60f349",
    category: "Storage",
    anchor: "reader-and-data-access",
  },
  {
    name: "Storage Account Backup Contributor",
    description:
      "Lets you perform backup and restore operations using Azure Backup on the storage account.",
    id: "e5e2a7ff-d759-4cd2-bb51-3152d37e2eb1",
    category: "Storage",
    anchor: "storage-account-backup-contributor",
  },
  {
    name: "Storage Account Contributor",
    description:
      "Permits management of storage accounts. Provides access to the account key, which can be used to access data via Shared Key authorization.",
    id: "17d1049b-9a84-46fb-8f53-869881c3d3ab",
    category: "Storage",
    anchor: "storage-account-contributor",
  },
  {
    name: "Storage Account Key Operator Service Role",
    description:
      "Permits listing and regenerating storage account access keys.",
    id: "81a9662b-bebf-436f-a333-f67b29880f12",
    category: "Storage",
    anchor: "storage-account-key-operator-service-role",
  },
  {
    name: "Storage Actions Blob Data Operator",
    description:
      "Used by the Storage Actions - Storage Task to list & perform operations on the Storage Account blobs",
    id: "4bad4d9e-2a13-4888-94bb-c8432f6f3040",
    category: "Storage",
    anchor: "storage-actions-blob-data-operator",
  },
  {
    name: "Storage Actions Contributor",
    description:
      "Used by the Storage Actions author to create, read, update, and delete Storage Actions",
    id: "bd8acdb0-202c-4493-a7fe-ef98eefbfbc4",
    category: "Storage",
    anchor: "storage-actions-contributor",
  },
  {
    name: "Storage Actions Task Assignment Contributor",
    description:
      "Used by the Storage Actions assigner to create a Task Assignment on their target Storage Account, with RBAC privileges for Managed Identity",
    id: "77789c21-1643-48a2-8f27-47f858540b51",
    category: "Storage",
    anchor: "storage-actions-task-assignment-contributor",
  },
  {
    name: "Storage Blob Data Contributor",
    description:
      "Read, write, and delete Azure Storage containers and blobs. To learn which actions are required for a given data operation, see Permissions for calling data operations.",
    id: "ba92f5b4-2d11-453d-a403-e96b0029c9fe",
    category: "Storage",
    anchor: "storage-blob-data-contributor",
  },
  {
    name: "Storage Blob Data Owner",
    description:
      "Provides full access to Azure Storage blob containers and data, including assigning POSIX access control. To learn which actions are required for a given data operation, see Permissions for calling data operations.",
    id: "b7e6dc6d-f1e8-4753-8033-0f276bb0955b",
    category: "Storage",
    anchor: "storage-blob-data-owner",
  },
  {
    name: "Storage Blob Data Reader",
    description:
      "Read and list Azure Storage containers and blobs. To learn which actions are required for a given data operation, see Permissions for calling data operations.",
    id: "2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
    category: "Storage",
    anchor: "storage-blob-data-reader",
  },
  {
    name: "Storage Blob Delegator",
    description:
      "Get a user delegation key, which can then be used to create a shared access signature for a container or blob that is signed with Azure AD credentials. For more information, see Create a user delegation SAS.",
    id: "db58b8e5-c6ad-4a2a-8342-4190687cbf4a",
    category: "Storage",
    anchor: "storage-blob-delegator",
  },
  {
    name: "Storage Connector Contributor",
    description:
      "Allows creating and managing storage connectors to access remote data sources in-place in a storage account. This role is in preview and subject to change.",
    id: "9d819e60-1b9f-4871-b492-4e6cdee0b50a",
    category: "Storage",
    anchor: "storage-connector-contributor",
  },
  {
    name: "Storage DataShare Contributor",
    description:
      "Allows creating and managing storage dataShares to share data from storage accounts in-place. This role is in preview and subject to change.",
    id: "35c49d44-ccc1-4b18-8267-cfb3bacdd396",
    category: "Storage",
    anchor: "storage-datashare-contributor",
  },
  {
    name: "Storage File Data Privileged Contributor",
    description:
      "Allows for read, write, delete, and modify ACLs on files/directories in Azure file shares by overriding existing ACLs/NTFS permissions. This role has no built-in equivalent on Windows file servers.",
    id: "69566ab7-960f-475b-8e7c-b3118f30c6bd",
    category: "Storage",
    anchor: "storage-file-data-privileged-contributor",
  },
  {
    name: "Storage File Data Privileged Reader",
    description:
      "Allows for read access on files/directories in Azure file shares by overriding existing ACLs/NTFS permissions. This role has no built-in equivalent on Windows file servers.",
    id: "b8eda974-7b85-4f76-af95-65846b26df6d",
    category: "Storage",
    anchor: "storage-file-data-privileged-reader",
  },
  {
    name: "Storage File Data SMB Admin",
    description:
      "Allows for admin access equivalent to storage account key for end users over SMB.",
    id: "bbf004e3-0e4b-4f86-ae4f-1f8fb47b357b",
    category: "Storage",
    anchor: "storage-file-data-smb-admin",
  },
  {
    name: "Storage File Data SMB MI Admin",
    description:
      "Allows for admin-level access for managed identities on files/directories in Azure file shares.",
    id: "a235d3ee-5935-4cfb-8cc5-a3303ad5995e",
    category: "Storage",
    anchor: "storage-file-data-smb-mi-admin",
  },
  {
    name: "Storage File Data SMB Share Contributor",
    description:
      "Allows for read, write, and delete access on files/directories in Azure file shares. This role has no built-in equivalent on Windows file servers.",
    id: "0c867c2a-1d8c-454a-a3db-ab2ea1bdc8bb",
    category: "Storage",
    anchor: "storage-file-data-smb-share-contributor",
  },
  {
    name: "Storage File Data SMB Share Elevated Contributor",
    description:
      "Allows for read, write, delete, and modify ACLs on files/directories in Azure file shares. This role is equivalent to a file share ACL of change on Windows file servers.",
    id: "a7264617-510b-434b-a828-9731dc254ea7",
    category: "Storage",
    anchor: "storage-file-data-smb-share-elevated-contributor",
  },
  {
    name: "Storage File Data SMB Share Reader",
    description:
      "Allows for read access on files/directories in Azure file shares. This role is equivalent to a file share ACL of read on  Windows file servers.",
    id: "aba4ae5f-2193-4029-9191-0cb91df5e314",
    category: "Storage",
    anchor: "storage-file-data-smb-share-reader",
  },
  {
    name: "Storage File Data SMB Take Ownership",
    description: "Allows end user to assume ownership of a file/directory",
    id: "5d9bac3f-34b2-432f-bde5-78aa8e73ce6b",
    category: "Storage",
    anchor: "storage-file-data-smb-take-ownership",
  },
  {
    name: "Storage File Delegator",
    description:
      "Get a user delegation key, which can then be used to create a shared access signature for a file or Azure file share that is signed with Azure AD credentials. For more information, see Create a user delegation SAS.",
    id: "765a04e0-5de8-4bb2-9bf6-b2a30bc03e91",
    category: "Storage",
    anchor: "storage-file-delegator",
  },
  {
    name: "Storage Queue Data Contributor",
    description:
      "Read, write, and delete Azure Storage queues and queue messages. To learn which actions are required for a given data operation, see Permissions for calling data operations.",
    id: "974c5e8b-45b9-4653-ba55-5f855dd0fb88",
    category: "Storage",
    anchor: "storage-queue-data-contributor",
  },
  {
    name: "Storage Queue Data Message Processor",
    description:
      "Peek, retrieve, and delete a message from an Azure Storage queue. To learn which actions are required for a given data operation, see Permissions for calling data operations.",
    id: "8a0f0c08-91a1-4084-bc3d-661d67233fed",
    category: "Storage",
    anchor: "storage-queue-data-message-processor",
  },
  {
    name: "Storage Queue Data Message Sender",
    description:
      "Add messages to an Azure Storage queue. To learn which actions are required for a given data operation, see Permissions for calling data operations.",
    id: "c6a89b2d-59bc-44d0-9896-0f6e12d7b80a",
    category: "Storage",
    anchor: "storage-queue-data-message-sender",
  },
  {
    name: "Storage Queue Data Reader",
    description:
      "Read and list Azure Storage queues and queue messages. To learn which actions are required for a given data operation, see Permissions for calling data operations.",
    id: "19e7f393-937e-4f77-808e-94535e297925",
    category: "Storage",
    anchor: "storage-queue-data-reader",
  },
  {
    name: "Storage Queue Delegator",
    description:
      "Get a user delegation key, which can then be used to create a shared access signature for an Azure Storage queue that is signed with Azure AD credentials. For more information, see Create a user delegation SAS.",
    id: "7ee386e9-84f0-448e-80a6-f185f6533131",
    category: "Storage",
    anchor: "storage-queue-delegator",
  },
  {
    name: "Storage Table Data Contributor",
    description:
      "Allows for read, write and delete access to Azure Storage tables and entities",
    id: "0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3",
    category: "Storage",
    anchor: "storage-table-data-contributor",
  },
  {
    name: "Storage Table Data Reader",
    description: "Allows for read access to Azure Storage tables and entities",
    id: "76199698-9eea-4c19-bc75-cec21354c6b6",
    category: "Storage",
    anchor: "storage-table-data-reader",
  },
  {
    name: "Storage Table Delegator",
    description:
      "Get a user delegation key, which can then be used to create a shared access signature for an Azure Storage table that is signed with Azure AD credentials. For more information, see Create a user delegation SAS.",
    id: "965033a5-c8eb-4f35-b82f-fef460a3606d",
    category: "Storage",
    anchor: "storage-table-delegator",
  },
  {
    name: "Azure Maps Data Contributor",
    description:
      "Grants access to read, write, and delete access to map related data from an Azure maps account.",
    id: "8f5e0ce6-4f7b-4dcf-bddf-e6f48634a204",
    category: "Web and Mobile",
    anchor: "azure-maps-data-contributor",
  },
  {
    name: "Azure Maps Data Reader",
    description:
      "Grants access to read map related data from an Azure maps account.",
    id: "423170ca-a8f6-4b0f-8487-9e4eb8f49bfa",
    category: "Web and Mobile",
    anchor: "azure-maps-data-reader",
  },
  {
    name: "Azure Maps Search and Render Data Reader",
    description:
      "Grants access to very limited set of data APIs for common visual web SDK scenarios. Specifically, render and search data APIs.",
    id: "6be48352-4f82-47c9-ad5e-0acacefdb005",
    category: "Web and Mobile",
    anchor: "azure-maps-search-and-render-data-reader",
  },
  {
    name: "Azure Spring Apps Application Configuration Service Config File Pattern Reader Role",
    description:
      "Read content of config file pattern for Application Configuration Service in Azure Spring Apps",
    id: "25211fc6-dc78-40b6-b205-e4ac934fd9fd",
    category: "Web and Mobile",
    anchor:
      "azure-spring-apps-application-configuration-service-config-file-pattern-reader-role",
  },
  {
    name: "Azure Spring Apps Application Configuration Service Log Reader Role",
    description:
      "Read real-time logs for Application Configuration Service in Azure Spring Apps",
    id: "6593e776-2a30-40f9-8a32-4fe28b77655d",
    category: "Web and Mobile",
    anchor:
      "azure-spring-apps-application-configuration-service-log-reader-role",
  },
  {
    name: "Azure Spring Apps Connect Role",
    description: "Azure Spring Apps Connect Role",
    id: "80558df3-64f9-4c0f-b32d-e5094b036b0b",
    category: "Web and Mobile",
    anchor: "azure-spring-apps-connect-role",
  },
  {
    name: "Azure Spring Apps Job Log Reader Role",
    description: "Read real-time logs for jobs in Azure Spring Apps",
    id: "b459aa1d-e3c8-436f-ae21-c0531140f43e",
    category: "Web and Mobile",
    anchor: "azure-spring-apps-job-log-reader-role",
  },
  {
    name: "Azure Spring Apps Remote Debugging Role",
    description: "Azure Spring Apps Remote Debugging Role",
    id: "a99b0159-1064-4c22-a57b-c9b3caa1c054",
    category: "Web and Mobile",
    anchor: "azure-spring-apps-remote-debugging-role",
  },
  {
    name: "Azure Spring Apps Spring Cloud Gateway Log Reader Role",
    description:
      "Read real-time logs for Spring Cloud Gateway in Azure Spring Apps",
    id: "4301dc2a-25a9-44b0-ae63-3636cf7f2bd2",
    category: "Web and Mobile",
    anchor: "azure-spring-apps-spring-cloud-gateway-log-reader-role",
  },
  {
    name: "Azure Spring Cloud Config Server Contributor",
    description:
      "Allow read, write and delete access to Azure Spring Cloud Config Server",
    id: "a06f5c24-21a7-4e1a-aa2b-f19eb6684f5b",
    category: "Web and Mobile",
    anchor: "azure-spring-cloud-config-server-contributor",
  },
  {
    name: "Azure Spring Cloud Config Server Reader",
    description: "Allow read access to Azure Spring Cloud Config Server",
    id: "d04c6db6-4947-4782-9e91-30a88feb7be7",
    category: "Web and Mobile",
    anchor: "azure-spring-cloud-config-server-reader",
  },
  {
    name: "Azure Spring Cloud Data Reader",
    description: "Allow read access to Azure Spring Cloud Data",
    id: "b5537268-8956-4941-a8f0-646150406f0c",
    category: "Web and Mobile",
    anchor: "azure-spring-cloud-data-reader",
  },
  {
    name: "Azure Spring Cloud Service Registry Contributor",
    description:
      "Allow read, write and delete access to Azure Spring Cloud Service Registry",
    id: "f5880b48-c26d-48be-b172-7927bfa1c8f1",
    category: "Web and Mobile",
    anchor: "azure-spring-cloud-service-registry-contributor",
  },
  {
    name: "Azure Spring Cloud Service Registry Reader",
    description: "Allow read access to Azure Spring Cloud Service Registry",
    id: "cff1b556-2399-4e7e-856d-a8f754be7b65",
    category: "Web and Mobile",
    anchor: "azure-spring-cloud-service-registry-reader",
  },
  {
    name: "SignalR AccessKey Reader",
    description: "Read SignalR Service Access Keys",
    id: "04165923-9d83-45d5-8227-78b77b0a687e",
    category: "Web and Mobile",
    anchor: "signalr-accesskey-reader",
  },
  {
    name: "SignalR App Server",
    description:
      "Lets your app server access SignalR Service with AAD auth options.",
    id: "420fcaa2-552c-430f-98ca-3264be4806c7",
    category: "Web and Mobile",
    anchor: "signalr-app-server",
  },
  {
    name: "SignalR REST API Owner",
    description: "Full access to Azure SignalR Service REST APIs",
    id: "fd53cd77-2268-407a-8f46-7e7863d0f521",
    category: "Web and Mobile",
    anchor: "signalr-rest-api-owner",
  },
  {
    name: "SignalR REST API Reader",
    description: "Read-only access to Azure SignalR Service REST APIs",
    id: "ddde6b66-c0df-4114-a159-3618637b3035",
    category: "Web and Mobile",
    anchor: "signalr-rest-api-reader",
  },
  {
    name: "SignalR Service Owner",
    description: "Full access to Azure SignalR Service REST APIs",
    id: "7e4f1700-ea5a-4f59-8f37-079cfe29dce3",
    category: "Web and Mobile",
    anchor: "signalr-service-owner",
  },
  {
    name: "SignalR/Web PubSub Contributor",
    description: "Create, Read, Update, and Delete SignalR service resources",
    id: "8cf5e20a-e4b2-4e9d-b3a1-5ceb692c2761",
    category: "Web and Mobile",
    anchor: "signalrweb-pubsub-contributor",
  },
  {
    name: "Web Plan Contributor",
    description:
      "Manage the web plans for websites. Does not allow you to assign roles in Azure RBAC.",
    id: "2cc479cb-7b4d-49a8-b449-8c00fd0f0a4b",
    category: "Web and Mobile",
    anchor: "web-plan-contributor",
  },
  {
    name: "Web PubSub Service Owner",
    description: "Full access to Azure Web PubSub Service REST APIs",
    id: "12cf5a90-567b-43ae-8102-96cf46c7d9b4",
    category: "Web and Mobile",
    anchor: "web-pubsub-service-owner",
  },
  {
    name: "Web PubSub Service Reader",
    description: "Read-only access to Azure Web PubSub Service REST APIs",
    id: "bfb1c7d2-fb1a-466b-b2ba-aee63b92deaf",
    category: "Web and Mobile",
    anchor: "web-pubsub-service-reader",
  },
  {
    name: "Website Contributor",
    description:
      "Manage websites, but not web plans. Does not allow you to assign roles in Azure RBAC.",
    id: "de139f84-1756-47ae-9be6-808fbbe84772",
    category: "Web and Mobile",
    anchor: "website-contributor",
  },
  {
    name: "AcrDelete",
    description:
      "Delete repositories, tags, or manifests from a container registry.",
    id: "c2f4ef07-c644-48eb-af81-4b1b4947fb11",
    category: "Containers",
    anchor: "acrdelete",
  },
  {
    name: "AcrImageSigner",
    description:
      "Avoid using this role. Content Trust in Azure Container Registry and the AcrImageSigner role are being deprecated and will be completely removed on March 31, 2028. For details and transition guidance, see https://aka.ms/acr/dctdeprecation.",
    id: "6cef56e8-d556-48e5-a04f-b8e64114680f",
    category: "Containers",
    anchor: "acrimagesigner",
  },
  {
    name: "AcrPull",
    description: "Pull artifacts from a container registry.",
    id: "7f951dda-4ed3-4680-a7ca-43fe172d538d",
    category: "Containers",
    anchor: "acrpull",
  },
  {
    name: "AcrPush",
    description:
      "Push artifacts to or pull artifacts from a container registry.",
    id: "8311e382-0749-4cb8-b61a-304f252e45ec",
    category: "Containers",
    anchor: "acrpush",
  },
  {
    name: "AcrQuarantineReader",
    description: "Pull quarantined images from a container registry.",
    id: "cdda3590-29a3-44f6-95f2-9f980659eb04",
    category: "Containers",
    anchor: "acrquarantinereader",
  },
  {
    name: "AcrQuarantineWriter",
    description:
      "Push quarantined images to or pull quarantined images from a container registry.",
    id: "c8d4ff99-41c3-41a8-9f60-21dfdad59608",
    category: "Containers",
    anchor: "acrquarantinewriter",
  },
  {
    name: "Azure Arc Enabled Kubernetes Cluster User Role",
    description: "List cluster user credentials action.",
    id: "00493d72-78f6-4148-b6c5-d3ce8e4799dd",
    category: "Containers",
    anchor: "azure-arc-enabled-kubernetes-cluster-user-role",
  },
  {
    name: "Azure Arc Kubernetes Admin",
    description:
      "Lets you manage all resources under cluster/namespace, except update or delete resource quotas and namespaces.",
    id: "dffb1e0c-446f-4dde-a09f-99eb5cc68b96",
    category: "Containers",
    anchor: "azure-arc-kubernetes-admin",
  },
  {
    name: "Azure Arc Kubernetes Cluster Admin",
    description: "Lets you manage all resources in the cluster.",
    id: "8393591c-06b9-48a2-a542-1bd6b377f6a2",
    category: "Containers",
    anchor: "azure-arc-kubernetes-cluster-admin",
  },
  {
    name: "Azure Arc Kubernetes Viewer",
    description:
      "Lets you view all resources in cluster/namespace, except secrets.",
    id: "63f0a09d-1495-4db4-a681-037d84835eb4",
    category: "Containers",
    anchor: "azure-arc-kubernetes-viewer",
  },
  {
    name: "Azure Arc Kubernetes Writer",
    description:
      "Lets you update everything in cluster/namespace, except (cluster)roles and (cluster)role bindings.",
    id: "5b999177-9696-4545-85c7-50de3797e5a1",
    category: "Containers",
    anchor: "azure-arc-kubernetes-writer",
  },
  {
    name: "Azure Container Instances Contributor Role",
    description:
      "Grants read/write access to container groups provided by Azure Container Instances",
    id: "5d977122-f97e-4b4d-a52f-6b43003ddb4d",
    category: "Containers",
    anchor: "azure-container-instances-contributor-role",
  },
  {
    name: "Azure Container Storage Contributor",
    description:
      "Install Azure Container Storage and manage its storage resources. Includes an ABAC condition to constrain role assignments.",
    id: "95dd08a6-00bd-4661-84bf-f6726f83a4d0",
    category: "Containers",
    anchor: "azure-container-storage-contributor",
  },
  {
    name: "Azure Container Storage Operator",
    description:
      "Enable a managed identity to perform Azure Container Storage operations, such as manage virtual machines and manage virtual networks.",
    id: "08d4c71a-cc63-4ce4-a9c8-5dd251b4d619",
    category: "Containers",
    anchor: "azure-container-storage-operator",
  },
  {
    name: "Azure Container Storage Owner",
    description:
      "Install Azure Container Storage, grant access to its storage resources, and configure Azure Elastic storage area network (SAN). Includes an ABAC condition to constrain role assignments.",
    id: "95de85bd-744d-4664-9dde-11430bc34793",
    category: "Containers",
    anchor: "azure-container-storage-owner",
  },
  {
    name: "Azure Kubernetes Fleet Manager Contributor Role",
    description:
      "Grants read/write access to Azure resources provided by Azure Kubernetes Fleet Manager, including fleets, fleet members, fleet update strategies, fleet update runs, etc.",
    id: "63bb64ad-9799-4770-b5c3-24ed299a07bf",
    category: "Containers",
    anchor: "azure-kubernetes-fleet-manager-contributor-role",
  },
  {
    name: "Azure Kubernetes Fleet Manager Hub Agent Role",
    description:
      "Grants access to Azure resources needed by Azure Kubernetes Fleet Manager hub agents.",
    id: "de2b316d-7a2c-4143-b4cd-c148f6a355a1",
    category: "Containers",
    anchor: "azure-kubernetes-fleet-manager-hub-agent-role",
  },
  {
    name: "Azure Kubernetes Fleet Manager Hub Cluster User Role",
    description:
      "Grants read access to Azure Kubernetes Fleet Manager as well as the Kubernetes config file to connect to the fleet-managed hub cluster.",
    id: "850c5848-fc51-4a9a-8823-f220370626e3",
    category: "Containers",
    anchor: "azure-kubernetes-fleet-manager-hub-cluster-user-role",
  },
  {
    name: "Azure Kubernetes Fleet Manager RBAC Admin",
    description:
      "Grants read/write access to Kubernetes resources within a namespace in the fleet-managed hub cluster - provides write permissions on most objects within a namespace, with the exception of ResourceQuota object and the namespace object itself. Applying this role at cluster scope will give access across all namespaces.",
    id: "434fb43a-c01c-447e-9f67-c3ad923cfaba",
    category: "Containers",
    anchor: "azure-kubernetes-fleet-manager-rbac-admin",
  },
  {
    name: "Azure Kubernetes Fleet Manager RBAC Admin for Member Clusters",
    description:
      "This role grants admin access - provides write permissions on most objects within a namespace, with the exception of ResourceQuota object and the namespace object itself. Applying this role at cluster scope will give access across all namespaces.",
    id: "d1f699ed-700a-4c77-a22f-29890ac7b115",
    category: "Containers",
    anchor: "azure-kubernetes-fleet-manager-rbac-admin-for-member-clusters",
  },
  {
    name: "Azure Kubernetes Fleet Manager RBAC Cluster Admin",
    description:
      "Grants read/write access to all Kubernetes resources in the fleet-managed hub cluster.",
    id: "18ab4d3d-a1bf-4477-8ad9-8359bc988f69",
    category: "Containers",
    anchor: "azure-kubernetes-fleet-manager-rbac-cluster-admin",
  },
  {
    name: "Azure Kubernetes Fleet Manager RBAC Cluster Admin for Member Clusters",
    description:
      "Lets you manage all resources in the member clusters in the fleet.",
    id: "79a36d98-eb96-4a76-ae1d-481dc98d2c23",
    category: "Containers",
    anchor:
      "azure-kubernetes-fleet-manager-rbac-cluster-admin-for-member-clusters",
  },
  {
    name: "Azure Kubernetes Fleet Manager RBAC Reader",
    description:
      "Grants read-only access to most Kubernetes resources within a namespace in the fleet-managed hub cluster. It does not allow viewing roles or role bindings. This role does not allow viewing Secrets, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation).  Applying this role at cluster scope will give access across all namespaces.",
    id: "30b27cfc-9c84-438e-b0ce-70e35255df80",
    category: "Containers",
    anchor: "azure-kubernetes-fleet-manager-rbac-reader",
  },
  {
    name: "Azure Kubernetes Fleet Manager RBAC Reader for Member Clusters",
    description:
      "Allows read-only access to see most objects in a namespace. It does not allow viewing roles or role bindings. This role does not allow viewing Secrets, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation).  Applying this role at cluster scope will give access across all namespaces.",
    id: "463ad26c-fcce-4469-9c7f-5653d8acbab5",
    category: "Containers",
    anchor: "azure-kubernetes-fleet-manager-rbac-reader-for-member-clusters",
  },
  {
    name: "Azure Kubernetes Fleet Manager RBAC Writer",
    description:
      "Grants read/write access to most Kubernetes resources within a namespace in the fleet-managed hub cluster. This role does not allow viewing or modifying roles or role bindings. However, this role allows accessing Secrets as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace.  Applying this role at cluster scope will give access across all namespaces.",
    id: "5af6afb3-c06c-4fa4-8848-71a8aee05683",
    category: "Containers",
    anchor: "azure-kubernetes-fleet-manager-rbac-writer",
  },
  {
    name: "Azure Kubernetes Fleet Manager RBAC Writer for Member Clusters",
    description:
      "Allows read/write access to most objects in a namespace. This role does not allow viewing or modifying roles or role bindings. However, this role allows accessing Secrets and running Pods as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace.  Applying this role at cluster scope will give access across all namespaces.",
    id: "50346970-0998-40f2-b47d-f3b8809840f8",
    category: "Containers",
    anchor: "azure-kubernetes-fleet-manager-rbac-writer-for-member-clusters",
  },
  {
    name: "Azure Kubernetes Service Arc Cluster Admin Role",
    description: "List cluster admin credential action.",
    id: "b29efa5f-7782-4dc3-9537-4d5bc70a5e9f",
    category: "Containers",
    anchor: "azure-kubernetes-service-arc-cluster-admin-role",
  },
  {
    name: "Azure Kubernetes Service Arc Cluster User Role",
    description: "List cluster user credential action.",
    id: "233ca253-b031-42ff-9fba-87ef12d6b55f",
    category: "Containers",
    anchor: "azure-kubernetes-service-arc-cluster-user-role",
  },
  {
    name: "Azure Kubernetes Service Arc Contributor Role",
    description:
      "Grants access to read and write Azure Kubernetes Services hybrid clusters",
    id: "5d3f1697-4507-4d08-bb4a-477695db5f82",
    category: "Containers",
    anchor: "azure-kubernetes-service-arc-contributor-role",
  },
  {
    name: "Azure Kubernetes Service Cluster Admin Role",
    description: "List cluster admin credential action.",
    id: "0ab0b1a8-8aac-4efd-b8c2-3ee1fb270be8",
    category: "Containers",
    anchor: "azure-kubernetes-service-cluster-admin-role",
  },
  {
    name: "Azure Kubernetes Service Cluster Monitoring User",
    description: "List cluster monitoring user credential action.",
    id: "1afdec4b-e479-420e-99e7-f82237c7c5e6",
    category: "Containers",
    anchor: "azure-kubernetes-service-cluster-monitoring-user",
  },
  {
    name: "Azure Kubernetes Service Cluster User Role",
    description: "List cluster user credential action.",
    id: "4abbcc35-e782-43d8-92c5-2d3f1bd2253f",
    category: "Containers",
    anchor: "azure-kubernetes-service-cluster-user-role",
  },
  {
    name: "Azure Kubernetes Service Contributor Role",
    description:
      "Grants access to read and write Azure Kubernetes Service clusters",
    id: "ed7f3fbd-7b88-4dd4-9017-9adb7ce333f8",
    category: "Containers",
    anchor: "azure-kubernetes-service-contributor-role",
  },
  {
    name: "Azure Kubernetes Service Namespace Contributor",
    description:
      "Allows users to create and manage Azure Kubernetes Service namespace resources.",
    id: "289d8817-ee69-43f1-a0af-43a45505b488",
    category: "Containers",
    anchor: "azure-kubernetes-service-namespace-contributor",
  },
  {
    name: "Azure Kubernetes Service Namespace User",
    description:
      "Allows users to read Azure Kubernetes Service namespace resources. In-cluster namespace access further requires assignment of Azure Kubernetes Service RBAC roles to the namespace resource for an Entra ID enabled cluster.",
    id: "c9f76ca8-b262-4b10-8ed2-09cf0948aa35",
    category: "Containers",
    anchor: "azure-kubernetes-service-namespace-user",
  },
  {
    name: "Azure Kubernetes Service RBAC Admin",
    description:
      "Lets you manage all resources under cluster/namespace, except update or delete resource quotas and namespaces.",
    id: "3498e952-d568-435e-9b2c-8d77e338d7f7",
    category: "Containers",
    anchor: "azure-kubernetes-service-rbac-admin",
  },
  {
    name: "Azure Kubernetes Service RBAC Cluster Admin",
    description: "Lets you manage all resources in the cluster.",
    id: "b1ff04bb-8a4e-4dc4-8eb5-8693973ce19b",
    category: "Containers",
    anchor: "azure-kubernetes-service-rbac-cluster-admin",
  },
  {
    name: "Azure Kubernetes Service RBAC Reader",
    description:
      "Allows read-only access to see most objects in a namespace. It does not allow viewing roles or role bindings. This role does not allow viewing Secrets, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation). Applying this role at cluster scope will give access across all namespaces.",
    id: "7f6c6a51-bcf8-42ba-9220-52d62157d7db",
    category: "Containers",
    anchor: "azure-kubernetes-service-rbac-reader",
  },
  {
    name: "Azure Kubernetes Service RBAC Writer",
    description:
      "Allows read/write access to most objects in a namespace. This role does not allow viewing or modifying roles or role bindings. However, this role allows accessing Secrets and running Pods as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace. Applying this role at cluster scope will give access across all namespaces.",
    id: "a7ffa36f-339b-4b5c-8bdf-e2c188b2c0eb",
    category: "Containers",
    anchor: "azure-kubernetes-service-rbac-writer",
  },
  {
    name: "Azure Red Hat OpenShift Cloud Controller Manager",
    description:
      "Manage and update the cloud controller manager deployed on top of OpenShift.",
    id: "a1f96423-95ce-4224-ab27-4e3dc72facd4",
    category: "Containers",
    anchor: "azure-red-hat-openshift-cloud-controller-manager",
  },
  {
    name: "Azure Red Hat OpenShift Cluster Ingress Operator",
    description: "Manage and configure the OpenShift router.",
    id: "0336e1d3-7a87-462b-b6db-342b63f7802c",
    category: "Containers",
    anchor: "azure-red-hat-openshift-cluster-ingress-operator",
  },
  {
    name: "Azure Red Hat OpenShift Disk Storage Operator",
    description:
      "Install Container Storage Interface (CSI) drivers that enable your cluster to use Azure Disks. Set OpenShift cluster-wide storage defaults to ensure a default storageclass exists for clusters.",
    id: "5b7237c5-45e1-49d6-bc18-a1f62f400748",
    category: "Containers",
    anchor: "azure-red-hat-openshift-disk-storage-operator",
  },
  {
    name: "Azure Red Hat OpenShift Federated Credential",
    description:
      "Create, update and delete federated credentials on user assigned managed identities in order to build a trust relationship between the managed identity, OpenID Connect (OIDC), and the service account.",
    id: "ef318e2a-8334-4a05-9e4a-295a196c6a6e",
    category: "Containers",
    anchor: "azure-red-hat-openshift-federated-credential",
  },
  {
    name: "Azure Red Hat OpenShift File Storage Operator",
    description:
      "Install Container Storage Interface (CSI) drivers that enable your cluster to use Azure Files. Set OpenShift cluster-wide storage defaults to ensure a default storageclass exists for clusters.",
    id: "0d7aedc0-15fd-4a67-a412-efad370c947e",
    category: "Containers",
    anchor: "azure-red-hat-openshift-file-storage-operator",
  },
  {
    name: "Azure Red Hat OpenShift Image Registry Operator",
    description:
      "Enables permissions for the operator to manage a singleton instance of the OpenShift image registry. It manages all configuration of the registry, including creating storage.",
    id: "8b32b316-c2f5-4ddf-b05b-83dacd2d08b5",
    category: "Containers",
    anchor: "azure-red-hat-openshift-image-registry-operator",
  },
  {
    name: "Azure Red Hat OpenShift Machine API Operator",
    description:
      "Manage the lifecycle of specific-purpose custom resource definitions (CRD), controllers, and Azure RBAC objects that extend the Kubernetes API to declare the desired state of machines in a cluster.",
    id: "0358943c-7e01-48ba-8889-02cc51d78637",
    category: "Containers",
    anchor: "azure-red-hat-openshift-machine-api-operator",
  },
  {
    name: "Azure Red Hat OpenShift Network Operator",
    description:
      "Install and upgrade the networking components on an OpenShift cluster.",
    id: "be7a6435-15ae-4171-8f30-4a343eff9e8f",
    category: "Containers",
    anchor: "azure-red-hat-openshift-network-operator",
  },
  {
    name: "Azure Red Hat OpenShift Service Operator",
    description:
      "Maintain machine health, network configuration, monitoring, and other features that are specific to an OpenShift cluster's continued functionality as a managed service.",
    id: "4436bae4-7702-4c84-919b-c4069ff25ee2",
    category: "Containers",
    anchor: "azure-red-hat-openshift-service-operator",
  },
  {
    name: "Connected Cluster Managed Identity CheckAccess Reader",
    description:
      "Built-in role that allows a Connected Cluster managed identity to call the checkAccess API",
    id: "65a14201-8f6c-4c28-bec4-12619c5a9aaa",
    category: "Containers",
    anchor: "connected-cluster-managed-identity-checkaccess-reader",
  },
  {
    name: "Container Apps ConnectedEnvironments Contributor",
    description:
      "Full management of Container Apps ConnectedEnvironments, including creation, deletion, and updates.",
    id: "6f4fe6fc-f04f-4d97-8528-8bc18c848dca",
    category: "Containers",
    anchor: "container-apps-connectedenvironments-contributor",
  },
  {
    name: "Container Apps ConnectedEnvironments Reader",
    description: "Read access to Container Apps ConnectedEnvironments.",
    id: "d5adeb5b-107f-4aca-99ea-4e3f4fc008d5",
    category: "Containers",
    anchor: "container-apps-connectedenvironments-reader",
  },
  {
    name: "Container Apps Contributor",
    description:
      "Full management of Container Apps, including creation, deletion, and updates.",
    id: "358470bc-b998-42bd-ab17-a7e34c199c0f",
    category: "Containers",
    anchor: "container-apps-contributor",
  },
  {
    name: "Container Apps Jobs Contributor",
    description:
      "Full management of Container Apps jobs, including creation, deletion, and updates.",
    id: "4e3d2b60-56ae-4dc6-a233-09c8e5a82e68",
    category: "Containers",
    anchor: "container-apps-jobs-contributor",
  },
  {
    name: "Container Apps Jobs Operator",
    description: "Read, start, and stop Container Apps jobs.",
    id: "b9a307c4-5aa3-4b52-ba60-2b17c136cd7b",
    category: "Containers",
    anchor: "container-apps-jobs-operator",
  },
  {
    name: "Container Apps Jobs Reader",
    description: "Read access to ContainerApps jobs",
    id: "edd66693-d32a-450b-997d-0158c03976b0",
    category: "Containers",
    anchor: "container-apps-jobs-reader",
  },
  {
    name: "Container Apps ManagedEnvironments Contributor",
    description:
      "Full management of Container Apps ManagedEnvironments, including creation, deletion, and updates.",
    id: "57cc5028-e6a7-4284-868d-0611c5923f8d",
    category: "Containers",
    anchor: "container-apps-managedenvironments-contributor",
  },
  {
    name: "Container Apps ManagedEnvironments Reader",
    description: "Read access to ContainerApps managedenvironments.",
    id: "1b32c00b-7eff-4c22-93e6-93d11d72d2d8",
    category: "Containers",
    anchor: "container-apps-managedenvironments-reader",
  },
  {
    name: "Container Apps Operator",
    description: "Read, logstream and exec into Container Apps.",
    id: "f3bd1b5c-91fa-40e7-afe7-0c11d331232c",
    category: "Containers",
    anchor: "container-apps-operator",
  },
  {
    name: "Container Apps SessionPools Contributor",
    description:
      "Full management of Container Apps SessionPools, including creation, deletion, and updates.",
    id: "f7669afb-68b2-44b4-9c5f-6d2a47fddda0",
    category: "Containers",
    anchor: "container-apps-sessionpools-contributor",
  },
  {
    name: "Container Apps SessionPools Reader",
    description: "Read access to ContainerApps sessionpools.",
    id: "af61e8fc-2633-4b95-bed3-421ad6826515",
    category: "Containers",
    anchor: "container-apps-sessionpools-reader",
  },
  {
    name: "Container Registry Cache Rule Administrator",
    description:
      "Create, Read, Update, and Delete Cache Rules in Container Registry. This role doesn't grant permissions to manage Credential Sets.",
    id: "df87f177-bb12-4db1-9793-a413691eff94",
    category: "Containers",
    anchor: "container-registry-cache-rule-administrator",
  },
  {
    name: "Container Registry Cache Rule Reader",
    description:
      "Read the configuration of Cache Rules in Container Registry. This permission doesn't grant permission to read Credential Sets.",
    id: "c357b964-0002-4b64-a50d-7a28f02edc52",
    category: "Containers",
    anchor: "container-registry-cache-rule-reader",
  },
  {
    name: "Container Registry Configuration Reader and Data Access Configuration Reader",
    description:
      "Provides permissions to list container registries and registry configuration properties. Provides permissions to list data access configuration such as admin user credentials, scope maps, and tokens, which can be used to read, write or delete repositories and images. Does not provide direct permissions to read, list, or write registry contents including repositories and images. Does not provide permissions to modify data plane content such as imports, Artifact Cache or Sync, and Transfer Pipelines. Does not provide permissions for managing Tasks.",
    id: "69b07be0-09bf-439a-b9a6-e73de851bd59",
    category: "Containers",
    anchor:
      "container-registry-configuration-reader-and-data-access-configuration-reader",
  },
  {
    name: "Container Registry Contributor and Data Access Configuration Administrator",
    description:
      "Provides permissions to create, list, and update container registries and registry configuration properties. Provides permissions to configure data access such as admin user credentials, scope maps, and tokens, which can be used to read, write or delete repositories and images. Does not provide direct permissions to read, list, or write registry contents including repositories and images. Does not provide permissions to modify data plane content such as imports, Artifact Cache or Sync, and Transfer Pipelines. Does not provide permissions for managing Tasks.",
    id: "3bc748fc-213d-45c1-8d91-9da5725539b9",
    category: "Containers",
    anchor:
      "container-registry-contributor-and-data-access-configuration-administrator",
  },
  {
    name: "Container Registry Credential Set Administrator",
    description:
      "Create, Read, Update, and Delete Credential Sets in Container Registry. This role doesn't affect the needed permissions for storing content inside Azure Key Vault. This role also doesn't grant permissions to manage Cache Rules.",
    id: "f094fb07-0703-4400-ad6a-e16dd8000e14",
    category: "Containers",
    anchor: "container-registry-credential-set-administrator",
  },
  {
    name: "Container Registry Credential Set Reader",
    description:
      "Read the configuration of Credential Sets in Container Registry. This permission doesn't allow permission to see content inside Azure Key vault only the content inside Container Registry. This permission doesn't grant permission to read Cache Rules.",
    id: "29093635-9924-4f2c-913b-650a12949526",
    category: "Containers",
    anchor: "container-registry-credential-set-reader",
  },
  {
    name: "Container Registry Data Importer and Data Reader",
    description:
      "Provides the ability to import images into a registry through the registry import operation. Provides the ability to list repositories, view images and tags, get manifests, and pull images. Does not provide permissions for importing images through configuring registry transfer pipelines such as import and export pipelines. Does not provide permissions for importing through configuring Artifact Cache or Sync rules.",
    id: "577a9874-89fd-4f24-9dbd-b5034d0ad23a",
    category: "Containers",
    anchor: "container-registry-data-importer-and-data-reader",
  },
  {
    name: "Container Registry Repository Catalog Lister",
    description:
      "Allows for listing all repositories in an Azure Container Registry.",
    id: "bfdb9389-c9a5-478a-bb2f-ba9ca092c3c7",
    category: "Containers",
    anchor: "container-registry-repository-catalog-lister",
  },
  {
    name: "Container Registry Repository Contributor",
    description:
      "Allows for read, write, and delete access to Azure Container Registry repositories, but excluding catalog listing.",
    id: "2efddaa5-3f1f-4df3-97df-af3f13818f4c",
    category: "Containers",
    anchor: "container-registry-repository-contributor",
  },
  {
    name: "Container Registry Repository Reader",
    description:
      "Allows for read access to Azure Container Registry repositories, but excluding catalog listing.",
    id: "b93aa761-3e63-49ed-ac28-beffa264f7ac",
    category: "Containers",
    anchor: "container-registry-repository-reader",
  },
  {
    name: "Container Registry Repository Writer",
    description:
      "Allows for read and write access to Azure Container Registry repositories, but excluding catalog listing.",
    id: "2a1e307c-b015-4ebd-883e-5b7698a07328",
    category: "Containers",
    anchor: "container-registry-repository-writer",
  },
  {
    name: "Container Registry Tasks Contributor",
    description:
      "Provides permissions to configure, read, list, trigger, or cancel Container Registry Tasks, Task Runs, Task Logs, Quick Runs, Quick Builds, and Task Agent Pools. Permissions granted for Tasks management can be used for full registry data plane permissions including reading/writing/deleting container images in registries. Permissions granted for Tasks management can also be used to run customer authored build directives and run scripts to build software artifacts.",
    id: "fb382eab-e894-4461-af04-94435c366c3f",
    category: "Containers",
    anchor: "container-registry-tasks-contributor",
  },
  {
    name: "Container Registry Transfer Pipeline Contributor",
    description:
      "Provides the ability to transfer, import, and export artifacts through configuring registry transfer pipelines that involve intermediary storage accounts and key vaults. Does not provide permissions to push or pull images. Does not provide permissions to create, manage, or list storage accounts or key vaults. Does not provide permissions to perform role assignments.",
    id: "bf94e731-3a51-4a7c-8c54-a1ab9971dfc1",
    category: "Containers",
    anchor: "container-registry-transfer-pipeline-contributor",
  },
  {
    name: "Defender Kubernetes API Access",
    description:
      "Grants Microsoft Defender for Cloud access to Azure Kubernetes Services",
    id: "d5a2ae44-610b-4500-93be-660a0c5f5ca6",
    category: "Containers",
    anchor: "defender-kubernetes-api-access",
  },
  {
    name: "Kubernetes Cluster - Azure Arc Onboarding",
    description:
      "Role definition to authorize any user/service to create connectedClusters resource",
    id: "34e09817-6cbe-4d01-b1a2-e0eac5743d41",
    category: "Containers",
    anchor: "kubernetes-cluster---azure-arc-onboarding",
  },
  {
    name: "Kubernetes Extension Contributor",
    description:
      "Can create, update, get, list and delete Kubernetes Extensions, and get extension async operations",
    id: "85cb6faf-e071-4c9b-8136-154b5a04f717",
    category: "Containers",
    anchor: "kubernetes-extension-contributor",
  },
  {
    name: "Service Fabric Cluster Contributor",
    description:
      "Manage your Service Fabric Cluster resources. Includes clusters, application types, application type versions, applications, and services. You will need additional permissions to deploy and manage the cluster's underlying resources such as virtual machine scale sets, storage accounts, networks, etc.",
    id: "b6efc156-f0da-4e90-a50a-8c000140b017",
    category: "Containers",
    anchor: "service-fabric-cluster-contributor",
  },
  {
    name: "Service Fabric Managed Cluster Contributor",
    description:
      "Deploy and manage your Service Fabric Managed Cluster resources. Includes managed clusters, node types, application types, application type versions, applications, and services.",
    id: "83f80186-3729-438c-ad2d-39e94d718838",
    category: "Containers",
    anchor: "service-fabric-managed-cluster-contributor",
  },
  {
    name: "Azure Connected SQL Server Onboarding",
    description:
      "Allows for read and write access to Azure resources for SQL Server on Arc-enabled servers.",
    id: "e8113dce-c529-4d33-91fa-e9b972617508",
    category: "Databases",
    anchor: "azure-connected-sql-server-onboarding",
  },
  {
    name: "Azure Managed Redis Contributor",
    description:
      "Create and manage Azure Managed Redis resources. Cannot read or write data stored in the cache.",
    id: "3015e5ed-6856-4ab3-b2f0-b8492aa30ca6",
    category: "Databases",
    anchor: "azure-managed-redis-contributor",
  },
  {
    name: "Azure Managed Redis Reader",
    description:
      "Read Azure Managed Redis resources and their configuration. Cannot modify resources, retrieve access keys, or read data stored in the cache.",
    id: "f287ba2f-f923-4464-a5bd-721c3951d32d",
    category: "Databases",
    anchor: "azure-managed-redis-reader",
  },
  {
    name: "Cosmos DB Account Reader Role",
    description:
      "Can read Azure Cosmos DB account data. See DocumentDB Account Contributor for managing Azure Cosmos DB accounts.",
    id: "fbdf93bf-df7d-467e-a4d2-9458aa1360c8",
    category: "Databases",
    anchor: "cosmos-db-account-reader-role",
  },
  {
    name: "Cosmos DB Operator",
    description:
      "Lets you manage Azure Cosmos DB accounts, but not access data in them. Prevents access to account keys and connection strings.",
    id: "230815da-be43-4aae-9cb4-875f7bd000aa",
    category: "Databases",
    anchor: "cosmos-db-operator",
  },
  {
    name: "CosmosBackupOperator",
    description:
      "Can submit restore request for a Cosmos DB database or a container for an account",
    id: "db7b14f2-5adf-42da-9f96-f2ee17bab5cb",
    category: "Databases",
    anchor: "cosmosbackupoperator",
  },
  {
    name: "CosmosRestoreOperator",
    description:
      "Can perform restore action for Cosmos DB database account with continuous backup mode",
    id: "5432c526-bc82-444a-b7ba-57c5b0b5b34f",
    category: "Databases",
    anchor: "cosmosrestoreoperator",
  },
  {
    name: "DocumentDB Account Contributor",
    description:
      "Can manage Azure Cosmos DB accounts. Azure Cosmos DB is formerly known as DocumentDB.",
    id: "5bd9cd88-fe45-4216-938b-f97437e15450",
    category: "Databases",
    anchor: "documentdb-account-contributor",
  },
  {
    name: "PostgreSQL Flexible Server Long Term Retention Backup Role",
    description:
      "Role to allow backup vault to access PostgreSQL Flexible Server Resource APIs for Long Term Retention Backup.",
    id: "c088a766-074b-43ba-90d4-1fb21feae531",
    category: "Databases",
    anchor: "postgresql-flexible-server-long-term-retention-backup-role",
  },
  {
    name: "Redis Cache Contributor",
    description:
      "Create and manage Azure Cache for Redis resources. Cannot read or write data stored in the cache.",
    id: "e0f68234-74aa-48ed-b826-c38b57376e17",
    category: "Databases",
    anchor: "redis-cache-contributor",
  },
  {
    name: "Semantic Reranker User",
    description:
      "Execute semantic reranking operations against registered inference accounts. This role should be assigned to users who need to run semantic reranking workloads but do not need to manage the accounts themselves.",
    id: "6c74a7c5-4a87-40f9-bb03-61e49aecbc78",
    category: "Databases",
    anchor: "semantic-reranker-user",
  },
  {
    name: "SQL DB Contributor",
    description:
      "Lets you manage SQL databases, but not access to them. Also, you can't manage their security-related policies or their parent SQL servers.",
    id: "9b7fa17d-e63e-47b0-bb0a-15c516ac86ec",
    category: "Databases",
    anchor: "sql-db-contributor",
  },
  {
    name: "SQL Managed Instance Contributor",
    description:
      "Lets you manage SQL Managed Instances and required network configuration, but can't give access to others.",
    id: "4939a1f6-9ae0-4e48-a1e0-f2cbe897382d",
    category: "Databases",
    anchor: "sql-managed-instance-contributor",
  },
  {
    name: "SQL Security Manager",
    description:
      "Lets you manage the security-related policies of SQL servers and databases, but not access to them.",
    id: "056cd41c-7e88-42e1-933e-88ba6a50c9c3",
    category: "Databases",
    anchor: "sql-security-manager",
  },
  {
    name: "SQL Server Contributor",
    description:
      "Lets you manage SQL servers and databases, but not access to them, and not their security-related policies.",
    id: "6d8ee4ec-f05a-4a1d-8b00-a9b17e38b437",
    category: "Databases",
    anchor: "sql-server-contributor",
  },
  {
    name: "Azure Event Hubs Data Owner",
    description: "Allows for full access to Azure Event Hubs resources.",
    id: "f526a384-b230-433a-b45c-95f59c4a2dec",
    category: "Analytics",
    anchor: "azure-event-hubs-data-owner",
  },
  {
    name: "Azure Event Hubs Data Receiver",
    description: "Allows receive access to Azure Event Hubs resources.",
    id: "a638d3c7-ab3a-418d-83e6-5f17a39d4fde",
    category: "Analytics",
    anchor: "azure-event-hubs-data-receiver",
  },
  {
    name: "Azure Event Hubs Data Sender",
    description: "Allows send access to Azure Event Hubs resources.",
    id: "2b629674-e913-4c01-ae53-ef4638d8f975",
    category: "Analytics",
    anchor: "azure-event-hubs-data-sender",
  },
  {
    name: "Data Factory Contributor",
    description:
      "Create and manage data factories, as well as child resources within them.",
    id: "673868aa-7521-48a0-acc6-0f60742d39f5",
    category: "Analytics",
    anchor: "data-factory-contributor",
  },
  {
    name: "HDInsight Cluster Operator",
    description: "Lets you read and modify HDInsight cluster configurations.",
    id: "61ed4efc-fab3-44fd-b111-e24485cc132a",
    category: "Analytics",
    anchor: "hdinsight-cluster-operator",
  },
  {
    name: "HDInsight Domain Services Contributor",
    description:
      "Can Read, Create, Modify and Delete Domain Services related operations needed for HDInsight Enterprise Security Package",
    id: "8d8d5a11-05d3-4bda-a417-a08778121c7c",
    category: "Analytics",
    anchor: "hdinsight-domain-services-contributor",
  },
  {
    name: "HDInsight on AKS Cluster Admin",
    description:
      "Grants a user/group the ability to create, delete and manage clusters within a given cluster pool. Cluster Admin can also run workloads, monitor, and manage all user activity on these clusters.",
    id: "fd036e6b-1266-47a0-b0bb-a05d04831731",
    category: "Analytics",
    anchor: "hdinsight-on-aks-cluster-admin",
  },
  {
    name: "HDInsight on AKS Cluster Pool Admin",
    description:
      "Can read, create, modify and delete HDInsight on AKS cluster pools and create clusters",
    id: "7656b436-37d4-490a-a4ab-d39f838f0042",
    category: "Analytics",
    anchor: "hdinsight-on-aks-cluster-pool-admin",
  },
  {
    name: "Schema Registry Contributor",
    description: "Read, write, and delete Schema Registry groups and schemas.",
    id: "5dffeca3-4936-4216-b2bc-10343a5abb25",
    category: "Analytics",
    anchor: "schema-registry-contributor",
  },
  {
    name: "Schema Registry Reader",
    description: "Read and list Schema Registry groups and schemas.",
    id: "2c56ea50-c6b3-40a6-83c0-9d98858bc7d2",
    category: "Analytics",
    anchor: "schema-registry-reader",
  },
  {
    name: "Stream Analytics Query Tester",
    description:
      "Lets you perform query testing without creating a stream analytics job first",
    id: "1ec5b3c1-b17e-4e25-8312-2acb3c3c5abf",
    category: "Analytics",
    anchor: "stream-analytics-query-tester",
  },
  {
    name: "Azure AI Administrator",
    description:
      "A Built-In Role that has all control plane permissions to work with Azure AI and its dependencies. Applies to Azure Machine Learning and Foundry hubs only.",
    id: "b78c5d69-af96-48a3-bf8d-a8b4d589de94",
    category: "AI + machine learning",
    anchor: "azure-ai-administrator",
  },
  {
    name: "Azure AI Developer",
    description:
      "Can perform all actions within an Azure Machine Learning workspace besides managing the workspace itself. For Foundry project access, use the Foundry User or Foundry Owner roles instead.",
    id: "64702f94-c441-49e6-a78b-ef80e0188fee",
    category: "AI + machine learning",
    anchor: "azure-ai-developer",
  },
  {
    name: "Azure AI Enterprise Network Connection Approver",
    description:
      "Can approve private endpoint connections to Azure AI common dependency resources",
    id: "b556d68e-0be0-4f35-a333-ad7ee1ce17ea",
    category: "AI + machine learning",
    anchor: "azure-ai-enterprise-network-connection-approver",
  },
  {
    name: "Azure AI Inference Deployment Operator",
    description:
      "Can perform all actions required to create a resource deployment within a resource group.",
    id: "3afb7f49-54cb-416e-8c09-6dc049efa503",
    category: "AI + machine learning",
    anchor: "azure-ai-inference-deployment-operator",
  },
  {
    name: "AzureML Compute Operator",
    description:
      "Can access and perform CRUD operations on Machine Learning Services managed compute resources (including Notebook VMs).",
    id: "e503ece1-11d0-4e8e-8e2c-7a6c3bf38815",
    category: "AI + machine learning",
    anchor: "azureml-compute-operator",
  },
  {
    name: "AzureML Data Scientist",
    description:
      "Can perform all actions within an Azure Machine Learning workspace, except for creating or deleting compute resources and modifying the workspace itself.",
    id: "f6c7c914-8db3-469d-8ca1-694a8f32e121",
    category: "AI + machine learning",
    anchor: "azureml-data-scientist",
  },
  {
    name: "AzureML Metrics Writer (preview)",
    description: "Lets you write metrics to AzureML workspace",
    id: "635dd51f-9968-44d3-b7fb-6d9a6bd613ae",
    category: "AI + machine learning",
    anchor: "azureml-metrics-writer-preview",
  },
  {
    name: "AzureML Registry User",
    description:
      "Can perform all actions on Machine Learning Services Registry assets as well as get Registry resources.",
    id: "1823dd4f-9b8c-4ab6-ab4e-7397a3684615",
    category: "AI + machine learning",
    anchor: "azureml-registry-user",
  },
  {
    name: "Cognitive Services Contributor",
    description:
      "Lets you create, read, update, delete and manage keys of Cognitive Services.",
    id: "25fbc0a9-bd7c-42a3-aa1a-3b75d497ee68",
    category: "AI + machine learning",
    anchor: "cognitive-services-contributor",
  },
  {
    name: "Cognitive Services Custom Vision Contributor",
    description:
      "Full access to the project, including the ability to view, create, edit, or delete projects.",
    id: "c1ff6cc2-c111-46fe-8896-e0ef812ad9f3",
    category: "AI + machine learning",
    anchor: "cognitive-services-custom-vision-contributor",
  },
  {
    name: "Cognitive Services Custom Vision Deployment",
    description:
      "Publish, unpublish or export models. Deployment can view the project but can't update.",
    id: "5c4089e1-6d96-4d2f-b296-c1bc7137275f",
    category: "AI + machine learning",
    anchor: "cognitive-services-custom-vision-deployment",
  },
  {
    name: "Cognitive Services Custom Vision Labeler",
    description:
      "View, edit training images and create, add, remove, or delete the image tags. Labelers can view the project but can't update anything other than training images and tags.",
    id: "88424f51-ebe7-446f-bc41-7fa16989e96c",
    category: "AI + machine learning",
    anchor: "cognitive-services-custom-vision-labeler",
  },
  {
    name: "Cognitive Services Custom Vision Reader",
    description:
      "Read-only actions in the project. Readers can't create or update the project.",
    id: "93586559-c37d-4a6b-ba08-b9f0940c2d73",
    category: "AI + machine learning",
    anchor: "cognitive-services-custom-vision-reader",
  },
  {
    name: "Cognitive Services Custom Vision Trainer",
    description:
      "View, edit projects and train the models, including the ability to publish, unpublish, export the models. Trainers can't create or delete the project.",
    id: "0a5ae4ab-0d65-4eeb-be61-29fc9b54394b",
    category: "AI + machine learning",
    anchor: "cognitive-services-custom-vision-trainer",
  },
  {
    name: "Cognitive Services Data Reader",
    description: "Lets you read Cognitive Services data.",
    id: "b59867f0-fa02-499b-be73-45a86b5b3e1c",
    category: "AI + machine learning",
    anchor: "cognitive-services-data-reader",
  },
  {
    name: "Cognitive Services Face Recognizer",
    description:
      "Lets you perform detect, verify, identify, group, and find similar operations on Face API. This role does not allow create or delete operations, which makes it well suited for endpoints that only need inferencing capabilities, following 'least privilege' best practices.",
    id: "9894cab4-e18a-44aa-828b-cb588cd6f2d7",
    category: "AI + machine learning",
    anchor: "cognitive-services-face-recognizer",
  },
  {
    name: "Cognitive Services Immersive Reader User",
    description:
      "Provides access to create Immersive Reader sessions and call APIs",
    id: "b2de6794-95db-4659-8781-7e080d3f2b9d",
    category: "AI + machine learning",
    anchor: "cognitive-services-immersive-reader-user",
  },
  {
    name: "Cognitive Services Language Owner",
    description:
      "Has access to all Read, Test, Write, Deploy and Delete functions under Language portal",
    id: "f07febfe-79bc-46b1-8b37-790e26e6e498",
    category: "AI + machine learning",
    anchor: "cognitive-services-language-owner",
  },
  {
    name: "Cognitive Services Language Reader",
    description: "Has access to Read and Test functions under Language portal",
    id: "7628b7b8-a8b2-4cdc-b46f-e9b35248918e",
    category: "AI + machine learning",
    anchor: "cognitive-services-language-reader",
  },
  {
    name: "Cognitive Services Language Writer",
    description:
      "Has access to all Read, Test, and Write functions under Language Portal",
    id: "f2310ca1-dc64-4889-bb49-c8e0fa3d47a8",
    category: "AI + machine learning",
    anchor: "cognitive-services-language-writer",
  },
  {
    name: "Cognitive Services LUIS Owner",
    description:
      "Has access to all Read, Test, Write, Deploy and Delete functions under LUIS",
    id: "f72c8140-2111-481c-87ff-72b910f6e3f8",
    category: "AI + machine learning",
    anchor: "cognitive-services-luis-owner",
  },
  {
    name: "Cognitive Services LUIS Reader",
    description: "Has access to Read and Test functions under LUIS.",
    id: "18e81cdc-4e98-4e29-a639-e7d10c5a6226",
    category: "AI + machine learning",
    anchor: "cognitive-services-luis-reader",
  },
  {
    name: "Cognitive Services LUIS Writer",
    description: "Has access to all Read, Test, and Write functions under LUIS",
    id: "6322a993-d5c9-4bed-b113-e49bbea25b27",
    category: "AI + machine learning",
    anchor: "cognitive-services-luis-writer",
  },
  {
    name: "Cognitive Services Metrics Advisor Administrator",
    description:
      "Full access to the project, including the system level configuration.",
    id: "cb43c632-a144-4ec5-977c-e80c4affc34a",
    category: "AI + machine learning",
    anchor: "cognitive-services-metrics-advisor-administrator",
  },
  {
    name: "Cognitive Services Metrics Advisor User",
    description: "Access to the project.",
    id: "3b20f47b-3825-43cb-8114-4bd2201156a8",
    category: "AI + machine learning",
    anchor: "cognitive-services-metrics-advisor-user",
  },
  {
    name: "Cognitive Services OpenAI Contributor",
    description:
      "Full access including the ability to fine-tune, deploy and generate text",
    id: "a001fd3d-188f-4b5d-821b-7da978bf7442",
    category: "AI + machine learning",
    anchor: "cognitive-services-openai-contributor",
  },
  {
    name: "Cognitive Services OpenAI User",
    description:
      "Read access to view files, models, deployments. The ability to create completion and embedding calls.",
    id: "5e0bd9bd-7b93-4f28-af87-19fc36ad61bd",
    category: "AI + machine learning",
    anchor: "cognitive-services-openai-user",
  },
  {
    name: "Cognitive Services QnA Maker Editor",
    description:
      "Let's you create, edit, import and export a KB. You cannot publish or delete a KB.",
    id: "f4cc2bf9-21be-47a1-bdf1-5c5804381025",
    category: "AI + machine learning",
    anchor: "cognitive-services-qna-maker-editor",
  },
  {
    name: "Cognitive Services QnA Maker Reader",
    description: "Let's you read and test a KB only.",
    id: "466ccd10-b268-4a11-b098-b4849f024126",
    category: "AI + machine learning",
    anchor: "cognitive-services-qna-maker-reader",
  },
  {
    name: "Cognitive Services Speech Contributor",
    description:
      "Full access to Speech projects, including read, write and delete all entities, for real-time speech recognition and batch transcription tasks, real-time speech synthesis and long audio tasks, custom speech and custom voice.",
    id: "0e75ca1e-0464-4b4d-8b93-68208a576181",
    category: "AI + machine learning",
    anchor: "cognitive-services-speech-contributor",
  },
  {
    name: "Cognitive Services Speech User",
    description:
      "Access to the real-time speech recognition and batch transcription APIs, real-time speech synthesis and long audio APIs, as well as to read the data/test/model/endpoint for custom models, but can't create, delete or modify the data/test/model/endpoint for custom models.",
    id: "f2dc8367-1007-4938-bd23-fe263f013447",
    category: "AI + machine learning",
    anchor: "cognitive-services-speech-user",
  },
  {
    name: "Cognitive Services Usages Reader",
    description: "Minimal permission to view Cognitive Services usages.",
    id: "bba48692-92b0-4667-a9ad-c31c7b334ac2",
    category: "AI + machine learning",
    anchor: "cognitive-services-usages-reader",
  },
  {
    name: "Cognitive Services User",
    description: "Lets you read and list keys of Cognitive Services.",
    id: "a97b65f3-24c7-4388-baec-2e87135dc908",
    category: "AI + machine learning",
    anchor: "cognitive-services-user",
  },
  {
    name: "Foundry Account Owner",
    description:
      "Grants full access to manage AI projects and accounts. Includes an ABAC condition to constrain role assignments. Grants conditional assignment of the Foundry User role to other user principles. Applies for new Foundry resources.",
    id: "e47c6f54-e4a2-4754-9501-8e0985b135e1",
    category: "AI + machine learning",
    anchor: "foundry-account-owner",
  },
  {
    name: "Foundry Owner",
    description:
      "Grants full to manage AI project and accounts. Grants reader access to AI projects, reader access to AI accounts, and data actions for an AI project. Applies for new Foundry resources.",
    id: "c883944f-8b7b-4483-af10-35834be79c4a",
    category: "AI + machine learning",
    anchor: "foundry-owner",
  },
  {
    name: "Foundry Project Manager",
    description:
      "Lets you perform developer actions and management actions on Foundry Projects. Includes an ABAC condition to constrain role assignments. Allows for making role assignments, but limited to Foundry User role. Applies for new Foundry resources.",
    id: "eadc314b-1a2d-4efa-be10-5d325db5065e",
    category: "AI + machine learning",
    anchor: "foundry-project-manager",
  },
  {
    name: "Foundry User",
    description:
      "Grants reader access to Foundry projects, reader access to Foundry accounts, and data actions for an Foundry project.",
    id: "53ca6127-db72-4b80-b1b0-d745d6d5456d",
    category: "AI + machine learning",
    anchor: "foundry-user",
  },
  {
    name: "Healthcare Agent Admin",
    description:
      "Users with admin access can sign in, view and edit all of the bot resources, scenarios and configuration setting including the bot instance keys & secrets.",
    id: "f1082fec-a70f-419f-9230-885d2550fb38",
    category: "AI + machine learning",
    anchor: "healthcare-agent-admin",
  },
  {
    name: "Healthcare Agent Editor",
    description:
      "Users with editor access can sign in, view and edit all the bot resources, scenarios and configuration setting except for the bot instance keys & secrets and the end-user inputs (including Feedback, Unrecognized utterances and Conversation logs). A read-only access to the bot skills and channels.",
    id: "af854a69-80ce-4ff7-8447-f1118a2e0ca8",
    category: "AI + machine learning",
    anchor: "healthcare-agent-editor",
  },
  {
    name: "Healthcare Agent Reader",
    description:
      "Users with reader access can sign in, have read-only access to the bot resources, scenarios and configuration setting except for the bot instance keys & secrets (including Authentication, Data Connection and Channels keys) and the end-user inputs (including Feedback, Unrecognized utterances and Conversation logs).",
    id: "eb5a76d5-50e7-4c33-a449-070e7c9c4cf2",
    category: "AI + machine learning",
    anchor: "healthcare-agent-reader",
  },
  {
    name: "Search Index Data Contributor",
    description: "Grants full access to Azure Cognitive Search index data.",
    id: "8ebe5a00-799e-43f5-93ac-243d3dce84a7",
    category: "AI + machine learning",
    anchor: "search-index-data-contributor",
  },
  {
    name: "Search Index Data Reader",
    description: "Grants read access to Azure Cognitive Search index data.",
    id: "1407120a-92aa-4202-b7e9-c0e197c71c8f",
    category: "AI + machine learning",
    anchor: "search-index-data-reader",
  },
  {
    name: "Search Service Contributor",
    description: "Lets you manage Search services, but not access to them.",
    id: "7ca78c08-252a-4471-8644-bb5ff32d4ba0",
    category: "AI + machine learning",
    anchor: "search-service-contributor",
  },
  {
    name: "Azure Device Registry Administrator",
    description: "Azure Device Registry Administrator",
    id: "12675fd7-7f59-493f-9201-f7944860a2f1",
    category: "Internet of Things",
    anchor: "azure-device-registry-administrator",
  },
  {
    name: "Azure Device Registry Contributor",
    description:
      "Allows for full access to IoT devices within Azure Device Registry Namespace.",
    id: "a5c3590a-3a1a-4cd4-9648-ea0a32b15137",
    category: "Internet of Things",
    anchor: "azure-device-registry-contributor",
  },
  {
    name: "Azure Device Registry Credentials Contributor",
    description:
      "Allows for full access to manage credentials and policies within Azure Device Registry Namespace.",
    id: "09267e11-2e06-40b5-8fe4-68cea20794c9",
    category: "Internet of Things",
    anchor: "azure-device-registry-credentials-contributor",
  },
  {
    name: "Azure Device Registry Onboarding",
    description:
      "Allows for full access to Azure Device Registry Namespace and X.509 certificate provisioning.",
    id: "547f7f0a-69c0-4807-bd9e-0321dfb66a84",
    category: "Internet of Things",
    anchor: "azure-device-registry-onboarding",
  },
  {
    name: "Azure Digital Twins Data Owner",
    description: "Full access role for Digital Twins data-plane",
    id: "bcd981a7-7f74-457b-83e1-cceb9e632ffe",
    category: "Internet of Things",
    anchor: "azure-digital-twins-data-owner",
  },
  {
    name: "Azure Digital Twins Data Reader",
    description: "Read-only role for Digital Twins data-plane properties",
    id: "d57506d4-4c8d-48b1-8587-93c323f6a5a3",
    category: "Internet of Things",
    anchor: "azure-digital-twins-data-reader",
  },
  {
    name: "Azure IoT Operations Administrator",
    description:
      "View, create, edit and delete AIO resources. Manage all resources, including instance and its downstream resources.",
    id: "5bc02df6-6cd5-43fe-ad3d-4c93cf56cc16",
    category: "Internet of Things",
    anchor: "azure-iot-operations-administrator",
  },
  {
    name: "Azure IoT Operations Onboarding",
    description:
      "User can Azure arc connect and deploy Azure IoT Operations securely.",
    id: "7b7c71ed-33fa-4ed2-a91a-e56d5da260b5",
    category: "Internet of Things",
    anchor: "azure-iot-operations-onboarding",
  },
  {
    name: "Device Provisioning Service Data Contributor",
    description:
      "Allows for full access to Device Provisioning Service data-plane operations.",
    id: "dfce44e4-17b7-4bd1-a6d1-04996ec95633",
    category: "Internet of Things",
    anchor: "device-provisioning-service-data-contributor",
  },
  {
    name: "Device Provisioning Service Data Reader",
    description:
      "Allows for full read access to Device Provisioning Service data-plane properties.",
    id: "10745317-c249-44a1-a5ce-3a4353c0bbd8",
    category: "Internet of Things",
    anchor: "device-provisioning-service-data-reader",
  },
  {
    name: "Device Update Administrator",
    description: "Gives you full access to management and content operations",
    id: "02ca0879-e8e4-47a5-a61e-5c618b76e64a",
    category: "Internet of Things",
    anchor: "device-update-administrator",
  },
  {
    name: "Device Update Content Administrator",
    description: "Gives you full access to content operations",
    id: "0378884a-3af5-44ab-8323-f5b22f9f3c98",
    category: "Internet of Things",
    anchor: "device-update-content-administrator",
  },
  {
    name: "Device Update Content Reader",
    description:
      "Gives you read access to content operations, but does not allow making changes",
    id: "d1ee9a80-8b14-47f0-bdc2-f4a351625a7b",
    category: "Internet of Things",
    anchor: "device-update-content-reader",
  },
  {
    name: "Device Update Deployments Administrator",
    description: "Gives you full access to management operations",
    id: "e4237640-0e3d-4a46-8fda-70bc94856432",
    category: "Internet of Things",
    anchor: "device-update-deployments-administrator",
  },
  {
    name: "Device Update Deployments Reader",
    description:
      "Gives you read access to management operations, but does not allow making changes",
    id: "49e2f5d2-7741-4835-8efa-19e1fe35e47f",
    category: "Internet of Things",
    anchor: "device-update-deployments-reader",
  },
  {
    name: "Device Update Reader",
    description:
      "Gives you read access to management and content operations, but does not allow making changes",
    id: "e9dba6fb-3d52-4cf0-bce3-f06ce71b9e0f",
    category: "Internet of Things",
    anchor: "device-update-reader",
  },
  {
    name: "Firmware Analysis Admin",
    description:
      "Administrative user that can upload/view firmwares & configure firmware workspaces",
    id: "9c1607d1-791d-4c68-885d-c7b7aaff7c8a",
    category: "Internet of Things",
    anchor: "firmware-analysis-admin",
  },
  {
    name: "Firmware Analysis Reader",
    description:
      "View firmware images but not upload them or perform any workspace configuration",
    id: "2a94a2fd-3c4f-45d1-847d-6585ba88af94",
    category: "Internet of Things",
    anchor: "firmware-analysis-reader",
  },
  {
    name: "Firmware Analysis User",
    description:
      "Upload and analyze firmware images but not perform any workspace configuration",
    id: "53b2724d-1e51-44fa-b586-bcace0c82609",
    category: "Internet of Things",
    anchor: "firmware-analysis-user",
  },
  {
    name: "IoT Hub Data Contributor",
    description: "Allows for full access to IoT Hub data plane operations.",
    id: "4fc6c259-987e-4a07-842e-c321cc9d413f",
    category: "Internet of Things",
    anchor: "iot-hub-data-contributor",
  },
  {
    name: "IoT Hub Data Reader",
    description: "Allows for full read access to IoT Hub data-plane properties",
    id: "b447c946-2db7-41ec-983d-d8bf3b1c77e3",
    category: "Internet of Things",
    anchor: "iot-hub-data-reader",
  },
  {
    name: "IoT Hub Registry Contributor",
    description: "Allows for full access to IoT Hub device registry.",
    id: "4ea46cd5-c1b2-4a8e-910b-273211f9ce47",
    category: "Internet of Things",
    anchor: "iot-hub-registry-contributor",
  },
  {
    name: "IoT Hub Twin Contributor",
    description:
      "Allows for read and write access to all IoT Hub device and module twins.",
    id: "494bdba2-168f-4f31-a0a1-191d2f7c028c",
    category: "Internet of Things",
    anchor: "iot-hub-twin-contributor",
  },
  {
    name: "API Management Developer Portal Content Editor",
    description:
      "Can customize the developer portal, edit its content, and publish it.",
    id: "c031e6a8-4391-4de0-8d69-4706a7ed3729",
    category: "Integration",
    anchor: "api-management-developer-portal-content-editor",
  },
  {
    name: "API Management Service Contributor",
    description: "Can manage service and the APIs",
    id: "312a565d-c81f-4fd8-895a-4e21e48d571c",
    category: "Integration",
    anchor: "api-management-service-contributor",
  },
  {
    name: "API Management Service Operator Role",
    description: "Can manage service but not the APIs",
    id: "e022efe7-f5ba-4159-bbe4-b44f577e9b61",
    category: "Integration",
    anchor: "api-management-service-operator-role",
  },
  {
    name: "API Management Service Reader Role",
    description: "Read-only access to service and APIs",
    id: "71522526-b88f-4d52-b57f-d31fc3546d0d",
    category: "Integration",
    anchor: "api-management-service-reader-role",
  },
  {
    name: "API Management Service Workspace API Developer",
    description:
      "Has read access to tags and products and write access to allow: assigning APIs to products, assigning tags to products and APIs. This role should be assigned on the service scope.",
    id: "9565a273-41b9-4368-97d2-aeb0c976a9b3",
    category: "Integration",
    anchor: "api-management-service-workspace-api-developer",
  },
  {
    name: "API Management Service Workspace API Product Manager",
    description:
      "Has the same access as API Management Service Workspace API Developer as well as read access to users and write access to allow assigning users to groups. This role should be assigned on the service scope.",
    id: "d59a3e9c-6d52-4a5a-aeed-6bf3cf0e31da",
    category: "Integration",
    anchor: "api-management-service-workspace-api-product-manager",
  },
  {
    name: "API Management Workspace API Developer",
    description:
      "Has read access to entities in the workspace and read and write access to entities for editing APIs. This role should be assigned on the workspace scope.",
    id: "56328988-075d-4c6a-8766-d93edd6725b6",
    category: "Integration",
    anchor: "api-management-workspace-api-developer",
  },
  {
    name: "API Management Workspace API Product Manager",
    description:
      "Has read access to entities in the workspace and read and write access to entities for publishing APIs. This role should be assigned on the workspace scope.",
    id: "73c2c328-d004-4c5e-938c-35c6f5679a1f",
    category: "Integration",
    anchor: "api-management-workspace-api-product-manager",
  },
  {
    name: "API Management Workspace Contributor",
    description:
      "Can manage the workspace and view, but not modify its members. This role should be assigned on the workspace scope.",
    id: "0c34c906-8d99-4cb7-8bb7-33f5b0a1a799",
    category: "Integration",
    anchor: "api-management-workspace-contributor",
  },
  {
    name: "API Management Workspace Reader",
    description:
      "Has read-only access to entities in the workspace. This role should be assigned on the workspace scope.",
    id: "ef1c2c96-4a77-49e8-b9a4-6179fe1d2fd2",
    category: "Integration",
    anchor: "api-management-workspace-reader",
  },
  {
    name: "App Configuration Contributor",
    description:
      "Grants permission for all management operations, except purge, for App Configuration resources. This role does not grant access to data plane resources such as key-values, snapshots, and feature flags.",
    id: "fe86443c-f201-4fc4-9d2a-ac61149fbda0",
    category: "Integration",
    anchor: "app-configuration-contributor",
  },
  {
    name: "App Configuration Data Owner",
    description: "Allows full access to App Configuration data.",
    id: "5ae67dd6-50cb-40e7-96ff-dc2bfa4b606b",
    category: "Integration",
    anchor: "app-configuration-data-owner",
  },
  {
    name: "App Configuration Data Reader",
    description: "Allows read access to App Configuration data.",
    id: "516239f1-63e1-4d78-a4de-a74fb236a071",
    category: "Integration",
    anchor: "app-configuration-data-reader",
  },
  {
    name: "App Configuration Reader",
    description:
      "Grants permission for read operations for App Configuration resources. This role does not grant access to data plane resources such as key-values, snapshots, and feature flags.",
    id: "175b81b9-6e0d-490a-85e4-0d422273c10c",
    category: "Integration",
    anchor: "app-configuration-reader",
  },
  {
    name: "Azure API Center Compliance Manager",
    description:
      "Grants reader access to AI projects, reader access to AI accounts, and data actions for an AI project. Applies for new Foundry resources.",
    id: "ede9aaa3-4627-494e-be13-4aa7c256148d",
    category: "Integration",
    anchor: "azure-api-center-compliance-manager",
  },
  {
    name: "Azure API Center Data Reader",
    description:
      "Allows for access to Azure API Center data plane read operations.",
    id: "c7244dfb-f447-457d-b2ba-3999044d1706",
    category: "Integration",
    anchor: "azure-api-center-data-reader",
  },
  {
    name: "Azure API Center Service Contributor",
    description: "Allows managing Azure API Center service.",
    id: "dd24193f-ef65-44e5-8a7e-6fa6e03f7713",
    category: "Integration",
    anchor: "azure-api-center-service-contributor",
  },
  {
    name: "Azure API Center Service Reader",
    description: "Allows read-only access to Azure API Center service.",
    id: "6cba8790-29c5-48e5-bab1-c7541b01cb04",
    category: "Integration",
    anchor: "azure-api-center-service-reader",
  },
  {
    name: "Azure Relay Listener",
    description: "Allows for listen access to Azure Relay resources.",
    id: "26e0b698-aa6d-4085-9386-aadae190014d",
    category: "Integration",
    anchor: "azure-relay-listener",
  },
  {
    name: "Azure Relay Owner",
    description: "Allows for full access to Azure Relay resources.",
    id: "2787bf04-f1f5-4bfe-8383-c8a24483ee38",
    category: "Integration",
    anchor: "azure-relay-owner",
  },
  {
    name: "Azure Relay Sender",
    description: "Allows for send access to Azure Relay resources.",
    id: "26baccc8-eea7-41f1-98f4-1762cc7f685d",
    category: "Integration",
    anchor: "azure-relay-sender",
  },
  {
    name: "Azure Resource Notifications System Topics Subscriber",
    description:
      "Lets you create system topics and event subscriptions on all system topics exposed currently and in the future by Azure Resource Notifications",
    id: "0b962ed2-6d56-471c-bd5f-3477d83a7ba4",
    category: "Integration",
    anchor: "azure-resource-notifications-system-topics-subscriber",
  },
  {
    name: "Azure Service Bus Data Owner",
    description: "Allows for full access to Azure Service Bus resources.",
    id: "090c5cfd-751d-490a-894a-3ce6f1109419",
    category: "Integration",
    anchor: "azure-service-bus-data-owner",
  },
  {
    name: "Azure Service Bus Data Receiver",
    description: "Allows for receive access to Azure Service Bus resources.",
    id: "4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0",
    category: "Integration",
    anchor: "azure-service-bus-data-receiver",
  },
  {
    name: "Azure Service Bus Data Sender",
    description: "Allows for send access to Azure Service Bus resources.",
    id: "69a216fc-b8fb-44d8-bc22-1f3c2cd27a39",
    category: "Integration",
    anchor: "azure-service-bus-data-sender",
  },
  {
    name: "BizTalk Contributor",
    description: "Lets you manage BizTalk services, but not access to them.",
    id: "5e3c6656-6cfa-4708-81fe-0de47ac73342",
    category: "Integration",
    anchor: "biztalk-contributor",
  },
  {
    name: "DeID Batch Data Owner",
    description:
      "Create and manage DeID batch jobs. This role is in preview and subject to change.",
    id: "8a90fa6b-6997-4a07-8a95-30633a7c97b9",
    category: "Integration",
    anchor: "deid-batch-data-owner",
  },
  {
    name: "DeID Batch Data Reader",
    description:
      "Read DeID batch jobs. This role is in preview and subject to change.",
    id: "b73a14ee-91f5-41b7-bd81-920e12466be9",
    category: "Integration",
    anchor: "deid-batch-data-reader",
  },
  {
    name: "DeID Data Owner",
    description:
      "Full access to DeID data. This role is in preview and subject to change",
    id: "78e4b983-1a0b-472e-8b7d-8d770f7c5890",
    category: "Integration",
    anchor: "deid-data-owner",
  },
  {
    name: "DeID Realtime Data User",
    description:
      "Execute requests against DeID realtime endpoint. This role is in preview and subject to change.",
    id: "bb6577c4-ea0a-40b2-8962-ea18cb8ecd4e",
    category: "Integration",
    anchor: "deid-realtime-data-user",
  },
  {
    name: "DICOM Data Owner",
    description: "Full access to DICOM data.",
    id: "58a3b984-7adf-4c20-983a-32417c86fbc8",
    category: "Integration",
    anchor: "dicom-data-owner",
  },
  {
    name: "DICOM Data Reader",
    description: "Read and search DICOM data.",
    id: "e89c7a3c-2f64-4fa1-a847-3e4c9ba4283a",
    category: "Integration",
    anchor: "dicom-data-reader",
  },
  {
    name: "Durable Task Data Contributor",
    description: "Durable Task role for all data access operations.",
    id: "0ad04412-c4d5-4796-b79c-f76d14c8d402",
    category: "Integration",
    anchor: "durable-task-data-contributor",
  },
  {
    name: "Durable Task Data Reader",
    description: "Read all Durable Task Scheduler data.",
    id: "d6a5505f-6ebb-45a4-896e-ac8274cfc0ac",
    category: "Integration",
    anchor: "durable-task-data-reader",
  },
  {
    name: "Durable Task Worker",
    description:
      "Used by worker applications to interact with the Durable Task service",
    id: "80d0d6b0-f522-40a4-8886-a5a11720c375",
    category: "Integration",
    anchor: "durable-task-worker",
  },
  {
    name: "EventGrid Contributor",
    description: "Lets you manage EventGrid operations.",
    id: "1e241071-0855-49ea-94dc-649edcd759de",
    category: "Integration",
    anchor: "eventgrid-contributor",
  },
  {
    name: "EventGrid Data Sender",
    description: "Allows send access to event grid events.",
    id: "d5a91429-5739-47e2-a06b-3470a27159e7",
    category: "Integration",
    anchor: "eventgrid-data-sender",
  },
  {
    name: "EventGrid EventSubscription Contributor",
    description: "Lets you manage EventGrid event subscription operations.",
    id: "428e0ff0-5e57-4d9c-a221-2c70d0e0a443",
    category: "Integration",
    anchor: "eventgrid-eventsubscription-contributor",
  },
  {
    name: "EventGrid EventSubscription Reader",
    description: "Lets you read EventGrid event subscriptions.",
    id: "2414bbcf-6497-4faf-8c65-045460748405",
    category: "Integration",
    anchor: "eventgrid-eventsubscription-reader",
  },
  {
    name: "EventGrid TopicSpaces Publisher",
    description: "Lets you publish messages on topicspaces.",
    id: "a12b0b94-b317-4dcd-84a8-502ce99884c6",
    category: "Integration",
    anchor: "eventgrid-topicspaces-publisher",
  },
  {
    name: "EventGrid TopicSpaces Subscriber",
    description: "Lets you subscribe messages on topicspaces.",
    id: "4b0f2fd7-60b4-4eca-896f-4435034f8bf5",
    category: "Integration",
    anchor: "eventgrid-topicspaces-subscriber",
  },
  {
    name: "FHIR Data Bulk Operator",
    description: "Role allows user or principal to perform bulk operations",
    id: "804db8d3-32c7-4ad4-a975-3f6f90d5f5f5",
    category: "Integration",
    anchor: "fhir-data-bulk-operator",
  },
  {
    name: "FHIR Data Contributor",
    description: "Role allows user or principal full access to FHIR Data",
    id: "5a1fc7df-4bf1-4951-a576-89034ee01acd",
    category: "Integration",
    anchor: "fhir-data-contributor",
  },
  {
    name: "FHIR Data Converter",
    description:
      "Role allows user or principal to convert data from legacy format to FHIR",
    id: "a1705bd2-3a8f-45a5-8683-466fcfd5cc24",
    category: "Integration",
    anchor: "fhir-data-converter",
  },
  {
    name: "FHIR Data Exporter",
    description: "Role allows user or principal to read and export FHIR Data",
    id: "3db33094-8700-4567-8da5-1501d4e7e843",
    category: "Integration",
    anchor: "fhir-data-exporter",
  },
  {
    name: "FHIR Data Importer",
    description: "Role allows user or principal to read and import FHIR Data",
    id: "4465e953-8ced-4406-a58e-0f6e3f3b530b",
    category: "Integration",
    anchor: "fhir-data-importer",
  },
  {
    name: "FHIR Data Reader",
    description: "Role allows user or principal to read FHIR Data",
    id: "4c8d0bbc-75d3-4935-991f-5f3c56d81508",
    category: "Integration",
    anchor: "fhir-data-reader",
  },
  {
    name: "FHIR Data Writer",
    description: "Role allows user or principal to read and write FHIR Data",
    id: "3f88fce4-5892-4214-ae73-ba5294559913",
    category: "Integration",
    anchor: "fhir-data-writer",
  },
  {
    name: "FHIR SMART User",
    description:
      "Role allows user to access FHIR Service according to SMART on FHIR specification",
    id: "4ba50f17-9666-485c-a643-ff00808643f0",
    category: "Integration",
    anchor: "fhir-smart-user",
  },
  {
    name: "Integration Service Environment Contributor",
    description:
      "Lets you manage integration service environments, but not access to them.",
    id: "a41e2c5b-bd99-4a07-88f4-9bf657a760b8",
    category: "Integration",
    anchor: "integration-service-environment-contributor",
  },
  {
    name: "Integration Service Environment Developer",
    description:
      "Allows developers to create and update workflows, integration accounts and API connections in integration service environments.",
    id: "c7aa55d3-1abb-444a-a5ca-5e51e485d6ec",
    category: "Integration",
    anchor: "integration-service-environment-developer",
  },
  {
    name: "Intelligent Systems Account Contributor",
    description:
      "Lets you manage Intelligent Systems accounts, but not access to them.",
    id: "03a6d094-3444-4b3d-88af-7477090a9e5e",
    category: "Integration",
    anchor: "intelligent-systems-account-contributor",
  },
  {
    name: "Logic App Contributor",
    description: "Lets you manage logic apps, but not change access to them.",
    id: "87a39d53-fc1b-424a-814c-f7e04687dc9e",
    category: "Integration",
    anchor: "logic-app-contributor",
  },
  {
    name: "Logic App Operator",
    description:
      "Lets you read, enable, and disable logic apps, but not edit or update them.",
    id: "515c2055-d9d4-4321-b1b9-bd0c9a0f79fe",
    category: "Integration",
    anchor: "logic-app-operator",
  },
  {
    name: "Logic Apps Standard Contributor",
    description:
      "You can manage all aspects of a Standard logic app and workflows. You can't change access or ownership.",
    id: "ad710c24-b039-4e85-a019-deb4a06e8570",
    category: "Integration",
    anchor: "logic-apps-standard-contributor",
  },
  {
    name: "Logic Apps Standard Developer",
    description:
      "You can create and edit workflows, connections, and settings for a Standard logic app. You can't make changes outside the workflow scope.",
    id: "523776ba-4eb2-4600-a3c8-f2dc93da4bdb",
    category: "Integration",
    anchor: "logic-apps-standard-developer",
  },
  {
    name: "Logic Apps Standard Operator",
    description:
      "You can enable and disable the logic app, resubmit workflow runs, as well as create connections. You can't edit workflows or settings.",
    id: "b70c96e9-66fe-4c09-b6e7-c98e69c98555",
    category: "Integration",
    anchor: "logic-apps-standard-operator",
  },
  {
    name: "Logic Apps Standard Reader",
    description:
      "You have read-only access to all resources in a Standard logic app and workflows, including the workflow runs and their history.",
    id: "4accf36b-2c05-432f-91c8-5c532dff4c73",
    category: "Integration",
    anchor: "logic-apps-standard-reader",
  },
  {
    name: "Scheduler Job Collections Contributor",
    description:
      "Lets you manage Scheduler job collections, but not access to them.",
    id: "188a0f2f-5c9e-469b-ae67-2aa5ce574b94",
    category: "Integration",
    anchor: "scheduler-job-collections-contributor",
  },
  {
    name: "Services Hub Operator",
    description:
      "Services Hub Operator allows you to perform all read, write, and deletion operations related to Services Hub Connectors.",
    id: "82200a5b-e217-47a5-b665-6d8765ee745b",
    category: "Integration",
    anchor: "services-hub-operator",
  },
  {
    name: "Domain Services Contributor",
    description:
      "Can manage Azure AD Domain Services and related network configurations",
    id: "eeaeda52-9324-47f6-8069-5d5bade478b2",
    category: "Identity",
    anchor: "domain-services-contributor",
  },
  {
    name: "Domain Services Reader",
    description:
      "Can view Azure AD Domain Services and related network configurations",
    id: "361898ef-9ed1-48c2-849c-a832951106bb",
    category: "Identity",
    anchor: "domain-services-reader",
  },
  {
    name: "Managed Identity Contributor",
    description: "Create, Read, Update, and Delete User Assigned Identity",
    id: "e40ec5ca-96e0-45a2-b4ff-59039f2c2b59",
    category: "Identity",
    anchor: "managed-identity-contributor",
  },
  {
    name: "Managed Identity Operator",
    description: "Read and Assign User Assigned Identity",
    id: "f1a07417-d97a-45cb-824c-7a7467783830",
    category: "Identity",
    anchor: "managed-identity-operator",
  },
  {
    name: "App Compliance Automation Administrator",
    description:
      "Allows managing App Compliance Automation tool for Microsoft 365",
    id: "0f37683f-2463-46b6-9ce7-9b788b988ba2",
    category: "Security",
    anchor: "app-compliance-automation-administrator",
  },
  {
    name: "App Compliance Automation Reader",
    description:
      "Allows read-only access to App Compliance Automation tool for Microsoft 365",
    id: "ffc6bbe0-e443-4c3b-bf54-26581bb2f78e",
    category: "Security",
    anchor: "app-compliance-automation-reader",
  },
  {
    name: "Attestation Contributor",
    description: "Can read write or delete the attestation provider instance",
    id: "bbf86eb8-f7b4-4cce-96e4-18cddf81d86e",
    category: "Security",
    anchor: "attestation-contributor",
  },
  {
    name: "Attestation Reader",
    description: "Can read the attestation provider properties",
    id: "fd1bd22b-8476-40bc-a0bc-69b95687b9f3",
    category: "Security",
    anchor: "attestation-reader",
  },
  {
    name: "Key Vault Administrator",
    description:
      "Perform all data plane operations on a key vault and all objects in it, including certificates, keys, and secrets. Cannot manage key vault resources or manage role assignments. Only works for key vaults that use the 'Azure role-based access control' permission model.",
    id: "00482a5a-887f-4fb3-b363-3b7fe8e74483",
    category: "Security",
    anchor: "key-vault-administrator",
  },
  {
    name: "Key Vault Certificate User",
    description:
      "Read certificate contents. Only works for key vaults that use the 'Azure role-based access control' permission model.",
    id: "db79e9a7-68ee-4b58-9aeb-b90e7c24fcba",
    category: "Security",
    anchor: "key-vault-certificate-user",
  },
  {
    name: "Key Vault Certificates Officer",
    description:
      "Perform any action on the certificates of a key vault, except manage permissions. Only works for key vaults that use the 'Azure role-based access control' permission model.",
    id: "a4417e6f-fecd-4de8-b567-7b0420556985",
    category: "Security",
    anchor: "key-vault-certificates-officer",
  },
  {
    name: "Key Vault Contributor",
    description:
      "Manage key vaults, but does not allow you to assign roles in Azure RBAC, and does not allow you to access secrets, keys, or certificates.",
    id: "f25e0fa2-a7c8-4377-a976-54943a77a395",
    category: "Security",
    anchor: "key-vault-contributor",
  },
  {
    name: "Key Vault Crypto Officer",
    description:
      "Perform any action on the keys of a key vault, except manage permissions. Only works for key vaults that use the 'Azure role-based access control' permission model.",
    id: "14b46e9e-c2b7-41b4-b07b-48a6ebf60603",
    category: "Security",
    anchor: "key-vault-crypto-officer",
  },
  {
    name: "Key Vault Crypto Service Encryption User",
    description:
      "Read metadata of keys and perform wrap/unwrap operations. Only works for key vaults that use the 'Azure role-based access control' permission model.",
    id: "e147488a-f6f5-4113-8e2d-b22465e65bf6",
    category: "Security",
    anchor: "key-vault-crypto-service-encryption-user",
  },
  {
    name: "Key Vault Crypto Service Release User",
    description:
      "Release keys. Only works for key vaults that use the 'Azure role-based access control' permission model.",
    id: "08bbd89e-9f13-488c-ac41-acfcb10c90ab",
    category: "Security",
    anchor: "key-vault-crypto-service-release-user",
  },
  {
    name: "Key Vault Crypto User",
    description:
      "Perform cryptographic operations using keys. Only works for key vaults that use the 'Azure role-based access control' permission model.",
    id: "12338af0-0e69-4776-bea7-57ae8d297424",
    category: "Security",
    anchor: "key-vault-crypto-user",
  },
  {
    name: "Key Vault Data Access Administrator",
    description:
      "Manage access to Azure Key Vault by adding or removing role assignments for the Key Vault Administrator, Key Vault Certificates Officer, Key Vault Crypto Officer, Key Vault Crypto Service Encryption User, Key Vault Crypto User, Key Vault Reader, Key Vault Secrets Officer, or Key Vault Secrets User roles. Includes an ABAC condition to constrain role assignments.",
    id: "8b54135c-b56d-4d72-a534-26097cfdc8d8",
    category: "Security",
    anchor: "key-vault-data-access-administrator",
  },
  {
    name: "Key Vault Reader",
    description:
      "Read metadata of key vaults and its certificates, keys, and secrets. Cannot read sensitive values such as secret contents or key material. Only works for key vaults that use the 'Azure role-based access control' permission model.",
    id: "21090545-7ca7-4776-b22c-e363652d74d2",
    category: "Security",
    anchor: "key-vault-reader",
  },
  {
    name: "Key Vault Secrets Officer",
    description:
      "Perform any action on the secrets of a key vault, except manage permissions. Only works for key vaults that use the 'Azure role-based access control' permission model.",
    id: "b86a8fe4-44ce-4948-aee5-eccb2c155cd7",
    category: "Security",
    anchor: "key-vault-secrets-officer",
  },
  {
    name: "Key Vault Secrets User",
    description:
      "Read secret contents. Only works for key vaults that use the 'Azure role-based access control' permission model.",
    id: "4633458b-17de-408a-b874-0445c86b69e6",
    category: "Security",
    anchor: "key-vault-secrets-user",
  },
  {
    name: "Locks Contributor",
    description: "Can Manage Locks Operations.",
    id: "28bf596f-4eb7-45ce-b5bc-6cf482fec137",
    category: "Security",
    anchor: "locks-contributor",
  },
  {
    name: "Managed HSM contributor",
    description: "Lets you manage managed HSM pools, but not access to them.",
    id: "18500a29-7fe2-46b2-a342-b16a415e101d",
    category: "Security",
    anchor: "managed-hsm-contributor",
  },
  {
    name: "Microsoft Sentinel Automation Contributor",
    description: "Microsoft Sentinel Automation Contributor",
    id: "f4c81013-99ee-4d62-a7ee-b3f1f648599a",
    category: "Security",
    anchor: "microsoft-sentinel-automation-contributor",
  },
  {
    name: "Microsoft Sentinel Contributor",
    description: "Microsoft Sentinel Contributor",
    id: "ab8e14d6-4a74-4a29-9ba8-549422addade",
    category: "Security",
    anchor: "microsoft-sentinel-contributor",
  },
  {
    name: "Microsoft Sentinel Playbook Operator",
    description: "Microsoft Sentinel Playbook Operator",
    id: "51d6186e-6489-4900-b93f-92e23144cca5",
    category: "Security",
    anchor: "microsoft-sentinel-playbook-operator",
  },
  {
    name: "Microsoft Sentinel Reader",
    description: "Microsoft Sentinel Reader",
    id: "8d289c81-5878-46d4-8554-54e1e3d8b5cb",
    category: "Security",
    anchor: "microsoft-sentinel-reader",
  },
  {
    name: "Microsoft Sentinel Responder",
    description: "Microsoft Sentinel Responder",
    id: "3e150937-b8fe-4cfb-8069-0eaf05ecd056",
    category: "Security",
    anchor: "microsoft-sentinel-responder",
  },
  {
    name: "Security Admin",
    description:
      "View and update permissions for Microsoft Defender for Cloud. Same permissions as the Security Reader role, but can create, update, and delete security connectors, update the security policy, and dismiss alerts and recommendations.  For Microsoft Defender for IoT, see Azure user roles for OT and Enterprise IoT monitoring.",
    id: "fb1c8493-542b-48eb-b624-b4c8fea62acd",
    category: "Security",
    anchor: "security-admin",
  },
  {
    name: "Security Assessment Contributor",
    description: "Lets you push assessments to Microsoft Defender for Cloud",
    id: "612c2aa1-cb24-443b-ac28-3ab7272de6f5",
    category: "Security",
    anchor: "security-assessment-contributor",
  },
  {
    name: "Security Manager (Legacy)",
    description: "This is a legacy role. Please use Security Admin instead.",
    id: "e3d13bf0-dd5a-482e-ba6b-9b8433878d10",
    category: "Security",
    anchor: "security-manager-legacy",
  },
  {
    name: "Security Reader",
    description:
      "View permissions for Microsoft Defender for Cloud. Can view recommendations, alerts, a security policy, and security states, but cannot make changes.  For Microsoft Defender for IoT, see Azure user roles for OT and Enterprise IoT monitoring.",
    id: "39bc4728-0917-49c7-9d2c-d95423bc2eb4",
    category: "Security",
    anchor: "security-reader",
  },
  {
    name: "Chaos Studio Experiment Contributor",
    description:
      "Can create, run, and see details for experiments, onboard targets, and manage capabilities.",
    id: "7c2e40b7-25eb-482a-82cb-78ba06cb46d5",
    category: "DevOps",
    anchor: "chaos-studio-experiment-contributor",
  },
  {
    name: "Chaos Studio Operator",
    description:
      "Can run and see details for experiments but cannot create experiments or manage targets and capabilities.",
    id: "1a40e87e-6645-48e0-b27a-0b115d849a20",
    category: "DevOps",
    anchor: "chaos-studio-operator",
  },
  {
    name: "Chaos Studio Reader",
    description:
      "Can view targets, capabilities, experiments, and experiment details.",
    id: "29e2da8a-229c-4157-8ae8-cc72fc506b74",
    category: "DevOps",
    anchor: "chaos-studio-reader",
  },
  {
    name: "Chaos Studio Target Contributor",
    description:
      "Can onboard targets and manage capabilities but cannot create, run, or see details for experiments",
    id: "59a618e3-3c9a-406e-9f03-1a20dd1c55f1",
    category: "DevOps",
    anchor: "chaos-studio-target-contributor",
  },
  {
    name: "Deployment Environments Reader",
    description: "Provides read access to environment resources.",
    id: "eb960402-bf75-4cc3-8d68-35b34f960f72",
    category: "DevOps",
    anchor: "deployment-environments-reader",
  },
  {
    name: "Deployment Environments User",
    description: "Provides access to manage environment resources.",
    id: "18e40d4e-8d2e-438d-97e1-9528336e149c",
    category: "DevOps",
    anchor: "deployment-environments-user",
  },
  {
    name: "DevCenter Dev Box User",
    description: "Provides access to create and manage dev boxes.",
    id: "45d50f46-0b78-4001-a660-4198cbe8cd05",
    category: "DevOps",
    anchor: "devcenter-dev-box-user",
  },
  {
    name: "DevCenter Owner",
    description:
      "Provides access to manage all Microsoft.DevCenter resources, and to manage access to Microsoft.DevCenter resources by adding or removing role assignments for the DevCenter Project Admin and DevCenter Dev Box roles.",
    id: "4c6569b6-f23e-4295-9b90-bd4cc4ff3292",
    category: "DevOps",
    anchor: "devcenter-owner",
  },
  {
    name: "DevCenter Project Admin",
    description: "Provides access to manage project resources.",
    id: "331c37c6-af14-46d9-b9f4-e1909e1b95a0",
    category: "DevOps",
    anchor: "devcenter-project-admin",
  },
  {
    name: "DevOps Infrastructure Contributor",
    description:
      "Read, write, delete and perform actions on Managed DevOps Pools",
    id: "76153a9e-0edb-49bc-8e01-93c47e6b5180",
    category: "DevOps",
    anchor: "devops-infrastructure-contributor",
  },
  {
    name: "DevTest Labs User",
    description:
      "Lets you connect, start, restart, and shutdown your virtual machines in your Azure DevTest Labs.",
    id: "76283e04-6283-4c54-8f91-bcf1374a3c64",
    category: "DevOps",
    anchor: "devtest-labs-user",
  },
  {
    name: "Lab Assistant",
    description:
      "Enables you to view an existing lab, perform actions on the lab VMs and send invitations to the lab.",
    id: "ce40b423-cede-4313-a93f-9b28290b72e1",
    category: "DevOps",
    anchor: "lab-assistant",
  },
  {
    name: "Lab Contributor",
    description:
      "Applied at lab level, enables you to manage the lab. Applied at a resource group, enables you to create and manage labs.",
    id: "5daaa2af-1fe8-407c-9122-bba179798270",
    category: "DevOps",
    anchor: "lab-contributor",
  },
  {
    name: "Lab Creator",
    description: "Lets you create new labs under your Azure Lab Accounts.",
    id: "b97fb8bc-a8b2-4522-a38b-dd33c7e65ead",
    category: "DevOps",
    anchor: "lab-creator",
  },
  {
    name: "Lab Operator",
    description: "Gives you limited ability to manage existing labs.",
    id: "a36e6959-b6be-4b12-8e9f-ef4b474d304d",
    category: "DevOps",
    anchor: "lab-operator",
  },
  {
    name: "Lab Services Contributor",
    description:
      "Enables you to fully control all Lab Services scenarios in the resource group.",
    id: "f69b8690-cc87-41d6-b77a-a4bc3c0a966f",
    category: "DevOps",
    anchor: "lab-services-contributor",
  },
  {
    name: "Lab Services Reader",
    description:
      "Enables you to view, but not change, all lab plans and lab resources.",
    id: "2a5c394f-5eb7-4d4f-9c8e-e8eae39faebc",
    category: "DevOps",
    anchor: "lab-services-reader",
  },
  {
    name: "Load Test Contributor",
    description:
      "View, create, update, delete and execute load tests. View and list load test resources but can not make any changes.",
    id: "749a398d-560b-491b-bb21-08924219302e",
    category: "DevOps",
    anchor: "load-test-contributor",
  },
  {
    name: "Load Test Owner",
    description: "Execute all operations on load test resources and load tests",
    id: "45bb0b16-2f0c-4e78-afaa-a07599b003f6",
    category: "DevOps",
    anchor: "load-test-owner",
  },
  {
    name: "Load Test Reader",
    description:
      "View and list all load tests and load test resources but can not make any changes",
    id: "3ae3fb29-0000-4ccd-bf80-542e7b26e081",
    category: "DevOps",
    anchor: "load-test-reader",
  },
  {
    name: "Playwright Workspace Contributor",
    description:
      "View and list Playwright Workspace resources but can not make any changes. Can manage service access tokens and execute Playwright tests.",
    id: "78cf819f-0969-4ebe-8759-015c6efcd5bf",
    category: "DevOps",
    anchor: "playwright-workspace-contributor",
  },
  {
    name: "Playwright Workspace Owner",
    description:
      "Perform all operations on Playwright Workspace resources. Can manage service access tokens and execute Playwright tests.",
    id: "45265627-32f7-4da4-9ab0-b1cb0e9ec70b",
    category: "DevOps",
    anchor: "playwright-workspace-owner",
  },
  {
    name: "Playwright Workspace Reader",
    description:
      "View and list all Playwright Workspace resources and tests but can not make any changes.",
    id: "19d36063-d00b-4ea5-a1ac-a7c4926a0b78",
    category: "DevOps",
    anchor: "playwright-workspace-reader",
  },
  {
    name: "Azure Migrate Decide and Plan Expert",
    description:
      "Grants restricted access on Azure Migrate project to only perform planning operations including appliance-based discovery, managing inventory, identifying server dependencies, creation of business case & assessment reports.",
    id: "7859c0b0-0bb9-4994-bd12-cd529af7d646",
    category: "Migration",
    anchor: "azure-migrate-decide-and-plan-expert",
  },
  {
    name: "Azure Migrate Execute Expert",
    description:
      "Grants restricted access on an Azure Migrate project to only perform migration related operations, including replication, execution of test migrations, tracking and monitoring of migration progress, and initiation of agentless and agent-based migrations.",
    id: "1cfa4eac-9a23-481c-a793-bfb6958e836b",
    category: "Migration",
    anchor: "azure-migrate-execute-expert",
  },
  {
    name: "Azure Migrate Owner",
    description:
      "Grants full access to create and manage Azure Migrate projects including appliance-based discovery, creation of business case & assessment report and execution of migrations; Also grants ability to assign Azure Migrate specific roles in Azure RBAC.",
    id: "fd8ea4d5-6509-4db0-bada-356ab233b4fa",
    category: "Migration",
    anchor: "azure-migrate-owner",
  },
  {
    name: "Azure Migrate Service Reader",
    description:
      "Grants required access to the system assigned managed identity of Azure Migrate project resource.",
    id: "ba480ccd-6499-4709-b581-8f38bb215c63",
    category: "Migration",
    anchor: "azure-migrate-service-reader",
  },
  {
    name: "Azure Local Migrate Execute Expert",
    description:
      "Grants restricted access on an Azure Local based Azure Migrate project to only perform migration related operations, including replication, execution of migrations, tracking and monitoring of migration progress, and initiation of agentless migrations.",
    id: "1cfa4eac-9a23-481c-a793-bfb6958e836c",
    category: "Migration",
    anchor: "azure-local-migrate-execute-expert",
  },
  {
    name: "Azure Local Migrate Owner",
    description:
      "Grants full access to create and manage Azure Local based Azure Migrate projects including appliance-based discovery and execution of migrations; Also grants ability to assign Azure Migrate Local specific roles in Azure RBAC",
    id: "fd8ea4d5-6509-4db0-bada-356ab233b4fb",
    category: "Migration",
    anchor: "azure-local-migrate-owner",
  },
  {
    name: "Migrate Arc Discovery Reader - Preview",
    description:
      "Read metadata of Azure Arc enabled server resources and metadata, performance and migration suitability of Arc enabled SQL server resources. Users creating Azure Migrate project that uses Arc resource discovery require this role on Arc scope of the project. To enable periodic sync, Azure Migrate project managed identity must be assigned this role. This role is in preview and subject to change.",
    id: "5d5dddae-e124-4753-972d-aae60b37deb4",
    category: "Migration",
    anchor: "migrate-arc-discovery-reader---preview",
  },
  {
    name: "Application Insights Component Contributor",
    description: "Can manage Application Insights components",
    id: "ae349356-3a1b-4a5e-921d-050484c6347e",
    category: "Monitor",
    anchor: "application-insights-component-contributor",
  },
  {
    name: "Application Insights Snapshot Debugger",
    description:
      "Gives user permission to view and download debug snapshots collected with the Application Insights Snapshot Debugger. Note that these permissions are not included in the Owner or Contributor roles. When giving users the Application Insights Snapshot Debugger role, you must grant the role directly to the user. The role is not recognized when it is added to a custom role.",
    id: "08954f03-6346-4c2e-81c0-ec3a5cfae23b",
    category: "Monitor",
    anchor: "application-insights-snapshot-debugger",
  },
  {
    name: "Azure Managed Grafana Workspace Contributor",
    description:
      "Can manage Azure Managed Grafana resources, without providing access to the workspaces themselves.",
    id: "5c2d7e57-b7c2-4d8a-be4f-82afa42c6e95",
    category: "Monitor",
    anchor: "azure-managed-grafana-workspace-contributor",
  },
  {
    name: "Data Purger",
    description: "Delete private data from a Log Analytics workspace.",
    id: "150f5e0c-0603-4f03-8c7f-cf70034c4e90",
    category: "Monitor",
    anchor: "data-purger",
  },
  {
    name: "Grafana Admin",
    description:
      "Manage server-wide settings and manage access to resources such as organizations, users, and licenses.",
    id: "22926164-76b3-42b3-bc55-97df8dab3e41",
    category: "Monitor",
    anchor: "grafana-admin",
  },
  {
    name: "Grafana Editor",
    description:
      "Create, edit, delete, or view dashboards; create, edit, or delete folders; and edit or view playlists.",
    id: "a79a5197-3a5c-4973-a920-486035ffd60f",
    category: "Monitor",
    anchor: "grafana-editor",
  },
  {
    name: "Grafana Limited Viewer",
    description: "View home page.",
    id: "41e04612-9dac-4699-a02b-c82ff2cc3fb5",
    category: "Monitor",
    anchor: "grafana-limited-viewer",
  },
  {
    name: "Grafana Viewer",
    description: "View dashboards, playlists, and query data sources.",
    id: "60921a7e-fef1-4a43-9b16-a26c52ad4769",
    category: "Monitor",
    anchor: "grafana-viewer",
  },
  {
    name: "Log Analytics Contributor",
    description:
      "Log Analytics Contributor can read all monitoring data and edit monitoring settings. Editing monitoring settings includes adding the VM extension to VMs; reading storage account keys to be able to configure collection of logs from Azure Storage; adding solutions; and configuring Azure diagnostics on all Azure resources.",
    id: "92aaf0da-9dab-42b6-94a3-d43ce8d16293",
    category: "Monitor",
    anchor: "log-analytics-contributor",
  },
  {
    name: "Log Analytics Data Reader",
    description:
      "Log Analytics Data Reader can query and search the logs it is allowed to view over Log Analytics workspaces and tables",
    id: "3b03c2da-16b3-4a49-8834-0f8130efdd3b",
    category: "Monitor",
    anchor: "log-analytics-data-reader",
  },
  {
    name: "Log Analytics Reader",
    description:
      "Log Analytics Reader can view and search all monitoring data as well as and view monitoring settings, including viewing the configuration of Azure diagnostics on all Azure resources.",
    id: "73c42c96-874c-492b-b04d-ab87d138a893",
    category: "Monitor",
    anchor: "log-analytics-reader",
  },
  {
    name: "Monitored Objects Contributor",
    description:
      "Grants permissions to create and link a monitored object to a user or group. For more information, see Set up the Azure Monitor Agent on Windows client devices.",
    id: "56be40e2-4db1-4ccf-93c3-7e44c597135b",
    category: "Monitor",
    anchor: "monitored-objects-contributor",
  },
  {
    name: "Monitoring Contributor",
    description:
      "Can read all monitoring data and edit monitoring settings. See also Get started with roles, permissions, and security with Azure Monitor.",
    id: "749f88d5-cbae-40b8-bcfc-e573ddc772fa",
    category: "Monitor",
    anchor: "monitoring-contributor",
  },
  {
    name: "Monitoring Metrics Publisher",
    description: "Enables publishing metrics against Azure resources",
    id: "3913510d-42f4-4e42-8a64-420c390055eb",
    category: "Monitor",
    anchor: "monitoring-metrics-publisher",
  },
  {
    name: "Monitoring Policy Contributor",
    description:
      "Allows read access to all monitoring data, update permissions for monitoring settings and permissions to deploy and remediate Azure Monitor alert policies.",
    id: "47be4a87-7950-4631-9daf-b664a405f074",
    category: "Monitor",
    anchor: "monitoring-policy-contributor",
  },
  {
    name: "Monitoring Reader",
    description:
      "Can read all monitoring data (metrics, logs, etc.). See also Get started with roles, permissions, and security with Azure Monitor.",
    id: "43d0d8ad-25c7-4714-9337-8ba259a9fe05",
    category: "Monitor",
    anchor: "monitoring-reader",
  },
  {
    name: "Service Health Security Reader",
    description:
      "Grants permissions to view sensitive security information present in service health events",
    id: "1a928ab0-1fee-43cf-9266-f9d8c22a8ddb",
    category: "Monitor",
    anchor: "service-health-security-reader",
  },
  {
    name: "Workbook Contributor",
    description: "Can save shared workbooks.",
    id: "e8ddcd69-c73f-4f9f-9844-4100522f16ad",
    category: "Monitor",
    anchor: "workbook-contributor",
  },
  {
    name: "Workbook Reader",
    description: "Can read workbooks.",
    id: "b279062a-9be3-42a0-92ae-8b3cf002ec4d",
    category: "Monitor",
    anchor: "workbook-reader",
  },
  {
    name: "Advisor Recommendations Contributor (Assessments and Reviews)",
    description:
      "View assessment recommendations, accepted review recommendations, and manage the recommendations lifecycle (mark recommendations as completed, postponed or dismissed, in progress, or not started).",
    id: "6b534d80-e337-47c4-864f-140f5c7f593d",
    category: "Management and governance",
    anchor: "advisor-recommendations-contributor-assessments-and-reviews",
  },
  {
    name: "Advisor Reviews Contributor",
    description:
      "View reviews for a workload and triage recommendations linked to them.",
    id: "8aac15f0-d885-4138-8afa-bfb5872f7d13",
    category: "Management and governance",
    anchor: "advisor-reviews-contributor",
  },
  {
    name: "Advisor Reviews Reader",
    description:
      "View reviews for a workload and recommendations linked to them.",
    id: "c64499e0-74c3-47ad-921c-13865957895c",
    category: "Management and governance",
    anchor: "advisor-reviews-reader",
  },
  {
    name: "Automation Contributor",
    description:
      "Manage Azure Automation resources and other resources using Azure Automation.",
    id: "f353d9bd-d4a6-484e-a77a-8050b599b867",
    category: "Management and governance",
    anchor: "automation-contributor",
  },
  {
    name: "Automation Job Operator",
    description: "Create and Manage Jobs using Automation Runbooks.",
    id: "4fe576fe-1146-4730-92eb-48519fa6bf9f",
    category: "Management and governance",
    anchor: "automation-job-operator",
  },
  {
    name: "Automation Operator",
    description:
      "Automation Operators are able to start, stop, suspend, and resume jobs",
    id: "d3881f73-407a-4167-8283-e981cbba0404",
    category: "Management and governance",
    anchor: "automation-operator",
  },
  {
    name: "Automation Runbook Operator",
    description:
      "Read Runbook properties - to be able to create Jobs of the runbook.",
    id: "5fb5aef8-1081-4b8e-bb16-9d5d0385bab5",
    category: "Management and governance",
    anchor: "automation-runbook-operator",
  },
  {
    name: "Azure Center for SAP solutions administrator",
    description:
      "This role provides read and write access to all capabilities of Azure Center for SAP solutions.",
    id: "7b0c7e81-271f-4c71-90bf-e30bdfdbc2f7",
    category: "Management and governance",
    anchor: "azure-center-for-sap-solutions-administrator",
  },
  {
    name: "Azure Center for SAP solutions reader",
    description:
      "This role provides read access to all capabilities of Azure Center for SAP solutions.",
    id: "05352d14-a920-4328-a0de-4cbe7430e26b",
    category: "Management and governance",
    anchor: "azure-center-for-sap-solutions-reader",
  },
  {
    name: "Azure Center for SAP solutions service role",
    description:
      "Azure Center for SAP solutions service role - This role is intended to be used for providing the permissions to user assigned managed identity. Azure Center for SAP solutions will use this identity to deploy and manage SAP systems.",
    id: "aabbc5dd-1af0-458b-a942-81af88f9c138",
    category: "Management and governance",
    anchor: "azure-center-for-sap-solutions-service-role",
  },
  {
    name: "Azure Connected Machine Onboarding",
    description: "Can onboard Azure Connected Machines.",
    id: "b64e21ea-ac4e-4cdf-9dc9-5b892992bee7",
    category: "Management and governance",
    anchor: "azure-connected-machine-onboarding",
  },
  {
    name: "Azure Connected Machine Resource Administrator",
    description:
      "Can read, write, delete and re-onboard Azure Connected Machines.",
    id: "cd570a14-e51a-42ad-bac8-bafd67325302",
    category: "Management and governance",
    anchor: "azure-connected-machine-resource-administrator",
  },
  {
    name: "Azure Connected Machine Resource Manager",
    description:
      "Custom role for Azure Local resource provider (Microsoft.AzureStackHCI Resource Provider) to manage hybrid compute machines and hybrid connectivity endpoints in a resource group",
    id: "f5819b54-e033-4d82-ac66-4fec3cbf3f4c",
    category: "Management and governance",
    anchor: "azure-connected-machine-resource-manager",
  },
  {
    name: "Azure Customer Lockbox Approver for Subscription",
    description:
      "Can approve Microsoft support requests to access specific resources contained within a subscription, or the subscription itself, when Customer Lockbox for Microsoft Azure is enabled on the tenant where the subscription resides.",
    id: "4dae6930-7baf-46f5-909e-0383bc931c46",
    category: "Management and governance",
    anchor: "azure-customer-lockbox-approver-for-subscription",
  },
  {
    name: "Billing Reader",
    description: "Allows read access to billing data",
    id: "fa23ad8b-c56e-40d8-ac0c-ce449e1d2c64",
    category: "Management and governance",
    anchor: "billing-reader",
  },
  {
    name: "Blueprint Contributor",
    description: "Can manage blueprint definitions, but not assign them.",
    id: "41077137-e803-4205-871c-5a86e6a753b4",
    category: "Management and governance",
    anchor: "blueprint-contributor",
  },
  {
    name: "Blueprint Operator",
    description:
      "Can assign existing published blueprints, but cannot create new blueprints. Note that this only works if the assignment is done with a user-assigned managed identity.",
    id: "437d2ced-4a38-4302-8479-ed2bcb43d090",
    category: "Management and governance",
    anchor: "blueprint-operator",
  },
  {
    name: "Carbon Optimization Reader",
    description: "Allow read access to Azure Carbon Optimization data",
    id: "fa0d39e6-28e5-40cf-8521-1eb320653a4c",
    category: "Management and governance",
    anchor: "carbon-optimization-reader",
  },
  {
    name: "Cost Management Contributor",
    description:
      "Can view costs and manage cost configuration (e.g. budgets, exports)",
    id: "434105ed-43f6-45c7-a02f-909b2ba83430",
    category: "Management and governance",
    anchor: "cost-management-contributor",
  },
  {
    name: "Cost Management Reader",
    description: "Can view cost data and configuration (e.g. budgets, exports)",
    id: "72fafb9e-0641-4937-9268-a91bfd8191a3",
    category: "Management and governance",
    anchor: "cost-management-reader",
  },
  {
    name: "Essential Machine Management Administrator",
    description:
      "Can managed Essential Machine Management resources for subscriptions",
    id: "34013b0a-565b-43aa-8755-1b7c286f6cf7",
    category: "Management and governance",
    anchor: "essential-machine-management-administrator",
  },
  {
    name: "Hierarchy Settings Administrator",
    description: "Allows users to edit and delete Hierarchy Settings",
    id: "350f8d15-c687-4448-8ae1-157740a3936d",
    category: "Management and governance",
    anchor: "hierarchy-settings-administrator",
  },
  {
    name: "Managed Application Contributor Role",
    description: "Allows for creating managed application resources.",
    id: "641177b8-a67a-45b9-a033-47bc880bb21e",
    category: "Management and governance",
    anchor: "managed-application-contributor-role",
  },
  {
    name: "Managed Application Operator Role",
    description:
      "Lets you read and perform actions on Managed Application resources",
    id: "c7393b34-138c-406f-901b-d8cf2b17e6ae",
    category: "Management and governance",
    anchor: "managed-application-operator-role",
  },
  {
    name: "Managed Application Publisher Operator",
    description:
      "Allows the publisher to read resources in the managed resource group for Managed Application and request JIT access for additional operations. This role is only used by the Managed Application service to provide access to publishers.",
    id: "b9331d33-8a36-4f8c-b097-4f54124fdb44",
    category: "Management and governance",
    anchor: "managed-application-publisher-operator",
  },
  {
    name: "Managed Services Registration assignment Delete Role",
    description:
      "Managed Services Registration Assignment Delete Role allows the managing tenant users to delete the registration assignment assigned to their tenant.",
    id: "91c1777a-f3dc-4fae-b103-61d183457e46",
    category: "Management and governance",
    anchor: "managed-services-registration-assignment-delete-role",
  },
  {
    name: "Management Group Contributor",
    description: "Management Group Contributor Role",
    id: "5d58bcaf-24a5-4b20-bdb6-eed9f69fbe4c",
    category: "Management and governance",
    anchor: "management-group-contributor",
  },
  {
    name: "Management Group Reader",
    description: "Management Group Reader Role",
    id: "ac63b705-f282-497d-ac71-919bf39d939d",
    category: "Management and governance",
    anchor: "management-group-reader",
  },
  {
    name: "New Relic APM Account Contributor",
    description:
      "Lets you manage New Relic Application Performance Management accounts and applications, but not access to them.",
    id: "5d28c62d-5b37-4476-8438-e587778df237",
    category: "Management and governance",
    anchor: "new-relic-apm-account-contributor",
  },
  {
    name: "Policy Insights Data Writer (Preview)",
    description:
      "Allows read access to resource policies and write access to resource component policy events.",
    id: "66bb4e9e-b016-4a94-8249-4c0511c2be84",
    category: "Management and governance",
    anchor: "policy-insights-data-writer-preview",
  },
  {
    name: "Quota Request Operator",
    description:
      "Read and create quota requests, get quota request status, and create support tickets.",
    id: "0e5f05e5-9ab9-446b-b98d-1e2157c94125",
    category: "Management and governance",
    anchor: "quota-request-operator",
  },
  {
    name: "Reservation Purchaser",
    description: "Lets you purchase reservations",
    id: "f7b75c60-3036-4b75-91c3-6b41c27c1689",
    category: "Management and governance",
    anchor: "reservation-purchaser",
  },
  {
    name: "Reservations Reader",
    description: "Lets one read all the reservations in a tenant",
    id: "582fc458-8989-419f-a480-75249bc5db7e",
    category: "Management and governance",
    anchor: "reservations-reader",
  },
  {
    name: "Resource Policy Contributor",
    description:
      "Users with rights to create/modify resource policy, create support ticket and read resources/hierarchy.",
    id: "36243c78-bf99-498c-9df9-86d9f8d28608",
    category: "Management and governance",
    anchor: "resource-policy-contributor",
  },
  {
    name: "Savings plan Purchaser",
    description: "Lets you purchase savings plans",
    id: "3d24a3a0-c154-4f6f-a5ed-adc8e01ddb74",
    category: "Management and governance",
    anchor: "savings-plan-purchaser",
  },
  {
    name: "Scheduled Patching Contributor",
    description:
      "Provides access to manage maintenance configurations with maintenance scope InGuestPatch and corresponding configuration assignments",
    id: "cd08ab90-6b14-449c-ad9a-8f8e549482c6",
    category: "Management and governance",
    anchor: "scheduled-patching-contributor",
  },
  {
    name: "Service Group Administrator",
    description:
      "Manage all aspects of service groups and relationships. The default role assigned to users when they create a service group. Includes an ABAC condition to constrain role assignments.",
    id: "4e50c84c-c78e-4e37-b47e-e60ffea0a775",
    category: "Management and governance",
    anchor: "service-group-administrator",
  },
  {
    name: "Service Group Contributor",
    description:
      "Manage all aspects of service groups and relationships, but does not allow you to assign roles.",
    id: "32e6a4ec-6095-4e37-b54b-12aa350ba81f",
    category: "Management and governance",
    anchor: "service-group-contributor",
  },
  {
    name: "Service Group Reader",
    description: "Read service groups and view the connected relationships.",
    id: "de754d53-652d-4c75-a67f-1e48d8b49c97",
    category: "Management and governance",
    anchor: "service-group-reader",
  },
  {
    name: "Site Recovery Contributor",
    description:
      "Lets you manage Site Recovery service except vault creation and role assignment",
    id: "6670b86e-a3f7-4917-ac9b-5d6ab1be4567",
    category: "Management and governance",
    anchor: "site-recovery-contributor",
  },
  {
    name: "Site Recovery Operator",
    description:
      "Lets you failover and failback but not perform other Site Recovery management operations",
    id: "494ae006-db33-4328-bf46-533a6560a3ca",
    category: "Management and governance",
    anchor: "site-recovery-operator",
  },
  {
    name: "Site Recovery Reader",
    description:
      "Lets you view Site Recovery status but not perform other management operations",
    id: "dbaa88c4-0c30-4179-9fb3-46319faa6149",
    category: "Management and governance",
    anchor: "site-recovery-reader",
  },
  {
    name: "SRE Agent Administrator",
    description:
      "Full control of the agent—manage chats, incident response plans, and agent run modes; approve and execute commands.",
    id: "e79298df-d852-4c6d-84f9-5d13249d1e55",
    category: "Management and governance",
    anchor: "sre-agent-administrator",
  },
  {
    name: "SRE Agent Reader",
    description:
      "Grants read-only access to all SRE Agent data, including chats, incidents, logs, and configurations. Does not permit interaction with the agent.",
    id: "a4b156ac-253f-4a1a-9851-96d62b71b047",
    category: "Management and governance",
    anchor: "sre-agent-reader",
  },
  {
    name: "SRE Agent Standard User",
    description:
      "Grants access to interact with the SRE Agent to triage incidents and run diagnostics.",
    id: "2d84a65a-63b2-4343-bbb6-31105d857bc1",
    category: "Management and governance",
    anchor: "sre-agent-standard-user",
  },
  {
    name: "Support Request Contributor",
    description: "Lets you create and manage Support requests",
    id: "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e",
    category: "Management and governance",
    anchor: "support-request-contributor",
  },
  {
    name: "Tag Contributor",
    description:
      "Lets you manage tags on entities, without providing access to the entities themselves.",
    id: "4a9ae827-6dc8-4573-8ac7-8239d42aa03f",
    category: "Management and governance",
    anchor: "tag-contributor",
  },
  {
    name: "Template Spec Contributor",
    description:
      "Allows full access to Template Spec operations at the assigned scope.",
    id: "1c9b6475-caf0-4164-b5a1-2142a7116f4b",
    category: "Management and governance",
    anchor: "template-spec-contributor",
  },
  {
    name: "Template Spec Reader",
    description: "Allows read access to Template Specs at the assigned scope.",
    id: "392ae280-861d-42bd-9ea5-08ee6d83b80e",
    category: "Management and governance",
    anchor: "template-spec-reader",
  },
  {
    name: "Arc Gateway Manager",
    description: "Manage Arc Gateway Resources",
    id: "f6e92014-8af2-414d-9948-9b1abf559285",
    category: "Hybrid + multicloud",
    anchor: "arc-gateway-manager",
  },
  {
    name: "Azure Arc ScVmm Administrator role",
    description:
      "Arc ScVmm VM Administrator has permissions to perform all ScVmm actions.",
    id: "a92dfd61-77f9-4aec-a531-19858b406c87",
    category: "Hybrid + multicloud",
    anchor: "azure-arc-scvmm-administrator-role",
  },
  {
    name: "Azure Arc ScVmm Private Cloud User",
    description:
      "Azure Arc ScVmm Private Cloud User has permissions to use the ScVmm resources to deploy VMs.",
    id: "c0781e91-8102-4553-8951-97c6d4243cda",
    category: "Hybrid + multicloud",
    anchor: "azure-arc-scvmm-private-cloud-user",
  },
  {
    name: "Azure Arc ScVmm Private Clouds Onboarding",
    description:
      "Azure Arc ScVmm Private Clouds Onboarding role has permissions to provision all the required resources for onboard and deboard vmm server instances to Azure.",
    id: "6aac74c4-6311-40d2-bbdd-7d01e7c6e3a9",
    category: "Hybrid + multicloud",
    anchor: "azure-arc-scvmm-private-clouds-onboarding",
  },
  {
    name: "Azure Arc ScVmm VM Contributor",
    description:
      "Arc ScVmm VM Contributor has permissions to perform all VM actions.",
    id: "e582369a-e17b-42a5-b10c-874c387c530b",
    category: "Hybrid + multicloud",
    anchor: "azure-arc-scvmm-vm-contributor",
  },
  {
    name: "Azure Resource Bridge Deployment Role",
    description:
      "Azure Resource Bridge Deployment Role is used only for Azure Stack HCI.",
    id: "7b1f81f9-4196-4058-8aae-762e593270df",
    category: "Hybrid + multicloud",
    anchor: "azure-resource-bridge-deployment-role",
  },
  {
    name: "Azure Stack HCI Administrator",
    description:
      "Grants full access to the cluster and its resources, including the ability to register Azure Local and assign others as Azure Stack HCI VM Contributor and/or Azure Stack HCI VM Reader",
    id: "bda0d508-adf1-4af0-9c28-88919fc3ae06",
    category: "Hybrid + multicloud",
    anchor: "azure-stack-hci-administrator",
  },
  {
    name: "Azure Stack HCI Connected InfraVMs",
    description:
      "Role of Arc Integration for Azure Stack HCI Infrastructure Virtual Machines.",
    id: "c99c945f-8bd1-4fb1-a903-01460aae6068",
    category: "Hybrid + multicloud",
    anchor: "azure-stack-hci-connected-infravms",
  },
  {
    name: "Azure Stack HCI Device Management Role",
    description: "Microsoft.AzureStackHCI Device Management Role",
    id: "865ae368-6a45-4bd1-8fbf-0d5151f56fc1",
    category: "Hybrid + multicloud",
    anchor: "azure-stack-hci-device-management-role",
  },
  {
    name: "Azure Stack HCI VM Contributor",
    description: "Grants permissions to perform all VM actions",
    id: "874d1c73-6003-4e60-a13a-cb31ea190a85",
    category: "Hybrid + multicloud",
    anchor: "azure-stack-hci-vm-contributor",
  },
  {
    name: "Azure Stack HCI VM Reader",
    description: "Grants permissions to view VMs",
    id: "4b3fe76c-f777-4d24-a2d7-b027b0f7b273",
    category: "Hybrid + multicloud",
    anchor: "azure-stack-hci-vm-reader",
  },
  {
    name: "Azure Stack Registration Owner",
    description: "Lets you manage Azure Stack registrations.",
    id: "6f12a6df-dd06-4f3e-bcb1-ce8be600526a",
    category: "Hybrid + multicloud",
    anchor: "azure-stack-registration-owner",
  },
  {
    name: "Hybrid Server Resource Administrator",
    description:
      "Can read, write, delete, and re-onboard Hybrid servers to the Hybrid Resource Provider.",
    id: "48b40c6e-82e0-4eb3-90d5-19e40f49b624",
    category: "Hybrid + multicloud",
    anchor: "hybrid-server-resource-administrator",
  },
];
