<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
  >
    <v-card class="mx-auto my-12" max-width="374" elevation="14">
      <v-img height="250" src="/login_bg.png"></v-img>

      <v-card-title>FreiHeit</v-card-title>

      <v-card-text>
        FreiHeitとは、確定申告用の帳簿を簡単に作ることができるアプリです。
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-actions>
        <v-row class="my-5">
          <v-col cols="12" class="text-center">
            <v-btn color="primary" dark @click="loginWithAuthZero">
              ログイン
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  layout: 'loginLayout',
  setup(_props, context) {
    const loginWithAuthZero = () => {
      context.root.$auth.loginWith('auth0')
    }

    return {
      loginWithAuthZero,
    }
  },
})
</script>
