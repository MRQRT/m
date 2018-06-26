<template>
	<div class="cardRule">
		<head-top headTitle='取金卡' class="head-top" ref="topHead">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
            <span slot="custom" class="rule">活动规则</span>
		</head-top>
        <div class="cardMess" ref="cardMess">
            <div class="textContainer">
                <img src="../../images/cardText.png" style="width:6rem;height:.38rem;">
            </div>
            <p class="goldDesc">集齐5个人物,即可领取500mg黄金</p>
            <!--展示大图的区域-->
            <img :src="src" id="bigShow">
            <!--切换大图大图上的文字-->
            <div class="promptText">
                <p v-show="fillRecords" class="hasCollect" style="margin-bottom:.4rem;">团队已集齐<span style="color:#EDA835;">(共2套)</span>,快去取金吧!</p>
                <p v-show="noTheCard" class="noTheCard" style="margin-bottom:.4rem;">取金队伍还没有,赶快召集成员</p>
                <p class="quickRecord" v-show="fillRecords">马上领黄金</p>
                <div class="buyGoldBtn" @click="$router.push('/buy')" v-show="goBuy"><span style="margin-right:.2rem;">买黄金</span><span>集金卡</span></div>
            </div>

            <div class="persons">
                <li v-for="item in collecteCard">
                    <div class="character" v-if="item.code==100 && item.number!=0">
                        <img :src="smallGrop" @click="toggleBig($event,item.code,cardsArr['100'].bigL)"  class="light">
                    </div>
                    <div class="character" v-else>
                        <img :src="cardsArr[item.code].smallL" v-if="item.number" @click="toggleBig($event,item.code,cardsArr[item.code].bigL)"  class="light">
                        <img :src="cardsArr[item.code].smallD" v-else="item.number" @click="toggleBig($event,item.code,cardsArr[item.code].bigD)" class="dark">
                    </div>
                    <p>{{item.name}}</p>
                    <span v-show="item.number!==0">{{item.number}}</span>
                </li>
            </div>
        </div>
        <!--遮罩-->
        <div class="mask" v-show="needShow"></div>
        <!--获得黄金-->
        <div class="received" v-show="needShow">
           <div class="closeCard" @click="needShow=false"></div>
           <p>恭喜您,成功获得500mg真金!</p>
           <img src="../../images/pocket.png">
           <div class="find-my-gold">查看我的黄金</div>
        </div>
	</div>
</template>
<script>
	import headTop from '../../components/header/head.vue';
    import bigTSL from '@/images/bigTsLig.png'
    import bigTSD from '@/images/bigTsDar.png'
    import bigSWKL from '@/images/bigSwkLig.png'
    import bigSWKD from '@/images/bigSwkDar.png'
    import bigZBJL from '@/images/bigZbjLig.png'
    import bigZBJD from '@/images/bigZbjDar.png'
    import bigSSL from '@/images/bigSsLig.png'
    import bigSSD from '@/images/bigSsDar.png'
    import bigBLL from '@/images/bigBlLig.png'
    import bigBLD from '@/images/bigBlDar.png'
    
    import smallTSL from '@/images/smallTsLig.png'
    import smallTSD from '@/images/smallTsDar.png'
    import smallSWKL from '@/images/smallSwkLig.png'
    import smallSWKD from '@/images/smallSwkDar.png'
    import smallZBJL from '@/images/smallZbjLig.png'
    import smallZBJD from '@/images/smallZbjDar.png'
    import smallSSL from '@/images/smallSsLig.png'
    import smallSSD from '@/images/smallSsDar.png'
    import smallBLL from '@/images/smallBlLig.png'
    import smallBLD from '@/images/smallBlDar.png'
    
    import smallGrop from '@/images/smallGropLig.png'
    import bigGrop from '@/images/bigGropLig.png'

    import { queryUserCollectCard } from '@/service/getData'
    import { getStore } from '@/config/mUtils'
	export default {
		data(){
			return {
                src:"",//大图显示内容
                needShow:false,//集齐金卡后获得黄金弹窗
                userId:'',//用户userId
                cardsArr:{},//金卡照片集合
                collecteCard:[],//接口返回的金卡信息
                smallGrop:smallGrop,
                noTheCard:false, //当前没有集到该卡
                fillRecords:false,//当前已经集齐五卡
                goBuy:false,//当前已经集到该卡，但没有集齐五卡
			}
		},
        created(){
            this.userId=getStore("token","local").split("_")[0];
            this.cardsArr={
                '100': {
                bigL:bigGrop,
                smallL:smallGrop,
               },
               '101': {
                bigL:bigTSL,
                bigD:bigTSD,
                smallL:smallTSL,
                smallD:smallTSD
               },
               '102':{
                bigL:bigSWKL,
                bigD:bigSWKD,
                smallL:smallSWKL,
                smallD:smallSWKD
               },
               '103':{
                bigL:bigZBJL,
                bigD:bigZBJD,
                smallL:smallZBJL,
                smallD:smallZBJD
               },
               '104':{
                bigL:bigSSL,
                bigD:bigSSD,
                smallL:smallSSL,
                smallD:smallSSD
                },
                '105':{
                bigL:bigBLL,
                bigD:bigBLD,
                smallL:smallBLL,
                smallD:smallBLD
               },
            }

        },
		mounted() {
            this.queryUserCollectCard(this.userId);
            var t=this;
            setTimeout(function(){
                t.$nextTick(function(){
                    document.querySelectorAll('.character')[0].childNodes[0].classList.add('selected');
                })
            },500)
            
		},
		computed:{
			
		},
		methods:{
			async queryUserCollectCard(){
                var res=await queryUserCollectCard(this.userId);
                if(res.code==100){
                    this.collecteCard=res.content;
                    
                    if(this.collecteCard[0].number!=0){
                        this.src=this.cardsArr['100'].bigL;
                        this.noTheCard=false;
                        this.fillRecords=true;
                        this.goBuy=false;
                    }else if(this.collecteCard[1].number!=0){
                        this.src=this.cardsArr['101'].bigL;
                        this.noTheCard=false;
                        this.fillRecords=false;
                        this.goBuy=true;
                    }else{
                        this.src=this.cardsArr['101'].bigD;
                        this.noTheCard=true;
                        this.fillRecords=false;
                        this.goBuy=true;
                    }

                }
            },
            toggleBig(e,code,src){
                var dvs=document.querySelectorAll('.selected');
                if(dvs.length){
                    dvs.forEach( function(element, index) {
                        element.classList.remove('selected')
                    });
                }
                e.target.classList.add('selected')
                this.src=src;
                if(code=='100'){
                    this.noTheCard=false;
                    this.fillRecords=true;
                    this.goBuy=false;
                }else if(src.indexOf('L')!=-1){
                    this.noTheCard=false;
                    this.fillRecords=false;
                    this.goBuy=true;
                }else if(src.indexOf('D')!=-1){
                    this.noTheCard=true;
                    this.fillRecords=false;
                    this.goBuy=true;
                }
            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    .cardRule{
    	padding-top:0.88rem;
        background-color: #F5F5F5;
    }
    li img.selected{
        border:2px solid #F2B643;
    }
    .cardRule .rule{
        position: absolute;
        right:0.3rem;
    }
    .cardMess .textContainer{
        text-align: center;
        padding-top:.6rem;
        padding-bottom:.1rem;
    }
    .cardRule .cardMess .goldDesc{
        text-align: center;
        font-size:.26rem;
        color:#666666;
        margin-bottom:.22rem;
    }
    .cardRule .cardMess img#bigShow{
        width:6.54rem;
        height:7.82rem;
        display: block;
        margin: 0 auto;
        position: relative;
        right:-.04rem;
    }
    .cardRule .cardMess .promptText{
        position: absolute;
        bottom:3.6rem;
        z-index: 10;
        left:50%;
        margin-left:-2.1rem;
    }
    .cardRule .cardMess .hasCollect{
        text-align: center;
        font-size:.28rem;
        color:#666666;
        position: relative;
        top:-4.5rem;
    }
   
    .cardRule .cardMess .quickRecord{
        width:4.2rem;
        height:.88rem;
        background-color:#fff;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        -o-border-radius: 3px;
        margin:0 auto;
        font-size: .3rem;
        color:#EDA835;
        text-align: center;
        line-height: .88rem;
    }
    .cardRule .cardMess .noTheCard{
        text-align: center;
        font-size:.22rem;
        color:#666666;
    }
    .cardRule .cardMess .buyGoldBtn{
        width:4.2rem;
        height:.88rem;
        background-color: #F2B643;
        line-height:.88rem;
        margin:0 auto;
        color:#fff;
        font-size:.32rem;
        text-align: center;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        -o-border-radius: 3px;
    }
    .cardRule .cardMess .persons{
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
        display: -ms-flex;
        padding-left:.3rem;
        padding-top:.26rem;
        overflow-x: auto;
    }
    .cardRule .cardMess .persons li{
        list-style: none;
        margin-right:.22rem;
        position: relative;
    }
    .cardMess .persons li img{
        width:1.2rem;
        height:1.5rem;
    }
    .cardMess .persons li p{
        text-align: center;
        font-size:.24rem;
        color:#666666;
        padding-top:.2rem;
    }
    .cardMess .persons li span{
        width:.3rem;
        height:.3rem;
        background-color:#FF6D39;
        color:#fff;
        font-size:.16rem;
        text-align: center;
        line-height:.3rem;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -o-border-radius: 50%;
        position: absolute;
        top:-.16rem;
        right:-.1rem;
        z-index:20;
    }
    .cardRule .mask{
        position: fixed;
        width:100%;
        height:100%;
        top:0;
        left:0;
        z-index: 101;
        background-color: rgba(0,0,0,.5);
    }
    .cardRule .received{
        position: fixed;
        top:2.3rem;
        left:50%;
        margin-left:-3rem;
        width:6.02rem;
        z-index: 102;
        background-color: #fff;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -o-border-radius: 10px;
        text-align: center;
        padding-top:.82rem;
    }
    .cardRule .received .find-my-gold{
        width:4rem;
        height:.88rem;
        background-color:#F2B643;
        color:#fff;
        font-size:.34rem;
        text-align: center;
        line-height:.88rem;
        margin:0 auto .8rem;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -o-border-radius: 4px;
    }
    .cardRule .received img{
        width:4.29rem;
        height:4.66rem;
        margin-bottom:-3px;
    }
    .cardRule .received p{
        font-size:.3rem;
        font-weight: bold;
        height:1.22rem;
    }
    .cardRule .received .closeCard{
        width:.44rem;
        height:.44rem;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -o-border-radius: 50%;
        background:url(../../images/cardClose.png);
        background-size: 100%;
        position: absolute;
        top:-.84rem;
        right:.75rem;
    }
    .cardRule .received .closeCard:before{
        content:'';
        width:.02rem;
        height:.4rem;
        background-color: #fff;
        position: absolute;
        bottom:-.4rem;
        left:50%;
        margin-left:-.01rem;
    }
</style>