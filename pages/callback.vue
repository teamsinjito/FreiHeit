<template>
  <v-col sm="12" class="text-center">
    <v-progress-circular
      :size="50"
      :width="10"
      color="primary"
      indeterminate
      :value="40"
    ></v-progress-circular>
  </v-col>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'loginLayout',
  setup() {},
})
</script>
