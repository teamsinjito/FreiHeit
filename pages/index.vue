<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
  >
    <!-- ヘッダー項目 -->
    <header-bar></header-bar>

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
        <v-tab v-for="month in months" :key="month.tab">
          <span class="text-caption font-weight-medium">{{ month.tab }}</span>
        </v-tab>
      </v-tabs>

      <!-- タブ内 -->
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="month in months" :key="month.tab">
          <v-container fluid>
            <!-- データテーブル -->
            <v-row>
              <v-col cols="12" sm="9">
                <v-data-table
                  :headers="headers"
                  :items="yyyChange(month.content)"
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
                      {{ items[0].day }}
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
                          >勘定科目：{{ item.subject }}
                        </span>
                        <br />
                        <span
                          class="font-weight-bold text-sm-caption"
                          style="font-size: 0.4rem"
                          >摘要：{{ item.note }}
                        </span>
                      </th>
                      <!-- 金額,編集アイコン -->
                      <th class="text-right pl-0">
                        <span
                          v-if="item.payFlg == 1"
                          color="info"
                          class="success--text text-sm-caption font-weight-bold"
                          style="font-size: 0.4rem"
                          >{{ item.pay.toLocaleString() }}
                        </span>
                        <span
                          v-else
                          class="error--text text-sm-caption font-weight-bold"
                          style="font-size: 0.4rem"
                          >{{ item.pay.toLocaleString() }}
                        </span>
                        <v-icon
                          small
                          style="font-size: 0.4rem"
                          class="ml-sm-3 text-sm-caption font-weight-bold"
                          @click="editItem(item)"
                        >
                          mdi-greater-than
                        </v-icon>
                      </th>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>

              <!-- 各月の集計表 -->
              <v-col cols="12" sm="3">
                <v-data-iterator
                  :items="yyyChange(month.content)"
                  hide-default-footer
                  hide-default-header
                  :single-expand="singleExpand"
                >
                  <template #default="{ items, isExpanded, expand }">
                    <v-card max-height="60vh" style="overflow: auto">
                      <v-card-title
                        class="text-caption font-weight-bold d-flex align-center py-0"
                      >
                        {{ month.tab }}：集計表
                        <v-switch
                          :input-value="isExpanded(items[0])"
                          class="pl-3"
                          @change="(v) => expand(items[0], v)"
                        ></v-switch>
                      </v-card-title>

                      <v-divider></v-divider>
                      <v-list v-if="isExpanded(items[0])" dense>
                        <v-col
                          v-for="h in headersContent"
                          :key="h.text"
                          cols="12"
                        >
                          <v-list-item>
                            <v-list-item-content class="text-caption"
                              >{{ h.text }}:</v-list-item-content
                            >
                            <v-list-item-content class="align-end">
                              {{ items[0].pay.toLocaleString() }}
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
import {
  onMounted,
  defineComponent,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
import HeaderBar from '~/components/index/HeaderBar.vue'

export default defineComponent({
  components: {
    HeaderBar,
  },
  setup() {
    const yyyChange = (m: string) => {
      return records.filter((record) => record.month.includes(m))
    }
    const tab = null
    const singleExpand = true
    const state = reactive<{
      itemPerPage: number
      page: number
      pageCount: number
    }>({
      itemPerPage: 10,
      page: 1,
      pageCount: 1,
    })
    const headers = [
      { text: 'data', value: 'subject', align: 'start' },
      { text: 'money', value: 'pay', align: 'right' },
    ]
    const records = [
      {
        tid: 1,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月28日',
        pay: 100000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 2,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月28日',
        pay: 100000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 3,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月23日',
        pay: 100000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 4,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月23日',
        pay: 100000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 5,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: -1,
        month: '202102',
      },
      {
        tid: 6,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: -1,
        month: '202102',
      },
      {
        tid: 7,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月23日',
        pay: 100000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 8,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月23日',
        pay: 100000,
        payFlg: -1,
        month: '202102',
      },
      {
        tid: 9,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: -1,
        month: '202102',
      },
      {
        tid: 10,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 11,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月23日',
        pay: 100000,
        payFlg: -1,
        month: '202102',
      },
      {
        tid: 12,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月23日',
        pay: 100000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 13,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 14,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 15,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: -1,
        month: '202102',
      },
      {
        tid: 16,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 17,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月23日',
        pay: 100000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 18,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月23日',
        pay: 100000,
        payFlg: -1,
        month: '202102',
      },
      {
        tid: 19,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: -1,
        month: '202102',
      },
      {
        tid: 20,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: -1,
        month: '202102',
      },
      {
        tid: 21,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: -1,
        month: '202102',
      },
      {
        tid: 22,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 23,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 24,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 25,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月23日',
        pay: 100000,
        payFlg: -1,
        month: '202102',
      },
      {
        tid: 26,
        subject: '通信費',
        note: 'インターネット経費',
        day: '2021年2月23日',
        pay: 100000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 27,
        subject: '通信費',
        note: 'インターネット経費2',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 28,
        subject: '通信費',
        note: 'インターネット経費24',
        day: '2021年2月23日',
        pay: 300000,
        payFlg: 1,
        month: '202102',
      },
      {
        tid: 29,
        subject: '通信費',
        note: 'インターネット経費2413',
        day: '2021年3月23日',
        pay: 300000,
        payFlg: 1,
        month: '202103',
      },
    ]
    const months = [
      { tab: '2021.01', content: '202101' },
      { tab: '2021.02', content: '202102' },
      { tab: '2021.03', content: '202103' },
      { tab: '2021.04', content: '202104' },
      { tab: '2021.05', content: '202105' },
      { tab: '2021.06', content: '202106' },
      { tab: '2021.07', content: '202107' },
      { tab: '2021.08', content: '202108' },
      { tab: '2021.09', content: '202109' },
      { tab: '2021.10', content: '202110' },
      { tab: '2021.11', content: '202111' },
      { tab: '2021.12', content: '202112' },
      { tab: '2021.All', content: '2021' },
    ]
    const headersContent = [
      { text: '取引日付', value: 'days' },
      { text: '摘要', value: 'mean' },
      { text: '売上', value: 'send' },
      { text: '雑収入等', value: 'about' },
      { text: '仕入', value: 'buy' },
      { text: '給料賃金', value: 'salary' },
      { text: '外注工費', value: 'client' },
      { text: '損害保険', value: 'crush' },
      { text: '地代家賃', value: 'house' },
      { text: '利子割引料', value: 'money' },
      { text: '租税公課', value: 'tax' },
      { text: '水道光熱費', value: 'water' },
      { text: '旅費交通費', value: 'trip' },
      { text: '通信費', value: 'connect' },
      { text: '修繕費', value: 'fix' },
      { text: '消耗品費', value: 'use' },
      { text: '車両燃料費', value: 'car' },
      { text: '交際費', value: 'meet' },
      { text: '福利厚生', value: 'service' },
      { text: '荷造運賃', value: 'carry' },
      { text: '広告宣伝費', value: 'senden' },
      { text: '減価償却費', value: 'genka' },
      { text: '貸倒金', value: 'notmoney' },
      { text: '雑費', value: 'other' },
    ]
    onMounted(() => {})
    return {
      ...toRefs(state),
      yyyChange,
      headers,
      records,
      months,
      tab,
      singleExpand,
      headersContent,
    }
  },
})
</script>
