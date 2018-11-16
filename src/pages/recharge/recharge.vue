<template>
	<div class="recharge">
		<head-top headTitle='充值'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack()">
		</head-top>
		<label @click="goto" v-if="isHasBank" class="bankType" style="margin-top: .88rem;">
			<img :src="addBank" class="add">
			<p class="bankName" style="height: 1.4rem;line-height: 1.4rem;margin-top: 0"><span>添加银行卡</span></p>
		</label>
		<label v-else class="bankType" style="margin-top: .88rem;">
			<img :src="bankImgUrl">
			<p class="bankName"><span>{{bankName}}</span>(尾号<span>{{fourNum}}</span>)</p>
			<p class="available" v-show="!zanTing"><span>单笔最高</span><span>{{eachMaxMoneyTran}}</span>，<span>单日最高</span><span>{{eachDayMaxMoneyTran}}</span></p>
			<p class="available" v-show="zanTing" style="color:red"><span>暂不支持该银行卡，请联系客服！</span></p>
		</label>
		<div class="avail_number">
			<img :src="RMBimg">
			<input type="number" placeholder="请输入充值金额" v-model="RMB">
			<span v-show="exceed">{{toast}}</span>
			<span v-show='hasfee' class="myFee"><span>手续费：{{fee}}元</span></span>
		</div>
		<div class="button">
			<mt-button type="default" size="large" :class="is&&!zanTing?'isSubmit':'noSubmit'" @click="confirm">立即充值</mt-button>
		</div>
		<mt-popup v-model="popupVisible" position="bottom" :closeOnClickModal="false">
			<section v-if="first">
				<div class="tanHead">
					<img :src="blackClose" @click="close">
					<p>输入短信验证码</p>
				</div>
				<p class="fasongtishi"><span>已发送至手机号<span>{{boundTel}}</span>，</span><span @click="question">收不到验证码？</span></p>
				<div class="shuru">
					<input id="auto" type="number" name="" placeholder="请输入短信验证码" pattern="[0-9]*" maxlength="6" v-model="yanzhengma">
					<span class="getVerif" @click="getVerif" ref="send_smscode">获取验证码</span>
					<span class="biankuang"></span>
				</div>
				<div class="queren" @click="confirm_pay">
					<mt-button type="default" size="large" class="recharge_button" :class="querenyanse?'is-default':'no-default'">确认支付</mt-button>
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
				<p class="answer answer2">400-650-6932</p>
			</section>
		</mt-popup>
	</div>
</template>
<script type="text/javascript">
import	headTop from '@/components/header/head'
import	RMBimg from '@/images/¥.png'
import	addBank from '@/images/addBank.png'
import	blackClose from '@/images/blackClose.png'
import bankDefault from '@/images/bankDefault.png'//银行卡图标占位符

import { Popup, Toast, Button } from 'mint-ui'
import	{mapState} from 'vuex'

import { clearNoNum } from '../../config/mUtils.js'
import { queryBankCard, rechargeMax, rechargeOrderApply, rechargeOrderApplyRestart,rechargeOrderConfirm,getTradeFee } from '@/service/getData.js'

export	default{
		data(){
			return {
				 RMBimg: RMBimg,//人民币icon
			        RMB: '',//输入充值的金额
			     exceed: 0,//toast提示
			      toast: '',//toast提示内容
			         is: 0,//确认提现开关
			    addBank: addBank,//添加银行卡图标
			  isHasBank: '',//若为真，添加银行卡显示，若为假，显示用户银行卡
		   popupVisible: false,//充值验证码弹窗
			 blackClose: blackClose,
			 	   iNow: true,//状态变量,解决重复点击问题
			     second: 60,
			      timer: '',//定时器
			 yanzhengma: '',
			querenyanse: false,
			      first: true,
			   bankName: '',//银行名称
			 bankImgUrl: bankDefault,//银行图标地址
	eachDayMaxMoneyTran: '',//每日最高限额(转换)
	    eachDayMaxMoney: '',//每日最高限额(未转换，需要做比较)
	   eachMaxMoneyTran: '',//单笔最高限额(转换)
	       eachMaxMoney: '',//单笔最高限额(未转换，需要做比较)
	       	    fourNum: '',//卡号后四位尾号
	       	   prodCode: '',//产品渠道
	       eachMinMoney: '',//最低提现金额
	       	 userBankId: '',//
	       	 		 id: '',//充值订单ID
	       	   sendTime: 0,//发送次数,
	       	   boundTel: '',//银行卡绑定的手机号
                zanTing: false,//银行卡是否支持
                    fee: null, //手续费
                 hasfee: false, //有没有手续费
            sumDayMoney: null, //日累计充值
			}
		},
		mounted(){
			this.queryBankCard();
			if(this.$route.query.from=='extract'){
				this.RMB=this.$route.query.money
			}
		},
		computed: {
			...mapState([
				'userInfo'
			]),
		},
		watch: {
			RMB(val){
				// val!=''&&val!=0&&this.isHasBank==false?this.is=1:this.is=0
				this.checkInput(val);
			},
			yanzhengma(value){
				if(value.length==6 && this.sendTime>0){
					this.querenyanse=true
				}else{
					this.querenyanse=false
				}
			}
		},
		methods:{
			//返回按钮
			goBack(){
				window.toApp();
				this.$router.go(-1);
			},
			async getTradeFee(){ //计算手续费 tradeType: 0充值 1提现 prodCode:jingdong  yinlianpay  有个返回产品码的接口 返回什么就用什么 tradeMoney:金额元 小数点最多两位
				var res=await getTradeFee(this.RMB*1,this.prodCode,'0');
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
			    if(!this.zanTing){//银行卡支持
            		this.RMB = clearNoNum(val,2)
            		if(this.RMB<Number(this.eachMinMoney) && val!=''){
              			this.exceed=1;this.toast="低于最小充值金额";this.is=false;
              			return
            		}
            		if(+this.eachMaxMoney<+val && +val<=+this.eachDayMaxMoney){
             			this.exceed=1;this.toast="超出单笔最大限额";this.is=false;
              			return
            		}else if(this.eachDayMaxMoney-(+this.sumDayMoney)<+val){
              			this.exceed=1;this.toast="超出每日最大限额";this.is=false;
              			return
            		}else if(val!=''){
              			this.exceed=0;this.is=1
            		}else{
              			this.exceed=0;this.is=0
            		}
          		}
			},
			//添加银行卡跳转
			goto(){
				(this.userInfo.realnamed)?this.$router.push({path:'/personHomepage/bindBank',query:{paths:'/recharge'}}):this.$router.push({path:'/personHomepage/authentication',query:{paths:'/recharge'}})
			},
			//获取用户银行卡
            async queryBankCard(){
                const res = await queryBankCard()
                if(res.code==100){
                    if(res.content.length==0){
                        this.isHasBank = true
                    }else{
                        this.isHasBank = false
                        const bankCard = res.content[0].bankCardNo
                        this.rechargeMax(bankCard)
                        this.userBankId = res.content[0].id
                        this.boundTel = res.content[0].phone
                    }
                }
            },
            //获取银行卡名称和单日单笔最高限额
            async rechargeMax(value){
            	const res = await rechargeMax(value)
            	if(res.code==100){
            	    //银行卡支持服务
                if(res.content.errcode==0){
                  this.zanTing=false
                  const content=res.content
                  this.prodCode=content.prodCode//充值渠道
                  this.bankName = content.bankName//银行卡名称
                  this.bankImgUrl = content.bankImgUrl//银行卡图标地址
                  this.fourNum = content.fourNum//银行卡号后四位
                  this.eachMaxMoney = content.eachMaxMoney//单笔最大限额（未转换比较的值）
                  this.eachDayMaxMoney = content.eachDayMaxMoney//单日最高限额（未转换比较的值）
                  this.eachMinMoney = content.eachMinMoney//最小充值金额
                  this.sumDayMoney = content.sumDayMoney//日累计充值
                  this.eachMaxMoneyTran = (~~(content.eachMaxMoney)>=10000)?(~~(content.eachMaxMoney)/10000)+'w':(~~(content.eachMaxMoney))/*转换后需要显示的值*/
                  this.eachDayMaxMoneyTran = (~~(content.eachDayMaxMoney)>=10000)?(~~(content.eachDayMaxMoney)/10000)+'w':(~~(content.eachDayMaxMoney))/*转换后需要显示的值*/
                }else{
                    //银行卡暂停服务
                  const content=res.content
                  this.zanTing=true
                  this.bankName = content.bankName//银行卡名称
                  this.bankImgUrl = content.bankImgUrl//银行卡图标地址
                  this.fourNum = content.fourNum//银行卡号后四位
                }
            	}
            },
            //确认充值
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
                if( that.iNow==true && that.second==60){
                    that.iNow = false
                    //sendTime的初始值是0，充值订单第一次提交的时候用rechargeOrderApply接口，订单第二次提交的时候用rechargeOrderApplyRestart接口
                    if(that.sendTime==0){
                    	that.sendTime++
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
	                    const res=await rechargeOrderApply(that.userBankId,that.prodCode,that.RMB)
	                    if(res.code==100){/*验证码可以正确发送*/
                    		this.id = res.content.id
	                    }else{//验证码不能正确发送
	                    	Toast({
	                    		 message: res.message,
  								position: 'middle',
  								duration: 5000
	                    	})
	                    }
                    }else{
                    	this.sendTime++
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
                    	const res=await rechargeOrderApplyRestart(that.id,that.userBankId,that.prodCode,that.RMB)
	                    if(res.code==100){
                    		this.id = res.content.id
	                    }else{//验证码不能正确发送
	                    	Toast({
	                    		 message: res.message,
  								position: 'middle',
  								duration: 5000
	                    	})

	                    }
                    }
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
            },
            //确认充值
            async confirm_pay(){
            	//验证码长度等于6,而且验证码发送次数大于0，才可点击
            	if(this.yanzhengma.length==6&&this.sendTime>0){
	            	const res = await rechargeOrderConfirm(this.id,this.yanzhengma)
	            	if(res.code==100){
	            		if(res.content.remark.split(':')[0]=='EES0027'||res.content.remark.split(':')[0]=='EES0031'||res.content.remark.split(':')[0]=='EES0032'||res.content.remark.split(':')[0]=='EES0035'||res.content.remark.split(':')[0]=='EES0038'||res.content.remark.split(':')[0]=='EES0041'){
	            			Toast({
		                    	 message: res.content.remark.split(':')[1],
	  						    position: 'bottom',
	  						    duration: 5000,
		                    })
	            			this.yanzhengma=''
	            		}else{
		            		this.$router.push({
		            			path:'rechargeResult',
		            			query:{
		            				msg:res.content
		            			}
		            		})
	            		}
	            	}else{
	            		Toast({
		                   	message: res.message,
	  					   position: 'bottom',
	  					   duration: 5000,
		                })
	            	}
            	}else{
            		// console.log("不能点击")
            	}
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
.recharge{
	width: 100%;
	height: 100vh;
	position: absolute;
	background-color: #f5f5f5;
	top: 0;
}
.recharge>.bankType{
	display: block;
	width: 100%;
	height: 1.4rem;
	padding: 0 .3rem 0 .3rem;
	background-color: #fff;
	position: relative;
}
.recharge>.bankType>img{
	width: .8rem;
	margin-top: .25rem;
	float: left;
}
.recharge>.bankType>.bankName{
	display: inline-block;
	width: 85%;
	font-size: .3rem;
	height: .55rem;
	line-height: .65rem;
	float: left;
	padding-left: .2rem;
	margin-top: .15rem;
}
.recharge>.bankType>.available{
	width: 85%;
	float: left;
	font-size: .25rem;
	height: .55rem;
	line-height: .55rem;
	padding-left: .2rem;
	color: #999999;
}
.recharge>.avail_number{
	width: 100%;
	height: 1.2rem;
	margin-top: .2rem;
	background-color: #fff;
	position: relative;
}
.recharge>.avail_number>.myFee{
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
.recharge>.avail_number>.myFee>span{
	position: relative;
    z-index: 1;
    color:#fff;
}
.recharge>.avail_number>.myFee:before{
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
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.recharge>.bankType:before{
		content: '';
		display: inline-block;
		width: 90%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
	.biankuang:before{
		content: '';
		width: 90%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2),(-o-min-device-pixel-ratio:2){
	.recharge>.bankType:before{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
	.biankuang:before{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
}
.recharge>.avail_number>input{
	width: 5rem;
	height: .45rem;
	margin-top: .35rem;
	float: left;
	border: none;
	outline: none;
	font-size: .3rem;
}
.recharge>.avail_number>img{
	width: .85rem;
	float: left;
}
.recharge>.avail_number>span{
	font-size: .2rem;
	color: red;
	position: absolute;
	bottom: 0rem;
	left: .75rem;
}
.recharge>.avail_number>label{
	height: 1.2rem;
	line-height: 1.2rem;
	font-size: .3rem;
	color: #eda835;
	float: right;
	margin-right: .3rem;
}
.recharge>.button{
	width: 100%;
	height: .88rem;
	padding: 0 .3rem 0 .3rem;
	margin-top: 7.5rem;
	margin-bottom: .5rem;
}
.isSubmit{
	background-color: #f2b643;
	box-shadow: none;
	font-size: .34rem;
	color: #fff;
	height: .88rem;
}
.isSubmit::after{
	background-color: #eda835;
	content: "";
	opacity: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	position: absolute;
}
.noSubmit{
	background-color: #f8daa1;
	box-shadow: none;
	font-size: .34rem;
	color: #fff;
	height: .88rem;
}
.recharge>.bankType>.add{
	width: .5rem;
	margin-top: .43rem;
	margin-left: .18rem;
	margin-right: .05rem;
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
.queren>span{
	display: inline-block;
	width: 90%;
	height: .88rem;
	line-height: .88rem;
	color: #fff;
	background-color: #f8daa1;
	border-radius: .05rem;
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
.recharge_button{
	height: .88rem;
	display: inline-block;
	width: 95%;
	color: #fff;
	background-color: #f8daa1;
	box-shadow: 0 0;
	border: 0;
	font-size: .34rem;
}
.recharge_button::after{
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
