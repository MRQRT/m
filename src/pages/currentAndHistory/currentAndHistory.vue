<template>
	<div class="currentHistory">
    <!--头部tab栏切换-->
		<div class="currHisTab">
            <img src='../../images/back.png' class="head_goback" @click="goBack">
            <section class="tabBar">
                <div class="current" @click="moveToLeft" :class="{'currentClass':leftActived}">实时金价</div>
                <div class="history" @click="moveToRight" :class="{'currentClass':rightActived}">历史走势</div>
            </section>
            <div class="activedLine" ref="activedLine"></div>
        </div>
        <!--实时金价部分-->
        <div v-show="!priceOrigin">
        <!--表格部分-->
        <section class="echarts">
            <div class="outer-container1" v-show="currentShow">
                <div id="currentPrice-container1">
                    <span id="currPrice">{{currentPrice}}</span>
                    <span class="unit">元/克</span>
                </div>
                <div id="inside-container1"></div>
            </div>
            <div id="outer-container2" v-show="!currentShow">
              <!--按月份按年份切换按钮-->
                <div class="toggleBtn">
                    <span class="nearMonth" :class="{'noSelectedStyle':!selectedFlag1,'selectedStyle':selectedFlag1}" @click="toggle($event,30)">近一月</span>
                    <span class="nearThirdMonth" :class="{'noSelectedStyle':selectedFlag2,'selectedStyle':!selectedFlag2}" @click="toggle($event,90)">近三月</span>
                    <span class="nearYear" :class="{'noSelectedStyle':selectedFlag3,'selectedStyle':!selectedFlag3}" @click="toggle($event,365)">近一年</span>
                </div>

                <p>上海黄金交易所Au9999收盘价</p>
                <!--折线图部分-->
                <div id="inside-container2"></div>
            </div>
        </section>
        <!--金价来历-->
        <section class="goldPriceOrigin">
            <!-- <router-link to="/goldPriceOrigin" tag="div" class="originLink">金价来历</router-link> -->
            <p class="originLink"><span  @click="priceOrigin=true" class="desc">金价说明</span></p>
        </section>

        <!-- 本周行情 -->
        <section class="weekQuotation">
            <div class="mainMessage">
               <!--参与人数-->
                <div class="joinPerson">
                    <div class="joinTitle">本周行情大家看</div>
                    <div class="personCount">参与人数:<span>{{total}}</span></div>
                </div> 
                <!--看涨看跌详情-->
                <div class="vote">
                    <div class="goUp">
                        <img src="../../images/goUp.png" style="width:.24rem;height:.24rem;vertical-align: middle;">
                        <span>看涨人数 :</span>
                        <span>{{up}}</span>
                        <span class="voteSign1" ref="voteSign1">+1</span><!--投票小符号-->
                    </div>
                    <div class="goDown">
                        <img src="../../images/goDown.png" style="width:.24rem;height:.24rem;vertical-align: middle;">
                        <span>看跌人数 :</span>
                        <span>{{down}}</span>
                        <span class="voteSign2" ref="voteSign2">-1</span><!--投票小符号-->
                    </div>
                </div>
                <!--涨跌比例条-->
                <div class="ratioBar">
                    <div class="bar" ref="bar">
                        <div>vs</div>
                    </div>
                </div>
                <!--投票按钮-->
                <div class="voteBtn">
                    <div class="goUpBtn" @click="goUpOrDown('up')">看涨</div>
                    <div class="goDownBtn" @click="goUpOrDown('down')">看跌</div>
                </div>
            </div>
        </section>
        <!--评论信息部分-->
        <section class="comment">
            <h4>精彩评论</h4>
            <mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore" class="loadmore">

                <ul class="myUl">
                    <li v-for="item in comments" class="subList">
                        <div class="image">
                            <img :src="item.avatar ? item.avatar:defaultImg">
                        </div>
                        <div class="commentInfo">
                            <p class="p1">{{item.userPhone}}</p>
                            <p class="p2">{{item.discussContent}}</p>
                            <p class="p3">{{item.createTime}}</p>
                        </div>
                        <!-- <span class="dianzan">25</span> -->
                    </li>
                </ul>

            </mt-loadmore>
            
        </section>

        <!-- 底部 -->
        <section class="footer">
            <div class="publish">
                <div class="pulishBtn"  @click="addComment">
                   <img src="../../images/comment.png" style="width:.36rem;height:.36rem;position: relative;top:.1rem;">
                   <span>评论</span>
                </div>
            </div>
            <a @click="$router.push('/buy')" class="buyGoldLink" id="click_btn">立即买入</a>
        </section>
        
         <!--添加评论部分-->
         <section class="comment_box">

            <section class="title">
                <span class="cancel" @click="cancel">取消</span>
                <h2>写评论</h2>
                <span class="publish" @click="publish">发送</span>
                
            </section>
            <textarea id="content" class="textareac" placeholder="说说你的想法..." v-model="myContent"></textarea>
        </section>
        
        <!--遮罩背景-->
        <section class="comment_mask" id="comment_mask"></section>
        </div>

        <!--金价来源部分-->
        <div v-show="priceOrigin" class="priceOrigin">
            <p class="originTitle">金价说明</p>
            <div class="originContent">
                <h4>金价来源</h4>
                <div class="mess">
                    <p>上海黄金交易所交易时间段内，黄金管家金价实时参照上海黄金交易所最新成交价；</p>
                    <p>上海黄金交易所休盘期间，黄金管家金价实时参照国际最新成交价；</p>
                    <p>每周末全球黄金交易所闭盘时，黄金管家金价参照本周国际金价收盘价，金价不发生波动。</p>
                </div>
            </div>
            <div class="originContent">
                <h4>交易所交易时间</h4>
                <div class="mess">
                    <p>1、上海交易所交易时间：每周一至周五20:00至次日2:30，9:00-11:30，13:30-15:30；</p>
                    <p>2、全球黄金交易所闭盘时间：每周六早6:00至周一早8:00(夏令时)，每周六早7:00至周一早7:00(冬令时)；</p>
                    <p>3、法定节假日及交易所公告的休市日，交易所的交易时间可能会有所调整。</p>
                </div>
            </div>
            <div class="closeOrigin">
                <img src="../../images/grayClose.png"  @click="priceOrigin=false">
            </div>
        </div>
	</div>
</template>
<script>
import highCharts from "highcharts"
import store from '@/store/';
import {mapState,mapMutations} from 'vuex';
import { Toast } from 'mint-ui'
import defaultAvatar from '@/images/defaults.png'
import { queryPriceTo24h,queryClosePriceToDay,getCommentList,getUpDown,userCmt,inEdCmt,queryGoldPrice } from '@/service/getData'
	export default {
		data(){
			return {
                leftActived:true,
                rightActived:false,
                option1:null, //渲染菜单1的数据
                option2:null, //渲染菜单2的数据
                currentShow:true,  //实时金价 历史走势tab栏切换
                selectedFlag1:true, //近一月
                selectedFlag2:true, //近三月
                selectedFlag3:true, //近一年
                priceOrigin:false,  //金价说明弹窗
                theDayTime:"", //当日价格曲线图之时间
                theDayPrice:"", //当日价格曲线图之金价
                theseDaysDate:"" , //历史收盘价之历史日期
                theseDaysPrice:"" , //历史收盘价之历史金价
                up:'',//看涨人数
                down:'',//看跌人数
                total:'',//参与人数
                isClick: true,//涨跌点击控制按钮
                searchCondition: {  //金价评论获取分页属性
                     pageNo: 1,
                   pageSize: 4
                },
                allLoaded:false,//上拉加载是否加载完毕
                false:false,
                pages: null,  //总页数
                comments:[],//金价评论
                defaultImg:defaultAvatar,//默认头像
                myContent:'',//评论内容
			}
		},
        created() {
            this.getComment();//获取用户评论
            this.UpDown();//获取用户评论总数以及支持数和反对数
            if(store.state.token){
                //用户是否看涨跌
                this.userCmt('auto')
            }
        },
        mounted() {
          this.initEchart1();
          this.screenRotate() //屏幕旋转添加事件
		},
        computed:{
            ...mapState([
              'currentPrice',
           ]),
        },
        watch:{
            currentPrice(val){
                return val
            }
        },
		methods:{
            screenRotate(){
                window.onorientationchange=function(){ //屏幕旋转时 重绘页面
                    window.location.reload()
                }
            },
            //返回上一页
            goBack(){
                window.toApp()
                this.$router.go(-1)   

            },
            //请求实时金价
            async getCurrent(){
                var  res=await queryGoldPrice();
                if(res.code==100){
                    var price=res.content.price
                    this.RECORD_CURRENPRICE(price);
                }
            },
            //获取涨跌人数
            async UpDown(){
                const res = await getUpDown();
                if(res.code==100){
                    this.up = res.content.up;
                    this.down = res.content.down;
                    this.total = res.content.total;
                    //计算看涨所占%比
                    let upRate = parseInt((this.up/this.total)*100);
                    let single = 0;//百分比增加中间变量
                    let that = this;
                    var anim = setInterval(function(){
                        single++
                        that.$refs.bar.style.width=single+'%';
                        if(single==upRate)clearInterval(anim)
                        if(single==100)clearInterval(anim)
                    },10)
                }
            },
            async queryPriceTo24h(el){  //查询当日价格曲线图数据
                var res=await queryPriceTo24h();
                if(res.code==100){
                    this.theDayTime=res.content.dates;
                    this.theDayPrice=res.content.prices;
                    this.renderTheDay(this.theDayTime,this.theDayPrice,el)
                }
            },
            renderTheDay(time,price,el){  //当日价格曲线图绘制
                    var val1=time.split(',');
                    var val2=price.split(',');
                    //纵坐标金额转换成数值
                    var valArray=[];
                    for(var i=0;i<val2.length;i++){
                        var a=parseFloat(val2[i]);
                        valArray.push(a);
                        valArray.slice(0,100)
                    }
                    var num=parseInt((val1.length-1)/2)//多少个值显示一个
                    if(val1.length<=2){
                        var num=parseInt((val1.length+1)/2)//多少个值显示一个
                    }
                    var arrayVal = valArray;
                    //计算纵坐标值与值间的差值
                    var min=arrayVal[0],max=arrayVal[0];
                    var len=arrayVal.length;
                    for(var j=0;j<len;j++){
                        if(arrayVal[j]>max){
                            max=arrayVal[j];
                        }
                        if(arrayVal[j]<min){
                            min=arrayVal[j];
                        }
                    }
                    var yInter=(max-min)/4;
                    this.option1={
                       chart: {
                         type: 'area'
                      },
                      colors: ['#EDA835'],
                      title: {
                        text: ''
                      },
                      credits:{
                        enabled:false
                      },
                      xAxis: {
                        categories: val1,
                        tickInterval: num,
                        labels:{
                          style:{
                            color:"#A2A2A2",
                            fontSize:'.18rem'
                          },
                        },
                        tickLength:1
                     },
                     yAxis: {
                        gridLineColor:"#eeeeee",
                        gridLineDashStyle:"Solid",
                        gridLineWidth:".02rem",
                        tickInterval: yInter,
                        title: {
                          text: ''
                        },
                        labels:{
                           formatter:function(){
                              return (this.value*1).toFixed(2)
                            },
                           style:{
                             color:"#A2A2A2",
                             fontSize:'0.19rem'
                            }
                        }
                     },
                     legend: {
                       enabled: false
                     },
                     plotOptions: {
                      area: {
                        fillColor: {
                          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                          stops: [
                          [0, '#fff'],
                          [1, 'rgba(234,153,3,0)']
                          ]
                        },
                        marker: {
                          enabled: false,
                          states:{
                            hover:{
                              radius: 3,
                              lineColor: '#eabfaf',
                              lineWidth: 1,
                              fillColor:'#ffbb3d',
                              shadow: false
                            }
                          }
                        },
                        shadow: false,
                        states:{
                          hover:{
                            lineWidth: 1,
                            halo:{
                              size:0
                            }
                          }
                        },
                        lineWidth: 1.5,
                        threshold: null
                      },
                    },
                    tooltip: {
                      crosshairs: {
                        width: 1,
                        color: '#e5e5e5',
                        dashStyle: 'Solid'
                      }
                    },
                    series: [{
                      type: 'area',
                      name: '金价',
                      data:arrayVal
                    }]
               };
               highCharts.chart(el,this.option1);
            },
            // 历史收盘价
            async queryClosePriceToDay(month,el){
                var res=await queryClosePriceToDay(month);
                if(res.code==100){
                    this.theseDaysDate=res.content.dates;
                    this.theseDaysPrice=res.content.prices;
                    this.renderTheseDays(this.theseDaysDate,this.theseDaysPrice,el)
                }
            },
            renderTheseDays(dates,prices,el){
                var val1=dates.split(',');
                var val2=prices.split(',');
                var valArray=[];
                for(var i=0;i<val2.length;i++){
                    var a=parseFloat(val2[i]);
                    valArray.push(a);
                    valArray.slice(0,100)
                }
                var length=(val1.length-1)*1;

                var min=valArray[0],max=valArray[0];
                for(var j=0,len=valArray.length;j<len;j++){
                    if(valArray[j]>max){
                        max=valArray[j];
                    }
                    if(valArray[j]<min){
                        min=valArray[j];
                    }
                }
                var yInter=(max-min)/4;
                this.option2={
                    chart: {
                    },
                    colors: ['#EDA835'],
                    title: {
                        text: ''
                    },
                    credits:{
                        enabled:false
                    },
                    xAxis: {
                        categories: val1,
                        tickInterval: length,
                        labels:{
                            style:{
                                color:"#A2A2A2",
                                fontSize:'.18rem'
                            },
                        },
                        tickLength:1
                    },
                    yAxis: {
                        gridLineColor:"#eeeeee",
                        gridLineDashStyle:"Solid",
                        gridLineWidth:".02rem",
                        title: {
                            text: ''
                        },
                        labels:{
                            formatter:function(){
                                return (this.value*1).toFixed(2);
                            },
                            style:{
                                color:"#A2A2A2",
                                fontSize:'0.19rem'
                            }
                        },
                        tickInterval:yInter
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions:{
                        line:{
                            lineWidth: 1.5,
                            marker:{
                              enabled: false
                            }
                        }
                    },
                    series: [{
                      name: '金价',
                      data: valArray
                    }]
                };
                highCharts.chart(el,this.option2);
            },
			moveToRight(){
                if(this.$refs.activedLine.classList.contains('rightToleft'))
                {this.$refs.activedLine.classList.remove('rightToleft');}
                this.$refs.activedLine.classList.add('leftToright');
                this.leftActived=false;
                this.rightActived=true;
                this.currentShow=false;
                this.theDayTime="";
                this.theDayPrice="";
                this.initEchart2(-1)
            },
            moveToLeft(){
                if(this.$refs.activedLine.classList.contains('leftToright'))
                {this.$refs.activedLine.classList.remove('leftToright');}
                this.$refs.activedLine.classList.add('rightToleft');
                this.leftActived=true;
                this.rightActived=false;
                this.currentShow=true;
                this.theseDaysDate="";
                this.theseDaysPrice="";
                //重新切换到实时金价菜单时历史金价样式充值
                this.selectedFlag1=true;
                this.selectedFlag2=true;
                this.selectedFlag3=true;
                this.initEchart1();
            },
            initEchart1(){
                var el=document.getElementById('inside-container1');
                this.queryPriceTo24h(el);
            },
            initEchart2(month){
                var el=document.getElementById('inside-container2');
                this.queryClosePriceToDay(month,el);
            },
            toggle($event,days){ //切换显示周期
                this.theseDaysDate="";
                this.theseDaysPrice="";
                var el=$event.target;
                var classList=el.classList;
                if(classList.contains('nearMonth')){
                    this.selectedFlag1=true;
                    this.selectedFlag2=true;
                    this.selectedFlag3=true;
                    this.initEchart2(-1);
                }else if(classList.contains('nearThirdMonth')){
                    this.selectedFlag1=false;
                    this.selectedFlag2=false;
                    this.selectedFlag3=true;
                    this.initEchart2(-3);
                }else{
                    this.selectedFlag1=false;
                    this.selectedFlag2=true;
                    this.selectedFlag3=false;
                    this.initEchart2(-12); 
                }
            },
            //评论之前先判断有没有登入
            addComment(){
                if(!store.state.token){
                    this.$router.push({
                        path:'loginIn',
                        query:{
                            'from':'/currentAndHistory'
                        }
                    })
                    return;
                }
                document.getElementById('comment_mask').style.display = 'block'
                document.querySelector('.comment_box').style.display = 'block'
                document.getElementById('content').focus();
            },
            cancel(){
                document.getElementById('comment_mask').style.display = 'none'
                document.querySelector('.comment_box').style.display = 'none'
            },
            async publish(){
                if(!this.myContent){
                    Toast({
                        message: '您未发表任何内容',
                        position: 'bottom',
                        duration: 3000
                    })
                    document.getElementById('comment_mask').style.display = 'none'
                    document.querySelector('.comment_box').style.display = 'none'
                    return;
                }
                //再判断近一周有没有评论过
                var res=await userCmt();
                if(res.code==100){
                    if(res.content.comment=='1'){
                        this.myContent='';
                        Toast({
                            message: '您已经参与过评论,请下周再次参与',
                            position: 'bottom',
                            duration: 3000
                        })
                        document.getElementById('comment_mask').style.display = 'none'
                        document.querySelector('.comment_box').style.display = 'none'
                        return;
                    }
                }
                //通过上述的条件方可添加评论
                var result=await inEdCmt('',this.myContent);
                if(result.code==100){
                    Toast({
                        message: '发表成功',
                        position: 'bottom',
                        duration: 3000
                    })
                    this.myContent='';
                    document.getElementById('comment_mask').style.display = 'none'
                    document.querySelector('.comment_box').style.display = 'none'
                    this.getComment();
                }
            },
            //点击看涨跌之前先判断有没有登入
            goUpOrDown(value){
                if(!store.state.token){
                    this.$router.push({
                        path:'loginIn',
                        query:{
                            'from':'/currentAndHistory'
                        }
                    })
                }else{
                    if(this.isClick){
                        let val = value
                        //用户是否看涨跌
                        this.userCmt(val);
                    }
                }
            },
            //用户是否看涨跌
            async userCmt(val){
                //如果val值是auto，是加载页面触发
                //如果val值是up或down，是点击触发
                if(val=='auto'){
                    const res = await userCmt()//用户是否看涨跌接口
                    if(res.code==100){
                        if(res.content.upDown==0){//为0用户可以进行看涨跌
                           this.isClick=true
                        }else if(res.content.upDown==1){//为1用户不能进行看涨跌
                            this.isClick=false
                            document.getElementsByClassName('goUpBtn')[0].classList.add("votedStyle");
                            document.getElementsByClassName('goDownBtn')[0].classList.add("votedStyle");
                        }
                    }
                }else{
                    let value=val
                    this.inEdCmt(value)
                }
            },
            //用户进行看涨跌
            async inEdCmt(value){
                if(this.isClick)
                //如果value值是up，调用上传看涨跌接口，传1
                //如果value值是down，调用上传看涨跌接口，传2
                if(value=='up'){
                    const res = await inEdCmt(1,'')
                    if(res.code==100){
                        Toast({
                            message: res.content.errMsg,
                            position: 'bottom',
                            duration: 3000
                        })
                        //看涨+1动画
                        this.$refs.voteSign1.classList.add('addAnimate');
                        //点击完涨跌，按钮置灰，不可再点击，重新请求一次看涨跌接口
                        this.UpDown()
                        this.isClick=false
                        document.getElementsByClassName('goUpBtn')[0].classList.add("votedStyle");
                        document.getElementsByClassName('goDownBtn')[0].classList.add("votedStyle");
                    }
                }else if(value=='down'){
                    const res = await inEdCmt(2,'')
                    if(res.code==100){
                        Toast({
                            message: res.content.errMsg,
                            position: 'bottom',
                            duration: 3000
                        })
                        //看跌+1动画
                        this.$refs.voteSign2.classList.add('addAnimate');
                        //点击完涨跌，按钮置灰，不可再点击，重新请求一次看涨跌接口
                        this.UpDown()
                        this.isClick=false
                        document.getElementsByClassName('goUpBtn')[0].classList.add("votedStyle");
                        document.getElementsByClassName('goDownBtn')[0].classList.add("votedStyle");
                    }
                }
            },
            //获取用户金价评论
            async getComment(){
                this.searchCondition.pageNo=1;
                const res = await getCommentList(this.searchCondition.pageNo,this.searchCondition.pageSize);
                if(res.code==100){
                    this.comments = res.content.list;
                    this.pages = res.content.pages; //评论总页数
                    if(this.searchCondition.pageNo>=this.pages){
                       this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
                    }
                }
            },
            async loadMore(){
                this.searchCondition.pageNo=this.searchCondition.pageNo+1;
                const res = await getCommentList(this.searchCondition.pageNo,this.searchCondition.pageSize);
                if(res.code==100){
                    this.comments = this.comments.concat(res.content.list);
                    if(this.searchCondition.pageNo>=this.pages){
                        this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
                    }
                }
            },
            //上拉加载
            loadBottom(){
                var that=this;
                setTimeout(function(){
                    that.loadMore();
                    that.$refs.loadmore.onBottomLoaded();
                },800)
            }
	    },
        updated(){
            if(this.allLoaded){
                //创建标签 提示内容已到底部 加载完毕
                var dv=document.querySelector('.hasBottom');
                if(dv){
                    dv.parentNode.removeChild(dv)
                }
                var p=document.createElement('p');
                p.classList.add('hasBottom')
                p.innerHTML='已经到底了~';
                p.style.fontSize='0.24rem';
                p.style.color = '#999999';
                p.style.width='100%';
                p.style.height='0.8rem';
                p.style.lineHeight ='0.8rem';
                p.style.textAlign = 'center';
                document.querySelector('.myUl').appendChild(p)
            }
        },
        destroyed(){
            window.onorientationchange=null;
            window.localStorage.removeItem('page')
        }
	}
</script>

<style scoped>
    *{
	    margin: 0;
	    padding: 0;
	    box-sizing: border-box;
	    font-family:PingFang-SC-Regular;
    }
    /*tab栏样式*/
    .currentHistory{
        position: relative;
    }
    .currHisTab{
        width:100%;
        padding:0 .28rem;
        height:0.88rem;
        z-index:100;
        border-bottom: 1px solid #EFEFEF;
        background-color: #fff;
        position:fixed;
        top:0;
        left:0;
    }
    .currHisTab .head_goback{
        width:.19rem;
        height:.36rem;
        position:absolute;
        left:0.28rem;
        top:50%;
        margin-top:-.18rem;
    }
    .currHisTab .tabBar{
        width:3.5rem;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
        margin:0 auto;
        height:0.88rem;
        line-height: 0.88rem;
        justify-content:space-between;
        -webkit-justify-content:space-between;
        -moz-justify-content:space-between;
        -o-justify-content:space-between;
    }
    .currHisTab .tabBar .current,.currHisTab .tabBar .history{
        font-size: 0.33rem;
    }
    .activedLine{
        width:0.44rem;
        height:0.04rem;
        background-color: #eda835;
        position: absolute;
        bottom:0;
        left:2.4rem;
    }
    .activedLine.leftToright{
        animation: leftToright 0.4s linear;
        -moz-animation: leftToright 0.4s linear;
        -o-animation: leftToright 0.4s linear;
        -webkit-animation: leftToright 0.4s linear;
        animation-fill-mode:forwards;
        -moz-animation-fill-mode:forwards;
        -o-animation-fill-mode:forwards;
        -webkit-animation-fill-mode:forwards;
    }
    .activedLine.rightToleft{
        animation: rightToleft 0.4s linear;
        -moz-animation: rightToleft 0.4s linear;
        -o-animation: rightToleft 0.4s linear;
        -webkit-animation: rightToleft 0.4s linear;
        animation-fill-mode:forwards; 
        -webkit-animation-fill-mode:forwards; 
        -o-animation-fill-mode:forwards; 
        -moz-animation-fill-mode:forwards; 
    }
    .currentClass{
        color:#eda835;
    }
    /*图标样式*/
    .echarts{
        margin-top:0.88rem;
        padding:0 .28rem;
    }
    #inside-container1{
        width:100%;
        height:4rem;
    }
    #currentPrice-container1{
        height:1.2rem;
        line-height: 1.4rem;
        text-align: right;
    }
    #currentPrice-container1 #currPrice{
        font-size:.44rem;
        color:#EDA835;
        font-weight: bold;
    }
    #currentPrice-container1 .unit{
        font-size:.22rem; 
        color:#A5A5A5;
    }
    /*折线图*/
     #inside-container2{
        height:4.56rem;
        width:100%;
    }
    .toggleBtn{
        height:0.62rem;
        width:5.38rem;
        background-color:#F5F5F5; 
        border-radius:0.31rem;
        -webkit-border-radius:0.31rem;
        -moz-border-radius:0.31rem;
        -o-border-radius:0.31rem;
        margin:0 auto;
        margin-top:1.4rem;
        margin-bottom:.58rem;
        position: relative;
    }
    .toggleBtn span{
        display: inline-block;
        width:33.3333%;
        height:.62rem;
        line-height: .62rem;
        text-align: center;
        font-size:.25rem;
        float:left;
    }
    .noSelectedStyle{
        color:#000;
        background-color:#F5F5F5; 
        border-radius: 0.31rem;
        -webkit-border-radius:0.31rem;
        -moz-border-radius:0.31rem;
        -o-border-radius:0.31rem;
    }
    .selectedStyle{
        color:#fff;
        background-color:#F2B643; 
        border-radius: 0.31rem;
        -webkit-border-radius:0.31rem;
        -moz-border-radius:0.31rem;
        -o-border-radius:0.31rem;
    }
    #outer-container2 p{
        color:#A1A1A1;
        font-size:.23rem;
        height:.6rem;
        position: relative;
        padding-left:.23rem;
    }
    #outer-container2 p:before{
        content:"";
        height:10px;
        width:10px;
        position: absolute;
        left:0rem;
        top:0.04rem;
        background-color: #F2B643;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -o-border-radius: 50%;
        -moz-border-radius: 50%;
    }
    /*金价来历*/
    .originLink{
        text-align: center;
        font-size:.26rem;
        color:#949494;
    }
    .originLink .desc{
        position: relative;
    }
    .originLink .desc:before{
        content:'';
        width:.24rem;
        height:.24rem;
        background:url(../../images/goldOrigin.png) no-repeat;
        background-size: 100%;
        position: absolute;
        top:0.05rem;
        left:-.34rem;
    }
    .goldPriceOrigin{
        height:.56rem;
    }
    /*本周行情*/
    .weekQuotation{
        border-bottom: 1px solid #EEEEEE;
        border-top: 1px solid #EEEEEE;
        padding:.4rem .29rem 0 .31rem;
    }
    .joinPerson{
        height:1rem;
    }
    .joinPerson .joinTitle{
        font-size:.34rem;
        font-weight: 700;
        float: left;
    }
    .joinPerson .personCount{
        font-size:.22rem;
        color:#9A9A9A;
        float: right;
        line-height:.5rem;
    }
    /*看跌看涨*/
    .mainMessage .vote{
        height:0.4rem;
        line-height: 0.4rem;
    }
    .vote .goUp{
        float: left;
        color:#ff6d39;
        position: relative;
    }
    .vote .goDown{
        float:right;
        color:#5bc872;
        position: relative;
    }
    .vote .goUp span:nth-child(2),.vote .goDown span:nth-child(2){
        font-size:.24rem;
    }
    .vote .goUp span:nth-child(3),.vote .goDown span:nth-child(3){
        font-size:.22rem;
    }
    .voteSign1,.voteSign2{
        font-size:.2rem;
        position: absolute;
        top:0.23rem;
        right:-0.24rem;
        opacity:0;
    }
    .voteSign1.addAnimate,.voteSign2.addAnimate{
        animation:fadeInAndOut 1s linear;
        animation-fill-mode:forwards; 
    }
    /*比例条*/
    .ratioBar{
        height:0.08rem;
        margin-top:.28rem;
        background-color: #5bc872;
        border-radius: 4px;
    }
    .bar{
        height:0.1rem;
        border-radius: 4px;
        position: relative;
        background-color: #ff6d39;
    }
    .bar>div{
        width: .3rem;
        height: .3rem;
        line-height: .28rem;
        border-radius: 50%;
        -moz-border-radius: 50%; 
        -o-border-radius: 50%; 
        -webkit-border-radius: 50%; 
        background-color: #fd9d0f;
        font-size: 13px; 
        font-weight: bold;
        color:#fff;
        text-align: center;
        position: absolute;
        top: -5px;
        right: 0;
    }
    /*投票按钮*/
    .voteBtn{
        height:0.6rem;
        margin-top:.36rem;
        margin-bottom:.4rem;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
        justify-content:space-between;
        -webkit-justify-content:space-between;
        -moz-justify-content:space-between;
        -o-justify-content:space-between;
    }
    .voteBtn .goUpBtn,.voteBtn .goDownBtn{
        width:1.28rem;
        height:0.62rem;
        font-size:0.26rem;
        line-height:0.62rem;
        text-align: center;
    }
    .voteBtn .goUpBtn{
        border:1px solid #ff6d39;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -o-border-radius: 4px;
        color:#ff6d39;
    }
    .voteBtn .goDownBtn{
        border:1px solid #5bc872;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -o-border-radius: 4px;
        color:#5bc872;
    }
    .voteBtn .goUpBtn.votedStyle,.voteBtn .goDownBtn.votedStyle{
        border: none;
        background-color:#B6B6B6; 
        color:#fff;
    }
    /*评论信息*/
    .comment{
        padding:0.4rem .26rem 1.4rem .26rem;
    }
    .comment h4{
        height:.74rem;
        font-size:.32rem;
        color:#333333;
        font-weight: bold;
    }
    .subList{
        display:flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
        position: relative;
    }
    .subList .commentInfo{
        width:6rem;
    }
    .comment .subList .p1{
        height:.44rem;
        font-size:.22rem;
        color:#EDA835;
    }
    .comment .subList .p2{
        line-height:.44rem;
        font-size:.28rem;
        color:#666666;
    }
    .comment .subList .p3{
        height:.82rem;
        font-size:.18rem;
        color:#999999;
    }
    .subList .image{
        width:0.9rem;
        text-align: left;
        padding-top:.04rem;
    }
    .image img{
        width:.7rem;
        height:.7rem;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -o-border-radius: 50%;
    }
    /*.subList .dianzan{
        font-size:.18rem;
        color:#999999;
        position: absolute;
        top:0;
        right:0;
        height:.26rem;
        line-height:.26rem;
    }
    .subList .dianzan:before{
        content:"";
        width:0.24rem;
        height:0.24rem;
        background:url(../../images/dianzan.png);
        background-size:100%; 
        position:absolute;
        left:-0.36rem;
        top:0rem;
    }*/
    /*底部*/
    .footer{
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
        position: fixed;
        bottom:0;
        z-index:200;
    }
    /*添加评论部分*/
    .comment_mask{
        width:100%;
        height:100%;
        position: absolute;
        top:0;
        left:0;
        z-index: 300;
        background-color: rgba(0,0,0,.1);
        display:none;
    }
    .comment_box{
        display: none;
        height:3.18rem;
        width:100%;
        background-color: #fff;
        position: absolute;
        bottom:0;
        left:0;
        z-index:400;
    }
    .comment_box .title{
        height:1.23rem;
        display:flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
        padding-left:.28rem;
        padding-right:.28rem;
        line-height: 1.23rem;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        -moz-justify-content: space-between;
        -o-justify-content: space-between;
    }
    .comment_box .title .cancel,.comment_box .title .publish{
        font-size:.28rem;
        color:#666666;
    }
    .comment_box .title h2{
        font-size:.32rem;
    }
    .pulishBtn{
        height:.98rem;
        width:2.5rem;
        background-color: #F8F8F8;
        line-height: .98rem;
        font-size:.3rem;
        text-align: center;
    }
    .comment_box .textareac{
        width:100%;
        height:1.4rem;
        resize: none;
        font-size:.32rem;
        color:#999999;
        padding-left:.3rem;
        padding-top:.48rem;
        border:none;
        border-top:1px solid #EEEEEE;
        border-bottom:1px solid #EEEEEE;
    }
    .buyGoldLink{
        height:.98rem;
        width:5.02rem;
        background-color: #F2B643;
        text-align: center;
        line-height: .98rem;
        font-size:.34rem;
        color:#fff;
    }
    .priceOrigin{
        margin-top:.88rem;
        padding:0 .76rem;
    }
    .priceOrigin .originTitle{
        height:1.78rem;
        line-height:1.78rem;
        text-align: center;
        font-size:.4rem;
        color:#000000;
        border-bottom:1px solid #EEEEEE;
    } 
    .priceOrigin .originContent{
        padding-top:.42rem;
        color:#666666;
        font-size:.28rem;
    }
    .priceOrigin .originContent h4{
        height:.5rem;
        font-weight: normal;
    }
    .priceOrigin .originContent p{
        line-height: .44rem;
    }
    .priceOrigin .closeOrigin{
        text-align: center;
        margin-top:1.36rem;
        margin-bottom:1.1rem;
    }
    .priceOrigin .closeOrigin img{
        width:.46rem;
        height:.52rem;
    }
    @keyframes leftToright
     {
        from {left:2.4rem;}
        to {left:4.6rem;}
     }
    @keyframes rightToleft
     {
        from {left:4.6rem;}
        to {left:2.4rem;}
     }
    @keyframes fadeInAndOut
    {
        from{top:0.23rem;opacity:1;}
        to{top:-0.23rem;opacity:0;}
    }
</style>