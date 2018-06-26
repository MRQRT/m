import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'
import {getStore} from '@/config/mUtils'

Vue.use(Vuex)

const state = {
	currentPrice:getStore('currentPrice','session'),//当前实时金价
	buyMargin:0.5,//买金设置的差额
	depPart: 0.5,// 黄金卖出减去的金额
	eye:1, //黄金账户是否可见
	balaEye:1, //余额账户是否可见
	token: getStore('token','local'),//用户是否登录判断的唯一标识
	userId: getStore('userId','local'),
	userInfo: getStore('userInfo','local'),//记录用户信息
	// userInfo: '',//记录用户信息
	address: '',//记录用户存金或取金地址
	updateAddress: '',//记录用户要修改的地址
	regularProducts:'', //定投产品列表
	regularProductParams:{},//选取的定投产品参数，定投产品的ID，设置的产品参数，克重
	recycleParams:null,//存金订单的参数
	modifiRecycleParams:null,//修改存金订单参数
	fillExtractInfo:null,//用户在填写提金订单时跳转地址时保存的信息
	selectCouponId:null,//用户选择的优惠券
	idCardUrl:null,//身份证地址
	returnRecycleOrder:null,//存金成功后返回的订单信息(需要放到订单成功页)
	rulerData: '10', //标尺刻度初始值为10，标尺刻度
	initRulerData:10 //标尺默认的值
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
})