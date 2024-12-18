import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { mockAgents, mockMissions } from '../mocks';
import { Cra } from '../model/cra..model';
import moment from 'moment';
import { MockRender, MockBuilder, ngMocks } from 'ng-mocks';
import { TestBed } from '@angular/core/testing';

describe('DataService', () => {

    beforeEach(() =>
        MockBuilder(DataService)
            .mock(StorageService, {
                getAllCrasByMonth: jest.fn(),
                getCraByAgent: jest.fn(() => ({
                    idAgent: 'Agent-007',
                    listeMissionTravaillees: {
                        '1': ['2024-12-01'],
                    },
                }),
                )
            })
    );

    afterEach(() => {
        ngMocks.flushTestBed(); 
        TestBed.resetTestingModule();
        jest.resetAllMocks();
    });

    describe('pour une instance de DataService', () => {
        let dataService: DataService;
        beforeEach(
            () => {
                dataService = TestBed.inject(DataService);
            }
        );

        it('doit créer le service', () => {
            expect(dataService).toBeTruthy();
        });

        it('récupère le nom de l\'agent à partir de son identifiant', () => {
            const agentName = dataService.getNameAgentById('Agent-117');

            expect(agentName).toEqual("OSS 117");
        });


        it('récupère l\'identifiant de l\'agent à partir de son nom', () => {

            const name = dataService.getIdAgentByName("James Bond");
            expect(name).toEqual("Agent-007");
        });

        it('récupère la mission à partir de son identifiant', () => {
            const mission = dataService.getMissionById(1);

            expect(mission.libelle).toEqual("Opération Cobra");
        });


        it('récupère les évenements en fonction de l\'agent', () => {
            const events = dataService.getEventsByAgent('James Bond');
            const storageService = ngMocks.findInstance(StorageService);
            expect(storageService.getCraByAgent).toHaveBeenCalledWith('Agent-007');
            expect(events.length).toBe(1);
            expect(events[0].id).toEqual('Agent-007');
            expect(events[0].text).toEqual('Opération Cobra - James Bond');
           
        });
    })
});
