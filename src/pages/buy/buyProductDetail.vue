<template>
	<div class="buy-product-detail">
		<div class="buy-product-box">
			<head-top headTitle='活期黄金'>
				<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goback()">
				<span slot="custom" class="custom myGold" @click="$router.push({'path':'/myGold'})">我的黄金</span>
			</head-top>
            <!--实时金价和年化生金率-->
			<section class="buy-product-brief">
                <p class="buy-product-text" @click="$router.push('/currentAndHistory')"><span>实时金价(元/克)</span></p>
                <p class="buy-product-price">{{currentPrice}}</p>
                <section class="buy-brief-else">
                    <div class="brief-each-else">
                        <p class="brief-each-name">期限</p>
                        <p class="brief-each-info">随时买卖</p>
                    </div>
                    <!-- <div class="brief-each-else">
                        <p class="brief-each-name">年化生金率</p>
                        <p class="brief-each-info">{{rate}}<span class="percentage">%</span></p>
                    </div> -->
                    <div class="brief-each-else">
                        <p class="brief-each-name">起购</p>
                        <p class="brief-each-info">{{minWeight | keepPoints}}克</p>
                    </div>
                </section>
			</section>
			<!--购买起息到账情况-->
			<!-- <section class="buy-interest-into">
                <div class="each-interest-into">
                    <img src="../../images/inToAccount.png">
                    <p class="each-interest-title">购买</p>
                    <p class="each-interest-time">{{buyDate}}</p>
                </div>
                <div class="each-interest-into second_into">
                    <p class="centerImg"></p>
                    <p class="each-interest-title">起息</p>
                    <p class="each-interest-time">{{interestDate}}</p>
                </div>
                <div class="each-interest-into">
                    <img src="../../images/inToAccount.png">
                    <p class="each-interest-title">到账(随时卖出)</p>
                    <p class="each-interest-time">{{dueDate}}</p>
                </div>
			</section> -->
            <!--产品详情购买记录-->
            <section class="detail-purchase">
                <p class="detail-purchase-title">
                    <span class="detail-title" :class="{'selcted':detailSelect}" @click="seletedThis(0)">产品详情</span>
                    <span class="purchase-title" :class="{'selcted':purchaseSelect}" @click="seletedThis(1)">购买记录</span>
                </p>
                <section class="detail-box" v-show="detailSelect">
                    <div class="detail-per-tip">
                        <img src="../../images/goldVariety.png">
                        <div>
                            <p class="detain-title">黄金品种</p>
                            <p class="detain-text">纯度为99.99%的现货黄金</p>
                        </div>
                    </div>
                    <!-- <div class="detail-per-tip">
                        <img src="../../images/interestCompose.png">
                        <div>
                            <p class="detain-title">收益构成</p>
                            <p class="detain-text">{{rate}}%年化黄金收益+金价波动收益，每日手动收取金豆，将获得额外奖励</p>
                        </div>
                    </div> -->
                    <div class="detail-per-tip">
                        <img src="../../images/feeImg.png">
                        <div>
                            <p class="detain-title">手续费</p>
                            <p class="detain-text">买入{{buyFee}}元/克，卖出{{sellFee}}元/克</p>
                        </div>
                    </div>
                    <!-- <div class="detail-per-tip">
                        <img src="../../images/interestAccrual.png">
                        <div>
                            <p class="detain-title">计息规则</p>
                            <p class="detain-text">每日利息=持仓克重*年化收益率/365</p>
                            <p class="detain-text">每日利息克重自动转入活期账户</p>
                            <p class="detain-text">复利计息，即上一期的本金和利息作为下一期的本金来计算利息</p>
                            <p class="detain-text">若您的持仓克重较少，可能无利息产生哦</p>
                        </div>
                    </div> -->
                    <div class="detail-per-tip">
                        <img src="../../images/tradeTime.png">
                        <div>
                            <p class="detain-title">交易时间</p>
                            <p class="detain-text">交易时间段：周一至周五9:00-24:00，法定节假日除外非交易时间段，可挂单委托</p>
                        </div>
                    </div>
                    <div class="detail-per-tip">
                        <img src="../../images/tradeRule.png">
                        <div>
                            <p class="detain-title">交易规则</p>
                            <p class="detain-text">每日累计买入、卖出黄金克重上限各{{maxWeightTotal}}克，卖出后资金转移到现金余额账户中</p>
                        </div>
                    </div>
                </section>
                <mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"  v-show="purchaseSelect">
                <section class="purchase-box">
                    <p v-for="(item,index) in purchaseRecord" :key="index">
                        <span class="userName">{{item.userName}}</span>
                        <span>{{item.weight | keepPoints}}克</span>
                        <span class="createTime">{{item.createTime | formatTime}}</span>
                    </p>
                </section>
                </mt-loadmore>
            </section>
            <!--立即买入按钮-->
            <my-button class="quick-buy" :class="{'unable_click':unable==true}" buttonText="立即买入" @click.native="gobuy()"></my-button>
            <!-- <my-button   class="quick-buy" buttonText="立即买入"></my-button> -->
		</div>
	</div>
</template>
<script>
import {mapState} from 'vuex';
import headTop from '../../components/header/head.vue';
import myButton from '@/components/myButton/myButton.vue'
import { queryDemandFee,orderDemandBuyOrderVoList,interestDate } from '@/service/getData.js'

	export default {
		data() {
			return {
                detailSelect:true, //产品详情展示
                purchaseSelect:false, //购买记录展示
                rate:null,//年化生金率
                pageParams:{
                    pageNo:1,
                    pageSize:10
                },
                allLoaded:false,
                false:false,
                pages:null,//一共几页
                purchaseRecord:null,//交易记录
                buyFee:null,//买金手续费
                sellFee:null,//卖出手续费
                buyDate:null,//购买日期
                interestDate:null,//起息日期
                dueDate:null,//到账日期
                minWeight:null,//起购克重
                maxWeightTotal:null,//当日买卖上线克重
                unable:false,//按钮不可点击开关
			}
		},
		mounted() {
            this.queryDemandFee()
            this.queryInterestDate()
            var s = Date.parse('10/20/2018');
            var nowdate = new Date();
            var d = Date.parse(nowdate);//当前时间
            (d>=s)?this.unable=true:''
		},
		filters:{
            keepPoints(val){ //保留3位小数
                if(val==undefined) return
                return (val).toFixed(3)
            },
            formatTime(value){   //过滤后台给的时间格式去掉秒
              if(!value) return;
              var arr=value.split(':');
              arr.pop()
              var newTime=arr.join(':');
              return newTime;
            }
		},
		methods:{
            //切换显示产品详情和购买记录
            seletedThis(val){
                if(val){
                    if(this.purchaseSelect) return;
                    this.purchaseSelect=true;
                    this.detailSelect=false;
                    this.orderDemandBuyOrderVoList()
                }else{
                    if(this.detailSelect) return;
                    this.detailSelect=true;
                    this.purchaseSelect=false;
                }
            },
            //获取年化生金率
            async queryDemandFee(){
				var res=await queryDemandFee();
				if(res.code==100){
                    this.rate=res.content.rate;
                    this.buyFee=res.content.buyFee;
                    this.sellFee=res.content.sellFee;
                    this.minWeight=res.content.minWeight;
                    this.maxWeightTotal=res.content.maxWeightTotal;
				}
            },
            //查看交易记录
            async orderDemandBuyOrderVoList(){
                var result=await orderDemandBuyOrderVoList(this.pageParams.pageNo++,this.pageParams.pageSize)
                if(result.code==100){
                    if(result.content.pages){ //说明记录不为空
                        if(!this.purchaseRecord){//第一次点击显示交易记录
                            this.purchaseRecord=result.content.list;
                            this.pages=result.content.pages;
                        }else{
                            this.purchaseRecord=this.purchaseRecord.concat(result.content.list);
                        }
                        if(this.pageNo>this.pages) this.allLoaded=true;
                    }
                }
            },
            //上拉加载更多
            loadBottom(){
                var that = this;
                setTimeout(function(){
                  that.orderDemandBuyOrderVoList();
                  that.$refs.loadmore.onBottomLoaded();
                },400)
            },
            //查询购买起息到账日期
            async queryInterestDate(){
                var res=await interestDate(1)
                if(res.code==100){
                    this.buyDate=res.content.buyDate
                    this.dueDate=res.content.dueDate
                    this.interestDate=res.content.interestDate
                }
            },
            //返回按钮
            goback(){
                window.toApp();
                this.$router.push('/buyGold')
            },
            //去买金页
            gobuy(){
                var s = Date.parse('10/20/2018');
                var nowdate = new Date();
                var d = Date.parse(nowdate);//当前时间
                (d<s)?this.$router.push('/buy'):this.unable=true
            }
		},
		computed:{
            ...mapState([
                'currentPrice',
            ]),
		},
		components: {
            headTop,
            myButton
		},
	}
</script>
<style scoped lang="less">
@import '../../style/common.less';
.buy-product-detail{
    padding-top:.88rem;
    background-color: #F5F5F5;
    height:100vh;
    .buy-product-brief{
        padding-top:.5rem;
        background-color: #fff;
        margin-bottom:.24rem;
        .buy-product-text{
            text-align: center;
            line-height:.28rem;
            padding-left:0.24rem;
            span{
                .font-style(.26rem,@base-font-color1);
                position: relative;
            }
        }
    }
}
.buy-product-box{
    padding-bottom:1.2rem;
}
.buy-product-text span:before{
    content:'';
    .imgStyle(0.24rem,0.24rem);
    position: absolute;
    left:-0.34rem;
    top:.06rem;
    background: url('../../images/currPrice.png') no-repeat;
    background-size: 100% 100%;
}
.buy-product-price{
    .font-style(.88rem,#EDA835);
    text-align: center;
    font-weight:600;
    padding-top:.14rem;
}
.buy-brief-else{
    .flex;
    .top-padding(0.5rem);
        .brief-each-else{
        text-align: center;
        .brief-each-name{
            .font-style(.24rem,@base-font-color3);
        }
        .brief-each-info{
            .font-style(.34rem,#EDA835);
            font-weight:600;
            padding-top:.1rem;
            padding-bottom:.5rem;
            .percentage{
                font-size:.24rem;
                font-weight:normal;
            }
        }
    }
}
.brief-each-else:nth-child(2){
    margin-left:1.22rem;
}
.buy-interest-into{
    padding-top:.44rem;
    padding-bottom:.46rem;
    background-color: #fff;
    margin-bottom:.24rem;
    .flex;
    .each-interest-into{
        text-align: center;
        img{
            .imgStyle(0.2rem,0.2rem);
        }
        .each-interest-title{
            .font-style(.24rem,@base-font-color1);
            padding-top:.22rem;
            padding-bottom:.1rem;
        }
            .each-interest-time{
            .font-style(.24rem,@base-font-color3);
        }
    }
}
.second_into .centerImg{
    width:.22rem;
    height:.22rem;
    background-image: url(../../images/inToAccount.png);
    background-size: 0.2rem 0.2rem;
    background-repeat: no-repeat;
    position: relative;
    display:inline-block;
    background-position: center;
}
.second_into{
    margin-left:1.2rem;
    margin-right:1.04rem;
}
.second_into .centerImg:before,.second_into .centerImg:after{
    content:'';
    .imgStyle(1000%,1px);
    background-color:rgba(242,182,67,.2);
    position:absolute;
    top:.1rem;
}
.second_into .centerImg:before{
    left:-2.24rem;
}
.second_into .centerImg:after{
    right:-2.24rem;
}
.detail-purchase{
    background-color: #fff;
    padding-top:.32rem;
    .detail-purchase-title{
        padding-left:2.16rem;
        font-size:.28rem;
        margin-bottom:.5rem;
        height:.7rem;
        .detail-title{
            margin-right:.88rem;
        }
    }
}
.detail-purchase-title .detail-title,.detail-purchase-title .purchase-title{
    color:#999999;
    padding-bottom:.28rem;
    box-sizing: content-box;
}
.detail-purchase-title .detail-title.selcted,.detail-purchase-title .purchase-title.selcted{
    color:#EDA835;
    padding-bottom:.28rem;
    border-bottom:2px solid #F2B643;
    box-sizing: content-box;
}
.detail-box{
    .detail-per-tip{
        .flex-simple;
        padding-left:.32rem;
        padding-right:.36rem;
        margin-bottom:.48rem;
        img{
            .imgStyle(0.44rem,0.44rem);
            margin-right:.32rem;
        }
        p{
            line-height:0.4rem;
        }
    }
}
.detail-per-tip .detain-title{
    .font-style(0.28rem,@base-font-color1);
    font-weight:600;
}
.detail-per-tip .detain-text{
    .font-style(0.24rem,@base-font-color3);
}
.quick-buy{
    height:.98rem;
    line-height: .98rem;
    width:100%;
    position: fixed;
    bottom:0;
    text-align: center;
    font-size:.34rem;
    color:#fff;
    background-color: #EDA835;
}
.purchase-box{
    padding-left:.32rem;
    padding-right:.3rem;
    .font-style(.26rem,@base-font-color2);
    p{
        margin-bottom:.44rem;
        .userName{
            float:left;
            padding-right:.96rem;
        }
        .createTime{
                float:right;
        }
    }
}
.unable_click{
    background:rgb(246, 219, 176);
}
</style>

