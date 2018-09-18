<template>
	<div class="coupon-container">
		<head-top headTitle='优惠券' ref="topHead">
            <!--这里后退买金页时把选中优惠券的id带过去-->
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
		</head-top>
		<!--有优惠券时显示-->
		<div class="couponBox" v-if="hasCoupon">
			<!-- 优惠券 -->
            <section class="couponMess" v-for="item in CouponList"   v-if="item.used == 0" style="display:none">
                <!--这里由优惠券的克重条件和进入该页的克重做比较，不满足则置灰-->
                <div class="left-coupon">
                   <!--面额-->
                   <p class="denomination"><span>¥</span><span>{{item.faceAmount}}</span></p>
                   <!--限于多少克可使用-->
                   <p class="limited-kilo">满{{item.useableMinWeight || item.useableMinAmount}}{{item.useableMinWeight ? '克':'元'}}可用</p>
                </div>
                <div class="right-coupon">
                   <!--适用的产品-->
                   <p class="suit-product">{{item.name}}({{item.type==1?'现金支付':'黄金支付'}})</p>
                   <!--有效期-->
                   <p class="with-in-time">有效期:{{item.createTime | formatTime}}-{{item.expireTime | formatTime}}</p>
                </div>
            </section>
			<!-- 福利券 -->
			<section class="welfare" v-for="(item,index) in couponList" :class="{'has-used':item.status==1||item.status==2,'Invalid-used':invalid(item.expireTime)}">
				<!-- 右侧金额 -->
				<div class="left-price">
					<p class="price"><span>¥</span>{{parseFloat(item.amount)}}</p>
					<p class="name">福利券</p>
				</div>
				<!-- 左侧说明 -->
				<div class="right-wrap">
					<div class="right-info">
						<h4>存金实测毛重≥{{parseFloat(item.useLimit)}}g</h4>
						<p class="date" v-if="item.expireTime">有效期至{{item.expireTime | changeTime}}</p>
						<p class="use-limit">*仅限存金回购业务使用</p>
					</div>
					<!-- 使用情况 -->
					<div class="useStatus">
						<div class="use-rightNow" v-if="item.status==0 && !invalid(item.expireTime)" @click="$router.push({path:'/stor',query:{from:'coupon'}})">立即使用</div>
						<!-- 已使用 -->
						<div class="cup-has-used" v-if="item.status==1 || item.status==2"></div>
						<!-- 已失效 -->
						<div class="cup-invalid" v-if="invalid(item.expireTime)"></div>
					</div>
				</div>
			</section>
		</div>
		<!--没有优惠券时显示-->
		<div class="noCoupon" v-else>
			<img src="../../images/noCoupon.png">
			<p>您没有任何优惠券,是否错过了什么?</p>
			<span @click="goBack">返回</span>
		</div>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
    import { queryCoupons,coupons } from '@/service/getData'
    import { getStore } from '@/config/mUtils'
    import {mapState} from 'vuex'
	export default {
		data(){
			return {
				publicUrl:'http://test.activity.au32.cn',//活动链接
				CouponList:[],
				hasCoupon:true,
                searchCondition: {  //分页属性
                    pageNo: 1,
                   	pageSize: 600
                },
                userId:'',  //用户id
                counpon1:[],
                counpon2:[],
				couponList:[],
			}
		},
        created(){
            this.token ? this.coupons() : '';
        },
        computed:{
            ...mapState([
                'token','activityId'
            ])
        },
		mounted() {
           var t=this;
           setTimeout(function(){
              t.$nextTick(function(){
                // if(t.CouponList.length==0){
                //     t.hasCoupon=false;
                //     var hgt=window.innerHeight;
                //     document.querySelector('.noCoupon').style.height=hgt-t.$refs.topHead.$el.offsetHeight+'px';
                // }
				if(t.couponList.length==0){
                    t.hasCoupon=false;
                    var hgt=window.innerHeight;
                    document.querySelector('.noCoupon').style.height=hgt-t.$refs.topHead.$el.offsetHeight+'px';
                }
             })
           },1000)

		},
        filters:{
           formatTime(val){
               return val.split(' ')[0];
           },
		   /* 改变时间样式(月-日 时-分) */
		   changeTime(val){
			   var arr=val.split(' ');

		       var timeArr1=arr[0].split('-');
		       timeArr1=timeArr1.join('-');

		       var timeArr2=arr[1].split(':');
		       timeArr2.pop();
		       timeArr2=timeArr2.join(':');
		       return timeArr1;
		   }
        },
		methods:{
			// 福利券失效判断
			invalid(val){
				var now = Date.parse(new Date());
				var newVal = val.replace(/-/g,"/");
				var time = 　Date.parse(new Date(newVal))
				if(now>time){
					return true
				}else{
					return false
				}
			},
            //返回首页
            goBack(){
                window.toApp();
				if(this.GetQueryString('from')=='lottery'){ //从活动页活来再跳转回去
					window.location.href = this.publicUrl;
				}else{
					this.$router.push('/mine');
				}
            },
            async queryCoupons(){  //请求优惠券信息
                this.userId=getStore("token","local").split("_")[0];
                var res1=await queryCoupons(this.searchCondition.pageNo,this.searchCondition.pageSize,this.userId,"1");
                if(res1.code==100){
                    if(res1.content.total==0) return;

                    this.counpon1=res1.content.list;

                }
                var res2=await queryCoupons(this.searchCondition.pageNo,this.searchCondition.pageSize,this.userId,"2");
                if(res2.code==100){
                    if(res2.content.total==0) return;

                    this.counpon2=res2.content.list;

                }
            },
			// 请求福利券信息
			async coupons(){
				var res = await coupons(this.activityId)
				if(res.code==100){
					if(res.content.length==0){
						this.hasCoupon = false;
					}else{
						this.hasCoupon = true;
						this.couponList = res.content.all;
					}
				}
			},
		},
        watch:{
            counpon2(val){
                 this.CouponList=this.CouponList.concat(val);
            },
            counpon1(val){
                 this.CouponList=this.CouponList.concat(val);
            },
            token(){
                this.token ? this.queryCoupons() : '';
            }
        },
        components:{
            headTop
        },
	}
</script>

<style scoped>
    .coupon-container {
    	background-color: #fff;
        padding-top:0.88rem;
    }
    .coupon-container .couponBox{
    	min-height: 100vh;
     	padding:.3rem .3rem .2rem;
		background-color: #F5F5F5;
     }
	 /* 福利券 */
	 .couponBox .welfare{
	 	width: 100%;
		margin-bottom: .2rem;
		display: flex;
		position: relative;
		display: flex;
		overflow: hidden;
	 }
	 .right-wrap{
	 	height: 1.8rem;
		padding-left:.2rem;
		background-color: #fff;
		flex-grow: 2;
		overflow: hidden;
	 }
	  .couponBox .has-used .left-price,.couponBox .Invalid-used .left-price{
		background:url('../../images/coupon-grey.png') no-repeat !important;
		background-size: 100% 100% !important;
	  }
	  .couponBox .has-used .use-limit,.couponBox .Invalid-used .use-limit{
	  	color: #BCBCBC !important;
	  }
	 .welfare .left-price{
	 	width: 2rem;
		height: 1.8rem;
		color: #fff;
		font-size: .22rem;
		text-align: center;
		background:url('../../images/couponBg.png') no-repeat;
		background-size: 100% 100%;
	 }
	 .welfare .left-price .price{
	 	font-size: .88rem;
		font-weight: bold;
		font-family:PingFangSC-Medium;
	 }
	 .welfare .left-price .price span{
	 	font-size: .34rem;
	 }
	 .welfare .left-price .name{
	 	margin-top:-.15rem;
	 }
	  .welfare .right-info{
		  font-size: .24rem;
		  padding:.2rem 0;
	  }
	  .welfare .right-info h4{
	  	color: #333;
		font-size: .3rem;
		font-family:PingFangSC-Medium;
		font-weight:500;
	  }
	  .welfare .right-info .date{
	  	color: #999;
	  }
	  .welfare .right-info .use-limit{
	  	color: #EDA835;
		font-size: .22rem;
		margin-top:.3rem;
	  }
	   .welfare .useStatus{
	   	overflow: hidden;
	   }
	   .welfare .useStatus .use-rightNow{
	   		width: 1.2rem;
			height: .44rem;
			color: #fff;
			text-align: center;
			line-height: .44rem;
			font-size: .22rem;
			border-radius: 2.2rem;
			background-color: #F2B643;
			position: absolute;
			right:.3rem;
			top:40%;
	   }
	   .has-used .useStatus .cup-has-used{
	   		width: 1.3rem;
			height: 1.3rem;
			position: absolute;
			right: -.01rem;
			bottom:-.01rem;
			background:url('../../images/coupon-used.png') no-repeat;
			background-size: 100%;
	    }
	    .Invalid-used .useStatus .cup-invalid{
			width: 1.3rem;
			height: 1.3rem;
			position: absolute;
			right: -.01rem;
			bottom:-.01rem;
			background:url('../../images/coupon-updated.png') no-repeat;
			background-size: 100%;
	   }
    .couponBox .couponMess{
     	height:1.82rem;
     	margin-bottom:.3rem;
     	display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
     	box-shadow: rgba(193,193,193,.5) 10px 2px 18px;
        -webkit-box-shadow: rgba(193,193,193,.5) 10px 2px 18px;
        -moz-box-shadow: rgba(193,193,193,.5) 10px 2px 18px;
        -o-box-shadow: rgba(193,193,193,.5) 10px 2px 18px;
        box-sizing: content-box;
     }
    .couponMess .left-coupon{
        width:2.24rem;
     	position: relative;
     	overflow: hidden;
		padding-top:.15rem;
        background-image:url(../../images/couponBg.png);
        background-size: 100%;
     }
     .couponMess .left-coupon p{
        color:#fff;
     }
     .couponMess .left-coupon span{
        color:#fff;
     }
     .couponMess .right-coupon{
        width:4.66rem;
     	padding-left:.18rem;
     	padding-top: .42rem;
     }
     .denomination{
		text-align: center;
     }
     .denomination span:nth-child(2){
     	font-size:.7rem;
     }
     .left-coupon .limited-kilo{
     	text-align:center;
     	font-size:.25rem;
     }
     .right-coupon .suit-product{
     	height:.76rem;
     	font-size:.26rem;
     	color:#333333;
     }
     .right-coupon .with-in-time{
     	font-size:.26rem;
     	color:#ABABAB;
     }
     .coupon-container .noCoupon{
     	height: 100vh;
     	text-align: center;
     	padding-top:2.24rem;
     	background-color: #F5F5F5;
     }
     .coupon-container .noCoupon img{
     	width:3.11rem;
     	height:2.39rem;
     }
     .coupon-container .noCoupon p{
     	padding-top:.5rem;
     	font-size:.32rem;
     	color:#666666;
     }
     .coupon-container .noCoupon span{
     	display: inline-block;
     	width:2.22rem;
     	height:.72rem;
     	line-height:.72rem;
     	background-color:#F2B643;
     	text-align: center;
     	font-size:.28rem;
     	color:#fff;
     	margin-top:.4rem;
     	border-radius: 3px;
     }
     .selected{
        box-sizing: border-box;
        border: .04rem solid #f2b643;
        border-left: none;
     }
     .couponMess .darkBg{
        background-image:url(../../images/couponDark.png);
     }
</style>
