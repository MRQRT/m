<template>
	<div class="mine" id="mine">
		<head-top id="head-top">
			<div slot="head_goback" class="head_goback">
				<img slot='message' src='../../images/message.png' class="message" @click="goToMess">
				<span slot='mes_num' class="mes_num" v-show="hasUnread"></span>
			</div>
			<!-- <img slot="custom" src="../../images/setting.png" class="setting"> -->
		</head-top>
		<div class="mine_head">
			<div class="profile">
				<router-link :to="login?'/personHomepage':'/loginIn'" tag="div">
					<img class="headImg" :src="userInfo?(userInfo.avatar?userInfo.avatar:headImg):NOloginH">
					<p class="user_name" :class="{'nologin':login==0,'login':login==1}">{{userInfo?(userInfo.name?userInfo.name:'已登录'):'登录 / 注册' }}</p>
					<p class="user_tel" v-show="login">{{ userInfo?userInfo.userName:''}} <img :src="right_jian"></p>
					<p class="user_ident" v-show="login"><span>{{userInfo?(userInfo.realnamed?'已实名':'未实名认证'):"" }}</span></p>
				</router-link>
			</div>
		</div>
		<div class="account_remain">
			<div class="account" v-if="token">
				<router-link to="/myGold" tag="span">我的黄金(克)</router-link> <span @click="$router.push({'path':'/myGold'})">{{computeGram}}</span><img :src="eyeImg" v-on:touchstart="check">
			</div>
			<div class="remain" v-if="token">
				<router-link to='/balance' tag='span'>账户余额(元)</router-link> <span @click="$router.push({'path':'/balance'})">{{computeGemain}}</span>
				<router-link to='/recharge' tag="section" class="recharge">去充值</router-link>
			</div>
			<!--我的积分-->
			<div class="integral" @click="$router.push('/jiFen')">
				<p class="my_jifen">我的鲸鱼分</p>
				<p class="jifen_amount">{{integralAmount}}</p>
				<p class="link_img">
					<img :src="right_jian">
				</p>
			</div>
		</div>
		
		<div class="fixed_invested mine_content" id="dingtou">
			<p class="fixed_invested_content mine_content_p" @click="togo('investment')">
				<img :src="fixed_inves">
				<span>定投</span>
				<img :src="right_jian">
			</p>
		</div>
		<div class="mine_content" style="margin-top: 0;">
			<p class="mine_content_p" @click="togo('stor')">	
				<img :src="storeG_2">
				<span>回购</span>
				<img :src="right_jian">
			</p>
		</div>
		<div class="mine_content" style="margin-top: 0;">
			<p class="mine_content_p" @click="togo('extract')">
				<img :src="growG_2">
				<span>提金</span>
				<img :src="right_jian">
			</p>
		</div>
		<div class="mine_content"  style="margin-top: 0.18rem">
			<p class="mine_content_p"  @click="togo('bankCard')">
				<img :src="bank">
				<span>银行卡</span>
				<img :src="right_jian" style="width:.15rem;height:.3rem;float:right;">
				<span class="isbind" :class="{'isbindcolor':isbind=='绑卡送3mg黄金'}" style="float:right;padding-right:.25rem;">{{isbind}}</span>
			</p>
		</div>
		<div class="mine_content" style="margin-top: 0">
			<p class="mine_content_p" @click="togo('coupon')">
				<img :src="coupon">
				<span>优惠券</span>
				<img :src="right_jian">
			</p>
		</div>
		<div class="mine_content" style="margin-top:0;display: none;">
			<p class="mine_content_p" @click="togo('goldCard')">  		
				<img :src="coupon">
				<span>取金卡</span>
				<img :src="right_jian">
			</p>
		</div>
		<div class="mine_content" style="margin-top: 0">
			<router-link to="/commonProblem" class="mine_content_p" tag="p">
				<img :src="help">
				<span>常见问题</span>
				<img :src="right_jian">
			</router-link>
		</div>
		<div class="mine_content" style="margin-top: 0;">
			<router-link to="/myAbout" tag="p" class="mine_content_p" style="border-bottom:none">
				<img :src="about_2">
				<span>关于</span>
				<img :src="right_jian">
			</router-link>
		</div>
	</div>
</template>
<script>
import foot from '../../components/footer/footGuid.vue'
import {mapState,mapMutations} from 'vuex'
import headTop from '../../components/header/head.vue'
import {getCookie} from '@/config/mUtils'
import { queryMyProfil,queryMessagUnreadCount,queryIntegralBalance,queryBankCard } from '@/service/getData.js'


import open from '@/images/open.png'
import close from '@/images/close.png'

import defaults from '@/images/defaults.png'
import NOloginH from '@/images/NOloginH.png'

import fixed_inves from '@/images/fixed_inves.png'
import growG_2 from '@/images/growG_2.png'
import storeG_2 from '@/images/storeG_2.png'
import right_jian from '@/images/right_jian.png'
import help from '@/images/help.png'
import about from '@/images/about.png'
import about_2 from '@/images/about_2.png'
import coupon from '@/images/coupon.png'
import bank from '@/images/bank.png'


	export default {
		data (){
			return{
			  NOloginH: NOloginH,//未登录头像
			   headImg: defaults,//图标
		   fixed_inves: fixed_inves,//图标
			   growG_2: growG_2,//图标
			  storeG_2: storeG_2,//图标
			right_jian: right_jian,//箭头图标
				  help: help,//帮助图标
				 about: about,//关于我们图标
			   about_2: about_2,//关于我们图标        
				  bank: bank,//银行卡图标
				coupon: coupon,//优惠券图标
			   userTel: null,//用户手机号
				 login: null,//登录标记
			 realnamed: null,//是否实名
			 hasUnread: false,//有没有未读的消息
		  clientHeight: document.documentElement.clientHeight,//
		  integralAmount:null,//积分持有量
		       hasBank: false,//是否有银行卡
			}
		},
		created(){
			if(this.token){
				this.login = 1
			}else{
				this.login = 0
			}
		},
		beforeMount:function(){
		},
		mounted() {
			//页面的最低高度为屏幕的高度
			const mine = document.getElementById('mine');
			mine.style.minHeight = this.clientHeight+'px';

			this.token ? this.queryMessagUnreadCount() :'';
		//监听滚动条事件
			window.onscroll = function(){ 
				var t = document.documentElement.scrollTop || document.body.scrollTop; 
			} 
			this.login?this.userInforma():this.headImg=NOloginH
			this.token ? this.queryIntegralBalance() : this.integralAmount=0
			this.token?this.queryBankCard():this.hasBank=false
		},
		computed: {
			...mapState([
				'eye','token','userInfo'
			]),
			eyeImg: function(){
				return (this.eye == 1)?open:close
			},
			/*我的黄金*/
			computeGram: function(){
				if(this.userInfo){
					return (this.eye == 1)?this.userInfo.goldBalance.toFixed(4) : this.hide();
				}else{
					return ''
				}
			},
			/*账户余额*/
			computeGemain: function(){
				if(this.userInfo){
					return this.userInfo.cashBalance.toFixed(2)
				}else{
					return ''
				}
			},
			//是否绑卡
			isbind(){
				if(this.token){
					if(this.hasBank){
						return '已绑定'
					}else{
						return '绑卡送3mg黄金'
					}
				}else{
					return ''
				}
			}
		},
		methods:{
			...mapMutations([
				'RECORD_EYE','RECORD_USERINFO','CLEAR_TOKEN','CLEAR_USERINFO'
			]),
			//查询用户总积分
			async queryIntegralBalance(){
				var res=await queryIntegralBalance()
				if(res.code==100){
					if(res.content && res.content.integralBalance){
                        this.integralAmount=res.content.integralBalance
                    }else{
                        this.integralAmount=0
                    }
				}
			},
			//请求消息
			async queryMessagUnreadCount(){
				var res=await queryMessagUnreadCount();
				if(res.code==100){
					if(res.content.count){
						this.hasUnread=true;
					}else{
						this.hasUnread=false;
					}
				}
    	    },
			//黄金余额账户的显示控制
			check: function(){
			   (this.eye==1)?this.eyeImg = close : this.eyeImg = open;
			   (this.eye==1)?this.RECORD_EYE(0) : this.RECORD_EYE(1);
			},
			hide: function(){
				return "****";
			},
			goToMess(){
				this.$router.push({
					path:'/messCenter'
				})
			},
			//获取用户信息
			async userInforma(){
				const res = await queryMyProfil()
				if (res.code == 401) {
					this.CLEAR_TOKEN()
        			this.CLEAR_USERINFO()
        			this.login=0
        		}else if(res.code==100){
					this.RECORD_USERINFO(res.content)
					this.login=1
				}
			},
			//获取用户银行卡
            async queryBankCard(){
                const res = await queryBankCard()
                if(res.code==100){
                    if(res.content.length==0){
                        this.hasBank = false//没有银行卡
                    }else{
                        this.hasBank = true//有银行卡
                    }
                }
            },
			togo(val){
				if(val=='investment'){
					if(this.login){
						//再做判断，用户是否有定投计划（有：跳转定投计划  没有：跳转定投列表）
						this.$router.push('/investmentOrder')
					}else{
						//用户未登录，直接进定投列表
						this.$router.push('/buyInvestment')
					}
				}else if(val=='stor'){
					if(this.login){
						this.$router.push('/storOrder')
					}else{
						//用户未登录，跳转至存金页
						this.$router.push('/stor')
					}
				}else if(val=='extract'){
					if(this.login){
						this.$router.push('/myExtractOrder')
					}else{
						this.$router.push('/extractGoldList')
					}
				}else if(val=='bankCard'){
					if(this.login){
						this.$router.push('/myBank')
					}else{
						this.$router.push('/loginIn')
					}
				}else if(val=='coupon'){
					if(this.login){
						this.$router.push('/myCoupon')
					}else{
						this.$router.push('/loginIn')
					}
				}else if(val=='goldCard'){
					if(this.login){
						this.$router.push('/receiveCard')
					}
				}
			},
		},
		components:{
			foot,
			headTop
		},
	}
</script>
<style type="text/css" scoped>
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family:PingFang-SC-Regular;
}
.mine{
	background-color: #f5f5f5;
	position: relative;
	padding-bottom: 1.2rem;
}
#head-top{
	position: fixed;
	top: 0;
	height: .88rem;
	width: 100%;
	background-color: #fab100;
	z-index: 100;
	padding: .18rem .3rem 0 .34rem;
}
#head-top>.head_goback{
	width: .6rem;
	height: .6rem;
	float: left;
}
#head-top>.head_goback>.message{
	width: .6rem;
	height: .6rem;
}
#head-top>.head_goback>.mes_num{
	display: inline-block;
	color: #fff;
	font-size: .2rem;
	width: 11px;
	height: 11px;
	line-height: .3rem;
	text-align: center;
	border-radius: 50%;
	-webkit-border-radius: 50%;
	-moz-border-radius: 50%;
	-o-border-radius: 50%;
	background-color: #ff6d39;
	position: absolute;
	top: 0;
	right: 0;
}
#head-top>.setting{
	width: .6rem;
	float: right;
}
.mine_head{
	width: 100%;
	height: 2.38rem;
	background-color: #f8b100;
	position: relative;
}
.mine_head .profile{
	position: absolute;
	width: 100%;
	height: 2.5rem;
	display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -o-flex;
	justify-content: center;
	-webkit-justify-content:center;
    -moz-justify-content:center;
    -o-justify-content:center;
	top: 1.1rem;
}
.mine_head .profile>div{
	width: 94%;
	height: 2.4rem;
	background-color: #fff;
	box-shadow: 0px 10px 15px #f6f6f6;
	-webkit-box-shadow: 0px 10px 15px #f6f6f6;
	-moz-box-shadow: 0px 10px 15px #f6f6f6;
	-o-box-shadow: 0px 10px 15px #f6f6f6;
	padding: .5rem .27rem 0 .5rem;
}
.headImg{
	width: 1.4rem;
	height: 1.4rem;
	border-radius: 50%;
	-webkit-border-radius: 50%;
	-moz-border-radius: 50%;
	-o-border-radius: 50%;
	float: left;
}
.profile .user_name{
	padding-left: 1.6rem;
	font-weight: bold;
	font-size: .30rem;
}
.profile .user_tel{
	padding-left: 1.6rem;
	font-size: .28rem;
	margin-top: .05rem;
	color: #686868;
}
.profile .user_tel>img{
	width: .16rem;
	float: right;
}
.profile .user_ident{
	padding-left: 1.6rem;
	height: .5rem;
	margin-top: .06rem;
	color: #fff;
}
.profile .user_ident span{
	display: inline-block;
	height: .35rem;
	line-height: .37rem;
	border-radius: .3rem;
	background-color: #cccccc;
	font-size: .22rem;
	text-align: center;
	padding: 0 .18rem 0 .18rem;
}
.account_remain{
	width: 100%;
	/*height: 3.6rem;*/
	background-color: #fff;
	padding: 1.2rem .5rem 0 .5rem;
	margin-bottom: .18rem;
}
.account,.remain{
	width: 100%;
	height: 1.2rem;
	font-size: .30rem;
	color: #000;
}
.account>span:nth-child(1){
	float: left;
	height: 1.2rem;
	line-height: 1.2rem;
	margin-right: .15rem;
}
.account>span:nth-child(2){
	float: left;
	height: 1.2rem;
	line-height: 1.2rem;
	color: #eda835;
	font-size: .33rem;
}
.remain>span:nth-child(1){
	float: left;
	height: 1.2rem;
	line-height: 1.2rem;
	margin-right: .15rem;
}
.remain>span:nth-child(2){
	float: left;
	height: 1.2rem;
	line-height: 1.2rem;
	color: #eda835;
	font-size: .33rem;
}
.account>img{
	float: right;
	width: 7%;
	margin-top: .5rem;
}
.account_remain .recharge{
	display: inline-block;
	float: right;
	font-size: .25rem;
	color: #f2b643;
	background-color: #fff;
	width: 1rem;
	height: .6rem;
	line-height: .6rem;
	text-align: right;
	border-radius: .05rem;
	margin-top: .3rem;
}
.mine_content{
	width: 100%;
	height: 1.1rem;
	padding: 0 .45rem 0 .45rem;
	background-color: #fff;
}
.mine_content_p{
	width: 100%;
	height: 1.1rem;
	padding-top: 0.4rem;
	font-size: .27rem;
}
.mine_content_p>img:first-child{
	float: left;
	width: .38rem;
	height: .36rem;
	margin-right: .3rem;
	margin-top:1px;
}
.mine_content_p>span:nth-child(2){
	float: left;
}
.mine_content_p>img:nth-child(3){
	width: .15rem;
	height: .3rem;
	float: right;
}
.nologin{
	margin-top: .5rem;
}
.login{
	margin-top: .1rem;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.account:after{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
	.mine_content_p:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
	}
	.remain:after{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2),(-o-min-device-pixel-ratio:1.5){
	.account:after{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
	.mine_content_p:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		margin-top: .32rem;
	}
	.remain:after{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
}
/*积分*/
.integral{
	width:100%;
	height:1.2rem;
	display: flex;
	line-height:1.2rem;
}
.integral .my_jifen{
	font-size: .30rem;
    color: #000;
    flex:1.3;
}
.integral .jifen_amount{
	font-size: .34rem;
    color: #EDA835;
    flex:3;
}
.integral .link_img{
    flex:.8;
    text-align: right;
}
.integral .link_img img{
	width: .15rem;
    height: .3rem;
}
.isbind{
	color:#cccccc;
}
.isbindcolor{
	color:#EDA835;
}
</style>