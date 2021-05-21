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
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="inputPay"
                class="font-weight-bold"
                label="金額"
                required
                :rules="payRules"
                type="text"
                autofocus
                suffix="円"
                @input="repNumber"
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
                style="font-size: 0.9rem"
              ></v-autocomplete>
            </v-col>
            <v-col cols="4" sm="2">
              <v-text-field
                v-model="inputYear"
                label="年"
                disabled
                style="font-size: 0.9rem"
              ></v-text-field>
            </v-col>
            <v-col cols="4" sm="2">
              <v-autocomplete
                v-model="inputMonth"
                item-value="value"
                item-text="id"
                :items="month"
                label="月"
                :rules="nameRules"
                style="font-size: 0.9rem"
              ></v-autocomplete>
            </v-col>
            <v-col cols="4" sm="2">
              <v-autocomplete
                v-model="inputDay"
                item-value="value"
                item-text="id"
                :items="date"
                label="日"
                style="font-size: 0.9rem"
                :rules="nameRules"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="inputClientAndCost"
                item-value="id"
                item-text="name"
                :items="userState.clientsAndCostsInfo.value"
                label="取引先/固定経費"
                style="font-size: 0.9rem"
                :rules="nameRules"
                @change="matchInputNote(inputClientAndCost)"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="inputNote"
                label="摘要"
                style="font-size: 0.9rem"
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
  onBeforeMount,
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
      (v: string) => v.length <= 14 || '※12桁以下で入力してください',
      (v: string) =>
        /^0$|^[1-9]\d{0,2}(,\d{3})*$|^[0-9 ]+$/.test(v) ||
        '※半角数値のみ入力してください',
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
      inputPay: string
      inputYear: number
      inputMonth: string
      inputDay: string
      inputSubject: string
      inputClientAndCost: string
      inputNote: string
    }>({
      valid: false,
      id: props.defaultRecords.id,
      checkbox: props.continueFlg,
      inputYear:
        Number(props.defaultRecords.day.slice(0, 4)) |
        userState.currentSysYear.value.num,
      inputMonth: props.defaultRecords.day.slice(5, 7),
      inputDay: props.defaultRecords.day.slice(8, 10),
      inputPay: props.defaultRecords.pay.toLocaleString().toString(),
      inputSubject: props.defaultRecords.sid,
      inputClientAndCost: props.defaultRecords.cid,
      inputNote: props.defaultRecords.note,
    })
    const month = [
      { id: '1', value: '01' },
      { id: '2', value: '02' },
      { id: '3', value: '03' },
      { id: '4', value: '04' },
      { id: '5', value: '05' },
      { id: '6', value: '06' },
      { id: '7', value: '07' },
      { id: '8', value: '08' },
      { id: '9', value: '09' },
      { id: '10', value: '10' },
      { id: '11', value: '11' },
      { id: '12', value: '12' },
    ]
    const date = [
      { id: '1', value: '01' },
      { id: '2', value: '02' },
      { id: '3', value: '03' },
      { id: '4', value: '04' },
      { id: '5', value: '05' },
      { id: '6', value: '06' },
      { id: '7', value: '07' },
      { id: '8', value: '08' },
      { id: '9', value: '09' },
      { id: '10', value: '10' },
      { id: '11', value: '11' },
      { id: '12', value: '12' },
      { id: '13', value: '13' },
      { id: '14', value: '14' },
      { id: '15', value: '15' },
      { id: '16', value: '16' },
      { id: '17', value: '17' },
      { id: '18', value: '18' },
      { id: '19', value: '19' },
      { id: '20', value: '20' },
      { id: '21', value: '21' },
      { id: '22', value: '22' },
      { id: '23', value: '23' },
      { id: '24', value: '24' },
      { id: '25', value: '25' },
      { id: '26', value: '26' },
      { id: '27', value: '27' },
      { id: '28', value: '28' },
      { id: '29', value: '29' },
      { id: '30', value: '30' },
      { id: '31', value: '31' },
    ]
    // 金額の3桁区切り変換
    const repNumber = () => {
      state.inputPay = Number(
        state.inputPay.replaceAll(',', '')
      ).toLocaleString()
    }

    // 摘要および取引先、固定経費の同期
    const matchInputNote = (m: string) => {
      state.inputNote = userState.clientsAndCostsInfo.value.filter(
        (c) => c.id === m
      )[0].name
    }

    const cancelDialog = () => {
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
          wid: userState.workInfo.value[0].id,
          pay: Number(state.inputPay.replaceAll(',', '')),
          sid: state.inputSubject,
          day: state.inputYear + '-' + state.inputMonth + '-' + state.inputDay,
          cid: state.inputClientAndCost,
          note: state.inputNote,
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
      dayRules,
      payRules,
      maxRules,
      month,
      date,
      ...toRefs(state),
      matchInputNote,
      userState,
      cancelDialog,
      execCash,
      repNumber,
      deleteRecord,
    }
  },
})
</script>
