<template>
  <v-card>
    <v-btn @click="axiosTest">テスト</v-btn>
    <v-btn @click="axiosTest2">テスト2</v-btn>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'
import axios from 'axios'
export default defineComponent({
  setup() {
    const state = reactive<{
      test: string
      test2: number
    }>({
      test: 'abc',
      test2: 1,
    })

    const axiosTest = () => {
      const response = axios
        .post('/api/test', 'data')
        .then(() => {
          alert('pass')
        })
        .catch(() => {
          alert('api error')
        })
      return { response }
    }
    const axiosTest2 = () => {
      const response = axios
        .post('/api/testcopy', 'data')
        .then(() => {
          alert('pass2')
        })
        .catch(() => {
          alert('api error')
        })
      return { response }
    }

    return { ...toRefs(state), axiosTest, axiosTest2 }
  },
})
</script>
<style scoped></style>
