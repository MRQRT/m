<template>
	<div class="withdraw">
		<head-top headTitle='提现'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
		<label @click="goto" v-if="isHasBank" class="bankType" style="margin-top: .88rem;">
			<img :src="addBg" class="add">
			<p class="bankName" style="height: 1.4rem;line-height: 1.4rem;margin-top: 0"><span>添加银行卡</span></p>
		</label>
		<section v-else class="bankType" style="margin-top: .88rem;">
			<img :src="bankImgUrl" style="width: .8rem;margin-top: .25rem;float: left;">
			<p class="bankName"><span>{{bankName}}</span>(尾号<span>{{fourNum}}</span>)</p>
			<p class="available" v-show="!zanTing">可转出至该卡余额：<span>{{available}}</span>元</p>
			<p class="available" v-show="zanTing" style="color:red">暂不支持该银行卡，请联系客服！</p>
		</section>
		<div class="avail_number">
			<img :src="RMBimg">
			<input type="number" placeholder="请输入提现金额" v-model="RMB" ref="inputDom">
			<label @click="autoIput">全部提现</label>
			<span v-show="exceed">{{toast}}</span>
			<span v-show='hasfee' class="myFee"><span>手续费：{{fee}}元</span></span>
		</div>
		<div class="tips">
			<h6>温馨提示：</h6>
			<li><p>1、</p><div>当日提现，T+1工作日到账，周末和节假日到账日期顺延；</div></li>
			<li><p>2、</p><div>当日首次提现免费，第二笔起每笔5元手续费；</div></li>
			<li><p>3、</p><div><span v-if="eachMinMoney">单笔最小提现金额{{eachMinMoney}}元，</span>单笔最大提现金额为{{eachMaxMoney}}元；</div></li>
			<li><p>4、</p><div>单日最大提现金额为{{eachDayMaxMoney}}元；</div></li>
		</div>
		<div class="button">
			<mt-button type="default" size="large" :class="is&&!zanTing?'isSubmit':'noSubmit'" @click="confirm">立即提现</mt-button>
			<!-- <span :class="is?'isSubmit':'noSubmit'" @click="confirm">立即提现</span> -->
		</div>
		<!-- 获取验证码弹窗 -->
		<mt-popup v-model="popupVisible" position="bottom" :closeOnClickModal="false" style="border-radius:0;">
			<section v-if="first">
				<div class="tanHead">
					<img :src="blackClose" @click="close">
					<p>输入短信验证码</p>
				</div>
				<p class="fasongtishi"><span>已发送至手机号<span>{{transFor}}</span>，</span><span @click="question">收不到验证码？</span></p>
				<div class="shuru">
					<input id="auto" type="number" name="" placeholder="请输入短信验证码" pattern="[0-9]*" maxlength="6" v-model="yanzhengma">
					<span class="getVerif" @click="getVerif" ref="send_smscode">获取验证码</span>
					<span class="biankuang"></span>
				</div>
				<div class="queren" @click="confirm_withdraw">
					<mt-button type="default" size="large" class="withdraw_button" :class="querenyanse?'is-default':'no-default'">确认提现</mt-button>
				</div>
			</section>
			<section v-else>
				<img :src="blackClose" @click="close_second" style="position:absolute;top: .3rem; width:.28rem;margin-left: .25rem;">
				<div class="tanHead" style="margin-top:1.1rem;height: 1.5rem;">
					<p>收不到验证码</p>
					<p style="padding: 0 .8rem;"><span style="display:inline-block; width:100%" class="biankuang"></span></p>
				</div>
				<p class="answer">1.请检查短信是否被手机安全中心拦截；</p>
				<p class="answer">2.如银行预留手机号已变更，请重新绑定；</p>
				<p class="answer">3.获取更多帮助，请拨打客服电话</p>
				<p class="answer answer2">400-819-6199</p>
			</section>
		</mt-popup>
	</div>
</template>
<script type="text/javascript">
import	headTop from '@/components/header/head'
import	RMBimg from '@/images/¥.png'
import	blackClose from '@/images/blackClose.png'
import	addBg from '@/images/addBg.png'
import bankDefault from '@/images/bankDefault.png'//银行卡图标占位符


import	{mapState} from 'vuex'
import { clearNoNum } from '../../config/mUtils.js'
import { Popup,Toast } from 'mint-ui'

import { queryBankCard, withDrawMax, sendSms, withdrawOrderApply, queryMyProfil,getTradeFee} from '@/service/getData.js'

export	default{
		data(){
			return {
				 RMBimg: RMBimg,//人民币icon
			  available: '',//可转现金
			        RMB: '',//输入转的金额
			     exceed: 0,//超过可转金额后显示的开关
			         is: 0,//确认提现开关
		   popupVisible: false,//充值验证码弹窗
		           iNow: true,//状态变量,解决重复点击问题
			     second: 60,//秒
			      timer: '',//定时器
			 yanzhengma: '',//验证码输入框输入内容监听
			      first: true,
			 blackClose: blackClose,
		    querenyanse: false,
		    	  addBg: addBg,
		       bankName: '',//银行名称
			 bankImgUrl: bankDefault,//银行图标地址
	    eachDayMaxMoney: '',//每日最高限额
	       eachMaxMoney: '',//单笔最高限额
	       	    fourNum: '',//卡号后四位尾号
	       	   prodCode: '',//产品渠道
	       	 userBankId: '',//
	       	  isHasBank: '',//若为真，添加银行卡显示，若为假，显示用户银行卡
	       	      toast: '',//超出提现范围提示
	       eachMinMoney: '',//最低提现金额
                zanTing: false,//true为支持，false为不支持
              bindPhone: '',//绑定银行卡的手机号
                    fee: null, //手续费
                 hasfee: false,
            sumDayMoney: null,//日累计提现金额
			}
		},
		mounted(){
			this.queryBankCard();
			this.queryUserInfo();//查询用户概况
		},
		computed: {
			...mapState([
				'userInfo'
			]),
			transFor: function(){
				return (this.bindPhone).substring(0,3)+'****'+(this.bindPhone).substring(7,11)
			}
		},
		watch: {
			RMB(val){
				this.checkInput(val);
			},
			yanzhengma(value){
				if(value.length==6){
					this.querenyanse=true
				}else{
					this.querenyanse=false
				}
			}
		},
		methods:{
			async getTradeFee(){ //计算手续费 tradeType: 0充值 1提现 prodCode:jingdong  yinlianpay  有个返回产品码的接口 返回什么就用什么 tradeMoney:金额元 小数点最多两位
				var res=await getTradeFee(this.RMB*1,this.prodCode,'1');
				if(res.code==100){
					this.fee=res.content;
					if(this.fee){
						this.hasfee=true;
						if(this.exceed){
							this.hasfee=false;
						}
					}else{
						this.hasfee=false;
					}
				}
			},
			checkInput(val){
				if(val*1){
					this.getTradeFee();
				}else{
					this.hasfee=false;
					this.fee=null;
				}
				this.RMB = clearNoNum(val,2)
        		if(!this.zanTing){//银行卡支持
          			if(this.eachMaxMoney>=this.available){//可提现金额小于每笔最大限额
            			if(+val<this.eachMinMoney && val!=''){
              				this.exceed=1;this.toast="低于最小提现金额";this.is=false
             				return
            			}
            			if(+val>this.available){
              				this.exceed=1;this.toast="超出可转金额";this.is=false
            			}else if(val!=''){
              				this.exceed=0;this.is=1
            			}else{
              				this.exceed=0;this.is=0
            			}
          			}else{//可提现金额大于每笔最大限额
            			if(+val<this.eachMinMoney && val!=''){
              				this.exceed=1;this.toast="低于最小提现金额";this.is=false
              				return
            			}
	            		if(this.eachDayMaxMoney-(+this.sumDayMoney)<val){
	            			this.exceed=1;this.toast="当日累计提现金额不得大于"+this.eachDayMaxMoney+"元"
	            			return
	            		}
	            		if(+this.eachMaxMoney<+val && +val<=+this.eachDayMaxMoney){
	              			this.exceed=1;this.toast="超出单笔最大限额";this.is=false
	              			return
	            		}else if(this.eachDayMaxMoney<+val){
	              			this.exceed=1;this.toast="超出每日最大限额";this.is=false
	              			return
	            		}else if(val!=''){
	              			this.exceed=0;this.is=1
	            		}else{
	              			this.exceed=0;this.is=0
	            		}
          			}
          			//输入金额大于可提现金额
          			if(+val>this.available){
            			this.exceed=1;this.toast="超出可转金额";this.is=false
          			}
       			}
			},
			//点击全部提现
			autoIput(){
				if(this.eachMaxMoney>this.available){//可提现金额小于每笔最大限额
					this.RMB = this.available;
				}else{//可提现金额大于每笔最大限额
					this.exceed=1;this.toast="单笔最大限额为"+this.eachMaxMoney;this.is=false
				}
			},
			async queryUserInfo(){
				const res = await queryMyProfil();
				if(res.code==100){
					this.available=res.content.cashBalance
				}
			},
			//获取用户银行卡
            async queryBankCard(){
                const res = await queryBankCard()
                if(res.code==100){
                    if(res.content.length==0){
                        this.isHasBank = true
                        this.bankType = 'weixin'
                    }else{
                        this.isHasBank = false
                        this.bankType = 'norBank'
                        const bankCard = res.content[0].bankCardNo
                        this.userBankId = res.content[0].id
                        this.withDrawMax(bankCard)
                    }
                }
            },
            //获取银行卡名称
            async withDrawMax(value){
            	const res = await withDrawMax(value)
            	if(res.code==100){
                //银行卡支持，返回content.errcode=0
                if(res.content.errcode==0){
                    this.zanTing=false
                    const content=res.content
                    this.prodCode=content.prodCode//支付渠道
                    this.bankName = content.bankName;//银行名称
                    this.bankImgUrl = content.bankImgUrl//银行图标
                    this.fourNum = content.fourNum//四位尾号
                    this.eachMaxMoney = content.eachMaxMoney//每笔最高限额
                    this.eachDayMaxMoney = content.eachDayMaxMoney//每日最高限额
                    this.eachMinMoney = content.eachMinMoney//最低提现金额
                    this.bindPhone = content.phone//银行卡绑定的手机号
                    this.sumDayMoney = content.sumDayMoney//单日累计金额
                  }else{//银行卡不支持，返回content.errcode=1
                    this.zanTing=true
                    const content=res.content
                    this.bankName = content.bankName;//银行名称
                    this.bankImgUrl = content.bankImgUrl//银行图标
                    this.fourNum = content.fourNum//四位尾号
                    this.$refs.inputDom.style.disabled="disabled";
                  }
            	}
            },
            //立即提现
            confirm(){
            	if(this.is){
            		this.popupVisible=true
            		this.getVerif();
	                setTimeout(function(){
	                  document.getElementById('auto').focus();
	                },50)
            	}
            },
            //关闭弹出框
            close(){
            	this.popupVisible = false
            },
            //获取验证码
            async getVerif(){
            	let that = this
                let send_smscode = this.$refs.send_smscode
                let i = this.second

                if( that.iNow==true && this.second==60){
                    that.iNow = false
                    // 发送验证码的接口
                    const res = await sendSms(this.bindPhone)
                    if(res.code==-1023){
                    	Toast(res.message)
                    }
                    that.timer = setInterval(function(){
                        send_smscode.style.color="#666"
                        i--
                        send_smscode.innerHTML = i+'s'
                        if(i==-1){
                            clearInterval(that.timer)
                            that.iNow=true
                            send_smscode.style.color="#eda835"
                            send_smscode.innerHTML = '获取验证码'
                            that.second = 60;
                        }
                    },1000)
				}
            },
            //确认提现
            async confirm_withdraw(){
            	const res = await withdrawOrderApply(this.userBankId, this.prodCode, this.RMB, this.yanzhengma)
            	if(res.code==100){
            		this.$router.push({
            			path:'withdrawResult',
            			query:{
            				msg:res.content
            			}
            		})
            	}else{
            		Toast({
		                 message: res.message,
	  					position: 'bottom',
	  				    duration: 5000,
		            })
            	}
            },
            //收不到和验证码弹框
            question(){
            	this.first=false
            	this.iNow=true
            },
            //关闭问题窗口
            close_second(){
            	this.first=true
            }
		},
		filters: {

		},
		components:{
			headTop: headTop
		}
	}



</script>
<style type="text/css" scoped>
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.withdraw{
	width: 100%;
	position: absolute;
	background-color: #f5f5f5;
	top: 0;
	height: 100vh;
}
.withdraw>.bankType{
    width: 100%;
    height: 1.4rem;
    padding: 0 .3rem 0 .3rem;
    background-color: #fff;
    display: block;
}
.withdraw>.bankType>img{
    margin-right: 0.05rem;
    float: left;
}
.withdraw>.bankType>.bankName{
	display: inline-block;
	width: 85%;
	font-size: .3rem;
	height: .55rem;
	line-height: .55rem;
	float: left;
	padding-left: .2rem;
	margin-top: .15rem;
}
.withdraw>.bankType>.available{
	width: 85%;
	float: left;
	font-size: .25rem;
	height: .55rem;
	line-height: .55rem;
	padding-left: .2rem;
	color: #999999;
}
.withdraw>.bankType>.available>span{
	color: red;
}
.withdraw>.avail_number{
	width: 100%;
	height: 1.2rem;
	margin-top: .2rem;
	background-color: #fff;
	position: relative;
}
.bankType>.add{
	width: .5rem;
	margin-top: .43rem;
	margin-left: .18rem;
	margin-right: .05rem;
}
.withdraw>.avail_number>input{
	width: 5rem;
	height: .45rem;
	margin-top: .35rem;
	float: left;
	border: none;
	outline: none;
	font-size: .3rem;
}
.withdraw>.avail_number>img{
	width: .85rem;
	float: left;
}
.withdraw>.avail_number>span{
	font-size: .2rem;
	color: red;
	position: absolute;
	bottom: 0rem;
	left: .75rem;
}
.withdraw>.avail_number>.myFee{
	height:.4rem;
	background-color:#EDA835;
	border-radius:3px;
	line-height:.4rem;
	padding-left:.2rem;
	padding-right:.2rem;
	color:#fff;
	font-size:.2rem;
	position: absolute;
	bottom:-.08rem;
	left:0.3rem;
}
.withdraw>.avail_number>.myFee>span{
	position: relative;
    z-index: 1;
    color:#fff;
}
.withdraw>.avail_number>.myFee:before{
	content:'';
	width:.28rem;
	height:.28rem;
	background-color:#EDA835;
	transform: rotate(45deg);
	position: absolute;
	top:-.04rem;
	left:50%;
	margin-left:-.14rem;
}
.withdraw>.avail_number>label{
	display: inline-block;
	height: 1.2rem;
	line-height: 1.2rem;
	font-size: .3rem;
	color: #eda835;
	float: right;
	margin-right: .3rem;
}
.withdraw>.tips{
	width: 100%;
	margin-top: .2rem;
	color: #666666;
	padding: 0 .3rem 0 .3rem;
}
.withdraw>.tips>h6{
	font-size: .23rem;
	height: .45rem;
	line-height: .45rem;
	font-weight: normal;
}
.withdraw>.tips>li{
	font-size: .23rem;
	line-height: .4rem;
	list-style: none;
	overflow: hidden;
}
.withdraw>.tips>li>p{
	float: left;
	width: 5%;
}
.withdraw>.tips>li>div{
	width: 95%;
	font-size: .23rem;
	float: left;
}
.withdraw>.button{
	width: 100%;
	height: .88rem;
	padding: 0 .3rem 0 .3rem;
	margin-bottom: .5rem;
	margin-top: 5.6rem;
}
/*.withdraw>.button>span{
	display: inline-block;
	width: 100%;
	height: .9rem;
	line-height: .9rem;
	font-size: .3rem;
	color: #fff;
	text-align: center;
	border-radius: .05rem;
}*/
.isSubmit{
	background-color: #eda835;
	box-shadow: 0 0;
	font-size: .34rem;
	color: #fff;
}
.noSubmit{
	background-color: #f3d59c;
	box-shadow: 0 0;
	font-size: .34rem;
	color: #fff;
}
/*短信弹框*/
.mint-popup-bottom{
	width: 100%;
	background: #fff;
}
.tanHead{
	width: 100%;
	height: .75rem;
	color: #000;
	font-size: .3rem;
	padding: .25rem 0 0 0;
}
.tanHead>img{
	position: absolute;
	width: .28rem;
	margin-left: .25rem;
}
.tanHead>p{
	height: .5rem;
	line-height: .5rem;
	text-align: center;
}
.fasongtishi{
	width: 100%;
	height: .5rem;
	line-height: .5rem;
	font-size: .23rem;
	padding-left: .3rem;
}
.fasongtishi>span:first-child{
	color: #999999;
}
.fasongtishi>span:nth-child(2){
	color: #eda835;
}
.shuru{
	width: 100%;
	height: 1rem;
	line-height: 1rem;
	padding-left: .3rem;
	padding-right: .3rem;
}
.shuru>input{
	border: none;
	width: 70%;
	height: .35rem;
	line-height: .38rem;
	outline:medium;
	font-size: .3rem;
}
.shuru>.getVerif{
	display: inline-block;
	font-size: .28rem;
	float: right;
	color: #eda835;
	line-height: .4rem;
	margin-top: .3rem;
}
.biankuang{
	width: 100px;
}
.queren{
	margin-top: .4rem;
	width: 100%;
	height: .88rem;
	text-align: center;
	margin-bottom: .4rem;
}
.answer{
	padding-left: .8rem;
	font-size: .25rem;
	color: #292929;
	height: .4rem;
	line-height: .4rem;
}
.answer2{
	height: .6rem;
	padding-left: 1rem;
	line-height: .6rem;
	font-size: .4rem;
	color: #000;
	font-weight: bold;
	margin-bottom: 2rem;
}

.withdraw_button{
	height: .88rem;
	display: inline-block;
	width: 95%;
	color: #fff;
	background-color: #f8daa1;
	box-shadow: 0 0;
	border: 0;
	font-size: .34rem;
}
.withdraw_button::after{
	background-color: #eda835;
	content: " ";
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
}
.is-default{
	background-color: #f2b643;
}
.no-default{
	background-color: #f8daa1;
}
</style>
<style type="text/css">
.mint-toast{
	z-index: 3004;
}
</style>
