<template>
  <div id="pieChart" class="my-chart-area">
    <canvas ref="canvasRef" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  watch,
} from '@vue/composition-api'
import { pieType } from '@/composables/useChart'
import { Chart } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default defineComponent({
  props: {
    pieData: {
      type: Object,
      required: true,
    },
    selectSubject: {
      type: String,
      required: true,
    },
  },
  setup(props: { pieData: pieType; selectSubject: string }) {
    const state = reactive<{
      chart: Chart | undefined
    }>({
      chart: undefined,
    })
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    const createCharts = () => {
      if (canvasRef.value === null) return
      const canvas = canvasRef.value.getContext('2d')
      if (canvas === null) return

      state.chart = new Chart(canvas, {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: props.pieData,
        options: {
          title: {
            display: true,
            text: `${props.selectSubject}別 収益の推移`,
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
          plugins: {
            datalabels: {
              color: '#000000',
              font: {
                size: 10,
              },
              formatter: (value) => {
                return value + '%'
              },
            },
          },
        },
      })
    }

    onMounted(() => {
      createCharts()
    })

    watch(
      () => props.pieData,
      (newPieData) => {
        if (state.chart) {
          state.chart.data = newPieData
          if (state.chart.options) {
            if (state.chart.options.title) {
              if (state.chart.options.title.text) {
                state.chart.options.title.text = `${props.selectSubject}別 収益の推移`
              }
            }
          }
          state.chart.update()
        }
      }
    )

    return {
      ...toRefs(state),
      canvasRef,
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
