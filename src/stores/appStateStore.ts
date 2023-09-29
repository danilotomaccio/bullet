import { defineStore } from "pinia";

export const useAppStateStore = defineStore('appState', {
    state: () => ({ deviceConnected: false, sensorsDistance: 10, receivedValue: "0" })
});