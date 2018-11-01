import App from '../App'

const buyGold = r => require.ensure([], () => r(require('../pages/buyGold/buyGold')), 'buyGold')
const storeGold = r => require.ensure([], () => r(require('../pages/storeGold/storeGold')), 'storeGold')
const benefit = r => require.ensure([], () => r(require('../pages/benefit/benefit')), 'benefit')
const mine = r => require.ensure([], () => r(require('../pages/mine/mine')), 'mine')
const infoList = r => require.ensure([], () => r(require('../pages/infoList/infoList.vue')), 'infoList')
const infoDet = r => require.ensure([], () => r(require('../pages/infoList/children/infoDetail.vue')), 'infoDetail')
const buy = r => require.ensure([], () => r(require('../pages/buy/buy.vue')), 'buy')
const buyProductDetail = r => require.ensure([], () => r(require('../pages/buy/buyProductDetail.vue')), 'buyProductDetail')
const coupon = r => require.ensure([], () => r(require('../pages/buy/children/coupon.vue')), 'coupon')
const makePrice = r => require.ensure([], () => r(require('../pages/buy/children/makePrice.vue')), 'makePrice')

const arg = r => require.ensure([], () => r(require('../pages/arguments/arg.vue')), 'arg')
const physicalArg = r => require.ensure([], () => r(require('../pages/arguments/physicalArg.vue')), 'physicalArg')

const stor = r => require.ensure([], () => r(require('../pages/stor/stor.vue')), 'stor')
const storResult = r => require.ensure([], () => r(require('../pages/stor/storResult.vue')), 'storResult')
const storOrder = r => require.ensure([], () => r(require('../pages/storOrder/storOrder.vue')), 'storOrder')
const storArg = r => require.ensure([], () => r(require('../pages/arguments/storArg.vue')), 'storArg')
const storOrderDet = r => require.ensure([], () => r(require('../pages/storOrder/storOrderDet.vue')), 'storOrderDet')
const report = r => require.ensure([], () => r(require('../pages/storOrder/report.vue')), 'report')

const buyResult = r => require.ensure([], () => r(require('../pages/buy/buyResult.vue')), 'buyResult')
const receiveCard = r => require.ensure([], () => r(require('../pages/buy/receiveCard.vue')), 'receiveCard')
const storAddress = r => require.ensure([], () => r(require('../pages/stor/storAddress.vue')), 'storAddress')
const modifiRecycleOrder = r => require.ensure([], () => r(require('../pages/stor/modifiRecycleOrder.vue')), 'modifiRecycleOrder')

const buyInvestment = r => require.ensure([], () => r(require('../pages/buyInvestment/buyInvestment.vue')), 'buyInvestment')
const investmentSetUp = r => require.ensure([], () => r(require('../pages/buyInvestment/setupInvestment.vue')), 'setupInvestment')
const buyInvestmentDetail = r => require.ensure([], () => r(require('../pages/buyInvestment/investmentDetail.vue')), 'investmentDetail')
const investmentMess = r => require.ensure([], () => r(require('../pages/buyInvestment/particularSetUp.vue')), 'particularSetUp')
const investSuc = r => require.ensure([], () => r(require('../pages/buyInvestment/investSuc.vue')), 'investSuc')

const currentAndHistory = r => require.ensure([], () => r(require('../pages/currentAndHistory/currentAndHistory.vue')), 'currentAndHistory')
const goldPriceOrigin = r => require.ensure([], () => r(require('../pages/currentAndHistory/goldPriceOrigin.vue')), 'goldPriceOrigin')
const extractGoldList = r => require.ensure([], () => r(require('../pages/extractGold/extractGoldList.vue')), 'extractGoldList')
const productDetail = r => require.ensure([], () => r(require('../pages/extractGold/productDetail.vue')), 'productDetail')
const fillInOrder = r => require.ensure([], () => r(require('../pages/extractGold/fillInOrder.vue')), 'fillInOrder')
const extractGoldResult = r => require.ensure([], () => r(require('../pages/extractGold/extractGoldResult.vue')), 'extractGoldResult')

const loginIn = r => require.ensure([], () => r(require('../pages/login/loginIn.vue')), 'loginIn')
const makePwd = r => require.ensure([], () => r(require('../pages/login/makePassWord.vue')), 'makePassWord')
const getBackPwd = r => require.ensure([], () => r(require('../pages/login/getBackPsw.vue')), 'getBackPsw')
const uploadPho = r => require.ensure([], () => r(require('../pages/stor/children/uploadPho.vue')), 'goldPriceOrigin')
const writeData = r => require.ensure([], () => r(require('../pages/stor/children/writeData.vue')), 'writeData')
const storSuc = r => require.ensure([], () => r(require('../pages/stor/children/storSuc.vue')), 'storSuc')
const uploadIdCard = r => require.ensure([], () => r(require('../pages/uploadIdCard/uploadIdCard.vue')), 'uploadIdCard')

const personHomepage = r => require.ensure([], () => r(require('../pages/mine/personHomepage.vue')), 'personHomepage')
const authentication = r => require.ensure([], () => r(require('../pages/mine/children/authentication.vue')), 'authentication')
const bindBank = r => require.ensure([], () => r(require('../pages/mine/children/bindBank.vue')), 'bindBank')
const safety = r => require.ensure([], () => r(require('../pages/safety/safety.vue')), 'safety')
const aboutUs = r => require.ensure([], () => r(require('../pages/aboutUs/aboutUs.vue')), 'aboutUs')
const address = r => require.ensure([], () => r(require('../pages/mine/children/address.vue')), 'address')
const addAddress = r => require.ensure([], () => r(require('../pages/mine/children/addAddress.vue')), 'addAddress')

const myGold = r => require.ensure([], () => r(require('../pages/myGold/myGold.vue')), 'myGold')
const sell = r => require.ensure([], () => r(require('../pages/sell/sell.vue')), 'sell')
const makePrice2 = r => require.ensure([], () => r(require('../pages/sell/children/makePrice2.vue')), 'makePrice2')
const sellResult = r => require.ensure([], () => r(require('../pages/sell/sellResult.vue')), 'sellResult')

const balance = r => require.ensure([], () => r(require('../pages/balance/balance.vue')), 'balance')
const myBank = r => require.ensure([], () => r(require('../pages/myBank/myBank.vue')), 'myBank')

const myExtractOrder = r => require.ensure([], () => r(require('../pages/extractGoldOrder/extractOrder.vue')), 'extractOrder')
const extractOrderDetail = r => require.ensure([], () => r(require('../pages/extractGoldOrder/extractOrderDetail.vue')), 'extractOrderDetail')
const findDelivery = r => require.ensure([], () => r(require('../pages/extractGoldOrder/findDelivery.vue')), 'findDelivery')

const tranDetail = r => require.ensure([], () => r(require('../pages/tranDetail/tranDetail.vue')), 'tranDetail')
const tranDetailInfo = r => require.ensure([], () => r(require('../pages/tranDetail/tranDetailInfo.vue')), 'tranDetailInfo')

const investmentOrder = r => require.ensure([], () => r(require('../pages/investmentOrder/investmentOrder.vue')), 'investmentOrder')
const investmentOrderDetail = r => require.ensure([], () => r(require('../pages/investmentOrder/investmentOrderDetail.vue')), 'investmentOrderDetail')

const myAbout = r => require.ensure([], () => r(require('../pages/myAbout/myAbout.vue')), 'myAbout')
const feedback = r => require.ensure([], () => r(require('../pages/myAbout/feedback.vue')), 'feedback')
const contact = r => require.ensure([], () => r(require('../pages/myAbout/contact.vue')), 'contact')

const commonProblem = r => require.ensure([], () => r(require('../pages/commonProblem/commonProblem.vue')), 'commonProblem')

const messCenter = r => require.ensure([], () => r(require('../pages/messageCenter/messCenter.vue')), 'messCenter')
const newsDetail = r => require.ensure([], () => r(require('../pages/messageCenter/newsDetail.vue')), 'newsDetail')
const setNews = r => require.ensure([], () => r(require('../pages/messageCenter/setNews.vue')), 'setNews')
const newsList = r => require.ensure([], () => r(require('../pages/messageCenter/newsList.vue')), 'newsList')

const withdraw = r => require.ensure([], () => r(require('../pages/withdraw/withdraw.vue')), 'withdraw')
const withdrawResult = r => require.ensure([], () => r(require('../pages/withdraw/withdrawResult.vue')), 'withdrawResult')
const recharge = r => require.ensure([], () => r(require('../pages/recharge/recharge.vue')), 'recharge')
const rechargeResult = r => require.ensure([], () => r(require('../pages/recharge/rechargeResult.vue')), 'rechargeResult')

const benefitNewest = r => require.ensure([], () => r(require('../pages/benefit/benefitNewest.vue')), 'benefitNewest')
const benefitHelp = r => require.ensure([], () => r(require('../pages/benefit/help.vue')), 'benefitHelp')

const myCoupon = r => require.ensure([], () => r(require('../pages/mine/myCoupon')), 'myCoupon')
const spring = r => require.ensure([], () => r(require('../pages/activity/spring')), 'spring')
const putupDetail = r => require.ensure([], () => r(require('../pages/activity/putupDetail')), 'putupDetail')

const register = r => require.ensure([], () => r(require('../pages/activity/worldCup/register')), 'register')
const ranking = r => require.ensure([], () => r(require('../pages/activity/worldCup/ranking')), 'ranking')
const rule = r => require.ensure([], () => r(require('../pages/activity/worldCup/rule')), 'rule')

const jiFen = r => require.ensure([], () => r(require('../pages/myJiFen/jiFen')), 'jiFen')
const inviteFriend = r => require.ensure([], () => r(require('../pages/myJiFen/inviteFriend')), 'jiFen')
const invitePage = r => require.ensure([], () => r(require('../pages/myJiFen/invitePage')), 'invitePage')
const attorn = r => require.ensure([], () => r(require('../pages/myJiFen/attorn')), 'attorn')


const myPutUp = r => require.ensure([], () => r(require('../pages/putUping/putUp')), 'myPutUp')

export default [{
    path: '/',
    component: App,
        children: [
        {
            path: '',
            redirect: '/buyGold',
            meta:{
                keepAlive:true
            }
        },
        {
            path: '/buyGold', //首页
            component: buyGold,
            meta:{
                keepAlive:true
            }
        },
        {
            path: '/spring', //活动
            component: spring
        },
        {
            path: '/putupDetail', //活动
            component: putupDetail
        },
        //世界杯排行榜
        {
            path: '/register', //签到
            component: register
        },
        {
            path: '/ranking', //排名
            component: ranking
        },
        {
            path: '/rule', //规则
            component: rule
        },
        {
            path: '/storeGold',
            component: storeGold,//导航存金页
            meta:{
                keepAlive:true
            }
        },
        {
            path: '/benefit',
            component: benefit,//生金页
            meta:{
                // keepAlive:true
                // keepAlive:false
            }
        },
        {
            path: '/benefitNewest',
            component: benefitNewest //生金页之最新动态
        },
        {
            path: '/benefitHelp',
            component: benefitHelp//生金攻略页
        },
        {
            path: '/mine',
            component: mine//我的页面
        },
        {
            path: '/myPutUp',
            component: myPutUp//我的挂单
        },
        {
            path: '/jiFen',
            component: jiFen,//我的积分页面
            meta: {
                requireAuth: true,
            }
        },
        {
            path: '/inviteFriend',
            component: inviteFriend,//邀请好友页面
        },
        {
            path: '/invitePage',
            component: invitePage,//邀请好友打开页面
        },
        {
            path: '/attorn',
            component: attorn,//转让积分页面
        },
        {
            path: '/myCoupon',
            component: myCoupon,//我的页面之优惠券
            // meta:{
            //     keepAlive:true
            // }
        },
        {
            path: '/personHomepage',//个人主页
            component: personHomepage,
            children:[
                {
                    path: 'authentication',//实名认证
                    component: authentication,
                    meta: {
                        requireAuth: true,
                    }
                },
                {
                    path: 'bindBank',//绑定银行卡
                    component: bindBank,
                    meta: {
                        requireAuth: true,
                    }
                },
                {
                    path: 'address',//地址
                    component: address,
                    meta: {
                        requireAuth: true,
                    },
                },
                {
                    path: 'addAddress',//添加地址
                    component: addAddress,
                    meta: {
                        requireAuth: true,
                    },
                }
            ]
        },
        {
            path: '/myGold',
            component: myGold,//我的黄金
            meta: {
                    requireAuth: true,
                },
        },
        {
            path: '/infoList', //资讯列表
            component: infoList,
            // meta: {
            //     keepAlive: true,
            // },
            children:[
                {
                    path: 'infoDetail', //资讯详情页
                    component: infoDet
                }
            ]
        },
        {
            path: '/buy', //买金
            component: buy,
            meta: {
                requireAuth: true,
                // deal: 1//交易开关判断
            },
            children:[
                {
                    path: 'coupon', //优惠券页
                    component: coupon,
                    meta:{
                        deal: 1//交易开关判断
                    }
                },
                {
                    path: 'makePrice', //价格设置页
                    component: makePrice,
                    meta:{
                        deal: 1//交易开关判断
                    }
                }
            ]
        },
        {
            path:'/buyProductDetail',//买金产品详情
            component: buyProductDetail
        },
        {
            path: '/receiveCard', //获取金卡
            component: receiveCard,
            meta: {
                    requireAuth: true,
                },
        },
        {
            path: '/arguments', //黄金管家服务协议
            component: arg
        },
        {
            path: '/physicalArg', //黄金管家提金服务协议
            component: physicalArg
        },
        {
            path: '/stor', //存金
            component: stor,
            meta:{
                deal:4,
                // keepAlive:true
            },
            children:[
                {
                    path: 'uploadPho',
                    component: uploadPho,//上传存金照片
                    meta:{
                        deal:4
                    },
                },
                {
                    path: 'storSuc',
                    component: storSuc,//存金成功
                    meta:{
                        deal:4
                    },
                },
                {
                    path: 'writeData',
                    component: writeData,//填写信息
                    meta:{
                        deal:4
                    },
                }
            ]
        },
        {
            path: '/storAddress',//存金地址
            component: storAddress,
        },
        {
            path: '/storArg', //黄金管家存金服务协议
            component: storArg
        },
        {
            path: '/storResult', //存金
            component: storResult,
        },
        {
            path:'/buyResult', //买金成功页
            component: buyResult
        },
        {
            path: '/currentAndHistory', //实时金价页
            component: currentAndHistory,
        },
        {
            path: '/goldPriceOrigin', //金价来源页
            component: goldPriceOrigin
        },
        {
            path: '/extractGoldList', //提金列表页
            component: extractGoldList,
            // meta:{
            //     keepAlive:true
            // }
        },
        {
            path: '/modifiRecycleOrder',//修改回购订单
            component: modifiRecycleOrder,
        },
        {
            path: '/productDetail', //提金详情页
            component: productDetail
        },
        {
            path: '/loginIn', //登入页
            component: loginIn
        },
        {
            path: '/makePwd', //密码设置页
            component: makePwd
        },
        {
            path: '/getBackPwd', //找回密码页
            component: getBackPwd
        },
        {
            path: '/buyInvestment', //定投列表页
            component: buyInvestment,
            // meta:{
            //     keepAlive:true
            // }
        },
        {
            path: '/investmentDetail', //定投详情页
            component: buyInvestmentDetail,
        },
        {
            path: '/investmentSetUp', //定投设置页番内
            component: investmentSetUp,
            meta: {
                    requireAuth: true,
                    deal:3
                },
        },
        {
            path: '/investmentMess', //定投设置页番外
            component: investmentMess
        },
        {
            path: '/investSuc', //定投设置成功页
            component: investSuc
        },
        {
            path: '/uploadIdCard', //上传身份证照片页
            component: uploadIdCard
        },
        {
            path: '/fillInOrder', //填写订单页
            component: fillInOrder
        },
        {
            path: '/extractGoldResult', //提金成功页
            component: extractGoldResult
        },
        {
            path: '/sell', //卖金
            component: sell,
            meta: {
                // deal: 2//交易开关判断
            },
            children: [
                {
                    path: 'makePrice2',
                    component: makePrice2,
                    meta: {
                       deal: 2//交易开关判断
                    },
                }
            ]
        },
        {
            path: '/sellResult', //卖金
            component: sellResult,
        },
        {
            path: '/safety', //安全保障页
            component: safety
        },
        {
            path: '/aboutUs', //了解我们页
            component: aboutUs
        },
        {
            path: '/balance',//我的现金
            component: balance,
            meta: {
                    requireAuth: true,
                },
        },
        {
            path: '/myBank', //我的银行卡页
            component: myBank,
             meta: {
                    requireAuth: true,
                },
        },
        {
            path: '/myExtractOrder', //提金订单页
            component: myExtractOrder,
            meta: {
                    requireAuth: true,
                    keepAlive:true,
                    savedPosition:null
                },
        },
        {
            path: '/extractOrderDetail', //提金订单详情页
            component: extractOrderDetail
        },
        {
            path: '/findDelivery', //查看物流页
            component: findDelivery
        },
        {
            path: '/tranDetail',//交易明细
            component: tranDetail,
            meta:{
                keepAlive:true,
                savedPosition:null
            }
        },
        {
            path: '/tranDetailInfo',//交易明细详情
            component: tranDetailInfo
        },
        {
            path: '/investmentOrder', //定投订单页
            component: investmentOrder,
            meta: {
                    requireAuth: true,
                    // keepAlive:true
            },
        },
        {
            path: '/investmentOrderDetail', //定投订单详情页
            component: investmentOrderDetail
        },
        {
            path: '/storOrder',//存金订单
            component: storOrder,
            meta: {
                    // requireAuth: true,
                    // keepAlive:true
            },
        },
        {
            path: '/storOrderDet',//存金详情
            component: storOrderDet
        },
        {
            path: '/myAbout', //关于我们页
            component: myAbout
        },
        {
            path: '/feedback', //意见反馈页
            component: feedback
        },
        {
            path: '/contact', //关于我们之联系方式页
            component: contact
        },
        {
            path: '/commonProblem', //常见问题页
            component: commonProblem
        },
        {
            path: '/messCenter', //消息中心页
            component: messCenter,
            meta: {
                    requireAuth: true,
                },
        },
        {
            path: '/newsList', //消息列表页newsList
            component: newsList,
            // meta:{
            //     keepAlive:true
            // }
        },
        {
            path: '/setNews', //消息设置页
            component: setNews
        },
        {
            path: '/newsDetail', //消息中心详情页
            component: newsDetail
        },
        {
            path: '/withdraw',//提现
            component: withdraw,
            meta:{
                deal:12
            }
        },
        {
            path: '/withdrawResult',//提现结果
            component: withdrawResult
        },
        {
            path: '/recharge',//充值
            component: recharge,
            meta:{
                deal:11
            }
        },
        {
            path: '/rechargeResult',//充值结果
            component: rechargeResult
        },
        {
            path: '/report',//检测报告
            component: report,
        }
    ]
}];
