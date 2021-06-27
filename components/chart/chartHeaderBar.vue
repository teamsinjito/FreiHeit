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
import { useGlobalState } from '@/composables/useDefault'
import html2canvas from 'html2canvas'
import pdfMake from 'pdfmake/build/pdfmake'
export default defineComponent({
  setup() {
    const globalState = useGlobalState()
    const print = () => {
      // スクロールを禁止にする関数
      const disableScroll = (event) => {
        event.preventDefault()
      }

      // オーバーレイ表示
      globalState.overlayText.value = 'pdf出力中...'
      globalState.overlayShow.value = true

      // イベント設定
      document.addEventListener('touchmove', disableScroll, { passive: false })
      document.addEventListener('mousewheel', disableScroll, { passive: false })

      html2canvas(document.getElementById('barChart'))
        .then((barCanvas) => {
          html2canvas(document.getElementById('pieChart')).then((pieCanvas) => {
            // PDF出力する内容の定義
            const docDefinition = {
              pageSize: 'A4',
              pageOrientation: 'landscape',
              content: [
                {
                  columns: [
                    {
                      image: barCanvas.toDataURL(),
                      fit: [350, 350],
                    },
                    {
                      image: pieCanvas.toDataURL(),
                      fit: [350, 350],
                    },
                  ],
                  columnGap: 0,
                },
              ],
            }

            // PDF出力
            pdfMake.createPdf(docDefinition).download()
          })
        })
        .finally(() => {
          // オーバーレイ非表示
          globalState.overlayShow.value = false

          // イベント破棄
          document.removeEventListener('touchmove', disableScroll, {
            passive: false,
          })
          document.removeEventListener('mousewheel', disableScroll, {
            passive: false,
          })
        })
    }

    return { print }
  },
})
</script>
