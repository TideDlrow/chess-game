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
      :visible.sync="dialogVisible"
    >
      正在匹配中。。。。{{ countDown }}
      <span slot="footer">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Board from '@/components/Board'
import Login from '@/components/Login'
import { getUserName, getToken,setToken } from '@/util/content'
import { PVPWebsocket, sendMessageByWebsocket } from '@/network/websocket'

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
      userName: '1234',
      //玩家阵营
      playerCamp: false,
      //各按钮的禁用状态
      PVPDisabled: false,
      PVEDisabled: false,
      defeatDisabled: true,
      //遮罩的可见状态
      dialogVisible: false,
      //匹配的倒计时
      countDown: 20,
      //
      PVPWebsocket: null,
    }
  },
  mounted () {

  },
  methods: {
    getBoard(){
      return this.$refs['board']
    },
    /**
     * 登录/注册成功
     */
    loginSuccess ({token,username}) {
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
      //连接
      this.PVPWebsocket = PVPWebsocket(getToken())
      this.PVPWebsocket.addEventListener('message', this.onMessage)
      this.PVPWebsocket.addEventListener('close', this.onClose)
      //打开遮罩
      this.dialogVisible = true
      //开始倒计时
      const _this = this
      _this.countDown = 20
      const p = setInterval(() => {
        _this.countDown--
        if (_this.countDown <= 0) {
          clearInterval(p)
        }
      }, 1000)

    },
    /**
     * 点击PVE按钮
     */
    clickPVE () {
    },
    /**
     * 点击认输按钮
     */
    clickDefeat () {
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

    },
    onMessage (message) {
      console.log(message)
      const data = JSON.parse(message.data)
      const stage = data.stage
      const success = data.success
      if (success!==undefined){
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
    onClose(event){
      const reason = event.reason
      this.$message.error(reason)
      //重绘棋盘
      this.getBoard().redrawBoard()
      //禁用认输按钮、打开对战按钮
      this.defeatDisabled = true
      this.PVPDisabled = false
      this.PVEDisabled = false
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
      this.defeatDisabled = false
    },
    moveStage (message) {
      //step:'1,1,2,3'表示1,1的棋子移动到2,3
      const { step } = message
      const stepSplit = step.split(',')
      const x1 = stepSplit[0]
      const y1 = stepSplit[1]
      const x2 = stepSplit[2]
      const y2 = stepSplit[3]
      this.getBoard().movePiece({x1,y1,x2,y2})
    },
    finishedStage (message) {
      const { finished,isWin } = message
      if (isWin){
        this.$message.success("恭喜！！赢了棋局")
      }else {
        this.$message.error("憨憨 这都能输！！！")
      }
      //棋局结束后就重绘棋盘
      this.getBoard().redrawBoard()
      //禁用认输按钮、打开对战按钮
      this.defeatDisabled = true
      this.PVPDisabled = false
      this.PVEDisabled = false
    },
    /**
     * 棋子移动事件
     */
    pieceMove({x1,y1,x2,y2}){
      const token = getToken()
      const step = `${x1},${y1},${x2},${y2}`
      sendMessageByWebsocket(this.PVPWebsocket,`${token};${step}`)
    }
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
</style>
