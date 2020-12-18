import {
  AssistantsR,
  AssistantsB,
  BishopR,
  BishopB,
  CannonR,
  CannonB,
  KnightR,
  KnightB,
  KingR,
  KingB,
  PawnR,
  PawnB,
  RookR,
  RookB
} from '@/pieces/pieces'

class Board {
  constructor () {
    //棋盘行数
    this.ROW_NUM = 10
    //棋盘列数
    this.COL_NUM = 9
    //棋盘距离canvas边缘的内边距
    this.margin = 0
    //canvas的宽
    this.canvasWidth = 0
    //canvas的高
    this.canvasHeight = 0
    //棋子的二维数组。左上角的车的坐标为1,1 马是1,2......
    this.pieceArray = null
    //canvas上下文
    this.ctx = null
    //玩家阵营。true代表黑方，false代表红方。该属性决定红色或黑色棋子绘制在棋盘下方
    this.camp = false
    //被选中棋子的坐标 未选中时为-1
    this.selectedPieceX = 0
    //被选中棋子的坐标 未选中时为-1
    this.selectedPieceY = 0
    //提示点的图片
    this.tipPointImg = null
    //提示点的图片的边长
    this.tipPointSideLength = 0
  }

  /**
   * 获取棋盘左上角的坐标
   */
  getLeftTopCoordinate () {
    const leftTopX = this.margin
    const leftTopY = this.margin
    return {
      leftTopX,
      leftTopY
    }
  }

  /**
   * 获取行间距
   */
  getRowLineSpace () {
    const {
      ROW_NUM,
      canvasHeight,
      margin
    } = this
    //棋盘的纵线长度
    const colLineLength = canvasHeight - 2 * margin
    return colLineLength / (ROW_NUM - 1)
  }

  /**
   *获取列间距
   */
  getColLineSpace () {
    const {
      COL_NUM,
      canvasWidth,
      margin
    } = this
    //棋盘的横线长度
    const rowLineLength = canvasWidth - 2 * margin
    return rowLineLength / (COL_NUM - 1)
  }

  /**
   * 根据像素坐标获取棋盘坐标
   * 棋盘上点周围的1/3都属于该点
   * @param {number} pixelX
   * @param {number} pixelY
   */
  getBoardCoordinateByPixel (pixelX, pixelY) {
    const {
      canvasWidth,
      canvasHeight
    } = this
    //若点在canvas画布外则忽略
    if (pixelX >= canvasWidth || pixelX <= 0 || pixelY >= canvasHeight || pixelY <= 0) {
      return null
    }
    const rowLineSpace = this.getRowLineSpace()
    const colLineSpace = this.getColLineSpace()
    //横向有效范围。即点横向的rowEffectiveRange像素范围内都属于该点
    const rowEffectiveRange = colLineSpace / 3
    //纵向有效范围。即点纵向的colEffectiveRange像素范围内都属于该点
    const colEffectiveRange = rowLineSpace / 3
    //转换后的棋盘坐标
    const BoardCoordinateX = _.floor((pixelX + rowEffectiveRange) / rowLineSpace)
    const BoardCoordinateY = _.floor((pixelY + colEffectiveRange) / colLineSpace)
    return {
      BoardCoordinateX,
      BoardCoordinateY
    }
  }

  /**
   * 根据棋盘坐标获取该坐标对应的像素坐标
   * @param {number} boardCoordinateX 棋盘坐标。1~9之间的整数
   * @param {number} boardCoordinateY 棋盘坐标。1~10之间的整数
   */
  getPixelByBoardCoordinate (boardCoordinateX, boardCoordinateY) {
    const rowLineSpace = this.getRowLineSpace()
    const colLineSpace = this.getColLineSpace()
    const { margin } = this
    const pixelX = (boardCoordinateX - 1) * colLineSpace + margin
    const pixelY = (boardCoordinateY - 1) * rowLineSpace + margin
    return {
      pixelX,
      pixelY
    }
  }

  /**
   * 设置canvas的上下文
   * @param {CanvasRenderingContext2D} ctx
   */
  setCanvasCTX (ctx) {
    this.ctx = ctx
  }

  getCanvasCTX () {
    const { ctx } = this
    if (ctx === null || ctx === undefined) {
      throw '请先设置canvas上下文'
    }
    return ctx
  }

  /**
   * 绘制棋盘
   */
  drawBoard () {
    const {
      COL_NUM,
      ROW_NUM,
      margin,
      canvasHeight,
      canvasWidth,
    } = this
    //横线长度
    const rowLineLength = canvasWidth - 2 * margin
    //纵线长度
    const colLineLength = canvasHeight - 2 * margin
    const rowLineSpace = this.getRowLineSpace()
    const colLineSpace = this.getColLineSpace()
    //上下半部分的纵线长度
    const halfColLineLength = 4 * rowLineSpace
    const {
      leftTopX,
      leftTopY
    } = this.getLeftTopCoordinate()
    // 棋盘右上角坐标
    const rightTopX = canvasWidth - margin

    const ctx = this.getCanvasCTX()
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
  }

  /**
   * 初始化棋子布局。
   */
  initPiecesLayout () {
    const { camp } = this
    //若当前玩家阵营是黑方，则把黑色棋子放在棋盘下方
    if (camp) {
      this.pieceArray = [
        [new RookR(), new KnightR(), new BishopR(), new AssistantsR(), new KingR(), new AssistantsR(), new BishopR(), new KnightR(), new RookR()],
        [null, null, null, null, null, null, null, null, null],
        [null, new CannonR(), null, null, null, null, null, new CannonR(), null],
        [new PawnR(), null, new PawnR(), null, new PawnR(), null, new PawnR(), null, new PawnR()],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [new PawnB(), null, new PawnB(), null, new PawnB(), null, new PawnB(), null, new PawnB()],
        [null, new CannonB(), null, null, null, null, null, new CannonB(), null],
        [null, null, null, null, null, null, null, null, null],
        [new RookB(), new KnightB(), new BishopB(), new AssistantsB(), new KingB(), new AssistantsB(), new BishopB(), new KnightB(), new RookB()],
      ]
    } else {
      //若当前玩家阵营是红方，则把红色棋子放在棋盘下方
      this.pieceArray = [
        [new RookB(), new KnightB(), new BishopB(), new AssistantsB(), new KingB(), new AssistantsB(), new BishopB(), new KnightB(), new RookB()],
        [null, null, null, null, null, null, null, null, null],
        [null, new CannonB(), null, null, null, null, null, new CannonB(), null],
        [new PawnB(), null, new PawnB(), null, new PawnB(), null, new PawnB(), null, new PawnB()],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [new PawnR(), null, new PawnR(), null, new PawnR(), null, new PawnR(), null, new PawnR()],
        [null, new CannonR(), null, null, null, null, null, new CannonR(), null],
        [null, null, null, null, null, null, null, null, null],
        [new RookR(), new KnightR(), new BishopR(), new AssistantsR(), new KingR(), new AssistantsR(), new BishopR(), new KnightR(), new RookR()],
      ]
    }
  }

  /**
   * 根据PieceArray把棋子绘制到棋盘上
   */
  drawPieces () {
    const { pieceArray } = this
    const ctx = this.getCanvasCTX()
    if (_.isEmpty(pieceArray)) {
      return
    }
    //如果不是数组
    if (!(_.isArray(pieceArray))) {
      throw 'pieceArray is not array'
    }
    //如果不是二维数组
    if (!(_.isArray(pieceArray[0]))) {
      throw 'pieceArray is not array'
    }
    const colLineSpace = this.getColLineSpace()
    for (let i = 0; i < pieceArray.length; i++) {
      for (let j = 0; j < pieceArray[i].length; j++) {
        const piece = pieceArray[i][j]
        //若棋子不存在则跳过
        if (piece === null || piece === undefined) {
          continue
        }
        // 把棋子的边长设置为列间距的4/5
        piece.lengthOfSide = colLineSpace / 5 * 4
        //棋子的x坐标是列，所以这里把j放在第一个参数
        const {
          pixelX,
          pixelY
        } = this.getPixelByBoardCoordinate(j + 1, i + 1)
        piece.drawPiece(ctx, pixelX, pixelY)
      }
    }
  }

  /**
   * 绘制棋子的可行提示点
   */
  drawTipPoint () {

  }

  /**
   * 把棋子从x1,y1移动到x2,y2
   * x1,y1,x2,y2都为棋盘坐标，非像素坐标
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   */
  movePiece (x1, y1, x2, y2) {

  }

  /**
   * 重绘
   */
  redraw () {
    const ctx = this.getCanvasCTX()
    const {
      canvasHeight,
      canvasWidth
    } = this
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    this.drawBoard()
    this.drawPieces()
  }

}

export default Board
