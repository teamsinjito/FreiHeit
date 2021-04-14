<template>
  <v-sheet color="white" outlined elevation="3" height="100%">
    <v-banner>
      <v-icon slot="icon" color="success">mdi-animation</v-icon>
      <span class="font-weight-bold text-sm-h6">法定帳簿</span>
      <template #actions>
        <v-col cols="6" sm="3">
          <v-select
            class="text-sm-h5 pt-2"
            item-value="Foo"
            label="対象年度を選択"
          ></v-select>
        </v-col>
        <v-btn color="success" class="text-button" outlined>
          エクスポート
          <v-icon light>mdi-menu-down</v-icon>
        </v-btn>
      </template>
    </v-banner>
    <v-data-table
      :headers="headers"
      dense
      disable-filtering
      items-per-page="-1"
      disable-sort
      hide-actions
      :items="item"
      hide-default-footer
      class="elevation-1 ma-1 overflow-y-auto"
      style="height: 100%"
    >
      <template #[`item.mean`]="{ item }">
        <span class="text-caption">
          {{ item.mean }}
        </span>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  setup() {
    const headers = [
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
    ]
    const item = [
      {
        days: '31日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '4日',
        mean: 'インターネット経費',
        buy: 100000,
      },
      {
        days: '5日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '6日',
        mean: 'アマゾン材料',
        send: 100000,
      },
      {
        days: '31日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '4日',
        mean: 'インターネット経費',
        buy: 100000,
      },
      {
        days: '5日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '6日',
        mean: 'アマゾン材料',
        send: 100000,
      },
      {
        days: '31日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '4日',
        mean: 'インターネット経費',
        buy: 100000,
      },
      {
        days: '5日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '6日',
        mean: 'アマゾン材料',
        send: 100000,
      },
      {
        days: '31日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '4日',
        mean: 'インターネット経費',
        buy: 100000,
      },
      {
        days: '5日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '6日',
        mean: 'アマゾン材料',
        send: 100000,
      },
      {
        days: '31日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '4日',
        mean: 'インターネット経費',
        buy: 100000,
      },
      {
        days: '5日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '6日',
        mean: 'アマゾン材料',
        send: 100000,
      },
      {
        days: '31日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '4日',
        mean: 'インターネット経費',
        buy: 100000,
      },
      {
        days: '5日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '6日',
        mean: 'アマゾン材料',
        send: 100000,
      },
      {
        days: '31日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '4日',
        mean: 'インターネット経費',
        buy: 100000,
      },
      {
        days: '5日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '6日',
        mean: 'アマゾン材料',
        send: 100000,
      },
      {
        days: '31日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '4日',
        mean: 'インターネット経費',
        buy: 100000,
      },
      {
        days: '5日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '6日',
        mean: 'アマゾン材料',
        send: 100000,
      },
      {
        days: '31日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '4日',
        mean: 'インターネット経費',
        buy: 100000,
      },
      {
        days: '5日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '6日',
        mean: 'アマゾン材料',
        send: 100000,
      },
      {
        days: '31日',
        mean: 'アマゾン材料',
        buy: 100000,
      },
      {
        days: '4日',
        mean: 'インターネット経費',
        buy: 100000,
      },
      {
        days: '5日',
        mean: 'アeマゾン材料',
        buy: 100000,
      },
      {
        days: '6日',
        mean: 'アrマゾン材料',
        send: 100000,
      },
    ]
    return {
      headers,
      item,
    }
  },
})
</script>
<style>
.v-data-table-header {
  background: #484848;
}
.v-data-table-header span {
  color: white;
}
.v-data-table tr:nth-child(odd) td {
  background: #e1eedc;
}
</style>
