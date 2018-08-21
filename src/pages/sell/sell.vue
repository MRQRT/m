<template>
	<div class="sell">
		<head-top headTitle='卖金'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/myGold')">
      		<span slot="custom" class="custom myGold" @click="MyAutoOrder" style="font-size:.26rem;">我的挂单</span>
		</head-top>
		<section class="outTrade" v-show="outTrade">非交易时间段 00:00--09:00 可挂单委托</section>
		<section class="top_Box">
			<div class="price">
				<span>实时金价：</span><span>{{currentPrice | formatNum}}</span><span>元/克</span>
			</div>
			<div class="subTitle">最低卖出价</div>
			<div class="setMinPrice">
				<span class="reduce" @touchstart="decrease(minSellPrice)"></span>
				<input type="number" v-model="minSellPrice" id="min_sell_price" @keyup="checkInput(minSellPrice+'','two')" placeholder="请输入最低卖出金价">
				<span class="add" @touchstart="increase(minSellPrice)"></span>
			</div>
			<p class="tips" style="color:red;" v-show="moreThan">挂单价格不能太高</p>
			<p class="tips">当最低卖出价小于实时金价，以实时金价成交</p>
			<p class="tips">当最低卖出价>=实时金价，以最低卖出价进行挂单</p>
			<div class="sell_weight">
				<input type="text" v-model="sellWeight" placeholder="请输入卖出克重" @keyup="checkInput(sellWeight+'','four')">
				<span @click="autoInput">全部卖出</span>
				<span v-show="est_show">预估金额：{{estimate}}元，手续费：{{serviceCharge}}元</span>
				<span style="position:absolute;left:0;padding-left:.3rem;font-size:.28rem;font-weight:bold;opacity:0" id="zhanweifu">{{sellWeight}}</span>
				<span style="position:absolute;left:0;line-height:.9rem;font-size:.3rem" id="unit" v-show="unit_show">克</span>
			</div>
			<p class="notEnough" v-show="noEnough">大于可卖克重</p>
			<p class="notEnough" v-show="checkDefeat">{{orderCheckMsg}}</p>
		</section>
		<section class="middle_box">
			<div class="middle_left">有效期限</div>
			<div class="middle_right">
				<span :class="{'selected':select=='cur'}" @click="selectFun('cur')">当天有效</span>
				<span :class="{'selected':select=='for'}" @click="selectFun('for')">永久有效</span>
			</div>
		</section>
		<p class="agrp"><span :class="{'disagr':disagr==true,'agr':disagr==false}" @click="agr()"></span><span @click="$router.push('/arguments')">已阅读并同意《黄金管家消费服务协议》</span></p>
		<div @click="confirm_sell()" class="sell_btn" :class="{'can_sell':can_sell==true}">{{btnText}}</div>
		<mt-popup position="bottom"  closeOnClickModal="false" v-model="popupVisible" class="mint-popup-bottom">
			<div class="order_submit">
				<div class="submit_title"><span @click="closeMode()"></span>订单确认</div>
				<div class='order_list' style="margin-top:.2rem;"><span>实时金价</span><span>{{currentPrice}}元/克</span></div>
				<div class='order_list'><span>最低卖出价</span><span>{{minSellPrice}}元/克</span></div>
				<div class='order_list'><span>卖出克重</span><span>{{sellWeight}}克</span></div>
				<div class='order_list'><span>卖出手续费</span><span>{{serviceCharge}}元</span></div>
				<div class='order_list_border'></div>
				<div class='order_list_last'><span>预估卖出金额</span><span>（已扣除手续费）</span><span>{{deduct_sercharge}}元</span></div>
				<div class="submit_btn"><div @click="sell_submit()">订单提交</div></div>
			</div>
		</mt-popup>
	</div>
</template>
<script>
import  headTop  from '@/components/header/head.vue';
import { bizCloseCheck,queryMyProfil,orderCheck,demandSellOrder } from '@/service/getData.js';
import { clearNoNum,getRem } from '@/config/mUtils.js';
import { mapState } from 'vuex'
import { Toast,Popup } from 'mint-ui'
export default {
	data() {
		return {
			minSellPrice: '',
			depPart: -0.5,
			moreThan: false,//挂单价格过高提示语
			sellWeight: '',//卖出克重
			allGoldGram:'',//用户账户黄金克重
			screenHeight: document.documentElement.clientHeight,//记录高度值(这里是给到了一个默认值)
			select: 'cur',
			outTrade: '',//非交易提示语开关
			disagr: false,
			estimate: null,//预估金额
			serviceCharge: null,//手续费 3‰(千分之三)
			est_show: false,//预估金价显示
			getRem: getRem(),//计量单位克
			unit_show: false,//单位克的显示开关
			can_sell: false,//
			noEnough: false,//可卖克重提示
			checkDefeat: '',//订单校验返回字段显示开关
			orderCheckMsg:'',//订单校验返回字段
			code: '',//订单校验code值，code为0,订单可以提交，code为1，订单不能提交
			btnCtroller: true,//防止订单重复提交
			popupVisible: false,//订单的弹出层
			zhan: null,//占位符
			btnText:null,//立即卖出/挂单卖出切换
			deduct_sercharge:'',//扣除手续费的预估克重
		}
	},
	mounted() {
		//处理键盘弹出的沉底按钮顶上去的兼容问题
		window.onresize = () => {
			var h=document.documentElement.clientHeight
			if((this.screenHeight-h)>50){
				document.querySelector('.sell_btn').style.position = 'relative'
			}else{
				document.querySelector('.sell_btn').style.position = 'fixed'
			}
		},
		this.bizCloseCheck();//交易时间判断
		this.minSellPrice=(Number(this.currentPrice)-0.5).toFixed(2)
		this.zhan=document.querySelector('#zhanweifu')
		this.unit=document.querySelector('#unit')
		this.queryMyProfil();
	},
	computed: {
		...mapState({
			currentPrice: state => state.currentPrice,
		}),
	},
	watch:{
		//当前金价
		currentPrice(val){
			return Number(val).toFixed(2)
		},
		//
		depPart(val){
			val>20?this.moreThan=true:this.moreThan=false
		},
		//最低卖出价
		minSellPrice(val){
			//最低卖出价大于当前金价加20元，显示‘挂单价格不能太高’
			((Number(val)-Number(this.currentPrice))>20)?this.moreThan=true:this.moreThan=false
			// 预估金额：
			// 1、最低卖出价≤实时金价，预估金额=实时金价*卖出克重
			// 2、最低卖出价>实时金价，预估金额=最低卖出价*卖出克重
			if(this.currentPrice>=this.minSellPrice){
				this.estimate=(Number(this.sellWeight)*Number(this.currentPrice)).toFixed(2);
			}else{
				this.estimate=(Number(val)*Number(this.sellWeight)).toFixed(2);
			}
			//预估价值显示控制
			if(val!=''&&this.sellWeight!=''&&this.moreThan==false&&this.noEnough==false){
				this.est_show=true
			}else{
				this.est_show=false
			}
			// //卖金按钮点击控制
			if(val!=''&&this.est_show&&this.disagr==false&&this.moreThan==false&&!this.noEnough){
				this.can_sell=true
			}else{
				this.can_sell=false;
			}
		},
		//卖出克重
		sellWeight(val){
			if(Number(val)>Number(this.allGoldGram)){//输入克重大于可卖克重
				this.noEnough=true;
				this.est_show=false;
			}else{//输入克重小于可卖克重
				this.noEnough=false
				// 预估金额：
				// 1、最低卖出价≤实时金价，预估金额=实时金价*卖出克重
				// 2、最低卖出价>实时金价，预估金额=最低卖出价*卖出克重
				if(this.currentPrice>=this.minSellPrice){
					this.estimate=(Number(val)*Number(this.currentPrice)).toFixed(2);
				}else{
					this.estimate=(Number(val)*Number(this.minSellPrice)).toFixed(2);
				}
				(val!=''&&this.minSellPrice!=''&&this.moreThan==false)?this.est_show=true:this.est_show=false;//预估价值显示开关
			}
			//卖金按钮点击控制
			if(val!=''&&this.minSellPrice&&this.disagr==false&&this.moreThan==false&&val<=this.allGoldGram){
				this.can_sell=true
			}else{
				this.can_sell=false;
			}
			//‘克’字的控制显示与否
			(val!='')?this.unit_show=true:this.unit_show=false;
		},
		//是否阅读卖金协议
		disagr(val){
			(!val&&this.minSellPrice!=''&&this.sellWeight!=''&&this.moreThan==false&&!this.noEnough)?this.can_sell=true:this.can_sell=false
		},
	},
	filters:{
		formatNum(val){
			return Number(val).toFixed(2)
		},
	},
	methods:{
		//获取用户信息
		async queryMyProfil(){
			const res = await queryMyProfil();
			if(res.code==100){
				this.allGoldGram = res.content.demandGoldBalance?res.content.demandGoldBalance:"0"
			}
		},
		//跳转到我的挂单
		MyAutoOrder(){
			this.$router.push('/myPutUp');
		},
		//关闭弹出层
		closeMode(){
			this.popupVisible=false
		},
		//有效期选择
		selectFun(val){
			this.select=val
		},
		//交易时间判断
		async bizCloseCheck(){
			const res = await bizCloseCheck(2);
			if(res.code==100){
				//content=1在交易时间段内，content=0不在交易时间段内
				res.content?this.outTrade=false:this.outTrade=true
				res.content?this.btnText='立即卖出':this.btnText='挂单卖出'
			}
		},
		//减
		decrease(val){
			if(this.minSellPrice==''||this.minSellPrice==0)return;
			this.depPart=Number((Number(this.depPart)-0.1).toFixed(2))
			this.minSellPrice=(Number(this.minSellPrice)-0.1).toFixed(2)
		},
		//加
		increase(val){
			if(this.minSellPrice=='')return
			this.depPart=Number((Number(this.depPart)+0.1).toFixed(2))
			if(this.depPart>20){
				return
			}
			this.minSellPrice=(Number(this.minSellPrice)+0.1).toFixed(2)
		},
		//清除非数字
		checkInput: function (val,sign) {
			(sign=='two')?this.minSellPrice=clearNoNum(val,2):this.sellWeight=clearNoNum(val,4);
			this.unit.style.left=this.zhan.offsetWidth+7+'px';
			this.orderCheck(2);//订单校验
		},
		//全部卖出
		autoInput(){
			this.sellWeight = this.allGoldGram
			let zhan=document.querySelector('#zhanweifu');
			let unit=document.querySelector('#unit');
			this.est_show=true
			setTimeout(function(){
				unit.style.left=zhan.offsetWidth+5+'px';
			},20)
			this.orderCheck(2);//订单校验
		},
		//
		agr(){
			this.disagr=!this.disagr
		},
		//订单校验
		async orderCheck(val){
			const res = await orderCheck(this.sellWeight,'',val)
			if(res.code==100){
				this.code=res.content.code//订单校验的code，1校验失败，0校验成功
				if(res.content.code==1){
					this.checkDefeat=true//订单校验失败
					this.orderCheckMsg=res.content.msg;
				}else{
					this.serviceCharge=res.content.sellFee?res.content.sellFee:0//手续费
					this.deduct_sercharge=this.estimate-this.serviceCharge
				}
			}
		},
		//点击“立即卖出”
		async confirm_sell($event){
			if(this.code==0&&this.can_sell){
				this.popupVisible=true
				
			}
		},
		//确认卖出
		async sell_submit(){
			if(this.btnCtroller){
				this.btnCtroller=false
				let term = (this.select=='cur')?1:0;//1当天有效0永久有效
				const res = await demandSellOrder(this.sellWeight,this.minSellPrice,term);
				if(res.code==100){
					this.$router.push({
						path: '/sellResult',
						query:{
							result:res.content
						}
					})
				}else{
					Toast(res.message)
				}
			}else{
				Toast('频繁操作')
			}
		}
	},
	components: {
		headTop
	},
	destroyed(){
		
	}
}
</script>
<style lang="less" scoped>
@import "../../style/common.less";
#head_top{
	border: none;
}
.sell{
	padding-top: .88rem;
	height: 100vh;
	background-color: #F5F5F5;
	position: relative;
}
.outTrade{
	width: 100vw;
	height: .5rem;
	line-height: .5rem;
	background-color:#fdeccd;
	color: @base-font-color4;
	font-size: .24rem;
	text-align: center;
}
.top_Box{
	width: 100vw;
	padding: 0 .3rem .6rem .3rem;
	background-color: #fff;
}
/*金价*/
.price{
	font-size: .28rem;
	height: 1rem;
	line-height: 1.2rem;
	color: @base-font-color4;
	span:first-child{
		color: @base-font-color1;
	}
}
.subTitle{
	.font-style(.3rem,@base-font-color1);
	margin-top: .15rem;
}
.setMinPrice{
	.flex-simple;
	height: .88rem;
	background-color: #F5F5F5;
	margin-top: .2rem;
	margin-bottom: .1rem;
	.add{
		flex: 1;
		background-image: url(../../images/addBg.png);
		background-repeat: no-repeat;
		background-size: 40%;
		background-position: center;
	}
	.add:active{
		background-color: rgba(0,0,0,0.3)
	}
	#min_sell_price{
		flex: 4.5;
		height: .88rem;
		line-height: .88rem;
		text-align: center;
		font-size: .3rem;
		background-color: #F5F5F5;
		font-weight: bold;
		color: @base-font-color4; /* 光标的颜色*/
		text-shadow: 0px 0px 0px #333333; /* 文本颜色 */
		-webkit-text-fill-color: transparent;
	}
		#min_sell_price::-webkit-input-placeholder{
			.font-style(0.3rem,#999999);
			text-shadow: none;
			-webkit-text-fill-color: initial;
			font-weight:normal;
		}
		#min_sell_price::-moz-placeholder{
			.font-style(0.3rem,#999999);
			text-shadow: none; 
			-webkit-text-fill-color: initial;
			font-weight:normal;
		}
		#min_sell_price::-ms-input-placeholder{
			.font-style(0.3rem,#999999);
			text-shadow: none; 
			-webkit-text-fill-color: initial;
			font-weight:normal;
		}
	.reduce{
		flex: 1;
		background-image: url(../../images/minus.png);
		background-repeat: no-repeat;
		background-size: 40%;
		background-position: center;
	}
	.reduce:active{
		background-color: rgba(0,0,0,0.3)
	}
}
.tips{
	font-size: .2rem;
	color: @base-font-color3;
	line-height: .4rem;
}
.sell_weight{
	.flex-simple;
	margin-top: .5rem;
	background-color: #F5F5F5;
	height: .88rem;
	position: relative;
	input{
		height: .88rem;
		flex: 4;
		background-color: #F5F5F5;
		padding-left: .3rem;
		font-size: .28rem;
		font-weight: bold;
		color: @base-font-color4; /* 光标的颜色*/
		text-shadow: 0px 0px 0px #333333; /* 文本颜色 */
		-webkit-text-fill-color: transparent;
	}
	input::-webkit-input-placeholder{
		.font-style(0.28rem,#999999);
		line-height: .36rem;
		text-shadow: none;
		-webkit-text-fill-color: initial;
		font-weight:normal;
	}
	input::-moz-placeholder{
		.font-style(0.3rem,#999999);
		text-shadow: none; 
		-webkit-text-fill-color: initial;
		font-weight:normal;
	}
	input::-ms-input-placeholder{
		.font-style(0.3rem,#999999);
		text-shadow: none; 
		-webkit-text-fill-color: initial;
		font-weight:normal;
	}
	span:nth-child(2){
		flex: 1;
		color: @base-font-color4;
		font-size: .26rem;
		line-height: .88rem;
		text-align: center;
	}
	span:nth-child(3){
		content:'';
		display: inline-block;
		height: .45rem;
		line-height: .4rem;
		.font-style(0.25rem,#999999);
		position: absolute;
		bottom: -19px;
		z-index: 3;
		left: 12px;
		background-color: #fff;
		border: 1px solid #EEEEEE;
		padding: 0px 12px 0px 12px;
		&:after{
			content:'';
			display: inline-block;
			width: .15rem; 
			height: .15rem; 
			position: absolute;
			z-index: 1;
			top: -.1rem;
			left: 10%;
			transform:rotate(45deg);
			border-top: 1px solid #eeeeee;
			border-left: 1px solid #eeeeee;
			background-color: #fff;
		}	
	}
}
.notEnough{
	color:#FF713F;
	font-size:.24rem;
	height:.35rem;
	line-height: .35rem;
	padding-left:.34rem;
	position: relative;
	margin-top: 3px;
	padding-top: .1rem;
}
.middle_box{
	margin-top: .25rem;
	height: 1.4rem;
	line-height: 1.4rem;
	background-color: #ffffff;
	padding-left: .3rem;
	color: @base-font-color1;
	.flex-simple;
	.middle_left{
		flex: 1;	
	}
	.middle_right{
		.flex-simple;
		flex: 1.3;
		font-size: .3rem;
		span{
			flex: 1;
			position: relative;
			text-align: right;
			padding-right: .3rem;
			&:before{
				content: '';
				display: inline-block;
				width: .4rem;
				height: 1.4rem;
				position: absolute;
				left: 0rem;
				background-image: url(../../images/select_gray.png);
				background-repeat: no-repeat;
				background-size: 95%;
				background-position: center center;
			}
		}
		.selected{
			&:before{
				content: '';
				display: inline-block;
				width: .4rem;
				height: 1.4rem;
				position: absolute;
				left: 0rem;
				background-image: url(../../images/select_orange.png);
				background-repeat: no-repeat;
				background-size: 95%;
				background-position: center center;
			}
		}
	}
}
.agrp{
	color: @base-font-color3;
	font-size: .22rem;
	height: .9rem;
	line-height: .96rem;
	padding: 0 .3rem 0 .8rem;
	position: relative;
	.agr{
		content: '';
		display: inline-block;
		position: absolute;
		left:.3rem;
		width: .3rem;
		height: .9rem;
		background: url(../../images/readed.png) no-repeat;
		background-position: center;
		background-size: 95%;
	}
	.disagr{
		content: '';
		display: inline-block;
		position: absolute;
		left:.3rem;
		width: .3rem;
		height: .9rem;
		background: url(../../images/reading.png) no-repeat;
		background-position: center;
		background-size: 95%;
	}
}
.sell_btn{
	height: .94rem;
	width: 100vw;
	background-color: #ffd482;
	line-height: .94rem;
	text-align: center;
	font-size: .34rem;
	color: #fff;
	position: fixed;
	bottom: 0;
}
.sell_btn:active{
	background-color: #ffd482;
}
.can_sell{
	background-color: #F2B643
}
.order_submit{
	width: 100%;
	height: 7.7rem;
	background-color: #ffffff;
	.submit_title{
		width: 100vw;
		height: 1.2rem;
		position: relative;
		line-height: 1.2rem;
		text-align: center;
		font-size: .34rem;
		font-weight: bold;
		span{
			display: inline-block;
			width: 1.2rem;
			height: 1.2rem;
			background: url(../../images/grayClose.png) no-repeat;
			background-position: center;
			background-size: 25%;
			position: absolute;
			left: 0;
			top: 0;
		}
	}
}
.order_list_border{
	width: 100%;
	position: relative;
	margin-top: .25rem;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.submit_title:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #e1e1e1;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		position: absolute;
		bottom: 0;
		left: 0;
	}
	.order_list_border:after{
		content: '';
		display: inline-block;
		width: 88%;
		border-bottom: 1px solid #e1e1e1;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		position: absolute;
		bottom: 0;
		left: 6%;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2),(-o-min-device-pixel-ratio:2){
	.submit_title:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #e1e1e1;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		position: absolute;
		bottom: 0;
		left: 0;
	}
	.order_list_border:after{
		content: '';
		display: inline-block;
		width: 88%;
		border-bottom: 1px solid #e1e1e1;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		position: absolute;
		bottom: 0;
		left: 6%;
	}
}
.order_list{
	width: 100%;
	height: .7rem;
	color: #666666;
	font-size: .28rem;
	padding: 0 .52rem 0 .52rem;
	span:nth-child(1){
		float: left;
		line-height: .7rem;
		display: inline-clock;
	}
	span:nth-child(2){
		float: right;
		display: inline-clock;
		line-height: .7rem;
	}
}
.order_list_last{
	width: 100%;
	height: 1.2rem;
	padding: 0 .52rem 0 .52rem;
	color: #999;
	span:nth-child(1){
		display: inline-block;	
		line-height: 1.2rem;
		font-size: .32rem;
		float: left;
	}
	span:nth-child(2){
		display: inline-block;	
		line-height: 1.23rem;
		font-size: .2rem;
		float: left;
	}
	span:nth-child(3){
		display: inline-block;	
		line-height: 1.2rem;
		font-size: .32rem;
		float: right;
		color: @base-font-color4;
	}
}
.submit_btn{
	width: 100%;
	height: .88rem;
	padding: 0 .3rem 0 .3rem;
	font-size: .34rem;
	color: #fff;
	text-align: center;
	position: absolute;
	bottom: .5rem;
	div:nth-child(1){
		line-height: .88rem;
		width: 100%;
		height: .88rem;
		background: @base-font-color4;
	}
}
.mint-popup{
	width: 100%;
}
</style>
