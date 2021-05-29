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
    <my-office-form
      v-if="dialog"
      :dialog="dialog"
      :title="title"
      :subtitle="subtitle"
      :continue-flg="false"
      btn-name="更新"
      :default-records="defaultRecord"
      @exec="updateClientCost"
      @open-close="dialogOpenClose"
    ></my-office-form>
  </v-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { useGlobalState } from '../../composables/useDefault'
import { InsertUpdateWorks } from '../../composables/interface'
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
    const updateClientCost = (record: InsertUpdateWorks, v: boolean) => {
      state.dialog = v
      useState.updateMyOffice(record)
      // useState.updateClientCost(record)
    }

    return {
      ...toRefs(state),
      dialogOpenClose,
      updateClientCost,
    }
  },
})
</script>
