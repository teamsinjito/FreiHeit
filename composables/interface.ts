// インターフェース一覧

// ユーザ情報
export interface Users {
  mail: string
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

// ユーザ毎の取引先一覧
export interface Clients {
  id: string
  name: string
}

// ユーザ毎の固定経費一覧
export interface Costs {
  id: string
  name: string
}

// 勘定科目一覧
export interface Subjects {
  id: string
  name: string
  requireFlg: number
}

// 勘定科目グループ一覧
export interface SubjectsGroup {
  name: string
}

// クエリインターフェース
export interface getAllDataPostVal {
  name: string
  query: string
  table: string
}
