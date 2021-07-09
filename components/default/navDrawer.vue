<template>
  <!-- サイドバー -->
  <v-navigation-drawer :mini-variant="mini" fixed permanent app dark>
    <!-- 会社名 -->
    <v-list-item class="px-2 my-sm-1">
      <v-list-item-avatar color="primary">
        <v-img src="/freiheit_logo.png" alt="FreiHeit Logo"></v-img>
      </v-list-item-avatar>

      <v-list-item-title>{{ userState.workInfo.value.name }}</v-list-item-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template #activator="{ on, attrs }">
          <v-icon class="ml-sm-3" v-bind="attrs" v-on="on">
            mdi-square-edit-outline
          </v-icon>
        </template>
        <my-office-form
          v-if="dialog"
          :dialog="dialog"
          title="事業所名更新"
          subtitle="事業所名称を編集できます"
          :cancel-flg="true"
          btn-name="更新"
          :default-records="office"
          @exec="updateClientCost"
          @open-close="dialogOpenClose"
        ></my-office-form>
      </v-dialog>
    </v-list-item>
    <v-divider></v-divider>

    <!-- ページリスト -->
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="text-subtitle-2" v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>
  </v-navigation-drawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { Works, InsertUpdateWorks } from '../../composables/interface'
import { useGlobalState } from '~/composables/useDefault'
export default defineComponent({
  props: {
    mini: {
      type: Boolean,
      required: true,
    },
    office: {
      type: Object,
      required: true,
    },
  },

  setup(props: { mini: boolean; office: Works }) {
    const userState = useGlobalState()
    userState.workInfo.value = props.office
    const state = reactive<{
      currentOffice: string
      dialog: boolean
    }>({
      currentOffice: props.office.id,
      dialog: false,
    })
    const items = [
      {
        icon: 'mdi-apps',
        title: '取引管理',
        to: '/',
      },
      {
        icon: 'mdi-table',
        title: '項目別集計表',
        to: '/totals',
      },
      {
        icon: 'mdi-table-multiple',
        title: '項目別明細表',
        to: '/details',
      },
      {
        icon: 'mdi-chart-bar',
        title: '収支レポート',
        to: '/chart',
      },
      {
        icon: 'mdi-hexagon-slice-4',
        title: 'オプション',
        to: '/option',
      },
    ]
    const dialogOpenClose = (v: boolean) => {
      state.dialog = v
    }
    const updateClientCost = (record: InsertUpdateWorks, v: boolean) => {
      state.dialog = v
      userState.updateMyOffice(record)
    }
    return {
      items,
      ...toRefs(state),
      updateClientCost,
      dialogOpenClose,
      userState,
    }
  },
})
</script>
