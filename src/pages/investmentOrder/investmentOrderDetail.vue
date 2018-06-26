<template>
	<div class="my-investment-detail">
		<head-top headTitle='定投详情' class="head-top" id="head_top" ref="topHead">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
        <!--定单状态-->
		    <section class="order-area" ref="orderArea">
            <div class="investOrderState">
                <!--定投产品名称-->
                <p class="investName"><span class="investName-sp1">{{RecycleOrderObj.productName}}</span><span class="investName-sp2">{{RecycleOrderObj.status==0?'执行中':((RecycleOrderObj.status==1)?'已完成':'已终止')}}</span></p>
            </div>
		   </section>
        <!--canvas动画进度条-->
        <section class="myCanvas">
            <canvas class="investStatePie" ref="canvalPie" id="canvas" width="720" height="660" style="height:220px;"></canvas>
            <span class="canvas-sp1">梦想进度</span>
            <div  style="position:relative;top:-1.7rem;text-align:center;"><span class="canvas-sp2">成功投入{{RecycleOrderObj.budgetAmount?RecycleOrderObj.amountTotal+'元':RecycleOrderObj.amountTotal+'克黄金'}}</span></div>
        </section>
        <!--订单设置详情-->
        <section class="orderMessage">
            <p><span class="p-sp1">梦想预算</span><span class="p-sp2">{{RecycleOrderObj.budgetAmount?'元':'克'}}</span><span style="float:right">{{RecycleOrderObj.budgetAmount?RecycleOrderObj.budgetAmount:RecycleOrderObj.budgetWeight}}</span></p>
            <p><span class="p-sp1">梦想期限</span><span class="p-sp2">{{(RecycleOrderObj.term)/30}}个月</span></p>
            <p><span class="p-sp1">每{{RecycleOrderObj.regularInterval==7?'周':'月'}}存入</span><span class="p-sp2">{{RecycleOrderObj.budgetAmount?Math.ceil(parseInt(Number(RecycleOrderObj.regularAmount)*1000))/1000+'元':Math.ceil(parseInt(Number(RecycleOrderObj.regularAmount)*1000))/1000+'克'}}</span></p>
            <p><span class="p-sp1">存入日期</span><span style="float:right">{{rateDate}}</span><span class="p-sp2">每{{RecycleOrderObj.regularInterval==7?'周':'月'}}</span></p>
            <p class="bottom-p" v-show="RecycleOrderObj.status==0?true:false"><span style="margin-right:.2rem;">下次存入日期:</span><span>{{RecycleOrderObj.nextDate}}</span></p>
        </section>
        <!--交易记录-->
        <section class="trade-recorde" v-if="isShow">
            <h4>交易记录</h4>
            <div class="tradeDetail" v-for="items in yearArray">
                <div class="perRecord">
                    <p class="yearTitle"  @click="hideAndShow"><span>{{items}}</span><span class="showOrhide"><img :src="src" id="upAndDown"></span></p>
                    <div class="records" id="record">
                       <p class="perRecordDetail" v-for="item in records" v-if="item.createTime.split('-')[0]==items?'true':'false'">
                           <span class="record-sp1">
                               <img :src="item.status?tradeFail:tradeDone">
                           </span>
                           <span class="record-sp2">{{item.createTime.substring(5,10)}}</span>
                           <span class="record-sp3">{{weightOrAmount=='amount'?item.amount+'元':item.weight+'克'}}</span>
                           <span class="record-sp4" v-if="item.status">定投失败</span>
                           <span class="record-sp4" v-else>定投成功</span>
                       </p>
                    </div>
                </div>
            </div>
        </section>
		<!--修改终止按钮-->
		<section class="bottom-btn">
           <div class="end" @click="stop" v-show="RecycleOrderObj.status==0?true:false">终止</div>  
    </section>
    <!--确定终止定投订单的弹窗-->
    <section class="mask" v-show="maskShow">
       <div class="smallWindow">
         <h4>提示</h4>
         <p>确定要终止定投计划吗?</p>
         <div class="btns">
           <span @click="cancel" style="margin-right:-3px;">取消</span>
           <span @click="ok" style="border-left: 1px solid #EFEFEF;margin-left:-3px;">确定</span>
         </div>
       </div>
    </section>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
  import up from '@/images/up.png'
  import down from '@/images/down.png'
  import investErr from '@/images/investErr.png'
  import investSuc from '@/images/investSuc.png'
  import { getRem } from '@/config/mUtils'
  import { queryRegularInfo,stopRegularPlan } from '@/service/getData.js'

	export default {
		data(){
			return {
                       src: down,
                 tradeDone: '',
                 tradeFail: '',
                  maskShow: false,
           RecycleOrderObj: {},//定投订单详情
                      week: ['一','二','三','四','五','六','日'],
                    isShow: null,//交易记录显示开关,
                  progress: null,
                 yearArray: [],//年数组
                   records: [],//交易记录数组
            weightOrAmount: '',//交易订单是按克重还是按金额买的 （amount为金额，weight为克重）
                        id: '',//商品详情ID
		    }
        },
        beforeCreate(){

        },
        created(){
            this.id=this.$route.query.id;//获取定投订单ID
            this.src=down;
            this.tradeDone=investSuc;
            this.tradeFail=investErr;
		},
		mounted() {
            this.recycleInfo(this.id);
            var width=window.innerWidth;
            document.querySelector('#canvas').width=width*3;
		},
		computed:{
			rateDate(){
                if(this.RecycleOrderObj.regularInterval==7){
                    for(var i=1;i<this.week.length+1;i++){
                        if(Number(this.RecycleOrderObj.regularDay)==i){
                            return this.week[i-1]
                        }
                    }
                }
                return this.RecycleOrderObj.regularDay+'日'
            }
		},
		methods:{
            //终止点击按钮
            stop(){
                this.maskShow=true;
            },
            //取消点击按钮
            cancel(){
                this.maskShow=false;
            },
            //确认终止按钮
            async ok(){
                const res = await stopRegularPlan(this.$route.query.id)
                if(res.code==100){
                    //终止接口返回重新情趣定投详情渲染一遍页面
                    this.recycleInfo(this.$route.query.id)
                }
                this.maskShow=false;
            },
            //点击实现交易记录的显示与隐藏
            hideAndShow(e){
                let record = document.getElementById('record');
                let perRecordDetail = document.getElementsByClassName('perRecordDetail');
                (this.src==down)?this.src=up:this.src=down
                if(this.src==down){
                    record.style.display='none'
                    record.style.border='none'
                }else{
                    record.style.display="block"
                    record.style.borderBottom="1px solid #F2F2F2"
                }
            },
            initCanvas(val){
                var canvas = document.getElementById('canvas');  //获取canvas元素
                var context = canvas.getContext('2d');  //获取画图环境，指明为2d
                var centerX = canvas.width/2;   //Canvas中心点x轴坐标
                var centerY = canvas.height/2+14;  //Canvas中心点y轴坐标
                var innerR=3.62/2*3*getRem();
                var rad = Math.PI*2/100;//将360度分成100份，那么每一份就是rad度
                var speed = 0; //加载的快慢就靠它了 
                //绘制5像素宽的运动外圈
                function blueCircle(n){
                    context.save();
                    context.strokeStyle = "#EDA835"; //设置描边样式
                    context.lineWidth = 15; //设置线宽
                    context.lineCap='round';
                    context.beginPath(); //路径开始
                    context.arc(centerX, centerY, innerR , -Math.PI, -Math.PI+n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
                    context.stroke(); //绘制
                    context.closePath(); //路径结束
                    context.restore();
                }
                //绘制灰色外圈
                function whiteCircle(){
                    context.save();
                    context.beginPath();
                    context.lineWidth = 12; //设置线宽
                    context.strokeStyle = "#F2F2F2";
                    context.arc(centerX, centerY, innerR , 0, Math.PI*2, false);
                    context.stroke();
                    context.closePath();
                    context.restore();
                }  
                //百分比文字绘制
                function text(sp,all){
                    context.save();
                    //save和restore可以保证样式属性只运用于该段canvas元素
                    context.beginPath();
                    context.fillStyle = "#EDA835"; //设置描边样式
                    context.font = "115px Arial"; //设置字体大小和字体
                    //绘制字体，并且指定位置
                    var pianyiX=all==100?0.6*4*getRem():(all<10?0.6*2*getRem():0.6*3*getRem())
                    var pianyiY=0.25*getRem()-58;
                    context.fillText(sp.toFixed(0)+"%", centerX-pianyiX-10, centerY-pianyiY);
                    context.fill(); //执行绘制
                    context.restore();
                } 
                window.total = this.progress;
                //动画循环
                (function drawFrame(){
                    var s = requestAnimationFrame(drawFrame);
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    whiteCircle();
                    /*speed，每一步绘制的数字，total进度值*/
                    text(speed,total);
                    blueCircle(speed);
                    if(speed>=window.total){
                        cancelAnimationFrame(s)
                        return
                    };  //设置绘制的百分比
                    speed += 1;
                }());
            },
            //获取用户定投订单详情
            async recycleInfo(val){
                const res = await queryRegularInfo(val)
                if(res.code==100){
                    this.RecycleOrderObj = res.content//交易订单详情
                    this.progress = res.content.progress//交易进度
                    this.initCanvas(this.progress)//绘制进度圆
                    if(this.RecycleOrderObj.records.length==0){//如果交易详情中的交易记录中数组长度为0，则将交易中隐藏
                        this.isShow=false
                    }else{
                        this.isShow=true
                        //如果交易详情是按金额买的，data中的数据（weightOrAmount）的值为amount,如果是按克重买的，值为weight
                        if(this.RecycleOrderObj.budgetAmount){
                            this.weightOrAmount='amount'
                        }else{
                            this.weightOrAmount='weight'
                        }
                        this.records=this.RecycleOrderObj.records;//将交易记录放入数组中
                        //先将年份放入同一个数组中
                        var tempArr = [];
                        for(var i=0;i<this.records.length;i++){
                            if(this.records[i].createTime){
                                tempArr.push(this.records[i].createTime.split('-')[0])
                            }    
                        }
                        //对年份数组进行排序
                        for(var j=0;j<tempArr.length;j++){
                            if(this.yearArray.indexOf(tempArr[j])==-1){
                                this.yearArray.push(tempArr[j])
                            }
                        }
                    }
                }
            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    .my-investment-detail{
   	    width:100%;
   	    background-color: #F5F5F5;
   	    overflow-y: scroll;
    }
    .my-investment-detail .mask{
      position: absolute;
      width:100%;
      height:100%;
      top:0;
      left:0;
      background-color: rgba(0,0,0,.5);
      z-index: 11;
    }
    .my-investment-detail .mask .smallWindow{
      width:4.94rem;
      background-color:#fff;
      border-radius: 8px;
      position: absolute;
      left:50%;
      margin-left:-2.47rem;
      top:4.4rem;
    }
    .mask .smallWindow h4{
      height:.72rem;
      padding-top:.38rem;
      text-align: center;
      font-size:.36rem;
    }
    .mask .smallWindow p{
      text-align: center;
      font-size:.24rem;
      margin-top:.2rem;
      color:#4D4D4D;
    }
    .mask .smallWindow .btns{
      margin-top:.4rem;
      border-top: 1px solid #EFEFEF;
    }
    .mask .smallWindow .btns span{
      display: inline-block;
      width:50%;
      text-align: center;
      line-height: .8rem;
      color:#EDA835;
      font-size:.32rem;
    }
    .my-investment-detail .order-area{
   	    background-color: #fff;
   	    margin-top:.88rem;
   	    padding-left:.3rem;
   	    padding-right:.3rem;
        padding-top:.36rem;
    }
    .investOrderState .investName{
        height:.5rem;
    }
    .investOrderState .investName .investName-sp1{
        font-size:.3rem;
        float:left;
    }
    .investOrderState .investName .investName-sp2{
        font-size:.28rem;
        float:right;
        padding-top:.1rem;
        color:#EFB357;
    }
    .investOrderState .progress-indicator{
        width:3.63rem;
        height:3.63rem;
        border:.08rem solid #F2F2F2;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -o-border-radius: 50%;
        margin:0.7rem auto;
    }
    .my-investment-detail .myCanvas{
        background-color: #fff;
        position: relative;
    }
    .myCanvas .canvas-sp1{
        position: absolute;
        font-size:.34rem;
        color:#9C9C9C;
        top:1.4rem;
        left:50%;
        margin-left:-.65rem;
    }
    .myCanvas .canvas-sp2{
        font-size:.28rem;
        color:#0C0C2D;
        top:2.8rem;
        left:50%;
    }
    .my-investment-detail .orderMessage{
        background-color: #fff;
        padding-left:.3rem;
        padding-right:.3rem;
    }
    .my-investment-detail .orderMessage p{
        height:.92rem;
        font-size:.28rem;
        line-height: .92rem;
        border-bottom: 1px solid #F2F2F2
    }
    .my-investment-detail .orderMessage p:nth-child(5){
        border:none;
    }
    .my-investment-detail .orderMessage .p-sp1{
        color:#666666;
    }
    .my-investment-detail .orderMessage .p-sp2{
        float:right;
        color:#333333;
    }
    .my-investment-detail .orderMessage .bottom-p{
        font-size:.24rem;
        color:#B5B5B5;
    }
    .my-investment-detail .trade-recorde{
        margin-bottom:1.3rem;
    }
    .my-investment-detail .trade-recorde h4{
        height:1.1rem;
        background-color:#F5F5F5;
        font-size:.26rem;
        color:#666666;
        padding-top: .5rem;
        padding-left:.3rem;
    }
    .my-investment-detail .trade-recorde .tradeDetail{
        padding-left:.3rem;
        padding-right:.3rem;
        background-color: #fff;
    }
    .trade-recorde .tradeDetail .yearTitle{
        height:1.1rem;
        line-height:1.1rem;
        font-size:.28rem;
        padding-left:.8rem;
        position: relative;
        border-bottom: 1px solid #F2F2F2;
    }
    .trade-recorde .tradeDetail .yearTitle:before{
        content:'';
        width:.36rem;
        height:.32rem;
        background:url(../../images/investDate.png);
        background-size: 100%;
        position: absolute;
        top:0.36rem;
        left:0;
    }
    .yearTitle .showOrhide{
        float:right;
    }
    .yearTitle .showOrhide img{
        width:.24rem;
        height:.13rem;
    }
    .tradeDetail .perRecord{
        border-bottom:1px solid #F2F2F2;
    }
    .tradeDetail .perRecord .records{
        padding-top:.42rem;
        display:none;
    }
    .perRecordDetail{
        height:.94rem;
        font-size:.3rem;
        color:#888888;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .perRecordDetail span{
        display: inline-block;
    }
    .perRecordDetail .record-sp1{
        flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
    }
    .perRecordDetail .record-sp2{
        flex:2;
        -webkit-flex:2;
        -moz-flex:2;
        -o-flex:2;
    }
    .perRecordDetail .record-sp3{
        flex:3;
        -webkit-flex:3;
        -moz-flex:3;
        -o-flex:3;
        text-align: center;
    }
    .perRecordDetail .record-sp4{
        flex:3;
        -webkit-flex:3;
        -moz-flex:3;
        -o-flex:3;
         text-align: right;
    }
    .perRecordDetail span img{
        width:.24rem;
        height:.24rem;
    }
    .my-investment-detail .bottom-btn{
        position: fixed;
        height:1rem;
        width:100%;
        bottom:0;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .my-investment-detail .bottom-btn div{
        flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
        line-height: 1rem;
        font-size:.36rem;
        color:#fff;
        text-align: center;
    }
    .my-investment-detail .bottom-btn .end{
        background-color: #FF6D39;
    }
</style>
