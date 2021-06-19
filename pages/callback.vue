<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
    ><v-container fluid class="fill-height text-center"
      ><v-col cols="12" class="text-center">ログイン中...</v-col></v-container
    ></v-sheet
  >
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'loginLayout',
  setup() {},
})
</script>
