<template>
	<div class="coupon-container">
		<head-top headTitle='优惠券' ref="topHead">
            <!--这里后退买金页时把选中优惠券的id带过去-->
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
		</head-top>
		<!--有优惠券时显示-->
		<div class="couponBox" v-show="hasCoupon">

                <section class="couponMess" v-for="item in CouponList"   v-if="item.used == 0">
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

		</div>
		<!--没有优惠券时显示-->
		<div class="noCoupon" v-show="!hasCoupon">
			<img src="../../images/noCoupon.png">
			<p>您没有任何优惠券,是否错过了什么?</p>
			<span @click="goBack">返回</span>
		</div>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
    import { queryCoupons } from '@/service/getData'
    import { getStore } from '@/config/mUtils'
	export default {
		data(){
			return {
				CouponList:[],
				hasCoupon:true,
                searchCondition: {  //分页属性
                     pageNo: 1,  
                   pageSize: 600
                },
                userId:'',  //用户id
                counpon1:[],
                counpon2:[],
			}
		},
        created(){
            this.userId=getStore("token","local").split("_")[0];
            this.queryCoupons();
        },
		mounted() {
           var t=this;
           setTimeout(function(){
              t.$nextTick(function(){
                if(t.CouponList.length==0){
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
           }
        },
		methods:{
            //返回首页
            goBack(){
                window.toApp();
                this.$router.push('/mine');
            },
            async queryCoupons(){  //请求优惠券信息
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
		},
        watch:{
            counpon2(val){
                 this.CouponList=this.CouponList.concat(val);
            },
            counpon1(val){
                 this.CouponList=this.CouponList.concat(val);
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
     	padding:.3rem .3rem .2rem;
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