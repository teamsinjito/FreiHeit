<template>
  <v-app>
    <!-- サイドバー -->
    <nav-drawer
      :mini="mini"
      :work-info="userState.workInfo.value"
      @switch="switchNavVar"
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
  </v-app>
</template>

<script lang="ts">
import {
  onBeforeMount,
  defineComponent,
  reactive,
  toRefs,
  onMounted,
} from '@nuxtjs/composition-api'
import { provideGlobalState, useGlobalState } from '../composables/useDefault'
import appBar from '~/components/default/appBar.vue'
import NavDrawer from '~/components/default/navDrawer.vue'
export default defineComponent({
  components: { appBar, NavDrawer },
  middleware: 'userAuth',
  setup(_props, context) {
    const state = reactive<{
      mini: boolean // ナビゲーションドロワーの開閉状態
    }>({
      mini: false,
    })
    provideGlobalState(context.root.$store.$auth.user.sub as string)
    const userState = useGlobalState()
    // console.log('useState.workInfo', userState.workInfo)
    // console.log('userState.WorkINfo', userState.workInfo.value)
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
