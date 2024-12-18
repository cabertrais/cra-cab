import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import moment from 'moment';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { mockAgents, mockMissions } from '../../shared/mocks';
import { Agent } from '../../shared/model/agent.model';
import { CalendarComponent } from '../calendar-component/calendar.component';
import { CommonModule } from '@angular/common';
import { MomentLocalizedPipe } from '../../shared/pipes/moment-localized.pipe';

moment.locale('fr');

@Component({
  selector: 'app-commandement',
  standalone: true,
  templateUrl: './commandement.component.html',
  styleUrl: './commandement.component.scss',
  imports: [CommonModule, CalendarComponent, MomentLocalizedPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandementComponent implements OnInit {

  agents: Agent[] = [];
  events: DayPilot.EventData[] = [];
  missions = [];

  // Tableau contenant les trois mois (mois actuel + 2 mois suivants)
  monthNames: string[] = [];
  monthEvents: DayPilot.EventData[][] = [];
  monthConfigs: DayPilot.MonthConfig[] = [];


  constructor(private dataService: DataService) {
    // Configure Moment.js ici
    moment.updateLocale('fr', {
      week: {
        dow: 1, // Monday is the first day of the week
      },
    });
  }

  ngOnInit(): void {
    this.missions = mockMissions;
    this.agents = mockAgents;

    // Génère les événements pour chaque mois
    this.generateMonthEvents();

  }

  /**
 * Génère les noms des 3 mois et les événements associés.
 */
  generateMonthEvents(): void {
    const today = moment();

    for (let i = 0; i < 3; i++) {

      const currentMonth = today.clone().add(i, 'months');
      this.monthNames.push(currentMonth.format('MMMM YYYY'));

      // Filtre les événements pour le mois actuel
      const startOfMonth = currentMonth.clone().startOf('month');
      const endOfMonth = currentMonth.clone().endOf('month');

      const filteredEvents = this.filterEventsByMonth(startOfMonth, endOfMonth);
      this.monthEvents.push(filteredEvents);

      // Configuration dynamique du calendrier
      this.monthConfigs.push({
        startDate: currentMonth.clone().startOf('month').format('YYYY-MM-DD'),
        locale: 'fr-fr',
      });
    }
  }

  /**
* Filtre les événements pour une période donnée.
* @param startOfMonth Début du mois
* @param endOfMonth Fin du mois
*/
  filterEventsByMonth(startOfMonth: moment.Moment, endOfMonth: moment.Moment): DayPilot.EventData[] {
    const allEvents = this.dataService.getAllEventsByMonth(startOfMonth, endOfMonth);
    return allEvents.filter(event => {
      const eventDate = moment(event.start.toString());
      return eventDate.isBetween(startOfMonth, endOfMonth, 'days', '[]');
    });
  }
}
