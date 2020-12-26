import { pieceImg } from '@/assets'
import { getPieceNum, getPieceByPieceArray, isCoordinateLine, isOneStep } from '@/util/content'

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
    const piece = getPieceByPieceArray(pieceArray, b_x2, b_y2)
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
   * @param b_x
   * @param b_y
   * @param playerCamp
   */
  isEffectiveRange (b_x, b_y, playerCamp = false) {
    const { camp } = this
    //先判断x坐标是否在4~6之间 inRange的参数是左闭右开的区间
    if (_.inRange(b_x, 4, 7)) {
      if (playerCamp === camp) {
        //如果棋子在棋盘下方，则判断y坐标是否在8~10之间
        return !!_.inRange(b_y, 8, 11)
      } else {
        //如果棋子在棋盘上方方，则判断y坐标是否在1~3之间
        return !!_.inRange(b_y, 1, 4)
      }
    }
    return false
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

/**
 * 象
 */
class Bishop extends Piece {
  /**
   * 判断棋子处于棋盘的规定范围
   * @param b_x
   * @param b_y
   * @param playerCamp
   */
  isEffectiveRange (b_x, b_y, playerCamp = false) {
    const { camp } = this
    //先判断x坐标是否在1~9之间 inRange的参数是左闭右开的区间
    if (_.inRange(b_x, 1, 10)) {
      if (playerCamp === camp) {
        //如果棋子在棋盘下方，则判断y坐标是否在6~10之间
        return !!_.inRange(b_y, 6, 11)
      } else {
        //如果棋子在棋盘上方方，则判断y坐标是否在1~5之间
        return !!_.inRange(b_y, 1, 6)
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
    const piece = getPieceByPieceArray(pieceArray, b_x2, b_y2)
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
      getPieceByPieceArray(pieceArray, _.mean([b_x1, b_x2]), _.mean([b_y1, b_y2])) === null
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
    //先把非直线移动的排除
    if (!isCoordinateLine(b_x1, b_y1, b_x2, b_y2)) {
      return false
    }
    const { camp } = this
    const pieceNum = getPieceNum(b_x1, b_y1, b_x2, b_y2, pieceArray)
    const targetPiece = getPieceByPieceArray(pieceArray, b_x2, b_y2)
    //目标位置没有棋子，且原位置与目标位置之间也没有棋子
    if (targetPiece === null && pieceNum === 0) {
      return true
    } else if (targetPiece === null && pieceNum !== 0) {
      //这里是为了短路下面的条件
      return false
    } else if (targetPiece.camp !== camp && pieceNum === 1) {
      //目标位置为敌方棋子，且原位置与目标位置中间只有有一个棋子
      return true
    }
  }
}

/**
 * 黑炮
 */
class CannonB extends Cannon {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_p']
    this.camp = true
  }
}

/**
 * 红炮
 */
class CannonR extends Cannon {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_p']
  }
}

/**
 * 将/帅
 */
class King extends Piece {
  /**
   * 判断士处于棋盘的规定范围
   * @param b_x
   * @param b_y
   * @param playerCamp 玩家阵营 false表示红方
   */
  isEffectiveRange (b_x, b_y, playerCamp = false) {
    const { camp } = this
    //先判断x坐标是否在4~6之间 inRange的参数是左闭右开的区间
    if (_.inRange(b_x, 4, 7)) {
      if (playerCamp === camp) {
        //如果棋子在棋盘下方，则判断y坐标是否在8~10之间
        return !!_.inRange(b_y, 8, 11)
      } else {
        //如果棋子在棋盘上方方，则判断y坐标是否在1~3之间
        return !!_.inRange(b_y, 1, 4)
      }
    }
    return false;
  }

  /**
   * 验证将/帅能否从x1,y1行至x2,y2
   * @param b_x1 棋盘坐标
   * @param b_y1 棋盘坐标
   * @param b_x2 棋盘坐标
   * @param b_y2 棋盘坐标
   * @param pieceArray 棋子数组
   * @param playerCamp 玩家阵营
   *
   */
  verify (b_x1, b_y1, b_x2, b_y2, pieceArray, playerCamp = false) {
    const { camp } = this
    const targetPiece = getPieceByPieceArray(pieceArray, b_x2, b_y2)
    //查找另一个将/帅
    let anotherKingX = -1, anotherKingY = -1
    for (let i = 0; i < pieceArray.length; ++i) {
      for (let j = 0; j < pieceArray[i].length; ++j) {
        const piece = pieceArray[i][j]
        if (piece instanceof King && piece.camp !== camp) {
          anotherKingX = j + 1
          anotherKingY = i + 1
          break
        }
      }
    }

    return !!(
      //没有超过规定范围
      this.isEffectiveRange(b_x2, b_y2, playerCamp) &&
      //走的是直线
      isCoordinateLine(b_x1, b_y1, b_x2, b_y2) &&
      //仅走了一步
      isOneStep(b_x1, b_y1, b_x2, b_y2) &&
      //目标位置和另一个将/帅之间如果是直线，则要判断是否存在其他棋子，如果不是直线就不用考虑将/帅是否存在棋子
      (isCoordinateLine(b_x2, b_y2, anotherKingX, anotherKingY) ?
        getPieceNum(b_x2, b_y2, anotherKingX, anotherKingY, pieceArray) > 0 : true) &&
      //目标位置没有棋子，或为敌方棋子
      (targetPiece === null || targetPiece.camp !== camp)
    )

  }
}

/**
 * 黑将
 */
class KingB extends King {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_j']
    this.camp = true
  }
}

/**
 * 红帅
 */
class KingR extends King {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_j']
  }
}

/**
 * 马
 */
class Knight extends Piece {
  /**
   * 验证马能否从x1,y1行至x2,y2
   * @param b_x1 棋盘坐标
   * @param b_y1 棋盘坐标
   * @param b_x2 棋盘坐标
   * @param b_y2 棋盘坐标
   * @param pieceArray 棋子数组
   * @param playerCamp 玩家阵营
   *
   */
  verify (b_x1, b_y1, b_x2, b_y2, pieceArray, playerCamp = false) {
    const { camp } = this
    const targetPiece = getPieceByPieceArray(pieceArray, b_x2, b_y2)
    //马脚点
    let blockPointX = -1, blockPointY = -1
    if ((b_x2 - b_x1) === 2 && Math.abs(b_y2 - b_y1) === 1) {
      //2点和4点方向是同一个马脚
      blockPointX = b_x1 + 1
      blockPointY = b_y1
    } else if ((b_x1 - b_x2) === 2 && Math.abs(b_y2 - b_y1) === 1) {
      //8点和10点方向是同一个马脚
      blockPointX = b_x1 - 1
      blockPointY = b_y1
    } else if ((b_y1 - b_y2) === 2 && Math.abs(b_x1 - b_x2) === 1) {
      //11点和1点方向是同一个马脚
      blockPointX = b_x1
      blockPointY = b_y1 - 1
    } else if ((b_y2 - b_y1) === 2 && Math.abs(b_x1 - b_x2) === 1) {
      //5点和7点方向是同一个马脚
      blockPointX = b_x1
      blockPointY = b_y1 + 1
    }
    return !!(
      //走的不是直线
      !isCoordinateLine(b_x1, b_y1, b_x2, b_y2) &&
      //走的符合规则
      ((Math.abs(b_x2 - b_x1) + Math.abs(b_y2 - b_y1)) === 3) &&
      //马脚处没有棋子
      getPieceByPieceArray(pieceArray, blockPointX, blockPointY) === null &&
      (targetPiece === null || targetPiece.camp !== camp)

    )
  }
}

/**
 * 黑马
 */
class KnightB extends Knight {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_m']
    this.camp = true
  }
}

/**
 * 红马
 */
class KnightR extends Knight {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_m']
  }
}

/**
 * 卒/兵
 */
class Pawn extends Piece {
  /**
   * 验证卒/兵能否从x1,y1行至x2,y2
   * @param b_x1 棋盘坐标
   * @param b_y1 棋盘坐标
   * @param b_x2 棋盘坐标
   * @param b_y2 棋盘坐标
   * @param pieceArray 棋子数组
   * @param playerCamp 玩家阵营
   *
   */
  verify (b_x1, b_y1, b_x2, b_y2, pieceArray, playerCamp = false) {
    const { camp } = this
    const targetPiece = getPieceByPieceArray(pieceArray, b_x2, b_y2)
    //先把走了不止一步的排除
    if (!isOneStep(b_x1, b_y1, b_x2, b_y2)) {
      return false
    }
    let flag = false
    //棋盘下方的兵/卒
    if (camp === playerCamp) {
      //未过河
      if (b_y1 >= 6) {
        flag = (b_x1 === b_x2 && b_y2 < b_y1)
      } else {
        //过河后
        flag = (b_y2 <= b_y1)
      }
    } else {
      //棋盘上方的兵/卒
      //未过河
      if (b_y1 <= 5) {
        flag = (b_x1 === b_x2 && b_y2 > b_y1)
      } else {
        //过河后
        flag = (b_y2 >= b_y1)
      }
    }
    return flag && (targetPiece === null || targetPiece.camp !== camp)
  }
}

/**
 * 黑卒
 */
class PawnB extends Pawn {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_z']
    this.camp = true
  }
}

/**
 * 红兵
 */
class PawnR extends Pawn {
  constructor () {
    super()
    this.pieceImg = pieceImg['r_z']
  }
}

/**
 * 车
 */
class Rook extends Piece {
  /**
   * 验证车能否从x1,y1行至x2,y2
   * @param b_x1 棋盘坐标
   * @param b_y1 棋盘坐标
   * @param b_x2 棋盘坐标
   * @param b_y2 棋盘坐标
   * @param pieceArray 棋子数组
   * @param playerCamp 玩家阵营
   *
   */
  verify (b_x1, b_y1, b_x2, b_y2, pieceArray, playerCamp = false) {
    const { camp } = this
    const targetPiece = getPieceByPieceArray(pieceArray, b_x2, b_y2)
    return !!(
      //走的是直线
      isCoordinateLine(b_x1, b_y1, b_x2, b_y2) &&
      //原位置与目标位置不存在其他棋子
      getPieceNum(b_x1, b_y1, b_x2, b_y2, pieceArray) === 0 &&
      //目标位置不存在棋子或是敌方棋子
      (targetPiece === null || targetPiece.camp !== camp)
    )
  }
}

/**
 * 黑车
 */
class RookB extends Rook {
  constructor () {
    super()
    this.pieceImg = pieceImg['b_c']
    this.camp = true
  }
}

/**
 * 红车
 */
class RookR extends Rook {
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
