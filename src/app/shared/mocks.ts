import { Agent } from './model/agent.model';
import { Cra } from './model/cra..model';  // Assurez-vous que l'interface Cra est importée
import { Mission } from './model/mission.model'; // Assurez-vous que Mission est bien importé

// Liste des missions avec un numéro, un libellé et une couleur
export const mockMissions: Mission[] = [
  { num: 1, libelle: 'Opération Cobra', couleur: '#2e78d6' },
  { num: 2, libelle: 'Mission Phoenix', couleur: '#6aa84f' },
  { num: 3, libelle: 'Opération Alpha', couleur: '#f1c232' },
  { num: 4, libelle: 'Vacances', couleur: '#cc4125' }
];

  // Liste des agents
  export const mockAgents: Agent[] = [
    { idAgent: "Agent-007", nomAgent: 'James Bond' },
    { idAgent: "Agent-117", nomAgent: 'OSS 117' },
    { idAgent: "Agent-000", nomAgent: 'Agent 000' }
  ];

// Exemple de données simulées pour les agents avec les missions et les dates
export const mockCras: Cra[] = [
  {
    idAgent: 'Agent-007',
    listeMissionTravaillees: {
      1: ['2024-12-16', '2024-12-02','2024-12-17'], 
      2: ['2024-12-03', '2024-12-18'],
      4: ['2024-12-16', '2024-12-20']
    }
  },
  {
    idAgent: 'Agent-117',
    listeMissionTravaillees: {
      3: ['2024-12-05'],
      4: ['2024-12-06']
    }
  },
  {
    idAgent: 'Agent-000',
    listeMissionTravaillees: {
      2: ['2024-12-07', '2024-12-08'],
      1: ['2024-12-09']
    }
  }
];