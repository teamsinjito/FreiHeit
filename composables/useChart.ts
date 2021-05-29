export interface barType {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
  }[]
}

export interface pieType {
  labels: string[]
  datasets: {
    backgroundColor: string[]
    data: number[]
  }[]
}

export const printPdf = () => {
  console.log('印刷')
}
