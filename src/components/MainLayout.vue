<template>
  <div class="mainLayout">
    <el-row class="contain">
      <el-col :span="20" class="leftSide">
        <board
          ref="board"
          @move="pieceMove"
        ></board>
      </el-col>
      <el-col :span="4" class="rightSide">
        <div class="username">
          用户名：{{ userName }}
        </div>
        <div class="buttons">
          <el-button plain type="primary" :disabled="PVPDisabled" @click="clickPVP">与玩家对战</el-button>
          <el-button plain type="primary" :disabled="PVEDisabled" @click="clickPVE">人机对战</el-button>
          <el-button type="danger" :disabled="defeatDisabled" @click="clickDefeat">认输</el-button>
          <el-button type="danger" @click="clickExit">退出登录</el-button>
          <!--          用于显示玩家的阵营颜色-->
          <div class="playerCamp" :style="{backgroundColor:(playerCamp?'black':'red')}">
            玩家阵营
          </div>
        </div>
      </el-col>
    </el-row>
    <login v-show="displayLogin" @success="loginSuccess"></login>
    <el-dialog
      :visible="dialogVisible"
    >
      正在匹配中。。。。{{ countDown }}
      <span slot="footer">
        <el-button type="danger" @click="matchDialogCancelClick">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="selectCampVisible"
      title="选择你喜欢的阵营"
    >
      <div class="selectCamp">

        <div class="left">
          <div class="red" @click="selectPVECamp(false)">红方</div>
        </div>
        <div class="right">
          <div class="black" @click="selectPVECamp(true)">黑方</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Board from '@/components/Board'
import Login from '@/components/Login'
import { getUserName, getToken, setToken } from '@/util/content'
import { PVPWebsocket, sendMessageByWebsocket } from '@/network/websocket'
import { bestNext } from '@/network/request-api'

export default {
  name: 'MainLayout',
  components: {
    Board,
    Login
  },
  data () {
    return {
      //是否显示登录界面
      displayLogin: true,
      userName: '',
      //玩家阵营
      playerCamp: false,
      //各按钮的禁用状态
      PVPDisabled: false,
      PVEDisabled: false,
      defeatDisabled: true,
      //匹配遮罩的可见状态
      dialogVisible: false,
      //选中阵营的对话框
      selectCampVisible: false,
      //匹配的倒计时
      countDown: 20,
      //pvp的websocket
      PVPWebsocket: null,
      //倒计时的定时器
      countDownInterval: null,
      //是否处于PVE的状态
      PVEState: false,
    }
  },
  mounted () {

  },
  methods: {
    getBoard () {
      return this.$refs['board']
    },
    /**
     * 登录/注册成功
     */
    loginSuccess ({
      token,
      username
    }) {
      this.displayLogin = false
      this.userName = username
    },
    /**
     * 点击PVP按钮
     */
    clickPVP () {
      //禁用PVP和PVE按钮
      this.PVEDisabled = true
      this.PVPDisabled = true
      this.defeatDisabled = true
      //连接
      this.PVPWebsocket = PVPWebsocket(getToken())
      this.PVPWebsocket.addEventListener('message', this.onMessage)
      this.PVPWebsocket.addEventListener('close', this.onClose)
      //打开遮罩
      this.dialogVisible = true
      //开始倒计时
      const _this = this
      _this.countDown = 20
      this.countDownInterval = setInterval(() => {
        _this.countDown--
        if (_this.countDown <= 0) {
          clearInterval(this.countDownInterval)
        }
      }, 1000)

    },
    /**
     * 点击PVE按钮
     */
    clickPVE () {
      this.selectCampVisible = true
    },
    /**
     * 点击认输按钮
     */
    clickDefeat () {
      const { PVEState } = this
      //PVE的情况下认输
      if (PVEState) {
        this.PVEState = false
      } else {
        this.PVPWebsocket.close()
      }
      //给棋盘加上遮罩
      this.getBoard().showMask()
      //重绘棋盘
      this.getBoard().redrawBoard()
      //禁用认输按钮、打开对战按钮
      this.setButtonState(false)
    },
    /**
     * 点击退出登录按钮
     */
    clickExit () {
      //清除token,username
      setToken('')
      this.userName = ''
      //显示登录界面
      this.displayLogin = true
      //给棋盘加上遮罩
      this.getBoard().showMask()
      //设置按钮状态
      this.setButtonState(false)
      //剩下处理步骤和认输一样
      this.clickDefeat()
    },
    onMessage (message) {
      console.log(message)
      const data = JSON.parse(message.data)
      const stage = data.stage
      const success = data.success
      if (success !== undefined) {
        const errorMessage = data.message
        this.$message.error(errorMessage)
        return
      }
      switch (stage) {
        case 'distribution':
          this.distributionStage(data)
          break
        case 'move':
          this.moveStage(data)
          break
        case 'finished':
          this.finishedStage(data)
          break
      }
    },
    onClose (event) {
      const reason = event.reason
      this.$message.error(reason)
      //给棋盘加上遮罩
      this.getBoard().showMask()
      //重绘棋盘
      this.getBoard().redrawBoard()
      //禁用认输按钮、打开对战按钮
      this.setButtonState(false)
    },
    distributionStage (message) {
      const {
        camp
      } = message
      //初始化棋盘设置
      this.getBoard().initBoardConfig()
      //设置玩家阵营
      this.playerCamp = camp
      this.getBoard().initPlayerCamp(camp)
      //关闭遮罩
      this.dialogVisible = false
      //画出棋盘棋子
      this.getBoard().redrawBoardAndPiece()
      //取消棋盘上的遮罩
      this.getBoard().cancelMask()
      //打开认输按钮
      this.setButtonState(true)
    },
    moveStage (message) {
      //step:'1,1,2,3'表示1,1的棋子移动到2,3
      const { step } = message
      const stepSplit = step.split(',')
      const x1 = stepSplit[0]
      const y1 = stepSplit[1]
      const x2 = stepSplit[2]
      const y2 = stepSplit[3]
      this.getBoard().movePiece({
        x1,
        y1,
        x2,
        y2
      })
    },
    finishedStage (message) {
      const {
        finished,
        isWin
      } = message
      if (isWin) {
        this.$message.success('恭喜！！赢了棋局')
      } else {
        this.$message.error('憨憨 这都能输！！！')
      }
      //给棋盘加上遮罩
      this.getBoard().showMask()
      //棋局结束后就重绘棋盘
      this.getBoard().redrawBoard()
      //禁用认输按钮、打开对战按钮
      this.setButtonState(false)
    },
    /**
     * 棋子移动事件
     */
    pieceMove ({
      x1,
      y1,
      x2,
      y2
    }) {
      const token = getToken()
      const {
        PVEState,
        playerCamp
      } = this
      //如果处于PVE状态
      if (PVEState) {
        this.getBestNextStepAndMove()
        return
      }
      const step = `${x1},${y1},${x2},${y2}`
      sendMessageByWebsocket(this.PVPWebsocket, `${token};${step}`)
    },
    /**
     * 设置PVP，PVE，认输按钮的状态。
     * 游戏进行时，PVP、PVE按钮禁用，认输按钮可用
     * 游戏结束时，PVP、PVE按钮可用，认输按钮禁用
     * @param {boolean} beginOrEnd  游戏进行中还是已经结束 true表示游戏正在进行中
     */
    setButtonState (beginOrEnd) {
      this.defeatDisabled = !beginOrEnd
      this.PVPDisabled = beginOrEnd
      this.PVEDisabled = beginOrEnd
    },
    matchDialogCancelClick () {
      this.dialogVisible = false
      clearInterval(this.countDownInterval)
      this.setButtonState(false)
    },
    /**
     * PVE时选择阵营的点击事件
     * true表示选择的是黑方  false表示选择的是红方
     * @param {boolean} PVECamp
     */
    selectPVECamp (PVECamp) {
      console.log(PVECamp)
      this.playerCamp = PVECamp
      this.PVEState = true
      this.getBoard().initBoardConfig(false)
      this.getBoard().initPlayerCamp(PVECamp)
      //取消阵营选择框
      this.selectCampVisible = false
      //画出棋盘棋子
      this.getBoard().redrawBoardAndPiece()
      //取消棋盘上的遮罩
      this.getBoard().cancelMask()
      //禁用其他对战按钮
      this.setButtonState(true)
      //如果玩家选择的是黑方
      if (PVECamp) {
        //让红方移动。延迟500毫秒，让玩家感觉不会那么突兀
        setTimeout(function () {
          this.getBestNextStepAndMove()
        }, 500)
      }
    },
    /**
     * 获取下一步，并移动
     */
    getBestNextStepAndMove () {
      const FENString = this.getBoard().getFEN()
      const { playerCamp } = this
      const _this = this
      bestNext(FENString, !playerCamp).then(data => {
        console.log(data)
        if (data) {
          const errorMessage = data["message"];
          //如果存在message这个属性，则表示出错了
          if (errorMessage){
            this.$message.error(errorMessage)
            return
          }
          const [bestNextX1, bestNextY1, bestNextX2, bestNextY2] = data
          if (bestNextX1 === -1) {
            this.$message.success('恭喜！！赢了棋局')
            return
          }
          _this.getBoard().movePiece({
            x1: bestNextX1,
            y1: bestNextY1,
            x2: bestNextX2,
            y2: bestNextY2
          })
        } else {
          this.$message.error('电脑反应不过来了。重来吧！！')
        }
      })
    },
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
  /*width: 20%;*/
  background-color: aliceblue;
}

.rightSide {
  height: 100%;
  /*width: auto;*/
  background-color: aqua;
}

.board {
  height: 100%;
  width: 100%;

}

.username {
  width: 100%;
  height: 10%;
}

.buttons {
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.el-button {
  width: 80%;
  margin-left: 0;
}

.playerCamp {
  width: 100px;
  height: 100px;
  /*background-color: black;*/
  border-radius: 50%;
  line-height: 100px;
  text-align: center;
  color: #fff;
}

.login {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background-color: #000;
  opacity: 0.9;
  z-index: 3;
}

.selectCamp {
  height: 100%;
  width: 100%;
  display: flex;
  color: #fff;
  flex-direction: row;
  align-items: center;
}

.selectCamp .left {
  flex-grow: 1;
}

.selectCamp .right {
  flex-grow: 1;
}

.selectCamp .left .red {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  background-color: red;
  text-align: center;
  line-height: 80px;
  margin: 0 auto;
}

.red:hover {
  cursor: pointer;
}

.selectCamp .right .black {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  background-color: black;
  text-align: center;
  line-height: 80px;
  margin: 0 auto;
}

.black:hover {
  cursor: pointer;
}
</style>
