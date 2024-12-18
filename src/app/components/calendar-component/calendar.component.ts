
import { CommonModule } from "@angular/common";
import {Component, ViewChild, Input} from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  DayPilot,
  DayPilotModule,
  DayPilotMonthComponent
} from "@daypilot/daypilot-lite-angular";

@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [CommonModule, DayPilotModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  @ViewChild("month") month!: DayPilotMonthComponent;

  @Input() events: DayPilot.EventData[] = [];

  @Input() config: DayPilot.MonthConfig = {
    locale: "fr-fr", // Définit la locale française
  };

}