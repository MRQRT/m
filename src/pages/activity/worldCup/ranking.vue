<template>
	<div class="world_cup_rule">
		<head-top headTitle="周点赞榜" class="head-top">
            <span slot="custom" class="backward" @click="goBack">返回</span>
		</head-top>
        <div class="ranking_content">
            <!--操作按钮-->
            <div class="ranking_operate">
                <p :class="{'border':state}" @click="exchange(0)">本周榜单</p>
                <p :class="{'border':!state}" @click="exchange(1)">上周榜单</p>
            </div>
            <!--信息标题-->
            <div class="info_title">
                <p>名次</p><p>账号</p><p>点赞次数</p>
            </div>
            <!--榜单本周-->
            <section class="award_list" v-show="state">
                <div v-for="(item,index) in theWeekList" :key="index">
                    <p class="placing" :class="{'padding':index>2}">
                        <span v-if="index>2">{{index+1}}</span>
                        <img :src="index==0 ? firstPlace : (index==1 ? secondPlace : thirdPlace)" v-if="index<=2">
                    </p>
                    <p class="award_name">{{item.userName}}</p>
                    <p class="award_times">{{item.helpCount}}</p>
                </div>
            </section>
            <!--榜单上周-->
            <section class="award_list" v-show="!state">
                <div v-for="(item,index) in lastWeekList" :key="index">
                    <p class="placing" :class="{'padding':index>2}">
                        <span v-if="index>2">{{index+1}}</span>
                        <img :src="index==0 ? firstPlace : (index==1 ? secondPlace : thirdPlace)" v-if="index<=2">
                    </p>
                    <p class="award_name">{{item.userName}}</p>
                    <p class="award_times">{{item.helpCount}}</p>
                </div>
            </section>
        </div>
        <!--我的排名-->
        <p class="myPlace" v-if="token">我的排名：{{ranking}}</p>
        <p class="myPlace" v-if="!token" @click="toLogin">登录查看我的排名</p>
	</div>
</template>
<script>
    import headTop from '@/components/header/head.vue';
    import first from '@/images/awardFirst.png'
    import second from '@/images/awardSencond.png'
    import third from '@/images/awardThird.png'
    import { Toast,Indicator } from 'mint-ui';
    import { mapState } from 'vuex'
    import { queryIsHaveLastWeek,queryUserRank,queryWeekLikeList } from '@/service/getData'
	export default {
		data(){
			return {
               state:true,//true为本周，false为上周
               firstPlace:first,
               secondPlace:second,
               thirdPlace:third,
               ranking:0,//我的排名
               lastWeekList:[],//上周榜单
               hasLast:false,//是否有上周榜单
               theWeekList:[], //上榜名单本周
               inviteLink:false,//是否是链接用户进来
               inviteCode:null,
               activityId:null
			}
		},
        created(){
            this.queryIsHaveLastWeek()
        },
		mounted() {
            this.viewTheWeek()
            if(this.$route.query && this.$route.query.inviteCode){
                this.inviteLink=true
                this.inviteCode=this.$route.query.inviteCode
                this.activityId=this.$route.query.activityId
            }
            this.token ? this.queryUserRank() : ''
        },
        computed:{
            ...mapState([
                'token'
            ])
        },
		methods:{
            //查询是否有上周点赞榜
            async queryIsHaveLastWeek(){
                var res=await queryIsHaveLastWeek()
                if(res.code==100){
                    if(res.content==1){
                        this.hasLast=true
                    }else{
                        this.hasLast=false
                    }
                }
            },
            //查看排名
            async queryUserRank(){
                var res=await queryUserRank()
                if(res.code==100){
                    this.ranking=res.content
                }
            },
            //未登入用户查看我的排名
            toLogin(){
                if(this.inviteLink){
                    this.$router.push({
                        path:'loginIn',
                        query:{
                            from:'ranking',
                            inviteCode:this.inviteCode,
                            activityId:this.activityId
                        }
                    })
                }else{
                    this.$router.push({
                        path:'loginIn',
                        query:{
                            from:'ranking'
                        }
                    })
                }
            },
            goBack(){
                Indicator.close()
                this.$router.back(-1)
            },
            //切换状态
            exchange(val){
                if(val){
                    if(!this.hasLast){
                        Toast({
                            message:'暂无上周记录',
                            position:'bottom'
                        })
                        return;//没有上周记录
                    }
                    this.state=false
                    this.viewLastWeek()
                }else{
                    this.state=true
                    this.viewTheWeek()
                }
            },
            //查看本周排行榜
            async viewTheWeek(){
                Indicator.open({
                    spinnerType: 'snake'
                });
                //调用接口查看本周
                var res=await queryWeekLikeList(0)
                if(res.code==100){
                    Indicator.close()
                    this.theWeekList=res.content
                }
            },
            //查看上周排行榜
            async viewLastWeek(){
                Indicator.open({
                    spinnerType: 'snake'
                });
                //调用接口查看上周
                var res=await queryWeekLikeList(1)
                if(res.code==100){
                    Indicator.close()
                    this.lastWeekList=res.content
                }
            }
		},
		components:{
            headTop,
		}
	}
</script>

<style scoped lang="less">
@import '../../../style/common.less';
    .world_cup_rule{
        padding-top:.88rem;
    }
    .world_cup_rule .backward{
        position: absolute;
        left:.54rem;
        font-size:.34rem;
        color:#333333;
        height:.44rem;
        line-height:.44rem;
    }
    .world_cup_rule .backward:before{
        content:'';
        width:.16rem;
        height:.34rem;
        background-image:url(../../../images/myBack.png);
        background-size:100% 100%;
        position: absolute;
        left:-.2rem;
        top:.05rem;
    }
    .ranking_operate p{
        float:left;
        width:50%;
        font-size:.3rem;
        color:#333333;
        text-align:center;
        padding-bottom:.2rem;
        padding-top:.2rem;
    }
    .ranking_operate p.border{
        border-bottom:2px solid #a9894c;
        color:#aa8b4b;
    }
    .info_title{
        width:100%;
        -webkit-justify-content: space-around;
        -o-justify-content: space-around;
        -moz-justify-content: space-around;
        justify-content: space-around;
        .flex-simple;
        font-size:.24rem;
        color:#5f5f5f;
        background-color:#f5f5f5;
        line-height:.5rem;
    }
    .award_list{
        padding-left:.3rem;
        padding-right:.3rem;
    }
    .award_list div{
        width:100%;
        .flex-simple;
        border-bottom:1px solid #e9e9e9;
        letter-spacing:1px;
    }
    .award_list p{
        padding-top:.36rem;
    }
    .award_list .placing{
        width:24%;
        text-align:center;
        padding-top:.2rem;
        padding-bottom:.1rem;
    }
    .award_list .placing span{
        font-size:.24rem;
        color:#343434;
    }
    .award_list .placing.padding{
        padding-top:.3rem;
        padding-bottom:.3rem;
    }
    .award_list img{
        width:.48rem;
        height:.6rem;
    }
    .award_name{
        font-size:.24rem;
        color:#343434;
        width:44%;
        text-align:center;
    }
    .award_times{
        font-size:.22rem;
        color:#ab894a;
        width:32%;
        text-align:center;
    }
    .myPlace{
        font-size:.34rem;
        color:#a98b4d;
        text-align:center;
        padding-top:.3rem;
        padding-bottom:.3rem;
        position:fixed;
        bottom:0;
        width:100%;
        background-color:#e7d5a5;
    }
    .ranking_content{
        margin-bottom:1.1rem;
    }
</style>
