/**
 * Communications, WebRTC & VoIP Console Types
 * FingerMobile Protocol™ Production Control Plane
 * Phase 13: WebRTC P2P Mesh, STUN/TURN Relays, Codec Tuning, Emergency Broadcast Killswitch
 */

export type VoipRoomType =
  | 'audio_video_conference'
  | 'voice_only_room'
  | 'executive_broadcast'
  | 'telehealth_encrypted_p2p'
  | 'spatial_audio_mesh'
  | 'webinar_broadcast'
  | 'encrypted_emergency_mesh';

export type StunTurnHealth = 'optimal' | 'degraded' | 'standby';

export interface CommsVoipRoomItem {
  id: number;
  room_name: string;
  room_code: string;
  room_type: VoipRoomType;
  relay_cluster: string;
  concurrency_limit: number;
  active_peers_count: number;
  bitrate_kbps: number;
  recording_enabled: boolean;
  emergency_broadcast_priority: boolean;
  stun_turn_health: StunTurnHealth;
  packet_loss_percent: number;
  latency_ms: number;
  display_order: number;
  status: 'active' | 'standby' | 'defcon_disabled';
  created_at: string;
  updated_at: string;
}

export interface CommsVoipOverview {
  total_rooms: number;
  active_rooms: number;
  emergency_rooms: number;
  optimal_relays: number;
  total_active_peers: number;
  total_mesh_capacity: number;
  avg_latency_ms: number;
  avg_packet_loss: number;
  active_shards: number;
  active_instances: number;
  webrtc_signaling_engine: string;
  stun_turn_cluster: string;
  system_status: string;
  database_engine: string;
}

export interface CommsVoipSpawnedConsole {
  id: number;
  title: string;
  domain: string;
  badge: string;
  description: string;
  active_instances: number;
  status: 'active' | 'syncing' | 'paused';
  created_at: string;
}

export interface CreateVoipRoomPayload {
  room_name: string;
  room_code: string;
  room_type: VoipRoomType;
  relay_cluster?: string;
  concurrency_limit?: number;
  bitrate_kbps?: number;
  recording_enabled?: boolean;
  emergency_broadcast_priority?: boolean;
}

export interface UpdateVoipRoomPayload {
  room_name?: string;
  room_type?: VoipRoomType;
  relay_cluster?: string;
  concurrency_limit?: number;
  bitrate_kbps?: number;
  recording_enabled?: boolean;
  emergency_broadcast_priority?: boolean;
  stun_turn_health?: StunTurnHealth;
  status?: 'active' | 'standby' | 'defcon_disabled';
}
