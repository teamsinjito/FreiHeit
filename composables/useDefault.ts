import {
  onMounted,
  reactive,
  toRefs,
  InjectionKey,
  provide,
  inject,
} from '@nuxtjs/composition-api'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import {
  connectPathUsers,
  connectPathInsertRecordsManagement,
  connectPathUpdateRecordsManagement,
} from '../composables/routing'
import { RecordsManagement, StateInterface } from '../composables/interface'

const createGlobalState = (userId: string) => {
  // 状態
  const globalState = reactive<StateInterface>({
    // ユーザ情報
    userInfo: {
      id: '',
      office: '',
    },

    // 取引管理
    userRecordsManagement: [
      {
        id: '',
        uid: '',
        pay: 0,
        sid: '',
        day: '',
        cid: '',
        note: '',
      },
    ],

    // 勘定科目
    subjectsInfo: [
      {
        id: '',
        name: '',
        groupname: '',
        requireflg: 0,
        sortid: 0,
      },
    ],

    // 取引先および固定経費
    clientsAndCostsInfo: [
      {
        id: '',
        name: '',
        itemFlg: 0,
      },
    ],
    // 現在の会計年度
    currentSysYear: { num: 0 },

    // タブ情報
    tabsInfo: [{ tab: '', content: '' }],
  })

  // グローバルstateにセット
  const setGrobalStateCall = async (authId: string) => {
    await axios
      .post<StateInterface>(`/api${connectPathUsers}`, {
        key: authId,
      })
      .then((data) => {
        if (data.data != null) {
          globalState.userInfo = data.data.userInfo
          globalState.userRecordsManagement = data.data.userRecordsManagement
          globalState.subjectsInfo = data.data.subjectsInfo
          globalState.clientsAndCostsInfo = data.data.clientsAndCostsInfo
          globalState.tabsInfo = data.data.tabsInfo
          console.log('初期処理：成功!')
        } else {
          alert('初期処理に失敗しました。')
        }
      })
      .catch(() => {
        alert('初期処理に失敗しました。')
      })
  }

  // 取引管理追加
  const insertRecordManagement = async (ary: RecordsManagement) => {
    // uuid生成
    ary.id = uuidv4()
    await axios
      .post<StateInterface>(`/api${connectPathInsertRecordsManagement}`, {
        key: ary,
      })
      .then((res) => {
        if (res.data) {
          globalState.userRecordsManagement.push(ary)
          // ソート
          globalState.userRecordsManagement.sort((n1, n2) => {
            if (n1.day > n2.day) {
              return -1
            }
            if (n1.day < n2.day) {
              return 1
            }
            return 0
          })
          console.log('取引追加：成功!')
        } else {
          alert('取引の登録に失敗しました。')
        }
      })
      .catch(() => {
        alert('取引の登録に失敗しました。')
      })
  }

  // 取引管理更新
  const updateRecordManagement = async (ary: RecordsManagement) => {
    await axios
      .post<StateInterface>(`/api${connectPathUpdateRecordsManagement}`, {
        key: ary,
      })
      .then((res) => {
        if (res.data) {
          const row = globalState.userRecordsManagement.filter(
            (r) => r.id === ary.id
          )[0]
          row.pay = ary.pay
          row.sid = ary.sid
          row.day = ary.day
          row.cid = ary.cid
          row.note = ary.note

          // ソート
          globalState.userRecordsManagement.sort((n1, n2) => {
            if (n1.day > n2.day) {
              return -1
            }
            if (n1.day < n2.day) {
              return 1
            }
            return 0
          })
          console.log('取引更新：成功!')
        } else {
          alert('取引の更新に失敗しました。')
        }
      })
      .catch(() => {
        alert('取引の更新に失敗しました。')
      })
  }
  onMounted(() => {
    setGrobalStateCall(userId)

    // 会計年度の設定
    if (Number(new Date().getMonth) >= 4 && Number(new Date().getMonth) <= 12) {
      globalState.currentSysYear.num = new Date().getFullYear()
    } else {
      globalState.currentSysYear.num = new Date().getFullYear() - 1
    }
  })

  return {
    ...toRefs(globalState),
    setGrobalStateCall,
    insertRecordManagement,
    updateRecordManagement,
  }
}

// キー生成
type GlobalStateType = ReturnType<typeof createGlobalState>
export const GlobalStateKey: InjectionKey<GlobalStateType> = Symbol(
  'GlobalState'
)

// provide
export const provideGlobalState = (userId: string) => {
  provide(GlobalStateKey, createGlobalState(userId))
}

// injectチェック
export const useGlobalState = () => {
  const res = inject(GlobalStateKey)

  if (res) return res
  else
    throw new Error(
      "GlobalState has not provided. Please use 'provideGlobalState'."
    )
}
