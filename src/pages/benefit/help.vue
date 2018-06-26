<template>
	<div class="help">
		<head-top headTitle='生金攻略' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
		</head-top>
		<!--主要内容区域-->
		<div class="help-banner">
			<img src="../../images/benefitHelp.png">
		</div>
		<!--生金利率-->
		<div class="benifitRate">
			<h4>生金利率</h4>
			<p class="rateNum"><span style="font-size:.68rem;">{{yield || '--'}}</span><span style="font-size:.36rem;">%</span>
				<!--<span style="font-size:.24rem;">+</span>-->
				<!-- <span style="font-size:.36rem;">0.05</span><span style="font-size:.22rem;">%</span> -->
			</p>
			<li style="height:.68rem;">年化生金率为{{yield || '--'}}%</li>
			<li>每日<span style="color:#EDA835;">手动</span>收取金豆,将获得<span style="color:#EDA835;">额外</span>收益</li>
			<p class="autoGet">(若当日未手动收取,则24:00自动计入黄金账户)</p>
		</div>
		<!--生金规则-->
		<div class="benifitRule">
			<h4>生金规则</h4>
			<li style="height:.68rem;margin-top:.62rem;">利息每日发放,周末和节假日同样能享受收益</li>
			<li style="line-height:.45rem;"><span style="color:#EDA835;">复利</span>计息,即上一期的本金和利息作为下一期的本金来计算利息</li>
			<img src="../../images/rocket.png">
		</div>
		<!--交易规则-->
		<div class="tradeRule">
			<h4>交易规则</h4>
			<img src="../../images/interest.png">
			<li style="height:1.1rem;margin-top:.62rem;">交易时间:周一至周五9:00~24:00,法定节假日除外</li>
			<li>每个用户每日累计买入、卖出黄金克重上限各1000克,卖出后资金转移到现金余额账户中</li>
		</div>
		<!--手续费率-->
		<div class="fee">
			<h4>手续费率</h4>
			<section class="feeContent">
				<div>
					<img src="../../images/feeBuy.png">
					<p class="unit">买入(元/克)</p>
					<p class="price">{{buyFee ? (buyFee.toFixed(2)) : 0}}</p>
				</div>
			    <div>
			    	<img src="../../images/feeSell.png">
			    	<p class="unit">卖出(元/克)</p>
					<p class="price">{{sellFee ? (sellFee.toFixed(2)) : 0}}</p>
			    </div>
			</section>
		</div>
		<!--黄金白拿-->
		<div class="goldAward" v-if="BK || SMRZ">
			<h4>黄金白拿</h4>
			<!--有登入-->
			<section class="awardContent" v-if="token">
				<!-- <div class="eachContent">
					<p class="icon">
					<img src="../../images/inviteFriend.png" style="width:.6rem;height:.6rem;">
					<p>
					<div class="inContent">
						<p class="smallTitle">邀请好友</p>
						<p class="smallBrief">邀请好友并投资成功,我和好友各得<span style="color:#EDA835;">XX</span>mg黄金</p>
					</div>
					<span>
						<img src="../../images/right_jian.png" style="width:.13rem;height:.24rem;">
					</span>
				</div> -->
			    <div class="eachContent" @click="goToAuth" v-if="SMRZ">
			    	<p class="icon">
					<img src="../../images/realName.png" style="width:.6rem;height:.6rem;">
					<p>
					<div class="inContent">
						<p class="smallTitle">实名认证</p>
						<p class="smallBrief">实名认证成功,即可得<span style="color:#EDA835;">{{realNameWeight}}</span>g黄金</p>
					</div>
					<span v-show="!realnamed">
						<span style="font-size:.24rem;color:#666666;">未认证</span>
						<img src="../../images/right_jian.png" style="width:.13rem;height:.24rem;">
					</span>
					<span v-show="realnamed" style="font-size:.24rem;color:#666666;">
						已完成
					</span>
			    </div>
			    <div class="eachContent"  @click="bindBank" v-if="BK">
			    	<p class="icon">
					<img src="../../images/bankIcon.png" style="width:.6rem;height:.6rem;">
					<p>
					<div class="inContent">
						<p class="smallTitle">绑定银行卡</p>
						<p class="smallBrief">绑卡成功,即可得<span style="color:#EDA835;">{{BKWeight}}</span>g黄金</p>
					</div>
					<span v-show="!hasBindBank">
						<span style="font-size:.24rem;color:#666666;">未绑定</span>
						<img src="../../images/right_jian.png" style="width:.13rem;height:.24rem;">
					</span>
					<span v-show="hasBindBank" style="font-size:.24rem;color:#666666;">
						已完成
					</span>

			    </div>
			</section>
			<!--没有登入-->
			<section class="awardContent" v-if="!token">
				<!-- <div class="eachContent">
					<p class="icon">
					<img src="../../images/inviteFriend.png" style="width:.6rem;height:.6rem;">
					<p>
					<div class="inContent">
						<p class="smallTitle">邀请好友</p>
						<p class="smallBrief">邀请好友并投资成功,我和好友各得<span style="color:#EDA835;">XX</span>mg黄金</p>
					</div>
					<span>
						<img src="../../images/right_jian.png" style="width:.13rem;height:.24rem;">
					</span>
				</div> -->
			    <div class="eachContent" @click="goToAuth" v-if="SMRZ">
			    	<p class="icon">
					<img src="../../images/realName.png" style="width:.6rem;height:.6rem;">
					<p>
					<div class="inContent">
						<p class="smallTitle">实名认证</p>
						<p class="smallBrief">实名认证成功,即可得<span style="color:#EDA835;">{{realNameWeight}}</span>g黄金</p>
					</div>
					<span style="text-align: right;">
						<img src="../../images/right_jian.png" style="width:.13rem;height:.24rem;">
					</span>
			    </div>
			    <div class="eachContent"  @click="bindBank" v-if="BK">
			    	<p class="icon">
					<img src="../../images/bankIcon.png" style="width:.6rem;height:.6rem;">
					<p>
					<div class="inContent">
						<p class="smallTitle">绑定银行卡</p>
						<p class="smallBrief">绑卡成功,即可得<span style="color:#EDA835;">{{BKWeight}}</span>g黄金</p>
					</div>
					<span style="text-align: right;">
						<img src="../../images/right_jian.png" style="width:.13rem;height:.24rem;">
					</span>
			    </div>
			    
			</section>
		</div>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
	import {queryActivity,queryDemandFee,queryMyProfil,queryActivityTask} from '@/service/getData.js'
	import { mapState } from 'vuex'
	export default {
		data(){
			return {
				realnamed:false, //是否实名认证
				hasBindBank:false, //是否绑卡
				BK:false,
				SMRZ:false,
				realNameWeight:'',
				BKWeight:'',
				yield:null, //年化生金率
				buyFee:null,//活期金买入费率
				sellFee:null ,//活期金卖出费率
			}
		},
		created(){
			this.queryDemandFee();
			this.token ? this.queryActivity() : this.queryActivityTask();
			this.token ? this.queryMyProfil() : '';
		},
		mounted() {
			
		},
		computed:{
			...mapState([
					'token'
				])
		},
		methods:{
			//返回
			goBack(){
				window.toApp();
				this.$router.go(-1);
			},
			//未登入时查看用户我的任务
			async queryActivityTask(){ 
				var res=await queryActivityTask();
				if(res.code==100){
					var activitys=res.content;
					for(var i=0,len=activitys.length;i<len;i++){
						if(activitys[i].code=="BDYHK"){
							this.BK=true;
							this.BKWeight=activitys[i].awardGoldWeight;
							continue;
						}
						if(activitys[i].code=="SMRZ"){
							this.SMRZ=true;
							this.realNameWeight=activitys[i].awardGoldWeight;
						}
					}
				}
			},
			//请求活期金费率
			async queryDemandFee(){
				var res=await queryDemandFee();
				if(res.code==100){
					this.buyFee=res.content.buyFee;
					this.sellFee=res.content.sellFee;
					this.yield=res.content.rate;
				}
			},
			async queryMyProfil(){
				var res=await queryMyProfil();
				if(res.code==100){
					this.realnamed=res.content.realnamed;
				}
			},
		    //查询用户参与的活动
			async queryActivity(){
				var res=await queryActivity();
				if(res.code==100){
					var activitys=res.content;
					for(var i=0,len=activitys.length;i<len;i++){
						if(activitys[i].code=="BDYHK"){
							this.BK=true;
							this.BKWeight=activitys[i].awardGoldWeight;
							if(activitys[i].type==0){
								this.hasBindBank=false;
							}else{
								this.hasBindBank=true;
							}
							continue;
						}
						if(activitys[i].code=="SMRZ"){
							this.SMRZ=true;
							this.realNameWeight=activitys[i].awardGoldWeight;
							if(activitys[i].type==0){
								this.realnamed=false;
							}else{
								this.realnamed=true;
							}
						}
					}
				}
			},
			bindBank(){
				if(!this.token){
					this.$router.push('/loginIn');
					return;
				}
				if(this.token && !this.hasBindBank){
					if(!this.realnamed){
						this.$router.push('/personHomepage/authentication');
						return;
					}
					if(this.realnamed){
						this.$router.push('/personHomepage/bindBank');
					}
				}
			},
			goToAuth(){
				if(!this.token){
					this.$router.push('/loginIn');
					return;
				}
				if(this.token && !this.realnamed){
					this.$router.push('/personHomepage/authentication');
				}
			}
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
	*{
	   	margin: 0;
	   	padding: 0;
		box-sizing: border-box;
		font-family:PingFang-SC-Regular;
	}
   .help{
   	  padding-top:.88rem;
   	  background-color: #F5F5F5;
   	  letter-spacing:1px;
   }
   .help-banner img{
   	  width:100%;
   	  height:5.36rem;
   	  display: block;
   }
   .help .benifitRate{
   	  height:4.9rem;
   	  padding-top:.5rem;
   	  background-color: #fff;
   }
   .help .benifitRate h4,.help .benifitRule h4,.help .tradeRule h4,.help .fee h4,.help .goldAward h4{
	  font-size:.34rem;
	  color:#000000;
	  text-align: center;
	  font-weight: bold;
	  position: relative;
   }
   .help .benifitRule,.help .tradeRule,.help .fee,.help .goldAward{
   	  height:7.18rem;
   	  padding-top:.7rem;
   	  background-color: #fff;
   	  margin-top:.22rem;
   }
   .help .tradeRule{
   	  height:9.32rem;
   }
   .help .fee{
   	  height:4.52rem;
   }
   .help .goldAward{
   	  height:7.2rem;
   }
   .goldAward .awardContent{
   	 margin-top:.7rem;
   }
   .goldAward .awardContent .eachContent{
   	  width:6.9rem;
   	  height:1.42rem;
   	  background-color:#F8F8F8;
   	  padding-right:.2rem;
   	  margin:0 auto;
   	  margin-bottom:.2rem;
   	  display: flex;
   	  display: -webkit-flex;
   	  display: -moz-flex;
   	  display: -ms-flex;
   	  display: -o-flex;
   }
   .awardContent .eachContent .icon{
   	  flex:1;
   	  -webkit-flex:1;
   	  -moz-flex:1;
   	  -ms-flex:1;
   	  -o-flex:1;
   	  text-align: center;
   	  padding-top:.4rem;
   }
   .awardContent .eachContent .inContent{
   	   flex:4;
   	   -webkit-flex:4;
   	  -moz-flex:4;
   	  -ms-flex:4;
   	  -o-flex:4;
   	  padding-top:.36rem;
   }
   .awardContent .eachContent span{
   	  flex:1;
   	  -webkit-flex:1;
   	  -moz-flex:1;
   	  -ms-flex:1;
   	  -o-flex:1;
   	  padding-top:.58rem;
   	  /*line-height:1.4rem;*/
   	  text-align: center;
   }
   .eachContent .inContent .smallTitle{
	 font-size:.3rem;
	 color:#333333;
	 height:.5rem;
   }
   .eachContent .inContent .smallBrief{
	 font-size:.24rem;
	 color:#666666;
   }
   .help .fee .feeContent{
   	  display: flex;
   	  display: -webkit-flex;
   	  display: -moz-flex;
   	  display: -ms-flex;
   	  display: -o-flex;
   	  margin-top:.7rem;
   }
   .help .fee .feeContent div{
   	  flex:1;
   	  -webkit-flex:1;
   	  -moz-flex:1;
   	  -ms-flex:1;
   	  -o-flex:1;
   	  text-align: center;
   }
   .help .fee .feeContent img{
   	  width:1.62rem;
   	  height:.89rem;
   }
   .fee .feeContent .unit{
   	  padding-top:.14rem;
   	  font-size:.3rem;
   	  color:#333333;
   }
   .fee .feeContent .price{
   	  padding-top:.16rem;
   	  font-size:.34rem;
   	  color:#EDA835;
   	  font-weight: bold;
   }
   .help .tradeRule img{
   	  width:6.3rem;
   	  height:4.4rem;
   	  display: block;
   	  margin:0 auto;
   	  margin-top:.7rem;
   }
   .help .benifitRule img{
   	  width:6.3rem;
   	  height:2.88rem;
   	  display: block;
   	  margin: 0 auto;
   	  margin-top:.46rem;
   }
   .help .benifitRate h4:before,.help .benifitRate h4:after,.help .benifitRule h4:before,.help .benifitRule h4:after,.help .tradeRule h4:before,.help .tradeRule h4:after,.help .fee h4:before,.help .fee h4:after,.help .goldAward h4:before,.help .goldAward h4:after{
   	  content:'';
   	  width:.81rem;
   	  height:.03rem;
   	  position: absolute;
   	  background-size: 100%;
   	  top:0.24rem;
   }
   .help .benifitRate h4:before,.help .benifitRule h4:before,.help .tradeRule h4:before,.help .fee h4:before,.help .goldAward h4:before{
   	 background-image: url(../../images/gradientLeft.png);
   	 left:1.96rem;
   }
   .help .benifitRate h4:after,.help .benifitRule h4:after,.help .tradeRule h4:after,.help .fee h4:after,.help .goldAward h4:after{
   	 background-image: url(../../images/gradientRight.png);
   	 right:1.96rem;
   }
   .help .benifitRate .rateNum{
   	 text-align: center;
   	 height:1.88rem;
   	 line-height: 1.88rem;
   	 color:#EDA835;
   }
   .benifitRate .rateNum span{
   	 font-weight: bold;
   }
   .help .benifitRate li,.help .benifitRule li,.help .tradeRule li{
   	 font-size:.3rem;
   	 color:#333333;
   	 padding-left:.6rem;
   	 position: relative;
   }   	  
	.help .benifitRule li,.help .tradeRule li{
	  padding-right:.3rem;
	}
	.help .tradeRule li{
	  line-height:.45rem;
	}
   .help .benifitRate li:before,.help .benifitRule li:before,.help .tradeRule li:before{
   	 content:'';
   	 width:5px;
   	 height:5px;
   	 background-color:#F2B643;
   	 position: absolute;
   	 border-radius: 50%;
	 -webkit-border-radius: 50%;
	 -moz-border-radius: 50%;
	 -o-border-radius: 50%;
   	 top:0.14rem;
   	 left:0.32rem;
   }
   .help .benifitRate .autoGet{
   	 font-size:.24rem;
   	 color:#666666;
   	 padding-left:.6rem;
   	 padding-top:.12rem;
   }
</style>