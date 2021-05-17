<template>
  <v-app>
    <!-- サイドバー -->
    <nav-drawer :mini="mini" @switch="switchNavVar"></nav-drawer>
    <!-- ヘッダー -->
    <app-bar :mini="mini" @switch="switchNavVar"></app-bar>

    <!-- メイン -->
    <v-main style="background-color: whitesmoke">
      <v-container fluid class="fill-height">
        <nuxt />
      </v-container>
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
} from '@nuxtjs/composition-api'
import { provideGlobalState } from '../composables/useDefault'
import appBar from '~/components/default/appBar.vue'
import NavDrawer from '~/components/default/navDrawer.vue'
export default defineComponent({
  components: { appBar, NavDrawer },
  middleware: 'userAuth',
  setup(_props, context) {
    const state = reactive<{
      mini: boolean // ナビゲーションドロワーの開閉状態
    }>({
      mini: true,
    })

    // 関数群
    const switchNavVar = (m: boolean) => {
      state.mini = m
    }
    onBeforeMount(() => {
      provideGlobalState(context.root.$store.$auth.user.sub as string)
    })

    return {
      ...toRefs(state),
      switchNavVar,
    }
  },
})
</script>
