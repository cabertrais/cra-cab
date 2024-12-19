import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { mockAgents, mockMissions } from '../mocks';
import { Cra, STORAGE_KEY } from '../model/cra..model';
import moment from 'moment';
import { mockCras } from '../mocks';
import { TestBed } from '@angular/core/testing';
import { MockBuilder } from 'ng-mocks';

describe('StorageService', () => {
    let storageService: StorageService;
    let craTests : Cra[]

    beforeEach(() => {
        storageService =  TestBed.inject(StorageService);

        const localStorageMock = {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn(),
          clear: jest.fn(),
        };
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock,
        });

        craTests = [
            {
              idAgent: 'Agent-007',
              listeMissionTravaillees: {
                1: ['2024-12-16', '2024-12-02','2024-12-17'], 
                2: ['2024-12-03', '2024-12-18', '2025-01-10'],
                4: ['2024-12-16', '2024-12-20']
              }
            },
            {
              idAgent: 'Agent-117',
              listeMissionTravaillees: {
                3: ['2024-12-05'],
                4: ['2024-12-06']
              }
            },
            {
              idAgent: 'Agent-000',
              listeMissionTravaillees: {
                2: ['2024-12-07', '2024-12-08'],
                1: ['2024-12-09']
              }
            }];
      });

    afterEach(() => {
        jest.resetAllMocks();
    })

    describe('initializeCra', () => {

        it('doit créer le service', () => {
            expect(storageService).toBeTruthy();
        });

        it('initialise le CRA dans le local storage', () => {
            storageService.initializeCra();

            //Tests
            expect(localStorage.setItem).toHaveBeenCalledWith(
                STORAGE_KEY,
                JSON.stringify(craTests)
              );
        });
    });

    describe('getAllCras', () => {
        it('doit retourner les CRAs', () => {
    
          const cras = storageService.getAllCras();
          expect(cras).toEqual(craTests);
        });
      });

    describe('getAllCrasByMonth', () => {
        it('dit retounner les CRAs en fonction du mois', () => {
          const startOfMonth = moment('2024-12-01');
          const endOfMonth = moment('2024-12-31');
          const cras = storageService.getAllCrasByMonth(startOfMonth, endOfMonth);
    
          expect(cras).toBeInstanceOf(Array);
          expect(cras).toHaveLength(3);
        });
      });

      describe('getCraByAgent', () => {
        it('doit retorner le CRA en fonction de l\'agent', () => {
          const idAgent = craTests[0].idAgent;
          const cra = storageService.getCraByAgent(idAgent);
          expect(cra).toEqual(craTests[0]);
        });
    
        it('doit retourner null s\'il trouve pas de CRA en fonction de l\'idAgent', () => {
          const cra = storageService.getCraByAgent('nonexistent');
          expect(cra).toBeNull();
        });
      });
});