<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on, attrs }">
      <v-btn
        color="transparent text-sm-button"
        elevation="0"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon color="primary">mdi-cloud-download-outline</v-icon>
        <span class="d-none d-sm-flex primary--text ml-1">Export</span>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar color="primary" flat>
        <v-card-title>
          <span class="white--text text-subtitle-1 font-weight-black"
            >収支レポート出力</span
          >
        </v-card-title>
      </v-toolbar>
      <v-card-text>
        <v-container class="my-3">
          <v-card-subtitle class="px-0 mb-4"
            >出力する帳簿を選択してください。（※選択済み）</v-card-subtitle
          >
          <v-row>
            <v-select
              label="レポート（売上、仕入、経費）"
              solo
              disabled
            ></v-select></v-row
        ></v-container>
        <small>
          <v-checkbox v-model="checkbox">
            <template #label>
              <span class="text-caption font-weight-bold"
                >金額が多い上位4項目以外は「その他」としてまとめて出力する</span
              >
            </template>
          </v-checkbox></small
        ></v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          キャンセル
        </v-btn>
        <v-btn color="blue darken-1" text @click="dialog = false"> 出力 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const dialog = false
    const checkbox = true
    return { dialog, checkbox }
  },
})
</script>
