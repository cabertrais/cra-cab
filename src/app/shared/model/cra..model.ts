
export interface Cra {
    idAgent: string; // Le code unique de l'agent 
    listeMissionTravaillees: Record<number, string[]>; // Map des missions et leurs dates travaillées
}

// Clé utilisée dans le localStorage
export const STORAGE_KEY = "CRA_DATA";

