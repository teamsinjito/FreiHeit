<template>
  <!-- 取引追加ダイアログ -->
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-card>
      <v-toolbar color="primary" flat>
        <v-card-title style="width: 100%">
          <v-col cols="10" sm="11">
            <span class="white--text text-subtitle-1 font-weight-black">{{
              title
            }}</span>
          </v-col>
          <v-col cols="1" sm="1"
            ><v-icon
              v-if="!continueFlg"
              class="white--text"
              @click="deleteRecord"
              >mdi-trash-can-outline</v-icon
            ></v-col
          >
        </v-card-title>
      </v-toolbar>
      <v-card-text>
        <v-container style="max-height: 430px; overflow: auto">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="inputDate"
                label="取引発生日"
                type="date"
                filled
                dense
                :rules="dayRules"
                class="text-caption text-sm-subtitle-2"
                ><template #[`label`]>
                  <label class="text-caption text-sm-subtitle-2"
                    ><v-icon class="text-caption text-sm-subtitle-2"
                      >mdi-calendar-edit</v-icon
                    >：取引発生日</label
                  ><span class="red--text ml-3">*</span>
                </template></v-text-field
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" class="py-0">
              <v-autocomplete
                v-model="inputSubject"
                class="text-caption"
                :items="userState.subjectsInfo.value"
                item-value="id"
                item-text="name"
                label="勘定科目"
                outlined
                :rules="nameRules"
                required
                dense
                ><template #[`label`]>
                  <label class="text-caption"
                    ><v-icon class="text-caption">mdi-tag</v-icon
                    >：勘定科目</label
                  ><span class="red--text ml-3">*</span>
                </template></v-autocomplete
              >
            </v-col>
            <v-col cols="12" sm="6" class="py-0">
              <v-text-field
                v-model="inputPay"
                class="text-caption"
                label="金額"
                outlined
                required
                :rules="payRules"
                type="text"
                suffix="円"
                dense
                @input="repNumber"
                ><template #[`label`]>
                  <label class="text-caption"
                    ><v-icon class="text-caption"
                      >mdi-label-variant-outline</v-icon
                    >金額</label
                  ><span class="red--text ml-3">*</span>
                </template></v-text-field
              >
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-card>
                <v-card-title class="text-caption"
                  ><v-icon class="text-caption">mdi-comment</v-icon
                  ><span style="opacity: 0.6"
                    >：取引内訳（以下1つのみ入力）</span
                  ><span class="red--text ml-1">*</span>
                  <span v-if="validErrFlg" class="red--text ml-3"
                    >※いずれか入力必須です</span
                  >
                </v-card-title>
                <v-col cols="12" class="py-0">
                  <v-combobox
                    key="0"
                    v-model="inputClientAndCostValueAry[0]"
                    :items="filterClientAndCost(0)"
                    item-text="name"
                    class="text-caption"
                    :search-input.sync="noDataValue"
                    label="取引先"
                    outlined
                    cache-items
                    small-chips
                    item-value="name"
                    :return-object="false"
                    dense
                    @change="changeClientAndCost(0)"
                    ><template #[`label`]>
                      <label class="text-caption"
                        ><v-icon class="text-caption"
                          >mdi-office-building-outline</v-icon
                        >：取引先</label
                      ></template
                    ><template #[`no-data`]>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="text-caption">
                            候補が存在しません。入力後、<kbd>Enter</kbd>キーを押して追加してください。
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template></v-combobox
                  >
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-combobox
                    key="1"
                    v-model="inputClientAndCostValueAry[1]"
                    :items="filterClientAndCost(1)"
                    item-text="name"
                    class="text-caption"
                    :search-input.sync="noDataValue"
                    label="品目"
                    outlined
                    cache-items
                    small-chips
                    item-value="name"
                    :return-object="false"
                    dense
                    @change="changeClientAndCost(1)"
                    ><template #[`label`]>
                      <label class="text-caption"
                        ><v-icon class="text-caption">mdi-layers-triple</v-icon
                        >：品目</label
                      ></template
                    ><template #[`no-data`]>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="text-caption">
                            候補が存在しません。入力後、<kbd>Enter</kbd>キーを押して追加してください。
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template></v-combobox
                  >
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-combobox
                    key="2"
                    v-model="inputClientAndCostValueAry[2]"
                    :items="filterClientAndCost(2)"
                    item-text="name"
                    class="text-caption"
                    :search-input.sync="noDataValue"
                    label="固定経費"
                    outlined
                    cache-items
                    small-chips
                    item-value="name"
                    :return-object="false"
                    dense
                    @change="changeClientAndCost(2)"
                    ><template #[`label`]>
                      <label class="text-caption"
                        ><v-icon class="text-caption">mdi-file-table</v-icon
                        >：固定経費</label
                      ></template
                    ><template #[`no-data`]>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="text-caption">
                            候補が存在しません。入力後、<kbd>Enter</kbd>キーを押して追加してください。
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template></v-combobox
                  >
                </v-col>
              </v-card>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea
                v-model="inputNote"
                label="メモ"
                class="text-caption"
                :rules="maxRules"
                outlined
                dense
                counter="140"
                ><template #[`label`]>
                  <label class="text-caption"
                    ><v-icon class="text-caption">mdi-card-text-outline</v-icon
                    >：メモ</label
                  >
                </template></v-textarea
              >
            </v-col>
          </v-row>
        </v-container>
        <small v-if="continueFlg">
          <v-checkbox v-model="checkbox">
            <template #label>
              <span class="text-caption font-weight-bold"
                >連続して取引を登録する</span
              >
            </template>
          </v-checkbox></small
        >
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancelDialog()">
          キャンセル
        </v-btn>
        <v-btn color="blue darken-1" text @click="execCash()">{{
          btnName
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  onMounted,
} from '@vue/composition-api'
import { useGlobalState } from '../../composables/useDefault'
import { RecordsManagement } from '../../composables/interface'
export default defineComponent({
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    continueFlg: {
      type: Boolean,
      required: true,
    },
    btnName: {
      type: String,
      required: true,
    },
    defaultRecords: {
      type: Object,
      required: true,
    },
  },
  setup(
    props: {
      dialog: boolean
      title: string
      continueFlg: boolean
      btnName: string
      defaultRecords: RecordsManagement
    },
    context
  ) {
    const userState = useGlobalState()

    const form = ref()
    // ルール
    const payRules = [
      (v: string) => !!v || '※入力必須です',
      (v: string) => v.length <= 12 || '※9桁以下で入力してください',
      (v: string) =>
        /^0$|^[1-9]\d{0,2}(,\d{3})*$|^[0-9 ]+$/.test(v) ||
        '※半角数値のみ入力してください',
    ]
    const maxRules = [
      (v: string) => v.length <= 140 || '※140文字以下で入力してください',
    ]
    const nameRules = [(v: string) => !!v || '※入力必須です']

    const dayRules = [
      (v: string) => !!v || '※入力必須です',
      (v: string) => v.length <= 10 || '※10文字以下で入力してください',
      (v: string) =>
        (Number(v.slice(0, 4)) >= 2000 && Number(v.slice(0, 4)) <= 2099) ||
        '※2000年から2099年の範囲で入力してください',
    ]
    onMounted(() => {
      toNameFromidClientsAndCost()
    })
    const filterClientAndCost = (n: number) => {
      return userState.clientsAndCostsInfo.value.filter((i) => {
        return i.iflg === n
      })
    }
    const changeClientAndCost = (n: number) => {
      if (n === 0) {
        state.inputClientAndCostValueAry[1] = ''
        state.inputClientAndCostValueAry[2] = ''
      } else if (n === 1) {
        state.inputClientAndCostValueAry[0] = ''
        state.inputClientAndCostValueAry[2] = ''
      } else {
        state.inputClientAndCostValueAry[0] = ''
        state.inputClientAndCostValueAry[1] = ''
      }

      // 存在チェック
      const num = userState.clientsAndCostsInfo.value.filter((c) => {
        return c.name === state.inputClientAndCostValueAry[n]
      }).length

      // 存在していない場合新規登録
      if (num === 0) {
        userState.insertClientCost({
          id: '',
          wid: userState.workInfo.value.id,
          name: state.inputClientAndCostValueAry[n],
          iflg: n,
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        })
      }
      state.validErrFlg = false
    }
    const toNameFromidClientsAndCost = () => {
      const tmpVal = userState.clientsAndCostsInfo.value
        .filter((i) => {
          return i.id === props.defaultRecords.cid
        })
        .map((i) => {
          return { name: i.name, iflg: i.iflg }
        })[0]
      if (tmpVal !== undefined) {
        state.inputClientAndCostValueAry[tmpVal.iflg] = tmpVal.name
      }
    }
    const toIdFromNameClientsAndCost = () => {
      state.inputClientAndCostValue = userState.clientsAndCostsInfo.value
        .filter((i) => {
          return i.name === state.inputClientAndCostValueAry[i.iflg]
        })
        .map((i) => {
          return i.id
        })[0]
    }
    const state = reactive<{
      valid: boolean
      id: string
      checkbox: boolean
      inputPay: string
      inputDate: string
      inputSubject: string
      inputClientAndCost: string
      inputClientAndCostValue: string
      inputClientAndCostValueAry: string[]
      noDataValue: string
      inputNote: string
      validErrFlg: boolean
    }>({
      valid: false,
      id: props.defaultRecords.id,
      checkbox: props.continueFlg,
      inputDate: props.defaultRecords.day,
      inputPay: props.defaultRecords.pay.toLocaleString().toString(),
      inputSubject: props.defaultRecords.sid,
      inputClientAndCost: props.defaultRecords.cid,
      inputClientAndCostValue: '',
      inputClientAndCostValueAry: [],
      noDataValue: '',
      inputNote: props.defaultRecords.note,
      validErrFlg: false,
    })
    // 金額の3桁区切り変換
    const repNumber = () => {
      state.inputPay = Number(
        state.inputPay.replaceAll(',', '')
      ).toLocaleString()
    }

    const cancelDialog = () => {
      context.emit('open-close', !props.dialog)
    }

    const execCash = () => {
      toIdFromNameClientsAndCost()
      // バリデーションチェック
      if (!form.value.validate() || state.inputClientAndCostValue === '') {
        state.validErrFlg = true
        return
      }

      // insert or update
      context.emit(
        'exec',
        {
          id: state.id,
          wid: userState.workInfo.value.id,
          pay: Number(state.inputPay.replaceAll(',', '')),
          sid: state.inputSubject,
          day: state.inputDate,
          cid: state.inputClientAndCostValue,
          note: state.inputNote,
          update: new Date().toLocaleString('ja'),
        },
        state.checkbox
      )
    }

    const deleteRecord = () => {
      if (confirm('削除してもよろしいですか？')) {
        userState.deleteRecordManagement(state.id).then(() => {
          context.emit('open-close', !props.dialog)
        })
      }
    }

    return {
      form,
      nameRules,
      filterClientAndCost,
      changeClientAndCost,
      dayRules,
      payRules,
      maxRules,
      ...toRefs(state),
      userState,
      cancelDialog,
      execCash,
      deleteRecord,
      repNumber,
    }
  },
})
</script>
