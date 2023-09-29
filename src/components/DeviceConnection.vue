<script setup lang="ts">
import "@material/web/button/filled-tonal-button";
import "@material/web/progress/circular-progress";
import { useAppStateStore } from "@/stores/appStateStore";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";

const store = useAppStateStore();
const { sensorsDistance } = storeToRefs(store);

const connecting = ref(false);
const writing = ref(false);

let device: any, sensorCharacteristic: any, lunCharacteristic: any;

/* const emits = defineEmits<{
  onReceivedData: [data: string]
}>(); */

watch(sensorsDistance, (after, _before) => {

  if (connecting.value && store.deviceConnected) {
    connecting.value = false;
    return;
  }
  
  if (!connecting.value && !writing.value && after) {
    writeToBLE(new TextEncoder().encode(after.toString()))
  }
}
);

async function connectToBLE() {
  connecting.value = true;

  try {
    device = await (navigator as any).bluetooth.requestDevice({
      filters: [{
        services: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
      }]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
    sensorCharacteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
    lunCharacteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a9');

    sensorCharacteristic.addEventListener('characteristicvaluechanged', handleSensorCharacteristicValueChanged);
    lunCharacteristic.addEventListener('characteristicvaluechanged', handleLunCharacteristicValueChanged);
    await sensorCharacteristic.startNotifications();
    await lunCharacteristic.startNotifications();

    const sd = await lunCharacteristic.readValue();
    store.sensorsDistance = Number(new TextDecoder().decode(sd));
    store.deviceConnected = true;

  } catch (error) {
    console.error("There was an error:", error);
  }
}

async function disconnectFromBLE() {
  if (sensorCharacteristic) {
    try {
      await sensorCharacteristic.stopNotifications();
      sensorCharacteristic.removeEventListener('characteristicvaluechanged', handleSensorCharacteristicValueChanged);
      sensorCharacteristic = null;
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
  if (!store.deviceConnected || connecting.value || writing.value) {
    return;
  }

  if (!lunCharacteristic) {
    console.error("Characteristic not available. Make sure the device is connected.");
    return;
  }

  try {
    writing.value = true;
    await lunCharacteristic.writeValue(data);
  } catch (error) {
    console.error("Error writing data:", error);
  }
}

function handleSensorCharacteristicValueChanged(event: any): void {
  const value = event.target.value;
  const data = new TextDecoder().decode(value);
  store.receivedValue = data;
  // emits('onReceivedData', data);
}

function handleLunCharacteristicValueChanged(event: any): void {
  const value = event.target.value;
  const data = new TextDecoder().decode(value);

  if (writing.value) {
    writing.value = false;
  }
  // emits('onReceivedData', data);
}
</script>

<template>
  <div class="progress" v-if="connecting">
    <md-circular-progress indeterminate></md-circular-progress>
  </div>
  <div class="btn" v-else>
    <md-filled-tonal-button @click="connectToBLE" v-if="!store.deviceConnected">Connetti</md-filled-tonal-button>
    <md-filled-tonal-button @click="disconnectFromBLE" v-if="store.deviceConnected">Disconnetti</md-filled-tonal-button>
  </div>
</template>

<style scoped></style>
