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
        <v-col offset-sm="8">
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
          <v-autocomplete
            v-model="selectClientsAndCosts"
            :items="clientsAndCosts"
            item-value="id"
            item-text="name"
            dense
            class="mt-6 text-caption"
            @change="changeSubject()"
          >
            <template #label>
              <span class="text-caption">取引先および固定経費を選択</span>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>

      <vue-good-table
        :columns="columns"
        :rows="records"
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
import DetailsHeaderBar from '~/components/totals/DetailsHeaderBar.vue'

export default defineComponent({
  components: { DetailsHeaderBar },
  setup() {
    const useState = useGlobalState()
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
    const state = reactive<{
      selectSubject: string
      subjectItems: string[]
      selectClientsAndCosts: string
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
      selectClientsAndCosts: '',
      selectClientsAndCostsName: '',
      clientsAndCosts: [{ id: '', name: '' }],
      records: [
        {
          cNameS: '',
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
          cNameE: '',
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
    // 取引先および固定経費セット
    const setClientsAndCosts = () => {
      const items = useState.clientsAndCostsInfo.value.map((i) => {
        return { id: i.id, name: i.name }
      })
      state.clientsAndCosts = [...new Set(items)]
      state.selectClientsAndCosts = items[0].id
    }

    // データ整形処理
    const getFilteringData = () => {
      state.records.length = 0
      // 選択している勘定科目でフィルタリング
      const filterRecordsManagements = useState.workRecordsManagement.value.filter(
        (rm) => {
          const cl = useState.clientsAndCostsInfo.value
            .filter((s) => {
              return s.id === state.selectClientsAndCosts
            })
            .map((fs) => {
              return fs.id
            })
          const subjects = useState.subjectsInfo.value
            .filter((s) => {
              return s.groupname === state.selectSubject
            })
            .map((fs) => {
              return fs.id
            })

          return cl.includes(rm.cid) && subjects.includes(rm.sid)
        }
      )
      console.log(filterRecordsManagements)
      // 取引先または固定経費毎に月毎の金額を算出
      date.forEach((d) => {
        // 取引先または固定経費毎にフィルタリング
        const filterByClientsAndCosts = filterRecordsManagements
          .filter((r) => {
            return r.day.slice(8, 10) === d.value
          })
          .map((i) => {
            return {
              pay: i.pay,
              month: Number(i.day.slice(5, 7)),
            }
          })

        state.records.push({
          cNameS: d.id + '日',
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
          cNameE: d.id + '日',
        })
      })

      // 合計行の算出
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
      console.log(state.records)
    }
    onMounted(() => {
      setSubjects()
      setClientsAndCosts()
      state.selectClientsAndCostsName = state.clientsAndCosts[0].name
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
    const changeSubject = () => {
      state.clientsAndCosts.forEach((clients) => {
        if (state.selectClientsAndCosts === clients.id) {
          state.selectClientsAndCostsName = clients.name
          console.log(state.selectClientsAndCostsName)
        }
      })
      getFilteringData()
    }
    return { columns, changeSubject, ...toRefs(state) }
  },
})
</script>
