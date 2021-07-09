<template>
  <!-- Newボタン -->
  <v-dialog v-model="dialog" persistent max-width="500px">
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

    <cash-dialog-form
      v-if="dialog"
      :dialog="dialog"
      title="取引追加"
      :continue-flg="true"
      btn-name="登録"
      :default-records="newRecord"
      @exec="insertCash"
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
  setup(_props) {
    const useState = useGlobalState()
    const state = reactive<{
      dialog: boolean
      newRecord: RecordsManagement
    }>({
      dialog: false,
      newRecord: {
        id: '',
        wid: '',
        pay: 0,
        sid: '',
        day: useState.currentSysYear.value.num + '-01-01',
        cid: '',
        note: '',
        update: '',
      },
    })
    const dialogOpenClose = (v: boolean) => {
      state.dialog = v
    }
    const insertCash = (record: RecordsManagement, v: boolean) => {
      state.dialog = v
      useState.insertRecordManagement(record)
    }

    return {
      ...toRefs(state),
      dialogOpenClose,
      insertCash,
    }
  },
})
</script>
