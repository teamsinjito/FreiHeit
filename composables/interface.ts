// インターフェース一覧

// ユーザ情報
export interface Works {
  id: string
  name: string
  last: string
}
export interface InsertUpdateWorks {
  id: string
  uid: string
  name: string
}
// ユーザ毎の取引管理
export interface RecordsManagement {
  id: string
  wid: string
  pay: number
  sid: string
  day: string
  cid: string
  note: string
}

// ユーザ毎の取引先および固定経費一覧
export interface ClientsAndCosts {
  id: string
  name: string
  wid: string
  iflg: number
}

// 勘定科目一覧
export interface Subjects {
  id: string
  name: string
  groupname: string
  requireflg: number
  sortid: number
}

export interface StateInterface {
  workInfo: Works[] // ユーザ情報
  workRecordsManagement: RecordsManagement[] // 取引管理
  subjectsInfo: Subjects[] // 勘定科目一覧
  currentSysYear: { num: number } // 現在の会計期間
  clientsAndCostsInfo: ClientsAndCosts[] // 取引先および固定経費一覧
  tabsInfo: { tab: string; content: string }[] // タブ情報
  snackInfo: { text: string; color: string; view: boolean } // スナックバー
}
export interface WorkChange {
  workRecordsManagement: RecordsManagement[] // 取引管理
  clientsAndCostsInfo: ClientsAndCosts[] // 取引先および固定経費一覧
}
export interface Request {
  body: { key: string }
}
