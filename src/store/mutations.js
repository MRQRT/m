import {
	RECORD_CURRENPRICE,
	RECORD_EYE,
	RECORD_BALAEYE,
	RECORD_DEPPART,
	RECORD_TOKEN,
	CLEAR_TOKEN,
	RECORD_BUYMARGIN,
	RECORD_USERINFO,
	CLEAR_USERINFO,
	RECORD_ADDRESS,
	RECORD_REGULARPRODUCTS,
	RECORD_REGULARPRODUCTPARAMS,
	RECORD_RECYCLEPARAMS,
	RECORD_MODIFIRECYCLEPARAMS,
	RECORD_UPDATEADDRESS, //保存要编辑的地址
	RECORD_FILLEXTRACTINFO,
	RECORD_COUPONID,
	RECORD_IDCARDURL,
	RECORD_RETURNRECYCLEORDER,/*记录存金返回订单信息*/
	set_rulerData,
	set_initRulerData
} from './mutation-types.js'

import {setStore, getStore, setCookie ,getCookie, removeCookie, removeStore} from '../config/mUtils'


export default {
	//设置最高买入金价差值
	[RECORD_BUYMARGIN](state, buyMargin) {
		state.buyMargin = buyMargin;
	},
	//设置最低卖出金价差值
	[RECORD_DEPPART](state, depPart) {
		state.depPart = depPart
	},
	//记录实时金价
	[RECORD_CURRENPRICE](state,currentPrice) {
		state.currentPrice = currentPrice;
		setStore('currentPrice',currentPrice,'session')
	},
	//我的页面账户资金是否显示
	[RECORD_EYE](state, eye) {
		state.eye = eye
	},
	//我的现金账户资金是否显示
	[RECORD_BALAEYE](state, balaEye) {
		state.balaEye = balaEye
	},
	//设置用户token（userId,token）
	[RECORD_TOKEN](state, user) {
		state.token = user.userId+'_'+user.token
		state.userId = user.userId
		setStore("token", user.userId+"_"+user.token, "local")
		setStore("userId", user.userId, "local")
	},
	//清除用户token（uerId, token）
	[CLEAR_TOKEN](state) {
		state.token = null
		state.userId = null
		removeStore("token", "local")
		removeStore("userId", "local")
	},
	//设置用户信息（uerInfo）
	[RECORD_USERINFO](state, userInfo) {
		state.userInfo = userInfo
		setStore("userInfo", userInfo, 'local')
	},
	//清除用户信息（userInfo）
	[CLEAR_USERINFO](state, userInfo) {
		state.userInfo = null
		removeStore("userInfo", "local")
	},
	//设置用户取金或存金的地址
	[RECORD_ADDRESS](state, address){
		state.address = address
	},
	//保存用户要修改的地址
	[RECORD_UPDATEADDRESS](state, address){
		state.updateAddress = address
	},
	//记录首次调用定投产品接口所获取的产品信息
	[RECORD_REGULARPRODUCTS](state,regularProducts){
		state.regularProducts = regularProducts
	},
	//记录选择的定投产品参数
	[RECORD_REGULARPRODUCTPARAMS](state,productId){
		state.regularProductParams = {'productId':productId}
	},
	//设置存金订单的参数
	[RECORD_RECYCLEPARAMS](state,params){
		state.recycleParams = params
	},
	/*保存修改订单的参数*/
	[RECORD_MODIFIRECYCLEPARAMS](state,params){
		state.modifiRecycleParams = params
	},
	/*记录存金返回订单信息*/
	[RECORD_RETURNRECYCLEORDER](state,returnOrder){
		state.returnRecycleOrder = returnOrder
	},
	//设置填写提金订单时的参数
	[RECORD_FILLEXTRACTINFO](state,infoObj){
		state.fillExtractInfo = infoObj
	},
	//记录用户选择的优惠券
	[RECORD_COUPONID](state,id){
		state.selectCouponId = id
	},
	//记录用户提金时的身份证照片地址
	[RECORD_IDCARDURL](state,url){
		state.idCardUrl = url
	},
	//标尺刻度
	[set_rulerData](state, val) {
		var reval = '';
		if(val.match(/^\d+\.\d{1,1}$/)){
			reval=val+'0'
		}else{
			reval=val
		}
		state.rulerData = reval
	},
	//标尺默认刻度
	[set_initRulerData](state, val) {
		state.initRulerData = val
	}
}
