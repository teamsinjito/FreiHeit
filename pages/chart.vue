<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
  >
    <!-- ヘッダー項目 -->
    <chart-header-bar></chart-header-bar>
    <v-divider></v-divider>
    <v-card flat rounded="0" class="mb-2 py-5">
      <v-card-text>
        <v-row>
          <v-expansion-panels v-model="panel" focusable multiple>
            <v-col cols="12" md="3">
              <v-expansion-panel :key="0">
                <v-expansion-panel-header color="primary" class="white--text">
                  期間設定
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pt-5">
                  <v-slider
                    v-model="sliderStart"
                    min="1"
                    max="12"
                    thumb-color="primary"
                    thumb-label="always"
                    thumb-size="30"
                    class="mt-5"
                    :rules="sliderStartRules"
                  >
                    <template #thumb-label="{ value }">
                      {{ value }}
                      <span style="font-size: 0.2rem">月</span>
                    </template>
                    <template #label>
                      <span class="text-caption font-weight-medium"
                        >開始月</span
                      >
                    </template>
                  </v-slider>
                  <v-slider
                    v-model="sliderEnd"
                    min="1"
                    max="12"
                    thumb-color="primary"
                    thumb-label="always"
                    thumb-size="30"
                    class="mt-5"
                    :rules="sliderEndRules"
                  >
                    <template #thumb-label="{ value }">
                      {{ value }}
                      <span style="font-size: 0.2rem">月</span>
                    </template>
                    <template #label>
                      <span class="text-caption font-weight-medium"
                        >終了月</span
                      >
                    </template>
                  </v-slider>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel :key="1">
                <v-expansion-panel-header color="primary" class="white--text">
                  項目設定
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pt-5">
                  <v-row>
                    <v-col cols="3" class="my-auto">
                      <span class="text-caption font-weight-medium">項目</span>
                    </v-col>
                    <v-col cols="9">
                      <v-select
                        v-model="selectSubject"
                        :items="subjectItems"
                        solo
                        dense
                        persistent-hint
                        class="mt-6"
                      >
                        <template #label>
                          <span class="text-caption">項目を選択</span>
                        </template>
                      </v-select>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-col>
            <v-col cols="12" md="9">
              <v-expansion-panel :key="2">
                <v-expansion-panel-header color="primary" class="white--text">
                  グラフ
                </v-expansion-panel-header>
                <v-expansion-panel-content id="chartPanel" class="pt-5">
                  <v-row v-if="chartShow">
                    <v-col cols="12" sm="12" md="6">
                      <bar-chart
                        :bar-data="barChartData"
                        :select-subject="selectSubject"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <pie-chart
                        :pie-data="pieChartData"
                        :select-subject="selectSubject"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-col>
          </v-expansion-panels>
        </v-row>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  computed,
  watch,
} from '@nuxtjs/composition-api'
import { useGlobalState } from '@/composables/useDefault'
import { barType, pieType } from '@/composables/useChart'

export default defineComponent({
  setup() {
    const state = reactive<{
      panel: number[]
      sliderStart: number
      sliderEnd: number
      selectSubject: string
      subjectItems: string[] | undefined
      barChartData: barType | undefined
      pieChartData: pieType | undefined
    }>({
      panel: [0, 1, 2],
      sliderStart: 1,
      sliderEnd: 12,
      selectSubject: '仕入',
      subjectItems: [],
      barChartData: undefined,
      pieChartData: undefined,
    })
    const sliderStartRules = [
      (val: number) =>
        val <= state.sliderEnd || '終了月より小さい値を選択してください',
    ]
    const sliderEndRules = [
      (val: number) =>
        val >= state.sliderStart || '終了月より大きい値を選択してください',
    ]
    const globalState = useGlobalState()

    const chartShow = computed(() => {
      if (state.barChartData !== undefined && state.barChartData !== undefined)
        return true
      else {
        return false
      }
    })

    const setSubjects = () => {
      const items = globalState.subjectsInfo.value.reduce(
        (ary: string[], g) => {
          ary.push(g.groupname)
          return ary
        },
        []
      )
      state.subjectItems = [...new Set(items)]
    }

    const getFilteringData = () => {
      // *********************************************************************
      // 対象データのみを使用するためにフィルタリング
      // *********************************************************************
      const shapingData = globalState.workRecordsManagement.value
        // 選択月フィルタリング
        .filter((val) => {
          const checkMonth = new Date(val.day.replace('-', '/')).getMonth() + 1
          return (
            checkMonth >= state.sliderStart && checkMonth <= state.sliderEnd
          )
        })
        // 選択項目フィルタリング
        .filter((val) => {
          // 選択要素情報
          const subjectIdInfos = globalState.subjectsInfo.value
            .filter((subjectInfo) => {
              return subjectInfo.groupname === state.selectSubject
            })
            .map((info) => {
              return info.id
            })
          return subjectIdInfos.includes(val.sid)
        })

      // *********************************************************************
      // チャートデータ作成用のデータ整形
      // *********************************************************************

      // 対象月(xxxx年-xx月)
      const targetMonth = Array.from(
        new Set(
          shapingData.map((data) => {
            // 「yyyy-mm-dd」型式の日付文字列「-dd」を削除
            return data.day.substring(0, 7)
          })
        )
      ).sort()

      // 対象取引先名or対象固定経費名
      const targetClientsAndCosts = Array.from(
        new Set(
          globalState.clientsAndCostsInfo.value
            .filter((info) => {
              const shapingDataInfoIdArray = Array.from(
                new Set(
                  shapingData.map((data) => {
                    return data.cid
                  })
                )
              )
              return shapingDataInfoIdArray.includes(info.id)
            })
            .map((val) => {
              return {
                id: val.id,
                name: val.name,
                color: val.color,
              }
            })
        )
      )

      // *********************************************************************
      // チャートデータ用のデータ整形
      // *********************************************************************
      const chartData = targetClientsAndCosts.map((item) => {
        const chartLabel = item.name

        const chartData = targetMonth.map((month) => {
          const shapingTargetData = shapingData.filter((data) => {
            return data.cid === item.id
          })
          const targetCost = shapingTargetData
            .filter((data) => {
              return data.day.substring(0, 7) === month
            })
            .map((val) => {
              return val.pay
            })
          const cost =
            targetCost.length > 0
              ? targetCost.reduce(
                  (pVal: number, cVal: number): number => pVal + cVal
                )
              : 0
          return cost
        })

        const chartBackgroundColor = item.color

        return {
          label: chartLabel,
          data: chartData,
          backgroundColor: chartBackgroundColor,
        }
      })

      const barChartData = {
        labels: targetMonth,
        datasets: chartData.concat(),
      }

      let allcost = 0
      chartData.forEach((data) => {
        data.data.forEach((val) => {
          allcost += Number(val)
        })
      })

      const pieChartData = {
        labels: chartData.map((data) => {
          return data.label
        }),
        datasets: [
          {
            backgroundColor: chartData.map((data) => {
              return data.backgroundColor
            }),
            data: chartData.map((data) => {
              const targetCost = data.data.reduce(
                (pVal, cVal) => Number(pVal) + Number(cVal)
              )
              return Math.round((targetCost / allcost) * 100 * 100) / 100
            }),
          },
        ],
      }

      // 作成したチャートデータをstateにセット
      state.barChartData = barChartData
      state.pieChartData = pieChartData
    }

    onMounted(() => {
      setSubjects()
      getFilteringData()
    })

    watch(
      () => {
        return {
          start: state.sliderStart,
          end: state.sliderEnd,
          subject: state.selectSubject,
        }
      },
      () => {
        getFilteringData()
      }
    )

    return {
      ...toRefs(state),
      sliderStartRules,
      sliderEndRules,
      chartShow,
      getFilteringData,
    }
  },
})
</script>
