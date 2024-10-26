<script setup lang="ts">
import { WorkTaskFullInterface, WorkTaskInterface } from '@/database/entities/work-task.interface';
import { getWorkTaskByIdFull, updateWorkTask } from '@/database/services/work-task.service';
import { getDateLabel, getDateTimeLabel } from '@/utils';
import { onMounted, ref, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const id = route.params.id;
const router = useRouter()
const snackbar = ref({ snackbar: false, text: "", color: "green" })
const onBehalfOf = ref('MySelf');
const actionDateTime = ref(getDateTimeLabel(new Date().toISOString()));
const action = ref<string>("");
const task = ref<WorkTaskFullInterface>();

const fetchTaskDetail = async () => {
  const eData = await getWorkTaskByIdFull(Number(id));
  task.value = eData.data
};


onMounted(() => {
  fetchTaskDetail()
});

async function onClickSubmit() {
  if (!action.value) {
    snackbar.value = {
      color: "red", snackbar: true, text: "Please choose Action!"
    }
    return
  }

  let updatedValue: Partial<WorkTaskInterface> = {}
  if (action.value === "pause") {
    updatedValue = {
      StartedDate: new Date().toISOString(),
      CancelledDate: undefined,
      IsCancelled: false,
      IsStarted: false,
      IsCompleted: false,
      IsDeleted: false,
      WorkTaskStatusCode: "Open"
    }
  } else if (action.value === "start") {
    updatedValue = {
      StartedDate: new Date().toISOString(),
      CancelledDate: undefined,
      IsCancelled: false,
      IsStarted: true,
      IsCompleted: false,
      IsDeleted: false,
      WorkTaskStatusCode: "Underway"
    }
  } else if (action.value === "cancel") {
    updatedValue = {
      CancelledDate: new Date().toISOString(),
      IsCancelled: true,
      IsStarted: false,
      IsCompleted: false,
      IsDeleted: false,
      WorkTaskStatusCode: "Open"
    }
  } else if (action.value === "complete") {
    updatedValue = {
      CancelledDate: undefined,
      IsCancelled: false,
      IsStarted: false,
      IsCompleted: true,
      IsDeleted: false,
      WorkTaskStatusCode: "Complete"
    }
  }


  updateWorkTask(Number(id), updatedValue)
    .then((res) => {
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

function getLastAction() {
  const eTask = toRaw(task.value)
  if (eTask?.IsCompleted) {
    return "Completed"
  } else if (eTask?.IsStarted) {
    return "Started"
  } else if (eTask?.IsCancelled) {
    return "Cancelled"
  } else if (eTask?.IsDeleted) {
    return "Deleted"
  } else {
    return "Task Created"
  }
}

function isOverdue() {
  if (new Date().toISOString() > (task.value?.DueDate || '')) {
    return true
  }
  return false
}


</script>


<template>
  <v-layout>
    <app-bar />
    <v-main>
      <v-container fluid>
        <v-container>
          <v-toolbar flat class="tw-bg-green-500 tw-mb-4" density="compact">
            <v-toolbar-title>Task Information <v-chip v-if="isOverdue()" color="red" variant="flat">
                Overdue
              </v-chip>
            </v-toolbar-title>
          </v-toolbar>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="task?.WorkTaskName" label="Task Name" variant="outlined"
                readonly hide-details="auto" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="task?.WorkTaskTypeCode" label="Task" variant="outlined"
                readonly hide-details="auto" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="task?.field?.FarmFieldName" label="Field" readonly
                variant="outlined" hide-details="auto" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="task?.site?.FarmSiteName" label="Site" variant="outlined"
                readonly hide-details="auto" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="task?.crop?.CropCode" label="Crop" variant="outlined"
                readonly hide-details="auto" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="task?.WorkTaskStatusCode" label="Status" variant="outlined"
                readonly hide-details="auto" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="getDateLabel(task?.DueDate || '')" label="Due Date"
                variant="outlined" readonly hide-details="auto" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="getDateTimeLabel(task?.CreatedDate || '')"
                label="Created At" variant="outlined" readonly hide-details="auto" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="task?.Instruction" label="Instruction" variant="outlined"
                readonly hide-details="auto" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="task?.Attachment" label="Attachment" variant="outlined"
                readonly hide-details="auto" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="getLastAction()" label="Last Action" variant="outlined"
                readonly hide-details="auto" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" :model-value="getDateTimeLabel(task?.ModifiedDate || '')"
                label="Last Action Date" variant="outlined" readonly hide-details="auto" />
            </v-col>

          </v-row>
        </v-container>
        <v-form @submit.prevent="onClickSubmit">
          <v-container>
            <v-toolbar flat class="tw-bg-green-500 tw-mb-4" density="compact">
              <v-toolbar-title>Task Action</v-toolbar-title>
            </v-toolbar>
            <v-row>
              <v-col class="py-2" cols="12">
                <div class="tw-w-full tw-text-center">
                  <v-btn-toggle v-model="action" color="green" rounded="0" group>
                    <v-btn value="start" variant="outlined">
                      START this Task
                    </v-btn>
                    <v-btn value="pause" variant="outlined">
                      PAUSE this Task
                    </v-btn>

                    <v-btn value="cancel" variant="outlined">
                      CANCEL this Task (Abandon)
                    </v-btn>

                    <v-btn value="complete" variant="outlined" color="primary">
                      COMPLETE this Task
                    </v-btn>

                  </v-btn-toggle>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select density="compact" hide-details="auto" label="On Behalf of" :items="['MySelf']"
                  variant="outlined" v-model="onBehalfOf" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field density="compact" hide-details="auto" v-model="actionDateTime" label="Action Date/Time"
                  variant="outlined" readonly />
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
