<script setup lang="ts">
import "@material/web/icon/icon";
import "@material/web/iconbutton/icon-button";
import { useAppStateStore } from '@/stores/appStateStore';
import { storeToRefs } from 'pinia';

const store = useAppStateStore();
const { readings } = storeToRefs(store);
</script>

<template>
    <div id="readingsList">
        <div id="resetBtn">
            <md-icon-button @click="store.readings = []">
                <md-icon>
                    refresh
                </md-icon>
            </md-icon-button>
        </div>
        <ul>
            <li v-for="read in readings">
                {{ read }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
#readingsList {
    height: 50%;
    width: 40%;
    overflow: scroll;

    background-color: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
    border-radius: 28px;

    position: relative;
}

#resetBtn {
    position: absolute;
    top: 4px;
    right: 4px;
}
</style>