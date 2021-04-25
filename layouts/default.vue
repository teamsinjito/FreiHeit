<template>
  <v-app>
    <nav-var :minimini="mini" @miniminiC="miniminiChengeP"></nav-var>
    <!-- サイドバー -->
    <!-- <v-navigation-drawer :mini-variant="mini" fixed permanent app dark>
      <v-list-item class="px-2 my-sm-1">
        <v-list-item-avatar color="primary">
          <v-icon>mdi-home-city</v-icon>
        </v-list-item-avatar>

        <v-list-item-title>{{ office }}</v-list-item-title>
        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
      <v-divider></v-divider>

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
    </v-navigation-drawer> -->

    <!-- ヘッダー -->
    <v-app-bar :clipped-left="false" app>
      <!-- アプリ名 -->
      <v-app-bar-nav-icon @click.stop="mini = !mini" />
      <v-app-bar-title v-text="title"></v-app-bar-title>
      <v-spacer></v-spacer>
      <!-- ヘルプアイコン -->
      <v-btn icon>
        <v-icon>mdi-progress-question</v-icon>
      </v-btn>
      <!-- 設定アイコン -->
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list flat>
          <v-list-item-group color="primary">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-calendar-month</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>会計期間：2021年度</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account-settings</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>ユーザ設定</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-logout-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title @click="logoutWithAuth0"
                  >ログアウト</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>

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
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'
export default defineComponent({
  middleware: 'userAuth',
  setup(_props, context) {
    // const mini = false

    const state = reactive<{
      mini: boolean
    }>({
      mini: true,
    })

    const title = 'FreiHeit'

    const miniminiChengeP = (miniVal: boolean) => {
      state.mini = miniVal
    }
    const logoutWithAuth0 = () => {
      window.alert('ログアウトします')
      context.root.$auth.logout()
    }
    return {
      // mini,
      ...toRefs(state),

      title,
      miniminiChengeP,
      logoutWithAuth0,
    }
  },
})
</script>
