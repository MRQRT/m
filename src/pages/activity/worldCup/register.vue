<template>
	<div class="world_cup">
		<head-top headTitle="" class="head-top">
            <span slot="head_goback" class="backward" @click="goBack">返回</span>
            <span slot="custom" class="activity_rule" ref="activity" @click="goRule">活动规则</span>
		</head-top>
        <div class="greensward">
            <!--跑马灯所有用户获取记录-->
            <div class="horse_race_lamp">
                <ul>
                    <li v-for="(item,index) in registlist" :key="index">{{item.userName}}为世界杯点赞获得{{item.weight*1000}}mg黄金</li>
                </ul>
            </div>
            <!--参与签到部分-->
            <div class="register_container">
                <p class="view_list" @click="viewRanking">查看周点赞榜</p>
                <h4 class="total_count">总点赞数</h4>
                <p class="total_number">
                    <span>{{totalCount | formatNum}}</span>
                </p>
                <p class="my_regist">我的点赞:&nbsp;{{myCount}}</p>
                <!--签到按钮-->
                <!-- <div class="operate_regist">
                    <p class="operate_regist_btn1" :class="{'white':!registImg,'actived':!registImg}" @touchstart="regist" @touchmove="regist" @touchend="registEnd">
                        {{btn1Txt}}
                        <img :src="registImg" v-show="registImg" :class="{'zan':!imgBoolean}">
                    </p>
                    <p class="operate_regist_btn2" @click="inviteOrElse">{{hasElse?'好友点赞X'+elseCount:btn2Txt}}</p>
                </div> -->
                <!-- <p class="warm_tip">注：为了让更多的朋友拿到奖品，点赞榜每周结算一次，活动持续5周！</p> -->
                <p class="warm_tip">活动已结束</p>
                <p class="divide_line"></p>
                <!--奖项设置-->
                <div class="award_setup">
                    <h4>奖项设置</h4>
                    <img src="../../../images/award1.png">
                    <img src="../../../images/award2.png">
                    <img src="../../../images/award3.png">
                </div>
                <div class="for_worldCup" @click="toExtract">为世界杯助力</div>
            </div>
            <!--点赞成功获取黄金提示窗-->
            <div class="register_window" v-if="award_window">
                <h4>恭喜！</h4>
                <p class="in_weight">点赞获得{{registerWeight}}</p>
                <p class="view_amount">已存入您的黄金账户余额</p>
                <button class="to_amount" @click="toMyGold">查看余额</button>
            </div>
            <!--点赞成功未获取黄金提示窗-->
            <div class="register_window" v-if="no_award_window">
                <h4>可惜！</h4>
                <p class="in_weight">这次点赞没能获取黄金</p>
                <p class="view_amount">再接再厉</p>
            </div>
        </div>
	</div>
</template>
<script>
    import headTop from '@/components/header/head.vue';
    import { getStyle,IP } from '@/config/mUtils'
    import beforeZan from '@/images/beforeZan.png'
    import afterZan from '@/images/afterZan.png'
    import { mapState } from 'vuex'
    import { Toast,Indicator } from 'mint-ui';
    import { queryUserLikeInFo,queryRollInfo,queryTotalLikeCount,friendsInLike,signInLike,queryMyProfil } from '@/service/getData'
	export default {
		data(){
			return {
                totalCount:0,//总点赞数
                myCount:0,//我的点赞数
                btn1Txt:'签到点赞',//按钮1文本
                btn2Txt:'邀请好友得点赞机会',//按钮2文本
                registImg:beforeZan,//签到按钮图片
                imgBoolean:true,//代表点赞中
                registlist:[], //获得黄金用户
                ul:null, //跑马灯的主角
                btnControl:true,//避免重复请求
                hasElse:false,//是否有额外的点赞机会,通过接口获得该变量的真假
                elseCount:0,//额外点赞次数
                registerWeight:null,//点赞获得的克重
                award_window:false,//签到奖励窗口
                no_award_window:false,//签到没有奖励窗口
                userName:null,//用户名，发送邀请函时需要
                inviteCode:null,//邀请码
                activityId:null,//活动id
                search:false,//邀请用户进来的带有参数
                ip:IP(),//邀请链接前缀
                timer:null//跑马灯定时器
			}
		},
        created(){
            
        },
		mounted() {
            this.token ? this.queryUserLikeInFo() : ''
            var that=this;
            document.querySelector('.register_container').onclick=function(){
                that.award_window=false;that.no_award_window=false;
            }
            this.queryTotalLikeCount()
            this.queryRollInfo()
            this.token ? this.queryMyProfil() : ''
            this.ul=document.querySelector('.horse_race_lamp ul')
            var search=window.location.hash.split('?')
            if(search && search[1]){
                this.search=true //是链接用户进来的
                var searchArr=search[1].split('&')
                var arr1=searchArr[0].split('=')
                if(arr1[0]=='inviteNum'){
                    this.inviteCode=arr1[1]
                }
                var arr2=searchArr[1].split('=')
                if(arr2[0]=='activityId'){
                    this.activityId=arr2[1]
                }
                return
            }
        },
        watch:{
            token(){
                this.token ? this.queryUserLikeInFo() : ''
                this.token ? this.queryMyProfil() : ''
            }
        },
        computed:{
            ...mapState([
                'token'
            ])
        },
        filters:{
            formatNum(val){
                var temp=val.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                return temp;
            }
        },
		methods:{
            //跳转到我的黄金
            toMyGold(){
                var ua = navigator.userAgent.toLowerCase();
			    if(localStorage.getItem('isWebview')=='andriod' || localStorage.getItem('isWebview')=='ios'){
                    this.$router.push('myGold')
			    }else{ //在普通浏览器或微信里
	    		    if (/iphone|ipad|ipod/.test(ua)) {
		    		    window.location.href='http://itunes.apple.com/cn/app/jie-zou-da-shi/id1028299545?mt=8'
				    } else if (/android/.test(ua)) {
					    window.location.href='http://android.myapp.com/myapp/detail.htm?apkName=com.mz.chamberlain'	
				    }
			    }
            },
            //查询用户点赞信息
            async queryUserLikeInFo(){
                var result=await queryUserLikeInFo();
                if(result.code==100){
                    this.myCount=result.content.myLikeCount
                    this.activityId=result.content.activityId
                    //今天是否可点赞
                    if(result.content.likeAmount){
                        this.btn1Txt='签到点赞'
                        this.registImg=beforeZan
                    }else{
                        this.btn1Txt='已签到'
                        this.registImg=null
                    }
                    
                    //是否有额外点赞的机会
                    if(result.content.friendsAmount){
                        this.hasElse=true;this.elseCount=result.content.friendsAmount
                    }else{
                        this.hasElse=false;this.elseCount=result.content.friendsAmount
                    }
                }
            },
            //查询点赞获取黄金滚动信息
            async queryRollInfo(){
                var res=await queryRollInfo()
                if(res.code==100){
                    this.registlist=res.content
                    setTimeout(() => {
                        this.animateHourse()
                    }, 100);
                    
                }
            },
            //查询总点赞数量
            async queryTotalLikeCount(){
                var res=await queryTotalLikeCount();
                if(res.code==100){
                    this.totalCount=res.content
                }
            },
            goBack(){
                Indicator.close()
                var ua = navigator.userAgent.toLowerCase();
			    if(localStorage.getItem('isWebview')=='andriod' || localStorage.getItem('isWebview')=='ios'){
				    window.toApp();
                    this.$router.push('/buyGold')
			    }else{ //在普通浏览器或微信里
	    		    if (/iphone|ipad|ipod/.test(ua)) {
		    		    window.location.href='http://itunes.apple.com/cn/app/jie-zou-da-shi/id1028299545?mt=8'
				    } else if (/android/.test(ua)) {
					    window.location.href='http://android.myapp.com/myapp/detail.htm?apkName=com.mz.chamberlain'	
				    }
			    }
            },
            goRule(){
                this.$router.push('/rule')
            },
            animateHourse(){
                var that=this;
                var length=this.registlist.length
                var li=document.querySelector('.horse_race_lamp li')
                this.ul.style.width=li.offsetWidth*(length+0.2)+'px'
                var width=li.offsetWidth*(length+0.2);
                this.timer=setInterval(function(){
                    var left=getStyle(that.ul,'left').split('p')[0]-0;
                    if(left<=-width){
                        that.ul.style.left=20+'px'
                    }else{
                        that.ul.style.left=(left-1)+'px'
                    }
                },37)
            },
            //签到点赞
            async signInLike(){
                if(!this.btnControl) return;
                Indicator.open({
                    spinnerType: 'snake'
                });
                //调用签到点赞的接口
                var res=await signInLike()
                this.btnControl=false
                console.log(res)
                if(res.code==100){
                    this.btnControl=true
                    Indicator.close()
                    this.totalCount+=1
                    this.myCount+=1
                    this.registImg=null
                    this.btn1Txt='已签到'
                    this.imgBoolean=true
                    if(res.content.bool==1){
                        this.registerWeight=res.content.message
                        this.award_window=true
                    }else{
                        this.no_award_window=true
                    }
                }else if(res.code==401){
                    Indicator.close()
                    this.btn1Txt='签到点赞'
                    this.registImg=beforeZan
                    this.imgBoolean=true
                    this.btn2Txt='邀请好友得点赞机会'
                    this.hasElse=false
                    this.elseCount=0
                    this.btnControl=true
                    this.myCount=0
                    Toast({
                        message:res.message,
                        position:'bottom'
                    })
                }else{
                    Indicator.close()
                    this.queryTotalLikeCount()
                    this.queryUserLikeInFo()
                    this.queryRollInfo()
                    this.btnControl=true
                    Toast({
                        message:res.message,
                        position:'bottom'
                    })
                }
            },
            //点击签到点赞按钮
            regist(){
                if(!this.token){ 
                    if(this.search){
                        this.$router.push({ 
                            path:'loginIn',
                            query:{
                                from:'register',
                                inviteCode:this.inviteCode,
                                activityId:this.activityId

                            }
                        })
                    }else{
                         this.$router.push({ 
                            path:'loginIn',
                            query:{
                                from:'register'
                            }
                        })
                    }
                    return
                }
                if(this.btn1Txt=='已签到') return;
                this.registImg=afterZan
                this.imgBoolean=false
            },
            //签到点赞结束，触发点赞接口
            registEnd(){
                if(!this.token) return;
                if(this.btn1Txt=='已签到') return;
                this.signInLike()
            },
            //请求用户的用户名
            async queryMyProfil(){
                var res=await queryMyProfil()
                if(res.code==100){
                    this.userName=res.content.telephone
                }
            },
            //邀请好友或额外获得点赞机会
            async inviteOrElse(){
                if(!this.btnControl) return;
                if(!this.token){ 
                    if(this.search){
                        this.$router.push({ 
                            path:'loginIn',
                            query:{
                                from:'register',
                                inviteCode:this.inviteCode,
                                activityId:this.activityId

                            }
                        })
                    }else{
                         this.$router.push({ 
                            path:'loginIn',
                            query:{
                                from:'register'
                            }
                        })
                    }
                    return
                }
                if(this.hasElse){//有额外机会
                    Indicator.open({
                        spinnerType: 'snake'
                    });
                    //调用点赞接口
                    var res=await friendsInLike()
                    this.btnControl=false
                    if(res.code==100){
                        Indicator.close()
                        this.elseCount--
                        if(this.elseCount==0){
                            this.hasElse=false
                        }
                        this.btnControl=true
                        this.totalCount+=1
                        this.myCount+=1
                        if(res.content.bool==1){
                            this.registerWeight=res.content.message
                            this.award_window=true
                        }else{
                            this.no_award_window=true
                        }
                    }else if(res.code==401){
                        Indicator.close()
                        this.btn1Txt='签到点赞'
                        this.registImg=beforeZan
                        this.imgBoolean=true
                        this.btn2Txt='邀请好友得点赞机会'
                        this.hasElse=false
                        this.elseCount=0
                        this.btnControl=true
                        this.myCount=0
                        Toast({
                            message:res.message,
                            position:'bottom'
                        })
                    }else{
                        Indicator.close()
                        this.queryTotalLikeCount()
                        this.queryUserLikeInFo()
                        this.queryRollInfo()
                        this.btnControl=true
                        Toast({
                            message:res.message,
                            position:'bottom'
                        })
                    }
                }else{ //邀请好友获得点赞机会
                    var href=this.ip+"/#/register?inviteNum="+this.userName+"&activityId="+this.activityId
                    if(window.sharePage && (localStorage.getItem('isWebview')=='andriod' || localStorage.getItem('isWebview')=='ios')){
                        window.sharePage('帮我点赞世界杯，100%得黄金，还能白拿世界杯纪念品！','我在黄金管家为世界杯点赞，动动手指抽大奖！',href)
                    }else{ //跟产品确认在非app环境下怎么处理
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
                }
            },
            //跳转世界杯提金产品列表页
            toExtract(){
                this.$router.push({
                    path:'extractGoldList'
                })
            },
            //查看排行榜
            viewRanking(){
                if(this.search){
                    this.$router.push({
                        path:'/ranking',
                        query:{
                            inviteCode:this.inviteCode,
                            activityId:this.activityId
                        }
                    })
                }else{
                    this.$router.push('/ranking')
                }
            }
        },
        destroyed(){
            clearInterval(this.timer)
        },
		components:{
            headTop,
		}
	}
</script>

<style scoped lang="less">
@import '../../../style/common.less';
    .world_cup #head_top{
        background-color:transparent;
        padding-right:.3rem;
    }
    .world_cup .backward{
        position: absolute;
        left:.54rem;
        font-size:.34rem;
        color:#fff;
        height:.44rem;
        line-height:.44rem;
    }
    .world_cup .backward:before{
        content:'';
        width:.16rem;
        height:.34rem;
        background-image:url(../../../images/likeBack.png);
        background-size:100% 100%;
        position: absolute;
        left:-.2rem;
        top:.05rem;
    }
    .world_cup .activity_rule{
        float:right;
        color:#fff;
        font-size:.36rem;
    }
    .greensward{
        width:100%;
        height:26.8rem;
        background-image:url(../../../images/bottomBg.png);
        background-size:100% 26.8rem;
        position:relative;
    }
    .greensward .horse_race_lamp{
        position:relative;
        z-index:1;
        background-color:rgba(0,0,0,.4);
        height:.48rem;
        top:6.3rem;
        width:100%;
        overflow: hidden;
    }
    .horse_race_lamp ul{
        position:absolute;
        left:0.4rem;
    }
    .greensward .horse_race_lamp li{
        display:inline-block;
        color:#fff;
        font-size:.22rem;
        padding-right:1rem;
        line-height:.48rem;
    }
    .register_container{
        width:6.4rem;
        height:19.33rem;
        margin:0 auto;
        position:absolute;
        left:0;
        right:0;
        top:6.6rem;
        background-image:url(../../../images/whiteBg.png);
        background-size:6.4rem 19.33rem;
        padding-top:1.4rem;
    }
    .register_container .view_list{
        width:1.67rem;
        height:.44rem;
        background-image:url(../../../images/viewRankBold.png);
        background-size:1.65rem .42rem;
        background-repeat:no-repeat;
        text-align:center;
        color:#a88d4a;
        font-size:.22rem;
        position:absolute;
        right:.2rem;
        line-height:.44rem;
    }
    .register_container .total_count{
        text-align:center;
        color:#009345;
        font-size:.32rem;
        padding-top:.44rem;
        font-weight:bold;
    }
    .register_container .total_number{
        text-align:center;
        padding-top:.2rem;
    }
    .total_number span{
        color:#5a5a5a;
        font-size:.58rem;
        font-weight:bold;
        display:block;
        background-image:url(../../../images/modifier1.png),url(../../../images/modifier2.png);
        background-size:.71rem .24rem,.74rem .35rem;
        background-repeat: no-repeat,no-repeat;
        background-position: 1.35rem 0.2rem,4.4rem 0.3rem;
    }
    .my_regist{
        text-align:center;
        font-size:.3rem;
        color:#333333;
        padding-top:.4rem;
    }
    .operate_regist{
        margin-top:.44rem;
        .flex;
    }
    .operate_regist p{
        width:2.7rem;
        height:.76rem;
        background-image: url(../../../images/likeBefore.png);
        font-size:.28rem;
        color:#aa8a4d;
        font-weight:bold;
        line-height:.78rem;
        text-align: center;
        background-size: 2.7rem .76rem;
        background-repeat: no-repeat;
    }
    .operate_regist p.white{
        color:#fff;
    }
    .operate_regist_btn1{
        margin-right:.3rem;
    }
    .operate_regist_btn1.actived{
        background-image: url(../../../images/likeAfter.png);
    }
    .operate_regist_btn1 img{
        width:.32rem;
        height:.32rem;
        margin-left:.1rem;
        position: relative;
        top:.04rem;
    }
    .operate_regist_btn1 img.zan{
        width:.56rem;
        height:.67rem;
        position: relative;
        top:-.2rem;
        vertical-align: middle;
    }
    .divide_line{
        width:6.1rem;
        height:1px;
        background-color:#d2d2d1;
        margin:0 auto;
        margin-top:.06rem;
    }
    .award_setup img{
        display:block;
        width:5.66rem;
        margin:0 auto;
        margin-bottom:.22rem;
    }
    .award_setup h4{
        font-size:.32rem;
        color:#009247;
        line-height:1rem;
        text-align:center;
        font-weight:bold;
    }
    .warm_tip{
        font-size:.24rem;
        color:#737373;
        // padding-left:.38rem;
        padding-top:.26rem;
        text-align:center;
    }
    .for_worldCup{
        width:2.8rem;
        height:.85rem;
        background-image:url(../../../images/like.png);
        background-size:2.8rem .85rem;
        background-repeat: no-repeat;
        font-size:.28rem;
        color:#a98b4d;
        font-weight:bold;
        margin:0 auto;
        margin-top:.48rem;
        text-align:center;
        line-height:.85rem;
    }
    .for_worldCup:active{
        background-color:rgba(221,167,62,.3);
    }
    .register_window{
        width:5.26rem;
        background-color:rgba(0,0,0,.7);
        position: absolute;
        .radius(5px);
        margin:0 auto;
        left:0;
        right:0;
        top:11rem;
        text-align:center;
        padding-top:.44rem;
        font-size:.3rem;
        color:#fff;
        padding-bottom:.24rem;
    }
    .register_window h4{
        padding-bottom:.34rem;
    }
    .register_window button{
        width:2.3rem;
        height:.7rem;
        background-color:#fff;
        .radius(5px);
        line-height:.7rem;
        text-align:center;
        margin-top:.33rem;
    }
</style>