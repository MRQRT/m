<template>
    <div class="attorn_jifen">
        <head-top headTitle='转出鲸鱼分'>
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
            <img slot="custom" src="../../images/jifenHelp.png" class="jifen_attorn" @click="openHelp">
        </head-top>
        <!--操作菜单-->
        <div class="operate_menu" v-show="!helpShow">
            <p>转到第三方平台
            </p>
        </div>
        <!--操作步骤-->
        <section class="third_party" v-show="!helpShow">
            <input type="text" placeholder="请输入转出数量" v-model="giveAmount" @keyup="checkInput(giveAmount,3)" @blur="checkNum(3)">
            <img src="../../images/clearinput.png" class="in_number" v-show="giveAmount" @click="giveAmount=null">
            <p class="no_user" v-show="noEnoughThird"><img src="../../images/gantanhao.png" class="third_img">{{enough2Text}}</p>
            <my-button class="confirm_attorn"  buttonText="确认转出" @click.native='giveOther'></my-button>
            <p class="mex_text">详情请咨询客服 电话：400-8196-199</p>
        </section>
        <!--转让好友攻略-->
        <div v-show="helpShow" class="help_container">
            <h4>转出鲸鱼分</h4>
            <p>1、如何查看转到第三方平台的鲸鱼分？</p>
            <p class="help_p2">选择转到第三平台，可通过黄金管家绑定</p>
            <p class="help_p2">的手机号注册并登录MEX平台查看。</p>
            <p>2、如何访问MEX第三方平台？</p>
            <p class="help_p2">登录https://www.mex.link/index.html</p>
            <p class="help_p2">查看转出的鲸鱼分。</p>
            <div class="close_help">
                <img src="../../images/closeHelp.png" @click="helpShow=false">
            </div>
        </div>
        <!--确认转让-->
        <mt-popup
        v-model="popupVisibleGive"
        position="middle" id="popupVisibleGive" :modal="boo">
            <p>土豪大大，鲸鱼分已转出</p>
        </mt-popup>
    </div>
</template>
<script>
import headTop from '../../components/header/head.vue';
import myButton from '../../components/myButton/myButton.vue';
import { clearNoNum } from '../../config/mUtils.js';
import { Toast,Indicator } from 'mint-ui'
import { turnIntegralOfThird,queryIntegralBalance } from '@/service/getData'

    export default {
        data() {
            return {
                helpShow:false, //转让好友攻略
                giveAmount:null,//输入的转赠数量
                popupVisibleGive:false,
                boo:false,
                integralAmount:null,//用户持有总积分
                enough2Text:'',//转让第三方时金额不满足的提示语
                noEnoughThird:false//转入第三方金额过多或过少
            }
        },
        mounted(){
            this.queryIntegralBalance()
        },
        filters:{

        },
        methods:{
            checkInput(val,type) {  
                this.giveAmount=clearNoNum(val,0);
            },
            checkNum(type){
                this.giveAmount=this.giveAmount.replace(/[^0-9]/g,'');
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
            //点击转让 调用接口判断用户有没有注册过
            async giveOther(){
                if(this.giveAmount*1>this.integralAmount){
                    this.noEnoughThird=true
                    this.enough2Text="超过转出限额，请重新输入"
                    return
                }else if(this.giveAmount*1<1000){
                    this.noEnoughThird=true
                    this.enough2Text="转出数量不能少于1000鲸鱼分"
                    return
                }else if(this.giveAmount>100000){
                    this.noEnoughThird=true
                    this.enough2Text="超过转出限额，请重新输入"
                    return
                }else{
                    this.noEnoughThird=false
                    this.enough2Text=""
                }
                
                Indicator.open()
                var result=await turnIntegralOfThird(this.giveAmount)
                if(result) Indicator.close();
                if(result.code==100){
                    var that=this;
                    setTimeout(function(){
                        that.popupVisibleGive=true
                    },40)
                    setTimeout(function(){
                        that.popupVisibleGive=false
                    },1500)
                }else{
                    Toast({
                        message:result.message,
                        position:'bottom',
                        duration:1500
                    })
                }
            },
            goBack(){
                Indicator.close()
                this.$router.back(-1)
            },
            openHelp(){
                Indicator.close()
                this.helpShow=true
            }
        },
        watch:{
            giveAmount(val){
                this.noEnoughThird=false
                this.enough2Text=""
            },
        },
        components:{
            headTop,
            myButton
        }
    }
</script>
<style scoped lang="less">
@import '../../style/common.less';
    .attorn_jifen{
        padding-top:.88rem;
        padding-left:.3rem;
        padding-right:.3rem;
        #head_top{
            border-bottom:1px solid #EEEEEE;
        }
    }
    .attorn_jifen .jifen_attorn{
       width:.44rem;
       height:.44rem;
       position:absolute;
       right:0.3rem;
    }
    .operate_menu{
        padding-top:0.8rem;
        font-size:0.3rem;
        color:#666666;
        text-align:center;
    }
    .third_party{
        padding-top:.72rem;
        position:relative;
    }
    .third_party .in_number{
        width:.36rem;
        height:.36rem;
        position: absolute;
        top:1.13rem;
        right:0;
    }
    .third_party input{
        width:100%;
        display:block;
        padding-top:.42rem;
        padding-bottom:.42rem;
        border-bottom:1px solid #EEEEEE;
        padding-left:.22rem;
        color:#333333;
        font-size:.28rem;
    }
    input::-webkit-placeholder{
        color:#999999;
        font-size:.28rem;
    }
    input::-moz-placeholder{
        color:#999999;
        font-size:.28rem;
    }
    input::-ms-placeholder{
        color:#999999;
        font-size:.28rem;
    }
    input::placeholder{
        color:#999999;
        font-size:.28rem;
    }
    .confirm_attorn{
        width:6.9rem;
        height:.88rem;
        background-color:#F2B643;
        font-size:.34rem;
        color:#fff;
        line-height:.88rem;
        .radius(2px);
    }
    .myBtn.confirm_attorn{
        margin-top:1.6rem;
        position:relative;
    }
    .mex_text{
        font-size:.28rem;
        color:#666666;
        text-align:center;
        padding-top:1.02rem;
    }
    .help_container{
        text-align:center;
        h4{
            font-size:.4rem;
            color:#000;
            padding-top:.56rem;
            padding-bottom:.56rem;
        }
        p{
            padding-left:.76rem;
            text-align:left;
            font-size:.28rem;
            color:#666666;
            padding-bottom:.2rem;
        }
        img{
            width:.44rem;
            height:.44rem;
        }
        .close_help{
            margin-top:3.92rem;
        }
    }
    .help_container .help_p2{
        padding-left:1.2rem;
    }
    .third_party .no_user{
        font-size:.22rem;
        color:#FF6D39;
        margin-top:.2rem;
    }
    .third_party .third_img{
        width:.24rem;
        height:.24rem;
        position: relative;
        top:.04rem;
        margin-right:.1rem;
    }
    #popupVisibleGive.mint-popup{
        width:4.08rem;
        height:1.48rem;
        background-color: rgba(0,0,0,0.6);
        color:#fff;
        line-height:1.48rem;
        text-align: center;
        font-size:.3rem;
        border-radius: 10px;
    }
</style> 

