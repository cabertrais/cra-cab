import {Injectable} from "@angular/core";
import {DayPilot} from "@daypilot/daypilot-lite-angular";
import { Cra } from "../model/cra..model";
import { mockAgents, mockMissions } from '../mocks';
import { Mission } from "../model/mission.model";
import { Agent } from "../model/agent.model";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root',
  })
export class DataService {

  constructor(private storageService: StorageService){
  }

  getMockAgents(): Agent[] {
    return mockAgents;
  }

  getMockMissions(): Mission[] {
    return mockMissions;
  }


  getAllEventsByMonth(startOfMonth: moment.Moment, endOfMonth: moment.Moment): DayPilot.EventData[] {
    const cras : Cra[] = this.storageService.getAllCrasByMonth(startOfMonth, endOfMonth);
    const events: DayPilot.EventData[] = []; 

    for(const cra of cras){
      this.transformCraToDayPilotEvent(cra, events);
    }

    return events;
}

  getMissionById(idMission : number): Mission {
    const missions : Mission[] = mockMissions;
    return missions.find(mission => mission.num == idMission);
  }

  getIdAgentByName(nomAgent : string): string {
    const agents : Agent[] = mockAgents;
    return agents.find(agent => agent.nomAgent == nomAgent).idAgent;
  }

  getNameAgentById(idAgent : string): string {
    const agents : Agent[] = mockAgents;
    return agents.find(agent => agent.idAgent == idAgent).nomAgent;
  }

  
  getAgentByName(nomAgent : string): Agent {
    const agents : Agent[] = mockAgents;
    return agents.find(agent => agent.nomAgent == nomAgent);
  }

  getEventsByAgent(nomAgent : string): DayPilot.EventData[] {
    const idAgent = this.getIdAgentByName(nomAgent);
    const craAgent = this.storageService.getCraByAgent(idAgent);
    const events: DayPilot.EventData[] = []; 

    this.transformCraToDayPilotEvent(craAgent, events);

    return events;
  }

  // Fonction pour transformer un objet Cra en un événement DayPilot
  private transformCraToDayPilotEvent(cra: Cra, events : DayPilot.EventData[]): void {

    // Parcourir les missions et les dates dans l'objet cra
    for (const [mission, dates] of Object.entries(cra.listeMissionTravaillees)) {

      const uneMission : Mission = this.getMissionById(Number(mission));

      dates.forEach(dateStr => {
        const date = new DayPilot.Date(dateStr); // Transformer la chaîne de date en DayPilot.Date

        // Créer un événement DayPilot pour chaque date
        const event = {
          id: cra.idAgent, 
          text: uneMission.libelle + " - " + this.getNameAgentById(cra.idAgent),
          start: date, 
          end: date.addHours(12), 
          backColor: uneMission.couleur
        }
        events.push(event);
      })
    }
  }

}
