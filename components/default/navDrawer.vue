<template>
  <!-- サイドバー -->
  <v-navigation-drawer :mini-variant="mini" fixed permanent app dark>
    <!-- 会社名 -->
    <v-list-item class="px-2 my-sm-1">
      <nuxt-link :to="headItem.to">
        <v-list-item-avatar color="primary">
          <v-icon>mdi-home-city</v-icon>
        </v-list-item-avatar>
      </nuxt-link>

      <v-list-item-title
        ><v-select
          v-model="currentOffice"
          :items="workInfo"
          item-text="name"
          item-value="id"
          style="font-size: 0.9rem"
          @change="changeCarrentWork()"
        ></v-select
      ></v-list-item-title>
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
import {
  defineComponent,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  toRefs,
} from '@vue/composition-api'
import { Works } from '../../composables/interface'
import { useGlobalState } from '~/composables/useDefault'
export default defineComponent({
  props: {
    mini: {
      type: Boolean,
      required: true,
    },
    workInfo: {
      type: Array,
      required: true,
    },
    office: {
      type: Object,
      required: true,
    },
  },

  setup(props: { mini: boolean; workInfo: Works[]; office: Works }) {
    const userState = useGlobalState()
    const state = reactive<{
      currentOffice: string
    }>({
      currentOffice: props.office.id,
    })
    // onMounted(() => {
    //   state.currentOffice = props.office
    // })
    const headItem = {
      to: '/mypage',
    }
    const items = [
      {
        icon: 'mdi-apps',
        title: '取引管理',
        to: '/',
      },
      {
        icon: 'mdi-chart-bar',
        title: '収支レポート',
        to: '/chart',
      },
      {
        icon: 'mdi-hexagon-slice-4',
        title: 'オプション',
        to: '/option',
      },
    ]

    const changeCarrentWork = () => {
      console.log('事業所切り替え', state.currentOffice)
      userState.changeWorksRecordsManagement(state.currentOffice)
    }

    return { headItem, items, ...toRefs(state), changeCarrentWork }
  },
})
</script>
