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
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_agent_config: {
        Row: {
          channels: string[] | null
          created_at: string | null
          frequency_rules: Json | null
          id: string
          is_active: boolean | null
          message_templates: Json | null
          name: string
          purpose: string | null
          tenant_id: string | null
          tone: string | null
        }
        Insert: {
          channels?: string[] | null
          created_at?: string | null
          frequency_rules?: Json | null
          id?: string
          is_active?: boolean | null
          message_templates?: Json | null
          name: string
          purpose?: string | null
          tenant_id?: string | null
          tone?: string | null
        }
        Update: {
          channels?: string[] | null
          created_at?: string | null
          frequency_rules?: Json | null
          id?: string
          is_active?: boolean | null
          message_templates?: Json | null
          name?: string
          purpose?: string | null
          tenant_id?: string | null
          tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_config_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_followup_message: {
        Row: {
          agent_config_id: string | null
          channel: string | null
          created_at: string | null
          enterprise_objective_id: string | null
          id: string
          message_sent: string | null
          objective_id: string | null
          responded_at: string | null
          response_received: string | null
          sent_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          agent_config_id?: string | null
          channel?: string | null
          created_at?: string | null
          enterprise_objective_id?: string | null
          id?: string
          message_sent?: string | null
          objective_id?: string | null
          responded_at?: string | null
          response_received?: string | null
          sent_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          agent_config_id?: string | null
          channel?: string | null
          created_at?: string | null
          enterprise_objective_id?: string | null
          id?: string
          message_sent?: string | null
          objective_id?: string | null
          responded_at?: string | null
          response_received?: string | null
          sent_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_followup_message_agent_config_id_fkey"
            columns: ["agent_config_id"]
            isOneToOne: false
            referencedRelation: "ai_agent_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_followup_message_enterprise_objective_id_fkey"
            columns: ["enterprise_objective_id"]
            isOneToOne: false
            referencedRelation: "enterprise_objective"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_followup_message_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "user_objective"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_followup_message_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      badge_template: {
        Row: {
          auto_issue_rules: Json | null
          created_at: string | null
          criteria: string
          description: string | null
          hours_required: number | null
          id: string
          image_url: string
          is_active: boolean | null
          is_auto_issue: boolean | null
          level: string | null
          name: string
          ob3_metadata: Json | null
          skills: string[] | null
          tenant_id: string | null
        }
        Insert: {
          auto_issue_rules?: Json | null
          created_at?: string | null
          criteria: string
          description?: string | null
          hours_required?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          is_auto_issue?: boolean | null
          level?: string | null
          name: string
          ob3_metadata?: Json | null
          skills?: string[] | null
          tenant_id?: string | null
        }
        Update: {
          auto_issue_rules?: Json | null
          created_at?: string | null
          criteria?: string
          description?: string | null
          hours_required?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          is_auto_issue?: boolean | null
          level?: string | null
          name?: string
          ob3_metadata?: Json | null
          skills?: string[] | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "badge_template_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      credential_issued: {
        Row: {
          badge_template_id: string | null
          created_at: string | null
          credential_id: string
          expires_at: string | null
          id: string
          is_revoked: boolean | null
          issued_at: string | null
          last_verified_at: string | null
          linkedin_add_url: string | null
          ob3_json: Json | null
          program_schedule_id: string | null
          revoked_reason: string | null
          tenant_id: string | null
          user_id: string | null
          verification_count: number | null
          verification_url: string
        }
        Insert: {
          badge_template_id?: string | null
          created_at?: string | null
          credential_id: string
          expires_at?: string | null
          id?: string
          is_revoked?: boolean | null
          issued_at?: string | null
          last_verified_at?: string | null
          linkedin_add_url?: string | null
          ob3_json?: Json | null
          program_schedule_id?: string | null
          revoked_reason?: string | null
          tenant_id?: string | null
          user_id?: string | null
          verification_count?: number | null
          verification_url: string
        }
        Update: {
          badge_template_id?: string | null
          created_at?: string | null
          credential_id?: string
          expires_at?: string | null
          id?: string
          is_revoked?: boolean | null
          issued_at?: string | null
          last_verified_at?: string | null
          linkedin_add_url?: string | null
          ob3_json?: Json | null
          program_schedule_id?: string | null
          revoked_reason?: string | null
          tenant_id?: string | null
          user_id?: string | null
          verification_count?: number | null
          verification_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "credential_issued_badge_template_id_fkey"
            columns: ["badge_template_id"]
            isOneToOne: false
            referencedRelation: "badge_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credential_issued_program_schedule_id_fkey"
            columns: ["program_schedule_id"]
            isOneToOne: false
            referencedRelation: "program_schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credential_issued_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credential_issued_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      credential_verification_log: {
        Row: {
          credential_id: string | null
          id: string
          ip_address: string | null
          referrer: string | null
          user_agent: string | null
          verified_at: string | null
        }
        Insert: {
          credential_id?: string | null
          id?: string
          ip_address?: string | null
          referrer?: string | null
          user_agent?: string | null
          verified_at?: string | null
        }
        Update: {
          credential_id?: string | null
          id?: string
          ip_address?: string | null
          referrer?: string | null
          user_agent?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credential_verification_log_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "credential_issued"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_content: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          modules: Json | null
          price_mxn: number | null
          professional_id: string | null
          program_id: string | null
          royalty_pct: number | null
          tenant_id: string | null
          thumbnail_url: string | null
          title: string
          total_duration_hours: number | null
          total_revenue: number | null
          total_sales: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          modules?: Json | null
          price_mxn?: number | null
          professional_id?: string | null
          program_id?: string | null
          royalty_pct?: number | null
          tenant_id?: string | null
          thumbnail_url?: string | null
          title: string
          total_duration_hours?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          modules?: Json | null
          price_mxn?: number | null
          professional_id?: string | null
          program_id?: string | null
          royalty_pct?: number | null
          tenant_id?: string | null
          thumbnail_url?: string | null
          title?: string
          total_duration_hours?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_content_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digital_content_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digital_content_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_content_access: {
        Row: {
          access_type: string | null
          completed_at: string | null
          digital_content_id: string | null
          granted_at: string | null
          id: string
          progress_pct: number | null
          user_id: string | null
        }
        Insert: {
          access_type?: string | null
          completed_at?: string | null
          digital_content_id?: string | null
          granted_at?: string | null
          id?: string
          progress_pct?: number | null
          user_id?: string | null
        }
        Update: {
          access_type?: string | null
          completed_at?: string | null
          digital_content_id?: string | null
          granted_at?: string | null
          id?: string
          progress_pct?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_content_access_digital_content_id_fkey"
            columns: ["digital_content_id"]
            isOneToOne: false
            referencedRelation: "digital_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digital_content_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollment: {
        Row: {
          completion_date: string | null
          created_at: string | null
          enrollment_date: string | null
          enterprise_id: string | null
          id: string
          invoice_id: string | null
          payment_amount: number | null
          payment_method: string | null
          payment_status: string | null
          program_schedule_id: string | null
          status: string | null
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          enrollment_date?: string | null
          enterprise_id?: string | null
          id?: string
          invoice_id?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          program_schedule_id?: string | null
          status?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          enrollment_date?: string | null
          enterprise_id?: string | null
          id?: string
          invoice_id?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          program_schedule_id?: string | null
          status?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprise"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollment_program_schedule_id_fkey"
            columns: ["program_schedule_id"]
            isOneToOne: false
            referencedRelation: "program_schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollment_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          hr_contact_email: string | null
          hr_contact_name: string | null
          hr_contact_phone: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          max_collaborators: number | null
          membership_expiry_date: string | null
          membership_start_date: string | null
          membership_tier: string | null
          name: string
          phone: string | null
          rfc: string | null
          sector: string | null
          size: string | null
          state: string | null
          tenant_id: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          hr_contact_email?: string | null
          hr_contact_name?: string | null
          hr_contact_phone?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_collaborators?: number | null
          membership_expiry_date?: string | null
          membership_start_date?: string | null
          membership_tier?: string | null
          name: string
          phone?: string | null
          rfc?: string | null
          sector?: string | null
          size?: string | null
          state?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          hr_contact_email?: string | null
          hr_contact_name?: string | null
          hr_contact_phone?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_collaborators?: number | null
          membership_expiry_date?: string | null
          membership_start_date?: string | null
          membership_tier?: string | null
          name?: string
          phone?: string | null
          rfc?: string | null
          sector?: string | null
          size?: string | null
          state?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_collaborator: {
        Row: {
          added_at: string | null
          department: string | null
          enterprise_id: string | null
          id: string
          is_active: boolean | null
          organizational_level: string | null
          position: string | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          department?: string | null
          enterprise_id?: string | null
          id?: string
          is_active?: boolean | null
          organizational_level?: string | null
          position?: string | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          department?: string | null
          enterprise_id?: string | null
          id?: string
          is_active?: boolean | null
          organizational_level?: string | null
          position?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_collaborator_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprise"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_collaborator_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_objective: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          department: string | null
          enterprise_id: string | null
          id: string
          level: string | null
          objective_text: string
          parent_objective_id: string | null
          status: string | null
          target_date: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          department?: string | null
          enterprise_id?: string | null
          id?: string
          level?: string | null
          objective_text: string
          parent_objective_id?: string | null
          status?: string | null
          target_date?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          department?: string | null
          enterprise_id?: string | null
          id?: string
          level?: string | null
          objective_text?: string
          parent_objective_id?: string | null
          status?: string | null
          target_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_objective_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_objective_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprise"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enterprise_objective_parent_objective_id_fkey"
            columns: ["parent_objective_id"]
            isOneToOne: false
            referencedRelation: "enterprise_objective"
            referencedColumns: ["id"]
          },
        ]
      }
      expense: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          invoice_url: string | null
          recurring: boolean | null
          subcategory: string | null
          tenant_id: string | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          invoice_url?: string | null
          recurring?: boolean | null
          subcategory?: string | null
          tenant_id?: string | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          invoice_url?: string | null
          recurring?: boolean | null
          subcategory?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      external_client: {
        Row: {
          api_key: string | null
          billing_status: string | null
          brand_colors: Json | null
          contact_email: string | null
          contact_name: string | null
          created_at: string | null
          credentials_issued_ytd: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          max_credentials_year: number | null
          name: string
          plan: string | null
          price_usd_year: number | null
          slug: string | null
          subdomain: string | null
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          billing_status?: string | null
          brand_colors?: Json | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          credentials_issued_ytd?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_credentials_year?: number | null
          name: string
          plan?: string | null
          price_usd_year?: number | null
          slug?: string | null
          subdomain?: string | null
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          billing_status?: string | null
          brand_colors?: Json | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          credentials_issued_ytd?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_credentials_year?: number | null
          name?: string
          plan?: string | null
          price_usd_year?: number | null
          slug?: string | null
          subdomain?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      external_credential_issued: {
        Row: {
          badge_name: string | null
          credential_id: string
          external_client_id: string | null
          id: string
          issued_at: string | null
          metadata: Json | null
          recipient_email: string | null
          recipient_name: string | null
          verification_count: number | null
          verification_url: string | null
        }
        Insert: {
          badge_name?: string | null
          credential_id: string
          external_client_id?: string | null
          id?: string
          issued_at?: string | null
          metadata?: Json | null
          recipient_email?: string | null
          recipient_name?: string | null
          verification_count?: number | null
          verification_url?: string | null
        }
        Update: {
          badge_name?: string | null
          credential_id?: string
          external_client_id?: string | null
          id?: string
          issued_at?: string | null
          metadata?: Json | null
          recipient_email?: string | null
          recipient_name?: string | null
          verification_count?: number | null
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_credential_issued_external_client_id_fkey"
            columns: ["external_client_id"]
            isOneToOne: false
            referencedRelation: "external_client"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transaction: {
        Row: {
          amount_center: number | null
          amount_gross: number | null
          amount_professional: number | null
          created_at: string | null
          description: string | null
          enrollment_id: string | null
          enterprise_id: string | null
          fiscal_concept: string | null
          id: string
          invoice_number: string | null
          invoice_url: string | null
          payment_date: string | null
          payment_status: string | null
          professional_id: string | null
          program_id: string | null
          split_pct_center: number | null
          split_pct_professional: number | null
          tenant_id: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          amount_center?: number | null
          amount_gross?: number | null
          amount_professional?: number | null
          created_at?: string | null
          description?: string | null
          enrollment_id?: string | null
          enterprise_id?: string | null
          fiscal_concept?: string | null
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          payment_date?: string | null
          payment_status?: string | null
          professional_id?: string | null
          program_id?: string | null
          split_pct_center?: number | null
          split_pct_professional?: number | null
          tenant_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          amount_center?: number | null
          amount_gross?: number | null
          amount_professional?: number | null
          created_at?: string | null
          description?: string | null
          enrollment_id?: string | null
          enterprise_id?: string | null
          fiscal_concept?: string | null
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          payment_date?: string | null
          payment_status?: string | null
          professional_id?: string | null
          program_id?: string | null
          split_pct_center?: number | null
          split_pct_professional?: number | null
          tenant_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transaction_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transaction_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprise"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transaction_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transaction_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transaction_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transaction_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plan: {
        Row: {
          billing_period: string | null
          created_at: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_users: number | null
          name: string
          price_mxn: number | null
          target_profile: Database["public"]["Enums"]["user_role"]
          tier: string
        }
        Insert: {
          billing_period?: string | null
          created_at?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_users?: number | null
          name: string
          price_mxn?: number | null
          target_profile: Database["public"]["Enums"]["user_role"]
          tier: string
        }
        Update: {
          billing_period?: string | null
          created_at?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_users?: number | null
          name?: string
          price_mxn?: number | null
          target_profile?: Database["public"]["Enums"]["user_role"]
          tier?: string
        }
        Relationships: []
      }
      membership_subscription: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          enterprise_id: string | null
          id: string
          payment_method: string | null
          plan_id: string | null
          start_date: string
          status: string | null
          stripe_subscription_id: string | null
          tenant_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          enterprise_id?: string | null
          id?: string
          payment_method?: string | null
          plan_id?: string | null
          start_date: string
          status?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          enterprise_id?: string | null
          id?: string
          payment_method?: string | null
          plan_id?: string | null
          start_date?: string
          status?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_subscription_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprise"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_subscription_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_subscription_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_subscription_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      message: {
        Row: {
          body: string | null
          created_at: string | null
          from_user_id: string | null
          id: string
          is_read: boolean | null
          subject: string | null
          tenant_id: string | null
          to_user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          subject?: string | null
          tenant_id?: string | null
          to_user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          subject?: string | null
          tenant_id?: string | null
          to_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      methodology_diagnostic: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          industries: Json | null
          investments: Json | null
          legislation: Json | null
          notes: string | null
          opportunities: Json | null
          period: string | null
          problems: Json | null
          scope: string | null
          tenant_id: string | null
          trends: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          industries?: Json | null
          investments?: Json | null
          legislation?: Json | null
          notes?: string | null
          opportunities?: Json | null
          period?: string | null
          problems?: Json | null
          scope?: string | null
          tenant_id?: string | null
          trends?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          industries?: Json | null
          investments?: Json | null
          legislation?: Json | null
          notes?: string | null
          opportunities?: Json | null
          period?: string | null
          problems?: Json | null
          scope?: string | null
          tenant_id?: string | null
          trends?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "methodology_diagnostic_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "methodology_diagnostic_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      methodology_topic_validation: {
        Row: {
          created_at: string | null
          diagnostic_id: string | null
          id: string
          impact_justification: string | null
          impact_type: string | null
          performance_data: Json | null
          recommended_format: Database["public"]["Enums"]["format_type"] | null
          recommended_modality:
            | Database["public"]["Enums"]["modality_type"]
            | null
          status: string | null
          target_audience: string | null
          topic: string
          updated_at: string | null
          validated_by: string | null
        }
        Insert: {
          created_at?: string | null
          diagnostic_id?: string | null
          id?: string
          impact_justification?: string | null
          impact_type?: string | null
          performance_data?: Json | null
          recommended_format?: Database["public"]["Enums"]["format_type"] | null
          recommended_modality?:
            | Database["public"]["Enums"]["modality_type"]
            | null
          status?: string | null
          target_audience?: string | null
          topic: string
          updated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          created_at?: string | null
          diagnostic_id?: string | null
          id?: string
          impact_justification?: string | null
          impact_type?: string | null
          performance_data?: Json | null
          recommended_format?: Database["public"]["Enums"]["format_type"] | null
          recommended_modality?:
            | Database["public"]["Enums"]["modality_type"]
            | null
          status?: string | null
          target_audience?: string | null
          topic?: string
          updated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "methodology_topic_validation_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "methodology_diagnostic"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "methodology_topic_validation_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      notification: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string | null
          tenant_id: string | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          tenant_id?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          tenant_id?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      post_event_evaluation: {
        Row: {
          comments: string | null
          created_at: string | null
          duration_adequacy: number | null
          facilitator_clarity: number | null
          facilitator_interaction: number | null
          facilitator_mastery: number | null
          facilitator_preparation: number | null
          facilitator_punctuality: number | null
          format_adequacy: number | null
          id: string
          infrastructure_score: number | null
          overall_score: number | null
          program_schedule_id: string | null
          tenant_id: string | null
          topic_relevance_score: number | null
          topic_update_score: number | null
          would_recommend: boolean | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          duration_adequacy?: number | null
          facilitator_clarity?: number | null
          facilitator_interaction?: number | null
          facilitator_mastery?: number | null
          facilitator_preparation?: number | null
          facilitator_punctuality?: number | null
          format_adequacy?: number | null
          id?: string
          infrastructure_score?: number | null
          overall_score?: number | null
          program_schedule_id?: string | null
          tenant_id?: string | null
          topic_relevance_score?: number | null
          topic_update_score?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          duration_adequacy?: number | null
          facilitator_clarity?: number | null
          facilitator_interaction?: number | null
          facilitator_mastery?: number | null
          facilitator_preparation?: number | null
          facilitator_punctuality?: number | null
          format_adequacy?: number | null
          id?: string
          infrastructure_score?: number | null
          overall_score?: number | null
          program_schedule_id?: string | null
          tenant_id?: string | null
          topic_relevance_score?: number | null
          topic_update_score?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "post_event_evaluation_program_schedule_id_fkey"
            columns: ["program_schedule_id"]
            isOneToOne: false
            referencedRelation: "program_schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_event_evaluation_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_profile: {
        Row: {
          academic_degrees: Json | null
          admission_date: string | null
          contract_expiry: string | null
          created_at: string | null
          id: string
          image_rights_signed: boolean | null
          institutional_email: string | null
          is_active: boolean | null
          is_master_consultant: boolean | null
          master_consultant_date: string | null
          master_progress_pct: number | null
          membership_tier: string | null
          nda_signed: boolean | null
          performance_score: number | null
          professional_experience: Json | null
          public_profile_slug: string | null
          qr_code_url: string | null
          specialties: string[] | null
          tenant_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          academic_degrees?: Json | null
          admission_date?: string | null
          contract_expiry?: string | null
          created_at?: string | null
          id?: string
          image_rights_signed?: boolean | null
          institutional_email?: string | null
          is_active?: boolean | null
          is_master_consultant?: boolean | null
          master_consultant_date?: string | null
          master_progress_pct?: number | null
          membership_tier?: string | null
          nda_signed?: boolean | null
          performance_score?: number | null
          professional_experience?: Json | null
          public_profile_slug?: string | null
          qr_code_url?: string | null
          specialties?: string[] | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          academic_degrees?: Json | null
          admission_date?: string | null
          contract_expiry?: string | null
          created_at?: string | null
          id?: string
          image_rights_signed?: boolean | null
          institutional_email?: string | null
          is_active?: boolean | null
          is_master_consultant?: boolean | null
          master_consultant_date?: string | null
          master_progress_pct?: number | null
          membership_tier?: string | null
          nda_signed?: boolean | null
          performance_score?: number | null
          professional_experience?: Json | null
          public_profile_slug?: string | null
          qr_code_url?: string | null
          specialties?: string[] | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_profile_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_tenant: {
        Row: {
          id: string
          is_active: boolean | null
          joined_at: string | null
          membership_tier: string | null
          professional_id: string | null
          tenant_id: string | null
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          membership_tier?: string | null
          professional_id?: string | null
          tenant_id?: string | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          membership_tier?: string | null
          professional_id?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_tenant_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_tenant_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      program: {
        Row: {
          created_at: string | null
          description: string | null
          duration_hours: number | null
          entry_profile: string | null
          exit_profile: string | null
          format: Database["public"]["Enums"]["format_type"]
          id: string
          is_active: boolean | null
          is_published: boolean | null
          is_recordable: boolean | null
          max_participants: number | null
          methodology_notes: string | null
          methodology_validated: boolean | null
          modality: Database["public"]["Enums"]["modality_type"]
          num_sessions: number | null
          price_mxn: number | null
          professional_id: string | null
          split_center: number | null
          split_professional: number | null
          syllabus: Json | null
          tenant_id: string | null
          tier: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          entry_profile?: string | null
          exit_profile?: string | null
          format: Database["public"]["Enums"]["format_type"]
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          is_recordable?: boolean | null
          max_participants?: number | null
          methodology_notes?: string | null
          methodology_validated?: boolean | null
          modality: Database["public"]["Enums"]["modality_type"]
          num_sessions?: number | null
          price_mxn?: number | null
          professional_id?: string | null
          split_center?: number | null
          split_professional?: number | null
          syllabus?: Json | null
          tenant_id?: string | null
          tier?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          entry_profile?: string | null
          exit_profile?: string | null
          format?: Database["public"]["Enums"]["format_type"]
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          is_recordable?: boolean | null
          max_participants?: number | null
          methodology_notes?: string | null
          methodology_validated?: boolean | null
          modality?: Database["public"]["Enums"]["modality_type"]
          num_sessions?: number | null
          price_mxn?: number | null
          professional_id?: string | null
          split_center?: number | null
          split_professional?: number | null
          syllabus?: Json | null
          tenant_id?: string | null
          tier?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      program_schedule: {
        Row: {
          created_at: string | null
          current_participants: number | null
          end_date: string | null
          id: string
          location: string | null
          max_participants: number | null
          program_id: string | null
          sessions: Json | null
          start_date: string
          status: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          end_date?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          program_id?: string | null
          sessions?: Json | null
          start_date: string
          status?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          end_date?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          program_id?: string | null
          sessions?: Json | null
          start_date?: string
          status?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_schedule_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_schedule_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      program_skill: {
        Row: {
          id: string
          program_id: string | null
          skill_id: string | null
          target_level: string | null
          weight: number | null
        }
        Insert: {
          id?: string
          program_id?: string | null
          skill_id?: string | null
          target_level?: string | null
          weight?: number | null
        }
        Update: {
          id?: string
          program_id?: string | null
          skill_id?: string | null
          target_level?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "program_skill_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_skill_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skill"
            referencedColumns: ["id"]
          },
        ]
      }
      skill: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          subcategory: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subcategory?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subcategory?: string | null
        }
        Relationships: []
      }
      skill_assessment: {
        Row: {
          assessed_at: string | null
          assessment_type: string | null
          id: string
          level_achieved: string | null
          notes: string | null
          score: number | null
          skill_id: string | null
          user_id: string | null
        }
        Insert: {
          assessed_at?: string | null
          assessment_type?: string | null
          id?: string
          level_achieved?: string | null
          notes?: string | null
          score?: number | null
          skill_id?: string | null
          user_id?: string | null
        }
        Update: {
          assessed_at?: string | null
          assessment_type?: string | null
          id?: string
          level_achieved?: string | null
          notes?: string | null
          score?: number | null
          skill_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_assessment_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skill"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_assessment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      space: {
        Row: {
          capacity: number | null
          equipment: string[] | null
          id: string
          is_active: boolean | null
          is_recordable: boolean | null
          name: string
          tenant_id: string | null
          type: string | null
        }
        Insert: {
          capacity?: number | null
          equipment?: string[] | null
          id?: string
          is_active?: boolean | null
          is_recordable?: boolean | null
          name: string
          tenant_id?: string | null
          type?: string | null
        }
        Update: {
          capacity?: number | null
          equipment?: string[] | null
          id?: string
          is_active?: boolean | null
          is_recordable?: boolean | null
          name?: string
          tenant_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "space_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      space_booking: {
        Row: {
          booked_by: string | null
          created_at: string | null
          end_time: string
          id: string
          priority: number | null
          program_schedule_id: string | null
          space_id: string | null
          start_time: string
          status: string | null
          tenant_id: string | null
          title: string | null
          type: string | null
        }
        Insert: {
          booked_by?: string | null
          created_at?: string | null
          end_time: string
          id?: string
          priority?: number | null
          program_schedule_id?: string | null
          space_id?: string | null
          start_time: string
          status?: string | null
          tenant_id?: string | null
          title?: string | null
          type?: string | null
        }
        Update: {
          booked_by?: string | null
          created_at?: string | null
          end_time?: string
          id?: string
          priority?: number | null
          program_schedule_id?: string | null
          space_id?: string | null
          start_time?: string
          status?: string | null
          tenant_id?: string | null
          title?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "space_booking_booked_by_fkey"
            columns: ["booked_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_booking_program_schedule_id_fkey"
            columns: ["program_schedule_id"]
            isOneToOne: false
            referencedRelation: "program_schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_booking_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "space"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_booking_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant: {
        Row: {
          address: string | null
          brand_primary_color: string | null
          brand_secondary_color: string | null
          city: string
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          razon_social: string | null
          rfc: string | null
          slug: string
          state: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          city: string
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          razon_social?: string | null
          rfc?: string | null
          slug: string
          state: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          city?: string
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          razon_social?: string | null
          rfc?: string | null
          slug?: string
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_objective: {
        Row: {
          ai_followup_date: string | null
          ai_followup_response: string | null
          ai_followup_sent: boolean | null
          created_at: string | null
          enrollment_id: string | null
          id: string
          objective_text: string
          result_notes: string | null
          status: string | null
          target_date: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_followup_date?: string | null
          ai_followup_response?: string | null
          ai_followup_sent?: boolean | null
          created_at?: string | null
          enrollment_id?: string | null
          id?: string
          objective_text: string
          result_notes?: string | null
          status?: string | null
          target_date: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_followup_date?: string | null
          ai_followup_response?: string | null
          ai_followup_sent?: boolean | null
          created_at?: string | null
          enrollment_id?: string | null
          id?: string
          objective_text?: string
          result_notes?: string | null
          status?: string | null
          target_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_objective_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_objective_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          bio: string | null
          city: string | null
          client_number: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          instagram_url: string | null
          is_active: boolean | null
          last_name: string
          linkedin_url: string | null
          phone: string | null
          photo_url: string | null
          state: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          client_number?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id: string
          instagram_url?: string | null
          is_active?: boolean | null
          last_name: string
          linkedin_url?: string | null
          phone?: string | null
          photo_url?: string | null
          state?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          client_number?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          instagram_url?: string | null
          is_active?: boolean | null
          last_name?: string
          linkedin_url?: string | null
          phone?: string | null
          photo_url?: string | null
          state?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      user_skill: {
        Row: {
          current_level: string | null
          id: string
          last_updated: string | null
          programs_completed: number | null
          skill_id: string | null
          source_enrollments: string[] | null
          total_hours: number | null
          user_id: string | null
        }
        Insert: {
          current_level?: string | null
          id?: string
          last_updated?: string | null
          programs_completed?: number | null
          skill_id?: string | null
          source_enrollments?: string[] | null
          total_hours?: number | null
          user_id?: string | null
        }
        Update: {
          current_level?: string | null
          id?: string
          last_updated?: string | null
          programs_completed?: number | null
          skill_id?: string | null
          source_enrollments?: string[] | null
          total_hours?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skill_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skill"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skill_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tenant_role: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_read_only: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_read_only?: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_read_only?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tenant_role_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tenant_role_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_and_issue: { Args: { p_enrollment_id: string }; Returns: string }
      current_professional_id: { Args: never; Returns: string }
      has_tenant_access: { Args: { p_tenant_id: string }; Returns: boolean }
      is_admin_of: { Args: { p_tenant_id: string }; Returns: boolean }
      is_enterprise_member: {
        Args: { p_enterprise_id: string }
        Returns: boolean
      }
      is_superadmin: { Args: never; Returns: boolean }
      is_tenant_admin: { Args: { p_tenant_id: string }; Returns: boolean }
      shares_tenant_with: { Args: { p_user_id: string }; Returns: boolean }
      verify_credential: { Args: { p_credential_id: string }; Returns: Json }
    }
    Enums: {
      format_type:
        | "conference"
        | "workshop"
        | "course"
        | "diploma"
        | "coaching"
        | "consultancy"
      modality_type: "presencial" | "online" | "hybrid"
      user_role:
        | "superadmin"
        | "admin"
        | "professional"
        | "user"
        | "enterprise_admin"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      format_type: [
        "conference",
        "workshop",
        "course",
        "diploma",
        "coaching",
        "consultancy",
      ],
      modality_type: ["presencial", "online", "hybrid"],
      user_role: [
        "superadmin",
        "admin",
        "professional",
        "user",
        "enterprise_admin",
      ],
    },
  },
} as const
