import { CommandementComponent } from './commandement.component';
import { render, RenderResult } from '@testing-library/angular';
import { MockBuilder } from 'ng-mocks';
import { DataService } from '../../shared/services/data.service';
import { DayPilotModule } from '@daypilot/daypilot-lite-angular';

describe('CommandementComponent', () => {
  let commandementComponent: RenderResult<CommandementComponent, CommandementComponent>;
  // Configuration globale des tests avec MockBuilder et Testing Library
  beforeEach(async () => {

    const dependencies = MockBuilder(CommandementComponent)
      .mock(DataService, {
        getIdAgentByName: jest.fn((name: string) => 'Agent-001'),
        getAllEventsByMonth: jest.fn(() => []),
        getNameAgentById: jest.fn((id: string) => 'Agent 001'),
        getEventsByAgent: jest.fn(() => [])
        })
      .keep(DayPilotModule)
      .build();

      commandementComponent = await render(CommandementComponent, dependencies);
  });

  it('doit vérifier la création du composant', () => {
    expect(commandementComponent).toBeTruthy();

  });
});
