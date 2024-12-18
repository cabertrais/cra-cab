import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal, ViewChild } from '@angular/core';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { DataService } from '../../shared/services/data.service';
import { Agent } from '../../shared/model/agent.model';
import { Mission } from '../../shared/model/mission.model';
import { mockAgents, mockMissions } from '../../shared/mocks';
import { Cra } from '../../shared/model/cra..model';
import moment from 'moment';
import { StorageService } from '../../shared/services/storage.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar-component/calendar.component';
import { MatTableModule } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CraAgentsStore } from '../../shared/cra-agents.store';

@Component({
  selector: 'app-cra-agents',
  standalone: true,
  imports: [MatFormField, MatSelect, CommonModule, FormsModule, MatPaginatorModule, ReactiveFormsModule, MatGridListModule,
    CalendarComponent, MatSelectModule, MatTableModule, MatOptionModule, MatCheckboxModule],
  templateUrl: './cra-agents.component.html',
  styleUrl: './cra-agents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CraAgentsComponent implements OnInit {

  totalWeeks = 4;
  currentPage = 0;
  columnsToDisplay: string[] = ['mission'];
  idAgent: string | null = null;
  missions: Mission[] = [];
  weekDays: { id: string; label: string }[] = [];
  checkedDays: Record<string, boolean> = {};
  saveMessage: string = null;
  errorMessage: string = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(public craStore: CraAgentsStore, private dataService: DataService, private storageService: StorageService, private cdr: ChangeDetectorRef) {
    // Configure Moment.js ici
    moment.updateLocale('fr', {
      week: {
        dow: 1, // Monday is the first day of the week
      },
    });
  }

  ngOnInit(): void {
    // Initialisation des agents, missions et jours de la semaine
    this.initializeStore();
    // Récupérer le signal de l'agent sélectionné
    this.selectedAgent = this.craStore.selectedAgent();

  }

  initializeStore(): void {
    const agents = this.dataService.getMockAgents();
    const missions = this.dataService.getMockMissions();
    this.loadWeekDays(0);

    this.craStore.initializeStore(agents, missions, this.weekDays);
    this.columnsToDisplay = ['mission', ...this.craStore.weekDays().map((day) => day.id)];
    this.missions = missions;
  }

  loadWeekDays(pageIndex: number): void {
    const startOfWeek = moment().startOf('week').add(pageIndex * 7, 'days');
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = startOfWeek.clone().add(i, 'days');
      return {
        id: date.format('YYYY-MM-DD'),
        label: date.format('dddd DD/MM/YYYY'),
      };
    });
    this.craStore.updateWeekDays(this.weekDays);
  }

  loadCheckedDays(idAgent: string): void {
    const craData = this.storageService.getCraByAgent(idAgent);

    if (craData && craData.listeMissionTravaillees) {
      this.checkedDays = {};
      this.missions.forEach((mission) => {
        this.weekDays.forEach((day) => {
          const key = `${mission.num}-${day.id}`;
          const isChecked = craData.listeMissionTravaillees[mission.num]?.includes(day.id) || false;
          this.checkedDays[key] = isChecked;
        });
      });
      this.cdr.detectChanges();
    }


  }

  /**
 * Affiche le calendrier avec les événements d'un agent.
 */
  showCurrentMonthCra(): void {
    const selectedAgent = this.craStore.selectedAgent();
    this.craStore.resetMessages();
    if (selectedAgent) {
      // Simuler des événements pour l'agent sélectionné
      const events = this.dataService.getEventsByAgent(selectedAgent);
      this.craStore.updateEvents(events);
      this.craStore.updateNomAgent(selectedAgent);
      this.craStore.afficherAjoutCra.set(false);
      this.craStore.afficherCraMois.set(true);
    }
  }

  // Méthode pour valider la sélection
  onSubmit(): void {
    const selectedAgent = this.craStore.selectedAgent();
    this.craStore.resetMessages();
    this.craStore.afficherAjoutCra.set(true);
    this.craStore.afficherCraMois.set(false);

    if (selectedAgent) {
      const agent = this.dataService.getAgentByName(selectedAgent);
      this.idAgent = agent.idAgent;
      this.craStore.selectAgent(selectedAgent);

      // Charger les CRA
      const craData = this.storageService.getCraByAgent(this.idAgent);

      if (this.paginator) {
        this.paginator.pageIndex = 0;
        this.loadWeekDays(0);
        this.paginator.firstPage();
      }

      // Mettre à jour les cases cochées dans le store
      this.loadCheckedDays(agent.idAgent);
    } else {
      this.craStore.errorMessage.set('Veuillez sélectionner un agent.');
    }
  }

  // Methods to update the signals
  setError(message: string | null) {
    this.craStore.errorMessage.set(message);
  }

  setSaveMessage(message: string | null) {
    this.craStore.saveMessage.set(message);
  }


  /**
   * Gère les changements d'une case à cocher.
   * @param missionId L'identifiant de la mission.
   * @param dateId La date (identifiant unique).
   */
  toggleCheckbox(missionId: number, dateId: string): void {
    const key = `${missionId}-${dateId}`;
    const isChecked = !this.checkedDays[key];
    this.craStore.resetMessages();
    // Mettre à jour le store avec la nouvelle valeur
    this.craStore.updateCheckedDays(key, isChecked);

    if (this.checkedDays[key]) {
      try {
        this.storageService.addMissionDates(this.idAgent, missionId, [dateId]);
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.craStore.errorMessage.set(error.message);

        } else {
          console.log("Une erreur inconnue s'est produite", error);
        }
      }
    }
  }

  /**
   * Gère le changement de page dans le paginator.
   * @param event Événement de changement de page.
   */
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadWeekDays(this.currentPage);
    // Mettre à jour les cases cochées dans le store
    this.loadCheckedDays(this.idAgent);

    this.columnsToDisplay = ['mission', ...this.craStore.weekDays().map((day) => day.id)];
  }

  get selectedAgent(): string | null {
    return this.craStore.selectedAgent();
  }

  set selectedAgent(value: string | null) {
    this.craStore.selectedAgent.set(value);
  }

}

