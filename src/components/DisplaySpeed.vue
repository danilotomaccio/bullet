<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore';

const store = useAppStateStore();
</script>

<template>
    <div class="displaySpeed">
        <div class="title-large">
            {{ store.receivedValue }} m/s
        </div>
        <div class="title-small">
            {{ Number(store.receivedValue) * 3.28084 }} fps
        </div>
    </div>
</template>
