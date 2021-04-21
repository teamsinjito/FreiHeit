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
              <v-switch v-model="paySwitch" color="success">
                <template #label>
                  <span
                    v-if="paySwitch == true"
                    class="success--text font-weight-bold"
                    >収入</span
                  >
                  <span v-else class="font-weight-bold error--text">支出</span>
                </template>
              </v-switch>
            </v-col>
            <v-col cols="7" sm="8">
              <v-text-field label="金額" required suffix="円"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-autocomplete
                :items="['0-17', '18-29', '30-54', '54+']"
                label="勘定科目"
                required
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="発生日" required type="date"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-combobox
                :items="[
                  'Skiing',
                  'Ice hockey',
                  'Soccer',
                  'Basketball',
                  'Hockey',
                  'Reading',
                  'Writing',
                  'Coding',
                  'Basejump',
                ]"
                label="取引先/固定経費"
              ></v-combobox>
            </v-col>
            <v-col cols="12">
              <v-text-field label="摘要" required></v-text-field>
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
        <v-btn color="blue darken-1" text @click="dialog = false"> 保存 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const dialog = false
    const paySwitch = true
    const checkbox = true
    return { dialog, paySwitch, checkbox }
  },
})
</script>
