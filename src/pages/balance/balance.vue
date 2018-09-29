<template>
	<div class="balance">
		<head-top headTitle='现金余额'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack()">
		</head-top>
		<p class="balance_title">&nbsp;&nbsp;我的现金(元)<img :src="eyeImg" v-on:touchstart="check"></p>
		<p class="balance_account">{{computeBalan | formatPrice}}</p>
		<!--可用现金冻结现金-->
		<section class="cash_compose">
			<div>
				<p class="componse_title">可用金额(元)</p>
				<p class="componse_amount">{{cashNoBalance | formatPrice}}</p>
			</div>
			<div>
				<p class="componse_title">挂单冻结(元)</p>
				<p class="componse_amount">{{cashFrozenBalance | formatPrice}}</p>
			</div>
		</section>
		<section class="trans_detail_entran" v-if="cashArray">
			交易明细
		</section>
		<mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" :bottomPullText="bottomPullText" ref="loadmore">
		<ul class="trans_detail_list"  v-if="cashArray">
			<li v-for="(item,index) in cashArray" :key="index">
				<p><span v-text="item.type==11?'充值':'提现'"></span><span :class="{'green':item.type==12,'red':item.type==11}" v-text="item.type==11?'+'+item.amount+'元':'-'+item.amount+'元'"></span></p>
				<div>
					<p><span>{{item.createTime | formDate}}</span>&nbsp;&nbsp;&nbsp;<span>{{item.createTime | formDateTime}}</span></p><span >{{item.status | stateType(item.type) }}</span>
				</div>
			</li>
		</ul>
		</mt-loadmore>
		<!--没有现金交易明细显示区域-->
		<div class="noList" v-if="!cashArray">
			<img src="../../images/noBean.png">
			<p>您还没有现金交易过，先充个值试试！</p>
		</div>
		<div class="racharge_withDraw">
			<mt-button type="default" class="balance_button" @click="withDraw_recharge('withdraw')">提现</mt-button>
			<mt-button type="default" class="balance_button2" @click="withDraw_recharge('recharge')">充值</mt-button>
		</div>
	</div>
</template>
<script type="text/javascript">
	import	headTop from '@/components/header/head'
	import open from '@/images/open.png'
	import close from '@/images/close.png'
	import { InfiniteScroll,Button,MessageBox } from 'mint-ui'
	import {mapState,mapMutations} from 'vuex'
	import {formatDate} from '@/config/mUtils'

	import { queryBankCard,queryMyProfil,queryCashCommonOrder,bizCloseCheck } from '@/service/getData.js'

	export	default{
		data(){
			return {
				 balanceAccount: '',
				 	  cashArray: undefined,//现金交易明细数组
				 	  isHasBank: null,
				 	  allLoaded:false,  //列表是否加载完
				          false:false,//避免页面进来时一直执行上拉加载
		         bottomPullText:'上拉加载',
				          pages:null, //总页数
				searchCondition:{  //分页属性  
				         pageNo:1,  
				         pageSize:9,
					},
					cashNoBalance:null,//可用余额
					cashFrozenBalance:null//冻结金额
			}
		},
		mounted(){
			this.token ? this.queryCashCommonOrder() : '';
			this.token ? this.queryBankCard() : '';//获取用户的银行卡信息
			this.token ? this.queryUserInfo() : '';//获取用户基本信息
		},
		watch:{
			token(){
				this.token ? this.queryCashCommonOrder() : '';
				this.token ? this.queryBankCard() : '';//获取用户的银行卡信息
				this.token ? this.queryUserInfo() : '';//获取用户基本信息
			}
		},
		computed: {
			...mapState([
                'balaEye','userInfo','token'
			]),
			eyeImg: function(){
				return (this.balaEye == 1)?open:close
			},
			computeBalan: function(){
				return (this.balaEye == 1)?this.balanceAccount:this.hide()
			},
		},
		methods:{
			...mapMutations([
                'RECORD_BALAEYE'
            ]),
			//
			goBack(){
				window.toApp();
				this.$router.push('/mine');
			},
            //获取用户基本信息
            async queryUserInfo(){
            	const res = await queryMyProfil()
            	if(res.code==100){
					this.balanceAccount = res.content.cashBalance;
					this.cashNoBalance = res.content.cashNoBalance;
					this.cashFrozenBalance = res.content.cashFrozenBalance;
            	}
            },
			//黄金余额账户的显示控制
			check: function(){
			   (this.balaEye==1)?this.eyeImg = close : this.eyeImg = open;
		       (this.balaEye==1)?this.RECORD_BALAEYE(0) : this.RECORD_BALAEYE(1);
			},
			hide: function(){
				let hideBalan = '* * * *'
				return hideBalan;
			},
			//获取用户银行卡
			async queryBankCard(){
				const res = await queryBankCard()
                if(res.code==100){
            		res.content.length==0?this.isHasBank=0:this.isHasBank=1
                }
			},
			//现金交易订单
			async queryCashCommonOrder(){
				this.searchCondition.pageNo=1;
				var res=await queryCashCommonOrder(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					//如果没有现金交易列表，this.cashArray不进行赋值
					if(res.content.list!=undefined){
						this.cashArray=res.content.list;
					}
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
			},
			async queryMoreCashCommonOrder(){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await queryCashCommonOrder(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					if(res.content.list.length){
						this.cashArray=this.cashArray.concat(res.content.list);
					}
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
			},
			loadBottom(){
				var that=this;
				setTimeout(function(){
					that.queryMoreCashCommonOrder();
					that.$refs.loadmore.onBottomLoaded();
				},800)
			},
			//点击提现
			async withDraw_recharge(value){
				if(value=='recharge'){
					this.$router.push({path:'/recharge'})
				}else if(value="withdraw"){
					var result=await bizCloseCheck(12);//先判断是否在交易时间内
					if(result.code==100){
						if(!result.content){
							MessageBox({
								title: '提示',
								message: '亲，非交易时段，无法进行交易哦~',
								confirmButtonText: '我知道了'
							});
							return;
						}
					}
					//已实名认证且绑定银行卡，跳转到提现页，已实名但没有绑卡，跳转到绑卡页
					if(this.userInfo.realnamed && this.userInfo.realnamed==1){
						this.isHasBank?(this.$router.push({path:'/withDraw'})):(this.$router.push({path:'/personHomepage/bindBank'}))
					}else{
						//未实名认证跳转到实名认证页
						this.$router.push({path:'/personHomepage/authentication'})
					}
				}
			},
		},
		filters: {
			//转化交易时间类型
			formDate(val){
				return val.split(' ')[0]
			},
			//转换交易时间类型
			formDateTime(val){
				return val.split(' ')[1]
			},
			formatPrice(val){
				if(!val) return '--'
				if(val) return val.toFixed(2)
			},
			//交易状态过滤
			stateType(val,type){
				if(type==11){
					return val==0?'处理中':(val==1?'充值成功':'充值失败')
				}else{
					if(val==0 || val==2 || val==4){
						return '处理中'
					}else if(val==1 || val==3 || val==6|| val==7){
						return '提现失败'
					}else{
						return '提现成功'
					}
				}
			}
		},
		updated(){
			if(this.allLoaded){
				var dv=document.querySelector('.hasBottom');
				if(dv){
					dv.parentNode.removeChild(dv)
				}
				var p=document.createElement('p');
				p.classList.add('hasBottom')
				p.innerHTML='已经到底了~';
				p.style.fontSize='0.24rem';
				p.style.color = '#999999';
				p.style.width='100%';
				p.style.height='0.8rem';
				p.style.lineHeight ='0.8rem';
				p.style.textAlign = 'center';
				if(this.cashArray!=undefined){
					document.querySelector('.trans_detail_list').appendChild(p)
				}
			}
		},
		components:{
			headTop: headTop
		}
	}
</script>
<style lang="less" scoped>
@import '../../style/common.less';
.balance{
	width: 100%;
	background-color: #f5f5f5;
	position: absolute;
	top: 0;
	padding-bottom:1rem;
	min-height:100vh;
}
.balance .noList{
	height:67.2vh;
	background-color: #F5F5F5;
	text-align: center;
	padding-top:1.48rem;
}
.balance .noList img{
	width:3.1rem;
	height:2.38rem;
}
.balance .noList p{
	font-size:.28rem;
	color:#666666;
	padding-top:.82rem;
}
.balance>.balance_title{
	margin-top: .88rem;
	width: 100%;
	font-size: .24rem;
	color: #999999;
	text-align: center;
	height: 1.3rem;
	line-height: 1.4rem;
	background-color: #fff;
}
.balance>.balance_title>img{
	margin-left: .2rem;
	width: .36rem;
	height: .22rem;
	vertical-align: middle;
	margin-bottom: .05rem;
}
.balance>.balance_account{
	width: 100%;
	height: 1.3rem;
	line-height: 1rem;
	background-color: #fff;
	font-size: .8rem;
	color: #eda835;
	text-align: center;
	padding: 0 .3rem 0 .3rem;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.trans_detail_list>li:before{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2),(-o-min-device-pixel-ratio:1.5){
	.trans_detail_list>li:before{
		content: '';
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
}
.balance>.myBank{
	width: 100%;
	height: 1.3rem;
	line-height: 1rem;
	padding: 0 .3rem 0 .3rem;
	background-color: #fff;
	font-size: .3rem;
	color: #000;
}
.balance>.myBank>img{
	float: right;
	width: .14rem;
	height: .27rem;
	margin-top: .4rem;
}
.balance>.trans_detail_entran{
	width: 100%;
	height: 1.1rem;
	line-height: 1.1rem;
	margin-top: .2rem;
	background-color: #fff;
	padding: 0 .3rem 0 .3rem;
	font-size: .3rem;
	color: #000;
	display: flex;
	display: -webkit-flex;
	display: -moz-flex;
	display: -o-flex;
	display: -ms-flex;
	font-weight: bold;
}
.balance>.trans_detail_entran>img{
	float: right;
	width: .14rem;
	height: .27rem;
	margin-top: .4rem;
}
.trans_detail_list{
	width: 100%;
	list-style: none;
}
.trans_detail_list>li{
	width: 100%;
	height: 1.4rem;
	padding: 0 .3rem 0 .3rem;
	background-color: #fff;
}
.trans_detail_list>li>p{
	width: 100%;
	height: .8rem;
	line-height: .8rem;
	font-size: .28rem;
}
.trans_detail_list>li>p>span:first-child{
	float: left;
	color: #000;
}
.trans_detail_list>li>p>span:nth-child(2){
	float: right;
}
.trans_detail_list>li>div{
	width: 100%;
	font-size: .25rem;
	float: left;
	color: #999999;
}
.trans_detail_list>li>div>p{
	display: inline-block;
}
.trans_detail_list>li>div>span{
	float: right;
}
.green{
	color: #5bc872;
}
.red{
	color: red;
}
.balance>.racharge_withDraw{
	width: 100%;
	height: .9rem;
	position: fixed;
	bottom: 0;
}
.cash_compose{
	background-color: #fff;
	.flex-simple;
	-webkit-content: space-around;
	-o-justify-content: space-around;
	-moz-justify-content: space-around;
	justify-content: space-around;
	text-align: center;
	.componse_title{
		font-size:0.24rem;
		color:#999999;
	}
	.componse_amount{
		font-size:0.28rem;
		color:#333333;
		padding-top:.1rem;
		padding-bottom:.28rem;
	}
}
</style>
<style type="text/css">
.balance_button{
	float: left;
	color: #ffffff;
    background-color: #f2b643;
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;	
    -o-box-shadow: none;
	border-radius: 0px;
	-webkit-border-radius: 0px;
	-moz-border-radius: 0px;
	-o-border-radius: 0px;
    width: 50%;
    height: .9rem;
    font-size: .34rem;
}
.balance_button::after {
    background-color: #eda835;
    content: " ";
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
}
.balance_button2{
	float: left;
	color: #ffffff;
    background-color: #ff6d39;
    box-shadow: none;	
    -webkit-box-shadow: none;
    -moz-box-shadow: none;	
    -o-box-shadow: none;
	border-radius: 0px;
	-webkit-border-radius: 0px;
	-moz-border-radius: 0px;
	-o-border-radius: 0px;
    width: 50%;
    height: .9rem;
    font-size: .34rem;
}
.balance_button2::after {
    background-color: #e03e05;
    content: " ";
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
}
</style>