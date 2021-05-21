<template>
  <!-- ヘッダー -->
  <v-app-bar :clipped-left="false" app>
    <!-- アプリ名 -->
    <v-app-bar-nav-icon @click.stop="switchNavVarCall" />
    <v-app-bar-title v-text="title"></v-app-bar-title>
    <v-spacer></v-spacer>
    <!-- ヘルプアイコン -->
    <v-btn icon>
      <v-icon>mdi-progress-question</v-icon>
    </v-btn>
    <!-- 設定アイコン -->
    <v-menu offset-y :close-on-content-click="false">
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
              <v-list-item-title style="width: 170px">
                <v-select
                  v-model="userState.currentSysYear.value.num"
                  label="会計期間"
                  item-value="num"
                  item-text="num"
                  :items="yearList"
                  suffix="年度"
                  style="font-size: 0.9rem"
                  @change="changeCarrentYear()"
                ></v-select
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-avatar height="24px" width="24px" min-width="24px"
                ><img :src="authUser.pic" :alt="authUser.name"
              /></v-avatar>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title style="font-size: 0.9rem">{{
                authUser.name
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                style="font-size: 0.9rem"
                @click="logoutWithAuth0"
                >ログアウト</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  onBeforeMount,
  toRefs,
} from '@vue/composition-api'
import { useGlobalState } from '../../composables/useDefault'
export default defineComponent({
  props: {
    mini: {
      type: Boolean,
      required: true,
    },
  },
  setup(props: { mini: boolean }, context) {
    const state = reactive<{
      authUser: {
        name: string
        pic: string
      }
      snack: {
        text: string
        color: string
        view: boolean
      }
    }>({
      authUser: {
        name: '名無し',
        pic: 'mdi-account-settings',
      },
      snack: {
        text: '',
        color: '',
        view: false,
      },
    })
    const userState = useGlobalState()
    const preYear = new Date().getFullYear() - 1
    const title = 'FreiHeit'
    const yearList = [
      { num: 2013 },
      { num: 2014 },
      { num: 2015 },
      { num: 2016 },
      { num: 2017 },
      { num: 2018 },
      { num: 2019 },
      { num: 2020 },
      { num: 2021 },
      { num: 2022 },
      { num: 2023 },
      { num: 2024 },
      { num: 2025 },
      { num: 2026 },
      { num: 2027 },
      { num: 2028 },
      { num: 2029 },
      { num: 2030 },
    ]

    onBeforeMount(() => {
      state.authUser.name = context.root.$store.$auth.user.name as string
      state.authUser.pic = context.root.$store.$auth.user.picture as string
    })

    const changeCarrentYear = () => {
      userState.changeYearRecordsManagement(userState.currentSysYear.value.num)
    }
    const switchNavVarCall = () => {
      context.emit('switch', !props.mini)
    }
    const logoutWithAuth0 = () => {
      window.alert('ログアウトします')
      context.root.$auth.logout()
    }

    return {
      ...toRefs(state),
      preYear,
      title,
      yearList,
      changeCarrentYear,
      switchNavVarCall,
      logoutWithAuth0,
      userState,
    }
  },
})
</script>
