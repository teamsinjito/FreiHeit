// インターフェース一覧

// ユーザ情報
export interface Works {
  id: string
  name: string
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
  update: string
}

// ユーザ毎の取引先および固定経費一覧
export interface ClientsAndCosts {
  id: string
  name: string
  wid: string
  iflg: number
  color: string
}

// 勘定科目一覧
export interface Subjects {
  id: string
  name: string
  groupname: string
  requireflg: number
  sortid: number
  payflg: number
}

// 項目別集計表
export interface Totals {
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
}
// 項目別明細表
export interface Details {
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
}

// ヘルプ
export interface helps {
  title: string
  body: string
}

export interface StateInterface {
  workInfo: Works // ユーザ情報
  workRecordsManagement: RecordsManagement[] // 取引管理
  subjectsInfo: Subjects[] // 勘定科目一覧
  currentSysYear: { num: number } // 現在の会計期間
  clientsAndCostsInfo: ClientsAndCosts[] // 取引先および固定経費一覧
  tabsInfo: { tab: string; content: string }[] // タブ情報
  snackInfo: { text: string; color: string; view: boolean } // スナックバー
  helpsInfo: helps[] // ヘルプ
}
export interface WorkChange {
  workRecordsManagement: RecordsManagement[] // 取引管理
  clientsAndCostsInfo: ClientsAndCosts[] // 取引先および固定経費一覧
}
export interface Request {
  body: { key: string }
}

export interface pdfRecord {
  position: number
  pay: number
}
export interface pdfFormatRecord {
  day: string
  dayFormat: string
  cName: string
  nomalPays: pdfRecord[]
}
export interface pdfFormatCost {
  cid: string
  cName: string
  costPays: pdfRecord[]
}

export interface pdfFormatRecordList {
  month: number
  list: pdfFormatRecord[]
  costList: pdfFormatCost[]
  total: pdfRecord[]
  carryOver: number
}
