export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      artisan_translations: {
        Row: {
          artisan_id: string
          id: string
          lang: Database["public"]["Enums"]["lang"]
          name: string
        }
        Insert: {
          artisan_id: string
          id?: string
          lang: Database["public"]["Enums"]["lang"]
          name: string
        }
        Update: {
          artisan_id?: string
          id?: string
          lang?: Database["public"]["Enums"]["lang"]
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "artisan_translations_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
        ]
      }
      artisans: {
        Row: {
          created_at: string
          id: string
          photo_url: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          photo_url?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          photo_url?: string | null
          slug?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          eyecatch_url: string | null
          id: string
          news_category_id: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["news_status"]
        }
        Insert: {
          eyecatch_url?: string | null
          id?: string
          news_category_id?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["news_status"]
        }
        Update: {
          eyecatch_url?: string | null
          id?: string
          news_category_id?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["news_status"]
        }
        Relationships: [
          {
            foreignKeyName: "news_news_category_id_fkey"
            columns: ["news_category_id"]
            isOneToOne: false
            referencedRelation: "news_category"
            referencedColumns: ["id"]
          },
        ]
      }
      news_category: {
        Row: {
          id: string
          name_en: string
          name_ja: string
          name_zh: string
          slug: string
        }
        Insert: {
          id?: string
          name_en: string
          name_ja: string
          name_zh: string
          slug: string
        }
        Update: {
          id?: string
          name_en?: string
          name_ja?: string
          name_zh?: string
          slug?: string
        }
        Relationships: []
      }
      news_translations: {
        Row: {
          body: string
          id: string
          lang: Database["public"]["Enums"]["lang"]
          news_id: string
          title: string
        }
        Insert: {
          body: string
          id?: string
          lang: Database["public"]["Enums"]["lang"]
          news_id: string
          title: string
        }
        Update: {
          body?: string
          id?: string
          lang?: Database["public"]["Enums"]["lang"]
          news_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_translations_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          qty: number
          unit_price_yen: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          qty: number
          unit_price_yen: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          qty?: number
          unit_price_yen?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_line1: string
          address_line2: string | null
          created_at: string
          currency: string
          customer_name: string
          email: string
          exchange_rate: number
          exchange_rate_timestamp: string
          id: string
          items_subtotal_amount: number
          items_subtotal_yen: number
          lang: Database["public"]["Enums"]["lang"]
          order_number: string
          org_name: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          phone: string
          postal_code: string
          prefecture: string
          shipping_amount: number
          shipping_yen: number
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          total_yen: number
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          created_at?: string
          currency?: string
          customer_name: string
          email: string
          exchange_rate?: number
          exchange_rate_timestamp: string
          id?: string
          items_subtotal_amount: number
          items_subtotal_yen: number
          lang?: Database["public"]["Enums"]["lang"]
          order_number: string
          org_name?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          phone: string
          postal_code: string
          prefecture: string
          shipping_amount: number
          shipping_yen: number
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          total_yen: number
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          created_at?: string
          currency?: string
          customer_name?: string
          email?: string
          exchange_rate?: number
          exchange_rate_timestamp?: string
          id?: string
          items_subtotal_amount?: number
          items_subtotal_yen?: number
          lang?: Database["public"]["Enums"]["lang"]
          order_number?: string
          org_name?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          phone?: string
          postal_code?: string
          prefecture?: string
          shipping_amount?: number
          shipping_yen?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          total_yen?: number
        }
        Relationships: []
      }
      product_category: {
        Row: {
          id: string
          name_en: string
          name_ja: string
          name_zh: string
          slug: string
        }
        Insert: {
          id?: string
          name_en: string
          name_ja: string
          name_zh: string
          slug: string
        }
        Update: {
          id?: string
          name_en?: string
          name_ja?: string
          name_zh?: string
          slug?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          blur_data: string | null
          created_at: string
          id: string
          is_main: boolean
          key: string
          product_id: string
          sort: number
          variants: Json
        }
        Insert: {
          blur_data?: string | null
          created_at?: string
          id?: string
          is_main?: boolean
          key: string
          product_id: string
          sort?: number
          variants?: Json
        }
        Update: {
          blur_data?: string | null
          created_at?: string
          id?: string
          is_main?: boolean
          key?: string
          product_id?: string
          sort?: number
          variants?: Json
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_translations: {
        Row: {
          description: string
          id: string
          lang: Database["public"]["Enums"]["lang"]
          product_id: string
          title: string
        }
        Insert: {
          description: string
          id?: string
          lang: Database["public"]["Enums"]["lang"]
          product_id: string
          title: string
        }
        Update: {
          description?: string
          id?: string
          lang?: Database["public"]["Enums"]["lang"]
          product_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          id: string
          price_yen: number
          product_category_id: string
          sale_start_at: string
          sku: string
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          stock: number
          updated_at: string
          weight_grams: number
        }
        Insert: {
          created_at?: string
          id?: string
          price_yen: number
          product_category_id: string
          sale_start_at?: string
          sku: string
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          updated_at?: string
          weight_grams: number
        }
        Update: {
          created_at?: string
          id?: string
          price_yen?: number
          product_category_id?: string
          sale_start_at?: string
          sku?: string
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          updated_at?: string
          weight_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_product_category_id_fkey"
            columns: ["product_category_id"]
            isOneToOne: false
            referencedRelation: "product_category"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      process_checkout_session: {
        Args: {
          p_address_line1: string
          p_address_line2: string
          p_currency: string
          p_customer_name: string
          p_email: string
          p_exchange_rate: number
          p_exchange_rate_timestamp: string
          p_items_subtotal_amount: number
          p_items_subtotal_yen: number
          p_lang: Database["public"]["Enums"]["lang"]
          p_order_number: string
          p_org_name?: string
          p_payment_method: Database["public"]["Enums"]["payment_method"]
          p_phone: string
          p_postal_code: string
          p_prefecture: string
          p_product_ids: string[]
          p_qtys?: number[]
          p_shipping_amount: number
          p_shipping_yen: number
          p_status: Database["public"]["Enums"]["order_status"]
          p_total_amount: number
          p_total_yen: number
          p_unit_prices_yen: number[]
        }
        Returns: string
      }
    }
    Enums: {
      lang: "ja" | "en" | "zh"
      news_status: "draft" | "published"
      order_status: "pending_payment" | "paid"
      payment_method: "card" | "postal_transfer"
      product_status: "draft" | "published" | "archived"
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
      lang: ["ja", "en", "zh"],
      news_status: ["draft", "published"],
      order_status: ["pending_payment", "paid"],
      payment_method: ["card", "postal_transfer"],
      product_status: ["draft", "published", "archived"],
    },
  },
} as const

