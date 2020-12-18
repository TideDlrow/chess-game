import { pieceImg } from '@/assets'

class Piece {
  constructor () {
    //像素坐标
    this.pixelX = 0
    this.pixelY = 0
    //棋子图片
    this.pieceImg = null
    //棋子图片的边长
    this.lengthOfSide = 0
    //阵营 false代表红方 true代表黑方
    this.camp = false
    //棋子的外边框图片
    this.outerBorder = null
  }

  /**
   * 获取棋子的外框图片
   * @return {HTMLImageElement}
   */
  getOuterBorderImg () {
    const { camp } = this
    const img = new Image()
    if (camp) {
      img.src = pieceImg['b_box']
    } else {
      img.src = pieceImg['r_box']
    }
    return img
  }

  /**
   * 把棋子绘制到指定的坐标
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} centerPixelX 棋子中心坐标
   * @param {number} centerPixelY 棋子中心坐标
   */
  drawPiece (ctx, centerPixelX, centerPixelY) {
    const pieceImg = this.pieceImg
    if (pieceImg === null || pieceImg === undefined) {
      throw '请先设置棋子的图片'
    }
    this.pixelX = centerPixelX
    this.pixelY = centerPixelY
    const lengthOfSide = this.lengthOfSide
    ctx.drawImage(pieceImg, centerPixelX - lengthOfSide / 2, centerPixelY - lengthOfSide / 2, lengthOfSide, lengthOfSide)
  }

  /**
   * 绘制棋子被选中时的外框
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} centerPixelX 棋子中心坐标
   * @param {number} centerPixelY 棋子中心坐标
   */
  drawOuterBorder (ctx, centerPixelX, centerPixelY) {
    const outerBorderImg = this.outerBorder
    if (outerBorderImg === null || outerBorderImg === undefined) {
      throw '请先设置棋子外框的图片'
    }
    const lengthOfSide = this.lengthOfSide
    ctx.drawImage(outerBorderImg, centerPixelX - lengthOfSide / 2, centerPixelY - lengthOfSide / 2, lengthOfSide, lengthOfSide)
  }
}

/**
 * 黑士
 */
class AssistantsB extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_s']
    this.camp = true
  }
}

/**
 * 红士
 */
class AssistantsR extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_s']
  }
}

/**
 * 黑象
 */
class BishopB extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_x']
    this.camp = true
  }
}

/**
 * 红象
 */
class BishopR extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_x']
  }
}

/**
 * 黑炮
 */
class CannonB extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_p']
    this.camp = true
  }
}

/**
 * 红炮
 */
class CannonR extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_p']
  }
}

/**
 * 黑将
 */
class KingB extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_j']
    this.camp = true
  }
}

/**
 * 红帅
 */
class KingR extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_j']
  }
}

/**
 * 黑马
 */
class KnightB extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_m']
    this.camp = true
  }
}

/**
 * 红马
 */
class KnightR extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_m']
  }
}

/**
 * 黑卒
 */
class PawnB extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_z']
    this.camp = true
  }
}

/**
 * 红兵
 */
class PawnR extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_z']
  }
}

/**
 * 黑车
 */
class RookB extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_c']
    this.camp = true
  }
}

/**
 * 红车
 */
class RookR extends Piece {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_c']
  }
}

export {
  AssistantsB,
  AssistantsR,
  BishopB,
  BishopR,
  CannonB,
  CannonR,
  KingB,
  KingR,
  KnightB,
  KnightR,
  PawnB,
  PawnR,
  RookB,
  RookR
}
