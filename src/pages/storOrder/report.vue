<template>
    <div class="report">
        <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="toBack">
        <section class="view_report">
            <h3 class="report_title">检测报告</h3>
            <p><span> 订单号：</span><span> {{orderDetail.code || '--'}}</span></p>
            <p><span>实测毛重：</span><span>{{orderDetail.realGrossWeight || '--'}}克</span></p>
            <p><span>实测净重：</span><span>{{orderDetail.realNetWeight || '--'}}克</span></p>
            <!-- <p>克重损耗：{{orderDetail.realLoss || ''}}克</p> -->

            <p v-if="orderDetail.isCash==1"><span>回收金价：</span><span>{{orderDetail.realPrice || '--'}}元/克</span></p> 
            <p><span>产品成色：</span><span>{{orderDetail.productCondition | com }}‰</span></p>
            
            <p v-if="orderDetail.isCash==1&&orderDetail.sellAmount&&orderDetail.welfare"><span>卖金总额：</span><span>{{orderDetail.sellAmount || '--'}}元</span></p>
            <p v-if="orderDetail.isCash==1&&orderDetail.welfare"><span>减免金额：</span><span>{{orderDetail.welfare || '--'}}元</span></p>
            <p v-if="orderDetail.isCash==1&&orderDetail.receiveAmount"><span>回收总额：</span><span style="color:#EDA835;">{{orderDetail.receiveAmount || '--'}}元</span></p>

            <p v-if="orderDetail.isCash==2&&orderDetail.sellAmount&&orderDetail.welfare"><span>卖金总重：</span><span>{{orderDetail.sellAmount || '--'}}克</span></p>
            <p v-if="orderDetail.isCash==2&&orderDetail.welfare"><span>减免克重：</span><span>{{orderDetail.welfare || '--'}}克</span></p>
            <p v-if="orderDetail.isCash==2&&orderDetail.receiveAmount"><span>回收总重：</span><span style="color:#EDA835;">{{orderDetail.receiveAmount || '--'}}克</span></p>

            <p><span>检测人：</span><span>{{orderDetail.verifyBy || '--'}}</span></p>
            <p><span>检测时间：</span><span>{{orderDetail.verifyTime || '--'}}</span></p>
            <p><span>检测说明：</span><span>{{orderDetail.verifyRemark || '--'}}</span></p>
            <p><span>检测结果：</span><span>{{orderDetail.verifyResult==0?'通过':'不通过'}}</span></p>
            <img :src="checkImg" alt="检测报告" preview="1">
            <div class="report_btns">
                <p @click="confirmStor" :class="{'hasConfirm':orderDetail.status==8}" v-if="orderDetail.status==6 || orderDetail.status==8">{{orderDetail.status==8?'已确认':'确认订单'}}</p>
                <p @click="tele" :class="{'contact':orderDetail.status!=6 && orderDetail.status!=8}">联系客服</p>
            </div>
        </section>
        <!-- 订单确认等待动画 -->
        <mt-popup v-model="popupVisible" popup-transition="popup-fade" :closeOnClickModal="false">
            <div class="confirmbox" v-show="awa">
               <p class="sign cir"><img class="infi_cir" src="../../images/cir.png" alt=""></p>
               <p class="wait">订单确认中，请稍后...</p> 
               <p class="con_explain">确认成功后将自动跳转至订单详情页</p>
            </div>
            <div class="confirmbox" v-show="fail">
               <p class="sign"><img src="../../images/sign.png" alt=""></p>
               <p class="wait">订单确认失败</p> 
               <p class="fail_button"><span @click="cancel">取消</span><span @click="re_confirm">重试</span></p>
            </div>
        </mt-popup>
        <a href="tel:4008196199" id="tel"></a>
    </div>
</template>
<script>
import {queryRecycleOrderDetail, confirmationResult} from '@/service/getData.js' 
import headTop from '@/components/header/head.vue'
import banner from '@/images/banner.png'

export default{
    data(){
        return{
            orderId:'',//存金订单
            orderDetail:{},//存金订单
            checkImg:null,//检测报告图片
            popupVisible:false,
            awa:true,
            fail:false,
            comfirmLimit:true,//确认按钮避免重复提交
        }
    },
    mounted(){
        this.orderId = this.$route.query.id
        this.orderDet();
    },
    computed:{

    },
    filters:{
        com(val){
            if(val){
                return val.toFixed(1)
            }else{
                return '--'
            }
        }
    },
    methods:{
        //查询用户订单详情
        async orderDet(){
            const res = await queryRecycleOrderDetail(this.orderId);
            if (res.code == 100) {
                this.orderDetail = res.content
                var arrDocument=res.content.recycleDocumentVos;
                for(var i=0,length=arrDocument.length;i<length;i++){
                    if(arrDocument[i].type==2){  //检测报告
                        this.checkImg=arrDocument[i].url
                    }
                }
            }
        },
        //用户确认订单
        confirmStor(){
            if(this.orderDetail.status==8) return;
            if(!this.comfirmLimit) return;  //限制重复提交
            this.comfirmLimit=false;

            this.popupVisible=true
            this.awa=true
            this.fail=false

            var v_this = this
            setTimeout(function(){
                v_this.con();
            },2000);
        },
        //
        async con(){
            var res=await confirmationResult(this.orderDetail.id, 0)
            if(res.code==100){
                this.popupVisible=false
                this.comfirmLimit=true;
                this.orderDet()
                this.$router.push({
                    path:'/storOrderDet',
                    query:{
                        id:this.orderId
                    }
                })
            }else{
                this.comfirmLimit=true;
                this.awa=false
                this.fail=true
            }
        },
        //拨打电话
        tele(){  //拨打电话
            var telele=document.getElementById('tel');
            telele.click();
        },
        //返回按钮
        toBack(){
            this.$router.push({
                path:'storOrderDet',
                query:{
                    id:this.orderId
                }
            })
        },
        //点击取消
        cancel(){
            this.popupVisible=false
        },
        //点击重新确认
        re_confirm(){
            this.confirmStor();
        }
    },
    components:{
        headTop
    }
}   
</script>
<style type="text/css" scoped>
.report{
    padding-top:.88rem;
    width: 100%;
    position: relative;
}
.head_goback{
    position: absolute;
    left: .3rem;
    top: .28rem;
    width: .18rem;
    height: .33rem;
}
.report_title{
    font-size:.36rem;
    color:#000000;
    text-align: center;
    font-weight:700;
    padding-bottom:.2rem;
}
.view_report>p{
    font-size:.28rem;
    color:#666666;
    padding-bottom:.08rem;
    padding-left:.4rem;
    padding-right:.4rem;
    overflow: hidden;
}
.view_report>p span:nth-child(1){
    float: left;
}
.view_report>p span:nth-child(2){
    float: right;
}
.view_report img{
    width: 100%;
    display: block;
    margin-top:.32rem;
}
.report_btns{
    height:1.28rem;
    margin-top:.6rem;
    padding-left:.4rem;
}
.report_btns p{
    text-align: center;
    width: 3.26rem;
    height: .88rem;
    line-height: .88rem;
    font-size: .32rem;
    text-align: center;
    display: inline-block;
    border-radius:4px;
}
.report_btns p:nth-child(1){
    color:#EDA835;
    border:1px solid #EDA835;
    margin-right: .09rem;
}
.report_btns p:nth-child(2){
    background-color: #EDA835;
    color: #fff;
}
.hasConfirm{
    color:#999999;
}
.contact{
    width:100%;
}
.confirmbox{
    width:4.9rem;
    height: 3.1rem;
    position: relative;
}
.wait{
    font-size:.3rem;
    color:#333;
    text-align:center;
    line-height: .5rem;
    margin-top:.2rem;
}
.sign{
    width:100%;
    text-align:center;
}
.sign img{
    width:1rem;
    height:1rem;
    margin-top:.41rem;
}
.cir{
    background:url(../../images/wat.png);
    background-position: center .42rem;
    background-size: 1.1rem;
    background-repeat: no-repeat;
}
.con_explain{
    font-size:.24rem;
    text-align:center;
    line-height:.4rem;
    color:#999999;
}
.fail_button{
    height: .8rem;
    width: 100%;
    color: #EDA835;
    font-size: .34rem;
    border-top:1px solid #dad7d7;
    position: absolute;
    bottom:0px;
}
.fail_button span{
    float: left;
    width: 50%;
    text-align:center;
    height: .8rem;
    line-height: .8rem;
}
.fail_button span:nth-child(1){
    border-right:1px solid #dad7d7;
}
.infi_cir{
    animation: mymove 1.3s infinite;
}
@keyframes mymove{
    from {transform:rotate(0deg)}
    to {transform:rotate(360deg)}
}
</style>
<style type="text/css">
.mint-popup{
    width: 4.9rem;
    height: 3.1rem;
}
</style>