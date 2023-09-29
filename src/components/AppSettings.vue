<script setup lang="ts">
import { useAppStateStore } from "@/stores/appStateStore";
import "@material/web/textfield/outlined-text-field";

const store = useAppStateStore();
</script>

<template>
    <md-outlined-text-field label="Label" v-model.lazy="store.sensorsDistance">
    </md-outlined-text-field>
</template>