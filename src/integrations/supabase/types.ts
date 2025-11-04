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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blood_requests: {
        Row: {
          blood_group_needed: string
          contact_number: string
          created_at: string
          created_by: string
          handled_by_volunteer_id: string | null
          hospital: string
          id: string
          patient_name: string
          status: string
          updated_at: string
          urgency: string
        }
        Insert: {
          blood_group_needed: string
          contact_number: string
          created_at?: string
          created_by: string
          handled_by_volunteer_id?: string | null
          hospital: string
          id?: string
          patient_name: string
          status?: string
          updated_at?: string
          urgency: string
        }
        Update: {
          blood_group_needed?: string
          contact_number?: string
          created_at?: string
          created_by?: string
          handled_by_volunteer_id?: string | null
          hospital?: string
          id?: string
          patient_name?: string
          status?: string
          updated_at?: string
          urgency?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          created_at: string
          donation_date: string
          donor_id: string
          id: string
          notes: string | null
          request_id: string | null
          status: string
          volunteer_id: string | null
        }
        Insert: {
          created_at?: string
          donation_date: string
          donor_id: string
          id?: string
          notes?: string | null
          request_id?: string | null
          status: string
          volunteer_id?: string | null
        }
        Update: {
          created_at?: string
          donation_date?: string
          donor_id?: string
          id?: string
          notes?: string | null
          request_id?: string | null
          status?: string
          volunteer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          availability_notes: string | null
          blood_group: string
          created_at: string
          department: string
          donation_count: number
          email: string
          hall: string
          id: string
          last_donation_date: string | null
          medical_eligible: boolean
          name: string
          phone: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          availability_notes?: string | null
          blood_group: string
          created_at?: string
          department: string
          donation_count?: number
          email: string
          hall: string
          id?: string
          last_donation_date?: string | null
          medical_eligible?: boolean
          name: string
          phone: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          availability_notes?: string | null
          blood_group?: string
          created_at?: string
          department?: string
          donation_count?: number
          email?: string
          hall?: string
          id?: string
          last_donation_date?: string | null
          medical_eligible?: boolean
          name?: string
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sheet_data: {
        Row: {
          blood_group: string
          created_at: string
          department: string
          donation_count: string
          donor_name: string
          father_name: string
          id: string
          mother_name: string
          serial_no: string
          sheet_id: string
          updated_at: string
        }
        Insert: {
          blood_group: string
          created_at?: string
          department: string
          donation_count?: string
          donor_name: string
          father_name: string
          id?: string
          mother_name: string
          serial_no: string
          sheet_id: string
          updated_at?: string
        }
        Update: {
          blood_group?: string
          created_at?: string
          department?: string
          donation_count?: string
          donor_name?: string
          father_name?: string
          id?: string
          mother_name?: string
          serial_no?: string
          sheet_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sheet_data_sheet_id_fkey"
            columns: ["sheet_id"]
            isOneToOne: false
            referencedRelation: "sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      sheets: {
        Row: {
          created_at: string
          hall_name: string | null
          id: string
          sheet_name: string
          total_rows: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          hall_name?: string | null
          id?: string
          sheet_name: string
          total_rows?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          hall_name?: string | null
          id?: string
          sheet_name?: string
          total_rows?: number
          updated_at?: string
        }
        Relationships: []
      }
      suggested_donors: {
        Row: {
          contacted: boolean
          created_at: string
          donor_id: string
          id: string
          match_score: number
          request_id: string
          response: string | null
        }
        Insert: {
          contacted?: boolean
          created_at?: string
          donor_id: string
          id?: string
          match_score: number
          request_id: string
          response?: string | null
        }
        Update: {
          contacted?: boolean
          created_at?: string
          donor_id?: string
          id?: string
          match_score?: number
          request_id?: string
          response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggested_donors_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggested_donors_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
