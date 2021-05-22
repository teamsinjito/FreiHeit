<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on, attrs }">
      <v-icon
        small
        style="font-size: 0.4rem"
        class="ml-sm-3 text-sm-caption font-weight-bold"
        v-bind="attrs"
        v-on="on"
      >
        mdi-greater-than
      </v-icon>
    </template>
    <client-cost-form
      v-if="dialog"
      :dialog="dialog"
      :title="title"
      :subtitle="subtitle"
      :continue-flg="false"
      :iflg="iflg"
      btn-name="更新"
      :default-records="defaultRecord"
      @exec="updateClientCost"
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
    defaultRecord: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const useState = useGlobalState()
    const state = reactive<{
      dialog: boolean
    }>({
      dialog: false,
    })
    const dialogOpenClose = (v: boolean) => {
      state.dialog = v
    }
    const updateClientCost = (record: ClientsAndCosts, v: boolean) => {
      state.dialog = v
      // useState.updateRecordManagement(record)
    }

    return {
      ...toRefs(state),
      dialogOpenClose,
      updateClientCost,
    }
  },
})
</script>
