<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
    ><totals-header-bar
      :records="records"
      :subject="selectSubject"
    ></totals-header-bar
    ><v-divider></v-divider>
    <v-card flat rounded="0" class="mb-2 py-5">
      <v-row class="px-2">
        <v-col offset-sm="8" sm="2">
          <v-checkbox
            v-model="otherCheck"
            hide-details
            class="mt-6 ml-1"
            :disabled="records.length < 6"
            @change="recordsSet"
          >
            <template #label>
              <span class="text-caption">その他で纏める</span>
            </template>
          </v-checkbox>
        </v-col>
        <v-col sm="2">
          <v-select
            v-model="selectSubject"
            :items="subjectItems"
            dense
            class="mt-6 text-caption"
            @change="changeSubject()"
          >
            <template #label>
              <span class="text-caption">項目を選択</span>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <vue-good-table
        :columns="columns"
        :rows="records"
        style-class="vgt-table striped bordered condensed"
        class="text-caption mx-3 w-100"
        style="font-size: 0.8rem"
      />
    </v-card>
  </v-sheet>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
} from '@vue/composition-api'
import { useGlobalState } from '@/composables/useDefault'
import { Totals } from '@/composables/interface'
import TotalsHeaderBar from '@/components/totals/TotalsHeaderBar.vue'

export default defineComponent({
  components: { TotalsHeaderBar },
  setup() {
    const useState = useGlobalState()
    const state = reactive<{
      selectSubject: string
      subjectItems: string[]
      records: Totals[]
      defaultRecords: Totals[]
      otherRecords: Totals[]
      otherCheck: boolean
    }>({
      selectSubject: '仕入',
      subjectItems: [],
      records: [
        {
          cName: '',
          jan: '0',
          feb: '0',
          mar: '0',
          apr: '0',
          may: '0',
          jun: '0',
          jul: '0',
          aug: '0',
          sep: '0',
          oct: '0',
          nov: '0',
          dec: '0',
          sum: '0',
        },
      ],
      defaultRecords: [],
      otherRecords: [],
      otherCheck: false,
    })

    const columns = [
      {
        label: '',
        field: 'cName',
        type: 'string',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '1月',
        field: 'jan',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '2月',
        field: 'feb',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '3月',
        field: 'mar',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '4月',
        field: 'apr',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '5月',
        field: 'may',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '6月',
        field: 'jun',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '7月',
        field: 'jul',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '8月',
        field: 'aug',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '9月',
        field: 'sep',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '10月',
        field: 'oct',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '11月',
        field: 'nov',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '12月',
        field: 'dec',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
      {
        label: '合計',
        field: 'sum',
        type: 'string',
        thClass: 'text-subtitle-2 text-center',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
    ]

    onMounted(() => {
      // 勘定科目セット、金額算出処理を呼び出し
      setSubjects()
      getFilteringData()
    })

    /**
     *
     * 勘定科目変更時用イベント
     *
     */
    const changeSubject = () => {
      getFilteringData()
    }

    /**
     *
     * 勘定科目をstateにセットする
     *
     */
    const setSubjects = () => {
      const items = useState.subjectsInfo.value.reduce((ary: string[], g) => {
        ary.push(g.groupname)
        return ary
      }, [])
      state.subjectItems = [...new Set(items)]
    }

    /**
     *
     * チェックボックスの状態に応じてテーブルに表示するデータをセットする
     *
     */
    const recordsSet = () => {
      state.records = state.otherCheck
        ? state.otherRecords
        : state.defaultRecords
    }

    /**
     *
     * テーブル用のデータを作成しstateにセットする
     *
     */
    const getFilteringData = () => {
      // ********************************************************************
      // 整形前準備処理
      // ********************************************************************

      // 月毎の合計金額算出用の関数を定義
      const sumPerMonth = (
        list: { pay: number; month: number }[],
        month: number
      ) => {
        return list
          .filter((r) => r.month === month)
          .reduce((sum: number, r) => {
            return sum + r.pay
          }, 0)
          .toLocaleString()
      }

      const otherArray = {
        cName: 'その他',
        jan: '0',
        feb: '0',
        mar: '0',
        apr: '0',
        may: '0',
        jun: '0',
        jul: '0',
        aug: '0',
        sep: '0',
        oct: '0',
        nov: '0',
        dec: '0',
        sum: '0',
      }

      // stateを初期化
      state.defaultRecords.splice(0, state.defaultRecords.length)
      state.otherRecords.splice(0, state.otherRecords.length)
      state.otherCheck = false

      // 選択している勘定科目を使用している取引データを抽出
      const filterRecordsManagements = useState.workRecordsManagement.value.filter(
        (rm) => {
          const subjects = useState.subjectsInfo.value
            .filter((s) => {
              return s.groupname === state.selectSubject
            })
            .map((fs) => {
              return fs.id
            })

          return subjects.includes(rm.sid)
        }
      )

      // ********************************************************************
      // 通常表示用データ整形(チェックボックス「Off」時)
      // ********************************************************************

      // 取引先または固定経費毎に月毎の金額を算出
      useState.clientsAndCostsInfo.value.forEach((e) => {
        // 取引先または固定経費毎にフィルタリング
        const filterByClientsAndCosts = filterRecordsManagements
          .filter((r) => {
            return r.cid === e.id
          })
          .map((i) => {
            return {
              pay: i.pay,
              month: Number(i.day.slice(5, 7)),
            }
          })
        if (filterByClientsAndCosts.length > 0) {
          state.defaultRecords.push({
            cName: e.name,
            jan: sumPerMonth(filterByClientsAndCosts, 1),
            feb: sumPerMonth(filterByClientsAndCosts, 2),
            mar: sumPerMonth(filterByClientsAndCosts, 3),
            apr: sumPerMonth(filterByClientsAndCosts, 4),
            may: sumPerMonth(filterByClientsAndCosts, 5),
            jun: sumPerMonth(filterByClientsAndCosts, 6),
            jul: sumPerMonth(filterByClientsAndCosts, 7),
            aug: sumPerMonth(filterByClientsAndCosts, 8),
            sep: sumPerMonth(filterByClientsAndCosts, 9),
            oct: sumPerMonth(filterByClientsAndCosts, 10),
            nov: sumPerMonth(filterByClientsAndCosts, 11),
            dec: sumPerMonth(filterByClientsAndCosts, 12),
            sum: filterByClientsAndCosts
              .reduce((sum, r) => {
                return sum + r.pay
              }, 0)
              .toLocaleString(),
          })
        }
      })

      // 金額順に並び替え
      state.defaultRecords.sort(function (a, b) {
        return (
          Number(b.sum.replaceAll(',', '')) - Number(a.sum.replaceAll(',', ''))
        )
      })

      // ********************************************************************
      // 省略表示用データ整形(チェックボックス「On」時)
      // ********************************************************************
      state.defaultRecords.forEach((record, index) => {
        if (index < 4) {
          state.otherRecords.push(record)
        } else {
          otherArray.jan = (
            Number(otherArray.jan.replaceAll(',', '')) +
            Number(record.jan.replaceAll(',', ''))
          ).toLocaleString()
          otherArray.feb = (
            Number(otherArray.feb.replaceAll(',', '')) +
            Number(record.feb.replaceAll(',', ''))
          ).toLocaleString()
          otherArray.mar = (
            Number(otherArray.mar.replaceAll(',', '')) +
            Number(record.mar.replaceAll(',', ''))
          ).toLocaleString()
          otherArray.apr = (
            Number(otherArray.apr.replaceAll(',', '')) +
            Number(record.apr.replaceAll(',', ''))
          ).toLocaleString()
          otherArray.may = (
            Number(otherArray.may.replaceAll(',', '')) +
            Number(record.may.replaceAll(',', ''))
          ).toLocaleString()
          otherArray.jun = (
            Number(otherArray.jun.replaceAll(',', '')) +
            Number(record.jun.replaceAll(',', ''))
          ).toLocaleString()
          otherArray.jul = (
            Number(otherArray.jul.replaceAll(',', '')) +
            Number(record.jul.replaceAll(',', ''))
          ).toLocaleString()
          otherArray.aug = (
            Number(otherArray.aug.replaceAll(',', '')) +
            Number(record.aug.replaceAll(',', ''))
          ).toLocaleString()
          otherArray.sep = (
            Number(otherArray.sep.replaceAll(',', '')) +
            Number(record.sep.replaceAll(',', ''))
          ).toLocaleString()
          otherArray.oct = (
            Number(otherArray.oct.replaceAll(',', '')) +
            Number(record.oct.replaceAll(',', ''))
          ).toLocaleString()
          otherArray.nov = (
            Number(otherArray.nov.replaceAll(',', '')) +
            Number(record.nov.replaceAll(',', ''))
          ).toLocaleString()
          otherArray.dec = (
            Number(otherArray.dec.replaceAll(',', '')) +
            Number(record.dec.replaceAll(',', ''))
          ).toLocaleString()
        }
      })
      for (const [key, value] of Object.entries(otherArray)) {
        if (key !== 'cName' && key !== 'sum') {
          otherArray.sum = (
            Number(otherArray.sum.replaceAll(',', '')) +
            Number(value.replaceAll(',', ''))
          ).toLocaleString()
        }
      }
      state.otherRecords.push(otherArray)

      // ********************************************************************
      // 合計行の算出(通常表示用と省略表示用のデータそれぞれに合計行を追加)
      // ********************************************************************
      state.defaultRecords.push({
        cName: '合計',
        jan: state.defaultRecords
          .reduce((acc, r): number => {
            return acc + Number(r.jan.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        feb: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.feb.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        mar: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.mar.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        apr: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.apr.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        may: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.may.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        jun: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.jun.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        jul: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.jul.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        aug: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.aug.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        sep: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.sep.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        oct: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.oct.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        nov: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.nov.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        dec: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.dec.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        sum: state.defaultRecords
          .reduce((acc, r) => {
            return acc + Number(r.sum.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
      })

      state.otherRecords.push({
        cName: '合計',
        jan: state.otherRecords
          .reduce((acc, r): number => {
            return acc + Number(r.jan.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        feb: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.feb.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        mar: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.mar.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        apr: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.apr.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        may: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.may.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        jun: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.jun.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        jul: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.jul.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        aug: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.aug.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        sep: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.sep.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        oct: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.oct.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        nov: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.nov.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        dec: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.dec.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
        sum: state.otherRecords
          .reduce((acc, r) => {
            return acc + Number(r.sum.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
      })

      // ********************************************************************
      // 整形後データセット
      // ********************************************************************
      recordsSet()
    }

    return { ...toRefs(state), columns, changeSubject, recordsSet }
  },
})
</script>
