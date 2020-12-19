import { pieceImg } from '@/assets'
import fa from 'element-ui/src/locale/lang/fa'

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
    if (camp) {
      return pieceImg['b_box']
    } else {
      return pieceImg['r_box']
    }
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
    const outerBorderImg = this.getOuterBorderImg()
    if (outerBorderImg === null || outerBorderImg === undefined) {
      throw '请先设置棋子外框的图片'
    }
    const lengthOfSide = this.lengthOfSide
    ctx.drawImage(outerBorderImg, centerPixelX - lengthOfSide / 2, centerPixelY - lengthOfSide / 2, lengthOfSide, lengthOfSide)
  }
}

/**
 * 士
 */
class Assistants extends Piece {
  /**
   * 验证棋子能否从x1,y1行至x2,y2
   * @param b_x1 棋盘坐标
   * @param b_y1 棋盘坐标
   * @param b_x2 棋盘坐标
   * @param b_y2 棋盘坐标
   * @param pieceArray 棋子数组
   * @param playerCamp 玩家阵营
   *
   */
  verify (b_x1, b_y1, b_x2, b_y2, pieceArray, playerCamp = false) {
    const piece = pieceArray[b_y2 - 1][b_x2 - 1]
    const { camp } = this
    //  符合3个条件才能移动到指定位置
    //  1. 目标位置没有棋子或是敌方棋子
    //  2. 目标位置在棋盘规定范围内
    //  3. 士 一定是斜向移动，故需要判断原始和目标位置的x,y差值是否为1
    return !!((piece === null || piece.camp !== camp) &&
      this.isEffectiveRange(b_x2, b_y2, playerCamp) &&
      (Math.abs(b_x2 - b_x1) === 1 && Math.abs(b_y2 - b_y1) === 1))

  }

  /**
   * 判断士处于棋盘的规定范围
   * @param x
   * @param y
   * @param playerCamp
   */
  isEffectiveRange (x, y, playerCamp = false) {
    const { camp } = this
    //先判断x坐标是否在4~6之间 inRange的参数是左闭右开的区间
    if (_.inRange(x, 4, 7)) {
      if (playerCamp === camp) {
        //如果棋子在棋盘下方，则判断y坐标是否在8~10之间
        return !!_.inRange(y, 8, 11)
      } else {
        //如果棋子在棋盘上方方，则判断y坐标是否在1~3之间
        return !!_.inRange(y, 1, 4)
      }
    }
  }
}

/**
 * 黑士
 */
class AssistantsB extends Assistants {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_s']
    this.camp = true
  }
}

/**
 * 红士
 */
class AssistantsR extends Assistants {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_s']
  }
}

class Bishop extends Piece {
  /**
   * 判断棋子处于棋盘的规定范围
   * @param x
   * @param y
   * @param playerCamp
   */
  isEffectiveRange (x, y, playerCamp = false) {
    const { camp } = this
    //先判断x坐标是否在1~9之间 inRange的参数是左闭右开的区间
    if (_.inRange(x, 1, 10)) {
      if (playerCamp === camp) {
        //如果棋子在棋盘下方，则判断y坐标是否在6~10之间
        return !!_.inRange(y, 6, 11)
      } else {
        //如果棋子在棋盘上方方，则判断y坐标是否在1~5之间
        return !!_.inRange(y, 1, 6)
      }
    }
  }

  /**
   * 验证象能否从x1,y1行至x2,y2
   * @param b_x1 棋盘坐标
   * @param b_y1 棋盘坐标
   * @param b_x2 棋盘坐标
   * @param b_y2 棋盘坐标
   * @param pieceArray 棋子数组
   * @param playerCamp 玩家阵营
   *
   */
  verify (b_x1, b_y1, b_x2, b_y2, pieceArray, playerCamp = false) {
    const piece = pieceArray[b_y2 - 1][b_x2 - 1]
    const { camp } = this
    //  符合3个条件才能移动到指定位置
    //  1. 目标位置没有棋子或是敌方棋子
    //  2. 目标位置在棋盘规定范围内
    //  3. 象 一定是斜向移动，故需要判断原始和目标位置的x,y差值是否为2
    //  4. 原位置与目标位置中心没有其他棋子
    return !!(
      (piece === null || piece.camp !== camp) &&
      this.isEffectiveRange(b_x2, b_y2, playerCamp) &&
      (Math.abs(b_x2 - b_x1) === 2 && Math.abs(b_y2 - b_y1) === 2) &&
      pieceArray[_.mean([b_y1, b_y2]) - 1][_.mean([b_x1, b_x2]) - 1] === null
    )

  }
}

/**
 * 黑象
 */
class BishopB extends Bishop {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_x']
    this.camp = true
  }
}

/**
 * 红象
 */
class BishopR extends Bishop {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_x']
  }
}

class Cannon extends Piece {
  /**
   * 验证炮能否从x1,y1行至x2,y2
   * @param b_x1 棋盘坐标
   * @param b_y1 棋盘坐标
   * @param b_x2 棋盘坐标
   * @param b_y2 棋盘坐标
   * @param pieceArray 棋子数组
   * @param playerCamp 玩家阵营
   *
   */
  verify (b_x1, b_y1, b_x2, b_y2, pieceArray, playerCamp = false) {

  }

  /**
   * 获取从x1,y1到x2,y2的棋子数量，不包括这两个点。必须是一行或是一列
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   * @param pieceArray
   */
  getPieceNum (x1, y1, x2, y2, pieceArray) {
    if ((x2 - x1) * (y2 - y1) !== 0) {
      throw 'Two coordinates given do not belong to one row or one column'
    }
    let count = 0
    //列
    if (x1 === x2) {
      let begin = y1 < y2 ? y1 : y2
      let end = y1 > y2 ? y1 : y2
      for (let i = begin; i < end; i++) {
        if (pieceArray[i][x1]) {
          ++count
        }
      }
    } else {
      //行
      let begin = x1 < x2 ? x1 : x2
      let end = x1 > x2 ? x1 : x2
      for (let i = begin; i < end; i++) {
        if (pieceArray[y1][i]) {
          ++count
        }
      }
    }
    return count
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
