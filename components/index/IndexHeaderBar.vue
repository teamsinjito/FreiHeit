<template>
  <!-- ヘッダー項目 -->
  <v-toolbar flat>
    <v-toolbar-title class="text-sm-subtitle-1 text-caption font-weight-black"
      >取引管理</v-toolbar-title
    >
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>

    <!-- PDF出力ボタン -->
    <export-list-dialog></export-list-dialog>
    <!-- Newボタン ダイアログ -->
    <add-cash-dialog></add-cash-dialog>
  </v-toolbar>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import AddCashDialog from '@/components/index/AddCashDialog.vue'
import ExportListDialog from '@/components/index/ExportListDialog.vue'
export default defineComponent({
  components: {
    AddCashDialog,
    ExportListDialog,
  },
  setup() {},
})
</script>
