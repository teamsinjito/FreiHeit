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
        </v-card-title>
      </v-toolbar>
      <v-card-text>
        <v-container class="my-3">
          <v-card-subtitle class="px-0 mb-4">{{ subtitle }}</v-card-subtitle>
          <v-row>
            <v-text-field
              v-model="inputMyOffice"
              required
              autofocus
              :rules="nameRules"
            ></v-text-field></v-row
        ></v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="cancelFlg"
          color="blue darken-1"
          text
          @click="cancelDialog()"
        >
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
import { Works } from '../../composables/interface'

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
    cancelFlg: {
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
      defaultRecords: Works
    },
    context
  ) {
    const state = reactive<{
      valid: boolean
      checkbox: boolean
      inputMyOffice: string
      id: string
    }>({
      valid: false,
      checkbox: props.continueFlg,
      id: props.defaultRecords.id,
      inputMyOffice: props.defaultRecords.name,
    })

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
          uid: context.root.$store.$auth.user.sub as string,
          name: state.inputMyOffice,
        },
        state.checkbox
      )
    }
    return {
      ...toRefs(state),
      form,
      cancelDialog,
      nameRules,
      execClientCost,
    }
  },
})
</script>
