export type UserRole = "admin" | "user";
export type ItemStatus = "lost" | "found";
export type ClaimStatus = "pending" | "approved" | "rejected";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordHash">;

export type Item = {
  id: string;
  status: ItemStatus;
  title: string;
  category: string;
  color: string;
  location: string;
  eventDate: string;
  description: string;
  contactEmail: string;
  imageUrl: string;
  tags: string[];
  ownerId: string;
  ownerName: string;
  createdAt: string;
};

export type Claim = {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  message: string;
  status: ClaimStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
};

export type ResetToken = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
};

export type Database = {
  users: User[];
  items: Item[];
  claims: Claim[];
  resetTokens: ResetToken[];
};

export type SessionPayload = {
  userId: string;
  role: UserRole;
  exp: number;
};
