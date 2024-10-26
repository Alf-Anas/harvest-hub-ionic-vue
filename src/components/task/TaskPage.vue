<script setup lang="ts">
import { WorkTaskInterface } from '@/database/entities/work-task.interface';
import { getAllWorkTasksFull } from '@/database/services/work-task.service';
import { getDateTimeLabel } from '@/utils';
import { onMounted, ref, toRaw } from 'vue';
import { VBtn } from 'vuetify/components';

const workTasks = ref<WorkTaskInterface[]>([]);

const fetchTask = async () => {
  const listWorkTask = await getAllWorkTasksFull();
  workTasks.value = listWorkTask.data || [];
};

onMounted(() => {
  fetchTask();
});

function isOverdue(dueDate: string) {
  if (new Date().toISOString() > (dueDate)) {
    return true
  }
  return false
}


const headers = [
  { title: 'Task', value: 'WorkTaskTypeCode' },
  { title: 'Name', key: 'WorkTaskName' },
  {
    title: 'Field',
    key: 'field.FarmFieldName',
  },
  { title: 'Crop', key: 'crop.CropCode' },
  {
    title: 'Status', key: 'WorkTaskStatusCode', value: (val: any) => {
      const row: WorkTaskInterface = toRaw(val)
      const eVal = (isOverdue(row.DueDate) && row.WorkTaskStatusCode !== "Complete") ? "Overdue" : row.WorkTaskStatusCode
      return eVal
    }
  },
  {
    title: 'Due', key: 'DueDate', value: (val: any) => {
      const row: WorkTaskInterface = toRaw(val)
      const eVal = getDateTimeLabel(row.DueDate)
      return eVal
    }
  },
  {
    title: 'Started', key: 'StartedDate', value: (val: any) => {
      const row: WorkTaskInterface = toRaw(val)
      const eVal = row.StartedDate ? getDateTimeLabel(row.StartedDate) : ""
      return eVal
    }
  },
  {
    title: 'Last Action', key: 'ModifiedDate', value: (val: any) => {
      const row: WorkTaskInterface = toRaw(val)
      const eVal = getDateTimeLabel(row.ModifiedDate || '')
      return eVal
    }
  },
  { title: 'Summary', key: 'Instruction' },
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
        <v-data-table :headers="headers" :items="workTasks">
          <template v-slot:top>
            <v-toolbar flat color="primary">
              <v-toolbar-title>Task</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn to="/task/create" variant="outlined">
                Tambah
              </v-btn>
            </v-toolbar>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.actions="{ item }">
            <v-btn color="primary" density="compact" :to="`/task/action/${item.WorkTaskId}`" variant="outlined">
              Action
            </v-btn>
          </template>
        </v-data-table>
      </v-container>
    </v-main>
  </v-layout>
</template>
