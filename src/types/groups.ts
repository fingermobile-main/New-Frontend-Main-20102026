export interface GroupMember {
  id: string; name: string;
  avatarUrl?: string; role: "admin" | "moderator" | "member";
  joinedAt: string;
}

export interface Group {
  id: string; name: string; description?: string;
  avatarUrl?: string;
  bannerUrl?: string; memberCount: number; isPrivate: boolean; createdAt: string; updatedAt: string; ownerId: string;
  tags?: string[];
  members?: GroupMember[];
}

export interface CreateGroupRequest {
  name: string; description?: string; isPrivate: boolean;
  tags?: string[];
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  isPrivate?: boolean;
  tags?: string[];
  avatarUrl?: string;
  bannerUrl?: string;
}
