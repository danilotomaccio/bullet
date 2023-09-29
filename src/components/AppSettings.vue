<script setup lang="ts">
import { useAppStateStore } from "@/stores/appStateStore";
import "@material/web/textfield/outlined-text-field";

const store = useAppStateStore();
</script>

<template>
    <md-outlined-text-field label="Distanza sensori" @change="(event: any) => store.sensorsDistance = event.target.value"
        :value="store.sensorsDistance">
    </md-outlined-text-field>
</template>