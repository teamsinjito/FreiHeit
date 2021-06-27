<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
    ><details-header-bar
      :records="records"
      :subject="selectSubject"
      :clients="selectClientsAndCostsName"
    ></details-header-bar
    ><v-divider></v-divider>
    <v-card flat rounded="0" class="mb-2 py-5">
      <v-row class="px-2">
        <v-col offset-sm="7">
          <v-select
            v-model="selectSubject"
            :items="subjectItems"
            dense
            class="mt-6 text-caption"
            @change="changeSubject()"
          >
            <template #label>
              <span class="text-caption">勘定科目を選択</span>
            </template>
          </v-select>
        </v-col>
        <v-col>
          <v-select
            v-model="selectClientsAndCosts"
            :items="clientsAndCosts"
            multiple
            return-object
            item-value="id"
            item-text="name"
            dense
            class="mt-6 text-caption"
            @change="changeClientsAndCosts()"
          >
            <template #label>
              <span class="text-caption">取引先および固定経費を選択</span>
            </template>
            <template #selection="{ item, index }">
              <span v-if="index === 0" class="text-caption">{{
                item.name
              }}</span>
              <span v-if="index === 1" class="ml-3 grey--text text-caption">
                (+{{ selectClientsAndCosts.length - 1 }} others)
              </span>
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
import DetailsHeaderBar from '~/components/totals/DetailsHeaderBar.vue'

export default defineComponent({
  components: { DetailsHeaderBar },
  setup() {
    const useState = useGlobalState()
    const state = reactive<{
      selectSubject: string
      subjectItems: string[]
      selectClientsAndCosts: { id: string; name: string }[]
      selectClientsAndCostsName: string
      clientsAndCosts: { id: string; name: string }[]
      records: {
        cNameS: string
        jan: string
        feb: string
        mar: string
        apr: string
        may: string
        jun: string
        jul: string
        aug: string
        sep: string
        oct: string
        nov: string
        dec: string
        cNameE: string
      }[]
    }>({
      selectSubject: '仕入',
      subjectItems: [],
      selectClientsAndCosts: [],
      selectClientsAndCostsName: '',
      clientsAndCosts: [{ id: '', name: '' }],
      records: [],
    })
    const columns = [
      {
        label: '',
        field: 'cNameS',
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
        label: '',
        field: 'cNameE',
        type: 'string',
        tdClass: 'text-caption text-center',
        sortable: false,
      },
    ]
    const date = [
      { id: '1', value: '01' },
      { id: '2', value: '02' },
      { id: '3', value: '03' },
      { id: '4', value: '04' },
      { id: '5', value: '05' },
      { id: '6', value: '06' },
      { id: '7', value: '07' },
      { id: '8', value: '08' },
      { id: '9', value: '09' },
      { id: '10', value: '10' },
      { id: '11', value: '11' },
      { id: '12', value: '12' },
      { id: '13', value: '13' },
      { id: '14', value: '14' },
      { id: '15', value: '15' },
      { id: '16', value: '16' },
      { id: '17', value: '17' },
      { id: '18', value: '18' },
      { id: '19', value: '19' },
      { id: '20', value: '20' },
      { id: '21', value: '21' },
      { id: '22', value: '22' },
      { id: '23', value: '23' },
      { id: '24', value: '24' },
      { id: '25', value: '25' },
      { id: '26', value: '26' },
      { id: '27', value: '27' },
      { id: '28', value: '28' },
      { id: '29', value: '29' },
      { id: '30', value: '30' },
      { id: '31', value: '31' },
    ]

    onMounted(() => {
      // 勘定科目、取引先・固定経費をセット
      setSubjects()
      setClientsAndCosts()
    })

    /**
     *
     * 勘定科目変更時用イベント
     *
     */
    const changeSubject = () => {
      // 取引先・固定経費取得処理呼び出し
      setClientsAndCosts()
    }

    /**
     *
     * 取引先・固定経費変更時用イベント
     *
     */
    const changeClientsAndCosts = () => {
      // 選択中の取引先・固定経費の名称をstateにセット
      state.selectClientsAndCostsName = state.selectClientsAndCosts
        .map((cLcO) => {
          return cLcO.name
        })
        .join(',')

      // 金額算出処理呼び出し
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

      // 最終結果をstateにセット
      state.subjectItems = [...new Set(items)]
    }

    /**
     *
     * 取引先および固定経費をstateにセットする
     *
     */
    const setClientsAndCosts = () => {
      // 選択中の勘定科目コードを取得
      const selectSubjectCode = useState.subjectsInfo.value
        .filter((subject) => {
          return subject.groupname === state.selectSubject
        })
        .map((val) => {
          return val.id
        })

      if (selectSubjectCode) {
        // 選択中の勘定科目コードを基に、取引データから取引先・固定経費コードをフィルタリングして取得
        const usingClientsAndCosts = Array.from(
          new Set(
            useState.workRecordsManagement.value
              .filter((workRecord) => {
                return selectSubjectCode.includes(workRecord.sid)
              })
              .map((filterWorkRecord) => {
                return filterWorkRecord.cid
              })
          )
        )

        // 取得した取引先・固定経費コードを含むデータからidとnameを抽出
        const items = useState.clientsAndCostsInfo.value
          .filter((info) => {
            return usingClientsAndCosts.includes(info.id)
          })
          .map((filterInfo) => {
            return { id: filterInfo.id, name: filterInfo.name }
          })

        // 最終結果をstateにセット
        state.clientsAndCosts = [...new Set(items)]
      } else {
        // 勘定科目コードが取得できなかった場合、
        // 取引先・固定経費を選択できないように空配列をセット
        state.clientsAndCosts = []
      }

      // 選択中の取引先・固定経費をリセット
      state.selectClientsAndCosts = []
      state.selectClientsAndCostsName = ''
    }

    /**
     *
     * テーブル用のデータを作成しstateにセットする
     *
     */
    const getFilteringData = () => {
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

      // stateを初期化
      state.records.splice(0, state.records.length)

      // ********************************************************************
      // 指定の勘定科目、取引先・固定経費を使用している取引データを取得
      // ********************************************************************
      const filterRecordsManagements = useState.workRecordsManagement.value.filter(
        (workRecord) => {
          // 選択中の勘定科目グループ名を持つ勘定科目のIDを取得
          const selectSubjectsId = useState.subjectsInfo.value
            .filter((s) => {
              return s.groupname === state.selectSubject
            })
            .map((fs) => {
              return fs.id
            })

          // 選択中の取引先・固定経費情報からIDのみを取得
          const selectClCo = state.selectClientsAndCosts.map((cLcO) => {
            return cLcO.id
          })

          // 上記取得したIDを含む取引データのみを返却
          return (
            selectSubjectsId.includes(workRecord.sid) &&
            selectClCo.includes(workRecord.cid)
          )
        }
      )

      // ※ 取引データが取得できなかった場合は後続処理は行わない
      if (filterRecordsManagements.length > 0) {
        // ********************************************************************
        // 取引データの金額を日付毎に振り分け
        // ********************************************************************
        date.forEach((day) => {
          // 取引データを「日」毎に確認
          const filterByClientsAndCosts = filterRecordsManagements
            .filter((records) => {
              // 対象の「日」と同じ「日」を持つかでフィルタリング
              return records.day.slice(8, 10) === day.value
            })
            .map((filterData) => {
              // 取得した取引データから「金額」と「月」を抽出
              return {
                pay: filterData.pay,
                month: Number(filterData.day.slice(5, 7)),
              }
            })

          state.records.push({
            cNameS: day.id + '日',
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
            cNameE: day.id + '日',
          })
        })

        // ********************************************************************
        // 合計行の算出
        // ********************************************************************
        state.records.push({
          cNameS: '合計',
          jan: state.records
            .reduce((acc, r): number => {
              return acc + Number(r.jan.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          feb: state.records
            .reduce((acc, r) => {
              return acc + Number(r.feb.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          mar: state.records
            .reduce((acc, r) => {
              return acc + Number(r.mar.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          apr: state.records
            .reduce((acc, r) => {
              return acc + Number(r.apr.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          may: state.records
            .reduce((acc, r) => {
              return acc + Number(r.may.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          jun: state.records
            .reduce((acc, r) => {
              return acc + Number(r.jun.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          jul: state.records
            .reduce((acc, r) => {
              return acc + Number(r.jul.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          aug: state.records
            .reduce((acc, r) => {
              return acc + Number(r.aug.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          sep: state.records
            .reduce((acc, r) => {
              return acc + Number(r.sep.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          oct: state.records
            .reduce((acc, r) => {
              return acc + Number(r.oct.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          nov: state.records
            .reduce((acc, r) => {
              return acc + Number(r.nov.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          dec: state.records
            .reduce((acc, r) => {
              return acc + Number(r.dec.replaceAll(',', ''))
            }, 0)
            .toLocaleString(),
          cNameE: '合計',
        })
      }
    }

    return { ...toRefs(state), columns, changeSubject, changeClientsAndCosts }
  },
})
</script>
