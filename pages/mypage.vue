<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
  >
    <my-page-header-bar></my-page-header-bar><v-divider></v-divider>
    <v-card flat rounded="0" class="mb-2 py-5">
      <v-card-text>
        <v-row
          ><v-expansion-panels v-model="panel" focusable multiple>
            <v-col cols="12" md="4">
              <v-expansion-panel :key="0">
                <v-expansion-panel-header color="primary" class="white--text"
                  >アカウント情報 </v-expansion-panel-header
                ><v-expansion-panel-content class="pt-5">
                  <v-list>
                    <v-list-item>
                      <v-list-item-avatar>
                        <v-img :src="authUser.pic"></v-img>
                      </v-list-item-avatar>
                    </v-list-item>

                    <v-list-item link>
                      <v-list-item-content>
                        <v-list-item-title
                          class="text-title font-weight-medium"
                        >
                          {{ authUser.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{
                          authUser.email
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-divider></v-divider>
                  <v-toolbar flat>
                    <v-toolbar-title
                      class="text-sm-subtitle-1 text-caption font-weight-black"
                      >事業所一覧</v-toolbar-title
                    >
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <!-- 事業所追加ボタン ダイアログ -->
                    <add-my-office
                      title="事業所追加"
                      subtitle="事業所名称を入力してください"
                    ></add-my-office>
                  </v-toolbar>
                  <v-divider></v-divider>
                  <!-- テーブル -->
                  <v-data-table
                    fixed-header
                    :items="userState.workInfo.value"
                    height="30vh"
                    :items-per-page="100"
                    hide-default-header
                    hide-default-footer
                    style="overflow: auto; max-height: 40vh"
                  >
                    <template #[`item`]="{ item }">
                      <tr>
                        <th class="text-caption">
                          {{ item.name }}
                        </th>
                        <th class="text-right">
                          <update-my-office
                            title="事業所名更新"
                            subtitle="事業所名称を編集できます"
                            :default-record="item"
                          ></update-my-office>
                        </th>
                      </tr>
                    </template>
                  </v-data-table> </v-expansion-panel-content
              ></v-expansion-panel>
            </v-col>
            <v-col cols="12" md="8">
              <v-expansion-panel :key="1">
                <v-expansion-panel-header color="primary" class="white--text"
                  >取引登録履歴 </v-expansion-panel-header
                ><v-expansion-panel-content
                  class="pt-5"
                  style="overflow: auto; max-height: 58vh"
                >
                  <v-timeline dense>
                    <v-timeline-item
                      v-for="item in filterItemWithCreatedAt()"
                      :key="item.id"
                      small
                    >
                      <v-card class="elevation-2">
                        <v-card-title
                          class="text-sm-caption"
                          style="background: #eeeeee; font-size: 0.25rem;!important"
                        >
                          {{
                            item.day.slice(0, 4) +
                            '年' +
                            item.day.slice(5, 7) +
                            '月' +
                            item.day.slice(8, 10) +
                            '日'
                          }}
                        </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" md="8">
                              <span
                                class="font-weight-bold text-sm-caption"
                                style="font-size: 0.4rem"
                                >勘定科目：{{ getSubjectName(item.sid) }}
                              </span>
                              <br />
                              <span
                                class="font-weight-bold text-sm-caption"
                                style="font-size: 0.4rem"
                                >摘要：{{ item.note }}
                              </span>
                            </v-col>
                            <v-col
                              cols="12"
                              md="4"
                              class="text-right"
                              style="align-self: center"
                            >
                              <span
                                class="text-sm-caption font-weight-bold"
                                style="font-size: 0.4rem"
                                >{{ Number(item.pay).toLocaleString() }} 円
                              </span></v-col
                            >
                          </v-row>
                          <v-divider></v-divider>
                          <v-row class="mt-1">
                            <v-col cols="12" class="text-right">
                              <span
                                class="text-sm-caption"
                                style="font-size: 0.4rem"
                                >{{ item.update }} | EDIT</span
                              >
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-timeline-item>
                  </v-timeline>
                </v-expansion-panel-content></v-expansion-panel
              >
            </v-col>
          </v-expansion-panels>
        </v-row>
      </v-card-text></v-card
    >
  </v-sheet>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  onBeforeMount,
  toRefs,
} from '@vue/composition-api'
import { useGlobalState } from '../composables/useDefault'
import AddMyOffice from '~/components/mypage/AddMyOffice.vue'
import UpdateMyOffice from '~/components/mypage/UpdateMyOffice.vue'
import MyPageHeaderBar from '~/components/mypage/MyPageHeaderBar.vue'
export default defineComponent({
  components: { MyPageHeaderBar, AddMyOffice, UpdateMyOffice },
  setup(props, context) {
    const userState = useGlobalState()
    const state = reactive<{
      authUser: {
        name: string
        pic: string
        email: string
      }
      panel: number[]
    }>({
      authUser: {
        name: '名無し',
        pic: 'mdi-account-settings',
        email: 'none-email@email.com',
      },
      panel: [0, 1],
    })
    onBeforeMount(() => {
      state.authUser.name = context.root.$store.$auth.user.name as string
      state.authUser.pic = context.root.$store.$auth.user.picture as string
      state.authUser.email = context.root.$store.$auth.user.email as string
    })

    const filterItemWithCreatedAt = () => {
      const copy = userState.workRecordsManagement.value.concat()
      return copy.sort((n1, n2) => {
        if (n1.update > n2.update) {
          return -1
        }
        if (n1.update < n2.update) {
          return 1
        }
        return 0
      })
    }
    const getSubjectName = (m: string) => {
      return userState.subjectsInfo.value.filter((s) => s.id === m)[0].name
    }
    return {
      ...toRefs(state),
      userState,
      filterItemWithCreatedAt,
      getSubjectName,
    }
  },
})
</script>
