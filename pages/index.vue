<template>
  <v-card color="transparent" outlined dark class="ml-sm-11">
    <v-card-title class="text-sm-h4 text-h5 font-weight-bold"
      >FreiHeit&nbsp;&nbsp;使い方ガイド</v-card-title
    >
    <v-row>
      <v-col cols="12" sm="6">
        <v-divider class="white"></v-divider>
      </v-col>
    </v-row>
    <v-card-text class="font-weight-bold text-sm-subtitle-1 text-subtitle-2"
      >初期設定から取引の流れを確認しましょう</v-card-text
    >
    <v-card-actions class="mt-5">
      <v-btn
        rounded
        color="green"
        class="font-weight-bold text-caption pl-5 pr-5"
        >ガイドを見る</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
// import Logo from '~/components/Logo.vue'
// import VuetifyLogo from '~/components/VuetifyLogo.vue'
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const yyyChange = () => {
      state.test = '67890'
    }

    const state = reactive<{
      test: string
      test2: string
    }>({
      test: '12345',
      test2: '12345',
    })

    return {
      ...toRefs(state),
      yyyChange,
    }
  },
})
</script>
