<script setup lang="ts">
import { useAppStateStore } from "@/stores/appStateStore";
import "@material/web/icon/icon";
import "@material/web/iconbutton/icon-button";
import "@material/web/textfield/outlined-text-field";
import "@material/web/menu/menu";
import "@material/web/menu/menu-item";
import "@material/web/dialog/dialog";
import "@material/web/button/text-button";
import { ref } from "vue";

const store = useAppStateStore();

const lunValue = ref(store.sensorsDistance);
const openLunDialog = ref(false);

const menu = ref<any>();
</script>

<template>
    <div id="settings">
        <div id="menuContainer">
            <md-icon-button id="settingsBtn" @click="menu.open = !menu.open">
                <md-icon>more_vert</md-icon>
            </md-icon-button>
            <md-menu ref="menu" id="usage-menu" anchor="settingsBtn" v-if="store.deviceConnected">
                <md-menu-item @click="openLunDialog = true">
                    Modifica distanza
                </md-menu-item>
            </md-menu>
        </div>
        <div id="distanzaDialog">
            <md-dialog @close="openLunDialog = false" class="lunDialog" type="alert" :open="openLunDialog">
                <div slot="headline">Modifica distanza sensori</div>
                <form slot="content" id="form-id" method="dialog">

                    <md-outlined-text-field type="number" label="Distanza sensori" :value="store.sensorsDistance"
                        @change="(event: any) => lunValue = event.target.value">
                    </md-outlined-text-field>

                </form>
                <div slot="actions">
                    <md-text-button form="form-id" value="cancel" @click="openLunDialog = false">Annulla</md-text-button>
                    <md-text-button form="form-id" value="confirm"
                        @click="store.sensorsDistance = lunValue">Conferma</md-text-button>
                </div>
            </md-dialog>

        </div>
    </div>
</template>

<style scoped>
#settings {
    position: absolute;
    top: 0;
    right: 0;
}

#menuContainer {
    position: relative;
}

.lunDialog {}
</style>