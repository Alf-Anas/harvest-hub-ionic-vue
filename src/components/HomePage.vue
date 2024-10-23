<template>
  <v-layout>
    <app-bar />

    <v-main>
      <v-container fluid class="tw-block md:tw-flex tw-gap-8">
        <v-card class="tw-max-w-lg tw-mt-8 tw-min-w-[30%]" variant="elevated" elevation="8" title="Farm Site"
          text="Manage Farm Site data">
          <template v-slot:actions>
            <v-btn class="tw-ml-2 tw-text-end" text="Manage" color="primary" variant="outlined" to="/farm-site" />
          </template>
        </v-card>
        <v-card class="tw-max-w-lg tw-mt-8 tw-min-w-[30%]" variant="elevated" elevation="8" title="Farm Field"
          text="Manage Farm Field data">
          <template v-slot:actions>
            <v-btn class="tw-ml-2 tw-text-end" text="Manage" color="primary" variant="outlined" to="/farm-field" />
          </template>
        </v-card>
        <v-card class="tw-max-w-lg tw-mt-8 tw-min-w-[30%]" variant="elevated" elevation="8" title="Task"
          text="Manage Task data">
          <template v-slot:actions>
            <v-btn class="tw-ml-2 tw-text-end" text="Manage" color="primary" variant="outlined" to="/task" />
          </template>
        </v-card>
      </v-container>
    </v-main>
  </v-layout>
</template>
