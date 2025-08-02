export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          event_date: string;
          image_url: string;
          tier: 'free' | 'silver' | 'gold' | 'platinum';
        };
        Insert: {
          id?: string; // optional because it's generated
          title: string;
          description: string;
          event_date: string;
          image_url: string;
          tier: 'free' | 'silver' | 'gold' | 'platinum';
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          event_date?: string;
          image_url?: string;
          tier?: 'free' | 'silver' | 'gold' | 'platinum';
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_tier: 'free' | 'silver' | 'gold' | 'platinum';
    };
  };
};
