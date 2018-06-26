<template>
	<div class="my-extractGold-detail">
		<head-top headTitle='提金详情' class="head-top" id="head_top" ref="topHead">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
        <p class="sign_tip" v-show="orderDetail.status==3">* 温馨提示：请您在签收时出示本人身份证</p>
		<!--主要内容区域-->
		<section class="extractGold-detail-area" ref="detailArea">
			<!--收货地址-->
                <div class="delivery-address">
                    <p class="delivery-address-p1"><span style="margin-right:.4rem;">{{orderDetail.contact}}</span><span style="font-size:0.24rem;">{{orderDetail.telephone | formatTel}}</span></p>
                    <p class="delivery-address-p2">{{orderDetail.address}}</p>
                    <img src="../../images/address.png">
                </div>
            <!--订单详情-->
                <div class="order-brief">
                    <!--订单状态-->
                    <!--点击跳转商品详情-->
                    <div class="delivery-state" @click="JumpProduct">
                        <img :src="orderDetail.imageUrl || default1">
                        <div class="delivery-state-right">
                            <p class="delivery-state-right-p1">
                              <span class="right-p1-sp1">{{orderDetail.productName}}</span>
                              <span class="right-p1-sp2">{{orderDetail.status==1 ? '待发货' : (orderDetail.status==2 ? '付款失败' : (orderDetail.status==3 ? '已发货' :(orderDetail.status==4 ? '已签收' :(orderDetail.status==5 ? '已取消' : '待支付'))))}}</span>
                            </p>
                            <p class="delivery-state-right-p2">
                              <span class="right-p2-sp1">规格:</span>
                              <span class="right-p2-sp2">{{orderDetail.productWeight}}g</span>
                            </p>
                            <p class="delivery-state-right-p2">
                                <span class="right-p2-sp1" v-if="orderDetail.kind">¥ {{orderDetail.productPrice | formatPrice}}</span>
                                <span class="right-p2-sp1" v-if="!orderDetail.kind">¥ {{(orderDetail.currentPrice*orderDetail.productWeight) | formatPrice}}</span>
                                <span class="right-p2-sp2" style="float:right;font-size:0.24rem;color:#666666;">X {{orderDetail.quantity}}</span>
                            </p>
                        </div>
                    </div>
                    <!--订单详情-->
                    <div class="order-message">
                        <p><span>订单编号</span><span class="No">{{orderDetail.orderNo}}</span></p>
                        <p><span>总克数</span><span class="No">{{orderDetail.weight | formatWeight}}克</span></p>
                        <p><span>件数</span><span class="No">{{orderDetail.quantity}}件</span></p>
                        <p><span>提金金价</span><span class="No">{{orderDetail.currentPrice | formatPrice}}元/克</span></p>
                        <p><span>总金额</span><span class="No">{{orderDetail.totalAmount | formatPrice}}元</span></p>
                        <p v-show="orderDetail.demandPayAmount"><span>扣除克重</span><span class="No">{{orderDetail.demandPayAmount | formatWeight}}克</span></p>
                        <p v-show="orderDetail.additionalMoney"><span>差价金额</span><span class="No">{{orderDetail.additionalMoney | formatPrice}}元</span></p>
                        <p><span>下单时间</span><span class="No">{{orderDetail.createTime}}</span></p>
                    </div>
                </div>
                <!--操作按钮按钮-->
                <section class="operate_btn" v-show="orderDetail.status!=1">
                    <!--物流中-->
                    <div class="take_delivery" v-show="orderDetail.status==3" @click="goToDelivery">查看物流</div>
                    <div class="view_delivery" v-show="orderDetail.status==3" @click="confirmTakeDelivery">确认收货</div>
                    <!--待支付-->
                    <div class="wait_recharge" v-show="orderDetail.status==7 || orderDetail.status==8">
                        <div class="wait_recharge_text">
                            <p class="wait_recharge_text_p1">需支付金额</p>
                            <p class="wait_recharge_text_p2">{{orderDetail.additionalMoney | formatPrice}}元</p>
                        </div>
                        <div class="wait_recharge_btn">
                            <span class="wait_recharge_btn_text" @click="toRecharge">立即支付</span>
                        </div>
                    </div>
                    <!--已完成-->
                    <div class="has_finish" v-show="orderDetail.status==4" @click="$router.push('/extractGoldList')">再买一个</div>
                </section>

                <!--确认收货-->
                <mt-popup
                v-model="popupTakeDelivery"
                position="middle" id="popupTakeDelivery" style="border-radius:10px;width:4.9rem;">
                <div class="takeDelivery">
                   <h4>提示</h4>
                   <p class="warm_tip">主人，确定收到宝贝了吗？</p>
                   <div class="tip_btns">
                       <p @click="cancelTake" style="border-right:1px solid #eeeeee;">取消</p>
                       <p @click="confirmTake">确定</p>
                   </div>
                </div>
                </mt-popup>

                <!--收货成功-->
                <mt-popup
                v-model="popupTakeSuccess"
                position="middle" id="popupTakeSuccess" style="border-radius:10px;" :modal="popupVisible">
                   <h4>收货成功</h4>
                </mt-popup>

                <!--获取京东验证码-->
                <mt-popup
                v-model="popupVisibleCode"
                position="bottom" id="popupVisibleCode">
                <!--发送验证码-->
                <section class="in_code_box" v-show="sendCode">
        	        <h4 class="send_code_warmTip">
                    <img src="../../images/blackClose.png" class="closeCodeBox" @click="popupVisibleCode=false;cangetCode=false;sendCode=false;">
                        为了您的账户安全，请输入短信验证码</h4>
                    <p class="codeToTel">已发送至手机号{{userName}}，<span class="reCode" @click="cangetCode=true;sendCode=false;">收不到验证码？</span></p>
                    <div class="toCodeBox">
                        <input type="number" placeholder="请输入短信验证码" pattern="[0-9]*" maxlength="6" class="toNumber" v-model="smsCode" ref="codeSms">
                        <p class="getCode" ref="send_smscode" @click="againCode">获取验证码</p>
                    </div>
                    <p class="codeConfirm" @click="confirmRechargeOrder">确定</p>
                </section>
                <!--收不到验证码-->
                <section v-show="cangetCode" class="cannotGet">
                    <img src="../../images/blackClose.png" class="closeImg" @click="cangetCode=false;sendCode=true;">
                    <h4>收不到验证码</h4>
                    <p>1.请检查短信是否被手机安全中心拦截；</p>
			        <p>2.如银行预留手机号已变更，请重新绑定；</p>
			        <p>3.获取更多帮助，请拨打客服电话</p>
			        <p class="service_tele">400-819-6199</p>
                    <div class="closeCannotGet" @click="cangetCode=false;sendCode=true;">我知道了</div>
                </section>
                </mt-popup>
		</section>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
    import {queryPhysicalDetailById,takeDeliveryOrder,queryBankCard,goingPayPhysicalOrder,rechargeApplyRetry,confirmPhyOrder} from '@/service/getData'
    import default1 from '@/images/defaltExtract.png'
    import { Toast,Popup,Indicator } from 'mint-ui'
	export default {
		data(){
			return {
                orderNo:null, //所查订单的订单号
                orderDetail:{}, //存储订单信息
                default1:default1,
                canJump:false, //是否可点击图片跳转提金产品
                popupTakeDelivery:false,//去收货弹窗
                popupTakeSuccess:false,//收货成功弹窗
                popupVisible:false,//收货成功弹窗不显示model层
                popupVisibleCode:false,//发送支付验证码弹窗
                sendCode:false, //输入验证码部分
                cangetCode:false,//找不到验证码部分
                smsCode:null,//验证码
                bandCardId:null,//银行卡id
                second:60,
                iNow:true,
                rechargeOrderId:null, //充值订单id
                userName:null //发送验证码至手机号
			}
		},
		created(){
			var orderNo=this.$route.query.id;  //获得进入该页所带的订单号参数
            this.orderNo=orderNo;
		},
		mounted() {
            this.queryPhysicalDetail();
		},
		computed:{
			
		},
        filters:{
            formatTel : function(value){ //过滤电话
                if(!value) return;
                return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            },
            formatWeight(val){
                if(!val) return '';
                return (val*1).toFixed(3)
              },
            formatPrice(val){
                if(!val) return;
                return (val*1).toFixed(2)
            },
        },
		methods:{
			goToDelivery(){ //查看物流信息
                this.$router.push({
                    path:'/findDelivery',
                    query:{
                        expressNo:this.orderDetail.expressNo,
                        imageUrl:this.orderDetail.imageUrl
                    }
                })
            },
            //去支付
            toRecharge(){
                this.popupVisibleCode=true
                this.sendCode=true
                var send_smscode = this.$refs.send_smscode;
                var that=this;
                this.second=60
                this.queryBankCard()
                this.iNow = false;
                let timer = setInterval(function(){
                    send_smscode.style.color="#666";
                    that.second--;
                    send_smscode.innerHTML = that.second+'s';
                    if(that.second==-1){
                        clearInterval(timer);
                        that.iNow=true;
                        send_smscode.style.color="#eda835";
                        send_smscode.innerHTML = '获取验证码';
                        that.second = 60;
                    }
                },1000)
            },
            //请求银行卡信息
            async queryBankCard(){
                const res = await queryBankCard()
                if(res.code==100){
                      this.bandCardId=res.content[0].id
                      if(this.rechargeOrderId){
                          this.rechargeApplyRetry()
                      }else{
                          this.goingPayPhysicalOrder()
                      }
                }
            },
            //调用发送短信接口
            async goingPayPhysicalOrder(){
                var res=await goingPayPhysicalOrder(this.bandCardId,'jingdong',this.orderDetail.instancePayAmount,this.orderDetail.orderId)
                if(res.code==100){
                    this.rechargeOrderId=res.content.id
                }else{
                    this.popupVisibleCode=false
                    this.sendCode=false
                    this.cangetCode=false
                    Toast({
                            message: res.message, 
                            position: 'bottom',
                            duration: 1500
                    });
                }
            },
            //第二次获取支付验证码
            async rechargeApplyRetry(){
                var res=await rechargeApplyRetry(this.rechargeOrderId,this.bandCardId,'jingdong',this.orderDetail.instancePayAmount)
            },
            //重新获取验证码
            async againCode(){
                if(!this.iNow) return;
                this.iNow = false;
                var that=this;
                that.second=60;
                var send_smscode = this.$refs.send_smscode;
                var timer = setInterval(function(){
                    send_smscode.style.color="#666";
                    that.second--;
                    send_smscode.innerHTML = that.second+'s';
                    if(that.second==-1){
                        clearInterval(timer);
                        that.iNow=true;
                        send_smscode.style.color="#eda835";
                        send_smscode.innerHTML = '获取验证码';
                        that.second = 60;
                    }
                },1000)
                var res=await rechargeApplyRetry(this.rechargeOrderId,this.bandCardId,'jingdong',this.orderDetail.instancePayAmount)
            },
            //确认补差价充值
            async confirmRechargeOrder(){
                Indicator.open();
                this.popupVisibleCode=false
                this.sendCode=false
                this.cangetCode=false
                var res=await confirmPhyOrder(this.orderDetail.orderId,this.smsCode)
                if(res.code==100){
                    Indicator.close();
                    if(res.content.status==0){
                        var message=res.content.remark.split(':')[1];
                        Toast({
                            message: message, 
                            position: 'bottom',
                            duration: 1500
                        });
                        return;
                    }
                    if(this.orderDetail.demandPayAmount!=undefined){
                        var buy_way='weight'
                    }else{
                        var buy_way='cash'
                    }
                    this.$router.push({
                            path:'/extractGoldResult',
                            query:{
                              orderNo:this.orderDetail.orderNo,
                              way:buy_way
                            }
                    })
                }else{
                    Indicator.close();
                    Toast({
                            message: res.message, 
                            position: 'bottom',
                            duration: 1500
                    });
                }
            },
            //确认收货
            confirmTakeDelivery(){
                this.popupTakeDelivery=true
            },
            //取消收货
            cancelTake(){
                this.popupTakeDelivery=false
            },
            //确认收货
            async confirmTake(){
                this.popupTakeDelivery=false
                //调用接口 收取成功
                var res=await takeDeliveryOrder(this.orderDetail.orderId)
                if(res.code==100){
                    if(res.content.code==1){
                        this.popupTakeSuccess=true
                        var t=this;
                        setTimeout(function(){
                            t.popupTakeSuccess=false
                            t.queryPhysicalDetail()
                        },1500)
                    }else{
                        Toast({
                            message: res.content.msg, 
                            position: 'bottom',
                            duration: 1500
                        });
                    }
                }
            },
            //点击详情跳转产品详情
            JumpProduct(){
                if(this.canJump){
                    this.$router.push({path:'/productDetail',query:{id:this.orderDetail.productId}})
                }else{
                    Toast({
                        message: '该商品目前不在售',
                        position: 'bottom',
                        duration: 1500
                    });
                }
            },
            async queryPhysicalDetail(){
                var res=await queryPhysicalDetailById(this.orderNo);
                if(res.code==100) {
                    this.orderDetail=res.content;
                    if(res.content.rechargeOrderId){
                        this.rechargeOrderId=res.content.rechargeOrderId
                    }
                    if(res.content.realTelephone){
                        this.userName=res.content.realTelephone;
                    }
                    if(res.content.prodState==2){ //该商品没有售罄或下架，还可交易
                        this.canJump=true;
                    }
                }
            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped lang="less">
@import '../../style/common.less';
    .my-extractGold-detail{
   	    width:100%;
   	    background-color:#fff ;
        height:100vh;
        padding-top:.88rem;
    }
    .my-extractGold-detail .sign_tip{
        height:.5rem;
        line-height:.5rem;
        color:#EDA835;
        text-align:center;
        font-size:.24rem;
        background-color:rgba(242,182,67,.2);
    }
    .my-extractGold-detail .extractGold-detail-area .delivery-address{
        padding-left:1.02rem;
        padding-top:.3rem;
        padding-bottom:.3rem;
        position: relative;
        border-bottom:1px solid #EEEEEE;
    }
    .extractGold-detail-area .delivery-address img{
        width:.44rem;
        height:.44rem;
        position: absolute;
        top:0.54rem;
        left:.3rem;
    }
    .extractGold-detail-area .delivery-address .delivery-address-p1{
        font-size:.3rem;
        height:.5rem;
        color:#333333;
    }
    .extractGold-detail-area .delivery-address .delivery-address-p2{
        font-size:.24rem;
        color:#333333;
        height:.36rem;
        width:6.48rem;
        line-height:.36rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .my-extractGold-detail .extractGold-detail-area .order-brief{
        padding-left:.3rem;
        padding-right:.3rem;
    }
    .extractGold-detail-area .order-brief .delivery-state{
        height:2.1rem;
        border-bottom:1px solid #F1F1F1;
        padding-top:.4rem;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .delivery-state .delivery-state-right{
        flex:4;
        -webkit-flex:4;
        -moz-flex:4;
        -o-flex:4;
        margin-left:.32rem;
    }
    .order-brief .delivery-state img{
        width:1.3rem;
        height:1.3rem;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -o-border-radius: 50%;
        flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
    }
    .delivery-state-right-p1 .right-p1-sp1{
        font-size:.3rem;
        color:#000000;
        display: inline-block;
        width:80%;
        height:.32rem;
        line-height:.34rem;
        overflow: hidden;
    }
    .delivery-state-right-p1 .right-p1-sp2{
        font-size:.28rem;
        float:right;
        color:#EDA835;
        height:.32rem;
        line-height:.34rem;
    }
    .delivery-state .delivery-state-right-p2{
        padding-top:.08rem;
        padding-bottom:.04rem;
    }
    .delivery-state .delivery-state-right-p2 .right-p2-sp1{
        font-size:.28rem;
        color:#333333;
    }
    .delivery-state .delivery-state-right-p2 .right-p2-sp2{
        margin-left:.16rem;
        font-size:.24rem;
        color:#666666;
    }
    .extractGold-detail-area .order-brief .order-message{
        padding-top:.36rem;
    }
    .order-brief .order-message p{
        font-size:.28rem;
        color:#666666;
        height:.66rem;
    }
    .order-brief .order-message .No{
        color:#333333;
    }
    .order-brief .order-message p span:nth-child(2){
        float:right;
    }
    .operate_btn{
        width:100%;
        height:.98rem;
        background-color: #F8F8F8;
        position: fixed;
        bottom:0;
    }
    .take_delivery,.view_delivery{
        width:1.6rem;
        height:.7rem;
        text-align: center;
        line-height:.7rem;
        font-size:0.28rem;
        position: absolute;
        top:.14rem;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        -o-border-radius: 2px;
        border-radius:2px;
    }
    .take_delivery{
        color:#EDA835;
        border:1px solid #F2B643;
        left:50%;
    }
    .view_delivery{
        color:#FFFFFF;
        background-color: #F2B643;
        right:4%;
    }
    .wait_recharge{
        .flex-simple;
        .wait_recharge_text{
            width:75%;
            padding-left:0.3rem;
            padding-top:0.1rem;
            .wait_recharge_text_p1{
                .font-style(.22rem,#999999);
            }
            .wait_recharge_text_p2{
                .font-style(.34rem,#EDA835);
                font-weight: 600;
            }
        }
        .wait_recharge_btn{
            width:25%;
        }
    }
    .wait_recharge_btn_text,.has_finish{
        width:1.6rem;
        height:.7rem;
        display: block;
        text-align: center;
        line-height:.7rem;
        font-size:0.28rem;
        background-color: #F2B643;
        color:#fff;
        .radius(2px);
        margin-top:.13rem;
    }
    .has_finish{
        position: absolute;
        right:4%;
    }
    .takeDelivery{
        width:4.9rem;
        background-color: #fff;
        text-align: center;
        padding-top:0.4rem;
        .radius(10px);
        h4{
            .font-style(.32rem,#000000);
        }
        .warm_tip{
            .font-style(.24rem,#333333);
            padding-top:.16rem;
            padding-bottom:.4rem;
            border-bottom:1px solid #EEEEEE;
        }
        .tip_btns{
            .flex-simple;
            height:.88rem;
            p{
                line-height:.88rem;
                width:50%;
                text-align: center;
                .font-style(.32rem,#EDA835);
            }
        }
    }
    #popupTakeSuccess{
        width:3.6rem;
        height:1.44rem;
        text-align: center;
        line-height:1.44rem;
        background-color:rgba(0,0,0,.6);
        color:#fff;
        font-size:0.3rem;
    }
    .mint-popup#popupVisibleCode{
        width:100%;
        background-color: #fff;
        border-radius: 0;
        .in_code_box{
            .send_code_warmTip{
                text-align: center;
                padding-top:.3rem;
                font-size:0.3rem;
                color:#000;
                position: relative;
            }
        }
    }
    .send_code_warmTip .closeCodeBox{
        width:.36rem;
        height:.36rem;
        position: absolute;
        left:0.3rem;
    }
    .in_code_box .codeToTel{
        font-size:0.24rem;
        color:#999999;
        padding-left:0.3rem;
        padding-top:0.2rem;
        .reCode{
            color:#EDA835;
        }
    }
    .in_code_box .toCodeBox{
        margin-left:0.3rem;
        margin-right:0.3rem;
        margin-top:.2rem;
        border-bottom:1px solid #E1E1E1;
        overflow:hidden;
    }
    .in_code_box .toNumber{
        font-size:0.3rem;
        color:#999999;
        width:66%;
        padding-left:.1rem;
        padding-top:.4rem;
        padding-bottom:.4rem;
        float:left;
    }
    .in_code_box .getCode{
        width:34%;
        text-align: right;
        color:#EDA835;
        font-size:0.24rem;
        padding-top:.4rem;
        padding-bottom:.4rem;
        float:left;
    }
    .in_code_box .codeConfirm{
        width:6.9rem;
        height:.88rem;
        background-color: #F2B643;
        font-size:.34rem;
        color:#fff;
        text-align: center;
        line-height:.88rem;
        margin:0 auto;
        .radius(2px);
        margin-top:.4rem;
        margin-bottom:.36rem;
    }
    .cannotGet{
        position: relative;
        padding-top:1.22rem;
    }
    .cannotGet .closeImg{
        width:.36rem;
        height:.36rem;
        position: absolute;
        left:0.3rem;
        top:0.3rem;
    }
    .cannotGet h4{
        margin-left:.9rem;
        margin-right:.9rem;
        border-bottom:1px solid #eeeeee;
        font-size:.3rem;
        color:#000000;
        text-align: center;
        padding-bottom:.5rem;
        margin-bottom:.4rem;
    }
    .cannotGet p{
        padding-left:.56rem;
        font-size:.3rem;
        color:#666666;
        padding-bottom:.2rem;
    }
    .cannotGet .service_tele{
        font-size:.3rem;
        color:#333333;
        font-weight:600;
        padding-left:1.26rem;
    }
    .cannotGet .closeCannotGet{
        font-size:.3rem;
        color:#eda835;
        text-align: center;
        line-height:2.36rem;
    }
</style>
