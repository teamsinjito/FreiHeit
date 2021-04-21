<template>
  <!-- サイドバー -->
  <v-navigation-drawer :mini-variant="minimini" fixed permanent app dark>
    <!-- 会社名 -->
    <v-list-item class="px-2 my-sm-1">
      <v-list-item-avatar color="primary">
        <v-icon>mdi-home-city</v-icon>
      </v-list-item-avatar>

      <v-list-item-title>{{ office }}</v-list-item-title>
      <v-btn icon @click.stop="miniminiChenge">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>
    <v-divider></v-divider>

    <!-- ページリスト -->
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
          <v-list-item-title class="text-subtitle-2" v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>
  </v-navigation-drawer>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    minimini: {
      type: Boolean,
      required: true,
    },
  },
  setup(props: { minimini: boolean }, ctx) {
    const office = 'CruxSystem'
    const items = [
      {
        icon: 'mdi-apps',
        title: '取引管理',
        to: '/',
      },
      {
        icon: 'mdi-chart-bubble',
        title: '収支レポート',
        to: '/inspire',
      },
      {
        icon: 'mdi-hexagon-slice-4',
        title: 'オプション',
        to: '/option',
      },
    ]
    const miniminiChenge = () => {
      ctx.emit('miniminiC', !props.minimini)
    }
    return { items, miniminiChenge, office }
  },
})
</script>
