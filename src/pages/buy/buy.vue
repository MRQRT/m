<template>
	<div class="buy">
		<div class="buy-message" v-show="hasShow">
			<head-top headTitle='黄金买入'>
				<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push({'path':'/buyProductDetail'})">
				<span slot="custom" class="custom myGold" @click="goToGold">我的挂单</span>
			</head-top>
			<!--非交易时间内提示-->
			<p class="no_trade_tip" v-if="noTradeCheck">非交易时段可挂单委托</p>
			<!--买金输入的相关信息-->
			<section class="buy_incontent_box" :class="{'no_trade_time':noTradeCheck}">
				<p class="current_price">
					<span class="current_price_title">实时金价:</span>
					<span class="current_price_info">{{currentPrice}}</span>
					<span class="current_price_unit" style="margin-left:-3px;">元/克</span>
				</p>
				<div class="max_price_setup">
					<h4>最高买入价</h4>
					<div class="makePriceContainer" :class="{'redTip_guadan':guaDan}">
						<span class="decrease" @touchstart="decrease"></span>
						<input type="number" class="price" v-model="setup_price" @keyup="fixedNum" @blur="checkPrice">
						<span class="increase" @touchstart="increase"></span>
					</div>
					<div class="about_price_warm_tip">
						<p v-show="guaDan" class="gua_dan" style="color:#FF6D39;">挂单价格不能太低</p>
						<p>当最高买入价≥实时金价，以实时金价成交</p>
						<p>当最高买入价&lt;实时金价，以最高买入价进行挂单</p>
					</div>
				</div>
				<div class="input_buy">
					<input type="text" :placeholder="placeholder" id="inputField" v-model="number" @keyup="checkInput(number+'')" @blur="checkNum">
					<p class="buy_method" @click="toggle">切换成{{dependOn}}</p>
					<!--购买量的单位-->
					<span style="position: absolute;top:0.02rem;font-size:0.32rem;line-height:.88rem;" id="sp" v-show="number*1">{{myUnit}}</span>
					<p class="notEnough" v-show="limitMore">{{orderCheckMsg}}</p>
					<p class="notEnough" v-show="noEnough">余额不足,请先充值</p>
					<!--预估购买克重和金额-->
					<div class="tipPop" v-show="number*1"><span>预估{{ hasSymbol ?'克重' : '金额'}}：{{calAmount}}{{ hasSymbol ?'克' : '元'}}</span></div>
				</div>
			</section>
			<!--有限期限-->
			<section class="limit_times">
				<div class="period_time">
					<p>有效期限</p>
					<p class="buy_limit_time">
						<span class="buy_limit_day" :class="{'select':theDaySelect}" @click="selectMethod(0)">当天有效</span>
						<span class="buy_limit_forever" :class="{'select':theForeverSelect}" @click="selectMethod(1)">永久有效</span>
					</p>
				</div>
			</section>
			<!--现金余额-->
			<section class="balance">
				<div class="sli"  @click="goToBalanceRecharge">
					<div class="left1">
						<p class='dec'>现金余额</p>
						<p class="yue">可用余额{{availableMoney | formatPrice}}元</p>
					</div>
					<div class="right">
						<span class="rechargePart" v-show="noEnough">去充值</span>
						<img src="../../images/right_jian.png">
					</div>
				</div>
			</section>
			<!--优惠券-->
			<!--判断有没有可用的优惠券-->
			<div class="coupon_box">
				<section class="coupon"  @click="goCoupon">
					<!--这里的'无可用'是输入的金额过小，没有符合条件的优惠券可用,不是没有优惠券-->
					<div class="coup">优惠券 <span class="noAvailable" v-show="!hasUsedCoupon">无可用</span></div>
					<div class="coupEnter">
						<span v-show="hasUsedCoupon">-{{(defaultCoupon.id?defaultCoupon.faceAmount:0) | formatPrice}}元</span>
						<img src="../../images/right_jian.png" class="rightArr">
					</div>
				</section>
			</div>
			<!--协议-->
			<section class="argument">
				<input type="checkBox" class="check">
				<strong :class="{'change1':bg,'change2':!bg}" @click="changeBg" ref="arg"></strong>
				<router-link to="/arguments" tag="div">
					<span class="txt">已阅读并同意《黄金消费综合服务协议》</span>
				</router-link>
			</section>
			<a class="buyBtn"  :class="(this.number*1 && !this.noEnough && !this.limitMore && this.bg)?'buyBtnYes':'buyBtnNo'" @click="payment">{{noTradeCheck?'挂单买入':'立即买入'}}</a>
			<!--最终支付-->
			<mt-popup
			v-model="popupVisibleBuy"
			position="bottom" id="popupVisibleBuy">
			<section class="payment">
				<div class="payTitle">
					<img src="../../images/blackClose.png" class='close' @click="hide">
					<p>支付</p>
				</div>
				<div class="payMessage">
					<p class="payCurrentPrice">
						<span class="currentLeft">实时金价</span>
						<span class="currentRight">{{currentPrice}}元/克</span>
					</p>
					<p class="payCurrentPrice">
						<span class="currentLeft">最高买入价</span>
						<span class="currentRight">{{setup_price}}元/克</span>
					</p>
					<p class="payKilo">
						<span class="kiloLeft">{{hasSymbol ? '预估克重' : '购买克重'}}</span>
						<!--克重保留4位小数，向下截取-->
						<span class="kiloRight">{{lastGram}}克</span>
					</p>

					<!--判断有没有使用优惠券,有则显示这一条，没有不显示-->
					<!--由于金价实时变动，克重&总金额随之变化
					1、按金额：总金额不变，克重随金价的变化而变化
                    2、按克重：克重不变，总金额随金价的变化而变化-->

                    <!--若没使用优惠券,则不显示此条内容-->
					<p class="payCoupon" v-show="defaultCoupon.id">
						<span class="couponLeft">优惠券</span>
						<span class="couponRight">-{{defaultCoupon.faceAmount | formatPrice}}元</span>
					</p>
					<p class="payTotal">
						<span class="totalLeft">需付款</span>
						<!--克重保留2位小数，向上截取-->
						<span class="totalRight">{{lastMoney}}元</span>
					</p>
				</div>
				<a class="payConfirm" @click="confirmPay" id="click_btn">确认支付</a>
			</section>
		   </mt-popup>
		</div>

		<!--实时金价超过最高买入金额或其他原因无法生成订单弹窗-->
		<mt-popup
		v-model="popupVisibleErr"
		position="middle" id="popupVisibleErr">
		<div class="identity">
			<h4 class="tipTitle">提示</h4>
			<h4 class="tipDesc">{{errMsg}}</h4>
			<div class="identifyBtn" @click="okNoBuy">我知道了</div>
		</div>
	    </mt-popup>

		<transition name="router-slid" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
import { clearNoNum,getStore,getStyle,getRem} from '../../config/mUtils.js';
import headTop from '../../components/header/head.vue';
import { queryMyProfil, demandBuyOrder, orderCheck, queryCoupons,bizCloseCheck } from '@/service/getData.js'
import { Toast,Indicator,Popup } from 'mint-ui'

	export default {
		data() {
			return {
				hasSymbol:true,  //如果是按克重,输入金额需要人民币符号
				number:'',  //输入的金额克重
				bg:true,  //是否阅读了协议
				availableMoney:null, //可用余额
				hasShow:true, //一级路由二级路由切换显示
				placeholder:'请输入购买金额',
				hasUsedCoupon:true,// 有没有优惠券可用
				dependOn:'按克重',  //默认是'按金额'
				limitMore:false,  //是否超过当日购买限额
				orderCheckMsg:"",  //订单校验之错误原因
				coupons:[],     //优惠券
				minAmount:[],//满金额
				minWeight:[],//满克重
				defaultCoupon:{},//默认使用的优惠券
				defaultCouponId:"",//要使用的优惠券Id
				canUsedCoupon:[],  //可以使用的优惠券id集合
				errMsg:'', //买金失败错误提示
				btnCtroller:true,//买金按钮是否可点击
				iptEle:null, //输入金额克重的输入框
				myUnit:'元', //默认单位是元
				popupVisibleBuy:false, //最终支付弹窗出现不出现
				popupVisibleErr:false,//支付失败弹窗是否出现
				theDaySelect:true,//当天有效选中
				theForeverSelect:false,//选择永久有效
				noTradeCheck:false,//交易开关
				inputLeft:0.2*getRem(), //计量单位元/克定位需要
				setup_price:null, //设置的最大买入价
				guaDan:false //挂单价格不能太低提示语
			}
		},
		mounted() {
			this.setup_price=(this.currentPrice-0+0.5).toFixed(2)
			this.iptEle=document.querySelector('#sp')
			this.hasUsedCoupon=false;
			this.token ? this.queryMyProfil() : ''; 
			this.token ? this.queryCoupons() : '';
			this.bizCloseCheck()
		},
		filters:{
			formatPrice(val){ //设置金额为两位小数
				return (val*1).toFixed(2);
			}
		},
		methods:{
			...mapMutations([
				'RECORD_COUPONID'
			]),
			//选择有效时间
			selectMethod(val){
				if(!val){
					if(this.theDaySelect) return
					this.theDaySelect=true;this.theForeverSelect=false;
				}else{
					if(this.theForeverSelect) return
					this.theForeverSelect=true;this.theDaySelect=false;
				}
			},
			//点击跳转现金余额或充值
			goToBalanceRecharge(){
				if(this.noEnough){
					this.$router.push('/recharge')
				}else{
					this.$router.push('/balance')
				}
			},
			//查询是否在交易时间内
			async bizCloseCheck(){
				var res=await bizCloseCheck(1)
				if(res.code==100){ //res.content //0没有再交易时间内 1在交易时间内
					if(res.content){
						this.noTradeCheck=false
					}else{
						this.noTradeCheck=true
					}
				}
			},
			//点击减号
			decrease(){
				this.setup_price=(this.setup_price-0.1).toFixed(2)
			},
			//点击加号
			increase(){
				this.setup_price=(this.setup_price-0+0.1).toFixed(2)
			},
            async queryCoupons(){  //请求优惠券信息
            	var result=await queryCoupons(1,600,getStore("token","local").split("_")[0],"1",1)
            	if(result.code==100){
            		this.coupons=result.content.list;
            		for(var i=0;i<this.coupons.length;i++){
            			var obj={};
            			if(this.coupons[i].used !==0) {continue;}
            			obj.id=this.coupons[i].id;
            			obj.faceAmount=this.coupons[i].faceAmount;

            			(this.coupons[i].useableMinAmount) ? obj.useableMinAmount=this.coupons[i].useableMinAmount : obj.useableMinWeight=this.coupons[i].useableMinWeight;
            			if(obj.useableMinAmount){
            				this.minAmount.push(obj);
            			}else{
            				this.minWeight.push(obj);
            			}

            		}
            	}
            },
            async orderCheck(){  //订单校验
            	if(this.hasSymbol){//按金额购买
            		var res=await orderCheck('',this.number*1,1);
            	}else{//按克重购买
            		var res=await orderCheck(this.number*1,'',1);
            	}
            	if(res.code==100){
            			if(res.content.code==1){  //校验失败
                            if(this.noEnough){  //如果已经提示余额不足,则不再显示该错误
								this.limitMore=false;
								return;
							}
							this.limitMore=true;
                            this.orderCheckMsg=res.content.msg;
            		   }else{
            		   	    this.limitMore=false;
                            this.orderCheckMsg="";
            		   }
            	}
            },
			toggle(){  //切换买金方式
				if(this.dependOn=='按金额'){
					this.dependOn='按克重';
					this.placeholder="请输入购买金额";
					this.hasSymbol=true;//输入金额需要人民币符号
					this.number='';
					this.defaultCoupon={};
					this.defaultCouponId="";//要使用的优惠券Id
					this.canUsedCoupon=[];//可以使用的优惠券集合
					this.limitMore=false;//是否超过当日购买限额
                    this.orderCheckMsg="";//订单校验之错误原因
                    this.myUnit="元";
				}else{
					this.dependOn='按金额';
					this.placeholder="请输入购买克重";
					this.hasSymbol=false;//输入金额需要人民币符号
					this.number='';
					this.defaultCoupon={};
					this.defaultCouponId="";//要使用的优惠券Id
					this.canUsedCoupon=[];//可以使用的优惠券集合
					this.limitMore=false;//是否超过当日购买限额
                    this.orderCheckMsg="";//订单校验之错误原因
                    this.myUnit="克";
				}
			},
			//协议阅读与否
			changeBg(){
				this.bg=!this.bg;
			},
			//最高价格保留2为小数
			fixedNum(){
				this.setup_price=clearNoNum(this.setup_price,2)
			},
			//最高价格去掉非数字字符
			checkPrice(){
				this.setup_price=this.setup_price.replace(/[^0-9.]/g,'');
				this.setup_price=(this.setup_price-0).toFixed(2)
			},
			checkInput: function (val) {  //保留位数;输入数量实时带出可用最大金额的优惠券(没有可用的则显示无可用;进入优惠券无可用则全部置灰，不可选择;有可用则默认带出的默认选中,也可选中其他)
				this.hasSymbol ? this.number=clearNoNum(val,2) : this.number=clearNoNum(val,3);
				this.orderCheck();

				//输入金额克重时后面带上单位（元）或（克）
				var p=document.querySelector('.my')
				if(p){
					p.parentNode.removeChild(p)
				}
				var pre=document.createElement('pre')
				pre.classList.add('my')
				pre.style.display="inline"
				pre.style.fontSize="0.36rem"
				pre.style.fontWeight="bold"
				pre.style.color="rgba(255,255,255,0)"
				pre.innerText=this.number;
				
				document.querySelector('body').appendChild(pre)
				var e=document.querySelector('.my')
				this.iptEle.style.left=e.offsetWidth+this.inputLeft+'px'
				
            },
            //输入框失去焦点时校验数字
            checkNum(){
            	this.number=this.number.replace(/[^0-9.]/g,'');
            },
            watchRouter(to,from) {
            	  if(from.path=='/buy/coupon'){
            	  	var id=this.selectCouponId;
            	  	if(!id) {
						this.defaultCoupon={}; //在优惠券没有选择优惠券，则没有可用优惠券
						this.defaultCouponId='';
						return;
					}
					this.defaultCouponId=id;
					for(var i=0;i<this.coupons.length;i++){
						if(this.coupons[i].id==this.defaultCouponId){
							this.defaultCoupon=this.coupons[i];
							break;
						}
					}
            	  }
            },
            payment($event){  //点击"立即买入"
                if(this.$refs.arg.classList.contains('change2')){
           	    	this.myToast('请阅读相关协议');
           	    	return;}
           	    if($event.target.classList.contains('buyBtnNo')) return;
           	    this.popupVisibleBuy=true
            },
            hide(){  //关闭买金确认容器
            	this.popupVisibleBuy=false
            },
            async confirmPay() {  //点击确认支付
            	if(!this.btnCtroller) {
            		this.myToast('操作频繁！');
            		return;
				}
				var methodNum=this.theDaySelect ? 1 : 0  //买金方式
            	if(this.hasSymbol){  //按金额买
            		this.btnCtroller=false
            		var res=await demandBuyOrder(this.number*1,0,this.setup_price*1,methodNum,this.defaultCouponId)
            	}else{ //按克重买
            		this.btnCtroller=false
            		var res=await demandBuyOrder(0,this.number*1,this.setup_price*1,methodNum,this.defaultCouponId)
				}
				var buyInMethod=this.hasSymbol ? 1 : 0 //购买方式  是按金额还是按克重
            	if(res.code==100){
            		this.$router.push({
            			path:'/buyResult',
            			query:{
							msg:res.content,
							buyInMethod:buyInMethod
            			}
            		});
            	}else{
            		this.btnCtroller=true
            		this.popupVisibleBuy=false
            		this.popupVisibleErr=true
            		this.errMsg=res.message;
            	}
			},
			//以后需要改
            goToGold(){  //点击"我的挂单"
            	this.$router.push('/myPutUp')
            },
            okNoBuy(){//点击我知道了
            	this.popupVisibleErr=false
            },
            //获取用户基本信息
            async queryMyProfil(){
            	var res=await queryMyProfil();
            	if(res.code==100){
            		this.availableMoney=res.content.cashNoBalance; //非冻结余额
            	}
            },
            myToast(txt){
				Toast({
                        message: txt,
                        position: 'bottom',
                        duration: 3000
                 });
			},
			goCoupon(){
				this.$router.push({
					path:'/buy/coupon',
					query:{
						default:this.defaultCoupon,
						canOthers:this.canUsedCoupon
					}
				});
			},
		},
		computed:{
			...mapState([
                'currentPrice',
				'selectCouponId',
				'token'
            ]),
            //买金输入时预估克重或预估金额
			calAmount() {
				if(this.hasSymbol){//输入值为金额(提示预估克重)
					if(this.setup_price>=this.currentPrice){ //最高价格大于实时金价
						var res=this.number/this.currentPrice;
						return (parseInt(res*10000)/10000).toFixed(4)
					}else{ //最高价格小于实时金价
						var res=this.number/this.setup_price;
                		return (parseInt(res*10000)/10000).toFixed(4)
					}
				}else{//输入值为克重(提示预估金额)
					if(this.setup_price>=this.currentPrice){
						var res=this.number*this.currentPrice;
						return (Math.ceil(res*100)/100).toFixed(2)
                		
					}else{
						var res=this.number*this.setup_price;
                		return (Math.ceil(res*100)/100).toFixed(2)
					}
                }
			},
			//现金余额是否充足
			noEnough(){
				if(this.hasSymbol){//输入值为金额，若输入值大于可用金额，显示余额不足提示
					return (this.number*1) > (this.availableMoney*1) ? true:false;
				}else{//输入值为克重，若估值大于可用余额，提示余额不足
					return (this.calAmount*1) > (this.availableMoney*1) ? true:false;
				}
			},
			//最终的买入克重
			lastGram(){
				if(this.hasSymbol){  //输入金额
					return this.calAmount;
				}else{
					return (parseInt(this.number*10000)/10000).toFixed(4)
				}
			},
			//最终的付款金额
			lastMoney(){
				if(this.defaultCoupon.id){
					var cha=this.defaultCoupon.faceAmount*1;
				}else{
					var cha=0;
				}
				if(this.hasSymbol){
					return ((this.number*1)-cha).toFixed(2);
				}else{
					var result;
					//最高价大于实时金价
					if(this.setup_price>=this.currentPrice){
						var res=this.number*this.currentPrice;
						result= (Math.ceil(res*100)/100).toFixed(2)
					}else{
						var res=this.number*this.setup_price;
						result= (Math.ceil(res*100)/100).toFixed(2)
					}
                	return (result-cha).toFixed(2);
				}
			},
		},
		watch:{
			token(){
				this.token ? this.queryMyProfil() : ''; 
				this.token ? this.queryCoupons() : '';
			},
			//设置的最大买入价
			setup_price(val){
				if(this.currentPrice-this.setup_price>20){
					this.guaDan=true
				}else{
					this.guaDan=false
				}
			},
			$route(to,from){
				this.watchRouter(to,from);
			},
			limitMore(val){
				if(val){
					this.canUsedCoupon=[];
                	this.defaultCoupon={};
				}
			},
			number(val){ //优惠券的部分需要
                if(!this.number){
                	this.canUsedCoupon=[];
                	this.defaultCoupon={};
                	return;
                }
                if(this.noEnough){
                	this.canUsedCoupon=[];
                	this.defaultCoupon={};
                	return;
                }
                if(this.hasSymbol){  //按金额输入
                		this.canUsedCoupon=[];
                	    for(var i=0;i<this.minAmount.length;i++){
                	    	if(this.number*1>=this.minAmount[i].useableMinAmount){

                	    		this.canUsedCoupon.push(this.minAmount[i])

                	    	}
                	    }

                	    for(var i=0;i<this.minWeight.length;i++){
                	    	if(this.calAmount*1>=this.minWeight[i].useableMinWeight){

                	    		this.canUsedCoupon.push(this.minWeight[i])

                	    	}
                	    }

                }else{  //按克重输入
                	this.canUsedCoupon=[];
                	for(var i=0;i<this.minAmount.length;i++){
                	    if(this.calAmount*1>=this.minAmount[i].useableMinAmount){

                	    	this.canUsedCoupon.push(this.minAmount[i])

                	    }
                	}

                	for(var i=0;i<this.minWeight.length;i++){
                	    if(this.number*1>=this.minWeight[i].useableMinWeight){

                	    	this.canUsedCoupon.push(this.minWeight[i])

                	    }
                	}
                }
                //判断又没可用的优惠券
                this.canUsedCoupon.length==0 ? this.hasUsedCoupon=false:this.hasUsedCoupon=true;
                if(!this.canUsedCoupon.length) return;
                //找出最大面额的优惠券
                var theBigAmount={
                	faceAmount:0,
                	id:''
                };
                for(var i=0;i<this.canUsedCoupon.length;i++){
                	if(this.canUsedCoupon[i].faceAmount>theBigAmount.faceAmount){
                		theBigAmount=this.canUsedCoupon[i];
                	}
                }
                if(theBigAmount.id=='') return;
                this.defaultCoupon=theBigAmount;
                this.defaultCouponId=this.defaultCoupon.id;
			},
		},
		components: {
			headTop,
		},
		destroyed(){
			this.RECORD_COUPONID(null)
		}
	}
</script>
<style scoped lang="less">
@import '../../style/common.less';
    .buy{
   	    background-color:#F5F5F5;
   	    width:100%;
   	    position: absolute;
   	    min-height: 100vh;
     }
     #head_top{
     	padding:auto;
     }
    .buy .myGold{
    	top:.3rem;
    }
    .buy-message {
    	padding-top:.88rem;
    	position: relative;
	}
	.no_trade_tip{
		height:.5rem;
		line-height:.5rem;
		text-align: center;
		background-color:rgba(242,182,67,0.2);
		.font-style(0.24rem,#EDA835);
	}
	.buy_incontent_box{
		background-color: #fff;
		.padding(0.28rem,0.3rem,0.6rem,0.3rem);
		.current_price{
			.current_price_title{
				.font-style(0.26rem,#333333);
				vertical-align: middle;
			}
			.current_price_info{
				.font-style(0.3rem,#EDA835);
				vertical-align: middle;
			}
			.current_price_unit{
				.font-style(0.24rem,#EDA835);
				vertical-align: middle;
			}
		}
	}
	.buy_incontent_box.no_trade_time{
		padding-top:.2rem;
	}
	.max_price_setup{
		padding-top:0.46rem;
		h4{
			.font-style(0.3rem,#333333);
			padding-bottom:0.2rem;
		}
	}
	.makePriceContainer{
		background-color: #F5F5F5;
		height:.88rem;
		margin-bottom:.2rem;
	}
	.makePriceContainer.redTip_guadan{
		margin-bottom:.1rem;
	}
	span.decrease,span.increase{
		width:.88rem;
		height:.88rem;
		display: inline-block;
	}
	span.decrease:active,span.increase:active{
		background-color: rgba(0,0,0,.3);
	}
	span.decrease,span.increase{
		background-size: .44rem .44rem;
		background-repeat: no-repeat;
		background-position: center center;
	}
	span.decrease{
		float:left;
		background-image:url(../../images/buyMinus.png);
	}
	span.increase{
		float:right;
		background-image:url(../../images/buyPlus.png);
	}
	input.price{
		display:inline-block;
		width:74.49%;
		height:.88rem;
		line-height:.88rem;
        text-align: center;
        color:#333333;
        font-size:.32rem; 
		font-weight: 600;
		background-color: #F5F5F5;
	}
	.about_price_warm_tip{
		.font-style(0.22rem,#999999);
	}
	.input_buy{
		height:.88rem;
		background-color: #F5F5F5;
		margin-top:.6rem;
		line-height:.88rem;
		position: relative;
		input{
			background-color: #F5F5F5;
			.font-style(0.32rem,#333333);
			font-weight:600;
			width:76%;
			padding-left:.2rem;
		}
		.buy_method{
			position: absolute;
			right:0.2rem;
			top:0;
			.font-style(0.26rem,#EDA835);
		}
	}
	.input_buy #inputField::-webkit-input-placeholder{
		.font-style(0.32rem,#999999);
		font-weight:normal;
	}

	.input_buy #inputField::-moz-placeholder{
		.font-style(0.32rem,#999999);
		font-weight:normal;
	}
	.input_buy #inputField:-moz-placeholder{
		.font-style(0.32rem,#999999);
		font-weight:normal;
	}
	.input_buy #inputField:-ms-input-placeholder{
		.font-style(0.32rem,#999999);
		font-weight:normal;
	}
	.limit_times{
		background-color: #fff;
		padding:0 0.3rem 0 0.3rem;
		.period_time{
			line-height:1.4rem;
			border-top:1px solid #eeeeee;
			.flex-simple;
			-webkit-justify-content: space-between;
			-o-justify-content: space-between;
			-moz-justify-content: space-between;
			justify-content: space-between;
			p{
				.font-style(0.3rem,#333333);
			}
			.buy_limit_time{
				.font-style(0.28rem,#333333);
				span{
					position: relative;
					display:inline-block;
					height:1.4rem;
					line-height:1.4rem;
				}
				.buy_limit_day:before,.buy_limit_forever:before{
					content:'';
					position: absolute;
					.imgStyle(0.46rem,0.46rem);
					background-size: 0.44rem 0.44rem;
					background-repeat: no-repeat;
					left:-.5rem;
					top:0.48rem;
				}
			}
		}
	}
	.buy_limit_day{
		margin-right:.72rem;
	}
	.buy_limit_day:before{
		background-image: url(../../images/circleNoSelect.png);
	}
	.buy_limit_day.select:before{
		background-image: url(../../images/circleSelect.png);
	}
	.buy_limit_forever:before{
		background-image: url(../../images/circleNoSelect.png);
	}
	.buy_limit_forever.select:before{
		background-image: url(../../images/circleSelect.png);
	}

	::-webkit-input-placeholder{
		font-weight: normal;
		color:#9D9D9D;
	}
	::-moz-placeholder{
		font-weight: normal;
		color:#9D9D9D;
	}
	:-moz-placeholder{
		font-weight: normal;
		color:#9D9D9D;
	}
	:-ms-input-placeholder{
		font-weight: normal;
		color:#9D9D9D;
	}
	.tipPop{
		min-width:2.2rem;
		background-color: #fff;
		-webkit-border-radius:3px;
		-moz-border-radius:3px;
		-o-border-radius:3px;
		border-radius:3px;
		padding-left:.2rem;
		padding-right:.2rem;
		position: absolute;
		top:0.7rem;
		left:.3rem;
		border:1px solid #eeeeee;
	}
	.tipPop span{
		position: relative;
        z-index: 1;
		color:#999999;
		display:block;
		height:.35rem;
		line-height:.35rem;
		font-size:.2rem;
		background-color:#fff;
	}
	.tipPop:before{
		content:'';
		width:.2rem;
		height:.2rem;
		border:1px solid #eeeeee;
		background-color:#fff;
		position: absolute;
		top:-.1rem;
		left:50%;
		margin-left:-.14rem;
		transform: rotate(45deg);
		z-index:0;
	}
	.notEnough{
		color:#FF713F;
		font-size:.22rem;
		height:.68rem;
		line-height: .6rem;
		padding-left:.34rem;
		position: relative;
	}
	.notEnough:before{
		content:'';
		width:.24rem;
		height:.24rem;
		position:absolute;
		background:url('../../images/gantanhao.png') no-repeat;
		background-size: 100% 100%;
		top:0.17rem;
		left:0;
	}
	.balance{
		height:1.4rem;
		background-color: #fff;
		margin-top:.2rem;
		padding-top:.28rem;
		padding-left:.3rem;
		padding-right:.3rem;
	}
	.sli{
		height:1rem;
		display:flex;
		display:-webkit-flex;
		display:-moz-flex;
		display:-ms-flex;
		display:-o-flex;
	}
	.left1{
		flex:4;
		-webkit-flex:4;
		-moz-flex:4;
		-ms-flex:4;
		-o-flex:4;
	}
	.left1 p{
		margin:0;
	}
	.left1 .dec{
		font-size:.3rem;
		height:.58rem;
		color:#333333;
	}
	.left1 .yue{
		font-size:.24rem;
		color:#999999;
	}
	.sli .right{
		.flex_num(1);
		font-size:.26rem;
		line-height:1rem;
		color:#eda835;
		text-align: right;
	}
	.coupon_box{
		padding-left:.3rem;
		padding-right:.3rem;
		background-color: #fff;
	}
	.coupon{
		height:1.41rem;
		border-top:1px solid #eeeeee;
		.flex-simple;
	}
	.coup{
		.flex_num(3.2);
		line-height: 1.41rem;
		font-size: .3rem;
		color:#333333;
	}
	.coup .noAvailable{
		font-size:.24rem;
		color:#999999;
	}
	.coupEnter{
		.flex_num(1);
		line-height: 1.41rem;
		font-size:.24rem;
		color:#eda835;
		text-align: right;
	}
	.sli .right span,.flexR span,.coupEnter span{
		margin-right:.2rem;
		position: relative;
		top:-.03rem;
	}
	.coupEnter img,.flexR .rightArr,.sli .right img{
		width:.13rem;
		height:.24rem;
	}
    .buyBtn{
    	height:.98rem;
    	width:100%;
    	line-height: .98rem;
    	text-align:center;
    	position:fixed;
    	bottom:0;
    	z-index:40;
    	font-size: .34rem;
    	color:#fff;
    	display: block;
    }
    .buyBtnNo{
    	background-color: #f8daa1;
    }
    .buyBtnYes{
    	background-color: #F2B643;
    }
    .buyBtnYes:link{
    	background-color: #F2B643;
    }
    .buyBtnYes:hover{
    	background-color: #F2B643;
    }
    .buyBtnYes:active{
    	background-color: #eda835;
    }
    .buyBtnYes:visited{
    	background-color: #F2B643;
    }
    .argument{
    	margin-top:.42rem;
    	font-size:.22rem;
    	color:#999999;
    	padding-left:.3rem;
		position: relative;
    }
    .check{
    	display:none;
    }
    strong{
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
    .txt{
    	margin-left:.38rem;
    }
    .buy .mint-popup{
    	width:100vw;
    }
    #popupVisibleBuy .payment{
    	height:7.7rem;
    	width:100%;
    	background-color: #fff;
    }
    #popupVisibleErr.mint-popup{
    	width:4.9rem;
    	height:2.44rem;
    }
    #popupVisibleBuy  .payTitle{
    	height:1.22rem;
    	border-bottom: 1px solid #EEEEEE;
    	position: relative;
    }
    #popupVisibleBuy .payTitle p{
    	height:1.22rem;
    	line-height: 1.22rem;
    	text-align: center;
    	font-size:.33rem;
    	color:#000;
    	font-weight: bold;
    }
    #popupVisibleBuy .payTitle .close{
    	width:.36rem;
    	height:.36rem;
    	position: absolute;
    	left:0.3rem;
    	top:0.45rem;
    }
    .payment .payMessage{
    	background-color: #fff;
    	padding-left:.5rem;
    	padding-right:.4rem;
    	padding-top:.39rem;
    }
    .payMessage .payCurrentPrice,.payMessage .payKilo,.payMessage .payCoupon{
    	height:.68rem;
    	font-size: .3rem;
    }
    .payMessage .payTotal{
    	height:1.1rem;
    	line-height:1.1rem;
    	font-size: .32rem;
    	border-top:1px solid #F2F2F2;
    }
    .currentLeft,.kiloLeft,.couponLeft,.totalLeft{
    	float:left;
    }
    .currentRight,.kiloRight,.couponRight,.totalRight{
    	float:right;
    }
    .totalRight{
		color:#eda835;
    }
    .payConfirm{
    	height:.86rem;
    	width:6.92rem;
    	background-color:#F2B643;
    	text-align: center;
    	line-height: .86rem;
    	color:#fff;
    	font-size: .34rem;
    	position: absolute;
    	bottom:.4rem;
    	left:50%;
    	margin-left: -3.46rem;
    	border-radius: 4px;
    	-webkit-border-radius: 4px;
    	-moz-border-radius: 4px;
    	-o-border-radius: 4px;
    }
     .identity{
        width:4.9rem;
        height:2.44rem;
        background-color: #fff;
        border-radius: 10px;
        padding-top:.4rem;
    }
    .identity h4{
        text-align: center;
    }
    .identity .tipTitle{
    	font-size:.3rem;
    	height:.48rem;
    }
    .identity .tipDesc{
    	font-size:.28rem;
    	font-weight: normal;
    	color:#333333;
    }
    .identifyBtn{
        border-top:1px solid #EEEEEE;
        margin-top:.3rem;
        line-height:.86rem;
        text-align: center;
        font-size:.32rem;
        color:#eda835;
    }
    .router-slid-enter-active, .router-slid-leave-active {
    	transition: all .4s;
    	-webkit-transition: all .4s;
    	-moz-transition: all .4s;
    	-o-transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
    	transform: translate3d(2rem, 0, 0);
    	-webkit-transform: translate3d(2rem, 0, 0);
    	-moz-transform: translate3d(2rem, 0, 0);
    	-o-transform: translate3d(2rem, 0, 0);
    	opacity: 0;
    }
</style>

