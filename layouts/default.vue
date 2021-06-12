<template>
  <v-app v-if="userState.displayShow.value">
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
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'
import {
  provideGlobalState,
  useGlobalState,
  getDefaultWork,
} from '../composables/useDefault'
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
    }>({
      mini: false,
      office: {
        id: '',
        name: '',
        last: '',
      },
      display: false,
    })
    getDefaultWork(context.root.$store.$auth.user.sub as string).then((r) => {
      state.office = r
      console.log('state', state.office)
      state.display = true
    })
    provideGlobalState(context.root.$store.$auth.user.sub as string)
    const userState = useGlobalState()
    console.log(userState)
    // 関数群
    const switchNavVar = (m: boolean) => {
      state.mini = m
    }

    return {
      ...toRefs(state),
      switchNavVar,
      userState,
    }
  },
})
</script>
