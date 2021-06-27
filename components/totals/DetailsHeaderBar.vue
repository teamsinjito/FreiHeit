<template>
  <!-- ヘッダー項目 -->
  <v-toolbar flat>
    <v-toolbar-title class="text-sm-subtitle-1 text-caption font-weight-black">
      項目別明細表
    </v-toolbar-title>
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>
    <v-btn color="transparent text-sm-button" elevation="0" @click="print">
      <v-icon color="primary">mdi-cloud-print-outline</v-icon>
      <span class="d-none d-sm-flex primary--text ml-1">pdf出力</span>
    </v-btn>
  </v-toolbar>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { Details } from '@/composables/interface'
import pdfMake from 'pdfmake/build/pdfmake'
import '@/static/vfs_fonts.js'
import { TDocumentDefinitions } from 'pdfmake/interfaces'
export default defineComponent({
  props: {
    records: {
      type: Array,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    clients: {
      type: String,
      required: true,
    },
  },
  setup(props: { records: Details[]; subject: string; clients: string }) {
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
            columns: [
              { text: '項目別明細表', style: { color: 'black', fontSize: 10 } },
              {
                text: props.subject + '  ' + props.clients,
                style: { color: 'black', fontSize: 8, alignment: 'right' },
              },
            ],
          },

          {
            style: { color: 'black', fontSize: 8 },
            table: {
              headerRows: 1,
              widths: [
                '*',
                '*',
                '*',
                '*',
                '*',
                '*',
                '*',
                '*',
                '*',
                '*',
                '*',
                '*',
                '*',
                '*',
              ],
              body: [
                [
                  {
                    fillColor: '#e4effa',
                    text: '',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '1月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '2月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '3月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '4月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '5月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '6月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '7月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '8月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '9月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '10月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '11月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '12月',
                    color: '#000000',
                  },
                  {
                    fillColor: '#e4effa',
                    text: '',
                    color: '#000000',
                  },
                ],
              ],
            },
          },
        ],
        defaultStyle: {
          font: defaultStyle,
        },
      }
      props.records.forEach((e, index) => {
        let fillColorCode = '#ffffff'
        if (index === props.records.length - 1) {
          fillColorCode = '#FFFF00'
        } else if (index % 2 === 0) {
          fillColorCode = '#eeeeee'
        }

        docDefinition.content.forEach((d) => {
          d.table?.body.push(
            Object.values(e).map((v) => {
              return {
                text: v,
                fillColor: fillColorCode,
                color: '#000000',
              }
            })
          )
        })
      })
      // pdfMakeでのPDF出力
      pdfMake.createPdf(docDefinition as TDocumentDefinitions).download()
    }

    return { print }
  },
})
</script>
