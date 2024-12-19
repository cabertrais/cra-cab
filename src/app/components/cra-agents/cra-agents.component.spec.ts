import { render, screen, fireEvent, RenderResult } from '@testing-library/angular';
import { MockBuilder, MockInstance, ngMocks } from 'ng-mocks';
import { CraAgentsComponent } from './cra-agents.component';
import { DataService } from '../../shared/services/data.service';
import { StorageService } from '../../shared/services/storage.service';
import { DayPilotModule } from '@daypilot/daypilot-lite-angular';
import { Mission } from '../../shared/model/mission.model';
import { CraAgentsStore } from '../../shared/cra-agents.store';
import { signal } from '@angular/core';


describe('CraAgentsComponent', () => {
  let craAgentsComponent: RenderResult<CraAgentsComponent, CraAgentsComponent>;
  // Configuration globale des tests avec MockBuilder et Testing Library
  beforeEach(async () => {

    const dependencies = MockBuilder(CraAgentsComponent)
      .mock(DataService, {
        getIdAgentByName: jest.fn((name: string) => 'Agent-001'),
        getNameAgentById: jest.fn((id: string) => 'Agent 001'),
        getEventsByAgent: jest.fn(() => [])
        })
      .mock(StorageService, {
        getCraByAgent: jest.fn(() => ({
          idAgent: 'Agent-001',
          listeMissionTravaillees: {
            '1': ['2024-06-17']
          }
          })),
          addMissionDates: jest.fn(),
          removeMissionDates: jest.fn(),
          initializeCra: jest.fn(),
        })
        .provide({
          provide: CraAgentsStore,
          useValue: {
            selectedAgent: signal('Agent-001'), 
            weekDays: signal(['Lundi', 'Mardi', 'Mercredi']), 
            initializeStore: jest.fn(),
            updateWeekDays: jest.fn(),
            agents: signal([]),
            missions: signal([]),
            checkedDays: signal({}),
            afficherAjoutCra: signal(false),
            afficherCraMois: signal(false),
            saveMessage: signal(""),
            errorMessage: signal(""),
            events: signal([]),
            nomAgent: signal("James Bond")
          },
        })
        .keep(DayPilotModule)
      .build();

      craAgentsComponent = await render(CraAgentsComponent, dependencies);
  });

  it('doit vérifier la création du composant', () => {
    expect(craAgentsComponent).toBeTruthy();

  });

});