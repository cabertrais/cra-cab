import { Injectable, signal } from '@angular/core';
import { Agent } from './model/agent.model';
import { Mission } from './model/mission.model';
import { DayPilot } from '@daypilot/daypilot-lite-angular';

@Injectable({
  providedIn: 'root',
})
export class CraAgentsStore {

  // Signals pour stocker les données
  agents = signal<Agent[]>([]); 
  missions = signal<Mission[]>([]);
  selectedAgent = signal<string | null>(null);
  checkedDays = signal<Record<string, boolean>>({});

  // Signaux pour afficher les différentes sections
  afficherAjoutCra = signal(false);
  afficherCraMois = signal(false);

  // Signaux pour les messages et jours de la semaine
  saveMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  weekDays = signal<{ id: string; label: string }[]>([]);
  
  // Signaux pour les événements du calendrier
  events = signal<DayPilot.EventData[]>([]);
  nomAgent = signal<string | null>(null);

  constructor() {
  
  }

  // Initialisation des données dans le store
  initializeStore(agents: Agent[], missions: Mission[], weekDays: { id: string; label: string }[]) {
    this.agents.set(agents);
    this.missions.set(missions);
    this.weekDays.set(weekDays);
  }

  // Mise à jour des jours cochés
  updateCheckedDays(key: string, value: boolean) {
    const currentDays = this.checkedDays();
    const updatedDays = { ...currentDays, [key]: value }; // Copie et mise à jour de la clé
    this.checkedDays.set(updatedDays);
  }

  /**
   * Met à jour la liste des jours de la semaine
   * @param weekDays Tableau des jours de la semaine
   */
  updateWeekDays(weekDays: { id: string; label: string }[]): void {
    this.weekDays.set(weekDays);
  }

  // Mise à jour des événements pour le calendrier
  updateEvents(events: DayPilot.EventData[]): void {
    this.events.set(events);
  }

  // Mise à jour du nom de l'agent sélectionné
  updateNomAgent(name: string): void {
    this.nomAgent.set(name);
  }

  // Réinitialisation des états
  resetState(): void {
    this.afficherAjoutCra.set(false);
    this.afficherCraMois.set(false);
    this.saveMessage.set(null);
    this.errorMessage.set(null);
  }

  // Sélectionner un agent
  selectAgent(agentName: string): void {
    this.selectedAgent.set(agentName);
  }

  // Réinitialisation du message de sauvegarde
  resetMessages(): void {
    this.saveMessage.set(null);
    this.errorMessage.set(null);
  }

}