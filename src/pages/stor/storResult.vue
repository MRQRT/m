<template>
	<div class="store_infomation_result">
		<head-top class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
            <!-- <div slot="close_page" class="close_page" @click="$router.push('/storeGold')">
                 <img src="../../images/blackClose.png">
            </div> -->
		</head-top>
        <section class="infomation_container">
            <div class="infomation_title">
                <p class="success_title">
                    <img src="../../images/rightMark.png">
                    <span>恭喜，您的订单已经提交成功</span>
                </p>
                <p class="success_service">客服人员会尽快联系您核实订单信息</p>
            </div>
            <!--收货地址-->
            <div class="receipt_address">
                <p class="address_telephone">{{returnRecycleOrder.telephone}}</p>
                <p class="address_address">{{returnRecycleOrder.address}}</p>
            </div>
            <!--变现银行卡-->
            <p class="toCash" v-show="returnRecycleOrder.isWithDraw">变现&nbsp;&nbsp;{{returnRecycleOrder.bankCardNo | formatBankNo}}</p>
            <!--订单集合-->
            <section class="all_order_result">
                <div v-for="item in returnRecycleOrder.orderArray" class="order_container">
                    <img :src="item.imageUrl">
                    <div class="order_desc">
                        <p class="order_p1">订单编号&nbsp;:&nbsp;&nbsp;{{item.id}}</p>
                        <p class="order_p2">
                            {{item.name}}&nbsp;/&nbsp;{{item.applyWeight}}克
                        </p>
                    </div>
                </div>
            </section>
            <!--操作按钮-->
            <div class="result_btns">
                <p class="view_order" @click="$router.push({path:'/storOrder',query:{from:'storResult'}})">查看订单</p>
                <mt-button type="primary" class="back_home" @click="goBack">存金首页</mt-button>
            </div>
        </section>
	</div>
</template>
<script>
	import headTop from '@/components/header/head.vue';
    import { Button } from 'mint-ui';
    import { mapState } from 'vuex';
	export default {
		data(){
			return {
			}
		},
        created(){
            
        },
		mounted() {

		},
        filters:{
            formatBankNo(val){
                if(!val){
                    return
                }else{
                    var regExp=/(\d{4})(\d{9,12})(\d{3})/
                    return val.replace(regExp,'$1**********$3')
                }
            }
        },
		computed:{
            ...mapState([
                'returnRecycleOrder'
            ])
		},
		methods:{
            //返回上一页
			goBack(){
                window.toHomePage();//回存金首页
                this.$router.push('/storeGold');
            }
		},
		components:{
			headTop,
		}
	}
</script>

<style scoped>
    .store_infomation_result{
    	padding-top:0.88rem;
        background-color:#f5f5f5;
        min-height:100vh;
    }
    .store_infomation_result #head_top{
        border-bottom: none;
    }
    .close_page{
        position: absolute;
        left:1.18rem;
    }
    .store_infomation_result .close_page img{
        width:.36rem;
        height:.36rem;
    }
    .infomation_container .infomation_title{
        padding-top:.48rem;
        text-align: center;
        padding-left:0.3rem;
        padding-right:0.3rem;
        background-color:#fff;
    }
    .infomation_title .success_title{
        font-size:.34rem;
        color:#333333;
        padding-bottom:.22rem;
        position: relative;
    }
    .infomation_title .success_title img{
        width:.34rem;
        height:.34rem;
        vertical-align: middle;
    }
    .infomation_title .success_title span{
        font-weight:600;
        vertical-align: middle;
    }
    .infomation_title .success_service{
        font-size:.22rem;
        color:#999999;
    }
    .store_infomation_result .receipt_address{
        padding-top:.74rem;
        color:#333333;
        padding-left:0.3rem;
        padding-right:0.3rem;
        background-color:#fff;
    }
    .receipt_address .address_telephone{
        font-size:.3rem;
        padding-bottom:.28rem;
    }
    .receipt_address .address_address{
        font-size:.26rem;
        padding-bottom:.28rem;
        border-bottom:1px solid #f5f5f5;
    }
    .store_infomation_result .toCash{
        background-color: #fff;
        font-size:.24rem;
        color:#666666;
        height:.9rem;
        line-height:.9rem;
        padding-left:.3rem;
    }
    .store_infomation_result .all_order_result{
        background-color: #fff;
        margin-top:.2rem;
        padding-top:.32rem;
    }
    .order_container{
        width:100%;
        margin:0 auto;
        padding-bottom:.58rem;
        padding-left:.3rem;
        padding-right:.3rem;
        display: flex;
    }
    .order_container img{
        width:.7rem;
        height:.7rem;
    }
    .order_desc{
        width:100%;
        padding-left:.3rem;
    }
    .order_p1{
        line-height: .3rem;
        padding-top:.04rem;
        font-size:.28rem;
        color:#333333;
    }
    .order_p2{
        line-height:.4rem;
        font-size:.24rem;
        color:#666666;
    }
    .result_btns{
        background-color: #fff;
        padding-left:.62rem;
        padding-bottom:.4rem;
        overflow:hidden;
    }
    .result_btns .view_order,.result_btns .back_home{
        width:2.5rem;
        height:.7rem;
        border-radius:2px; 
        line-height:.7rem;
        text-align: center;
        font-size:.28rem;
        float:left;
    }
    .result_btns .view_order{
        border:1px solid #F3B734;
        color:#EFA922;
        margin-right:1.24rem;
    }
    .result_btns .back_home{
        background-color: #F3B734;
        color:#FFFFFF;
    }
</style>
<style>
    .mint-button--normal{
        display: block;
        padding:0;
    }
</style>