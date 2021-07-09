<template>
  <!-- ヘッダー -->
  <v-app-bar :clipped-left="false" app>
    <!-- アプリ名 -->
    <v-app-bar-nav-icon @click.stop="switchNavVarCall" />
    <v-app-bar-title v-text="title"></v-app-bar-title>
    <v-spacer></v-spacer>
    <v-menu bottom min-width="200px" rounded offset-y>
      <template #activator="{ on }">
        <v-btn icon x-large v-on="on">
          <v-avatar size="24">
            <img :src="authUser.pic" :alt="authUser.name" />
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-list-item-content class="justify-center">
          <v-list-item-title class="mx-auto text-center">
            <v-avatar class="mb-4">
              <img :src="authUser.pic" :alt="authUser.name" />
            </v-avatar>
            <h4>{{ authUser.name }}</h4>
            <span class="text-caption mt-1">
              {{ authUser.email }}
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </v-card>
    </v-menu>
    <!-- ヘルプアイコン -->
    <v-dialog v-model="helpShow" width="100%">
      <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" @click="setHelpInfo()">
          <v-icon>mdi-progress-question</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-subtitle-1"> 取引登録の流れ </v-card-title>
        <v-carousel
          v-model="carousel"
          height="100%"
          hide-delimiters
          hide-delimiter-background
        >
          <v-carousel-item v-for="(n, index) in helps" :key="index">
            <v-sheet height="100%" light tile>
              <v-row class="fill-height" align="center">
                <v-col sm="8" cols="12">
                  <v-img
                    height="100%"
                    width="100%"
                    :src="`/${n.title}.png`"
                  ></v-img>
                </v-col>
                <v-col sm="3" cols="12">
                  <v-card-text class="text-caption">{{ n.body }}</v-card-text>
                </v-col>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="helpShow = false"> 閉じる </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        email: string
      }
      snack: {
        text: string
        color: string
        view: boolean
      }
      helpShow: boolean
      helps: { title: string; body: string }[]
      carousel: number
    }>({
      authUser: {
        name: '名無し',
        pic: 'mdi-account-settings',
        email: '',
      },
      snack: {
        text: '',
        color: '',
        view: false,
      },
      helpShow: false,
      carousel: 0,
      helps: [],
    })
    const userState = useGlobalState()
    const preYear = new Date().getFullYear() - 1
    const title = 'FreiHeit'
    const yearList = [
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
      { num: 2031 },
      { num: 2032 },
      { num: 2033 },
      { num: 2034 },
      { num: 2035 },
      { num: 2036 },
      { num: 2037 },
      { num: 2038 },
      { num: 2039 },
      { num: 2040 },
    ]

    onBeforeMount(() => {
      state.authUser.name = context.root.$store.$auth.user.name as string
      state.authUser.pic = context.root.$store.$auth.user.picture as string
      state.authUser.email = context.root.$store.$auth.user.email as string
    })

    const changeCarrentYear = () => {
      userState.changeYearRecordsManagement(userState.currentSysYear.value.num)
    }
    const switchNavVarCall = () => {
      context.emit('switch', !props.mini)
    }
    const setHelpInfo = () => {
      state.helps = []
      userState.helpsInfo.value.forEach((h) => {
        state.helps.push(h)
      })
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
      setHelpInfo,
      userState,
    }
  },
})
</script>
