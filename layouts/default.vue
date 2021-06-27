<template>
  <v-app v-if="userState.displayShow.value && !display">
    <!-- サイドバー -->
    <nav-drawer
      :mini="mini"
      :work-info="userState.workInfo.value"
      :office="office"
    ></nav-drawer>
    <!-- ヘッダー -->
    <app-bar :mini="mini" @switch="switchNavVar"></app-bar>

    <!-- メイン -->
    <v-main style="background-color: whitesmoke">
      <v-container fluid class="fill-height">
        <nuxt />
      </v-container>
      <v-snackbar
        v-model="userState.snackInfo.value.view"
        timeout="3000"
        :color="userState.snackInfo.value.color"
        >{{ userState.snackInfo.value.text }}
      </v-snackbar>
    </v-main>
    <!-- フッター -->
    <v-footer color="justify-center text-caption">© 2021 Team SINJITO</v-footer>
    <!-- オーバレイ -->
    <v-overlay
      v-model="userState.overlayShow.value"
      z-index="7"
      style="text-align: center"
    >
      <p>{{ userState.overlayText.value }}</p>
      <v-progress-circular :value="20" indeterminate> </v-progress-circular>
    </v-overlay>
  </v-app>
  <v-app v-else-if="userState.displayShow.value && display">
    <v-dialog v-model="display" persistent max-width="600px">
      <my-office-form
        v-if="display"
        :dialog="display"
        title="事業所追加"
        subtitle="初めに事業所名称を入力してください"
        :continue-flg="false"
        :cancel-flg="false"
        btn-name="登録"
        :default-records="newRecord"
        @exec="insertClientCost"
        @open-close="dialogOpenClose"
      ></my-office-form>
    </v-dialog>
  </v-app>
  <v-app v-else
    ><v-sheet
      height="100%"
      width="100%"
      color="transparent"
      class="overflow-hidden"
      ><v-container fluid class="fill-height text-center"
        ><v-col cols="12" class="text-center"
          >Now Loading...</v-col
        ></v-container
      ></v-sheet
    ></v-app
  >
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'
import {
  provideGlobalState,
  useGlobalState,
  getDefaultWork,
} from '../composables/useDefault'
import { Works, InsertUpdateWorks } from '../composables/interface'
import appBar from '~/components/default/appBar.vue'
import NavDrawer from '~/components/default/navDrawer.vue'
export default defineComponent({
  components: { appBar, NavDrawer },
  middleware: 'userAuth',

  setup(_props, context) {
    const state = reactive<{
      mini: boolean // ナビゲーションドロワーの開閉状態
      office: {
        id: string
        name: string
        last: string
      }
      display: boolean
      newRecord: Works
    }>({
      mini: false,
      office: {
        id: '',
        name: '',
        last: '',
      },
      display: false,
      newRecord: {
        id: '',
        name: '',
        last: '',
      },
    })
    getDefaultWork(context.root.$store.$auth.user.sub as string).then((r) => {
      state.office = r
      if (state.office.id === '') {
        state.display = true
      }
    })

    provideGlobalState(context.root.$store.$auth.user.sub as string)
    const userState = useGlobalState()
    // 関数群
    const switchNavVar = (m: boolean) => {
      state.mini = m
    }
    const dialogOpenClose = (v: boolean) => {
      state.display = v
    }
    const insertClientCost = (record: InsertUpdateWorks) => {
      userState.insertMyOffice(record).then(() => {
        location.reload()
      })
    }
    return {
      ...toRefs(state),
      switchNavVar,
      userState,
      dialogOpenClose,
      insertClientCost,
    }
  },
})
</script>
