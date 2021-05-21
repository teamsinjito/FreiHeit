<template>
  <!-- ヘッダー項目 -->
  <v-toolbar flat>
    <v-toolbar-title class="text-sm-subtitle-1 text-caption font-weight-black"
      >取引管理</v-toolbar-title
    >
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>

    <!-- エクスポートボタン ダイアログ -->

    <export-list-dialog></export-list-dialog>

    <!-- Newボタン ダイアログ -->

    <add-cash-dialog></add-cash-dialog>
  </v-toolbar>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import ExportListDialog from '@/components/index/ExportListDialog.vue'
import AddCashDialog from '@/components/index/AddCashDialog.vue'
export default defineComponent({
  components: {
    ExportListDialog,
    AddCashDialog,
  },
  setup() {},
})
</script>
