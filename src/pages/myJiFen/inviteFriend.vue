<template>
    <div class="invite_container" :class="{'bottom':!helpShow}">
        <head-top headTitle='邀请好友'>
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/jiFen')">
            <img slot="custom" src="../../images/jifenHelp.png" class="jifen_help" @click="helpShow=true">
        </head-top>
        <!--主要内容-->
        <div v-show="!helpShow" class="main_container">
            <div class="invite_banner">
               <img src="../../images/inviteBan.png">
            </div>
            <!--天天新朋友-->
            <section class="in_friend">
                <h4>天天新朋友</h4>
                <p class="invite_num">今天已邀请 <span style="color:#EDA835;">{{invitedNum}}</span></p>
                <div class="user_list">
                    <p v-for="(item,index) in invitedList" class="each_user" :key="index">
                        <span class="each_user_sp1">{{item.buyInvitedUserName}}加入管家</span>
                        <span class="each_user_sp2">赠<span style="color:#EDA835;">{{item.integral}}</span>个鲸鱼分</span>
                    </p>
                </div>
                
            </section>
            <!--壕友知多少-->
            <section class="buy_list" v-infinite-scroll="loadMore" infinite-scroll-distance="10" infinite-scroll-disabled="loading">
                <h4>壕友知多少</h4>
                <div class="user_list">
                 <p v-for="(item,index) in buyList" class="each_user" :key="index">
                    <span class="each_user_sp1">{{item.buyInvitedUserName}}好友助力</span>
                    <span class="each_user_sp2">赠<span style="color:#EDA835;">{{item.integral}}</span>个鲸鱼分</span>
                 </p>
                </div>
            </section>
            <mt-button type="primary" class="give_btn" @click="toInvite">发邀请函</mt-button>
        </div>
        <!--鲸鱼币攻略-->
        <div v-show="helpShow" class="help_container">
            <h4>邀请规则</h4>
            <p class="help_p1">1、邀请1位好友实名注册获得20鲸鱼分，每天最高100，但邀请人数无上限；</p>
            <p class="help_p2">2、所邀请好友成功购买指定商品（爱有金商城标注送鲸鱼分的），+20%鲸鱼分，好友助力无上限；</p>
            <div class="close_help">
                <img src="../../images/closeHelp.png" @click="helpShow=false">
            </div>
        </div>
    </div>
</template>
<script>
import headTop from '../../components/header/head.vue';
import { Button,InfiniteScroll  } from 'mint-ui'
import { queryFriendsHelpList,queryInvitedFrendsList,queryMyProfil } from '@/service/getData'
import { IP } from "@/config/mUtils.js"
import { mapState } from 'vuex'

    export default {
        data() {
            return {
                helpShow:false,//攻略是否展示
                searchCondition: {  //分页属性
                    pageNo: 1,  
                   pageSize: 5
                },
                invitedList:[],//邀请的用户
                invitedNum:null,//已邀请的人数
                buyList:[],//购买鲸鱼章好友助力列表
                loading:false,
                pages:null,//总页数
                userName:null //邀请人的姓名(即邀请码)
            }
        },
        computed:{
            ...mapState([
                'token'
            ])
        },
        mounted() {
            this.token ? window.sendUserId(this.token.split('_')[0],this.token.split('_')[1]) : window.sendUserId('') 
            this.queryInvitedFrendsList()
            this.queryMyProfil()
        },
        filters:{

        },
        methods:{
            //发送邀请函
            toInvite(){
                var ip = IP();
                var href=ip+'/#/invitePage?inviteCode='+this.userName
                if(window.sharePage && (localStorage.getItem('isWebview')=='andriod' || localStorage.getItem('isWebview')=='ios')){
                    window.sharePage('我刚刚在黄金管家挖到50个鲸鱼分，一起来!','邀友好礼，海量鲸鱼分等你拿!',href)
                }else{
                    //检测是苹果设备或是安卓设备
	                var ua = navigator.userAgent.toLowerCase();
	                var na=''
	                if (/iphone|ipad|ipod/.test(ua)) {
		                na='iphone'
		            } else if (/android/.test(ua)) {
			            na='android'	
                    }
			        if(na=='iphone'){
			            window.location.href='http://itunes.apple.com/cn/app/jie-zou-da-shi/id1028299545?mt=8'
			        }else{
			            window.location.href='http://android.myapp.com/myapp/detail.htm?apkName=com.mz.chamberlain'
			        }
                }
            },
            //请求用户的用户名
            async queryMyProfil(){
                var res=await queryMyProfil()
                if(res.code==100){
                    this.userName=res.content.telephone
                }
            },
            //查询用户邀请好友列表
            async queryInvitedFrendsList(){
                var res=await queryInvitedFrendsList()
                if(res.code==100){
                    this.invitedList=res.content
                    this.invitedNum=res.content.length
                }
            },
            //滚动加载
            async loadMore() {
              this.loading = true;
              var res=await queryFriendsHelpList(this.searchCondition.pageNo++,this.searchCondition.pageSize)
              if(res.code==100){
                if(res.content.pages){ //不为空
                    if(this.buyList.length){
                        this.buyList=this.buyList.concat(res.content.list)
                        if(this.searchCondition.pageNo>this.pages) return;
                        this.loading = false;
                    }else{
                       this.pages=this.searchCondition.pageNo
                       this.buyList=res.content.list 
                       if(this.searchCondition.pageNo>this.pages) return;
                       this.loading = false;
                    }
                }
              }else{
                 this.loading = false;
              }
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
    .invite_container{
        background-color: #eeeeee;
        min-height:100vh;
    }
    .invite_container.bottom{
        padding-bottom:.98rem;
    }
    .main_container{
        padding-top:.88rem;
    }
    .invite_banner img{
        width:100%;
    }
    .invite_container .in_friend{
        background-color: #fff;
        margin-top:.14rem;
    }
    .invite_container .buy_list{
        background-color: #fff;
        margin-top:.2rem;
    }
    .in_friend h4,.buy_list h4{
        font-size:.34rem;
        color:#333333;
        font-weight: 700;
        text-align: center;
        padding-top:.6rem;
        position: relative;
    }
    .in_friend h4:before,.buy_list h4:before{
        content:'';
        width:.8rem;
        height:.02rem;
        position: absolute;
        background-image: url(../../images/gradientLeft.png);
        background-size:100% 100%;
        top:.8rem;
        left:1.88rem;
    }
     .in_friend h4:after,.buy_list h4:after{
        content:'';
        width:.8rem;
        height:.02rem;
        position: absolute;
        background-image: url(../../images/gradientRight.png);
        background-size:100% 100%;
        top:.8rem;
        right:1.88rem;
    }
    .buy_list h4{
        padding-bottom:.56rem;
    }
    .in_friend .invite_num{
        font-size:.24rem;
        color:#999999;
        text-align: center;
        padding-top:.26rem;
        padding-bottom:.56rem;
    }
    .in_friend .user_list,.buy_list .user_list{
        padding-left:1.06rem;
        padding-bottom:.34rem;
    }
    .in_friend .each_user,.buy_list .each_user{
        font-size:.24rem;
        color:#666666;
        padding-bottom:.26rem;
    }
    .in_friend .each_user .each_user_sp1,.buy_list .each_user .each_user_sp1{
        padding-right:1.28rem;
    }
    .invite_container .jifen_help{
        width:.44rem;
        height:.44rem;
        position: absolute;
        right:.3rem;
    }
    .invite_container .jifen_amount{
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
        display: flex;
        padding-left:.3rem;
        padding-top:.72rem;
        padding-bottom:.4rem;
        text-align: center;
        font-size:.24rem;
        color:#333333;
        background-color:#fff;
    }
    .jifen_operate div{
        width:2.14rem;
        height:1.42rem;
        box-shadow:1px 0 10px rgba(0,0,0,.2);
        padding-top:.3rem;
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
    }
    .jifen_detail{
        margin-top:.2rem;
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
        padding-top:.38rem;
    }
    .jifen_detail div:last-child{
        border-bottom:none;
    }
    .jifen_detail .detail_p1{
        display: flex;
    }
    .jifen_detail .detail_p1 .detail_p1_name{
        font-size:.3rem;
        color:#333333;
        flex:1;
    }
    .jifen_detail .detail_p1 .detail_p1_amount{
        font-size:.3rem;
        color:#FF6D39;
        flex:2;
        text-align: right;
    }
    .jifen_detail .detail_p1 .detail_p1_amount.green{
        color:#5BC872;
    }
    .jifen_detail .detail_p2{
        font-size:.24rem;
        color:#999999;
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
        margin-top:5rem;
        text-align: center;
    }
    .help_container img{
        width:.44rem;
        height:.44rem;
    }
    .mint-button{
        border-radius: 0;
    }
    .invite_container #head_top{
        border-bottom:1px solid #EEEEEE;
    }
</style>

