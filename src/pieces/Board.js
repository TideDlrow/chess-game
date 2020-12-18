import { Piece } from '@/pieces/pieces'

class Board {
  constructor () {
    this.board = null
    this.COL_NUM = 9
    this.ROW_NUM = 10
    this.initBoard()
  }

  initBoard () {
    for (let i = 0; i < this.ROW_NUM; i++) {
      for (let j = 0; j < this.COL_NUM; j++) {
        this.board[i][j] = null
      }
    }
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @return {Piece}
   */
  getPieceByCoordinate (x, y) {
    if ((x < 1 || y < 1) && (x > this.COL_NUM || y > this.ROW_NUM)) {
      //坐标异常
      throw '坐标异常'
    }
    return this.board[x - 1][y - 1]
  }

  /**
   * 某列是否存在棋子
   * @param {number} colNum
   */
  colIsExistPiece (colNum) {
    for (let i = 1; i <= this.ROW_NUM; ++i) {
      if (this.getPieceByCoordinate(colNum, i) != null) {
        return true
      }
    }
    return false
  }

  /**
   * 某行是否存在棋子
   *
   * @param {number} rowNum 行数
   * @return {boolean} true存在
   */
  rowIsExistPiece (rowNum) {
    for (let i = 1; i <= this.ROW_NUM; ++i) {
      if (this.getPieceByCoordinate(i, rowNum) != null) {
        return true
      }
    }
    return false
  }
}

export default Board
