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
            >帳簿出力</span
          >
        </v-card-title>
      </v-toolbar>
      <v-card-text>
        <v-container class="my-3">
          <v-card-subtitle class="px-0 mb-4"
            >出力する帳簿を選択してください。</v-card-subtitle
          >
          <v-row>
            <v-select :items="exportsLists" solo></v-select
          ></v-row> </v-container
      ></v-card-text>
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
    const exportsLists = ['法定帳簿（白色）', '項目別集計表', '項目別明細表']
    return { dialog, exportsLists }
  },
})
</script>
