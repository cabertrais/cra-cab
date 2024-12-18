import { Pipe, PipeTransform } from '@angular/core';
import moment, { MomentInput } from 'moment';
import 'moment/locale/fr'; // Import de la locale française

@Pipe({
  name: 'momentLocalized',
  standalone: true, 
})
export class MomentLocalizedPipe implements PipeTransform {
  /**
   * Transforme une date en nom de mois localisé.
   * @param value Date sous forme de string ou de Moment
   * @param format Format Moment.js (par défaut : 'MMMM YYYY')
   * @returns Nom du mois en français
   */
  transform(value: MomentInput, format = 'MMMM YYYY'): string {
    if (!value) return '';
    moment.locale('fr'); // Définit la locale en français
    return moment(value).format(format);
  }
}