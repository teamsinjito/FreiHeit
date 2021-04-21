<template>
  <!-- ヘッダー項目 -->
  <v-toolbar flat>
    <v-toolbar-title class="text-sm-subtitle-1 text-caption font-weight-black"
      >収支レポート</v-toolbar-title
    >
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>

    <!-- エクスポートボタン ダイアログ -->
    <export-report-dialog></export-report-dialog>
  </v-toolbar>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import ExportReportDialog from '@/components/inspire/ExportReportDialog.vue'
export default defineComponent({
  components: {
    ExportReportDialog,
  },
  setup() {},
})
</script>
