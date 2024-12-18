import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatTabsModule ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  
  constructor(private router: Router) {}

  /**
   * Change la page en fonction de l'onglet sélectionné.
   * @param index Index de l'onglet sélectionné.
   */
  onTabChange(index: number): void {
    if (index === 0) {
      this.router.navigate(['/cra']); // Route vers le composant CRA
    } else if (index === 1) {
      this.router.navigate(['/commandement']); // Route vers le composant Commandement
    }
  }

}
