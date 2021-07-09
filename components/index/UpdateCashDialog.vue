<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
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
    <cash-dialog-form
      v-if="dialog"
      :dialog="dialog"
      title="取引更新"
      :continue-flg="false"
      btn-name="更新"
      :default-records="defaultRecord"
      @exec="updateCash"
      @open-close="dialogOpenClose"
    ></cash-dialog-form>
  </v-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { useGlobalState } from '../../composables/useDefault'
import { RecordsManagement } from '../../composables/interface'
import CashDialogForm from './CashDialogForm.vue'
export default defineComponent({
  components: { CashDialogForm },
  props: {
    defaultRecord: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const useState = useGlobalState()
    const state = reactive<{
      dialog: boolean
    }>({
      dialog: false,
    })
    const dialogOpenClose = (v: boolean) => {
      state.dialog = v
    }
    const updateCash = (record: RecordsManagement, v: boolean) => {
      state.dialog = v
      useState.updateRecordManagement(record)
    }

    return {
      ...toRefs(state),
      dialogOpenClose,
      updateCash,
    }
  },
})
</script>
