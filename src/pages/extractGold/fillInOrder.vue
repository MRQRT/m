<template>
	<div class="fillInOrder">
		<head-top headTitle='填写订单' class="head-top">
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goToDetail">
		</head-top>
		<!--订单详情-->
		<section class="orderMessage">
            <!--地址-->
            <div class="address">
            	<div class="address-core">
            		<img class="address-left" src="../../images/extractAddress.png">
                    <!--没有地址-->
            		<div class="address-right" v-if="noAddress" @click="goAddress">
                        <p class="no_address">暂无收货地址，去设置</p>
                        <div class="rightAddress no_arrow">
                            <img src="../../images/right_jian.png" class="rightArrow">
                        </div>
                    </div>
                    <!--有地址-->
                    <div class="address-right" v-if="!noAddress" @click="goAddress">
                        <div class="showAddress">
                            <p style="padding-bottom: .26rem"><span style="font-size: .3rem;padding-right:.4rem;">{{address.contact}}</span><span style="font-size: .3rem">{{address.telephone | formatTelphone}}</span></p>
                            <p style="font-size: .24rem">{{address.address}}</p>
                        </div>
                        <div class="rightAddress">
                            <img src="../../images/right_jian.png" class="rightArrow">
                        </div>
                    </div>
            	</div>
            </div>
		    <!--产品名称-->
            <div class="produce-name">
                <div class="produce_name_box">
                    <img :src="physicalObj.imageUrl">
                    <div class="name-price">
                	    <p class="name-price-p1">{{physicalObj.name}}</p>
                        <p class="name-price-p3">规格：{{physicalObj.weight | formatWeight}}g</p>
                	    <p class="name-price-p2"><span>¥{{(price || physicalObj.price) | formatPrice}}</span><span style="float:right;">X {{count}}</span></p>
                    </div>
                </div>
            </div>
            <!--实时金价-->
            <div class="buy-format-core">
            	<span class="format-left">实时金价</span>
            	<span class="format-right">{{currentPrice}}元/克</span>
            </div>
            <!--预估扣除总克重-->
            <div class="buy-count-core" v-if="exchageBuyWeight">
            	<span class="count-left">预估扣除总克重</span>
            	<span class="count-right">{{spendWeightCash}}克</span>
            </div>
            <!--持有克重-->
            <div class="buy-count-core" v-show="exchageBuyWeight">
            	<span class="count-left">持有克重</span>
            	<span class="count-right">{{keepWeight | formatWeight}}克</span>
            </div>
            <!--补差价金额-->
            <div class="buy-count-core" v-if="exchageBuyWeight">
            	<span class="count-left difference" @click="popupVisibleChaJia=true">补差价金额</span>
            	<span class="count-right">{{additionalPrice}}元</span>
            </div>
            <!--总金额现金支付时需要展示-->
            <div class="buy-count-core" v-if="!exchageBuyWeight">
            	<span class="count-left">总金额</span>
            	<span class="count-right">{{spendWeightCash}}元</span>
            </div>
        </section>

        <!--协议-->
        <section class="argument">
            <input type="checkBox" class="check">
            <strong :class="{'change1':bg,'change2':!bg}" @click="bg=!bg" ref="arg"></strong>
            <div  @click="readArg">
                <span class="txt">已阅读并同意《黄金管家提金服务协议》</span>
            </div>
        </section>

        <!--底部提交-->
        <section class="botton-submit">
        	<div class="botton-submit-left">
                <p class="p1">需支付金额</p>
        	    <p class="p2">{{confirmPrice}}元</p>
        	</div>
        	<div class="botton-submit-right"  :class="{'opacity':noAddress}" @click="extractGold">立即支付</div>
        </section>

        <!--补差价名词解释-->
        <mt-popup
        v-model="popupVisibleChaJia"
        position="middle" id="popupVisibleChaJia">
        <section class="money-no-chajia">
        	<h4>名词解释</h4>
        	<p class="formulae">补差价金额＝总价－持有克重X实时金价</p>
            <p class="understand" @click="popupVisibleChaJia=false">我知道了</p>
        </section>
        </mt-popup>

        <!--现金余额不足弹窗-->
        <mt-popup
        v-model="popupVisibleMoney"
        position="middle" id="popupVisibleMoney">
        <section class="money-no-enough">
        	<h4>提示</h4>
        	<p class="tip-p1">现金余额为{{cashBalance | formatPrice}}元，需额外支付<span style="color:#EDA835;font-weight:600;">{{appendMoney}}</span>元</p>
        	<p class="tip-btns">
        		<span class="tip-btns-cancel" @click="closeMoney">取消</span>
        		<span @click="recharge">确认</span>
        	</p>
        </section>
        </mt-popup>

        <!--获取手机验证码弹窗-->
        <mt-popup
        v-model="popupVisibleCode"
        position="bottom" id="popupVisibleCode">
        <!--发送验证码-->
        <section class="in_code_box" v-show="sendCode">
        	<h4 class="send_code_warmTip">
                <img src="../../images/blackClose.png" class="closeCodeBox" @click="popupVisibleCode=false;cangetCode=false;sendCode=false;">
                为了您的账户安全，请输入短信验证码</h4>
            <p class="codeToTel">已发送至手机号{{userName | formatTelphone}}，<span class="reCode" @click="cangetCode=true;sendCode=false;">收不到验证码？</span></p>
            <div class="toCodeBox">
                <input type="number" placeholder="请输入短信验证码" pattern="[0-9]*" maxlength="6" class="toNumber" v-model="smsCode" ref="codeSms">
                <p class="getCode" @click="getCode" ref="send_smscode">获取验证码</p>
            </div>
            <p class="codeConfirm" @click="checkSms">确定</p>
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

        <!--获取京东支付验证码弹窗-->
        <mt-popup
        v-model="popupVisibleJingCode"
        position="bottom" id="popupVisibleJingCode">
        <!--发送验证码-->
        <section class="in_code_box" v-show="jingCode">
        	<h4 class="send_code_warmTip">
                <img src="../../images/blackClose.png" class="closeCodeBox" @click="popupVisibleJingCode=false;jinggetCode=false;jingCode=false;">
                为了您的账户安全，请输入短信验证码</h4>
            <p class="codeToTel">已发送至手机号{{phone}}，<span class="reCode" @click="jinggetCode=true;jingCode=false;">收不到验证码？</span></p>
            <div class="toCodeBox">
                <input type="number" placeholder="请输入短信验证码" pattern="[0-9]*" maxlength="6" class="toNumber" v-model="smsJingCode" ref="codeJingSms">
                <p class="getCode" @click="getJingCode" ref="send_jing_smscode">获取验证码</p>
            </div>
            <p class="codeConfirm" @click="confirmRechargeOrder">确定</p>
        </section>
        <!--收不到验证码-->
        <section v-show="jinggetCode" class="cannotGet">
            <img src="../../images/blackClose.png" class="closeImg" @click="jinggetCode=false;jingCode=true;">
            <h4>收不到验证码</h4>
            <p>1.请检查短信是否被手机安全中心拦截；</p>
			<p>2.如银行预留手机号已变更，请重新绑定；</p>
			<p>3.获取更多帮助，请拨打客服电话</p>
			<p class="service_tele">400-819-6199</p>
            <div class="closeCannotGet" @click="jinggetCode=false;jingCode=true;">我知道了</div>
        </section>
        </mt-popup>
	</div>
</template>

<script>
import headTop from '../../components/header/head.vue';
import {queryGoodsByPhysicalId,queryAddress,generatePhyOrder,queryMyProfil,sendSms,checkSms,queryBankCard,goingPayPhysicalOrder,confirmPhyOrder,rechargeApplyRetry} from '@/service/getData'
import { getStore } from '@/config/mUtils'
import { Toast,Popup,Indicator } from 'mint-ui'
import { mapState,mapMutations } from 'vuex'
import store from '@/store'
	export default {
		data(){
			return {
                physicalObj:{},//根据克重查询的商品详情
                count:null,
                noAddress:false,  //没有地址的情况
                address:{},//地址
                addressId:"",//存放地址id
                physicalId:"",
                cashBalance:null, //可用的现金余额
                bg:true,  //是否阅读了协议(默认阅读)
                btnCtroller:true, //提金按钮是否可点击
                popupVisibleMoney:false,//现金余额不足弹窗
                popupVisibleChaJia:false,//补差价名词解释
                exchageBuyWeight:false,//克重兑换（假时 现金支付）
                popupVisibleCode:false, //获取手机验证码弹窗
                sendCode:false,//发送验证码是否显示
                cangetCode:false,//找不到验证码
                userName:null, //发送验证码时的手机号
                smsCode:null,//验证码
                keepWeight:null,//持有活期克重
                second: 60,//获取验证码的倒计时
                iNow:true,//避免获取验证码重复点击
                popupVisibleJingCode:false,//获取京东支付验证码弹窗
                jingCode:false,//京东支付短信验证码输入
                jinggetCode:false,//京东支付短信验证码收不到
                smsJingCode:null,//支付验证码
                bandCardId:null, //银行id
                orderId:null, //生成的订单id
                rechargeAppendMoney:null,//充值订单时需支付的金额
                rechargeOrderId:null,//充值订单id
                orderNo:null, //订单编号
                phone:null, //支付时发送验证码手机号
                price:null,//跳转页面时带回来的单价
                spendWeightCash:null, //预估扣除克重或支付总金额
                currentprice:null //从上一页带过来的实时金价
				}
		},
        created(){
            //跳转我的地址或添加地址，往vuex里存填写订单所需数据，页面渲染先判断有没有这些数据。有的话就是从地址跳转回来的
            if(this.$route.query.path=='productDetail'){ //需要把缓存的参数置空
                this.RECORD_FILLEXTRACTINFO(null)
                this.RECORD_ADDRESS(null);
            }
            if(this.fillExtractInfo){
                this.count=this.fillExtractInfo.count;
                this.physicalId=this.fillExtractInfo.physicalId;
                var method=this.fillExtractInfo.buyMethod;
                this.price=this.fillExtractInfo.price;
                this.spendWeightCash=this.fillExtractInfo.spendWeightCash;
                this.currentprice=this.fillExtractInfo.currentPrice;
                method ? this.exchageBuyWeight=true : this.exchageBuyWeight=false
            }else{
                this.count=this.$route.query.count; //提金数量
                this.physicalId=this.$route.query.physicalId;
                this.price=this.$route.query.price;
                this.spendWeightCash=this.$route.query.spendWeightCash;
                this.currentprice=this.$route.query.currentPrice;
                var method=this.$route.query.buyMethod //提金方式
                method ? this.exchageBuyWeight=true : this.exchageBuyWeight=false
            }
        },
		mounted() {
            this.queryMyProfil();
            if(store.state.address){
                this.address=store.state.address;
                this.addressId=this.address.id;
            }else{
                this.queryAddress();//请求地址
            }
            this.queryGoodsByPhysicalId();//进入页面根据所选规格请求数据
		},
        filters: {
              formatWeight(val){
                if(!Number(val)) return '0.0000';
                return (val*1).toFixed(4)
              },
              formatPrice(val){
                if(!Number(val)) return '0.00';
                return (val*1).toFixed(2)
              },
              formatTelphone(val){
                  if(!val) return;
                  return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
              },
        },
		computed:{
            ...mapState([
                 'fillExtractInfo','currentPrice'
            ]),
            //补差价金额
            additionalPrice(){
                if(!this.exchageBuyWeight) return;
                if(!this.physicalObj.priceMode){ //priceMode  0实时金价按克、1一口价按件'
                    if(this.spendWeightCash<=this.keepWeight){
                        return '0.00'
                    }else{
                        return ((this.physicalObj.weight*this.count-this.keepWeight)*this.currentprice+this.physicalObj.labourFee*this.physicalObj.weight*this.count).toFixed(2)
                    }
                }else{
                    if(this.spendWeightCash<=this.keepWeight){
                        return '0.00'
                    }else{
                        return (this.physicalObj.price*this.count-this.keepWeight*this.currentprice).toFixed(2)
                    }
                }
            },
            //最终支付金额
            confirmPrice(){
                if(this.exchageBuyWeight) return this.additionalPrice;
                return this.spendWeightCash
            },
            //扣除现金余额后需支付的金额
            appendMoney(){
                if(this.cashBalance>=this.confirmPrice){
                    return '0.00'
                }else{
                    return (this.confirmPrice-this.cashBalance).toFixed(2)
                }
            }
		},
		methods:{
            ...mapMutations([
                'RECORD_FILLEXTRACTINFO','RECORD_ADDRESS'
            ]),
            goToDetail(){   //点击产品进入产品详情
                this.$router.push({
                    path:'productDetail',
                    query:{
                        id:getStore('goodsId','local')
                    }
                })
            },
            //待支付
            recharge(){
                this.popupVisibleMoney=false
                this.popupVisibleJingCode=true
                this.jingCode=true
                var send_smscode = this.$refs.send_jing_smscode;
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
            //调用发送短信接口
            async goingPayPhysicalOrder(){
                var res=await goingPayPhysicalOrder(this.bandCardId,'jingdong',this.rechargeAppendMoney,this.orderId)
                if(res.code==100){
                    this.rechargeOrderId=res.content.id
                }else{
                    this.popupVisibleJingCode=false
                    this.jingCode=false
                    this.jinggetCode=false
                    Toast({
                            message: res.message, 
                            position: 'bottom',
                            duration: 1500
                    });
                }
            },
            //重新获取验证码
            async getJingCode(){
                if(!this.iNow) return;
                this.iNow = false;
                var that=this;
                that.second=60;
                var send_smscode = this.$refs.send_jing_smscode;
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
                var res=await rechargeApplyRetry(this.rechargeOrderId,this.bandCardId,'jingdong',this.rechargeAppendMoney)
            },
            //确认补差价充值
            async confirmRechargeOrder(){
                Indicator.open();
                this.popupVisibleJingCode=false
                this.jingCode=false
                this.jinggetCode=false
                var res=await confirmPhyOrder(this.orderId,this.smsJingCode)
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
                    var buy_way=this.exchageBuyWeight ? 'weight' : 'cash'
                    this.$router.push({
                            path:'/extractGoldResult',
                            query:{
                              orderNo:this.orderNo,
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
            //请求银行卡信息
            async queryBankCard(){
                const res = await queryBankCard()
                if(res.code==100){
                      this.bandCardId=res.content[0].id
                      this.phone=res.content[0].phone
                      this.goingPayPhysicalOrder()  //调用京东发短信创建充值订单
                }
            },
            //跳转协议阅读
            readArg(){
                var fillExtractInfo={ //对象保存页面渲染需要的数据
                        physicalId:this.physicalId,
                        count:this.count,
                        buyMethod:this.exchageBuyWeight,
                        price:this.price,
                        spendWeightCash:this.spendWeightCash,
                        currentPrice:this.currentprice
                }
                this.RECORD_FILLEXTRACTINFO(fillExtractInfo)
                this.$router.push({
                    path:'/physicalArg'
                })
            },
            extractGold(){ //先判断现金余额是否充足，再判断有么有收货地址
                if(!this.bg){
                    Toast({
                        message: '请阅读相关协议', 
                        position: 'bottom',
                        duration: 1500
                   });
                    return;
                }

               //判断有么有收货地址
                if(this.noAddress){  
                    Toast({
                        message: '未设置收货地址', 
                        position: 'bottom',
                        duration: 1500
                    });
                    return;
                }
                //验证手机号
                this.popupVisibleCode=true
                this.sendCode=true
                this.getCode()
            },
            async sendSms(){
                var send_smscode = this.$refs.send_smscode;
                if(send_smscode.innerHTML != '获取验证码') return;
                var that=this;
                if(this.iNow){
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
                    
                    var res=await sendSms(this.userName)
                }
            },
            getCode(){
                this.sendSms()
            },
            async checkSms(){
                this.popupVisibleCode=false
                this.sendCode=false
                this.cangetCode=false
                var res=await checkSms(this.userName,this.smsCode)
                if(res.content=='SUCCESS'){
                    this.addGoodsOrder()
                }else{
                    Toast({
                        message: res.message, 
                        position: 'middle',
                        duration: 1500
                    });
                }
            },
            async queryMyProfil(){  //查看现金余额
                var res=await queryMyProfil();
                if(res.code==100) {
                    this.cashBalance=res.content.cashNoBalance;
                    this.keepWeight=res.content.demandGoldBalance;
                    this.userName=res.content.telephone;
                }
            },
            closeMoney(){  //关闭现金不足弹窗
                this.popupVisibleMoney=false
                this.$router.push('/myExtractOrder')
            },
            goAddress(){  //点击地址部分进行跳转
                var fillExtractInfo={ //对象保存页面渲染需要的数据
                        physicalId:this.physicalId,
                        count:this.count,
                        buyMethod:this.exchageBuyWeight,
                        price:this.price,
                        spendWeightCash:this.spendWeightCash,
                        currentPrice:this.currentprice
                }
                this.RECORD_FILLEXTRACTINFO(fillExtractInfo)
                if(this.noAddress){  //没有地址时跳转添加地址
                    
                    this.$router.push({
                        path:'/personHomepage/addAddress',
                        query:{
                            from:'1', //表示从提金跳到我的地址
                        }
                    })
                }else{ //有地址时跳转我的地址
                    
                    this.$router.push({
                        path:'/personHomepage/address',
                        query:{
                            from:'1', //表示从提金跳到我的地址
                        }
                    })
                }
            },
            async queryGoodsByPhysicalId(){  //根据所选规格查看商品详情
                var res=await queryGoodsByPhysicalId(this.physicalId);
                if(res.code==100){
                   this.physicalObj=res.content;
                }
            },
            async queryAddress(){  //请求地址
                var res=await queryAddress();
                if(res.code==100){
                    var addressArray=res.content;
                    if(addressArray.length==0){
                        this.noAddress=true;
                        return;
                    }
                    var t=this;
                    addressArray.forEach(function(v,i){
                        if(v.isDefault==1){
                            t.address=v;
                            t.addressId=v.id;
                        }
                    })
                }
            },
            async addGoodsOrder(){ //创建提金订单 
                if(!this.btnCtroller) {
                    Toast({
                        message: '操作频繁', 
                        position: 'bottom',
                        duration: 1500
                    });
                    return;
                }
                Indicator.open();
                this.btnCtroller=false;
                var genType=this.exchageBuyWeight ? 1 : 2
                this.rechargeAppendMoney=this.appendMoney
                var res=await generatePhyOrder(this.physicalId,genType,this.addressId,this.count,'jingdong',this.appendMoney);
                if(res.code==100){
                    Indicator.close();
                    this.RECORD_FILLEXTRACTINFO(null)
                    this.btnCtroller=true;
                    if(res.content.state==1){
                        var result=res.content.data;
                        if(result.orderNo){
                        //提金成功后拿到订单号跳转提金成功页
                           this.orderNo=result.orderNo
                           this.orderId=result.orderId
                        }
                        if(result.orderStatus==7 || result.orderStatus==8){//现金余额不足errMsg
                            this.popupVisibleMoney=true
                            return;
                        }
                        var buy_way=this.exchageBuyWeight ? 'weight' : 'cash'
                        this.$router.push({
                            path:'/extractGoldResult',
                            query:{
                              orderNo:this.orderNo,
                              way:buy_way
                            }
                        })
                    }else{ 
                        Toast({
                               message: res.content.errMsg, 
                               position: 'bottom',
                               duration: 1500
                        });
                    }
                }else{
                    Indicator.close();
                    this.RECORD_FILLEXTRACTINFO(null)
                    this.btnCtroller=true;
                    Toast({
                            message: res.message, 
                            position: 'bottom',
                            duration: 1500
                    });
                }
            }
        },
        watch:{
            popupVisibleCode(val){
                if(!val){
                    this.sendCode=false;
                    this.cangetCode=false;
                }
            },
            popupVisibleJingCode(val){
                if(!val){
                    this.jingCode=false;
                    this.jinggetCode=false;
                }
            }
        },
		components:{
			headTop,
		}
	}
</script>

<style scoped lang="less">
@import '../../style/common.less';
    .fillInOrder{
        background-color: #fff;
        padding-top:.88rem;
        height:100vh;
    }
    .produce-name{
       height:2.22rem;
       padding-left:.34rem;
       padding-right:.26rem;
    }
    .produce_name_box{
        border-bottom:1px solid #EEEEEE;
        padding-left:.1rem;
        padding-right:.1rem;
        padding-bottom:.3rem;
        .flex-simple;
    }
    .produce-name img{
        width:1.4rem;
        height:1.4rem;
        margin-top:.4rem;
        margin-right:.2rem;
        border: 1px solid #eee;
    }
    .name-price{
        margin-top:.38rem;
        width:100%;
    }
    .name-price .name-price-p1{
    	font-size:.32rem;
        color:#333333;
        line-height:.36rem;
        height:.34rem;
        overflow:hidden;
    }
    .name-price .name-price-p3{
        padding-top:.1rem;
        font-size: .24rem;
    	color:#999999;
    }
    .name-price .name-price-p2{
        padding-top:.3rem;
        font-size: .28rem;
    	color:#333333;
    }
    .name-price .name-price-sp4{
        .font-style(0.28rem,#333333);
    }
    .address{
    	padding-left:.3rem;
        padding-right:.3rem;
        border-bottom:1px solid #EEEEEE;
    }
    .buy-format-core{
        padding-top:.6rem;
    }
    .buy-format-core,.buy-count-core{
    	font-size: .28rem;
    	color:#666666;
        overflow: hidden;
        padding-left:.5rem;
        padding-right:.5rem;
        padding-bottom:.66rem;
    }
    .address .address-core{
        height:1.4rem;
        .flex-simple;
    }
    .address .address-core .showAddress{
        width:94%;
        padding-top:.28rem;
        padding-left:.36rem;
        color:#333333;
    }
    .address .address-core .rightAddress{
        width:6%;
        line-height: 1.4rem;
        text-align: right;
    }
    .address .address-core .rightArrow{
        width:.13rem;
        height:.24rem;
    }
    .address-core .address-left{
        width:.36rem;
        height:.36rem;
        margin-top:.52rem;
    }
    .address-core .address-right{
        .flex_num(3.5);
        .flex-simple;
    }
    .buy-format-core .format-left,.buy-count-core .count-left{
    	float: left;
    }
    .buy-format-core .format-right,.buy-count-core .count-right{
    	float: right;
    }
    .count-left.difference{
        position: relative;
    }
    .count-left.difference:after{
        position: absolute;
        content:'';
        width:.26rem;
        height:.26rem;
        background-image: url(../../images/definitions.png);
        background-size: .24rem .24rem;
        background-repeat: no-repeat;
        top:.06rem;
        right:-.4rem;
    }
    .address-core .address-right strong{
    	margin-left:.22rem;
    }
    .botton-submit{
        width:100%;
    	height:1rem;
        position: fixed;
        bottom:0;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .botton-submit .botton-submit-left{
    	width:66.67%;
        background-color: #F8F8F8;
        padding-top:.18rem;
    	padding-left:.3rem;
    }
    .botton-submit .botton-submit-left .p1{
        .font-style(0.22rem,#999999);
    }
    .botton-submit .botton-submit-left .p2{
        .font-style(0.34rem,#EDA835);
        font-weight:600;
        height:.36rem;
        line-height:.36rem;
    }
    .botton-submit .botton-submit-right{
    	width:33.33%;
    	line-height: .98rem;
    	color:#fff;
    	text-align: center;
        font-size:.34rem;
        background-color:#F2B643;
    }
    .botton-submit .botton-submit-right.opacity{
        opacity: 0.5;
    }
    .mint-popup#popupVisibleMoney{
        width:4.9rem;
    }
    .money-no-enough{
    	width:4.9rem;
    	background-color: #fff;
        padding-top:.36rem;
        .radius(10px);
    }
    .money-no-enough h4{
    	font-size:.32rem;
    	text-align: center;
        font-weight: bold;
    }
    .money-no-enough .tip-p1{
   	    font-size:.24rem;
   	    color:#333333;
        padding-left:.3rem;
        padding-right:.7rem;
        padding-top:.1rem;
   }
    .money-no-enough .tip-btns{
    	margin-top:.24rem;
        border-top:1px solid #EEEEEE;
        height:.9rem;
        .flex-simple;
    }
    .money-no-enough .tip-btns span{
    	flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
    	text-align: center;
    	line-height: .9rem;
    	font-size:.32rem;
    	color:#EDA835;
    }
    .tip-btns .tip-btns-cancel{
    	border-right:1px solid #F0F0F0;
    }
    .argument{
        font-size:.22rem;
        color:#999999;
        padding-left:.3rem;
        position: fixed;
        bottom:1.8rem;
    }
    .argument .check{
        display:none;
    }
    .argument strong{
        width:.24rem;
        height:.24rem;
        position:absolute;
        left:0.3rem;
        top:.03rem;
    }
    .change1{
        background: url('../../images/readed.png') no-repeat;
        background-size: 100% 100%;
    }
    .change2{
        background: url('../../images/reading.png') no-repeat;
        background-size: 100% 100%;
    }
    .fillInOrder .argument .txt{
        margin-left:.38rem;
    }
    .no_address{
        .flex_num(12);
        text-align:right;
        line-height:1.4rem;
        .font-style(0.28rem,#999999);
    }
    .no_arrow{
        .flex_num(0.8);
    }
    .mint-popup#popupVisibleChaJia{
        width:4.9rem;
        text-align:center;
        padding-top:0.3rem;
    }
    .mint-popup#popupVisibleChaJia h4{
        .font-style(0.32rem,#000000);
        font-weight:600;
    }
    .mint-popup#popupVisibleChaJia .formulae{
        .font-style(0.24rem,#333333);
        padding-top:.15rem;
        padding-bottom:.36rem;
        border-bottom:1px solid #EEEEEE;
    }
    .mint-popup#popupVisibleChaJia .understand{
        .font-style(0.32rem,#EDA835);
        padding-top:.28rem;
        padding-bottom:.28rem;
    }
    .mint-popup{
        .radius(10px) ;
    }
    .mint-popup#popupVisibleCode,.mint-popup#popupVisibleJingCode{
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
