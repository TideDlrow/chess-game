const requireContext = require.context('./pieces/', false, / *.png/)
const pieceImg = {}
// console.log(require('@/assets/pieces/b_c.png'))
requireContext.keys().forEach(item => {
  //item的值为  "./b_c.png"
  //imgUrl的值为图片的文本表示
  const imgUrl = requireContext(item)
  const img = new Image()
  img.src = imgUrl
  const imgUrlSplit = item.split('/')
  // img.src = '@/assets/pieces/' + imgUrlSplit[1]
  const imgName = imgUrlSplit[imgUrlSplit.length - 1].split('.')[0]
  pieceImg[imgName] = img
})

export { pieceImg }
