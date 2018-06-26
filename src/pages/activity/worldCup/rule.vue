<template>
	<div class="world_cup_rule">
		<head-top headTitle="活动规则" class="head-top">
            <span slot="custom" class="backward" @click="goBack">返回</span>
		</head-top>
        <div class="rule_content">
            <p>1、每天登录黄金管家可获得一次点赞机会，每次点赞都有机会随机获得1-999毫克黄金。</p>
            <p>2、每周点赞排行前30名用户均可获得奖励，奖品详见奖项设置。</p>
            <p>3、邀请好友为世界杯点赞，好友注册后，可额外获得点赞机会。</p>
            <p>4、为了让更多的用户获得点赞奖励，每周日晚24时点赞榜结算并发放奖励；同时新一轮点赞榜开始，共持续5周。</p>
            <p>5、如有恶意刷榜骗取奖励的行为，黄金管家有权取消获奖资格，并保留追究法律责任的权利。</p>
            <p>6、在法律允许的范围内，黄金管家保留本次活动的最终解释权。</p>
        </div>
	</div>
</template>
<script>
	import headTop from '@/components/header/head.vue';
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
           
        },
		methods:{
            goBack(){
                this.$router.back(-1)
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
        background-color:#f6f6f6;
        height:100vh;
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
    .rule_content{
        padding-left:.72rem;
        padding-right:.72rem;
        padding-top:.66rem;
    }
    .rule_content p{
        padding-bottom:.4rem;
        font-size:.28rem;
        color:#333333;
        line-height:.4rem;
    }
</style>
