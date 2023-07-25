type Json = {
 itemName?: string;
 blockName?: string;
 points?: number;
 wrestlerId?: string;
 wrestlerName?: string;
 wrestlerImage?: string;
 wrestlerCurName: string;
 teamId?: string;
 teamName?: string;
};

interface Database {
 public: {
  Tables: {
   challanges: {
    Row: {
     created_at: string;
     id: number;
     match_id: number;
     title_id: number;
     title_name: string;
    };
    Insert: {
     created_at?: string;
     id?: number;
     match_id: number;
     title_id: number;
     title_name: string;
    };
    Update: {
     created_at?: string;
     id?: number;
     match_id?: number;
     title_id?: number;
     title_name?: string;
    };
    Relationships: [
     {
      foreignKeyName: "challanges_match_id_fkey";
      columns: ["match_id"];
      referencedRelation: "matches";
      referencedColumns: ["id"];
     },
     {
      foreignKeyName: "challanges_title_id_fkey";
      columns: ["title_id"];
      referencedRelation: "titles";
      referencedColumns: ["id"];
     }
    ];
   };
   comments_matches: {
    Row: {
     author: string;
     created_at: string;
     id: number;
     item_id: number | null;
     rating: number;
     text: string;
    };
    Insert: {
     author: string;
     created_at?: string;
     id?: number;
     item_id?: number | null;
     rating: number;
     text: string;
    };
    Update: {
     author?: string;
     created_at?: string;
     id?: number;
     item_id?: number | null;
     rating?: number;
     text?: string;
    };
    Relationships: [
     {
      foreignKeyName: "comments_matches_author_fkey";
      columns: ["author"];
      referencedRelation: "users";
      referencedColumns: ["id"];
     },
     {
      foreignKeyName: "comments_matches_item_id_fkey";
      columns: ["item_id"];
      referencedRelation: "matches";
      referencedColumns: ["id"];
     }
    ];
   };
   comments_teams: {
    Row: {
     author: string;
     created_at: string;
     id: number;
     item_id: number | null;
     rating: number;
     text: string;
    };
    Insert: {
     author: string;
     created_at?: string;
     id?: number;
     item_id?: number | null;
     rating: number;
     text: string;
    };
    Update: {
     author?: string;
     created_at?: string;
     id?: number;
     item_id?: number | null;
     rating?: number;
     text?: string;
    };
    Relationships: [
     {
      foreignKeyName: "comments_teams_author_fkey";
      columns: ["author"];
      referencedRelation: "users";
      referencedColumns: ["id"];
     },
     {
      foreignKeyName: "comments_teams_item_id_fkey";
      columns: ["item_id"];
      referencedRelation: "teams";
      referencedColumns: ["id"];
     }
    ];
   };
   comments_shows: {
    Row: {
     author: string;
     created_at: string;
     id: number;
     item_id: number | null;
     rating: number;
     text: string;
    };
    Insert: {
     author: string;
     created_at?: string;
     id?: number;
     item_id?: number | null;
     rating: number;
     text: string;
    };
    Update: {
     author?: string;
     created_at?: string;
     id?: number;
     item_id?: number | null;
     rating?: number;
     text?: string;
    };
    Relationships: [
     {
      foreignKeyName: "comments_shows_author_fkey";
      columns: ["author"];
      referencedRelation: "users";
      referencedColumns: ["id"];
     },
     {
      foreignKeyName: "comments_shows_item_id_fkey";
      columns: ["item_id"];
      referencedRelation: "shows";
      referencedColumns: ["id"];
     }
    ];
   };
   comments_tournaments: {
    Row: {
     author: string;
     created_at: string;
     id: number;
     item_id: number | null;
     rating: number;
     text: string;
    };
    Insert: {
     author: string;
     created_at?: string;
     id?: number;
     item_id?: number | null;
     rating: number;
     text: string;
    };
    Update: {
     author?: string;
     created_at?: string;
     id?: number;
     item_id?: number | null;
     rating?: number;
     text?: string;
    };
    Relationships: [
     {
      foreignKeyName: "comments_tournaments_author_fkey";
      columns: ["author"];
      referencedRelation: "users";
      referencedColumns: ["id"];
     },
     {
      foreignKeyName: "comments_tournaments_item_id_fkey";
      columns: ["item_id"];
      referencedRelation: "tournaments";
      referencedColumns: ["id"];
     }
    ];
   };
   comments_wrestlers: {
    Row: {
     author: string;
     created_at: string;
     id: number;
     item_id: number | null;
     rating: number;
     text: string;
    };
    Insert: {
     author: string;
     created_at?: string;
     id?: number;
     item_id?: number | null;
     rating: number;
     text: string;
    };
    Update: {
     author?: string;
     created_at?: string;
     id?: number;
     item_id?: number | null;
     rating?: number;
     text?: string;
    };
    Relationships: [
     {
      foreignKeyName: "comments_wrestlers_author_fkey";
      columns: ["author"];
      referencedRelation: "users";
      referencedColumns: ["id"];
     },
     {
      foreignKeyName: "comments_wrestlers_item_id_fkey";
      columns: ["item_id"];
      referencedRelation: "wrestlers";
      referencedColumns: ["id"];
     }
    ];
   };
   match_sides: {
    Row: {
     created_at: string;
     id: number;
     match_id: number;
     wrestlers: Json[];
    };
    Insert: {
     created_at?: string;
     id?: number;
     match_id: number;
     wrestlers: Json[];
    };
    Update: {
     created_at?: string;
     id?: number;
     match_id?: number;
     wrestlers?: Json[];
    };
    Relationships: [
     {
      foreignKeyName: "match_sides_match_id_fkey";
      columns: ["match_id"];
      referencedRelation: "matches";
      referencedColumns: ["id"];
     }
    ];
   };
   matches: {
    Row: {
     avgRating: number;
     created_at: string | null;
     ending: string | null;
     id: number;
     order: number;
     show: number;
     time: string | null;
     tournament: number | null;
     type: string | null;
    };
    Insert: {
     avgRating?: number;
     created_at?: string | null;
     ending?: string | null;
     id?: number;
     order: number;
     show: number;
     time?: string | null;
     tournament?: number | null;
     type?: string | null;
    };
    Update: {
     avgRating?: number;
     created_at?: string | null;
     ending?: string | null;
     id?: number;
     order?: number;
     show?: number;
     time?: string | null;
     tournament?: number | null;
     type?: string | null;
    };
    Relationships: [
     {
      foreignKeyName: "matches_show_fkey";
      columns: ["show"];
      referencedRelation: "shows";
      referencedColumns: ["id"];
     },
     {
      foreignKeyName: "matches_tournament_fkey";
      columns: ["tournament"];
      referencedRelation: "tournaments";
      referencedColumns: ["id"];
     }
    ];
   };
   reigns: {
    Row: {
     created_at: string;
     end: string | null;
     id: number;
     start: string;
     title_id: number;
     wrestler_id: number;
    };
    Insert: {
     created_at?: string;
     end?: string | null;
     id?: number;
     start: string;
     title_id: number;
     wrestler_id: number;
    };
    Update: {
     created_at?: string;
     end?: string | null;
     id?: number;
     start?: string;
     title_id?: number;
     wrestler_id?: number;
    };
    Relationships: [
     {
      foreignKeyName: "reigns_title_id_fkey";
      columns: ["title_id"];
      referencedRelation: "titles";
      referencedColumns: ["id"];
     },
     {
      foreignKeyName: "reigns_wrestler_id_fkey";
      columns: ["wrestler_id"];
      referencedRelation: "wrestlers";
      referencedColumns: ["id"];
     }
    ];
   };
   shows: {
    Row: {
     arena: string;
     attendance: number | null;
     avgRating: number;
     created_at: string;
     id: number;
     location: string;
     name: string;
     promotion: string[] | null;
     show_img: string | null;
     type: string;
     upload_date: string | null;
    };
    Insert: {
     arena: string;
     attendance?: number | null;
     avgRating?: number;
     created_at?: string;
     id?: number;
     location: string;
     name: string;
     promotion?: string[] | null;
     show_img?: string | null;
     type: string;
     upload_date?: string | null;
    };
    Update: {
     arena?: string;
     attendance?: number | null;
     avgRating?: number;
     created_at?: string;
     id?: number;
     location?: string;
     name?: string;
     promotion?: string[] | null;
     show_img?: string | null;
     type?: string;
     upload_date?: string | null;
    };
    Relationships: [];
   };
   teams: {
    Row: {
     avgRating: number;
     created_at: string | null;
     creation_date: string;
     disband_date: string | null;
     id: number;
     name: string;
    };
    Insert: {
     avgRating?: number;
     created_at?: string | null;
     creation_date: string;
     disband_date?: string | null;
     id?: number;
     name: string;
    };
    Update: {
     avgRating?: number;
     created_at?: string | null;
     creation_date?: string;
     disband_date?: string | null;
     id?: number;
     name?: string;
    };
    Relationships: [];
   };
   teams_current_participants: {
    Row: {
     created_at: string;
     id: number;
     isLeader: boolean;
     team_id: number;
     wrestler_id: number;
     wrestler_name: string;
    };
    Insert: {
     created_at?: string;
     id?: number;
     isLeader?: boolean;
     team_id: number;
     wrestler_id: number;
     wrestler_name: string;
    };
    Update: {
     created_at?: string;
     id?: number;
     isLeader?: boolean;
     team_id?: number;
     wrestler_id?: number;
     wrestler_name?: string;
    };
    Relationships: [
     {
      foreignKeyName: "teams_current_participants_team_id_fkey";
      columns: ["team_id"];
      referencedRelation: "teams";
      referencedColumns: ["id"];
     },
     {
      foreignKeyName: "teams_current_participants_wrestler_id_fkey";
      columns: ["wrestler_id"];
      referencedRelation: "wrestlers";
      referencedColumns: ["id"];
     }
    ];
   };
   teams_former_participants: {
    Row: {
     created_at: string;
     id: number;
     team_id: number;
     wrestler_id: number;
     wrestler_name: string;
    };
    Insert: {
     created_at?: string;
     id?: number;
     team_id: number;
     wrestler_id: number;
     wrestler_name: string;
    };
    Update: {
     created_at?: string;
     id?: number;
     team_id?: number;
     wrestler_id?: number;
     wrestler_name?: string;
    };
    Relationships: [
     {
      foreignKeyName: "teams_former_participants_team_id_fkey";
      columns: ["team_id"];
      referencedRelation: "teams";
      referencedColumns: ["id"];
     },
     {
      foreignKeyName: "teams_former_participants_wrestler_id_fkey";
      columns: ["wrestler_id"];
      referencedRelation: "wrestlers";
      referencedColumns: ["id"];
     }
    ];
   };
   titles: {
    Row: {
     avgRating: number;
     created_at: string;
     end: string | null;
     id: number;
     isActive: boolean;
     name: string;
     start: string;
     type: string;
     promotion: string;
    };
    Insert: {
     avgRating?: number;
     created_at?: string;
     end?: string | null;
     id?: number;
     isActive?: boolean;
     name: string;
     start: string;
     type: string;
     promotion: string;
    };
    Update: {
     avgRating?: number;
     created_at?: string;
     end?: string | null;
     id?: number;
     isActive?: boolean;
     name?: string;
     start?: string;
     type?: string;
     promotion?: string;
    };
    Relationships: [];
   };
   tournaments: {
    Row: {
     avgRating: number;
     block_participants: Json[][] | null;
     blocks_number: number | null;
     created_at: string;
     description: string | null;
     end: string | null;
     id: number;
     name: string;
     play_off_participants: Json[][];
     start: string | null;
     type: string;
     winner: Json[][] | null;
    };
    Insert: {
     avgRating?: number;
     block_participants?: Json[][] | null;
     blocks_number?: number | null;
     created_at?: string;
     description?: string | null;
     end?: string | null;
     id?: number;
     name: string;
     play_off_participants: Json[][];
     start?: string | null;
     type: string;
     winner?: Json[][] | null;
    };
    Update: {
     avgRating?: number;
     block_participants?: Json[][] | null;
     blocks_number?: number | null;
     created_at?: string;
     description?: string | null;
     end?: string | null;
     id?: number;
     name?: string;
     play_off_participants?: Json[][];
     start?: string | null;
     type?: string;
     winner?: Json[][] | null;
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
   winners: {
    Row: {
     created_at: string | null;
     id: number;
     match_id: number;
     winner: Json[];
    };
    Insert: {
     created_at?: string | null;
     id?: number;
     match_id: number;
     winner: Json[];
    };
    Update: {
     created_at?: string | null;
     id?: number;
     match_id?: number;
     winner?: Json[];
    };
    Relationships: [
     {
      foreignKeyName: "winners_match_id_fkey";
      columns: ["match_id"];
      referencedRelation: "matches";
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
     created_at: string;
     height: number | null;
     id: number;
     isVendetta: boolean;
     moves: string[];
     name: string;
     nickname: string[] | null;
     real_name: string | null;
     sex: string;
     style: string[] | null;
     trainer: string[];
     weight: number | null;
     wrestler_img: string | null;
    };
    Insert: {
     avgRating?: number;
     born?: string | null;
     career_start?: string | null;
     city?: string | null;
     country?: string | null;
     created_at?: string;
     height?: number | null;
     id?: number;
     isVendetta?: boolean;
     moves: string[];
     name: string;
     nickname?: string[] | null;
     real_name?: string | null;
     sex: string;
     style?: string[] | null;
     trainer: string[];
     weight?: number | null;
     wrestler_img?: string | null;
    };
    Update: {
     avgRating?: number;
     born?: string | null;
     career_start?: string | null;
     city?: string | null;
     country?: string | null;
     created_at?: string;
     height?: number | null;
     id?: number;
     isVendetta?: boolean;
     moves?: string[];
     name?: string;
     nickname?: string[] | null;
     real_name?: string | null;
     sex?: string;
     style?: string[] | null;
     trainer?: string[];
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
