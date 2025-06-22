import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Appliance {
  id: string;
  name: string;
  quantity: number;
  powerRating: number;
  isInductive: boolean;
  runtime: number;
  totalPower: number;
  surgeFactor: number;
  dailyConsumption: number;
}

export interface EnergyAuditData {
  appliances: Appliance[];
  totalRawEnergy: number;
  totalSurgeFactor: number;
}

export interface BatteryDesignInputs {
  batteryType: 'lithium' | 'lead-acid';
  performanceLoss: number;
  lossFactor: number;
  preferredVoltage: number;
  batteryCurrentRating: number;
}

export interface PVDesignInputs {
  performanceFactor: number;
  lossFactor: number;
  peakSunHour: number;
  pvWattage: number;
  location: string;
}

export interface ProjectData {
  id: string;
  name: string;
  createdAt: string;
  energyData: EnergyAuditData;
  batteryInputs: BatteryDesignInputs;
  pvInputs: PVDesignInputs;
  notes?: string;
}

interface AppStore {
  // Energy Audit State
  energyData: EnergyAuditData;
  setEnergyData: (data: EnergyAuditData) => void;
  
  // Battery Design State
  batteryInputs: BatteryDesignInputs;
  setBatteryInputs: (inputs: BatteryDesignInputs) => void;
  
  // PV Design State
  pvInputs: PVDesignInputs;
  setPVInputs: (inputs: PVDesignInputs) => void;
  
  // Project Management
  projects: ProjectData[];
  currentProject: ProjectData | null;
  setCurrentProject: (project: ProjectData | null) => void;
  saveProject: (name: string, notes?: string) => void;
  loadProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  
  // UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Chat State
  chatMessages: Array<{ id: string; message: string; isUser: boolean; timestamp: string }>;
  addChatMessage: (message: string, isUser: boolean) => void;
  clearChatHistory: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial Energy Data
      energyData: {
        appliances: [],
        totalRawEnergy: 0,
        totalSurgeFactor: 0,
      },
      setEnergyData: (data) => set({ energyData: data }),
      
      // Initial Battery Inputs
      batteryInputs: {
        batteryType: 'lithium',
        performanceLoss: 0.85,
        lossFactor: 0.8,
        preferredVoltage: 12,
        batteryCurrentRating: 200,
      },
      setBatteryInputs: (inputs) => set({ batteryInputs: inputs }),
      
      // Initial PV Inputs
      pvInputs: {
        performanceFactor: 0.65,
        lossFactor: 0.85,
        peakSunHour: 5.5,
        pvWattage: 180,
        location: '',
      },
      setPVInputs: (inputs) => set({ pvInputs: inputs }),
      
      // Project Management
      projects: [],
      currentProject: null,
      setCurrentProject: (project) => set({ currentProject: project }),
      
      saveProject: (name, notes) => {
        const state = get();
        const newProject: ProjectData = {
          id: Date.now().toString(),
          name,
          createdAt: new Date().toISOString(),
          energyData: state.energyData,
          batteryInputs: state.batteryInputs,
          pvInputs: state.pvInputs,
          notes,
        };
        
        set({
          projects: [...state.projects, newProject],
          currentProject: newProject,
        });
      },
      
      loadProject: (projectId) => {
        const state = get();
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          set({
            currentProject: project,
            energyData: project.energyData,
            batteryInputs: project.batteryInputs,
            pvInputs: project.pvInputs,
          });
        }
      },
      
      deleteProject: (projectId) => {
        const state = get();
        set({
          projects: state.projects.filter(p => p.id !== projectId),
          currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
        });
      },
      
      // UI State
      activeTab: "energy-audit",
      setActiveTab: (tab) => set({ activeTab: tab }),
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Chat State
      chatMessages: [],
      addChatMessage: (message, isUser) => {
        const newMessage = {
          id: Date.now().toString(),
          message,
          isUser,
          timestamp: new Date().toISOString(),
        };
        set(state => ({
          chatMessages: [...state.chatMessages, newMessage]
        }));
      },
      clearChatHistory: () => set({ chatMessages: [] }),
    }),
    {
      name: 'solar-app-storage',
      partialize: (state) => ({
        projects: state.projects,
        batteryInputs: state.batteryInputs,
        pvInputs: state.pvInputs,
      }),
    }
  )
);