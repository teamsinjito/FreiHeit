<template>
  <!-- ヘッダー項目 -->
  <v-toolbar flat>
    <v-toolbar-title class="text-sm-subtitle-1 text-caption font-weight-black"
      >取引管理</v-toolbar-title
    >
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>

    <!-- PDF出力ボタン -->

    <v-btn color="transparent text-sm-button" elevation="0" @click="print">
      <v-icon color="primary">mdi-cloud-print-outline</v-icon>
      <span class="d-none d-sm-flex primary--text ml-1">pdf出力</span>
    </v-btn>

    <!-- Newボタン ダイアログ -->

    <add-cash-dialog></add-cash-dialog>
  </v-toolbar>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive } from '@vue/composition-api'
import AddCashDialog from '@/components/index/AddCashDialog.vue'
import pdfMake from 'pdfmake/build/pdfmake'
import { TDocumentDefinitions } from 'pdfmake/interfaces'
import { useGlobalState } from '../../composables/useDefault'
import '@/static/vfs_fonts.js'
export default defineComponent({
  components: {
    AddCashDialog,
  },
  setup() {
    const state = reactive<{
      subjectList: {
        id: string
        name: string
        reqFlg: number
      }[]
      headerWidth: string[]
      headerArray1: { colSpan: number; rowSpan: number; text: string }[]
      headerArray2: { colSpan: number; text: string }[]
      headerArray3: { text: string }[]
    }>({
      headerWidth: [],
      subjectList: [
        {
          id: '',
          name: '',
          reqFlg: 0,
        },
      ],
      headerArray1: [
        {
          colSpan: 1,
          rowSpan: 3,
          text: '',
        },
      ],
      headerArray2: [
        {
          colSpan: 1,
          text: '',
        },
      ],
      headerArray3: [
        {
          text: '',
        },
      ],
    })
    const userState = useGlobalState()
    onMounted(() => {
      state.subjectList = makeSubjectList()
      pushRowHeader()
      console.log(state.subjectList)
    })

    // 勘定科目リスト作成
    const makeSubjectList = () => {
      const totals: { id: string; name: string; reqFlg: number }[] = []
      userState.subjectsInfo.value.forEach((element) => {
        // 月ごとにフィルター
        const a = userState.workRecordsManagement.value.filter((r) =>
          r.day
            .slice(0, 4)
            .includes(userState.currentSysYear.value.num.toString())
        )

        // 要素ごとにフィルター
        const f = a.filter((rec) => rec.sid.includes(element.id))

        // 要素の金額を全て合計する
        const sum = f.reduce((acc: number, record): number => {
          return acc + Number(record.pay)
        }, 0)

        if (sum !== 0 || element.requireflg === 1) {
          totals.push({
            id: element.id,
            name: element.name,
            reqFlg: element.requireflg,
          })
        }
      })
      return totals
    }

    const print = () => {
      pdfMake.fonts = {
        GenShin: {
          normal: 'GenShinGothic-Normal-Sub.ttf',
          bold: 'GenShinGothic-Normal-Sub.ttf',
          italics: 'GenShinGothic-Normal-Sub.ttf',
          bolditalics: 'GenShinGothic-Normal-Sub.ttf',
        },
      }

      const defaultStyle = 'GenShin'

      // PDF出力する内容の定義
      const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [20, 20, 20, 20],
        content: [
          {
            style: { color: 'black', fontSize: 7 },
            table: {
              headerRows: 3,
              widths: state.headerWidth,
              body: [
                state.headerArray1,
                state.headerArray2,
                state.headerArray3,
              ],
            },
          },
        ],
        defaultStyle: {
          font: defaultStyle,
          alignment: 'center',
        },
      }

      // pdfMakeでのPDF出力
      pdfMake.createPdf(docDefinition as TDocumentDefinitions).download()
    }

    const pushRowHeader = () => {
      const headerArray1: {
        colSpan: number
        rowSpan: number
        text: string
      }[] = []
      const headerArray2: {
        colSpan: number
        text: string
      }[] = []
      const headerArray3: { text: string }[] = []

      state.headerWidth.push('*')
      state.headerWidth.push('*')
      for (let index = 0; index < state.subjectList.length; index++) {
        state.headerWidth.push('*')
      }

      // rowHeader1===========================================
      headerArray1.push({
        colSpan: 1,
        rowSpan: 3,
        text: `\n ${userState.currentSysYear.value.num}年 \n 月日`,
      })
      headerArray1.push({
        colSpan: 1,
        rowSpan: 3,
        text: '\n摘要',
      })
      state.subjectList.forEach((subject, index) => {
        if (index < 4) {
          headerArray1.push({
            colSpan: 1,
            rowSpan: 3,
            text: `\n${subject.name}`,
          })
        }
      })
      headerArray1.push({
        colSpan: state.subjectList.length - 4,
        rowSpan: 1,
        text: '経費',
      })
      for (let index = 4; index < state.subjectList.length - 1; index++) {
        headerArray1.push({ colSpan: 0, rowSpan: 1, text: '' })
      }

      // rowHeader1===========================================

      // rowHeader2===========================================
      state.subjectList.forEach((subject) => {
        if (subject.reqFlg === 1) {
          headerArray2.push({ colSpan: 1, text: '' })
        }
      })
      headerArray2.push(
        { colSpan: 1, text: '' },
        { colSpan: 1, text: '' },
        { colSpan: state.subjectList.length - 8, text: 'その他経費' }
      )
      state.subjectList.forEach((subject, index) => {
        if (subject.reqFlg === 0 && index < state.subjectList.length - 1) {
          headerArray2.push({ colSpan: 0, text: '' })
        }
      })

      // rowHeader2===========================================

      // rowHeader3===========================================
      for (let index = 0; index < 5; index++) {
        headerArray3.push({ text: '' })
      }

      state.subjectList.forEach((subject, index) => {
        if (index > 2) {
          headerArray3.push({ text: subject.name })
        }
      })
      // rowHeader3===========================================

      state.headerArray1 = headerArray1
      state.headerArray2 = headerArray2
      state.headerArray3 = headerArray3
    }
    return { print }
  },
})
</script>
