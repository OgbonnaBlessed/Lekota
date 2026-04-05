export enum Role {
  ADMIN = "admin",
  TENANT_ADMIN = "tenant_admin",
  STAFF = "staff",
  CLIENT = "client",
}

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  DELETED = "deleted",
}

export enum TenantStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  DELETED = "deleted",
}

export enum SubscriptionStatus {
  TRIAL = "trial",
  ACTIVE = "active",
  EXPIRED = "expired",
}
