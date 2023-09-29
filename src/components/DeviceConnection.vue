<script setup lang="ts">
import "@material/web/button/filled-tonal-button";
import { useAppStateStore } from "@/stores/appStateStore";
import { watch } from "vue";
import { storeToRefs } from "pinia";

const store = useAppStateStore();
const { sensorsDistance } = storeToRefs(store);

let device: any, characteristic: any;

/* const emits = defineEmits<{
  onReceivedData: [data: string]
}>(); */

watch(sensorsDistance, (after, _before) => writeToBLE(new TextEncoder().encode(after.toString())));

async function connectToBLE() {
  try {
    device = await (navigator as any).bluetooth.requestDevice({
      filters: [{
        services: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
      }]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
    characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');

    characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
    await characteristic.startNotifications();

    store.deviceConnected = true;

  } catch (error) {
    console.error("There was an error:", error);
  }
}

async function disconnectFromBLE() {
  if (characteristic) {
    try {
      await characteristic.stopNotifications();
      characteristic.removeEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
      characteristic = null;
    } catch (error) {
      console.error("Error stopping notifications:", error);
    }
  }

  if (device && device.gatt.connected) {
    device.gatt.disconnect();
    device = null;
    store.deviceConnected = false;
  }
}


async function writeToBLE(data: Uint8Array) {
  if (!store.deviceConnected) {
    return;
  }

  if (!characteristic) {
    console.error("Characteristic not available. Make sure the device is connected.");
    return;
  }

  try {
    await characteristic.writeValue(data);
    console.log("Data written successfully");
  } catch (error) {
    console.error("Error writing data:", error);
  }
}

function handleCharacteristicValueChanged(event: any): void {
  const value = event.target.value;
  const data = new TextDecoder().decode(value);
  store.receivedValue = data;
  // emits('onReceivedData', data);
}
</script>

<template>
  <md-filled-tonal-button @click="connectToBLE" v-if="!store.deviceConnected">Connetti</md-filled-tonal-button>
  <md-filled-tonal-button @click="disconnectFromBLE" v-if="store.deviceConnected">Disconnetti</md-filled-tonal-button>
</template>

<style scoped></style>
