<template>
  <!-- 取引先追加ボタン ダイアログ -->
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        class="text-sm-button text-caption"
        v-bind="attrs"
        v-on="on"
      >
        New
      </v-btn>
    </template>
    <client-cost-form
      v-if="dialog"
      :dialog="dialog"
      :title="title"
      :subtitle="subtitle"
      :continue-flg="true"
      :iflg="iflg"
      btn-name="登録"
      :default-records="newRecord"
      @exec="insertClientCost"
      @open-close="dialogOpenClose"
    ></client-cost-form>
  </v-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { useGlobalState } from '../../composables/useDefault'
import { ClientsAndCosts } from '../../composables/interface'
import ClientCostForm from './ClientCostForm.vue'
export default defineComponent({
  components: { ClientCostForm },
  props: {
    title: {
      type: String,

      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    iflg: {
      type: Number,
      required: true,
    },
  },

  setup() {
    const useState = useGlobalState()
    const state = reactive<{
      dialog: boolean
      newRecord: ClientsAndCosts
    }>({
      dialog: false,
      newRecord: {
        id: '',
        wid: '',
        name: '',
        iflg: 0,
      },
    })
    const dialogOpenClose = (v: boolean) => {
      state.dialog = v
    }
    const insertClientCost = (record: ClientsAndCosts, v: boolean) => {
      state.dialog = v
      useState.insertClientCost(record)
    }

    return {
      ...toRefs(state),
      dialogOpenClose,
      insertClientCost,
    }
  },
})
</script>
