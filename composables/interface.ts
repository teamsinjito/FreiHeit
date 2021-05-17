// インターフェース一覧

// ユーザ情報
export interface Users {
  id: string
  office: string
}

// ユーザ毎の取引管理
export interface RecordsManagement {
  id: string
  payflg: number
  pay: number
  subject: string
  subjectGroup: string
  day: string
  clientOrCostName: string
  note: string
  month: string
}

// ユーザ毎の取引先および固定経費一覧
export interface ClientsAndCosts {
  id: string
  name: string
  itemFlg: number
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
  userInfo: Users // ユーザ情報
  userRecordsManagement: RecordsManagement[] // 取引管理
  subjectsInfo: Subjects[] // 勘定科目一覧
  currentSysYear: { num: number } // 現在の会計期間
  clientsAndCostsInfo: ClientsAndCosts[] // 取引先および固定経費一覧
  tabsInfo: { tab: string; content: string }[] // タブ情報
}

export interface Request {
  body: { key: string }
}
