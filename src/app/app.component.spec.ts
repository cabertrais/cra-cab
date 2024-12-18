import { render, screen, fireEvent, RenderResult } from '@testing-library/angular';
import { Router } from '@angular/router';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTabsModule } from '@angular/material/tabs';

describe('AppComponent', () => {
  let appComponent: RenderResult<AppComponent, AppComponent>;
  // Configuration globale des tests avec MockBuilder et Testing Library
  beforeEach(async () => {
    const dependencies = MockBuilder(AppComponent)
      .mock(Router)
      .keep(MatTabsModule)
      .build();

      appComponent = await render(AppComponent, dependencies);
  });

  it('doit vérifier la création du composant', () => {
    expect(appComponent).toBeTruthy();

  });


});