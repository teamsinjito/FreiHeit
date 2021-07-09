<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
    <v-card>
      <v-toolbar color="primary" flat>
        <v-card-title style="width: 100%">
          <v-col cols="10" sm="11">
            <span class="white--text text-subtitle-1 font-weight-black">{{
              title
            }}</span>
          </v-col>
          <v-col cols="1" sm="1"
            ><v-icon v-if="deleteFlg" class="white--text" @click="deleteRecord"
              >mdi-trash-can-outline</v-icon
            ></v-col
          >
        </v-card-title>
      </v-toolbar>
      <v-card-text>
        <v-container class="my-3">
          <v-card-subtitle class="px-0 mb-4">{{ subtitle }}</v-card-subtitle>
          <v-row>
            <v-text-field
              v-model="inputClientCost"
              required
              autofocus
              :rules="nameRules"
            ></v-text-field
          ></v-row>
          <br />
          <v-card-subtitle class="px-0"
            >ラベルを選択してください
            <v-btn icon class="ml-2" @click="show = !show">
              <v-icon>{{
                show ? 'mdi-chevron-up' : 'mdi-chevron-down'
              }}</v-icon>
            </v-btn>
          </v-card-subtitle>

          <v-expand-transition>
            <v-row v-if="show">
              <v-color-picker
                v-model="inputColor"
                dot-size="25"
                mode="hexa"
                hide-canvas
                hide-sliders
                hide-inputs
                hide-mode-switch
                show-swatches
                width="100%"
              ></v-color-picker>
            </v-row>
          </v-expand-transition>
        </v-container>
        <small v-if="continueFlg">
          <v-checkbox v-model="checkbox">
            <template #label>
              <span class="text-caption font-weight-bold"
                >連続して登録する</span
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
        <v-btn color="blue darken-1" text @click="execClientCost()">
          {{ btnName }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api'
import { useGlobalState } from '../../composables/useDefault'
import { ClientsAndCosts } from '../../composables/interface'

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
    subtitle: {
      type: String,
      required: true,
    },
    deleteFlg: {
      type: Boolean,
      required: true,
    },
    continueFlg: {
      type: Boolean,
      required: true,
    },
    iflg: {
      type: Number,
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
      iflg: number
      defaultRecords: ClientsAndCosts
    },
    context
  ) {
    const state = reactive<{
      show: boolean
      valid: boolean
      checkbox: boolean
      inputClientCost: string
      inputColor: string
      id: string
    }>({
      show: false,
      valid: false,
      checkbox: props.continueFlg,
      id: props.defaultRecords.id,
      inputClientCost: props.defaultRecords.name,
      inputColor: props.defaultRecords.color || '#F44336FF',
    })

    const userState = useGlobalState()
    const nameRules = [
      (v: string) => !!v || '※入力必須です',
      (v: string) => v.length <= 50 || '※50文字以下で入力してください',
    ]
    const cancelDialog = () => {
      context.emit('open-close', !props.dialog)
    }
    const form = ref()
    const execClientCost = () => {
      // バリデーションチェック
      if (!form.value.validate()) {
        return
      }
      // insert or update
      context.emit(
        'exec',
        {
          id: state.id,
          wid: userState.workInfo.value.id,
          name: state.inputClientCost,
          iflg: props.iflg,
          color: state.inputColor,
        },
        state.checkbox
      )
    }
    const deleteRecord = () => {
      if (confirm('削除してもよろしいですか？')) {
        userState.deleteClientCost(state.id, props.iflg).then(() => {
          context.emit('open-close', !props.dialog)
        })
      }
    }
    return {
      ...toRefs(state),
      form,
      cancelDialog,
      nameRules,
      execClientCost,
      deleteRecord,
    }
  },
})
</script>
