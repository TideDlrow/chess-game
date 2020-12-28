# chess-gane

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 页面逻辑
主界面是MainLayout,未登录时Login界面覆盖在整个MainLayout上，登录后取消覆盖改为隐藏。

Board界面处于MainLayout界面的左侧，UserInfo界面处于MainLayout的右侧。

UserInfo显示用户名，操作有”与玩家对战“，”与电脑对战“，”认输“，”退出登录“。

点击”与玩家对战“后进入匹配阶段，次数整个界面被匹配界面覆盖，除了取消外无法进行其他操作。

匹配成功后”与玩家对战“及”与电脑对战“的按钮不可再点击，除非认输。

同理，”与电脑对战“点击后”与玩家对战“及”与电脑对战“的按钮不可再点击，除非认输。

认输按钮在未进行对战时不可点击。

登录/注册成功后将用户名保存到localStage，然后显示到UserInfo中。

PVP时若成功匹配会返回一个玩家阵营，该属性也应保存在localStage中，当玩家点击棋子时，若棋子阵营与玩家阵营相同，
则显示棋子外框，若阵营不相同则需判断当前是否已经选定棋子(即可能是吃子操作)。

后端棋盘中固定是黑方在棋盘下方，目前不考虑玩家视角（己方的棋子初始时在棋盘下方）。

收到websocket发过来的棋子移动信息后，记得把当前移动的玩家阵营翻转。

#### websocket 消息

前端发给后端：

```json
{
    token: "12345",
    step: "1,1,2,3",
}
```

后端发给前端:

若操作正确，则消息有

```json
//分配阵营阶段，camp表示玩家阵营，matchFlag表示成功匹配
{
    stage:"distribution",
    camp: true,
    matchFlag: true,
}
//正常下棋阶段，step:'1,1,2,3'表示1,1的棋子移动到2,3
{
    stage: 'move',
    step: '1,1,2,3'
}
//棋局结束，isWin表示是否胜利
{
    stage: 'finished',
    finished: true,
    isWin: true
}
```

若出现错误，则消息有

```json
{
   	success: false,
    code: 501,
    message: '错误原因',
}
```

#### 退出登录事件

#### 认输的逻辑

#### PVE逻辑





