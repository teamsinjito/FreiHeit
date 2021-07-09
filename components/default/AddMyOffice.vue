<template>
  <!-- 事業所追加ボタン ダイアログ -->
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
    <my-office-form
      v-if="dialog"
      :dialog="dialog"
      :title="title"
      :subtitle="subtitle"
      :continue-flg="true"
      :cancel-flg="true"
      btn-name="登録"
      :default-records="newRecord"
      @exec="insertClientCost"
      @open-close="dialogOpenClose"
    ></my-office-form>
  </v-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { useGlobalState } from '../../composables/useDefault'
import { Works, InsertUpdateWorks } from '../../composables/interface'
import MyOfficeForm from './MyOfficeForm.vue'
export default defineComponent({
  components: { MyOfficeForm },
  props: {
    title: {
      type: String,

      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
  },

  setup() {
    const useState = useGlobalState()
    const state = reactive<{
      dialog: boolean
      newRecord: Works
    }>({
      dialog: false,
      newRecord: {
        id: '',
        name: '',
      },
    })
    const dialogOpenClose = (v: boolean) => {
      state.dialog = v
    }
    const insertClientCost = (record: InsertUpdateWorks, v: boolean) => {
      state.dialog = v
      useState.insertMyOffice(record)
    }

    return {
      ...toRefs(state),
      dialogOpenClose,
      insertClientCost,
    }
  },
})
</script>
