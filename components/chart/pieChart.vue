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
      labels: ['A社', 'B社', 'C社'],
      datasets: [
        {
          backgroundColor: [
            'rgba(219,39,91,0.5)',
            'rgba(130,201,169,0.5)',
            'rgba(255,183,76,0.5)',
          ],
          data: [50, 35, 15],
        },
      ],
    }

    const createCharts = () => {
      if (canvasRef.value === null) return
      const canvas = canvasRef.value.getContext('2d')
      if (canvas === null) return

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const chart = new Chart(canvas, {
        type: 'pie',
        data: chartDataSample,
        options: {
          title: {
            display: true,
            text: '取引先別 収益の推移',
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                if (
                  data.labels === undefined ||
                  data.datasets === undefined ||
                  data.datasets[0].data === undefined ||
                  tooltipItem.index === undefined
                )
                  return 'xxx%'
                return (
                  data.labels[tooltipItem.index] +
                  ': ' +
                  data.datasets[0].data[tooltipItem.index] +
                  ' %'
                )
              },
            },
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
