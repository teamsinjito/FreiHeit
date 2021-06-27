<template>
  <div id="barChart" class="my-chart-area">
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
import { barType } from '@/composables/useChart'
import { Chart } from 'chart.js'

export default defineComponent({
  props: {
    barData: {
      type: Object,
      required: true,
    },
    selectSubject: {
      type: String,
      required: true,
    },
  },
  setup(props: { barData: barType; selectSubject: string }) {
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
        type: 'bar',
        data: props.barData,
        options: {
          title: {
            display: true,
            text: `${props.selectSubject}別 収益の推移`,
            padding: 10,
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

    onMounted(() => {
      createCharts()
    })

    watch(
      () => props.barData,
      (newBarData) => {
        if (state.chart) {
          state.chart.data = newBarData
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
