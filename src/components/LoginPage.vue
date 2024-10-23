<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/router/auth';

const email = ref('');
const password = ref('');
const visible = ref(false);
const loginMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  const response = await login(email.value, password.value);
  if (response.status) {
    loginMessage.value = response.message;
    router.push('/');
  } else {
    loginMessage.value = response.message;
  }
};
</script>

<template>
  <div class="tw-bg-green-500 tw-min-h-full tw-py-8 tw-px-4">
    <v-img class="mx-auto" max-height="128" src="@/assets/logo.png"></v-img>

    <v-card class="mx-auto tw-p-4 md:tw-p-8" elevation="8" max-width="448" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
        variant="outlined" v-model="email"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
      </div>

      <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
        density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
        @click:append-inner="visible = !visible" v-model="password"></v-text-field>

      <v-card class="mb-4" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          Gunakan salah satu dari akun ini untuk login :
          <br />
          <br />

          email: user001@harvesthub.com
          <br />
          password: abcd1234
          <br />
          <br />

          email: user002@harvesthub.com
          <br />
          password: password
          <br />
          <br />

          email: user003@harvesthub.com
          <br />
          password: 12345678
        </v-card-text>
      </v-card>

      <v-btn class="mb-4" color="primary" size="large" variant="tonal" block @click="handleLogin">
        Log In
      </v-btn>
      <v-alert v-if="loginMessage" :text="loginMessage" color="error" class="tw-text-xs tw-text-center"></v-alert>
    </v-card>
  </div>
</template>
