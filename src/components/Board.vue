<template>
  <div class="board">
    <!--    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAMAAACf4xmcAAAAA3NCSVQICAjb4U/gAAADAFBMVEX///8AAABJGgQxDgIIAAAAAACVQwl8NAdeIQQ7EgIxDgIRAQAIAAAAAAAhCAAYAQARAQAIAAAAAACrURCeSgqFNgZeIQQYAQARAQAIAAAAAACzWAyVQwkxDgIYAQARAQAIAACrURCFNgY7EgIfAgAYAQC9Yg6eSgqeRAqVQwlrHwFbFwArBgAfAgAYAQARAQDGaA+9Yg63Wg+yVQt8NAcfAgC9Yg6TOgk7EgIxBwAhCAAfAgDNag/GaA+9Yg6zWAyFNgZ+KQNvJgRLEAA/CwArBgCeSgqTOgmEMQdvJgRbFwBLEAA/CwAxBwDVcxHNag/EYw6yVQuELwNrHwFlGgBbFwBUEwBLEAA/CwDgfBPNag/GaA+9Yg6ELwNyIgFrHwFlGgBbFwBUEwD/8Jz/65b/5pX95LX/5Y//35H43bf/3p773Kv/34X/3Yvx3bv/3Hz32a3/2Y3/2IP21qf/1Xz/1XP/1Gz20pz90Xz80YXr0rH+z3L1zpT6zH3/zGbszJr0yY38yG31yIX3xXj+x1v5xWn6xGXwxXDxwX/1v27zv3L/vVL2vGPyvGv3vFz4ulHyuWP1t2H1tlzytGDSuJ7xtFn1tUnxsF/es2LurFrwrU/crmLxpzzErJPTrWbspk7vpULopFLRqF3po0rsoEDCpYXmnU7lnUnBoXzfnFrAn3nkmErimUPklzq2nYTgk0K9mWvgk0e0mHrdjkHnjSS+k1TejDq7kVnaiTrbijC6jEy5jVDWhDmojXTUgzXjgRncgSCgiHXjfhPTfTDgfBPOezLOeCyafmbecxDOcyrNdSTJdCigeUaReGrFbSiPdWTBbSfNag+Vc0GNcVzGaA+Mck+9ZCOLbVLEYw6Ma1q9Yg6DaFqIaEy1XB2GZTu3Wg9/Y1GuVRqCXjJ4XFOrURCvTwmkSxanSgpwVEJrUEieRAqbQg9mSz+TOgldRy9dQTpYPDJYPSSELwNTOCt+KQNNMStMMh9yIgFrHwFAIx85IBo1FxUqExApCQkhCAgZBgZ097thAAABAHRSTlMAESIiIiIzMzMzMzMzM0REREREVVVVVVVVVVVmZmZmZmZ3d3d3d4iIiIiIiIiIiIiZmZmZmZmqqqqqqqq7u7u7u7u7u7u7zMzMzMzMzMzd3d3d3d3d3d3d3e7u7u7u7u7u7u7/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ehtuJQAAAAlwSFlzAAAOdAAADnQBaySz1gAAAB90RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgOLVo0ngAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTIvMTYvMTEz/4FsAAAEKElEQVQ4jX3Ua1xTZRwHcJ7idHNLpAtkNehid4wudKN7djGLrnYvNTZ2iC3gcM4YPvAYjLNcHhCYi0ZYDWFQWmCALq7VYrYsqGYbRKCUqWnEhOHSOGc+ZxslXvq92Pbi+/md5zz7P09ExMyAcCL+JwCclXh7SkrKY3dcd/YJJTgl8fmW6rdXFRevrqr9/IXrTz0eBCcldlcjRqNBoZR+/MMNJx8DwflfViONJlOllMvlCjWl0XMVn/VfcJQDl3WvYjSZ8lS5QkmSSqVCTiKuvL7/CjBTtRRrGGWqglRToahJBcVVWvqvPMKBi7qLcZWcVFE0A8UwNKUiSdZs2X7xvw6c9tVqlJmKV0RDiBDLsghBSONGztz4++nTjripFjHiuhmIWD0nRs8iyFBqtdmy9WYiXHZON0JKOVaFGJUbf91fUlaOYSF2hVbrznNDdcSdHyA6laSYd2rYMqOpLRD4ZXNbW3vru1BLqSutjruDdeCMr/VIoVDRNUIgGIHnQ7+atLQKrt+490yxDlzegjRykoI/Bqa83h0DXp4f63OJWZGnpWjLxpGrREbcVaunFGoaFhatcHXWNezh+d/WNngO7cjJL8Cva27+/h78VCB9vIpTKigGsYbhgIDD8/94J/B3Q5EBvwXX3POkBGD2YgWnwM9EnPGAwH9Sh9v+WPvRBM/XFeFdoVhbx8tRIttWXi4ujQ0yXmwLfS4vMrCYdXSMx2AWvc1oxFsrsv0CvybLg9eWnrOF59OLOBbS+q4we8lcGWbDAj/pPSTwB70TUwKfrsNMW2rv8YlM+sS6SnVobe1Tk4MDezAb9Ex4+7J0HP5rzfbeV4LsgU1mSFJvDg9/297U0OnBbKxvwONyeTa3tr5XWN8z9HSQ3fiNuYxUHwgEd0OYfgUxgcBPBTbHvvtm4/0lLvzZYqFUfwmTY4Mu16d1W8Ttdbn+PIj1ZNpKh9N3jchA9INdVqOKzEhLy8jJzX+jSeC/y8rPz81Z3vnF6xkfOkcWXzpLZNKrt1utMJvMzivQGUrKagLeNflvlRh0edmvkSU9Tt+CmMjgIM19yLHewlDheSvT5eSuFAcT0rCyy7lrccLs4MAB6SW7bY0WSIWn16DTGcTphchkd7r9t8oiw3MZfe9uW7MV0TPOAkRVdmevb1G4TKybu3CnzbahAs/N9MnSotJ6rMafSYqJnD4zQBq/cG9PR1ejCUEaUy1kK9bZtzrdvmeTZJL/Tip2D4+67Xa7bcP7JpOpqn4TRs5dfqxmHXnuCWn8LU+Nuh0Oh3M6I75XHxXVzOtBet61C5aM7xty45pe99Cof9kjyQkxkqOvOUBEx8+/bdHSJX6//++ly567PzlBFhV57GUIgHRO3Lz5SclikpLmyaIkxHFvTAAI6ZzYuDiZTBYbKyGIE9+rWIYz0xwG0S9PejWz/oQAAAAASUVORK5CYII=" alt="">-->
    <!--    <a-button type="primary" @click="trigger">点击触发</a-button>-->
    <canvas id="canvas" width="800" height="900"></canvas>
  </div>
</template>

<script>
import { pieceImg } from '@/assets'
import { B_C } from '@/pieces/pieces'

//共9列
const COL_NUM = 9
//共10行
const ROW_NUM = 10
//内边距  棋盘的线条不会贴着canvas
const margin = 50
// 棋盘左上角坐标
const leftTopX = margin
const leftTopY = margin

export default {
  name: 'Board',
  mounted () {
    // this.observeDom()
    this.drawBoard()
    this.drawPieces()
  },
  beforeDestroy () {
    // this.observeDom(true)
  },
  data () {
    return {
      observe: null,
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
     * 画棋盘
     */
    drawBoard () {
      const canvas = this.$el.querySelector('#canvas')
      const {
        height,
        width
      } = canvas.getBoundingClientRect()

      //横线长度
      const rowLineLength = width - 2 * margin
      //纵线长度
      const colLineLength = height - 2 * margin
      //行间距
      const rowLineSpace = colLineLength / (ROW_NUM - 1)
      //列间距
      const colLineSpace = rowLineLength / (COL_NUM - 1)
      //上下半部分的纵线长度
      const halfColLineLength = 4 * rowLineSpace

      // 棋盘右上角坐标
      const rightTopX = width - margin
      const rightTopY = margin

      const ctx = canvas.getContext('2d')
      //棋盘线条颜色
      ctx.fillStyle = '#000'

      //线的粗度
      const lineWidth = 1
      //画横线
      for (let i = 0; i < ROW_NUM; ++i) {
        ctx.fillRect(leftTopX, leftTopY + i * rowLineSpace, rowLineLength, lineWidth)
      }
      //画纵线
      ctx.fillRect(leftTopX + 0 * colLineSpace, leftTopY, lineWidth, colLineLength)
      ctx.fillRect(leftTopX + (COL_NUM - 1) * colLineSpace, leftTopY, lineWidth, colLineLength)
      for (let i = 1; i < (COL_NUM - 1); ++i) {
        ctx.fillRect(leftTopX + i * colLineSpace, leftTopY, lineWidth, halfColLineLength)
        ctx.fillRect(leftTopX + i * colLineSpace, leftTopY + 5 * rowLineSpace, lineWidth, halfColLineLength)
      }
      //上方的交叉线
      //从左上到右下的线
      ctx.moveTo(leftTopX + 3 * colLineSpace, leftTopY)
      ctx.lineTo(leftTopX + 5 * colLineSpace, leftTopY + 2 * rowLineSpace)
      ctx.stroke()
      //从右上到左下的线
      ctx.moveTo(leftTopX + 5 * colLineSpace, leftTopY)
      ctx.lineTo(leftTopX + 3 * colLineSpace, leftTopY + 2 * rowLineSpace)
      ctx.stroke()

      //下方的交叉线
      //从左上到右下的线
      ctx.moveTo(leftTopX + 3 * colLineSpace, leftTopY + 7 * rowLineSpace)
      ctx.lineTo(leftTopX + 5 * colLineSpace, leftTopY + 9 * rowLineSpace)
      ctx.stroke()
      //从右上到左下的线
      ctx.moveTo(leftTopX + 5 * colLineSpace, leftTopY + 7 * rowLineSpace)
      ctx.lineTo(leftTopX + 3 * colLineSpace, leftTopY + 9 * rowLineSpace)
      ctx.stroke()

      //棋盘中间的汉字
      //汉字的高度
      const textHeight = rowLineSpace * 0.6
      const text1 = '楚河'
      ctx.font = `${textHeight}px Arial`
      // const text1Height = ctx.measureText(text1).height;
      //“楚河” 左下角坐标(不知道为啥是左下角)
      const textX = leftTopX + 1 * colLineSpace
      const textMetrics = ctx.measureText(text1)
      const actualHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent
      const textY = leftTopY + halfColLineLength + (rowLineSpace - actualHeight) / 2 + actualHeight
      ctx.fillText(text1, textX, textY)

      const text2 = '汉界'
      const textMetrics2 = ctx.measureText(text2)
      const actualHeight2 = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent
      const text2Width = textMetrics2.width
      const text2Y = leftTopY + halfColLineLength + (rowLineSpace - actualHeight2) / 2 + actualHeight2
      //即距右侧仅一个列宽
      const text2X = rightTopX - 1 * colLineSpace - text2Width
      ctx.translate(text2X, text2Y)
      //旋转会以上面的translate后的坐标为原点旋转
      ctx.rotate(180 * Math.PI / 180)
      ctx.fillText(text2, -text2Width, textHeight)
      //坐标系还原  防止上面的平移旋转对后面的操作有影响
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    },
    /**
     * 把棋子画到棋盘上
     */
    drawPieces () {
      const canvas = this.$el.querySelector('#canvas')
      const {
        height,
        width
      } = canvas.getBoundingClientRect()
      //横线长度
      const rowLineLength = width - 2 * margin
      //纵线长度
      const colLineLength = height - 2 * margin
      //行间距
      const rowLineSpace = colLineLength / (ROW_NUM - 1)
      //列间距
      const colLineSpace = rowLineLength / (COL_NUM - 1)
      const ctx = canvas.getContext('2d')
      // console.log(pieceImg);
      //棋子(一个正方形)的边长为行间距的2/3
      const pieceDiameter = rowLineSpace / 3 * 2
      // ctx.drawImage(pieceImg['b_c'], leftTopX - pieceDiameter / 2, leftTopY - pieceDiameter / 2, pieceDiameter, pieceDiameter)
      B_C.lengthOfSide = pieceDiameter
      B_C.draw(ctx, leftTopX, leftTopY)

      const nextX = leftTopX
      const nextY = leftTopY + 4 * rowLineSpace
      //每次移动5px 共移动的次数
      const stepNum = (nextY - leftTopY) / 5
      let i = 0
      const s = setInterval(() => {
        ctx.clearRect(0, 0, width, height)
        this.drawBoard()
        B_C.draw(ctx, leftTopX, leftTopY + 5 * i)
        ++i
        if (i >= stepNum) {
          clearInterval(s)
        }
      }, 20)

    }
  }
}
</script>

<style scoped>
canvas {
  background-color: antiquewhite;
}
</style>
