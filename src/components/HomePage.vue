<template>
  <v-layout>
    <app-bar />

    <v-main>
      <v-container fluid class="tw-block md:tw-flex tw-gap-8">
        <v-row>
          <v-col cols="12" md="4" sm="6">
            <v-card variant="elevated" elevation="8" title="Farm Field" text="Manage Farm Field data">
              <template v-slot:actions>
                <v-btn class="tw-ml-2 tw-text-end" text="Manage" color="primary" variant="outlined" to="/farm-field" />
              </template>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <v-card variant="elevated" elevation="8" title="Task" text="Manage Task data">
              <template v-slot:actions>
                <v-btn class="tw-ml-2 tw-text-end" text="Manage" color="primary" variant="outlined" to="/task" />
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>
