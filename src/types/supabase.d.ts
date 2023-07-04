type Json = {
 id?: string;
 username?: string;
};

interface Database {
 public: {
  Tables: {
   comments_shows: {
    Row: {
     author: Json | null;
     created_at: string | null;
     id: number;
     item_id: number | null;
     rating: number;
     text: string;
    };
    Insert: {
     author?: Json | null;
     created_at?: string | null;
     id?: number;
     item_id?: number | null;
     rating: number;
     text: string;
    };
    Update: {
     author?: Json | null;
     created_at?: string | null;
     id?: number;
     item_id?: number | null;
     rating?: number;
     text?: string;
    };
    Relationships: [
     {
      foreignKeyName: "comments_shows_item_id_fkey";
      columns: ["item_id"];
      referencedRelation: "wrestlers";
      referencedColumns: ["id"];
     }
    ];
   };
   comments_wrestlers: {
    Row: {
     author: Json | null;
     created_at: string | null;
     id: number;
     item_id: number | null;
     rating: number;
     text: string;
    };
    Insert: {
     author?: Json | null;
     created_at?: string | null;
     id?: number;
     item_id?: number | null;
     rating: number;
     text: string;
    };
    Update: {
     author?: Json | null;
     created_at?: string | null;
     id?: number;
     item_id?: number | null;
     rating?: number;
     text?: string;
    };
    Relationships: [
     {
      foreignKeyName: "comments_wrestlers_item_id_fkey";
      columns: ["item_id"];
      referencedRelation: "wrestlers";
      referencedColumns: ["id"];
     }
    ];
   };
   matches: {
    Row: {
     avgRating: number | null;
     created_at: string | null;
     id: number;
     isFinished: boolean | null;
     participants: Json[];
     show: number;
     time: string | null;
     title: Json[] | null;
     tournament: number | null;
     type: string;
    };
    Insert: {
     avgRating?: number | null;
     created_at?: string | null;
     id?: number;
     isFinished?: boolean | null;
     participants: Json[];
     show: number;
     time?: string | null;
     title?: Json[] | null;
     tournament?: number | null;
     type?: string;
    };
    Update: {
     avgRating?: number | null;
     created_at?: string | null;
     id?: number;
     isFinished?: boolean | null;
     participants?: Json[];
     show?: number;
     time?: string | null;
     title?: Json[] | null;
     tournament?: number | null;
     type?: string;
    };
    Relationships: [
     {
      foreignKeyName: "matches_show_fkey";
      columns: ["show"];
      referencedRelation: "shows";
      referencedColumns: ["id"];
     }
    ];
   };
   shows: {
    Row: {
     arena: string;
     attendance: number | null;
     avgRating: number;
     created_at: string | null;
     id: number;
     location: string;
     name: string;
     promotion: string[] | null;
     type: string;
     upload_date: string | null;
    };
    Insert: {
     arena: string;
     attendance?: number | null;
     avgRating?: number;
     created_at?: string | null;
     id?: number;
     location: string;
     name: string;
     promotion?: string[] | null;
     type: string;
     upload_date?: string | null;
    };
    Update: {
     arena?: string;
     attendance?: number | null;
     avgRating?: number;
     created_at?: string | null;
     id?: number;
     location?: string;
     name?: string;
     promotion?: string[] | null;
     type?: string;
     upload_date?: string | null;
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
    Relationships: [
     {
      foreignKeyName: "users_id_fkey";
      columns: ["id"];
      referencedRelation: "users";
      referencedColumns: ["id"];
     }
    ];
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
