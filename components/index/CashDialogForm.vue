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
            ><v-icon v-if="!continueFlg" class="white--text"
              >mdi-trash-can-outline</v-icon
            ></v-col
          >
        </v-card-title>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="inputPayStr"
                label="金額"
                required
                :rules="payRules"
                type="text"
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
                item-value="id"
                item-text="name"
                label="勘定科目"
                :rules="nameRules"
                required
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
                item-value="id"
                item-text="name"
                :items="userState.clientsAndCostsInfo.value"
                label="取引先/固定経費"
                :rules="nameRules"
                @change="matchInputNote(inputClientAndCost)"
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
      id: string
      checkbox: boolean
      inputPay: number
      inputPayStr: string
      inputDate: string
      inputSubject: string
      inputClientAndCost: string
      inputNote: string
    }>({
      valid: false,
      id: props.defaultRecords.id,
      checkbox: props.continueFlg,
      inputDate: props.defaultRecords.day,
      inputPay: props.defaultRecords.pay,
      inputPayStr: props.defaultRecords.pay.toString(),
      inputSubject: props.defaultRecords.sid,
      inputClientAndCost: props.defaultRecords.cid,
      inputNote: props.defaultRecords.note,
    })
    console.log('cashDialog', props.defaultRecords)

    // 金額のNumber変換
    const setInputPay = () => {
      state.inputPay = Number(state.inputPayStr)
    }

    // 摘要および取引先、固定経費の同期
    const matchInputNote = (m: string) => {
      state.inputNote = userState.clientsAndCostsInfo.value.filter(
        (c) => c.id === m
      )[0].name
    }

    const cancelDialog = () => {
      //   state.payflg = props.defaultRecords.payflg
      //   state.checkbox = props.continueFlg
      //   state.inputDate = props.defaultRecords.day
      //   state.inputPay = props.defaultRecords.pay | 0
      //   state.inputPayStr = props.defaultRecords.pay.toString()
      //   state.inputSubject = props.defaultRecords.sid
      //   state.inputClientAndCost = props.defaultRecords.cid
      //   state.inputNote = props.defaultRecords.note
      context.emit('open-close', !props.dialog)
    }

    const execCash = () => {
      // バリデーションチェック
      if (!form.value.validate()) {
        console.log('validation error!')
        return
      }

      // insert or update
      context.emit(
        'exec',
        {
          id: state.id,
          uid: userState.userInfo.value.id,
          pay: state.inputPay,
          sid: state.inputSubject,
          day: state.inputDate,
          cid: state.inputClientAndCost,
          note: state.inputNote,
        },
        state.checkbox
      )
    }

    return {
      form,
      nameRules,
      dayRules,
      payRules,
      maxRules,
      ...toRefs(state),
      setInputPay,
      matchInputNote,
      userState,
      cancelDialog,
      execCash,
    }
  },
})
</script>
