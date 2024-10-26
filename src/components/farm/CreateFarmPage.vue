<script setup lang="ts">
import { CropInterface } from '@/database/entities/crop.interface';
import { FarmSiteInterface } from '@/database/entities/farm-site.interface';
import { getAllCrops } from '@/database/services/crop.service';
import { addFarmField } from '@/database/services/farm-field.service';
import { getAllFarmSites } from '@/database/services/farm-site.service';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const snackbar = ref({ snackbar: false, text: "", color: "green" })
const listCrop = ref<CropInterface[]>([])
const listFarmSite = ref<FarmSiteInterface[]>([])
const farmField = ref<{
  name: string,
  code: string,
  description: string,
  farmSite: null | number,
  crop: null | number,
  rowWidth: string | number,
  fieldColor: string,
  rowDirection: string,
}>({
  name: '',
  code: '',
  description: "",
  farmSite: null,
  crop: null,
  rowWidth: "1.5",
  fieldColor: "#FF0000",
  rowDirection: "",
});

watch(
  () => farmField.value.farmSite,
  (newFarmSiteId) => {
    const selectedFarmSite = listFarmSite.value.find(site => site.FarmSiteId === newFarmSiteId);
    if (selectedFarmSite) {
      farmField.value.crop = selectedFarmSite.DefaultPrimaryCropId;
    } else {
      farmField.value.crop = null
    }
  }
);

const colorPickerDialog = ref(false);

const formValid = ref(false);
const rules = ref({
  name: [(value: string) => {
    if (value) return true
    return 'Field Name tidak boleh kosong!'
  }],
  code: [(value: string) => {
    if (value) return true
    return 'Field Code tidak boleh kosong!'
  }],
  description: [(value: string) => {
    if (value) return true
    return 'Description tidak boleh kosong!'
  }],
  farmSite: [(value: string) => {
    if (value) return true
    return 'Farm Site tidak boleh kosong!'
  }],
  crop: [(value: string) => {
    if (value) return true
    return 'Primary Crop tidak boleh kosong!'
  }],
  rowWidth: [(value: string) => {
    if (!value) {
      return 'Row Width tidak boleh kosong!'
    } else if (isNaN(Number(value))) {
      return 'Row Width hanya menerima angka!'
    }
    return true
  }],
  fieldColor: [(value: string) => {
    if (value) return true
    return 'Field Color tidak boleh kosong!'
  }],
  rowDirection: [(value: string) => {
    if (value) return true
    return 'Row Direction tidak boleh kosong!'
  }],
});


const fetchCrops = async () => {
  const eList = await getAllCrops();
  listCrop.value = eList.data || [];
};
const fetchFarmSite = async () => {
  const eList = await getAllFarmSites();
  listFarmSite.value = eList.data || [];
};

onMounted(() => {
  fetchCrops();
  fetchFarmSite()
});

async function onClickSubmit() {
  if (!formValid.value) return
  const { code, description, farmSite, fieldColor, name, rowDirection, rowWidth } = farmField.value
  addFarmField({
    FarmSiteId: Number(farmSite),
    FarmFieldName: name, FarmFieldCode: code,
    Description: description,
    FarmFieldColorHexCode: fieldColor,
    FarmFieldRowDirection: rowDirection,
    RowWidth: Number(rowWidth),
  }).then((res) => {
    if (res.success) {
      snackbar.value = {
        color: "green", snackbar: true, text: res.message
      }
      setTimeout(() => {
        router.push("/farm-field")
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
              <v-toolbar-title>Tambah Farm Field</v-toolbar-title>
            </v-toolbar>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field density="compact" hide-details="auto" v-model="farmField.name" :rules="rules.name"
                  label="Field Name" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field density="compact" hide-details="auto" v-model="farmField.code" :rules="rules.code"
                  label="Field Code" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="12">
                <v-textarea density="compact" hide-details="auto" v-model="farmField.description"
                  :rules="rules.description" label="Description" variant="outlined" rows="2" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select density="compact" hide-details="auto" label="Farm Site" :items="listFarmSite"
                  variant="outlined" v-model="farmField.farmSite" :rules="rules.farmSite" item-value="FarmSiteId"
                  item-title="FarmSiteName" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select density="compact" hide-details="auto" label="Primary Crop" :items="listCrop"
                  variant="outlined" v-model="farmField.crop" :rules="rules.crop" item-value="CropId"
                  item-title="CropCode" readonly />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field density="compact" hide-details="auto" v-model="farmField.rowWidth" :rules="rules.rowWidth"
                  label="Row Width " variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field density="compact" hide-details="auto" v-model="farmField.fieldColor"
                  :rules="rules.fieldColor" label="Field Color" variant="outlined" readonly
                  @click="colorPickerDialog = true" />

                <v-dialog v-model="colorPickerDialog" max-width="300">
                  <v-card density="compact">
                    <v-color-picker v-model="farmField.fieldColor" />
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field density="compact" hide-details="auto" v-model="farmField.rowDirection"
                  :rules="rules.rowDirection" label="Row Direction" variant="outlined" />
              </v-col>
            </v-row>
            <div class="tw-justify-between tw-flex">
              <v-btn class="tw-mt-4" to="/farm-field">Batal</v-btn>
              <v-btn class="tw-mt-4" type="submit" color="primary">Simpan</v-btn>
            </div>
          </v-container>
        </v-form>
        <v-snackbar v-model="snackbar.snackbar" :text="snackbar.text" :color="snackbar.color" />
      </v-container>
    </v-main>


  </v-layout>
</template>
