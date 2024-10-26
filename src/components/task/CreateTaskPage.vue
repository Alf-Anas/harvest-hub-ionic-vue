<script setup lang="ts">
import { FarmFieldInterface } from '@/database/entities/farm-field.interface';
import { WorkTaskTypeInterface } from '@/database/entities/work-task-type.interface';
import { getAllFarmFields } from '@/database/services/farm-field.service';
import { getAllWorkTaskTypes } from '@/database/services/work-task-type.service';
import { addWorkTask } from '@/database/services/work-task.service';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { VDateInput } from 'vuetify/labs/VDateInput'

const router = useRouter()
const snackbar = ref({ snackbar: false, text: "", color: "green" })
const listTaskType = ref<WorkTaskTypeInterface[]>([])
const listFarmField = ref<FarmFieldInterface[]>([])
const task = ref<{
  taskType: string | null,
  field: string | null,
  taskName: string,
  dueDate: Date | null,
  instruction: string,
  attachment: string,
}>({
  taskType: null,
  field: null,
  taskName: '',
  dueDate: null,
  instruction: "",
  attachment: "",
});



const formValid = ref(false);
const rules = ref({
  taskType: [(value: string) => {
    if (value) return true
    return 'Task Type tidak boleh kosong!'
  }],
  field: [(value: string) => {
    if (value) return true
    return 'Field tidak boleh kosong!'
  }],
  taskName: [(value: string) => {
    if (value) return true
    return 'Task Name tidak boleh kosong!'
  }],
  dueDate: [(value: string) => {
    if (value) return true
    return 'Due Date tidak boleh kosong!'
  }],
  instruction: [(value: string) => {
    if (value) return true
    return 'Instruction tidak boleh kosong!'
  }],
  attachment: [(value: string) => {
    if (value) return true
    return 'Attachment tidak boleh kosong!'
  }],
});


const fetchTaskType = async () => {
  const eList = await getAllWorkTaskTypes();
  listTaskType.value = eList.data || [];
};
const fetchFarmField = async () => {
  const eList = await getAllFarmFields();
  listFarmField.value = eList.data || [];
};

onMounted(() => {
  fetchTaskType();
  fetchFarmField()
});

async function onClickSubmit() {
  if (!formValid.value) return
  const { attachment, dueDate, field, instruction, taskName, taskType } = task.value
  addWorkTask({
    WorkTaskTypeCode: String(taskType),
    WorkTaskStatusCode: "Open",
    WorkTaskName: taskName,
    DueDate: dueDate?.toISOString() || '',
    Instruction: instruction,
    Attachment: attachment,
    FarmFieldId: Number(field),
  }).then((res) => {
    if (res.success) {
      snackbar.value = {
        color: "green", snackbar: true, text: res.message
      }
      setTimeout(() => {
        router.push("/task")
      }, 850)
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



</script>


<template>
  <v-layout>
    <app-bar />
    <v-main>
      <v-container fluid>
        <v-form v-model="formValid" @submit.prevent="onClickSubmit">
          <v-container>
            <v-toolbar flat class="tw-bg-green-500 tw-mb-4" density="compact">
              <v-toolbar-title>Tambah Task</v-toolbar-title>
            </v-toolbar>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select density="compact" hide-details="auto" label="Select Task Type" :items="listTaskType"
                  variant="outlined" v-model="task.taskType" :rules="rules.taskType" item-value="WorkTaskTypeCode"
                  item-title="WorkTaskTypeCode" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select density="compact" hide-details="auto" label="Field" :items="listFarmField" variant="outlined"
                  v-model="task.field" :rules="rules.field" item-value="FarmFieldId" item-title="FarmFieldName" />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field density="compact" hide-details="auto" v-model="task.taskName" :rules="rules.taskName"
                  label="Task Name" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-date-input prepend-icon="" density="compact" hide-details="auto" v-model="task.dueDate"
                  :rules="rules.dueDate" label="Due Date" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field density="compact" hide-details="auto" v-model="task.instruction"
                  :rules="rules.instruction" label="Instruction" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field density="compact" hide-details="auto" v-model="task.attachment" :rules="rules.attachment"
                  label="Attachment" variant="outlined" />
              </v-col>

            </v-row>
            <div class="tw-justify-between tw-flex">
              <v-btn class="tw-mt-4" to="/task">Batal</v-btn>
              <v-btn class="tw-mt-4" type="submit" color="primary">Simpan</v-btn>
            </div>
          </v-container>
        </v-form>
        <v-snackbar v-model="snackbar.snackbar" :text="snackbar.text" :color="snackbar.color" />
      </v-container>
    </v-main>


  </v-layout>
</template>
