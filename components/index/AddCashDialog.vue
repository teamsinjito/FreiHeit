<template>
  <!-- Newボタン -->
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

    <!-- 取引追加ダイアログ -->
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-toolbar color="primary" flat>
          <v-card-title>
            <span class="white--text text-subtitle-1 font-weight-black"
              >取引追加</span
            >
          </v-card-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="5" sm="4">
                <v-switch
                  v-model="paySwitch"
                  color="success"
                  @change="setPayFlg()"
                >
                  <template #label>
                    <span
                      v-if="paySwitch == true"
                      class="success--text font-weight-bold"
                      >収入</span
                    >
                    <span v-else class="font-weight-bold error--text"
                      >支出</span
                    >
                  </template>
                </v-switch>
              </v-col>
              <v-col cols="7" sm="8">
                <v-text-field
                  v-model="inputPayStr"
                  label="金額"
                  required
                  :rules="payRules"
                  type="number"
                  suffix="円"
                  @change="setInputPay()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="inputSubject"
                  :items="userState.subjectsInfo.value"
                  item-value="name"
                  item-text="name"
                  label="勘定科目"
                  :rules="nameRules"
                  required
                  @change="matchInputSubjectGroup()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="inputDate"
                  label="発生日"
                  :rules="dayRules"
                  required
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="inputClientAndCost"
                  item-value="name"
                  item-text="name"
                  :items="userState.clientsAndCostsInfo.value"
                  label="取引先/固定経費"
                  :rules="nameRules"
                  @change="matchInputNote()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="inputNote"
                  label="摘要"
                  :rules="maxRules"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>
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
          <v-btn color="blue darken-1" text @click="dialog = false">
            キャンセル
          </v-btn>
          <v-btn color="blue darken-1" text @click="exeAddCash()"> 保存 </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api'
import { useGlobalState } from '../../composables/useDefault'

export default defineComponent({
  setup() {
    const userState = useGlobalState()
    const form = ref()
    const payRules = [
      (v: string) => !!v || '※入力必須です',
      (v: string) => v.length <= 12 || '※12桁以下で入力してください',
    ]
    const maxRules = [
      (v: string) => v.length <= 50 || '※50文字以下で入力してください',
    ]
    const nameRules = [
      (v: string) => !!v || '※入力必須です',
      (v: string) => v.length <= 50 || '※50文字以下で入力してください',
    ]
    const dayRules = [
      (v: string) => !!v || '※入力必須です',
      (v: string) => v.length <= 10 || '※10文字以下で入力してください',
      (v: string) =>
        (Number(v.slice(0, 4)) >= 2000 && Number(v.slice(0, 4)) <= 2099) ||
        '※2000年から2099年の範囲で入力してください',
    ]
    const state = reactive<{
      valid: boolean
      payFlg: number
      paySwitch: boolean
      dialog: boolean
      checkbox: boolean
      inputPay: number
      inputPayStr: string
      inputDate: string
      inputSubject: string
      inputSubjectGroup: string
      inputClientAndCost: string
      inputNote: string
    }>({
      valid: false,
      payFlg: 1,
      paySwitch: true,
      dialog: false,
      checkbox: true,
      inputDate: '',
      inputPay: 0,
      inputPayStr: '',
      inputSubject: '',
      inputSubjectGroup: '',
      inputClientAndCost: '',
      inputNote: '',
    })

    // 金額のNumber変換
    const setInputPay = () => {
      state.inputPay = Number(state.inputPayStr)
    }

    // 摘要および取引先、固定経費の同期
    const matchInputNote = () => {
      state.inputNote = state.inputClientAndCost
    }

    // 収支フラグ取得
    const setPayFlg = () => {
      state.paySwitch ? (state.payFlg = 1) : (state.payFlg = -1)
    }

    // 勘定科目グループ取得
    const matchInputSubjectGroup = () => {
      state.inputSubjectGroup = userState.subjectsInfo.value.filter((el) =>
        el.name.includes(state.inputSubject)
      )[0].groupname
    }

    // 取引管理追加
    const exeAddCash = () => {
      // バリデーションチェック
      if (!form.value.validate()) {
        console.log('validation error!')
        return
      }

      state.dialog = state.checkbox

      userState.insertRecordManagement({
        id: '',
        payflg: state.payFlg,
        pay: state.inputPay,
        subject: state.inputSubject,
        subjectGroup: state.inputSubjectGroup,
        day: state.inputDate,
        clientOrCostName: state.inputClientAndCost,
        note: state.inputNote,
        month: state.inputDate.slice(0, 4) + state.inputDate.slice(5, 7),
      })
    }
    return {
      form,
      setPayFlg,
      matchInputSubjectGroup,
      nameRules,
      dayRules,
      payRules,
      maxRules,
      ...toRefs(state),
      setInputPay,
      matchInputNote,
      userState,
      exeAddCash,
    }
  },
})
</script>
