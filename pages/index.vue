<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
  >
    <!-- ヘッダー項目 -->
    <index-header-bar></index-header-bar>

    <v-card flat rounded="0" class="mb-2">
      <!-- タブ項目一覧 -->
      <v-tabs
        v-model="tab"
        background-color="primary"
        show-arrows
        grow
        centered
        center-active
        height="50"
        dark
      >
        <v-tab v-for="month in userState.tabsInfo.value" :key="month.tab">
          <span class="text-caption font-weight-medium">{{
            userState.currentSysYear.value.num + month.tab
          }}</span>
        </v-tab>
      </v-tabs>

      <!-- タブ内 -->
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="month in userState.tabsInfo.value" :key="month.tab">
          <v-container fluid>
            <!-- データテーブル -->
            <v-row>
              <v-col cols="12" sm="9">
                <v-data-table
                  :headers="headers"
                  :items="
                    filterItemWithMonth(
                      userState.currentSysYear.value.num + month.content
                    )
                  "
                  group-by="day"
                  class="elevation-1"
                  sort-by="subject"
                  disable-sort
                  :items-per-page="100"
                  hide-default-header
                  hide-default-footer
                  style="overflow: auto; max-height: 60vh"
                >
                  <!-- グループヘッダー -->
                  <template #[`group.header`]="{ items, isOpen, toggle }">
                    <th colspan="2">
                      <v-icon @click="toggle"
                        >{{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                      </v-icon>
                      {{
                        items[0].day.slice(0, 4) +
                        '年' +
                        items[0].day.slice(5, 7) +
                        '月' +
                        items[0].day.slice(8, 10) +
                        '日'
                      }}
                    </th>
                  </template>

                  <!-- レコード -->
                  <template #[`item`]="{ item }">
                    <tr>
                      <!-- 勘定科目、摘要 -->
                      <th>
                        <span
                          class="font-weight-bold text-sm-caption"
                          style="font-size: 0.4rem"
                          >勘定科目：{{ getSubjectName(item.sid) }}
                        </span>
                        <br />
                        <span
                          class="font-weight-bold text-sm-caption"
                          style="font-size: 0.4rem"
                          >取引内訳：{{ getClientAndCostName(item.cid) }}
                        </span>
                      </th>
                      <!-- 金額,編集アイコン -->
                      <th class="text-right pl-0">
                        <span
                          class="text-sm-caption font-weight-bold"
                          style="font-size: 0.4rem"
                          >{{ Number(item.pay).toLocaleString() }} 円
                        </span>
                        <update-cash-dialog
                          :default-record="item"
                        ></update-cash-dialog>
                      </th>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>

              <!-- 各月の集計表 -->
              <v-col cols="12" sm="3">
                <v-data-iterator
                  :items="
                    filterAndMergeItemWithMonth(
                      userState.currentSysYear.value.num + month.content
                    )
                  "
                  hide-default-footer
                  hide-default-header
                  :single-expand="singleExpand"
                  :items-per-page="100"
                >
                  <template #default="{ items }">
                    <v-card max-height="60vh" style="overflow: auto">
                      <v-card-title
                        class="text-caption font-weight-bold d-flex align-center py-0"
                      >
                        {{
                          userState.currentSysYear.value.num + month.tab
                        }}：集計表
                        <v-spacer></v-spacer>
                        <v-switch v-model="switchFlg" class="pl-3"></v-switch>
                      </v-card-title>

                      <v-divider></v-divider>
                      <v-list v-if="switchFlg === true" dense>
                        <v-col
                          v-for="total in items"
                          :key="total.name"
                          cols="12"
                          class="py-0"
                        >
                          <v-divider
                            v-if="total.name === carryOverName"
                          ></v-divider>
                          <v-list-item>
                            <v-list-item-content
                              class="text-caption font-weight-bold"
                              style="font-size: 0.8rem"
                              >{{ total.name }}:</v-list-item-content
                            >
                            <v-list-item-content
                              v-if="
                                total.pay > 0 && total.name === carryOverName
                              "
                              class="align-end font-weight-bold success--text"
                              style="font-size: 0.8rem"
                            >
                              {{ total.pay.toLocaleString() }} 円
                            </v-list-item-content>
                            <v-list-item-content
                              v-else-if="
                                total.pay < 0 && total.name === carryOverName
                              "
                              class="align-end font-weight-bold error--text"
                              style="font-size: 0.8rem"
                            >
                              {{ total.pay.toLocaleString() }} 円
                            </v-list-item-content>
                            <v-list-item-content
                              v-else
                              class="align-end font-weight-bold"
                              style="font-size: 0.8rem"
                            >
                              {{ total.pay.toLocaleString() }} 円
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                      </v-list>
                    </v-card>
                  </template>
                </v-data-iterator>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'
import { useGlobalState } from '../composables/useDefault'
import UpdateCashDialog from '~/components/index/UpdateCashDialog.vue'
import IndexHeaderBar from '~/components/index/IndexHeaderBar.vue'

export default defineComponent({
  components: { UpdateCashDialog, IndexHeaderBar },

  setup() {
    const userState = useGlobalState()
    const carryOverName = '繰越金'
    const state = reactive<{
      tab: string
      singleExpand: boolean
      subjectList: {
        id: string
        name: string
        pay: number
      }[]
      carryOver: number
      switchFlg: boolean
    }>({
      tab: '',
      singleExpand: true,
      subjectList: [
        {
          id: '',
          name: '',
          pay: 0,
        },
      ],
      carryOver: 0,
      switchFlg: true,
    })
    const headers = [
      { text: 'data', value: 'subject', align: 'start' },
      { text: 'money', value: 'pay', align: 'right' },
    ]
    const getSubjectName = (m: string) => {
      return userState.subjectsInfo.value.filter((s) => s.id === m)[0].name
    }
    const getClientAndCostName = (m: string) => {
      return userState.clientsAndCostsInfo.value.filter((s) => s.id === m)[0]
        .name
    }
    const filterItemWithMonth = (m: string) => {
      return userState.workRecordsManagement.value.filter((r) =>
        (r.day.slice(0, 4) + r.day.slice(5, 7)).includes(m)
      )
    }

    const filterAndMergeItemWithMonth = (m: string) => {
      const totals: { name: string; pay: number }[] = []
      let carryOver: number = 0
      userState.subjectsInfo.value.forEach((element) => {
        // 月ごとにフィルター
        const a = filterItemWithMonth(m)

        // 要素ごとにフィルター
        const f = a.filter((rec) => rec.sid.includes(element.id))

        // 要素の金額を全て合計する
        const sum = f.reduce((acc: number, record): number => {
          return acc + Number(record.pay)
        }, 0)

        if (sum !== 0 || element.requireflg === 1) {
          totals.push({ name: element.name, pay: sum })
          carryOver = carryOver + sum * element.payflg
        }
      })
      totals.push({ name: carryOverName, pay: carryOver })

      return totals
    }

    return {
      ...toRefs(state),
      carryOverName,
      headers,
      getSubjectName,
      getClientAndCostName,
      userState,
      filterItemWithMonth,
      filterAndMergeItemWithMonth,
    }
  },
})
</script>
