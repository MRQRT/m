<template>
    <div class="arg2">
        <div class="title">黄金实物定期委托存管提前交付协议</div>
        <section class="box_padding">
            <div class="party">甲方：北京盈吉通电子商务有限公司</div>
            <div class="party">乙方：黄金管家用户</div>
            <div class="text margin">本协议所指的黄金实物定期委托存管业务是指，黄金管家用户（以下简称“乙方”）向北京盈吉通电子商务有限公司（“黄金管家”品牌创立者及所有企业，以下简称“甲方”）购买实物黄金，并寄存在甲方处委托甲方保管一定期限，在保管期限内甲方给予乙方一定补偿费的业务。鉴于国家监管政策的不确定性，为了更好地保护乙方权益，甲乙双方经协商一致，同意甲方提前交付乙方存放于甲方处的实物黄金资产，同时达成如下协议：
            </div>
            <div class="text">1、乙方同意甲方将乙方委托甲方保管固定期限的所有实物黄金（已完成买入和委托，未到交付日期）转为乙方可卖出或可提货状态。</div class="text">
            <div class="text">2、乙方同意甲方在保持原有固定期限委托对应的延期提货补偿费率不变的情况下，将截止到本合同生效日的所有以黄金克重形式支付的延期补偿费转为乙方可卖出或可提货状态，所有以现金形式支付的延期补偿费转为乙方可提现状态。
            </div>
            <div class="text">
                3、甲乙双方对本协议内容有无期限保密义务，未经一方书面同意，另一方不得将本协议及本协议内容透漏给任何第三方。否则，违反约定一方需赔偿守约方因此所受全部损失。本条款不因本协议失效而无效。
            </div>
            <div class="text">
                4、乙方通过网络点击确认或以其他方式选择接受本协议的，本协议即刻生效。并表示乙方已经同意接受本协议的全部约定内容，及其他与本协议或与本协议项下有关的各项规定。
            </div>
            <div class="text">
                5、本协议采用电子合同方式，可以有一份或者多份并且每一份具有同等法律效力。乙方或者乙方的代理人根据有关协议及相关规则以乙方本人的名义确认签署的电子合同即视为乙方本人真实意愿，具有法律效力。乙方应妥善保管自己的账户密码等账户信息，乙方通过前述方式订立的电子合同对合同双方具有法律约束力，乙方不得以账户密码等账户信息被盗用或其他理由否认已订立的合同的效力或不按照该合同履行相关义务。乙方根据本协议以及相关规则签署电子合同后，不得擅自修改该合同。甲方将向乙方提供电子合同及交易记录的保管查询、核对等服务。
            </div>
            <div class="text">6、双方本协议项下服务而发生争议的，由双方协商解决；协商不成，以诉讼方式解决，由甲方住所地人民法院管辖。诉讼期间，未涉及争议的条款仍需继续履行。
            </div>
            <div class="text">7、甲方对本协议拥有最终的解释权。若本协议的部分条款被认定为无效或者无法实施时，本协议中的其他条款仍然有效。
            </div>
        </section>
        <div class="button_box">
            <button class="button" v-if="!agr" @click="agree">我同意以上协议</button>
            <button class="button2" v-else @click="agree">您已同意以上协议内容</button>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    data(){
        return {
            agr:false,
        }
    },
    created(){

    },
    mounted(){
        if(this.$route.query.id=='1'){
            this.agr=1
        }
    },
    computed:{
        ...mapState([
            'token'
        ]),
    },
    watch:{
        '$route'(from ,to){
            console.log(1212)
        }
    },
    methods:{
        agree(){
            this.agr=1;
            if(!this.token){
                this.$router.push({
                    path:'/loginIn',
                    query:{
                        from:'/arg2',
                        id:'1',
                    }
                })
            }
        },
    },
}
</script>
<style>
.title{
	text-align:center;
	color:#333;
	font-size:.34rem;
	padding-top:.5rem;
	font-weight:bold;
	height: 1.2rem;
}
.box_padding{
    padding: 0.4rem 0.5rem 0rem 0.5rem;
}
.party{
	color:#eda835;
	font-size:.28rem;
}
.text{
	color:#666;
	font-size:.26rem;
	text-indent: .5rem;
	line-height: .44rem;
}
.margin{
	margin-top:.4rem;
}
.button_box{
    text-align:center;
    font-size:.34rem;
    margin-top:.5rem;
    margin-bottom:.5rem;
}
.button{
    text-align:center;
    font-size:.34rem;
    color:#fff;
    width: 6.9rem;
    height:.88rem;
    border-radius:4px;
    padding:0 .4rem 0 .4rem;
    background-color:#f2b643;
}
.button2{
    font-size:.34rem;
    text-align:center;
    color:#ffff;
    background-color:rgba(247,211,142,0.6);
    width: 6.9rem;
    height:.88rem;
    border-radius:4px;
}
</style>
