<template>
  <!-- Newボタン -->
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

    <cash-dialog-form
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
  setup(_props, context) {
    const useState = useGlobalState()
    const state = reactive<{
      dialog: boolean
      newRecord: RecordsManagement
    }>({
      dialog: false,
      newRecord: {
        id: '',
        uid: '',
        pay: 0,
        sid: '',
        day: '',
        cid: '',
        note: '',
      },
    })
    const dialogOpenClose = (v: boolean) => {
      state.dialog = v
    }
    const insertCash = (record: RecordsManagement, v: boolean) => {
      state.dialog = v
      useState
        .insertRecordManagement(record)
        .then(() => {
          context.emit('com', '取引の登録が正常に完了しました。', '', true)
        })
        .catch(() => {
          context.emit('com', '取引の登録に失敗しました', '', true)
        })
    }

    return {
      ...toRefs(state),
      dialogOpenClose,
      insertCash,
    }
  },
})
</script>
