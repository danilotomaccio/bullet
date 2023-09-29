<script setup lang="ts">
import AppSettings from "./components/AppSettings.vue";
import DeviceConnection from "./components/DeviceConnection.vue";
import DisplaySpeed from "./components/DisplaySpeed.vue";
import ReadingsList from "./components/ReadingsList.vue";
</script>

<template>
  <div class="main">
    <AppSettings />
    <DisplaySpeed />
    <ReadingsList />
    <DeviceConnection />
  </div>
</template>

<style scoped>
.main {
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
