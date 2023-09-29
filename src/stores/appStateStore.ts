import { defineStore } from "pinia";

export const useAppStateStore = defineStore('appState', {
    state: () => ({ deviceConnected: false, sensorsDistance: null as number | null, receivedValue: "0", readings: [] as string[] })
});