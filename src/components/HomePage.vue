<template>
  <v-layout>
    <app-bar />

    <v-main>
      <v-container fluid>
        <v-row dense>
          <v-col v-for="n in 4" :key="n" cols="12">
            <v-card :subtitle="`Subtitle for Content ${n}`" :title="`Content ${n}`"
              text="Lorem ipsum dolor sit amet consectetur, adipisicing elit.?"></v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
//
</script>
