<template>
  <v-sheet
    height="100%"
    width="100%"
    color="transparent"
    class="overflow-hidden"
  >
    <v-container>
      <v-row
        ><v-col cols="12"><v-card-title>FreiHeit</v-card-title></v-col>
        <v-col cols="12">
          <v-btn rounded color="primary" dark @click="loginWithAuthZero">
            ログイン
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  layout: 'loginLayout',
  setup(_props, context) {
    const loginWithAuthZero = () => {
      context.root.$auth.loginWith('auth0')
    }

    return {
      loginWithAuthZero,
    }
  },
})
</script>
