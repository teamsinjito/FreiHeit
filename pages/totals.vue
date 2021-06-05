<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
    ><totals-header-bar></totals-header-bar><v-divider></v-divider>
    <v-card flat rounded="0" class="mb-2 py-5">
      <v-row>
        <v-col offset-sm="10">
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
        id="total-table"
        styleClass="vgt-table striped bordered condensed"
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
import TotalsHeaderBar from '~/components/totals/TotalsHeaderBar.vue'

export default defineComponent({
  components: { TotalsHeaderBar },
  setup() {
    const useState = useGlobalState()
    const state = reactive<{
      selectSubject: string
      subjectItems: string[]
      records: {
        cName: string
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
        sum: string
      }[]
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
    })

    // 勘定科目セット
    const setSubjects = () => {
      const items = useState.subjectsInfo.value.reduce((ary: string[], g) => {
        ary.push(g.groupname)
        return ary
      }, [])
      state.subjectItems = [...new Set(items)]
      console.log(state.subjectItems)
    }

    // データ整形処理
    const getFilteringData = () => {
      state.records.length = 0
      // 選択している勘定科目でフィルタリング
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
              month: new Date(i.day.replace('-', '/')).getMonth() + 1,
            }
          })

        state.records.push({
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
      })
      // 合計行の算出
      state.records.push({
        cName: '計',
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
        sum: state.records
          .reduce((acc, r) => {
            return acc + Number(r.sum.replaceAll(',', ''))
          }, 0)
          .toLocaleString(),
      })
      console.log(state.records)
    }
    onMounted(() => {
      setSubjects()
      getFilteringData()
    })

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
    const changeSubject = () => {
      getFilteringData()
    }
    return { columns, changeSubject, ...toRefs(state) }
  },
})
</script>
