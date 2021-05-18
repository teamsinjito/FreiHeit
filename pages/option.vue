<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
  >
    <!-- ヘッダー項目 -->
    <option-header-bar></option-header-bar>
    <v-divider></v-divider>
    <v-card flat rounded="0" class="mb-2 py-5">
      <v-card-text>
        <v-row
          ><v-col cols="12" sm="6">
            <v-expansion-panels focusable multiple>
              <v-expansion-panel>
                <v-expansion-panel-header color="primary" class="white--text"
                  >取引先設定 </v-expansion-panel-header
                ><v-expansion-panel-content class="pt-5">
                  <v-toolbar flat>
                    <v-toolbar-title
                      class="text-sm-subtitle-1 text-caption font-weight-black"
                      >取引先一覧</v-toolbar-title
                    >
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <!-- 取引先追加ボタン ダイアログ -->
                    <v-dialog v-model="dialog" max-width="500px">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          dark
                          class="text-sm-button text-caption"
                          v-bind="attrs"
                          v-on="on"
                        >
                          New
                        </v-btn>
                      </template>
                      <v-card>
                        <v-toolbar color="primary" flat>
                          <v-card-title>
                            <span
                              class="white--text text-subtitle-1 font-weight-black"
                              >取引先追加</span
                            >
                          </v-card-title>
                        </v-toolbar>
                        <v-card-text>
                          <v-container class="my-3">
                            <v-card-subtitle class="px-0 mb-4"
                              >取引先名称を入力してください</v-card-subtitle
                            >
                            <v-row>
                              <v-text-field required></v-text-field></v-row
                          ></v-container>
                          <small>
                            <v-checkbox v-model="checkbox">
                              <template #label>
                                <span class="text-caption font-weight-bold"
                                  >連続して取引先を登録する</span
                                >
                              </template>
                            </v-checkbox></small
                          >
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="dialog = false"
                          >
                            キャンセル
                          </v-btn>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="dialog = false"
                          >
                            保存
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                  <v-divider></v-divider>
                  <!-- テーブル -->
                  <v-simple-table fixed-header height="40vh">
                    <template #default>
                      <tbody>
                        <tr>
                          <td class="text-caption">AA社</td>
                          <td class="text-right">
                            <v-icon
                              small
                              style="font-size: 0.4rem"
                              class="ml-sm-3 text-sm-caption font-weight-bold"
                              @click="editItem(item)"
                            >
                              mdi-greater-than
                            </v-icon>
                          </td>
                        </tr>
                        <tr>
                          <td class="text-caption">BB社</td>
                          <td class="text-right">
                            <v-icon
                              small
                              style="font-size: 0.4rem"
                              class="ml-sm-3 text-sm-caption font-weight-bold"
                              @click="editItem(item)"
                            >
                              mdi-greater-than
                            </v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col cols="12" sm="6">
            <v-expansion-panels focusable multiple>
              <v-expansion-panel>
                <v-expansion-panel-header color="primary" class="white--text"
                  >固定経費設定 </v-expansion-panel-header
                ><v-expansion-panel-content class="pt-5">
                  <v-toolbar flat>
                    <v-toolbar-title
                      class="text-sm-subtitle-1 text-caption font-weight-black"
                      >固定経費一覧</v-toolbar-title
                    >
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <!-- 固定経費追加ボタン ダイアログ -->
                    <v-dialog v-model="dialog" max-width="500px">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          dark
                          class="text-sm-button text-caption"
                          v-bind="attrs"
                          v-on="on"
                        >
                          New
                        </v-btn>
                      </template>
                      <v-card>
                        <v-toolbar color="primary" flat>
                          <v-card-title>
                            <span
                              class="white--text text-subtitle-1 font-weight-black"
                              >固定経費追加</span
                            >
                          </v-card-title>
                        </v-toolbar>
                        <v-card-text>
                          <v-container class="my-3">
                            <v-card-subtitle class="px-0 mb-4"
                              >固定経費名称を入力してください</v-card-subtitle
                            >
                            <v-row>
                              <v-text-field required></v-text-field></v-row
                          ></v-container>
                          <small>
                            <v-checkbox v-model="checkbox">
                              <template #label>
                                <span class="text-caption font-weight-bold"
                                  >連続して固定経費を登録する</span
                                >
                              </template>
                            </v-checkbox></small
                          >
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="dialog = false"
                          >
                            キャンセル
                          </v-btn>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="dialog = false"
                          >
                            保存
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                  <v-divider></v-divider>
                  <!-- テーブル -->
                  <v-simple-table height="40vh">
                    <template #default>
                      <tbody>
                        <tr>
                          <td class="text-caption">コインパーキング・高速</td>
                          <td class="text-right">
                            <v-icon
                              small
                              style="font-size: 0.4rem"
                              class="ml-sm-3 text-sm-caption font-weight-bold"
                              @click="editItem(item)"
                            >
                              mdi-greater-than
                            </v-icon>
                          </td>
                        </tr>
                        <tr>
                          <td class="text-caption">インターネット</td>
                          <td class="text-right">
                            <v-icon
                              small
                              style="font-size: 0.4rem"
                              class="ml-sm-3 text-sm-caption font-weight-bold"
                              @click="editItem(item)"
                            >
                              mdi-greater-than
                            </v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import HeaderBar from '~/components/option/OptionHeaderBar.vue'

export default defineComponent({
  components: {
    HeaderBar,
  },
  //   middleware: 'userAuth',
  setup() {
    const dialog = false
    const checkbox = false
    return { dialog, checkbox }
  },
})
</script>
