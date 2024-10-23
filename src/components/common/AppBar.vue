<script setup lang="ts">
import { useRouter } from 'vue-router';
import { logout } from '@/router/auth';

const router = useRouter()

const handleLogout = async () => {
  logout().then(() => {
    router.push("/login")
  })
};
</script>


<template>
  <v-app-bar color="green-darken-3">
    <template v-slot:prepend>
      <v-img class="tw-ml-4" width="48" src="@/assets/logo.png"></v-img>
    </template>
    <v-app-bar-title>
      Harvest Hub
    </v-app-bar-title>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
      </template>

      <v-list>
        <v-list-item to="/farm-site">
          Farm Site
        </v-list-item>
        <v-list-item to="/farm-field">
          Farm Field
        </v-list-item>
        <v-list-item to="/task">
          Task
        </v-list-item>
        <v-list-item @click="handleLogout" class="tw-text-red-500">
          Log Out
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
