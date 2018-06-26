<template>
    <div class="jifen_container" :class="{'bottom':!helpShow}">
        <head-top headTitle='我的鲸鱼分'>
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="toMine">
            <img slot="custom" src="../../images/jifenHelp.png" class="jifen_help" @click="helpShow=true">
        </head-top>
        <!--主要内容-->
        <div v-show="!helpShow" class="main_container">
            <div class="jifen_amount">
                <p class="amount_text">我的鲸鱼分</p>
                <p class="amount_number">{{integralAmount}}</p>
            </div>
            <!--进入其他页面的入口-->
            <div class="jifen_operate">
                <div @click="toJingYu">
                    <img src="../../images/toExtract.png">
                    <p class="operate_name">爱有金</p>
                    <p class="operate_award" style="margin-bottom:.06rem;">指定商品</p>
                    <p class="operate_award">每消费1元＋1</p>
                </div>
                <div :class="{'hasName':nameBg}" style="margin-left:.24rem;margin-right:.24rem;" @click="toRealName">
                    <img :src="isRealName">
                    <p class="operate_name" v-show="nameBg">已实名</p>
                    <p class="operate_name" v-show="!nameBg">实名认证</p>
                    <p class="operate_award" v-show="!nameBg">首次认证＋50</p>
                </div>
                <div @click="$router.push('/inviteFriend')">
                    <img src="../../images/invite.png">
                    <p class="operate_name">邀请好友</p>
                    <p class="operate_award" style="margin-bottom:.06rem;">每邀请1个好友＋20</p>
                    <p class="operate_award">好友提金＋20%</p>
                </div>
            </div>
            <!--总量恒定 只送不卖-->
            <div class="constant" :class="{'bigHeight':!details || !details.length}">
                <img src="../../images/zlhd.png">
            </div>
            <!--交易明细-->
            <mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false"  ref="loadmore"  class="loadmore_jifen" v-show="details && details.length">
            <section class="jifen_detail">
                <h4>交易明细</h4>
                <div v-for="(item,index) in details" :key="index">
                    <p class="detail_p1">
                        <span class="detail_p1_name">{{item.integralReasonType==0?'去买黄金':(item.integralReasonType==1?'实名认证':(item.integralReasonType==2?'邀请好友':(item.integralReasonType==3?'好友助力':(item.integralReasonType==4?'好友转让':'转让成功'))))}}</span>
                        <span class="detail_p1_amount" :class="{'green':item.integralReasonType==5|| item.integralReasonType==6}" style="font-family:PingFang-SC-Regular;">{{(item.integralReasonType==5 || item.integralReasonType==6)?'-':'+'}}{{item.integral}}</span>
                    </p>
                    <p class="detail_p2">{{item.createTime}}</p>
                </div>
            </section>
            </mt-loadmore>
            <mt-button type="primary" class="give_btn" @click="$router.push('attorn')">转让鲸鱼分</mt-button>
        </div>
        <!--鲸鱼币攻略-->
        <div v-show="helpShow" class="help_container">
            <h4>鲸鱼分攻略</h4>
            <p class="help_p1">1、鲸鱼分是基于区块链技术推出的积分体系， 限量发行，其应用功能也将陆续开放。鲸鱼分每两年产出量减少一半，随着时间的推移获取难度将越来越大；</p>
            <p class="help_p2">2、如何获得鲸鱼分？</p>
            <p class="help_p3">1）成功购买指定商品（爱有金商城标注送鲸鱼分的）每消费1元+1鲸鱼分；</p>
            <p class="help_p4">2）首次完成实名注册＋50鲸鱼分；</p>
            <p class="help_p5">3）所邀请好友实名注册＋20鲸鱼分；</p>
            <p class="help_p6">4）所邀请好友成功购买指定商品（爱有金商城标注送鲸鱼分的）＋20%鲸鱼分；</p>
            <div class="close_help">
                <img src="../../images/closeHelp.png" @click="helpShow=false">
            </div>
        </div>
    </div>
</template>
<script>
import headTop from '../../components/header/head.vue';
import { Button,Popup,Toast,Indicator } from 'mint-ui'
import { queryMyProfil,queryIntegralBalance,queryIntegralList,queryProductId } from '@/service/getData'
import smrz from '@/images/smrz.png'//未实名
import hasSm from '@/images/hasSm.png'//未实名

    export default {
        data() {
            return {
                isRealName:smrz,//是否已实名(显示图片)
                nameBg:false,//实名时选择的样式
                helpShow:false,//攻略是否展示
                allLoaded:false,
                false:false,
                details:[],//积分来源列表
                integralAmount:null,//鲸鱼币持有
                searchCondition: {  //分页属性
                     pageNo: 1,  
                   pageSize: 5
                },//接口加载数据时需要
                pages:null,//总页数
                productId:null//鲸鱼币产品id
            }
        },
        mounted() {
           this.queryMyProfil()
           this.queryIntegralBalance()
           this.queryIntegralList()
           this.queryProductId()
        },
        methods:{
            //查询鲸鱼币产品ID
            async queryProductId(){
                var res=await queryProductId()
                if(res.code==100){
                    this.productId=res.content.productId
                }
            },
            //查询用户总积分（鲸鱼币）
            async queryIntegralBalance(){
                var res=await queryIntegralBalance()
                if(res.code==100){
                    if(res.content && res.content.integralBalance){
                        this.integralAmount=res.content.integralBalance
                    }else{
                        this.integralAmount=0
                    }
                }
            },
            //跳转实名认证
            toRealName(){
                if(this.nameBg) return;
                this.$router.push('/personHomepage/authentication')
            },
            //购买鲸鱼章
            toJingYu(){
                this.$router.push({
                    path:'/productDetail',
                    query:{
                        id:this.productId //鲸鱼币的id
                    }
                })
            },
            //查询用户积分列表
            async queryIntegralList(){
                Indicator.open({
                    spinnerType: 'snake'
                });
                this.searchCondition.pageNo=1
                var res=await queryIntegralList(this.searchCondition.pageNo,this.searchCondition.pageSize)
                if(res.code==100){ //0购买黄金，1实名认证，2邀请好友，3好友助力，4好友转让，5转让成功',
                    this.details=res.content.list
                    this.pages=res.content.pages
                    if(this.searchCondition.pageNo>=this.pages){
                        this.allLoaded=true
                    }
                    Indicator.close()
                }else{
                    Indicator.close()
                }
            },
            //查询用户积分列表(更多)
            async loadMore(){
                this.searchCondition.pageNo+=1
                var res=await queryIntegralList(this.searchCondition.pageNo,this.searchCondition.pageSize)
                if(res.code==100){
                    this.details=this.details.concat(res.content.list)
                    if(this.searchCondition.pageNo>=this.pages){
                        this.allLoaded=true
                    }
                }
            },
            //上拉加载更多
            loadBottom(){
                var that = this;
                setTimeout(function(){
                    that.loadMore();
                    that.$refs.loadmore.onBottomLoaded();
                },800)
            },
            //请求接口判断此用户用没有实名认证
            async queryMyProfil(){
              var res=await queryMyProfil()
              if(res.code==100){
                if(res.content.realnamed==1){
                    this.isRealName=hasSm 
                    this.nameBg=true
                }else{
                    this.isRealName=smrz
                    this.nameBg=false
                }
              }
            },
            //返回页面
            toMine(){
                Indicator.close();
                window.toApp();
                this.$router.push('/mine');
            },
        },
        watch:{
            
        },
        components: {
            headTop,
        },
        destroyed(){
            
        }
    }
</script>
<style scoped>
    .jifen_container{
        background-color: #eeeeee;
        min-height:100vh;
    }
    .jifen_container.bottom{
        padding-bottom:.98rem;
    }
    .main_container{
        padding-top:.88rem;
    }
    .jifen_container .jifen_help{
        width:.44rem;
        height:.44rem;
        position: absolute;
        right:.3rem;
    }
    .jifen_container .jifen_amount{
        text-align: center;
        padding-top:.8rem;
        background-color:#fff;
    }
    .jifen_amount .amount_text{
        font-size:.24rem;
        color:#999999;
    }
    .jifen_amount .amount_number{
       font-size:.8rem;
       color:#EDA835;
    }
    .jifen_operate{
        display: -webkit-flex;
        display: -o-flex;
        display: -moz-flex;
        display: flex;
        -webkit-justify-content: center;
        -moz-justify-content: center;
        -o-justify-content: center;
        justify-content: center;
        padding-top:.72rem;
        padding-bottom:.4rem;
        text-align: center;
        font-size:.24rem;
        color:#333333;
        background-color:#fff;
    }
    .jifen_operate div{
        width:2.14rem;
        height:2.14rem;
        box-shadow:1px 0 10px rgba(0,0,0,.2);
        padding-top:.4rem;
        font-size:.24rem;
        color:#333333;
    }
    .jifen_operate div.hasName{
        box-shadow:none;
        background-color:#F5F5F5;
    }
    .jifen_operate div:nth-child(2){
        margin-left:.24rem;
        margin-right:.24rem;
    }
    .jifen_operate img{
        width:.5rem;
        height:.5rem;
        margin-bottom:.16rem;
    }
    .jifen_operate .operate_name{
        font-size:.24rem;
        height:.24rem;
        line-height:.24rem;
        color:#333333;
        margin-bottom:.1rem;
    }
    .jifen_operate .operate_award{
        font-size:0.2rem;
        color:#999999;
        height:0.2rem;
        line-height:0.2rem;
    }
    .jifen_detail{
        background-color: #fff;
        padding-left:.3rem;
        padding-right:.3rem;
        margin-bottom:.2rem;
    }
    .jifen_detail h4{
        font-size:.34rem;
        color:#333333;
        height:1.2rem;
        line-height:1.2rem;
        border-bottom:1px solid #E1E1E1;
        font-weight:600;
    }
    .jifen_detail div{
        height:1.4rem;
        border-bottom:1px solid #E1E1E1;
        padding-top:.28rem;
    }
    .jifen_detail div:last-child{
        border-bottom:none;
    }
    .jifen_detail .detail_p1{
        display: flex;
        margin-bottom:.08rem;
    }
    .jifen_detail .detail_p1 .detail_p1_name{
        font-size:.3rem;
        color:#333333;
        flex:3;
    }
    .jifen_detail .detail_p1 .detail_p1_amount{
        font-size:.3rem;
        line-height:.3rem;
        color:#FF6D39;
        flex:2;
        text-align: right;
        position: relative;
        top:0.3rem;
    }
    .jifen_detail .detail_p1 .detail_p1_amount.green{
        color:#5BC872;
    }
    .jifen_detail .detail_p2{
        font-size:.24rem;
        color:#999999;
        letter-spacing:1px;
        word-spacing: 2px;
    }
    .give_btn{
        width:100%;
        height:.98rem;
        background-color: #F2B643;
        line-height:.98rem;
        text-align: center;
        font-size:.34rem;
        color:#FFFFFF;
        position: fixed;
        bottom:0;
    }
    .help_container{
        background-color: #fff;
        height:100vh;
        padding-top:.88rem;
        padding-left:.76rem;
        padding-right:.76rem;
    }
    .help_container h4{
        padding-top:.56rem;
        font-size:.4rem;
        color:#000000;
        text-align: center;
        padding-bottom:.6rem;
        border-bottom:1px solid #EEEEEE;
    }
    .help_container .help_p1{
        padding-top:.4rem;
    }
    .help_container p{
        font-size:.28rem;
        color:#666666;
        line-height:.5rem;
    }
    .help_container .close_help{
        margin-top:3.2rem;
        text-align: center;
    }
    .help_container img{
        width:.44rem;
        height:.44rem;
    }
    .jifen_container .constant{
        text-align: center;
        margin-top:.21rem;
        margin-bottom:.19rem;
    }
    .jifen_container .constant.bigHeight{
        margin-top:2rem;
        margin-bottom:3rem;
    }
    .jifen_container .constant img{
        width:5rem;
        height:1rem;
    }
    .mint-button{
        border-radius: 0;
    }
    .jifen_container #head_top{
        border-bottom:1px solid #EEEEEE;
    }
</style>

