type Json =
 | string
 | number
 | boolean
 | null
 | { [key: string]: Json | undefined }
 | Json[];

interface Database {
 public: {
  Tables: {
   comments: {
    Row: {
     author: string;
     created_at: string | null;
     date: string;
     id: number;
     item_id: number | null;
     rating: number;
     text: string;
     type: string;
    };
    Insert: {
     author: string;
     created_at?: string | null;
     date: string;
     id?: number;
     item_id?: number | null;
     rating: number;
     text: string;
     type: string;
    };
    Update: {
     author?: string;
     created_at?: string | null;
     date?: string;
     id?: number;
     item_id?: number | null;
     rating?: number;
     text?: string;
     type?: string;
    };
    Relationships: [];
   };
   profiles: {
    Row: {
     avatar_url: string | null;
     full_name: string | null;
     id: string;
     role: string;
     updated_at: string | null;
     username: string | null;
    };
    Insert: {
     avatar_url?: string | null;
     full_name?: string | null;
     id: string;
     role?: string;
     updated_at?: string | null;
     username?: string | null;
    };
    Update: {
     avatar_url?: string | null;
     full_name?: string | null;
     id?: string;
     role?: string;
     updated_at?: string | null;
     username?: string | null;
    };
    Relationships: [
     {
      foreignKeyName: "profiles_id_fkey";
      columns: ["id"];
      referencedRelation: "users";
      referencedColumns: ["id"];
     }
    ];
   };
   shows: {
    Row: {
     created_at: string | null;
     id: number;
    };
    Insert: {
     created_at?: string | null;
     id?: number;
    };
    Update: {
     created_at?: string | null;
     id?: number;
    };
    Relationships: [];
   };
   wrestlers: {
    Row: {
     avgRating: number;
     born: string | null;
     career_start: string | null;
     city: string | null;
     country: string | null;
     created_at: string | null;
     height: number | null;
     id: number;
     moves: string[] | null;
     name: string | null;
     nickname: string[] | null;
     ratings: Json[] | null;
     real_name: string | null;
     sex: string | null;
     style: string[] | null;
     trainer: string[] | null;
     weight: number | null;
     wrestler_img: string | null;
    };
    Insert: {
     avgRating?: number;
     born?: string | null;
     career_start?: string | null;
     city?: string | null;
     country?: string | null;
     created_at?: string | null;
     height?: number | null;
     id?: number;
     moves?: string[] | null;
     name?: string | null;
     nickname?: string[] | null;
     ratings?: Json[] | null;
     real_name?: string | null;
     sex?: string | null;
     style?: string[] | null;
     trainer?: string[] | null;
     weight?: number | null;
     wrestler_img?: string | null;
    };
    Update: {
     avgRating?: number;
     born?: string | null;
     career_start?: string | null;
     city?: string | null;
     country?: string | null;
     created_at?: string | null;
     height?: number | null;
     id?: number;
     moves?: string[] | null;
     name?: string | null;
     nickname?: string[] | null;
     ratings?: Json[] | null;
     real_name?: string | null;
     sex?: string | null;
     style?: string[] | null;
     trainer?: string[] | null;
     weight?: number | null;
     wrestler_img?: string | null;
    };
    Relationships: [];
   };
  };
  Views: {
   [_ in never]: never;
  };
  Functions: {
   [_ in never]: never;
  };
  Enums: {
   [_ in never]: never;
  };
  CompositeTypes: {
   [_ in never]: never;
  };
 };
}
