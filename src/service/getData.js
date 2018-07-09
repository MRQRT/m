import {fetch} from '../config/fetch.js'
import {getStore,openAPI} from '../config/mUtils.js'
/**
 * 发送短信验证码
 */

export const sendSms = (telephone) => fetch('/v3/member/smsCaptcha',{'phone':telephone},'post');

/**
 * 短信验证码校验
 */

export const checkSms = (telephone,code) => fetch('/v3/member/checkSmsCaptcha',{"phone":telephone,"code":code},'post');


/**
 * 快捷登入
 */

export const quickLogin = (telephone,code,invitedBy,activityId) => fetch('/v3/member/quickLogin',{'telephone':telephone,'code':code,'invitedBy':invitedBy,'activityId':activityId},'post');


/**
 * 密码登入
 */

export const login = (username,password) => fetch('/v3/member/login',{'username':username,'password':password},'post');

/**
 * 图片验证码校验
 */

export const picCheck = (code) => fetch('/v3/member/checkCaptcha',{'code':code},'post');


/**
 * 重置登录密码
 */

export const updatePwd = (telephone,password,code) => fetch('/v3/member/putPwd',{'telephone':telephone,'password':password,'code':code},'put');

/**
 * 设置登录密码
 */

export const addPwd = (password) => fetch('/v3/member/addPwd',{'password':password},'post');

/**
 * 退出登录
 */

export const logout = () => fetch('/v3/member/logout',{},'delete')

/**
 * 获取实时金价
 */

export const queryGoldPrice = () => fetch('/v3/price/queryGoldPrice',{},'get')

/**
 * 查询当日价格曲线图
 */

export const queryPriceTo24h = () => fetch('/v3/price/queryPriceTo24h',{},'get')

/**
 * 查询历史收盘价
 */

export const queryClosePriceToDay = (month) => fetch('/v3/price/queryClosePriceToDay?month='+month,{},'get')

/**
 *  查询用户地址
 */

export const queryAddress = () => fetch('/v3/member/queryAddress',{},'get')

/**
 *  添加地址
 */

export const addAddress = (contact,telephone,address) => fetch('/v3/member/addAddress',{'contact':contact, 'telephone':telephone, 'address':address},'post')

/**
 *  设置默认地址
 */

export const putDefault = (id) => fetch('/v3/member/putDefault',{'id':id},'post')

/**
 *  删除地址
 */

export const delAddress = (id) => fetch('/v3/member/delAddress/'+id+'',{},'delete')

/**
 *  修改地址
 */

export const putAddress = (id, contact, telephone, address) => fetch('/v3/member/putAddress',{'id':id, 'contact':contact, 'telephone':telephone, 'address':address},'put')

/**
 * 上传图片
 */

export const uploadFile = (file) => fetch('/v3/member/uploadFile',{'file':file},'post')

/**
* 修改头像
*/

export const putAvatar = (avatar) => fetch('/v3/member/putAvatar',{'avatar':avatar},'put')

/*
* 原生xml上传头像
*/
//参数一表示vue实例，参数二表示base64格式的图片，参数三表示方法，参数四表示mint-ui的加载的动画，参数五是Toast提示,参数六是缩小的比例,参数七表示订单数组的索引值，参数八表示图片文件
export const xmlUploadImg=(current,src,method,Indicator,Toast,myrate,fa_index,file)=>{
    //myrate为4是上传头像 2是上传证件照和其他存金图片
    if(myrate){
        var myrate=myrate;
    }else{
        var myrate=2;
    }
    if(Indicator){
        Indicator.open();
    }
    var img = new Image,
    canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");

    img.crossOrigin = "Anonymous";
    var dataURLToBlob=function(url){
        var arr=url.split(','),mime=arr[0].match(/:(.*?);/)[1],
        bstr=atob(arr[1]),n=bstr.length,u8arr=new Uint8Array(n);
        while(n--){
            u8arr[n]=bstr.charCodeAt(n);
        }
        return new Blob([u8arr],{type:mime});
    }
    var form=new FormData();
    if(andVerson>4||iosVerson>10){
        img.onload = function() {
            var width = img.width;
            var height = img.height;
            // 按比例压缩4倍
            var rate = (width<height ? width/height : height/width)/myrate;
            canvas.width = width*rate;
            canvas.height = height*rate;
            ctx.drawImage(img,0,0,width,height,0,0,width*rate,height*rate);
            var src1 = canvas.toDataURL("image/jpg");
            var blob=dataURLToBlob(src1)
            form.append("file",blob,'image.jpg')
            xhr_send();
        };
    }else{
        form.append('files',file)
    }
    img.src = src;
    function xhr_send(){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", openAPI()+"/v3/member/uploadFile");
        xhr.send(form);
        var that=current;
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if(xhr.status==200){
                    if(Indicator){
                        Indicator.close();
                    }
                    var res=JSON.parse(xhr.responseText);
                    var uploadUrl=res.content;
                    that.url=uploadUrl;
                    if(that.order && that.order.idPic){
                        that.order.idPic=uploadUrl;
                    }
                    if(method){
                        that[method](fa_index);
                    }
                }else if(xhr.status==500){
                    Toast({
                        message:'服务器出错',
                        position: 'bottom',
                        duration: 3000
                    })
                }
            }
        }
    }    
}

/**
 * 实名认证
 */

export const realNameAuth = (name, cardno) => fetch('/v3/member/realNameAuth',{'name':name, 'cardno':cardno},'post')

/**
 * 查询我的概况
 */

export const queryMyProfil = () => fetch('/v3/member/queryMyProfil',{},'get')

/**
 * 获取银行卡名称
 */

export const bankCardBin = (cardno) => fetch('/v3/member/bankCardBin?cardno='+cardno,{},'get')

/**
 * 获取银行卡名称（充值）
 */

export const rechargeMax = (cardno) => fetch('/v3/order/rechargeMax?cardno='+cardno,{},'get')

/**
 * 获取银行卡名称（提现）
 */

export const withDrawMax = (cardno) => fetch('/v3/order/withDrawMax?cardno='+cardno,{},'get')

/**
 * 查询用户银行卡
 */

export const queryBankCard = () => fetch('/v3/member/queryBankCard',{},'get')

/**
 * 绑定银行卡
 */

export const boundBankCard = (cardno, phone, expiryYear, expiryMonth, cvvCode, code) => fetch('/v3/member/boundBankCard',{'cardno':cardno, 'phone':phone,'expiryYear':expiryYear,'expiryMonth':expiryMonth,'cvvCode':cvvCode,'code':code},'post')

/**
 * 解绑银行卡
 */

export const unBindCard = ( id ) => fetch('/v3/member/unBindCard',{'id':id},'put')

/**
 * 查询提金产品列表
 */

export const queryGoods = () => fetch('/v3/physicalProduct/queryGoods',{},'get')

/**
 * 查询提金产品实物详情
 */

export const queryGoodsDetail = (id) => fetch('/v3/physicalProduct/queryGoodsDetail/'+id,{},'get')

/**
 * 根据实物克重查看实物详情
 */

export const queryGoodsByPhysicalId = (physicalId) => fetch('/v3/physicalProduct/queryGoodsByPhysicalId?physicalId='+physicalId,{},'get')

/**
 * 查询实物克重列表
 */

export const queryGoodsWeightList = (id) => fetch('/v3/physicalProduct/queryGoodsWeightList/'+id,{},'get')

/**
 * 查询存金产品列表
 */

export const queryRecycleProduct = () => fetch('/v3/recycleProduct/queryRecycleProduct',{},'get')

/**
 * 查询存金产品品牌
 */

export const queryChildDictionary = () => fetch('/v3/recycleOrder/queryChildDictionary',{},'get')

/**
 * 添加存金订单
 */

export const addRecycleOrder = (rOrder,contact,telephone,address,isCash,idPic) => fetch('/v3/recycleOrder/addRecycleOrder',{'rOrder':rOrder,'contact':contact,'telephone':telephone,'address':address,'isCash':isCash,'idPic':idPic},'post')

/**
 * 修改存金订单
 */

export const updateRecycleOrder = (contact,telephone,address,id,isCash,productId,idPic,urls,brandType,applyWeight,picUrls,brandName) => fetch('/v3/recycleOrder/updateRecycleOrder',{'contact':contact,'telephone':telephone,'address':address,'id':id,'isCash':isCash,'productId':productId,'idPic':idPic,'urls':urls,'brandType':brandType,'applyWeight':applyWeight,'picUrls':picUrls,'brandName':brandName},'post')

/**
 * 查询用户存金订单列表
 */

export const queryRecycleOrder = (pageNum,pageSize) => fetch('/v3/recycleOrder/queryRecycleOrder?pageNum='+pageNum+'&pageSize='+pageSize,{},'get')


/**
 * 查询用户存金订单实物图片
 */

export const queryRecycleDocument = (orderId,type) => fetch('/v3/recycleOrder/queryRecycleDocument',{orderId,type},'post')

/**
 * 查询用户存金订单详情
 */

export const queryRecycleOrderDetail = (id) => fetch('/v3/recycleOrder/queryRecycleOrderDetail?id='+id,{},'get')

/**
 * 取消用户存金订单
 */

export const cancellation = (id) => fetch('/v3/recycleOrder/cancellation',{'id':id},'put')

/**
 * 用户确认订单结果
 */

export const confirmationResult = (id,confirmResult) => fetch('/v3/recycleOrder/confirmationResult',{'id':id,'confirmResult':confirmResult},'put')

/**
 * 创建提金订单
 */

export const addGoodsOrder = (physicalId,quantity,addressId,idPic) => fetch('/v3/physicalOrder/addGoodsOrder',{'physicalId':physicalId,'quantity':quantity,'addressId':addressId,'idPic':idPic},'post')

/**
 * 查看提金详情通过id
 */

export const queryPhysicalDetail = (id) => fetch('/v3/query/physicalOrderDetail?id='+id,{},'post')

/**
 * 查看提金详情通过订单号
 */

export const queryPhysicalDetailByOrderNo = (id) => fetch('/v3/physicalOrder/queryPhysicalDetailByOrderNo?id='+id,{},'get')

/**
 * 查看提金详情通过订单编号
 */

export const queryPhysicalDetailByNo = (orderNo) => fetch('/v3/physicalOrder/queryPhysicalDetailByNo?orderNo='+orderNo,{},'get')

/**
 * 获取提金订单列表
 */

export const queryPhysical = (pageNum,pageSize) => fetch('/v3/query/physicalOrderList',{'pageNum':pageNum,'pageSize':pageSize},'post')

/**
 * 获取新闻资讯标题列表
 */

export const queryNews = () => fetch('/v3/content/queryNews',{},'get')

/**
 * 获取新闻资讯分页列表
 */

export const queryNewsPager = (pageNum,pageSize) => fetch('/v3/content/queryNewsPager?pageNum='+pageNum+'&pageSize='+pageSize,{},'get')

/**
 * 新闻资讯详情
 */

export const queryNewsDetail = (id) => fetch('/v3/content/queryNewsDetail/'+id,{},'get')


/**
 * 查询用户消息(消息中心)
 */

export const queryMessagMain = () => fetch('/v3/member/queryMessagMain',{},'get')

/**
 * 查询用户消息设置(消息中心)
 */

export const queryMessageConfig = () => fetch('/v3/member/queryMessageConfig',{},'get')

/**
 * 更新用户消息设置(消息中心)
 */

export const putMessageConfig = (id, noticeGoldNews, noticeSystem, noticeActivity, noticeGoldBeanMature) => fetch('/v3/member/putMessageConfig',{'id':id,'noticeGoldNews':noticeGoldNews,'noticeSystem':noticeSystem,'noticeActivity':noticeActivity,'noticeGoldBeanMature':noticeGoldBeanMature},'put')

/**
 * 查询用户消息分页列表(消息中心)
 */

export const queryPageMsg = (type,pageNum,pageSize) => fetch('/v3/member/queryPageMsg?type='+type+'&pageNum='+pageNum+'&pageSize='+pageSize,{},'get')

/**
 * 查询用户消息详情(消息中心)
 */

export const queryMsgDetail = (id) => fetch('/v3/member/queryMsgDetail/'+id,{},'get')

/**
 * 查询用户未读消息数量(消息中心)
 */

export const queryMessagUnreadCount = (id) => fetch('/v3/member/queryMessagUnreadCount',{},'get')

/**
 * 查询定投产品列表(已登入)
 */

export const queryRegularProductHasLogin = (userId) => fetch('/v3/regularProduct/queryRegularProduct?userId='+userId,{},'get')

/**
 * 查询定投产品列表(没有登入)
 */

export const queryRegularProduct = () => fetch('/v3/regularProduct/queryRegularProduct',{},'get')

/**
 * 查询定投完成日期和下次转入时间
 */

export const queryRegularEndDate = (term,regularInterval,regularDay) => fetch('/v3/regularOrder/queryRegularEndDate?term='+term+'&regularInterval='+regularInterval+'&regularDay='+regularDay,{},'get')

/**
 * 添加定投计划（按克数定投）
 */

export const addRegularPlan1 = (productId,budgetWeight,term,regularInterval,regularDay,regularAmount) => fetch('/v3/regularOrder/addRegularPlan',{'productId':productId,'budgetWeight':budgetWeight,'term':term,'regularInterval':regularInterval,'regularDay':regularDay,'regularAmount':regularAmount},'post')

/**
 * 添加定投计划（按金额定投）
 */

export const addRegularPlan2 = (productId,budgetAmount,term,regularInterval,regularDay,regularAmount) => fetch('/v3/regularOrder/addRegularPlan',{'productId':productId,'budgetAmount':budgetAmount,'term':term,'regularInterval':regularInterval,'regularDay':regularDay,'regularAmount':regularAmount},'post')

/**
 * 查询用户定投计划分页列表
 */

export const queryPageRegular = (pageNum,pageSize) => fetch('/v3/regularOrder/queryPageRegular?pageNum='+pageNum+'&pageSize='+pageSize,{},'get')

/**
 * 查询用户定投详情
 */

export const queryRegularInfo = (id) => fetch('/v3/regularOrder/queryRegularInfo?id='+id,{},'get')

/**
 * 终止定投计划
 */

export const stopRegularPlan = (id) => fetch('/v3/regularOrder/stopRegularPlan',{'id':id},'post')

/**
 * 创建活期金买入订单 永久有效传0 当天有限传1
 */

export const demandBuyOrder = (amount,weight,maxPrice,term,userCouponId) => fetch('/v3/order/demandBuyOrder',{'amount':amount,'weight':weight,'maxPrice':maxPrice,'term':term,'userCouponId':userCouponId},'post')

/**
 * 创建活期金卖出订单
 */

export const demandSellOrder = (weight,minPrice,term) => fetch('/v3/order/demandSellOrder',{'weight':weight,'minPrice':minPrice,'term':term},'post')//term 有效期(0永久有效1当天有效)

/**
 * 订单验证  code 0 成功 1 失败    countByDay 当日累计有效交易次数
 */

export const orderCheck = (weight,amount,bizType) => fetch('/v3/order/orderCheck',{'weight':weight,'amount':amount,'bizType':bizType},'post')

/**
 * 获取用户优惠券
 */

export const queryCoupons = (pageNum,pageSize,userId,type) => fetch('/v3/activity/queryCoupons?pageNum='+pageNum+'&pageSize='+pageSize+'&userId='+userId+'&type='+type,{},'get')

/**
 * 查询用户活期利息
 */

// export const iInterestApi = (userId) => fetch('/v3/interest/iInterestApi?userId='+userId,{},'get')

/**
 * 利息收取明细列表
 */

export const queryInterest = (pageNum,pageSize) => fetch('/v3/interest/queryInterest?pageNum='+pageNum+'&pageSize='+pageSize,{},'get')

/**
 * 查询用户获得的金卡
 */

export const queryUserCollectCard = (userId) => fetch('/v3/activity/queryUserCollectCard?userId='+userId,{},'get')

/**
* 用户充值订单发短信申请
*/

export const  rechargeOrderApply = (userBankId,payProductId,amount) => fetch('/v3/order/rechargeOrderApply',{"userBankId":userBankId,"payProductId":payProductId,"amount":amount},'post')

/**
* 用户充值订单重发短信申请
*/

export const  rechargeOrderApplyRestart = (id,userBankId,payProductId,amount) => fetch('/v3/order/rechargeOrderApplyRestart',{"id":id,"userBankId":userBankId,"payProductId":payProductId,"amount":amount},'post')

/**
* 用户充值订单提交
*/

export const  rechargeOrderConfirm = (id,smsCode) => fetch('/v3/order/rechargeOrderConfirm',{"id":id,"smsCode":smsCode},'post')

/**
* 用户提现订单提交
*/

export const  withdrawOrderApply = (userBankId,payProductId,amount,smsCode) => fetch('/v3/order/withdrawOrderApply',{"userBankId":userBankId,"payProductId":payProductId,'amount':amount,'smsCode':smsCode},'post')

/**
 * APP banner 或者广告弹屏
 */

export const getLimit = (position, number) => fetch('/v3/adPic/getLimit',{'position':position,'number':number},'post')

/**
 * 获取用户金价评论列表
 */

export const getCommentList = (pageNum, pageSize) => fetch('/v3/contentCmt/getCommentList',{'pageNum':pageNum,'pageSize':pageSize},'post')

/**
 * 获取看涨跌总数，以及数量
 */

export const getUpDown = () => fetch('/v3/contentCmt/getUpDown',{},'get')

/**
 * 检验用户是否评论，看涨跌
 */

export const userCmt = () => fetch('/v3/contentCmt/userCmt',{},'post')

/**
 * 用户进行评论，看涨跌
 */

export const inEdCmt = (updown, discussContent) => fetch('/v3/contentCmt/inEdCmt',{"updown":updown,"discussContent":discussContent},'post')

/**
 * 查看物流详情
 */

export const queryExpress = (expressNo, type) => fetch('/v3/express/queryExpress?expressNo='+expressNo,{},'get')

/**
* 成本均价和浮动盈亏
*/

export const floatingAverage = () => fetch('/v3/interest/floatingAverage',{},'get')

/**
* 查询收取状态
*/

export const interestByUser = () => fetch('/v3/interest/interestByUser',{},'get')

/**
* 查询管理总克重
*/

export const allTradeWeight = () => fetch('/v3/interest/allTradeWeight',{},'get')

/**
* 收取活期利息
*/

export const addAccount = () => fetch('/v3/interest/addAccount',{},'get')

/**
* 取消挂单
*/

export const updatePendingPlan = (id) => fetch('/v3/pending/updatePendingPlan',{'id':id},'post')

/**
* 查询挂单计划详情
*/

export const queryPendingPlanDetail = (id) => fetch('/v3/pending/queryPendingPlanDetail',{'id':id},'post')

/**
* 查询用户挂单计划分页列表
*/

export const queryPagePendingPlan = (pageNum,pageSize) => fetch('/v3/pending/queryPagePendingPlan',{'pageNum':pageNum,'pageSize':pageSize},'post')


/**
* 黄金买卖交易列表查询
*/

export const queryCommonDemandOrder = (pageNum,pageSize) => fetch('/v3/query/queryCommonDemandOrder',{'pageNum':pageNum,'pageSize':pageSize},'post')

/**
* 活期金买入订单查询列表
*/

export const demandBuyOrderList = (pageNum,pageSize) => fetch('/v3/query/demandBuyOrderList',{'pageNum':pageNum,'pageSize':pageSize},'post')

/**
* 活期金买入订单查询详情
*/

export const demandBuyOrderDetail = (id) => fetch('/v3/query/demandBuyOrderDetail',{'id':id},'post')

/**
* 活期金卖出订单查询列表
*/

export const demandSellOrderList = (pageNum,pageSize) => fetch('/v3/query/demandSellOrderList',{'pageNum':pageNum,'pageSize':pageSize},'post')

/**
* 活期金卖出订单查询详情
*/

export const demandSellOrderDetail = (id) => fetch('/v3/query/demandSellOrderDetail',{'id':id},'post')


/**
* 充值订单查询列表
*/

export const rechargeOrderList = (pageNum,pageSize) => fetch('/v3/query/rechargeOrderList',{'pageNum':pageNum,'pageSize':pageSize},'post')

/**
* 充值订单查询详情
*/

export const rechargeOrderDetail = (id) => fetch('/v3/query/rechargeOrderDetail',{'id':id},'post')

/**
* 查询收取赠金
*/

export const queryAwardOrder = () => fetch('/v3/interest/queryAwardOrder',{},'get')

/**
* 收取赠金
*/

export const updateAwardOrder = (id) => fetch('/v3/interest/updateAwardOrder?id='+id,{},'get')

/**
* 查询用户定期金买入订单分页列表
*/

export const queryFixedBuyOrder = (pageNum,pageSize) => fetch('/v3/order/queryFixedBuyOrder?pageNum='+pageNum+'&pageSize='+pageSize,{},'get')

/**
* 查询定期金买入订单详情
*/

export const queryFixedBuyOrderDetail = (id) => fetch('/v3/order/queryFixedBuyOrderDetail?id='+id,{},'get')

/**
* 查询用户赠金分页列表
*/

export const queryPageAwardOrder = (pageNum,pageSize) => fetch('/v3/award/queryPageAwardOrder?pageNum='+pageNum+'&pageSize='+pageSize,{},'get')

/**
* 查询赠金详情(暂时没有用到)
*/

export const queryAwardOrderDetail = (id) => fetch('/v3/award/queryAwardOrderDetail?id='+id,{},'get')

/**
* 查询用户定投执行记录分页列表
*/

export const queryRegularRecords = (pageNum,pageSize) => fetch('/v3/regularOrder/queryRegularRecords?pageNum='+pageNum+'&pageSize='+pageSize,{},'get')

/**
* 查询定投执行记录详情
*/

export const queryRegularRecordInfo = (id) => fetch('/v3/regularOrder/queryRegularRecordInfo?id='+id,{},'get')

/**
* 查询用户挂单计划分页列表(type 0 挂单买入 1 挂单卖出)
*/

export const queryPagePendingRecord = (pageNum,pageSize,type) => fetch('/v3/pending/queryPagePendingRecord',{'pageNum':pageNum,'pageSize':pageSize,'type':type},'post')

/**
* 查询挂单成交详情
*/

export const queryPendingRecordDetail = (id) => fetch('/v3/pending/queryPendingRecordDetail',{'id':id},'post')

/**
* 查询用户交易列表
*/

export const queryCommonOrder = (pageNum,pageSize) => fetch('/v3/query/queryCommonOrder',{'pageNum':pageNum,'pageSize':pageSize},'post')

/**
* 查询用户交易详情
*/

export const queryCommonOrderDetail = (id,type) => fetch('/v3/query/queryCommonOrderDetail',{'id':id,'type':type},'post')

/**
* 查询用户已有订单类型
*/

export const queryOrderType = (pageNum,pageSize) => fetch('/v3/query/queryOrderType',{'pageNum':pageNum,'pageSize':pageSize},'post')

/**
* 查询利息图表
*/

export const queryRate = () => fetch('/v3/interest/queryRate',{},'get')

/**
* 查询用户交易明细(现金类)
*/

export const queryCashCommonOrder = (pageNum,pageSize) => fetch('/v3/query/queryCashCommonOrder',{'pageNum':pageNum,'pageSize':pageSize},'post')

/**
 * 查询用户参与的活动
 */

export const queryActivity = () => fetch('/v3/activity/queryActivity',{},'get')

/**
 * 查询收取总利息
 */

export const queryAllInterest = () => fetch('/v3/interest/queryAllInterest',{},'get')

/**
 * 查询活期金手续费
 */

export const queryDemandFee = () => fetch('/v3/query/queryDemandFee',{},'post')

/**
 * 交易开关校验 1-活期金买入,2.活期金卖出,3.定投,4.存金,5.提金,6.定期,7.生息,8.任务奖励,9.挂单-买,10.挂单-卖,11.充值,12.提现
 */

export const bizCloseCheck = (bizCode) => fetch('/v3/query/bizCloseCheck',{'bizCode':bizCode},'post')

/**
 * 计算充值提现手续费
 */

export const getTradeFee = (tradeMoney,prodCode,tradeType) => fetch('/v3/trade/getTradeFee?tradeMoney='+tradeMoney+'&prodCode='+prodCode+'&tradeType='+tradeType,{},'get')

/**
* 未登入时查看我的任务
*/

export const queryActivityTask = () => fetch('/v3/activity/queryActivityTask',{},'get')

/**
* 活动查询
*/

export const queryRank = () => fetch('/v3/activity/queryRank',{},'get')

/**
* 查询待用户确认存金订单列表
*/

export const queryRecycleOrderRead = () => fetch('/v3/recycleOrder/queryRecycleOrderRead',{},'get')

/**
* 查询用户总积分
*/

export const queryIntegralBalance = () => fetch('/v3/integralOrder/queryIntegralBalance',{},'get')

/**
* 查询好友助力列表
*/

export const queryFriendsHelpList = (pageNum,pageSize) => fetch('/v3/integralOrder/queryFriendsHelpList?pageNum='+pageNum+'&pageSize='+pageSize,{},'get')

/**
* 查询用户积分列表
*/

export const queryIntegralList = (pageNum,pageSize) => fetch('/v3/integralOrder/queryIntegralList?pageNum='+pageNum+'&pageSize='+pageSize,{},'get')

/**
* 查询用户邀请好友列表
*/

export const queryInvitedFrendsList = () => fetch('/v3/integralOrder/queryInvitedFrendsList',{},'get')

/**
* 转让积分
*/

export const turnIntegral = (getUserName,integral) => fetch('/v3/integralOrder/turnIntegral',{'getUserName':getUserName,'integral':integral},'post')

/**
* 查询鲸鱼币产品ID
*/

export const queryProductId = () => fetch('/v3/integralOrder/queryProductId',{},'get')

/**
* 转让第三方
*/

export const turnIntegralOfThird = (integral) => fetch('/v3/integralOrder/turnIntegralOfThird',{'integral':integral},'post')

/**
* 活期金买入订单查询列表未登录
*/

export const orderDemandBuyOrderVoList = (pageNum,pageSize) => fetch('/v3/query/orderDemandBuyOrderVoList',{'pageNum':pageNum,'pageSize':pageSize},'post')

/**
* 查询购买起息到账日期
*/
export const interestDate = (bizCode) => fetch('/v3/query/interestDate',{'bizCode':bizCode},'post')

/**
* 创建提金订单
*/

export const generatePhyOrder = (physicalId,genType,addressId,quantity,prodCode,appendMoney) => fetch('/v3/physicalOrder/generatePhyOrder',{'physicalId':physicalId,'genType':genType,'addressId':addressId,'quantity':quantity,'prodCode':prodCode,'appendMoney':appendMoney},'post')

/**
* 提金确认收货
*/

export const takeDeliveryOrder = (orderId) => fetch('/v3/physicalOrder/takeDeliveryOrder?orderId='+orderId,{},'get')

/**
* 提金订单-补差价确认支付
*/

export const confirmPhyOrder = (orderId,smsCode) => fetch('/v3/physicalOrder/confirmPhyOrder',{'orderId':orderId,'smsCode':smsCode},'post')

/**
* 创建用户补差价订单-申请(发短信)
*/

export const goingPayPhysicalOrder = (userBankId,payProductCode,appendMoney,phyOrderId) => fetch('/v3/physicalOrder/goingPayPhysicalOrder',{'userBankId':userBankId,'payProductCode':payProductCode,'appendMoney':appendMoney,'phyOrderId':phyOrderId},'post')

/**
* 创建用户补差价订单-申请(发短信)
*/

export const rechargeApplyRetry = (rechargeOrderId,userBankId,payProductCode,appendMoney) => fetch('/v3/physicalOrder/rechargeApplyRetry',{'rechargeOrderId':rechargeOrderId,'userBankId':userBankId,'payProductCode':payProductCode,'appendMoney':appendMoney},'post')

/**
 * 查看提金详情通过id
 */

export const queryPhysicalDetailById = (id) => fetch('/v3/trade/queryPhysicalDetail/'+id,{},'get')

/**
 * 世界杯活动
 */

/**
 * 查询用户点赞信息
 */
export const queryUserLikeInFo = () => fetch('/v3/like/queryUserLikeInFo/',{},'get')

/**
 * 查询总点赞数量
 */
export const queryTotalLikeCount = () => fetch('/v3/like/queryTotalLikeCount/',{},'get')

/**
 * 查询滚动信息
 */
export const queryRollInfo = () => fetch('/v3/like/queryRollInfo/',{},'get')

/**
 * 好友点赞
 */
export const friendsInLike = () => fetch('/v3/like/friendsInLike/',{},'post')

/**
 * 签到点赞
 */
export const signInLike = () => fetch('/v3/like/signInLike/',{},'post')

/**
 * 查询是否有上周点赞榜
 */
export const queryIsHaveLastWeek = () => fetch('/v3/like/queryIsHaveLastWeek/',{},'get')

/**
 * 查询周点赞榜 queryType 0为本周 1为上周
 */
export const queryWeekLikeList = (queryType) => fetch('/v3/like/queryWeekLikeList?queryType='+queryType,{},'get')

/**
 * 查询用户排行
 */
export const queryUserRank = () => fetch('/v3/like/queryUserRank/',{},'get')