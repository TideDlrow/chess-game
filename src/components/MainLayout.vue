<template>
  <div class="mainLayout">
    <a-layout class="contain">
      <a-layout class="leftSide">
        <board></board>
      </a-layout>
      <a-layout-sider class="rightSide" :collapsed="collapsed" collapsible="">
        <h1>右侧</h1>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script>
import Board from '@/components/Board2'

export default {
  name: 'MainLayout',
  components: { Board },
  data () {
    return {
      collapsed: true
    }
  }
}
</script>

<style scoped>
.mainLayout {
  height: 100%;
  width: 100%;
}

.contain {
  height: 100%;
  width: 100%;
}

.leftSide {
  height: 100%;
  width: 20%;
  background-color: aliceblue;
}

.rightSide {
  height: 100%;
  width: auto;
  background-color: aqua;
}

.board {
  height: 100%;
  width: 100%;
}
</style>
