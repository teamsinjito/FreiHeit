<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on, attrs }">
      <v-btn
        color="transparent text-sm-button"
        elevation="0"
        v-bind="attrs"
        v-on="on"
        @click="createData()"
      >
        <v-icon color="primary">mdi-cloud-print-outline</v-icon>
        <span class="d-none d-sm-flex primary--text ml-1">pdf出力</span>
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
            <v-select
              v-model="defaultExportsLists"
              :items="exportsLists"
              solo
              disabled
            ></v-select
          ></v-row> </v-container
      ></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          キャンセル
        </v-btn>
        <v-btn color="blue darken-1" text @click="print"> 出力 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import pdfMake from 'pdfmake/build/pdfmake'
import { useGlobalState } from '../../composables/useDefault'
import {
  pdfRecord,
  pdfFormatRecord,
  pdfFormatCost,
  pdfFormatRecordList,
} from '../../composables/interface'
import '@/static/vfs_fonts.js'
export default defineComponent({
  setup() {
    const exportsLists = ['法定帳簿（白色）']
    const defaultExportsLists = '法定帳簿（白色）'
    const state = reactive<{
      dialog: boolean
      pdfFormatData: pdfFormatRecord[]
      pdfFormatDataCost: pdfFormatCost[]
      pdfFormatDataList: pdfFormatRecordList[]
      pdfSubjectTotalsPay: pdfRecord[]
      carryOver: number
      subjectPosList: number[]
      subjectList: {
        id: string
        name: string
        reqFlg: number
        payFlg: number
      }[]
      headerArray1: { colSpan: number; rowSpan: number; text: string }[]
      headerArray2: { colSpan: number; text: string }[]
      headerArray3: { text: string }[]
    }>({
      dialog: false,
      pdfFormatData: [],
      pdfFormatDataCost: [],
      pdfFormatDataList: [],
      pdfSubjectTotalsPay: [],
      carryOver: 0,
      subjectPosList: [],
      subjectList: [],
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
    // ヘッダー行生成
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
      // rowHeader1===========================================
      headerArray1.push({
        colSpan: 1,
        rowSpan: 3,
        text: `\n ${userState.currentSysYear.value.num} \n 月日`,
      })
      headerArray1.push({
        colSpan: 1,
        rowSpan: 3,
        text: '\n摘要',
      })
      state.subjectList.forEach((subject, index) => {
        if (index < 3) {
          headerArray1.push({
            colSpan: 1,
            rowSpan: 3,
            text: `\n${subject.name}`,
          })
        }
      })
      headerArray1.push({
        colSpan: state.subjectList.length - 3,
        rowSpan: 1,
        text: '経    費',
      })
      for (let index = 3; index < state.subjectList.length - 1; index++) {
        headerArray1.push({ colSpan: 0, rowSpan: 1, text: '' })
      }
      // rowHeader1===========================================

      // rowHeader2===========================================
      state.subjectList.forEach((subject) => {
        if (subject.reqFlg === 1) {
          headerArray2.push({ colSpan: 1, text: '' })
        }
      })
      headerArray2.push({ colSpan: 1, text: '' }, { colSpan: 1, text: '' })
      if (state.subjectList.length - 8 !== 0) {
        headerArray2.push({
          colSpan: state.subjectList.length - 8,
          text: 'そ の 他 経 費',
        })
      }

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

    // PDF作成
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
        pageMargins: [5, 20, 5, 20],
        footer: (currentPage: number, pageCount: number) => {
          return {
            fontSize: 8,
            text: currentPage.toString() + ' / ' + pageCount,
          }
        },
        content: [
          {
            style: { color: 'black', fontSize: 6 },
            table: {
              headerRows: 3,
              width: 'auto',
              body: [
                state.headerArray1,
                state.headerArray2,
                state.headerArray3,
              ],
              pageBreak: 'after',
            },
          },
        ],
        defaultStyle: {
          font: defaultStyle,
          alignment: 'center',
        },
      }

      const getFIllCode = (i: number) => {
        if (i % 2 === 0) {
          return '#ffffff'
        } else {
          return '#e4effa'
        }
      }

      // 月毎にループ
      state.pdfFormatDataList.forEach((s, idx) => {
        const lett: { text: string; fillColor: string }[] = []
        let fillColorCode = ''
        let rowNum = 0
        if (idx === 0) {
          const dummy: { text: string }[] = []
          dummy.push({ text: '' })
          dummy.push({ text: '' })
          for (let index = 0; index < state.subjectList.length; index++) {
            dummy.push({ text: '' })
          }
          docDefinition.content.forEach((d) => {
            d.table?.body.push(
              dummy.map((v) => {
                return { text: v.text }
              })
            )
          })
        }
        if (idx !== state.pdfFormatDataList.length - 1) {
          // 日毎
          state.pdfFormatDataList[idx].list.forEach((li) => {
            fillColorCode = getFIllCode(rowNum)
            lett.push({ text: li.dayFormat, fillColor: fillColorCode })
            lett.push({ text: li.cName, fillColor: fillColorCode })
            for (let index = 0; index < state.subjectList.length; index++) {
              const pay = li.nomalPays
                .filter((l) => l.position === index)
                .map((k) => {
                  return { f: k.pay }
                })[0]
              if (pay !== undefined) {
                lett.push({
                  text: pay.f.toLocaleString(),
                  fillColor: fillColorCode,
                })
              } else {
                lett.push({ text: '', fillColor: fillColorCode })
              }
            }
            docDefinition.content.forEach((d) => {
              d.table?.body.push(
                lett.map((v) => {
                  return { text: v.text, fillColor: v.fillColor }
                })
              )
            })
            lett.splice(0)
            rowNum++
          })
          const zan = 20 - state.pdfFormatDataList[idx].list.length
          if (zan > 0) {
            for (let index = 0; index < zan; index++) {
              fillColorCode = getFIllCode(rowNum)
              lett.push({ text: '\n', fillColor: fillColorCode })
              lett.push({ text: '\n', fillColor: fillColorCode })
              // 空白行
              state.subjectList.forEach(() => {
                lett.push({ text: '\n', fillColor: fillColorCode })
              })
              docDefinition.content.forEach((d) => {
                d.table?.body.push(
                  lett.map((v) => {
                    return { text: v.text, fillColor: v.fillColor }
                  })
                )
              })
              lett.splice(0)
              rowNum++
            }
          } else {
            // 2行空白追加
            for (let index = 0; index < 2; index++) {
              fillColorCode = getFIllCode(rowNum)
              lett.push({ text: '\n', fillColor: fillColorCode })
              lett.push({ text: '\n', fillColor: fillColorCode })
              // 空白行
              state.subjectList.forEach(() => {
                lett.push({ text: '\n', fillColor: fillColorCode })
              })

              docDefinition.content.forEach((d) => {
                d.table?.body.push(
                  lett.map((v) => {
                    return { text: v.text, fillColor: v.fillColor }
                  })
                )
              })

              lett.splice(0)
              rowNum++
            }
          }

          // 固定経費
          state.pdfFormatDataList[idx].costList.forEach((li) => {
            fillColorCode = getFIllCode(rowNum)
            lett.push({ text: '', fillColor: fillColorCode })
            lett.push({ text: li.cName, fillColor: fillColorCode })
            for (let index = 0; index < state.subjectList.length; index++) {
              const pay = li.costPays
                .filter((l) => l.position === index)
                .map((k) => {
                  return { f: k.pay }
                })[0]
              if (pay !== undefined) {
                lett.push({
                  text: pay.f.toLocaleString(),
                  fillColor: fillColorCode,
                })
              } else {
                lett.push({ text: '', fillColor: fillColorCode })
              }
            }
            docDefinition.content.forEach((d) => {
              d.table?.body.push(
                lett.map((v) => {
                  return { text: v.text, fillColor: v.fillColor }
                })
              )
            })
            lett.splice(0)
            rowNum++
          })
          fillColorCode = getFIllCode(rowNum)
          // 合計
          lett.push({ text: '', fillColor: fillColorCode })
          lett.push({ text: s.month + '月計', fillColor: fillColorCode })
          state.pdfFormatDataList[idx].total.forEach((li) => {
            lett.push({
              text: li.pay.toLocaleString(),
              fillColor: fillColorCode,
            })
          })
          docDefinition.content.forEach((d) => {
            d.table?.body.push(
              lett.map((v) => {
                return { text: v.text, fillColor: v.fillColor }
              })
            )
          })
          lett.splice(0)
          rowNum++

          fillColorCode = getFIllCode(rowNum)
          // 繰り越し
          lett.push({ text: '', fillColor: fillColorCode })
          lett.push({ text: '繰り越し', fillColor: fillColorCode })
          lett.push({
            text: '¥' + state.pdfFormatDataList[idx].carryOver.toLocaleString(),
            fillColor: fillColorCode,
          })
          for (let index = 0; index < state.subjectList.length - 1; index++) {
            lett.push({ text: '', fillColor: fillColorCode })
          }
          docDefinition.content.forEach((d) => {
            d.table?.body.push(
              lett.map((v) => {
                return {
                  text: v.text,
                  border: [true, false, true, false],
                  pageBreak: 'after',
                }
              })
            )
          })
          lett.splice(0)
          rowNum++
        } else {
          fillColorCode = getFIllCode(rowNum)
          // 合計
          lett.push({ text: '', fillColor: fillColorCode })
          lett.push({
            text: userState.currentSysYear.value.num + '年度集計',
            fillColor: fillColorCode,
          })
          state.pdfFormatDataList[idx].total.forEach((li) => {
            lett.push({
              text: li.pay.toLocaleString(),
              fillColor: fillColorCode,
            })
          })
          docDefinition.content.forEach((d) => {
            d.table?.body.push(
              lett.map((v) => {
                return { text: v.text, fillColor: v.fillColor }
              })
            )
          })
          lett.splice(0)
          rowNum++
          fillColorCode = getFIllCode(rowNum)
          // 繰り越し
          lett.push({ text: '', fillColor: fillColorCode })
          lett.push({ text: '繰り越し', fillColor: fillColorCode })
          lett.push({
            text: '¥' + state.pdfFormatDataList[idx].carryOver.toLocaleString(),
            fillColor: fillColorCode,
          })
          for (let index = 0; index < state.subjectList.length - 1; index++) {
            lett.push({ text: '', fillColor: fillColorCode })
          }
          docDefinition.content.forEach((d) => {
            d.table?.body.push(
              lett.map((v) => {
                return {
                  text: v.text,
                }
              })
            )
          })
          lett.splice(0)
          rowNum++
        }
      })

      // pdfMakeでのPDF出力
      pdfMake.createPdf(docDefinition as any).download()
      userState.snackBarDisplay('PDFの出力が完了しました', '')

      state.pdfFormatDataList = []
      state.dialog = false
    }
    const filterItemWithMonth = () => {
      return userState.workRecordsManagement.value.filter((r) =>
        r.day
          .slice(0, 4)
          .includes(userState.currentSysYear.value.num.toString())
      )
    }

    // 勘定科目リスト作成
    const makeSubjectList = () => {
      const totals: {
        id: string
        name: string
        reqFlg: number
        payFlg: number
      }[] = []
      // 今年度のデータをフィルター
      const a = filterItemWithMonth()
      userState.subjectsInfo.value.forEach((element) => {
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
            payFlg: element.payflg,
          })
        }
      })
      return totals
    }

    // 固定経費リスト作成
    const makeCostList = () => {
      const totals: {
        id: string
        name: string
      }[] = []
      // 今年度のデータをフィルター
      const a = filterItemWithMonth()
      userState.clientsAndCostsInfo.value.forEach((element) => {
        if (element.iflg === 2) {
          // 要素ごとにフィルター
          const l = a.filter((rec) => rec.cid === element.id).length
          if (l > 0) {
            totals.push({ id: element.id, name: element.name })
          }
        }
      })
      return totals
    }

    // データ整形
    const createData = () => {
      state.subjectList = makeSubjectList()
      // PDFヘッダー生成
      pushRowHeader()

      const costsList = makeCostList()

      // 月毎ループ
      userState.tabsInfo.value.forEach((t) => {
        // 月単位でレコードを収集
        const dataByMonth = userState.workRecordsManagement.value.filter((r) =>
          (r.day.slice(0, 4) + r.day.slice(5, 7)).includes(
            userState.currentSysYear.value.num.toString() + t.content
          )
        )
        costsList.forEach((c) => {
          state.pdfFormatDataCost.push({
            cid: c.id,
            cName: c.name,
            costPays: [],
          })
        })
        dataByMonth.forEach((data) => {
          // SubjectsList 連携
          const datasSubject = state.subjectList
            .filter((s) => s.id === data.sid)
            .map(() => {
              // 添字取得
              const index = state.subjectList.findIndex(
                (o) => o.id === data.sid
              )
              return {
                position: index,
              }
            })[0]
          // ClientsAndCostsInfo 連携
          const datasCosts = userState.clientsAndCostsInfo.value
            .filter((c) => c.id === data.cid)
            .map((i) => {
              return {
                cName: i.name,
                itemFlg: i.iflg,
              }
            })[0]

          // 固定経費の場合
          if (datasCosts.itemFlg === 2) {
            // PDFフォーマットに沿って格納
            state.pdfFormatDataCost.forEach((c) => {
              if (c.cid === data.cid) {
                if (
                  c.costPays.filter(
                    (costpay) => costpay.position === datasSubject.position
                  ).length > 0
                ) {
                  c.costPays.forEach((e) => {
                    if (e.position === datasSubject.position) {
                      e.pay = e.pay + data.pay
                    }
                  })
                } else {
                  const p = data.pay
                  const pos = datasSubject.position
                  c.costPays.push({ position: pos, pay: p })
                }
              }
            })
          } else if (
            state.pdfFormatData.filter((i) => i.day === data.day).length > 0
          ) {
            // 同日のレコードがある場合
            state.pdfFormatData.forEach((d) => {
              if (d.day === data.day) {
                const nameList = d.cName.split('・')
                // 同名の取引先および固定経費がレコードに存在しない場合、名前を結合
                if (
                  nameList.filter((l) => l === datasCosts.cName).length === 0
                ) {
                  d.cName = d.cName + '・' + datasCosts.cName
                }
                // 同じ勘定科目が使われていた場合、金額を合算
                if (
                  d.nomalPays.filter(
                    (dcost) => dcost.position === datasSubject.position
                  ).length > 0
                ) {
                  d.nomalPays.forEach((e) => {
                    if (e.position === datasSubject.position) {
                      e.pay = e.pay + data.pay
                    }
                  })
                } else {
                  const p = data.pay
                  const pos = datasSubject.position
                  d.nomalPays.push({ position: pos, pay: p })
                }
              }
            })
          } else {
            // PDFフォーマットに沿って格納
            state.pdfFormatData.unshift({
              day: data.day,
              dayFormat:
                Number(data.day.slice(5, 7)).toString() +
                '/' +
                Number(data.day.slice(8, 10)).toString(),
              cName: datasCosts.cName,
              nomalPays: [
                {
                  position: datasSubject.position,
                  pay: data.pay,
                },
              ],
            })
          }
        })

        // 合計金額および繰越金取得
        state.subjectList.forEach((s, index) => {
          const sj = dataByMonth.filter((d) => d.sid === s.id)
          const sum = sj.reduce((acc: number, record): number => {
            return acc + Number(record.pay)
          }, 0)
          state.pdfSubjectTotalsPay.push({ position: index, pay: sum })
          state.carryOver = state.carryOver + sum * s.payFlg
        })
        // 整形した各月の取引をトータルリストに保存
        state.pdfFormatDataList.push({
          month: Number(t.content),
          list: state.pdfFormatData,
          costList: state.pdfFormatDataCost,
          total: state.pdfSubjectTotalsPay,
          carryOver: state.carryOver,
        })
        // 格納後初期化
        state.pdfFormatData = []
        state.pdfFormatDataCost = []
        state.pdfSubjectTotalsPay = []
        state.carryOver = 0
        state.pdfFormatDataCost.forEach((c) => {
          c.costPays = []
        })
      })
    }
    return {
      ...toRefs(state),
      print,
      createData,
      exportsLists,
      defaultExportsLists,
    }
  },
})
</script>
