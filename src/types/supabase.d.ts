type Json = {
 authorId?: string;
 rating?: number;
 id?: string;
 username?: string;
};

interface Database {
 public: {
  Tables: {
   comments: {
    Row: {
     author: Json | null;
     created_at: string | null;
     id: number;
     item_id: number | null;
     rating: number;
     text: string;
     type: string;
    };
    Insert: {
     author?: Json | null;
     created_at?: string | null;
     id?: number;
     item_id?: number | null;
     rating: number;
     text: string;
     type: string;
    };
    Update: {
     author?: Json | null;
     created_at?: string | null;
     id?: number;
     item_id?: number | null;
     rating?: number;
     text?: string;
     type?: string;
    };
    Relationships: [];
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
   users: {
    Row: {
     created_at: string | null;
     email: string | null;
     full_name: string | null;
     id: string;
     role: string;
     username: string | null;
    };
    Insert: {
     created_at?: string | null;
     email?: string | null;
     full_name?: string | null;
     id: string;
     role?: string;
     username?: string | null;
    };
    Update: {
     created_at?: string | null;
     email?: string | null;
     full_name?: string | null;
     id?: string;
     role?: string;
     username?: string | null;
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
     isVendetta: boolean;
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
     isVendetta?: boolean;
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
     isVendetta?: boolean;
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
