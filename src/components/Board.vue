<template>
  <div class="board">
    <canvas id="canvas" width="800" height="900" @click="clickCanvas"></canvas>
    <div class="mask" v-show="maskVisible"></div>
  </div>
</template>

<script>
import Board from '@/pieces/Board'

export default {
  name: 'Board',
  mounted () {
    // this.observeDom()
    this.initBoardConfig()
    // this.redrawBoard()
    this.board.drawBoard()
    // this.board.drawPieces()

  },
  beforeDestroy () {
    // this.observeDom(true)
  },
  data () {
    return {
      observe: null,
      board: null,
      //遮罩的可见度。
      maskVisible: true,
    }
  },
  methods: {
    resizeCanvasSize () {
      const {
        height,
        width
      } = this.$el.getBoundingClientRect()
      const canvas = this.$el.querySelector('#canvas')
      canvas.width = width
      canvas.height = height
      console.log('改变了大小')
      this.redrawBoard()
    },
    /**
     * 监听某个dom的大小变化
     * @param isDispose 是否销毁观察器
     */
    observeDom (isDispose = false) {
      if (isDispose) {
        this.observe.disconnect()
        return
      }
      this.observe = new ResizeObserver(
        _.throttle(this.resizeCanvasSize, 500)
      )
      this.observe.observe(this.$el)
    },
    /**
     * 初始化棋盘配置
     */
    initBoardConfig () {
      this.board = new Board()
      const canvas = this.$el.querySelector('#canvas')
      const {
        height,
        width
      } = canvas.getBoundingClientRect()
      const ctx = canvas.getContext('2d')
      this.board.setCanvasCTX(ctx)
      this.board.canvasHeight = height
      this.board.canvasWidth = width
      this.board.margin = 50
      //设置为黑方棋子在棋盘下方(因为后端固定是黑方在下方)
      this.board.camp = true
      this.board.initPiecesLayout()
    },

    /**
     * @param {boolean} playerCamp 玩家阵营 true表示黑方 false表示红方
     *
     */
    initPlayerCamp(playerCamp){
      this.board.playerCamp = playerCamp
    },
    /**
     * 重绘棋盘
     */
    redrawBoard () {
      const canvas = this.$el.querySelector('#canvas')
      const {
        height,
        width
      } = canvas.getBoundingClientRect()
      this.board.setCanvasCTX(canvas.getContext('2d'))
      this.board.canvasHeight = height
      this.board.canvasWidth = width
      this.board.redrawBoard()
    },
    /**
     * 重绘棋盘及棋子
     */
    redrawBoardAndPiece () {
      this.redrawBoard()
      this.board.drawPieces()
    },
    clickCanvas (event) {
      const {
        offsetX,
        offsetY
      } = event
      // console.log(offsetX, offsetY)
      const isSelected = this.board.isSelected()
      //如果已经选中了一个棋子
      if (isSelected) {
        const coordinate = this.board.movePieceToPixel(offsetX, offsetY)
        if (coordinate){
          this.$emit("move",coordinate)
        }
      } else {
        //若没有选中棋子，则画出选中棋子的外框
        this.board.drawPieceOuterBorderByPlayerCamp(offsetX, offsetY)
      }
    },
    /**
     * 移动棋子。坐标都为棋盘坐标
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    movePiece({x1,y1,x2,y2}){
      this.board.movePieceByBoardCoordinate(x1,y1,x2,y2,false)
    },
    /**
     * 回合翻转
     */
    turnRound(){
      this.board.turnRound()
    },

    /**
     * 隐藏遮罩
     */
    cancelMask(){
      this.maskVisible = false
    },
    /**
     * 显示遮罩
     */
    showMask(){
      this.maskVisible = true
    },
    getFEN(){
      return this.board.toFEN()
    }

  }
}
</script>

<style scoped>
.board{
  position: relative;
}
canvas {
  background-color: antiquewhite;
  z-index: 1;
}
.mask{
  width: 100%;
  height: 100%;
  z-index: 2;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
