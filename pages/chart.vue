<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
  >
    <!-- ヘッダー項目 -->
    <header-bar></header-bar>
    <v-divider></v-divider>
    <v-card flat rounded="0" class="mb-2 py-5">
      <v-card-text>
        <v-row
          ><v-col cols="12" md="3">
            <v-expansion-panels focusable multiple>
              <v-expansion-panel>
                <v-expansion-panel-header color="primary" class="white--text"
                  >期間設定 </v-expansion-panel-header
                ><v-expansion-panel-content class="pt-5">
                  <v-slider
                    value="sliderStart"
                    min="1"
                    max="12"
                    thumb-color="primary"
                    thumb-label="always"
                    thumb-size="30"
                    class="mt-5"
                    ><template #thumb-label="{ value }">
                      {{ value }}<span style="font-size: 0.2rem">月</span>
                    </template>
                    <template #label>
                      <span class="text-caption font-weight-medium"
                        >開始月</span
                      >
                    </template>
                  </v-slider>
                  <v-slider
                    value="sliderEnd"
                    min="1"
                    max="12"
                    thumb-color="primary"
                    thumb-label="always"
                    thumb-size="30"
                    class="mt-5"
                    ><template #thumb-label="{ value }">
                      {{ value }}<span style="font-size: 0.2rem">月</span>
                    </template>
                    <template #label>
                      <span class="text-caption font-weight-medium"
                        >終了月</span
                      >
                    </template>
                  </v-slider></v-expansion-panel-content
                ></v-expansion-panel
              >
              <v-expansion-panel>
                <v-expansion-panel-header color="primary" class="white--text"
                  >項目設定 </v-expansion-panel-header
                ><v-expansion-panel-content class="pt-5">
                  <v-row>
                    <v-col cols="3" class="my-auto"
                      ><span class="text-caption font-weight-medium"
                        >項目</span
                      ></v-col
                    >
                    <v-col cols="9">
                      <v-select
                        label="仕入"
                        solo
                        dense
                        persistent-hint
                        class="mt-6"
                        ><template #label
                          ><span class="text-caption">仕入</span></template
                        ></v-select
                      >
                    </v-col>
                  </v-row>
                </v-expansion-panel-content></v-expansion-panel
              >
            </v-expansion-panels>
          </v-col>
          <v-col cols="12" md="9"
            ><v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header color="primary" class="white--text"
                  >取引先別レポート</v-expansion-panel-header
                >
                <v-expansion-panel-content class="pt-5">
                  <v-row>
                    <v-col cols="12" sm="3">
                      <v-btn @click="axiosTest">バックエンド接続テスト</v-btn>
                    </v-col>
                  </v-row>
                  <!-- 動作検証用 -->
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <bar-chart />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <pie-chart />
                    </v-col>
                  </v-row> </v-expansion-panel-content></v-expansion-panel
            ></v-expansion-panels>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'
import axios from 'axios'
import { Users } from '../composables/useChart'

export default defineComponent({
  setup() {
    const state = reactive<{
      sliderStart: number
      sliderEtart: number
      test: string
      test2: number
    }>({
      sliderStart: 1,
      sliderEtart: 12,
      test: 'abc',
      test2: 1,
    })

    const axiosTest = () => {
      const response = axios
        .post<Users[]>('/api/testcopy', 'data')
        .then((data) => {
          console.log(data.data[0].mail)
          alert('pass2')
        })
        .catch(() => {
          alert('api error')
        })
      return { response }
    }
    return { ...toRefs(state), axiosTest }
  },
})
</script>
<style scoped></style>
