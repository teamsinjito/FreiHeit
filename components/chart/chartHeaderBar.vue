<template>
  <!-- ヘッダー項目 -->
  <v-toolbar flat>
    <v-toolbar-title class="text-sm-subtitle-1 text-caption font-weight-black">
      収支レポート
    </v-toolbar-title>
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>
    <v-btn color="transparent text-sm-button" elevation="0" @click="print">
      <v-icon color="primary">mdi-cloud-print-outline</v-icon>
      <span class="d-none d-sm-flex primary--text ml-1">pdf出力</span>
    </v-btn>
  </v-toolbar>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
// import { printPdf } from '@/composables/useChart'
import { useGlobalState } from '@/composables/useDefault'
import JsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default defineComponent({
  setup() {
    const globalState = useGlobalState()
    const print = () => {
      globalState.overlayText.value = 'pdf出力中...'
      globalState.overlayShow.value = true
      // printPdf()

      html2canvas(document.getElementById('chartPanel')).then((canvas) => {
        // jspdfの初期化
        const pdf = new JsPDF('l', 'px', 'a4')
        const width = pdf.internal.pageSize.width
        const height = pdf.internal.pageSize.height

        // html2canvasで取得した要素をPDFに追加する処理
        const dataURI = canvas.toDataURL()
        pdf.addImage(dataURI, 'JPEG', 0, 0, width, height)

        // JsPDFでのPDF保存
        pdf.save('sample.pdf')
      })

      globalState.overlayShow.value = false
    }

    return { print }
  },
})
</script>
