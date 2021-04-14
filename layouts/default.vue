<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      dark
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img
            class="FreiHeitLogo"
            alt="FreiHeit Logo"
            src="/FreiHeit_Logo.png"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h4"> FreiHeit </v-list-item-title>
          <v-list-item-subtitle class="text-subtitle-2">
            帳票作成アプリ
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-footer color="transparent justify-center text-caption"
        >© 2021 Team SINJITO</v-footer
      >
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="clipped"
      flat
      app
      color="transparent"
      class="pt-2"
    >
      <v-container fluid>
        <v-row class="d-flex align-center">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

          <v-app-bar-title v-text="title" />
        </v-row>
        <v-divider class="mt-1"></v-divider>
      </v-container>

      <!-- <v-select :items="selectItems" class="text-h5 pt-2" item-value="Foo" label="対象年度を選択"></v-select> -->
    </v-app-bar>
    <v-main class="heroArea">
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      selectItems: ['Foo', 'Bar', 'Fizz', 'Buzz'],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
}
</script>
<style scoped>
.heroArea {
  background-image: url('/FreiHeit_Bg.jpeg');
  width: 100%;
  height: 100vh;
  background-size: cover;
  position: fixed;
  background-repeat: no-repeat;
}
</style>
