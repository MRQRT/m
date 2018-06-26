<template>
	<div class="my-delivery">
		<head-top headTitle='查看物流' class="head-top" id="head_top" ref="topHead">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
		<!--主要内容区域-->
		<section class="delivery-area" ref="deliveryArea">
			<!--物流源-->
			<div class="delivery-name">
				<div class="delivery-name-left">
					<img :src="goodsUrl">
				</div>
				<div class="delivery-name-right">
					<p><span style="color:#000;font-weight:bold;margin-right:.14rem;">物流状态</span><span style="color:#EDA835;">{{expressInfo.deliverystatus}}</span></p>
					<p><span style="margin-right:.14rem;">承运来源:</span><span>{{expressInfo.type}}快递</span></p>
					<p><span style="margin-right:.14rem;">运单编号:</span><span>{{expressInfo.number}}</span></p>
					<p><span style="margin-right:.14rem;">官方电话:</span><span>{{expPhone}}</span></p>
				</div>
			</div>
			<!--物流详情-->
			<div class="delivery-message">
				<div class="newest" v-for="(item,index)  in expressInfo.list" :id="idStart+index" v-circle>
                    <p class="newest-p1">{{item.status}}</p>
                    <p class="newest-p2">{{item.time}}</p>
				</div>
				<!--物流串线-->
				<div class="joinLine"></div>
			</div>
		</section>
		
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
    import { queryExpress } from '@/service/getData'
    import { getRem } from '@/config/mUtils'
    import ellipse from '@/images/ellipse.png'
	export default {
		data(){
			return {
				expressNo:'', //物流单号
                expressInfo:{},//物流信息
                idStart:'ex',//id标识
                goodsUrl:'', //快递商品图片
                expPhone:null,//官方电话
			}
		},
		created(){
			
		},
		mounted() {
            //获取物流单号和商品图片渲染页面
            this.expressNo=this.$route.query.expressNo;
            this.goodsUrl=this.$route.query.imageUrl;
            this.queryExpress();//请求物流信息
			var hgt=window.innerHeight;
			document.querySelector('.my-delivery').style.minHeight=hgt+'px';//页面最小高度
		},
		computed:{
			lastHeight(){
                return document.querySelector('.delivery-message').offsetHeight;
            }
		},
        directives:{
             circle:{
                bind:function(el){
                    var dv=document.createElement('div');
                    //最新一条物流加亮显示
                    if(el.id=='ex0'){
                        el.style.color='#EDA835';
                        dv.style.width=12+'px';
                        dv.style.height=12+'px';
                        dv.style.borderRadius = '50%';
                        dv.style.backgroundImage='url('+ellipse+')';
                        dv.style.backgroundSize="100%";
                        dv.style.position = 'absolute';
                        dv.style.left='-.86rem';
                        dv.style.top="0.32rem";
                        dv.style.zIndex = '2';
                    }else{
                        el.style.color='#666666';
                        dv.style.width=7+'px';
                        dv.style.height=7+'px';
                        dv.style.backgroundColor='#999999';
                        dv.style.borderRadius = '50%';
                        dv.style.position = 'absolute';
                        dv.style.left='-.8rem';
                        dv.style.top="0.42rem";
                        dv.style.zIndex = '2';
                    }
                    el.appendChild(dv)
                }
            }
        },
		methods:{
			async queryExpress(){
                var res=await queryExpress(this.expressNo);
                if(res.code==100){
                    this.expressInfo=res.content.result;
                    this.expPhone=res.content.result.expPhone
                    //页面渲染完加载物流连接线
                    var t=this;
                    this.$nextTick(function(){
                        document.querySelector('.joinLine').style.height=t.lastHeight-0.38*getRem()-0.22*getRem()-0.24*getRem()+'px';
                    })
                }
            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>    
    .my-delivery{
   	    width:100%;
   	    background-color: #F5F5F5;
   	    overflow-y: scroll;
    }
    .my-delivery .delivery-area{
   	    margin-top:.88rem;
    }
    .my-delivery .delivery-area .delivery-name{
    	height:2.1rem;
    	background-color: #fff;
    	margin-bottom:.2rem;
    	padding-top:.4rem;
    	padding-left:.3rem;
    	display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .delivery-area .delivery-name .delivery-name-right{
    	margin-left:.3rem;
    	font-size:.24rem;
    	color:#666666;
    }
    .delivery-name .delivery-name-left{
        width:1.3rem;
        height:1.3rem;
        border:.02rem solid #EEEEEE;
        text-align: center;
        padding-top:.04rem;
    }
    .delivery-name .delivery-name-left img{
    	width:1.14rem;
    	height:1.16rem;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -o-border-radius: 50%;
    }
    .my-delivery .delivery-area .delivery-message{
    	background-color: #fff;
    	padding-top:.38rem;
    	padding-left:1.28rem;
    	padding-right:.3rem;
    	position: relative;
        overflow: hidden;
    }
    .delivery-area .delivery-message .joinLine{
    	position: absolute;
    	background-color: #999999;
    	width:.02rem;
    	left:0.54rem;
        top:0.9rem;
        z-index: 1;
    }
    .delivery-area .delivery-message .newest{
    	border-bottom:1px solid #EFEFEF;
    	position: relative;
        font-size:.24rem;
        padding-bottom:.32rem;
        padding-top:.22rem;
    }
</style>
