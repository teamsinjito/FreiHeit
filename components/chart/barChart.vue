<template>
  <div class="my-chart-area">
    <canvas ref="canvasRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { Chart } from 'chart.js'

export default defineComponent({
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    onMounted(() => {
      createCharts()
    })

    const chartDataSample = {
      labels: [
        '2021-01',
        '2021-02',
        '2021-03',
        '2021-04',
        '2021-05',
        '2021-06',
        '2021-07',
        '2021-08',
        '2021-09',
        '2021-10',
        '2021-11',
        '2021-12',
      ],
      datasets: [
        {
          label: 'A社',
          data: [
            620000,
            650000,
            930000,
            850000,
            510000,
            660000,
            470000,
            550000,
            450000,
            730000,
            750000,
            410000,
          ],
          backgroundColor: 'rgba(219,39,91,0.5)',
        },
        {
          label: 'B社',
          data: [
            550000,
            450000,
            730000,
            750000,
            410000,
            450000,
            580000,
            620000,
            550000,
            310000,
            450000,
            380000,
          ],
          backgroundColor: 'rgba(130,201,169,0.5)',
        },
        {
          label: 'C社',
          data: [
            330000,
            450000,
            620000,
            550000,
            310000,
            450000,
            380000,
            620000,
            550000,
            310000,
            450000,
            380000,
          ],
          backgroundColor: 'rgba(255,183,76,0.5)',
        },
      ],
    }

    const createCharts = () => {
      if (canvasRef.value === null) return
      const canvas = canvasRef.value.getContext('2d')
      if (canvas === null) return
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const chart = new Chart(canvas, {
        type: 'bar',
        data: chartDataSample,
        options: {
          title: {
            display: true,
            text: '取引先別 収益の推移',
            padding: 10,
            fontSize: 20,
          },
          scales: {
            xAxes: [
              {
                stacked: true, //  積み上げの指定
                scaleLabel: {
                  // 横軸ラベル
                  display: false,
                  labelString: '月',
                  fontSize: 16,
                },
                gridLines: {
                  display: false, // 補助線表示
                },
              },
            ],
            yAxes: [
              {
                stacked: true, //  積み上げの指定
                scaleLabel: {
                  // 横軸ラベル
                  display: false,
                  labelString: '金額',
                  fontSize: 16,
                },
                ticks: {
                  suggestedMax: 2000000,
                  suggestedMin: 0,
                  stepSize: 500000,
                  callback: (value) => {
                    return value + ' 円'
                  },
                },
              },
            ],
          },
          // 縦横比固定設定解除
          maintainAspectRatio: false,
        },
      })
    }
    return {
      canvasRef,
      createCharts,
    }
  },
})
</script>

<style scoped>
.my-chart-area {
  position: relative;
  width: 100%;
  height: 75vw;
}

@media screen and (min-width: 769px) {
  .my-chart-area {
    height: 30vw !important;
  }
}
</style>
