<template>
	<div class="coupon-container">
		<head-top headTitle='优惠券' ref="topHead">
            <!--这里后退买金页时把选中优惠券的id带过去-->
			<img slot='head_goback' src='../../../images/back.png' class="head_goback" @click="goToBack">
		</head-top>
		<!--有优惠券时显示-->
		<div class="couponBox" v-show="hasCoupon">

            <mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore" class="loadmore">
                <section class="couponMess" v-for="item in CouponList" :key="item.id" @click="selectCoupon($event,c+item.id)"  v-if="item.used == 0" :id="c+item.id">
                    <!--这里由优惠券的克重条件和进入该页的克重做比较，不满足则置灰-->
                    <div class="left-coupon">
                       <!--面额-->
                       <p class="denomination"><span>¥</span><span>{{item.faceAmount}}</span></p>
                       <!--限于多少克可使用-->
                       <p class="limited-kilo">满{{item.useableMinWeight || item.useableMinAmount}}{{item.useableMinWeight ? '克':'元'}}可用</p>
                    </div>
                    <div class="right-coupon">
                       <!--适用的产品-->
                       <p class="suit-product">{{item.name}}({{item.type==1?'现金支付':''}})</p>
                       <!--有效期-->
                       <p class="with-in-time">有效期:{{item.createTime | formatTime}}-{{item.expireTime | formatTime}}</p>
                    </div>
                </section>

            </mt-loadmore>

		</div>
		<!--没有优惠券时显示-->
		<div class="noCoupon" v-show="!hasCoupon">
			<img src="../../../images/noCoupon.png">
			<p>您没有任何优惠券,是否错过了什么?</p>
			<span @click="$router.go(-1)">返回</span>
		</div>
	</div>
</template>

<script>
	import headTop from '../../../components/header/head.vue';
    import { queryCoupons } from '@/service/getData'
    import { getStore } from '@/config/mUtils'
    import {mapMutations} from 'vuex';
	export default {
		data(){
			return {
				CouponList:[],
				hasCoupon:true,//是否有优惠券
                c:'cop',//id前缀
                searchCondition: {  //分页属性
                     pageNo: 1,
                   pageSize: 6
                },
                userId:'',  //用户id
                allLoaded: false, //上拉加载是否加载完毕
                pages: null,  //总页数
                selectCouponId:'',//选中要使用的优惠券
                false:false,
                default:null, //从父页带过来的默认使用的优惠券
                canOthers:[], //可以使用的优惠券组合
                ids:[] //可以用的优惠券id
			}
		},
        created(){
            if(this.$route.query.default){
                this.default=this.$route.query.default;
                this.selectCouponId=this.default.id;
                this.canOthers=this.$route.query.canOthers;
            }
        },
		mounted() {
            //进入该页时，把克重也带进来，不可用的优惠券置灰#e1e1e1
            this.userId=getStore("token","local").split("_")[0];
            this.queryCoupons();

            var ids=[];
            for(var i=0;i<this.canOthers.length;i++){
                ids.push(this.canOthers[i].id);
            }
            this.ids=ids;
		},
        computed:{

        },
        filters:{
           formatTime(val){
               return val.split(' ')[0];
           }
        },
		methods:{
            ...mapMutations([
                'RECORD_COUPONID'
            ]),
            contains(arr, obj) {  //判断数组是否含有某元素
                if(!arr) return false;
                var i = arr.length;
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            },
            doneRender(){
               var t=this;
               this.$nextTick(function(){
                   var dvs=document.querySelectorAll(".couponMess");
                   dvs=Array.from(dvs);
                   if(dvs && dvs.length){
                     for(var i=0;i<dvs.length;i++){
                      if(dvs[i].id.split("p")[1]==t.default.id){
                          dvs[i].childNodes[2].classList.add('selected');
                       }else if(!t.contains(t.ids, dvs[i].id.split("p")[1])){
                           dvs[i].childNodes[0].classList.add('darkBg');
                       }
                      }
                   }
                   
               })
            },
            async queryCoupons(){  //请求优惠券信息
                this.searchCondition.pageNo=1;
                var res=await queryCoupons(this.searchCondition.pageNo,this.searchCondition.pageSize,this.userId,"1",1);
                if(res.code==100){
                    if(res.content.total==0){
                        this.hasCoupon=false;
                        var hgt=window.innerHeight;
                        document.querySelector('.noCoupon').style.height=hgt-this.$refs.topHead.$el.offsetHeight+'px';
                        return;
                    }
                    this.CouponList=res.content.list;
                    this.pages=res.content.pages;
                    if(this.searchCondition.pageNo>=this.pages){
                        this.allLoaded=true;
                    }
                    this.doneRender();
                }
            },
            loadBottom(){  //上拉加载
               var that = this;
               setTimeout(function(){
                  that.loadMore();
                  that.$refs.loadmore.onBottomLoaded();
              },800)

            },
            async loadMore(){
                this.searchCondition.pageNo=this.searchCondition.pageNo+1;
                var res=await queryCoupons(this.searchCondition.pageNo,this.searchCondition.pageSize,this.userId,"1");
                if(res.code==100){
                    this.CouponList=this.CouponList.concat(res.content.list);
                    if(this.searchCondition.pageNo>=this.pages){
                        this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
                    }
                    this.doneRender();
                }
            },
            selectCoupon($event,id) {

                if(document.querySelector('#'+id).childNodes[0].classList.contains('darkBg')) return;

                if(document.querySelector('#'+id).childNodes[2].classList.contains('selected')){
                    document.querySelector('#'+id).childNodes[2].classList.remove('selected');
                    this.selectCouponId="";
                    document.querySelector('#'+id).childNodes[2].style.paddingTop='.42rem';
                }else{
                   var dv=document.querySelector('.selected');
                   if(dv){
                      dv.classList.remove('selected');
                      dv.style.paddingTop='.42rem';
                   }

                   document.querySelector('#'+id).childNodes[2].classList.add('selected');
                   this.selectCouponId=id.split('p')[1];
                   document.querySelector('#'+id).childNodes[2].style.paddingTop='.38rem';
                }
            },
            goToBack(){
                if(this.selectCouponId){
                    this.RECORD_COUPONID(this.selectCouponId)
                }
                    
                this.$router.push({
                      path:'/buy',
                })

            }
		},
        updated(){
            if(this.allLoaded){
                //创建标签 提示内容已到底部 加载完毕
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
                document.querySelector('.couponBox').appendChild(p)
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
        position: absolute;
        top: 0;
        z-index: 50;
        min-height:100vh;
        width:100%;
    }
    .coupon-container .couponBox{
     	padding:.3rem .3rem .2rem;
     }
    .couponBox .couponMess{
     	height:1.82rem;
     	margin-bottom:.3rem;
     	display:flex;
        display:-webkit-flex;
        display:-moz-flex;
        display:-ms-flex;
        display:-o-flex;
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
        background-image:url(../../../images/couponBg.png);
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
        background-image:url(../../../images/couponDark.png);
     }
</style>
