<template>
  <div class="board">
    <canvas id="canvas" width="800" height="900" @click="clickCanvas"></canvas>
  </div>
</template>

<script>
import Board from '@/pieces/Board2'
import { RookR } from '@/pieces/pieces'

export default {
  name: 'Board',
  mounted () {
    // this.observeDom()
    this.initBoardConfig()
    // this.redrawBoard()
    this.board.drawBoard()
    this.board.drawPieces()

  },
  beforeDestroy () {
    // this.observeDom(true)
  },
  data () {
    return {
      observe: null,
      board: null,
    }
  },
  methods: {
    resizeCanvasSize () {
      const canvas = this.$el.querySelector('#canvas')
      const {
        height,
        width
      } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      console.log('改变了大小')
      // this.redrawBoard()
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
      //先设置为红方
      this.board.camp = false
      this.board.initPiecesLayout()

      // const rook = new RookR()
      // rook.lengthOfSide = 34
      // rook.drawPiece(ctx,50,50)
    },
    /**
     * 重绘棋盘(及棋子)
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
      this.board.redraw()
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
        this.board.movePieceToPixel(offsetX, offsetY)
      } else {
        //若没有选中棋子，则画出选中棋子的外框
        this.board.drawPieceOuterBorder(offsetX, offsetY)
      }
    }

  }
}
</script>

<style scoped>
canvas {
  background-color: antiquewhite;
}
</style>
