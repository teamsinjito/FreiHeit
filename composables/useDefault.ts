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
  connectDefaultWorks,
  connectPathUsers,
  connectPathInsertWorks,
  connectPathUpdateWorks,
  connectPathDeleteWorks,
  connectPathInsertRecordsManagement,
  connectPathUpdateRecordsManagement,
  connectPathDeleteRecordsManagement,
  connectPathInsertClientCost,
  connectPathUpdateClientCost,
  connectPathDeleteClientCost,
  connectPathChangeYearRecordsManagement,
  connectPathChangeWorksRecordsManagement,
} from '../composables/routing'
import {
  Works,
  InsertUpdateWorks,
  RecordsManagement,
  StateInterface,
  ClientsAndCosts,
  WorkChange,
} from '../composables/interface'

const createGlobalState = (userId: string) => {
  // 状態
  const globalState = reactive<StateInterface>({
    // ユーザ情報
    workInfo: [
      {
        id: '',
        name: '',
        last: '',
      },
    ],

    // 取引管理
    workRecordsManagement: [
      {
        id: '',
        wid: '',
        pay: 0,
        sid: '',
        day: '',
        cid: '',
        note: '',
        update: '',
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
        payflg: 0,
      },
    ],

    // 取引先および固定経費
    clientsAndCostsInfo: [
      {
        id: '',
        name: '',
        wid: '',
        iflg: 0,
        color: '',
      },
    ],
    // 現在の会計年度
    currentSysYear: { num: 0 },

    // タブ情報
    tabsInfo: [{ tab: '', content: '' }],

    // スナックバー情報
    snackInfo: {
      text: '',
      color: '',
      view: false,
    },
  })

  // オーバーレイ用情報
  const overlayState = reactive<{
    overlayText: string
    overlayShow: boolean
  }>({
    overlayText: '',
    overlayShow: false,
  })

  const displayState = reactive<{
    displayShow: boolean
  }>({
    displayShow: false,
  })

  // グローバルstateにセット
  const setGrobalStateCall = async (authId: string) => {
    await axios
      .post<StateInterface>(`/api${connectPathUsers}`, {
        key: authId,
      })
      .then((data) => {
        if (data.data != null) {
          console.log('data.data', data.data.workRecordsManagement)
          globalState.workInfo = data.data.workInfo
          globalState.workRecordsManagement = data.data.workRecordsManagement
          globalState.subjectsInfo = data.data.subjectsInfo
          globalState.clientsAndCostsInfo = data.data.clientsAndCostsInfo
          globalState.tabsInfo = data.data.tabsInfo
          displayState.displayShow = true
          console.log('初期処理：成功!')
        } else {
          alert('初期処理に失敗しました。')
        }
      })
      .catch(() => {
        alert('初期処理に失敗しました。')
      })
  }
  // 事業所追加
  const insertMyOffice = async (ary: InsertUpdateWorks) => {
    // uuid生成
    ary.id = uuidv4()
    await axios
      .post<InsertUpdateWorks>(`/api${connectPathInsertWorks}`, {
        key: ary,
      })
      .then((res) => {
        if (res.data) {
          globalState.workInfo.push({ id: ary.id, name: ary.name, last: '' })

          console.log('事業所追加：成功!')
          snackBarDisplay('事業所の登録が正常に完了しました。', '')
        } else {
          snackBarDisplay('事業所の登録が失敗しました。', 'error')
        }
      })
      .catch(() => {
        snackBarDisplay('事業所の登録が失敗しました。', 'error')
      })
  }
  // 事業所更新
  const updateMyOffice = async (ary: InsertUpdateWorks) => {
    await axios
      .post<InsertUpdateWorks>(`/api${connectPathUpdateWorks}`, {
        key: ary,
      })
      .then((res) => {
        if (res.data) {
          const row = globalState.workInfo.filter((r) => r.id === ary.id)[0]
          row.name = ary.name

          console.log('事業所更新：成功!')
          snackBarDisplay('事業所の更新が正常に完了しました。', '')
        } else {
          snackBarDisplay('事業所の更新が失敗しました。', 'error')
        }
      })
      .catch(() => {
        snackBarDisplay('事業所の更新が失敗しました。', 'error')
      })
  }
  // 事業所削除
  const deleteMyOffice = async (id: string) => {
    await axios
      .post(`/api${connectPathDeleteWorks}`, {
        key: id,
      })
      .then((res) => {
        if (res.data) {
          globalState.workInfo = globalState.workInfo.filter((r) => r.id !== id)

          // 取引管理state 削除
          globalState.workRecordsManagement = globalState.workRecordsManagement.filter(
            (r) => r.wid !== id
          )

          globalState.clientsAndCostsInfo = globalState.clientsAndCostsInfo.filter(
            (r) => r.wid !== id
          )

          console.log('事業所削除：成功!')
          snackBarDisplay('事業所の削除が正常に完了しました。', '')
        } else {
          snackBarDisplay('事業所の削除が失敗しました。', 'error')
        }
      })
      .catch(() => {
        snackBarDisplay('事業所の削除が失敗しました。', 'error')
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
          globalState.workRecordsManagement.push(ary)
          // ソート
          globalState.workRecordsManagement.sort((n1, n2) => {
            if (n1.day > n2.day) {
              return -1
            }
            if (n1.day < n2.day) {
              return 1
            }
            return 0
          })
          console.log('取引追加：成功!')
          snackBarDisplay('取引の登録が正常に完了しました。', '')
        } else {
          snackBarDisplay('取引の登録が失敗しました。', 'error')
        }
      })
      .catch(() => {
        snackBarDisplay('取引の登録が失敗しました。', 'error')
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
          const row = globalState.workRecordsManagement.filter(
            (r) => r.id === ary.id
          )[0]
          row.pay = ary.pay
          row.sid = ary.sid
          row.day = ary.day
          row.cid = ary.cid
          row.note = ary.note
          row.update = ary.update

          // ソート
          globalState.workRecordsManagement.sort((n1, n2) => {
            if (n1.day > n2.day) {
              return -1
            }
            if (n1.day < n2.day) {
              return 1
            }
            return 0
          })
          console.log('取引更新：成功!')
          snackBarDisplay('取引の更新が正常に完了しました。', '')
        } else {
          snackBarDisplay('取引の更新が失敗しました。', 'error')
        }
      })
      .catch(() => {
        snackBarDisplay('取引の更新が失敗しました。', 'error')
      })
  }
  // 取引管理削除
  const deleteRecordManagement = async (id: string) => {
    await axios
      .post(`/api${connectPathDeleteRecordsManagement}`, {
        key: id,
      })
      .then((res) => {
        if (res.data) {
          globalState.workRecordsManagement = globalState.workRecordsManagement.filter(
            (r) => r.id !== id
          )

          console.log('取引削除：成功!')
          snackBarDisplay('取引の削除が正常に完了しました。', '')
        } else {
          snackBarDisplay('取引の削除が失敗しました。', 'error')
        }
      })
      .catch(() => {
        snackBarDisplay('取引の削除が失敗しました。', 'error')
      })
  }

  // 取引先もしくは固定経費追加
  const insertClientCost = async (ary: ClientsAndCosts) => {
    // uuid生成
    ary.id = uuidv4()
    await axios
      .post<ClientsAndCosts>(`/api${connectPathInsertClientCost}`, {
        key: ary,
      })
      .then((res) => {
        if (res.data) {
          globalState.clientsAndCostsInfo.push(ary)

          console.log(globalState.clientsAndCostsInfo)
          if (ary.iflg === 1) {
            console.log('取引先追加：成功!')
            snackBarDisplay('取引先の登録が正常に完了しました。', '')
          } else {
            console.log(ary)
            console.log('固定経費追加：成功!')
            snackBarDisplay('固定経費の登録が正常に完了しました。', '')
          }
        }
      })
      .catch(() => {
        if (ary.iflg === 1) {
          console.log('取引先追加：失敗!')
          snackBarDisplay('取引先の登録が失敗しました。', '')
        } else {
          console.log('固定経費追加：失敗!')
          snackBarDisplay('固定経費の登録が失敗しました。', '')
        }
      })
  }
  // 取引先もしくは固定経費更新
  const updateClientCost = async (ary: ClientsAndCosts) => {
    await axios
      .post<ClientsAndCosts>(`/api${connectPathUpdateClientCost}`, {
        key: ary,
      })
      .then((res) => {
        if (res.data) {
          const row = globalState.clientsAndCostsInfo.filter(
            (r) => r.id === ary.id
          )[0]

          row.name = ary.name
          row.color = ary.color

          if (ary.iflg === 1) {
            console.log('取引先更新：成功!')
            snackBarDisplay('取引先の更新が正常に完了しました。', '')
          } else {
            console.log(ary)
            console.log('固定経費更新：成功!')
            snackBarDisplay('固定経費の更新が正常に完了しました。', '')
          }
        }
      })
      .catch(() => {
        if (ary.iflg === 1) {
          console.log('取引先更新：失敗!')
          snackBarDisplay('取引先の更新が失敗しました。', 'error')
        } else {
          console.log(ary)
          console.log('固定経費更新：失敗!')
          snackBarDisplay('固定経費の更新が失敗しました。', 'error')
        }
      })
  }

  // 取引先もしくは固定経費削除
  const deleteClientCost = async (id: string, flg: number) => {
    await axios
      .post(`/api${connectPathDeleteClientCost}`, {
        key: id,
      })
      .then((res) => {
        if (res.data) {
          globalState.clientsAndCostsInfo = globalState.clientsAndCostsInfo.filter(
            (r) => r.id !== id
          )

          if (flg === 1) {
            console.log('取引先削除：成功!')
            snackBarDisplay('取引先の削除が正常に完了しました。', '')
          } else {
            console.log('固定経費削除：成功!')
            snackBarDisplay('固定経費の削除が正常に完了しました。', '')
          }
        }
      })
      .catch(() => {
        if (flg === 1) {
          console.log('取引先削除：失敗!')
          snackBarDisplay('取引先の削除が失敗しました。', 'error')
        } else {
          console.log('固定経費削除：失敗!')
          snackBarDisplay('固定経費の削除が失敗しました。', 'error')
        }
      })
  }
  // 年度切り替え
  const changeYearRecordsManagement = async (year: number) => {
    await axios
      .post<RecordsManagement[]>(
        `/api${connectPathChangeYearRecordsManagement}`,
        {
          key: { id: globalState.workInfo[0].id, y: year },
        }
      )
      .then((res) => {
        globalState.workRecordsManagement = res.data
        // ソート
        globalState.workRecordsManagement.sort((n1, n2) => {
          if (n1.day > n2.day) {
            return -1
          }
          if (n1.day < n2.day) {
            return 1
          }
          return 0
        })

        snackBarDisplay('会計期間を' + year + '年度に切り替えました。', '')
      })
      .catch(() => {
        snackBarDisplay(
          '会計期間を' + year + '年度に切り替えできませんでした。',
          'error'
        )
      })
  }
  // 事業所切り替え
  const changeWorksRecordsManagement = async (workId: string) => {
    const nowDateTime = new Date().toISOString()
    await axios
      .post<WorkChange>(`/api${connectPathChangeWorksRecordsManagement}`, {
        key: {
          id: workId,
          y: globalState.currentSysYear.num,
          now: nowDateTime,
        },
      })
      .then((res) => {
        globalState.workRecordsManagement = res.data.workRecordsManagement
        globalState.clientsAndCostsInfo = res.data.clientsAndCostsInfo
        globalState.workInfo.filter(
          (f) => f.id === workId
        )[0].last = nowDateTime

        // ソート
        globalState.workInfo.sort((n1, n2) => {
          if (n1.last > n2.last) {
            return -1
          }
          if (n1.last < n2.last) {
            return 1
          }
          return 0
        })
        // ソート
        globalState.workRecordsManagement.sort((n1, n2) => {
          if (n1.day > n2.day) {
            return -1
          }
          if (n1.day < n2.day) {
            return 1
          }
          return 0
        })

        snackBarDisplay('事業所を切り替えました。', '')
      })
      .catch(() => {
        snackBarDisplay('事業所の切り替えができませんでした。', 'error')
      })
  }
  // スナックバー表示
  const snackBarDisplay = (message: string, color: string) => {
    globalState.snackInfo.text = message
    globalState.snackInfo.color = color
    globalState.snackInfo.view = !globalState.snackInfo.view
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
    ...toRefs(overlayState),
    ...toRefs(displayState),
    setGrobalStateCall,
    insertMyOffice,
    updateMyOffice,
    deleteMyOffice,
    insertRecordManagement,
    updateRecordManagement,
    deleteRecordManagement,
    insertClientCost,
    updateClientCost,
    deleteClientCost,
    changeWorksRecordsManagement,
    changeYearRecordsManagement,
    snackBarDisplay,
  }
}
export const getDefaultWork = (authId: string): Promise<Works> =>
  new Promise((resolve, reject) => {
    axios
      .post<Works>(`/api${connectDefaultWorks}`, {
        key: authId,
      })
      .then((data) => {
        if (data.data != null) {
          resolve({
            id: data.data.id,
            name: data.data.name,
            last: data.data.last,
          })
        } else {
          reject(new Error('NG'))
          alert('初期処理に失敗しました。')
        }
      })
      .catch(() => {
        alert('初期処理に失敗しました。')
      })
  })
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
