import _ from 'lodash'

/**
 * 获取从x1,y1到x2,y2的棋子数量，不包括这两个点。必须是一行或是一列
 * @param b_x1
 * @param b_y1
 * @param b_x2
 * @param b_y2
 * @param pieceArray
 */
function getPieceNum (b_x1, b_y1, b_x2, b_y2, pieceArray) {
  if (!isCoordinateLine(b_x1, b_y1, b_x2, b_y2)) {
    throw 'Two coordinates given do not belong to one row or one column'
  }
  let count = 0
  //列
  if (b_x1 === b_x2) {
    let begin = b_y1 < b_y2 ? b_y1 : b_y2
    let end = b_y1 > b_y2 ? b_y1 : b_y2
    for (let i = begin; i < end - 1; i++) {
      if (pieceArray[i][b_x1 - 1]) {
        ++count
      }
    }
  } else {
    //行
    let begin = b_x1 < b_x2 ? b_x1 : b_x2
    let end = b_x1 > b_x2 ? b_x1 : b_x2
    for (let i = begin; i < end - 1; i++) {
      if (pieceArray[b_y1 - 1][i]) {
        ++count
      }
    }
  }
  return count
}

/**
 * 根据坐标获取棋子
 * @param {Array} pieceArray 棋子数组
 * @param {number} b_x
 * @param {number} b_y
 */
function getPieceByPieceArray (pieceArray, b_x, b_y) {
  return pieceArray[b_y - 1][b_x - 1]
}

/**
 * 两坐标是否是直线
 * @param b_x1
 * @param b_y1
 * @param b_x2
 * @param b_y2
 */
function isCoordinateLine (b_x1, b_y1, b_x2, b_y2) {
  return (b_x1 - b_x2) * (b_y2 - b_y1) === 0
}

/**
 * 是否只移动了一部
 * @param b_x1
 * @param b_y1
 * @param b_x2
 * @param b_y2
 */
function isOneStep (b_x1, b_y1, b_x2, b_y2) {
  return isCoordinateLine(b_x1, b_y1, b_x2, b_y2) &&
    (Math.abs((b_x1 - b_x2) + (b_y2 - b_y1)) === 1)
}

export { getPieceNum, getPieceByPieceArray, isCoordinateLine,isOneStep }
