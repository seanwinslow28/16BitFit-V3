export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          name: string
          points: number | null
          requirement_type: string | null
          requirement_value: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
          points?: number | null
          requirement_type?: string | null
          requirement_value?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          points?: number | null
          requirement_type?: string | null
          requirement_value?: number | null
        }
        Relationships: []
      }
      activities: {
        Row: {
          activity_type: string
          calories_burned: number | null
          character_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          intensity: string | null
          logged_at: string | null
          notes: string | null
          stats_impact: Json | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          calories_burned?: number | null
          character_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          intensity?: string | null
          logged_at?: string | null
          notes?: string | null
          stats_impact?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          calories_burned?: number | null
          character_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          intensity?: string | null
          logged_at?: string | null
          notes?: string | null
          stats_impact?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      avatars: {
        Row: {
          attack: number | null
          created_at: string | null
          current_hp: number | null
          defense: number | null
          experience: number | null
          id: string
          is_active: boolean | null
          level: number | null
          max_hp: number | null
          name: string
          speed: number | null
          sprite_data: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attack?: number | null
          created_at?: string | null
          current_hp?: number | null
          defense?: number | null
          experience?: number | null
          id?: string
          is_active?: boolean | null
          level?: number | null
          max_hp?: number | null
          name: string
          speed?: number | null
          sprite_data: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attack?: number | null
          created_at?: string | null
          current_hp?: number | null
          defense?: number | null
          experience?: number | null
          id?: string
          is_active?: boolean | null
          level?: number | null
          max_hp?: number | null
          name?: string
          speed?: number | null
          sprite_data?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avatars_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      battles: {
        Row: {
          battle_type: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          moves_used: Json | null
          opponent_character_id: string | null
          opponent_health_end: number | null
          opponent_health_start: number | null
          player_character_id: string | null
          player_health_end: number | null
          player_health_start: number | null
          rewards: Json | null
          winner_id: string | null
        }
        Insert: {
          battle_type: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          moves_used?: Json | null
          opponent_character_id?: string | null
          opponent_health_end?: number | null
          opponent_health_start?: number | null
          player_character_id?: string | null
          player_health_end?: number | null
          player_health_start?: number | null
          rewards?: Json | null
          winner_id?: string | null
        }
        Update: {
          battle_type?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          moves_used?: Json | null
          opponent_character_id?: string | null
          opponent_health_end?: number | null
          opponent_health_start?: number | null
          player_character_id?: string | null
          player_health_end?: number | null
          player_health_start?: number | null
          rewards?: Json | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "battles_opponent_character_id_fkey"
            columns: ["opponent_character_id"]
            isOneToOne: false
            referencedRelation: "character_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_opponent_character_id_fkey"
            columns: ["opponent_character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_player_character_id_fkey"
            columns: ["player_character_id"]
            isOneToOne: false
            referencedRelation: "character_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_player_character_id_fkey"
            columns: ["player_character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "character_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_archetypes: {
        Row: {
          base_defense: number | null
          base_health: number | null
          base_speed: number | null
          base_strength: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          special_ability: string | null
        }
        Insert: {
          base_defense?: number | null
          base_health?: number | null
          base_speed?: number | null
          base_strength?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          special_ability?: string | null
        }
        Update: {
          base_defense?: number | null
          base_health?: number | null
          base_speed?: number | null
          base_strength?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          special_ability?: string | null
        }
        Relationships: []
      }
      character_customization: {
        Row: {
          accessory_ids: Json | null
          character_id: string | null
          created_at: string | null
          emote_ids: Json | null
          hair_color: string | null
          hair_style: string | null
          id: string
          outfit_id: string | null
          skin_tone: string | null
          updated_at: string | null
          victory_pose_id: string | null
        }
        Insert: {
          accessory_ids?: Json | null
          character_id?: string | null
          created_at?: string | null
          emote_ids?: Json | null
          hair_color?: string | null
          hair_style?: string | null
          id?: string
          outfit_id?: string | null
          skin_tone?: string | null
          updated_at?: string | null
          victory_pose_id?: string | null
        }
        Update: {
          accessory_ids?: Json | null
          character_id?: string | null
          created_at?: string | null
          emote_ids?: Json | null
          hair_color?: string | null
          hair_style?: string | null
          id?: string
          outfit_id?: string | null
          skin_tone?: string | null
          updated_at?: string | null
          victory_pose_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_customization_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "character_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_customization_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_evolution: {
        Row: {
          cardio_workouts: number | null
          character_id: string | null
          created_at: string | null
          evolution_points: number | null
          evolution_stage: number | null
          id: string
          next_evolution_at: number | null
          strength_workouts: number | null
          total_workouts: number | null
          updated_at: string | null
          wellness_workouts: number | null
        }
        Insert: {
          cardio_workouts?: number | null
          character_id?: string | null
          created_at?: string | null
          evolution_points?: number | null
          evolution_stage?: number | null
          id?: string
          next_evolution_at?: number | null
          strength_workouts?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          wellness_workouts?: number | null
        }
        Update: {
          cardio_workouts?: number | null
          character_id?: string | null
          created_at?: string | null
          evolution_points?: number | null
          evolution_stage?: number | null
          id?: string
          next_evolution_at?: number | null
          strength_workouts?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          wellness_workouts?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "character_evolution_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "character_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_evolution_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_stats: {
        Row: {
          character_id: string | null
          created_at: string | null
          defense: number | null
          health: number | null
          id: string
          max_health: number | null
          max_stamina: number | null
          speed: number | null
          stamina: number | null
          strength: number | null
          updated_at: string | null
        }
        Insert: {
          character_id?: string | null
          created_at?: string | null
          defense?: number | null
          health?: number | null
          id?: string
          max_health?: number | null
          max_stamina?: number | null
          speed?: number | null
          stamina?: number | null
          strength?: number | null
          updated_at?: string | null
        }
        Update: {
          character_id?: string | null
          created_at?: string | null
          defense?: number | null
          health?: number | null
          id?: string
          max_health?: number | null
          max_stamina?: number | null
          speed?: number | null
          stamina?: number | null
          strength?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_stats_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "character_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_stats_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          archetype_id: string | null
          best_streak: number | null
          created_at: string | null
          current_streak: number | null
          experience: number | null
          id: string
          is_active: boolean | null
          level: number | null
          name: string
          total_battles: number | null
          updated_at: string | null
          user_id: string | null
          wins: number | null
        }
        Insert: {
          archetype_id?: string | null
          best_streak?: number | null
          created_at?: string | null
          current_streak?: number | null
          experience?: number | null
          id?: string
          is_active?: boolean | null
          level?: number | null
          name: string
          total_battles?: number | null
          updated_at?: string | null
          user_id?: string | null
          wins?: number | null
        }
        Update: {
          archetype_id?: string | null
          best_streak?: number | null
          created_at?: string | null
          current_streak?: number | null
          experience?: number | null
          id?: string
          is_active?: boolean | null
          level?: number | null
          name?: string
          total_battles?: number | null
          updated_at?: string | null
          user_id?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "character_archetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      combat_sessions: {
        Row: {
          avatar_id: string
          boss_level: number
          boss_name: string
          combat_log: Json | null
          completed_at: string
          created_at: string | null
          damage_dealt: number | null
          damage_received: number | null
          duration_seconds: number
          experience_gained: number | null
          id: string
          started_at: string
          user_id: string
          victory: boolean
          workout_id: string | null
        }
        Insert: {
          avatar_id: string
          boss_level: number
          boss_name: string
          combat_log?: Json | null
          completed_at: string
          created_at?: string | null
          damage_dealt?: number | null
          damage_received?: number | null
          duration_seconds: number
          experience_gained?: number | null
          id?: string
          started_at: string
          user_id: string
          victory: boolean
          workout_id?: string | null
        }
        Update: {
          avatar_id?: string
          boss_level?: number
          boss_name?: string
          combat_log?: Json | null
          completed_at?: string
          created_at?: string | null
          damage_dealt?: number | null
          damage_received?: number | null
          duration_seconds?: number
          experience_gained?: number | null
          id?: string
          started_at?: string
          user_id?: string
          victory?: boolean
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "combat_sessions_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combat_sessions_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          active_date: string | null
          challenge_type: string | null
          created_at: string | null
          description: string | null
          id: string
          requirement_value: number | null
          reward_type: string | null
          reward_value: number | null
          title: string
        }
        Insert: {
          active_date?: string | null
          challenge_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          requirement_value?: number | null
          reward_type?: string | null
          reward_value?: number | null
          title: string
        }
        Update: {
          active_date?: string | null
          challenge_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          requirement_value?: number | null
          reward_type?: string | null
          reward_value?: number | null
          title?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          friend_id: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          friend_id?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          friend_id?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      guild_chat: {
        Row: {
          created_at: string | null
          guild_id: string | null
          id: string
          is_system_message: boolean | null
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          guild_id?: string | null
          id?: string
          is_system_message?: boolean | null
          message: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          guild_id?: string | null
          id?: string
          is_system_message?: boolean | null
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guild_chat_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_members: {
        Row: {
          contribution_points: number | null
          guild_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          contribution_points?: number | null
          guild_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          contribution_points?: number | null
          guild_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guild_members_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guilds: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          leader_id: string | null
          max_members: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          leader_id?: string | null
          max_members?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          leader_id?: string | null
          max_members?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      matchmaking_queue: {
        Row: {
          character_id: string | null
          created_at: string | null
          id: string
          preferred_region: string | null
          ranking_points: number | null
          searching_since: string | null
          user_id: string | null
        }
        Insert: {
          character_id?: string | null
          created_at?: string | null
          id?: string
          preferred_region?: string | null
          ranking_points?: number | null
          searching_since?: string | null
          user_id?: string | null
        }
        Update: {
          character_id?: string | null
          created_at?: string | null
          id?: string
          preferred_region?: string | null
          ranking_points?: number | null
          searching_since?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matchmaking_queue_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchmaking_queue_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      pvp_battles: {
        Row: {
          battle_data: Json | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          player1_character_id: string | null
          player1_id: string | null
          player2_character_id: string | null
          player2_id: string | null
          ranking_change_p1: number | null
          ranking_change_p2: number | null
          winner_id: string | null
        }
        Insert: {
          battle_data?: Json | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          player1_character_id?: string | null
          player1_id?: string | null
          player2_character_id?: string | null
          player2_id?: string | null
          ranking_change_p1?: number | null
          ranking_change_p2?: number | null
          winner_id?: string | null
        }
        Update: {
          battle_data?: Json | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          player1_character_id?: string | null
          player1_id?: string | null
          player2_character_id?: string | null
          player2_id?: string | null
          ranking_change_p1?: number | null
          ranking_change_p2?: number | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pvp_battles_player1_character_id_fkey"
            columns: ["player1_character_id"]
            isOneToOne: false
            referencedRelation: "character_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pvp_battles_player1_character_id_fkey"
            columns: ["player1_character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pvp_battles_player2_character_id_fkey"
            columns: ["player2_character_id"]
            isOneToOne: false
            referencedRelation: "character_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pvp_battles_player2_character_id_fkey"
            columns: ["player2_character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          character_id: string | null
          id: string
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          character_id?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          character_id?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_daily_challenges: {
        Row: {
          challenge_id: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          progress: number | null
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_daily_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          auth_status: string | null
          avatar_id: string | null
          avatar_url: string | null
          combat_character:
            | Database["public"]["Enums"]["combat_character"]
            | null
          created_at: string | null
          display_name: string | null
          evolution_stage: Database["public"]["Enums"]["evolution_stage"] | null
          fitness_archetype:
            | Database["public"]["Enums"]["fitness_archetype"]
            | null
          id: string
          level: number | null
          onboarding_completed: boolean | null
          photo_upload_url: string | null
          total_experience: number | null
          total_workouts: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          auth_status?: string | null
          avatar_id?: string | null
          avatar_url?: string | null
          combat_character?:
            | Database["public"]["Enums"]["combat_character"]
            | null
          created_at?: string | null
          display_name?: string | null
          evolution_stage?:
            | Database["public"]["Enums"]["evolution_stage"]
            | null
          fitness_archetype?:
            | Database["public"]["Enums"]["fitness_archetype"]
            | null
          id: string
          level?: number | null
          onboarding_completed?: boolean | null
          photo_upload_url?: string | null
          total_experience?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          auth_status?: string | null
          avatar_id?: string | null
          avatar_url?: string | null
          combat_character?:
            | Database["public"]["Enums"]["combat_character"]
            | null
          created_at?: string | null
          display_name?: string | null
          evolution_stage?:
            | Database["public"]["Enums"]["evolution_stage"]
            | null
          fitness_archetype?:
            | Database["public"]["Enums"]["fitness_archetype"]
            | null
          id?: string
          level?: number | null
          onboarding_completed?: boolean | null
          photo_upload_url?: string | null
          total_experience?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          haptic_enabled: boolean | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          privacy_mode: string | null
          sound_enabled: boolean | null
          timezone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          haptic_enabled?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          privacy_mode?: string | null
          sound_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          haptic_enabled?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          privacy_mode?: string | null
          sound_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      workouts: {
        Row: {
          calories_burned: number | null
          combat_session_id: string | null
          completed_at: string
          created_at: string | null
          distance_meters: number | null
          duration_seconds: number
          experience_gained: number | null
          heart_rate_avg: number | null
          id: string
          started_at: string
          user_id: string
          workout_type: Database["public"]["Enums"]["workout_type"]
        }
        Insert: {
          calories_burned?: number | null
          combat_session_id?: string | null
          completed_at: string
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds: number
          experience_gained?: number | null
          heart_rate_avg?: number | null
          id?: string
          started_at: string
          user_id: string
          workout_type: Database["public"]["Enums"]["workout_type"]
        }
        Update: {
          calories_burned?: number | null
          combat_session_id?: string | null
          completed_at?: string
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number
          experience_gained?: number | null
          heart_rate_avg?: number | null
          id?: string
          started_at?: string
          user_id?: string
          workout_type?: Database["public"]["Enums"]["workout_type"]
        }
        Relationships: [
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      character_leaderboard: {
        Row: {
          best_streak: number | null
          character_name: string | null
          current_streak: number | null
          id: string | null
          level: number | null
          total_battles: number | null
          username: string | null
          win_rate: number | null
          wins: number | null
        }
        Relationships: []
      }
      user_activity_stats: {
        Row: {
          active_days: number | null
          last_activity: string | null
          total_activities: number | null
          total_calories: number | null
          total_minutes: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_level: { Args: { exp: number }; Returns: number }
      create_deferred_user_profile: {
        Args: { p_display_name?: string; p_username: string }
        Returns: string
      }
      upgrade_deferred_to_auth: {
        Args: { p_auth_user_id: string; p_deferred_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      combat_character: "sean" | "mary"
      evolution_stage: "stage_1" | "stage_2" | "stage_3"
      fitness_archetype:
        | "trainer"
        | "runner"
        | "yoga"
        | "bodybuilder"
        | "cyclist"
      workout_type: "cardio" | "strength" | "flexibility" | "mixed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      combat_character: ["sean", "mary"],
      evolution_stage: ["stage_1", "stage_2", "stage_3"],
      fitness_archetype: [
        "trainer",
        "runner",
        "yoga",
        "bodybuilder",
        "cyclist",
      ],
      workout_type: ["cardio", "strength", "flexibility", "mixed"],
    },
  },
} as const
