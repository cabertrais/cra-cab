import { Injectable } from "@angular/core";
import { Cra, STORAGE_KEY } from "../model/cra..model";
import { mockCras } from "../mocks";
import moment from "moment";

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    /**
   * Initialise le localStorage avec les données mock si elles ne sont pas déjà présentes.
   */
    initializeCra(): void {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCras));
        }
    }

    getAllCras(): Cra[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) as Cra[] : mockCras;
    } 

    /**
    * Récupère tous les CRA stockés.
    * @returns {Cra[]} Un tableau de CRA.
    */
    getAllCrasByMonth(startOfMonth: moment.Moment, endOfMonth: moment.Moment): Cra[] {
        const data = localStorage.getItem(STORAGE_KEY);
        const cras: Cra[] = data ? JSON.parse(data) as Cra[] : mockCras;
      
        // Filtrer les CRAs en fonction des dates comprises dans l'intervalle
        return cras
          .map(cra => {
            const filteredMissions: Record<number, string[]> = {};
      
            // Parcourir chaque mission de l'agent
            for (const missionId in cra.listeMissionTravaillees) {
              const dates = cra.listeMissionTravaillees[missionId];
      
              // Filtrer les dates comprises entre startOfMonth et endOfMonth
              const filteredDates = dates.filter(date =>
                moment(date).isBetween(startOfMonth, endOfMonth, 'days', '[]') // Inclut les bornes
              );
      
              // Ajouter uniquement si des dates sont présentes après le filtrage
              if (filteredDates.length > 0) {
                filteredMissions[+missionId] = filteredDates;
              }
            }
      
            // Retourner le CRA uniquement si des missions sont présentes après le filtrage
            return Object.keys(filteredMissions).length > 0
              ? { ...cra, listeMissionTravaillees: filteredMissions }
              : null;
          })
          .filter(cra => cra !== null); // Supprimer les agents sans missions filtrées
    }

    /**
    * Récupère les données CRA du localStorage.
    * @returns {Cra | null} Les données CRA ou null si elles n'existent pas.
    */
    getCraByAgent(idAgent: string): Cra | null {
        const allCras = this.getAllCras();
        return allCras.find(cra => cra.idAgent === idAgent) || null;
    }

    /**
     * Ajoute ou met à jour un CRA dans le tableau.
     * @param updatedCra CRA à ajouter ou à mettre à jour.
     */
    saveOrUpdateCra(updatedCra: Cra): void {
        const allCras = this.getAllCras();
        const index = allCras.findIndex(cra => cra.idAgent === updatedCra.idAgent);

        if (index >= 0) {
            // Mettre à jour un CRA existant
            allCras[index] = updatedCra;
        } else {
            // Ajouter un nouveau CRA
            allCras.push(updatedCra);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allCras));
    }

    /**
     * Supprime les données CRA du localStorage.
     */
    deleteCra(): void {
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
      * Ajoute des dates à une mission dans un CRA spécifique.
      * @param idAgent Identifiant de l'agent.
      * @param missionId Identifiant de la mission.
      * @param dates Les dates à ajouter.
      */
    addMissionDates(idAgent: string, missionId: number, dates: string[]): void {
        const allCras = this.getAllCras();
        const cra = allCras.find(cra => cra.idAgent === idAgent);

        if (!cra) {
            throw new Error(`Aucun CRA trouvé pour l'agent ${idAgent}.`);
          }

        // Vérifier si une des dates est déjà utilisée dans une autre mission
        const conflictingDates = dates.filter(date => {
            return Object.entries(cra.listeMissionTravaillees).some(([existingMissionId, existingDates]) => {
                return +existingMissionId !== missionId && existingDates.includes(date);
            });
        });

            if (conflictingDates.length > 0) {
                throw new Error(`Les dates suivantes sont déjà assignées à une autre mission : ${conflictingDates.join(', ')}`);
              }

        if (!cra.listeMissionTravaillees[missionId]) {
            cra.listeMissionTravaillees[missionId] = [];
        }

        cra.listeMissionTravaillees[missionId] = Array.from(
            new Set([...cra.listeMissionTravaillees[missionId], ...dates])
        );

        this.saveOrUpdateCra(cra);
    }

    /**
   * Supprime des dates d'une mission dans un CRA spécifique.
   * @param idAgent Identifiant de l'agent.
   * @param missionId Identifiant de la mission.
   * @param dates Les dates à supprimer.
   */
    removeMissionDates(idAgent: string, missionId: number, dates: string[]): void {
        const allCra = this.getAllCras();
        const cra = allCra.find(cra => cra.idAgent === idAgent);

        if (cra && cra.listeMissionTravaillees[missionId]) {
            cra.listeMissionTravaillees[missionId] = cra.listeMissionTravaillees[missionId].filter(
                date => !dates.includes(date)
            );

            if (cra.listeMissionTravaillees[missionId].length === 0) {
                delete cra.listeMissionTravaillees[missionId];
            }

            this.saveOrUpdateCra(cra);
        }
    }

}