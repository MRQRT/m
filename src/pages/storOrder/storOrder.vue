<template>
	<div class="storOrder">
		<head-top headTitle='我的订单' class="head-top" ref="topHead">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goback">
			<p slot="custom" class="inTo_myGold" @click="goToMyGold">我的黄金</p>
		</head-top>
		<mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false"  ref="loadmore" class="loadmore orderInfo" v-if="hasStor">
			<div class="all_order" v-if="storList.length">
				<section v-for="(item,index) in storList" class="order_container" @click="order_det(item)" :key="index">
					<img :src="item.imageUrl">
					<div class="order_desc">
						<p class="order_p1">
							<span class="order_p1_span1">订单编号&nbsp;:&nbsp;&nbsp;{{item.code}}</span>
							<span class="order_p1_span2">{{item.status==0?'审核中':(item.status==1?'已取消':(item.status==2?'审核中':(item.status==3?'物流中':(item.status==4?'检验中':(item.status==5?'已取消':(item.status==6?'待确认':(item.status==8?'已完成':(item.status==9?'已取消':(item.status==10?'已取消':(item.status==11?'物流中':'已取消'))))))))))}}</span>
						</p>
						<p class="order_p2">
							<span class="order_p2_span1">{{item.productName}}</span>
						</p>
						<p class="order_p3">
							<span class="order_p3_span1">克重&nbsp;:&nbsp;&nbsp;{{item.realNetWeight || item.realGrossWeight || item.applyWeight}}克</span>
							<span class="order_p3_span2">{{item.createTime | formatTime}}</span>
						</p>
					</div>
				</section>
			</div>
		</mt-loadmore>
	    <!--没有订单时-->
    	<div v-if="!hasStor || !token" class="noStorOrder">
      		<img src="../../images/noStor.png">
      		<p>您还没有相关的订单，可以去看看有哪些黄金想卖！</p>
			<my-button @click.native="$router.push('/stor')" class="tostore_btn" buttonText="立即存金" style="margin-top:.42rem;">
			</my-button>
    	</div>
		<my-button  @click.native="$router.push('/stor')"  v-if="hasStor && token" class="storGoldBtn" buttonText="我要存金"></my-button>
	</div>
</template>
<script type="text/javascript">
import headTop from '@/components/header/head.vue'
import {queryRecycleOrder} from '@/service/getData.js'
import { Indicator,Toast } from 'mint-ui';
import {mapState} from 'vuex'
import myButton from '@/components/myButton/myButton.vue'
export default{
	data(){
		return {
	        pageParmas: {
                pageNum: 1,
               pageSize: 6,
            },//加载数据的页数和每页请求的数量
            storList: [],//存放存金订单的数组
            hasStor: true,//false表示没有订单，true表示有订单
            allLoaded:false,
            false:false,
            pages:null//一共几页
		}
	},
	mounted(){
		this.token ? window.sendUserId(this.token.split('_')[0],this.token.split('_')[1]) : window.sendUserId('')
		this.token ? this.queryRecycleOrder() : ''
	},
	components:{
		headTop,
		myButton
	},
	computed:{
       ...mapState([
       	  'token'
       	])
    },
	filters:{
		formatTime(val){
			if(!val) return;
			var arrTime=val.split(':')
			return arrTime.splice(0,arrTime.length-1).join(':')
		}
	},
	watch:{
		token(){
			this.token ? window.sendUserId(this.token.split('_')[0],this.token.split('_')[1]) : window.sendUserId('')
			this.token ? this.queryRecycleOrder() : ''
		}
	},
	methods:{
		async queryRecycleOrder(){
			Indicator.open({
				text: '加载中...',
				spinnerType: 'fading-circle'
			});
			this.pageParmas.pageNum=1;
			var res=await queryRecycleOrder(1,this.pageParmas.pageSize)
			if(res.code==100){
				Indicator.close();
				if(res.content.list && res.content.list.length){
					this.storList=res.content.list
					this.hasStor=true
					this.pages=res.content.pages
				}else{
					this.hasStor=false
				}
			}else{
				Indicator.close();
				Toast({
					message: res.message,
					position: 'bottom',
					duration: 3000
				});
			}
		},
		//加载更多
		async loadMore(){
			this.pageParmas.pageNum+=1;
			const res = await queryRecycleOrder(this.pageParmas.pageNum,this.pageParmas.pageSize);
			if(res.code==100){
				if(res.content.list && res.content.list.length){
					this.storList=this.storList.concat(res.content.list)
				}
				if(this.pageParmas.pageNum>=this.pages){
                   this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
                }
			}
		},
		loadBottom(){
			var that = this;
            setTimeout(function(){
                that.loadMore();
                that.$refs.loadmore.onBottomLoaded();
            },800)
		},
		//返回上一页
		goback(){
			window.toApp();
			if(this.$route.query&&this.$route.query.from=='storResult'){
				this.$router.push('/mine');
			}
			this.$router.push('/mine');
		},
		//点击‘我的黄金’需要判断3种情况（app、微信、其他情况）
		goToMyGold(){
			var ua = navigator.userAgent.toLowerCase();
			var isWeixin = ua.indexOf('micromessenger') != -1;
			var href=window.location.href.split('//')[1]
			if(localStorage.getItem('isWebview')=='andriod' || localStorage.getItem('isWebview')=='ios'){
				this.$router.push('/myGold')
			}else if(isWeixin){ //判断是在微信浏览器还是公众号里
				var where_page=href.split('.')[0]
				if(where_page=='m'){ //是在公众号内部
					this.$router.push('/myGold')
				}else{ //是在微信浏览器里
					window.location.href='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIwMjM5OTI5NQ==&scene=124#wechat_redirect'
				}
			}else{ //在普通浏览器里
	    		if (/iphone|ipad|ipod/.test(ua)) {
		    		window.location.href='http://itunes.apple.com/cn/app/jie-zou-da-shi/id1028299545?mt=8'
				} else if (/android/.test(ua)) {
					window.location.href='http://android.myapp.com/myapp/detail.htm?apkName=com.mz.chamberlain'	
				}
			}
		},
		//点击订单详情
		order_det(item){
			//如果状态是未确认，直接进入检测报告页
			if(item.status==6){
				this.$router.push({path:'/report',query:{id:item.id}})
			}else{
				this.$router.push({path:'/storOrderDet',query:{id:item.id}})
			}
		}
	}
}
</script>
<style type="text/css" scoped>
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.storOrder{
	width: 100%;
	background-color: #f5f5f5;
	min-height:100vh;
	padding-top: .88rem;
    padding-bottom:1rem;
}
.inTo_myGold{
	position: absolute;
	font-size:.24rem;
	color:#333333;
	right:.3rem;
}
.noStorOrder{
 	text-align: center;
 	padding-top:2.24rem;
 	background-color: #F5F5F5;
    }
.noStorOrder img{
 	width:3.1rem;
 	height:2.4rem;
}
.noStorOrder p{
 	padding-top:.8rem;
 	font-size:.28rem;
 	color:#666666;
}
.noStorOrder span{
  	display: inline-block;
  	width:2.2rem;
  	height:.7rem;
  	line-height:.7rem;
  	background-color:#F2B643;
  	text-align: center;
  	font-size:.28rem;
  	color:#fff;
  	margin-top:.42rem;
  	border-radius: 2px;
}
.storGoldBtn{
	height:.98rem;
	line-height: .98rem;
	width:100%;
	position: fixed;
	bottom:0;
	text-align: center;
	font-size:.34rem;
	color:#fff;
	background-color: #F2B643;
}
.storOrder .orderInfo{
	background-color: #fff;
}
.order_container{
	width:100%;
	margin:0 auto;
	padding-bottom:.4rem;
	padding-left:.3rem;
	padding-right:.3rem;
	padding-top:.4rem;
	display: flex;
}
.order_container img{
	width:1.2rem;
	height:1.2rem;
}
.order_desc{
	width:100%;
	padding-left:.3rem;
}
.order_p1{
	line-height: .3rem;
	display: flex;
	padding-top:.04rem;
}
.order_p1 .order_p1_span1{
	font-size:.24rem;
	color:#000000;
	flex:4.8;
	overflow: scroll;
}
.order_p1 .order_p1_span2{
	font-size:.28rem;
	color:#EDA835;
	flex:1;
	text-align:right;
}
.order_p2{
	line-height:.4rem;
	padding-top:.06rem;
}
.order_p2 .order_p2_span1{
	font-size:.24rem;
	color:#666666;
	flex:1;
	text-align:left;
}
.order_p3{
	line-height:.4rem;
	display:flex;
}
.order_p3 .order_p3_span1{
	font-size:.24rem;
	color:#666666;
	flex:1;
}
.order_p3 .order_p3_span2{
	font-size:.22rem;
	color:#666666;
	flex:1;
	text-align: right;
}
.tostore_btn{
	border-radius: 2px;
	position:relative;
	width:2.2rem;
	height:.7rem;
	background-color: #F2B643;
	color:#fff;
	font-size:.28rem;
	line-height:.7rem;
}
.tostore_btn .btnActive{
	border-radius: 2px;
}
</style>