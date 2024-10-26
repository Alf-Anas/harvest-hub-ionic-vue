<script setup lang="ts">
import { FarmFieldFullInterface } from '@/database/entities/farm-field.interface';
import { getAllFarmFieldsFull, softDeleteFarmField } from '@/database/services/farm-field.service';
import { onMounted, ref, toRaw } from 'vue';

const snackbar = ref({ snackbar: false, text: "", color: "green" })
const farmFields = ref<FarmFieldFullInterface[]>([]);

const fetchFarmFields = async () => {
  const listFarmField = await getAllFarmFieldsFull();
  farmFields.value = listFarmField.data || [];
};

onMounted(() => {
  fetchFarmFields();
});

function onClickDelete(item: FarmFieldFullInterface) {
  softDeleteFarmField(item.FarmFieldId).then((res) => {
    if (res.success) {
      snackbar.value = {
        color: "green", snackbar: true, text: res.message
      }
      fetchFarmFields()
    } else {
      snackbar.value = {
        color: "red", snackbar: true, text: res.message
      }
    }
  }).catch((err) => {
    snackbar.value = {
      color: "red", snackbar: true, text: JSON.stringify(err)
    }

  })
}


const headers = [
  { title: 'Field', value: 'FarmFieldName' },
  { title: 'Farm Site', key: 'farmSite.FarmSiteName' },
  {
    title: 'Crop',
    key: 'crop.CropCode',
  },
  {
    title: 'Crop Year',
    key: 'crop.CropId',
  },
  {
    title: 'Size',
    key: 'RowWidth',
  },
  {
    title: 'Current Season',
    key: 'current_season',
    value: () => {
      return new Date().getFullYear()
    }
  },
  {
    title: 'Last Task',
    key: 'lastTask',
    value: (val: any) => {
      const row: FarmFieldFullInterface = toRaw(val)
      const eVal = row.tasks?.length ? row.tasks[0].WorkTaskTypeCode : ''
      return eVal
    }
  },
  {
    title: 'Next Task',
    key: 'nextTask',
    value: (val: any) => {
      const row: FarmFieldFullInterface = toRaw(val)
      const eVal = row.tasks?.length ? row.tasks[row.tasks.length - 1].WorkTaskTypeCode : ''
      return eVal
    }
  },
  {
    title: 'Observations',
    key: 'observations',
  },
  {
    title: 'Last Season Yield',
    key: 'lastSeasonYield',
  },
  {
    title: 'Last Season CCS',
    key: 'lastSeasonCCS',
  },
  {
    title: 'Action', key: 'actions', sortable: false,
  }
]
</script>


<template>
  <v-layout>
    <app-bar />

    <v-main>
      <v-container fluid>
        <v-data-table :headers="headers" :items="farmFields">
          <template v-slot:top>
            <v-toolbar flat color="primary">
              <v-toolbar-title>Farm Field</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn to="/farm-field/create" variant="outlined">
                Tambah
              </v-btn>
            </v-toolbar>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.actions="{ item }">
            <v-btn color="red" density="compact" variant="outlined" @click="onClickDelete(item)">
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-container>
      <v-snackbar v-model="snackbar.snackbar" :text="snackbar.text" :color="snackbar.color" />
    </v-main>
  </v-layout>
</template>
