<template>
	<div class="traDetailInfo">
		<head-top headTitle='交易详情' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.back(-1)">
		</head-top>
		<!--活期金买入详情-->
		<div class="info-content" v-if="type==1 && detailObj">
			<div class="brief-info">
				<div class="brief-info-left">
					<p class="brief-left-p1">活期金买入</p>
					<p class="brief-left-p2">{{detailObj.weight | formatWeight}}g</p>
				</div>
				<div class="brief-info-right">
					<p class="brief-right-p1">{{detailObj.status==0 ? '处理中' :(detailObj.status==1 ? '成功' : '失败')}}</p>
				</div>
			</div>
			<div class="detail-info">
				<div class="detail-info-left">
					<p>订单编号</p>
					<p>成交金价</p>
					<p>成交金额</p>
					<p v-if="detailObj.couponsPayAmount">优惠券</p>
					<p>交易日期</p>
				</div>
				<div class="detail-info-right">
					<p>{{detailObj.code || ''}}</p>
					<p>{{detailObj.price || 0}}元/克</p>
					<p>{{detailObj.amount || 0}}元</p>
					<p v-if="detailObj.couponsPayAmount">已抵扣{{detailObj.couponsPayAmount || 0}}元</p>
					<p>{{detailObj.createTime || ''}}</p>
				</div>
			</div>
		</div>	

		<!--活期金卖出详情-->
		<div class="info-content" v-if="type==2 && detailObj">
			<div class="brief-info">
				<div class="brief-info-left">
					<p class="brief-left-p1">活期金卖出</p>
					<p class="brief-left-p2">{{detailObj.weight | formatWeight}}g</p>
				</div>
				<div class="brief-info-right">
					<p class="brief-right-p1">成功</p>
				</div>
			</div>
			<div class="detail-info">
				<div class="detail-info-left">
					<p>订单编号</p>
					<p>成交金价</p>
					<p>成交金额</p>
					<p>手续费</p>
					<p>成交时间</p>
				</div>
				<div class="detail-info-right">
					<p>{{detailObj.code || ''}}</p>
					<p>{{detailObj.price || 0}}元/克</p>
					<p>{{detailObj.amount || 0}}元</p>
					<p>{{detailObj.fee || 0}}元</p>
					<p>{{detailObj.createTime || ''}}</p>
				</div>
			</div>
		</div>	

		<!--挂单买入详情-->
		<div class="info-content" v-if="type==9 && detailObj">
			<div class="brief-info">
				<div class="brief-info-left">
					<p class="brief-left-p1" v-if="type==9">活期金买入</p>
					<p class="brief-left-p2">{{detailObj.weight | formatWeight}}g</p>
				</div>
				<div class="brief-info-right">
					<p class="brief-right-p1">{{detailObj.status==0?'等待执行':(detailObj.status==1?'执行成功':(detailObj.status==2?'已到期':(detailObj.status==3?'已中止':'失败')))}}</p>
				</div>
			</div>
			<div class="detail-info">
				<div class="detail-info-left">
					<p>挂单金价</p>
					<p>{{detailObj.status==0?'挂单金额':(detailObj.status==1?'成交金额':(detailObj.status==2?'挂单金额':(detailObj.status==3?'挂单金额':'挂单金额')))}}</p>
					<p>有效期限</p>
					<p>挂单时间</p>
					<p v-if="detailObj.status==4">失败原因</p>
				</div>
				<div class="detail-info-right">
					<p>{{detailObj.acceptMaxBuyPrice || ''}}元/克</p>
					<p>{{detailObj.amount || 0}}元</p>
					<p>{{detailObj.term==1?'当天有效':'永久有效'}}</p>
					<p>{{detailObj.createTime || ''}}</p>
					<p v-if="detailObj.status==4">{{detailObj.remark || ''}}</p>
				</div>
			</div>
			<div class="cancel" v-if='detailObj.status==0'><div @click="cancelPutUp(detailObj.id)">取消挂单</div></div>
		</div>	
		<!--挂单卖出详情-->
		<div class="info-content" v-if="type==10 && detailObj">
			<div class="brief-info">
				<div class="brief-info-left">
					<p class="brief-left-p1" v-if="type==10">活期金卖出</p>
					<p class="brief-left-p2">{{detailObj.weight | formatWeight}}g</p>
				</div>
				<div class="brief-info-right">
					<p class="brief-right-p1">{{detailObj.status==0?'等待执行':(detailObj.status==1?'执行成功':(detailObj.status==2?'已到期':(detailObj.status==3?'已中止':'失败')))}}</p>
				</div>
			</div>
			<div class="detail-info">
				<div class="detail-info-left">
					<p>挂单金价</p>
					<p>{{detailObj.status==0?'挂单金额':(detailObj.status==1?'成交金额':(detailObj.status==2?'挂单金额':(detailObj.status==3?'挂单金额':'挂单金额')))}}</p>
					<p>有效期限</p>
					<p>挂单时间</p>
					<p v-if="detailObj.status==4">失败原因</p>
				</div>
				<div class="detail-info-right">
					<p>{{detailObj.acceptMinSellPrice || ''}}元/克</p>
					<p>{{detailObj.amount || 0}}元</p>
					<p>{{detailObj.term==1?'当天有效':'永久有效'}}</p>
					<p>{{detailObj.createTime || ''}}</p>
					<p v-if="detailObj.status==4">{{detailObj.remark || ''}}</p>
				</div>
			</div>
			<div class="cancel" v-if='detailObj.status==0'><div @click="cancelPutUp(detailObj.id)">取消挂单</div></div>
		</div>	
        
		<!--定投成交订单详情-->
		<div class="info-content" v-if="type==3 && detailObj">
			<div class="brief-info">
				<div class="brief-info-left">
					<p class="brief-left-p1">定投—{{detailObj.productName}}</p>
					<p class="brief-left-p2">{{detailObj.weight || detailObj.amount}}{{detailObj.weight ? 'g' : '元'}}</p>
				</div>
				<div class="brief-info-right">
					<p class="brief-right-p1">{{detailObj.status==0 ? '执行成功' :'执行失败'}}</p>
				</div>
			</div>
			<div class="detail-info">
				<div class="detail-info-left">
					<p>订单编号</p>
					<p>成交金价</p>
					<p>成交金额</p>
					<p>交易日期</p>
				</div>
				<div class="detail-info-right">
					<p>{{detailObj.orderCode || ''}}</p>
					<p>{{detailObj.price || 0}}元/克</p>
					<p>{{detailObj.price * detailObj.weight || detailObj.amount }}元</p>
					<p>{{detailObj.createTime || ''}}</p>
				</div>
			</div>
		</div>
		
		<!--定期详情-->
		<div class="info-content" v-if="type==6 && detailObj">
			<div class="brief-info">
				<div class="brief-info-left">
					<p class="brief-left-p1">定期买入-{{detailObj.fixedProductName}}</p>
					<p class="brief-left-p2">{{detailObj.weight || 0 }}g</p>
				</div>
				<div class="brief-info-right">
					<p class="brief-right-p1">{{detailObj.status==1 ? '正常' :(detailObj.status==2 ? '已赎回' : (detailObj.status==3 ? '处理中':'失败'))}}</p>
				</div>
			</div>
			<div class="detail-info">
				<div class="detail-info-left">
					<p>订单编号</p>
					<p>成交金价</p>
					<p>成交金额</p>
					<p>年化生金率</p>
					<p>预期收益</p>
					<p>持有期限</p>
					<p>起息日</p>
					<p>到期日</p>
					<p>到帐日</p>
					<!-- <p>支付方式</p> -->
					<p>优惠券</p>
					<p>交易时间</p>
				</div>
				<div class="detail-info-right">
					<p>{{detailObj.code || ''}}</p>
					<p>{{detailObj.price || 0}}元/克</p>
					<p>{{detailObj.amount || 0}}元</p>
					<p>{{detailObj.rate || 0}}%</p>
					<p>{{detailObj.expireProfit || 0}}克</p>
					<p>{{detailObj.term || 0}}天</p>
					<p>{{detailObj.profitTime || '--'}}</p>
					<p>{{detailObj.expireTime || '--'}}</p>
					<p>{{detailObj.settleTime || '--'}}</p>
					<!-- <p>黄金余额</p> -->
					<p>已抵扣{{detailObj.couponsPayAmount || 0}}元</p>
					<p>{{detailObj.createTime || '--'}}</p>
				</div>
			</div>
		</div>	
	</div>
</template>
<script>
import headTop from '../../components/header/head.vue';
import { MessageBox,Toast } from 'mint-ui'
import { updatePendingPlan, queryPendingPlanDetail, demandBuyOrderDetail, demandSellOrderDetail,queryFixedBuyOrderDetail,queryRegularRecordInfo,queryPendingRecordDetail } from '@/service/getData.js'
	export default {
		data() {
			return {
				id:'',//查询详情所用的参数
				type:null,//具体哪种业务的详情
				detailObj:null,//保存详情信息的对象
				headTitle:''//页面标题
			}
		},
		mounted() {
			this.id=this.$route.query.id;
			this.type=this.$route.query.type;
			this.stretchInfo();
		},
		filters:{
			formatWeight(val){
                if(!val) return 0;
                return (val*1).toFixed(4)
            },
            formatPrice(val){
                if(!val) return 0;
                return (val*1).toFixed(2)
            },
		},
		methods:{
           //活期金买入订单详情
           async demandBuyOrderDetail(){
           	  var res=await demandBuyOrderDetail(this.id);
           	  if(res.code==100){
           	  	 this.detailObj=res.content;
           	  }
           },
           //活期金卖出订单详情
           async demandSellOrderDetail(){
           	  var res=await demandSellOrderDetail(this.id);
           	  if(res.code==100){
           	  	 this.detailObj=res.content;
           	  }
           },
           //定期金订单详情
           async queryFixedBuyOrderDetail(){
           	  var res=await queryFixedBuyOrderDetail(this.id);
           	  if(res.code==100){
           	  	 this.detailObj=res.content;
           	  }
           },
           //定投成交订单详情
           async queryRegularRecordInfo(){
           	  var res=await queryRegularRecordInfo(this.id);
           	  if(res.code==100){
           	  	 this.detailObj=res.content;
           	  }
           },
        //    //挂单成交订单详情
        //    async queryPendingRecordDetail(){
        //    	  var res=await queryPendingRecordDetail(this.id);
        //    	  if(res.code==100){
        //    	  	 this.detailObj=res.content;
        //    	  }
		//    },
		   //挂单成交订单详情
           async queryPendingPlanDetail(){
           	  var res=await queryPendingPlanDetail(this.id);
           	  if(res.code==100){
           	  	 this.detailObj=res.content;
           	  }
           },
           //请求具体业务详情信息
           stretchInfo(){
           	  switch(this.type)
				{
				case 1:
				case '1':
				  this.headTitle="活期金买入详情";
				  this.demandBuyOrderDetail();
				  break;
				case 2:
				case '2':
				  this.headTitle="活期金卖出详情";
				  this.demandSellOrderDetail();
				  break;
				case 9:
				case '9':
				  this.headTitle="挂单买入详情";
				//   this.queryPendingRecordDetail();
				  this.queryPendingPlanDetail();
				
				  break;
				case 10:
				case '10':
				  this.headTitle="挂单卖出详情";
				//   this.queryPendingRecordDetail();
				  this.queryPendingPlanDetail();
				  break;
				case 3:
				case '3':
				  this.headTitle="定投详情";
				  this.queryRegularRecordInfo();
				  break;
				case 6:
				case '6':
				  this.headTitle="定期详情";
				  this.queryFixedBuyOrderDetail();
				  break;
				default:
				}
		   	},
		   	//点击取消挂单
		   	cancelPutUp(val){
				var that = this
				MessageBox.confirm('确定取消挂单吗？').then(action => {
					const res = updatePendingPlan(val);
					const promise = new Promise(function (resolve, reject) {
						return resolve(res);
					})
					promise.then(function(res){
						if(res.code==100){
							that.queryPendingPlanDetail();//重新请求详情刷新页面
							Toast('挂单取消成功')
						}else{
							Toast(res.message)
						}
					})

				}).catch(action => {
					   	console.log(2)
				});
		   }
		},
		components: {
			headTop,
		}
	}
</script>
<style scoped>
   	.traDetailInfo{
   		background-color:#fff;
   	  	height:100vh;
   	}
   	.traDetailInfo .info-content{
   	 	 padding-top:.88rem;
   	}
   	.traDetailInfo .info-content .brief-info{
   	  	height:1.88rem;
   	  	padding:.4rem .3rem 0;
   	  	background-color:#fff;
      	display: -webkit-flex;
      	display: -moz-flex;
	  	display: -o-flex;
	  	display: flex;
   }
   	.info-content .brief-info .brief-info-left{
   	  	-webkit-flex:6;
   	  	-moz-flex:6;
		-o-flex:6;
		flex:6;
   	  	text-align:left;
   	}
   .brief-info .brief-info-left .brief-left-p1{
   	  	font-size:.28rem;
   		color:#333333;
   	  	height:.6rem;
   }
   .brief-info .brief-info-left .brief-left-p2{
   	  	font-size:.5rem;
		color:#EDA835;
		font-weight:600;
   }
   .info-content .brief-info .brief-info-right{
   	  	-webkit-flex:1.2;
   	  	-moz-flex:1.,2;
		-o-flex:1.2;
		flex:1.2;
   	  	text-align:right;
   }
   .brief-info .brief-info-right .brief-right-p1{
   	  	font-size:.24rem;
   	  	color:#EDA835;
   }
   .info-content .detail-info{
   	  	padding:.42rem .3rem 0;
   	  	background-color: #ffffff;
      	display: -webkit-flex;
      	display: -moz-flex;
	  	display: -o-flex;
	  	display: flex;
   }
   .info-content .detail-info p{
   	  	height:.78rem;
   }
   .info-content .detail-info .detail-info-left{
   	  	-webkit-flex:1;
   	  	-moz-flex:1;
		-o-flex:1;
		flex:1;
   	  	text-align:left;
   	  	font-size:.28rem;
   	  	color:#666666;
   }
   .info-content .detail-info .detail-info-right{
   	  	-webkit-flex:2;
   	  	-moz-flex:2;
		-o-flex:2;
		flex:2;
   	  	text-align:right;
   	  	font-size:.28rem;
   	  	color:#333333;
   }
   .cancel{
    width: 100%;
    height: .88rem;
	line-height: .88rem;
	text-align: center;
    color: #fff;
    font-size: .34rem;
    position: absolute;
	bottom: .35rem;
	}
	.cancel>div{
		display: inline-block;
    	width: 92%;
    	background-color: #F2B643;
    	height: .88rem;
    	color: #fff;
    	font-size: .34rem;
		border-radius: 5px;
	}
</style>

