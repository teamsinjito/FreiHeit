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
        <v-row>
          <v-expansion-panels v-model="panel" focusable multiple>
            <v-col cols="12" sm="6">
              <v-expansion-panel :key="0">
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
                    <add-client-cost
                      title="取引先追加"
                      subtitle="取引先名称を入力してください"
                      :iflg="clientNum"
                    ></add-client-cost>
                  </v-toolbar>
                  <v-divider></v-divider>
                  <!-- テーブル -->
                  <v-data-table
                    fixed-header
                    :items="filterClientOrCost(1)"
                    height="40vh"
                    :items-per-page="100"
                    hide-default-header
                    hide-default-footer
                    style="overflow: auto; max-height: 40vh"
                  >
                    <template #[`item`]="{ item }">
                      <tr>
                        <th class="text-caption">
                          <v-avatar
                            :color="item.color"
                            size="13"
                            class="mr-3"
                          ></v-avatar>
                          {{ item.name }}
                        </th>
                        <th class="text-right">
                          <update-client-cost
                            title="取引先更新"
                            subtitle="取引先名称を編集できます"
                            :iflg="clientNum"
                            :default-record="item"
                          ></update-client-cost>
                        </th>
                      </tr>
                    </template>
                  </v-data-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-col>
            <v-col cols="12" sm="6">
              <v-expansion-panel :key="1">
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
                    <add-client-cost
                      title="固定経費追加"
                      subtitle="固定経費を入力してください"
                      :iflg="costNum"
                    ></add-client-cost>
                  </v-toolbar>
                  <v-divider></v-divider>
                  <!-- テーブル -->
                  <v-data-table
                    fixed-header
                    :items="filterClientOrCost(2)"
                    height="40vh"
                    :items-per-page="100"
                    hide-default-header
                    hide-default-footer
                    style="overflow: auto; max-height: 40vh"
                  >
                    <template #[`item`]="{ item }">
                      <tr>
                        <th class="text-caption">
                          <v-avatar
                            :color="item.color"
                            size="13"
                            class="mr-3"
                          ></v-avatar>
                          {{ item.name }}
                        </th>
                        <th class="text-right">
                          <update-client-cost
                            title="固定経費更新"
                            subtitle="固定経費名称を編集できます"
                            :iflg="costNum"
                            :default-record="item"
                          ></update-client-cost>
                        </th>
                      </tr>
                    </template>
                  </v-data-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-col>
          </v-expansion-panels>
        </v-row>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { useGlobalState } from '../composables/useDefault'
import AddClientCost from '~/components/option/AddClientCost.vue'
import OptionHeaderBar from '~/components/option/OptionHeaderBar.vue'
import UpdateClientCost from '~/components/option/UpdateClientCost.vue'
export default defineComponent({
  components: {
    OptionHeaderBar,
    AddClientCost,
    UpdateClientCost,
  },
  setup() {
    const userState = useGlobalState()
    const clientNum = 1
    const costNum = 2
    const state = reactive<{
      panel: number[]
    }>({ panel: [0, 1] })
    const dialog = false
    const checkbox = false
    const filterClientOrCost = (n: number) => {
      return userState.clientsAndCostsInfo.value.filter((r) => r.iflg === n)
    }

    return {
      dialog,
      checkbox,
      userState,
      filterClientOrCost,
      clientNum,
      costNum,
      ...toRefs(state),
    }
  },
})
</script>
