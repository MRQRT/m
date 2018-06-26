<template>
	<div class="investementMess">
        <div class="detailSetUp">
            <head-top headTitle='定投设置' class="head-top">
                <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
            </head-top>
            <!--投入总数量-->
            <section class="totalCount">
                <p class="investTitle">{{willInvest}}</p>
                <!-- <p class="investCount">{{willInvestCount}}</p> -->
                <p class="investCount">{{monthCount | monthCount_3}}</p>
            </section>
            <!--时间设置-->
            <section class="setUpTime">
               <!--多久实现梦想-->
                <div class="long">
                    <p class="longTitle">多久实现梦想</p>
                    <!--设置几个月-->
                    <div class="length">
                        <span class="minus" @touchstart="minusCount"><img src="../../images/minus.png"></span>
                        <span class="months" @click="openPicker">{{monthLenth}}</span>
                        <span class="plus" @touchstart="plusCount"><img src="../../images/addBg.png" style="width:.5rem;"></span>
                    </div>
                    <p class="end">预计{{endTime}}实现梦想</p>
                </div>
                <!--每周每月存入数量-->
                <!-- <div class="perMonthOrWeek">
                    <div class="perWeek" :class="{'checked':weekYes,'notchecked':monthYes}" @click="chooseWeek">
                        <p class="p1">每周存入({{depend}})</p>
                        <p class="p2">{{ weekCount | weekCount_3 }}</p>
                    </div>
                    <div class="perMonth" :class="{'checked':monthYes,'notchecked':weekYes}" @click="chooseMonth">
                        <p class="p1">每月存入({{depend}})</p>
                        <p class="p2">{{ monthCount | monthCount_3 }}</p>
                    </div>
                </div> -->
                <!--存入频率-->
                <div class="frequency">
                    <p class="subTitle">存入日期</p>
                    <div class="rate" @click="openSubPicker">{{rateText}}
                        <img src="../../images/downArrow.png" class="pullDown">
                    </div>
                    <p class="nextInvest">下次转入日期:{{nextDate}}</p>
                </div>
                <!--协议-->
                <section class="argument">
                    <input type="checkBox" class="check">
                    <strong :class="{'change1':bg,'change2':!bg}" @click="bg=!bg" ref="arg"></strong>
                    <router-link to="/arguments" tag="div">
                        <span class="txt">已阅读并同意《黄金消费综合服务协议》</span>
                    </router-link>
                </section>
            </section>
            <!--确定按钮-->
            <a class="ok" @click="goToSuc" id="click_btn" :class="{'lightBtn':bg,'darkBtn':!bg}">确定</a>
            <!-- 月份选取模态框(执行周期) -->
            <pd-select-box class="picker" v-show="pickerShow&&pickerShow_month">
                <pd-select-item :listData="monthes" v-model="monthLenth"></pd-select-item>
            </pd-select-box>
            <!-- 日期选取模态框(执行频率) -->
            <pd-select-box class="picker" v-show="pickerShow&&pickerShow_date">
                <pd-select-item :listData="datas" v-model="rateText"></pd-select-item>
            </pd-select-box>
            <!--确定提交定投订单的弹窗-->
            <section class="mask" v-if="maskShow">
                <div class="smallWindow">
                    <h4>提示</h4>
                    <p>确定要提交定投计划吗?</p>
                    <div class="btns">
                        <span style="border-right: 1px solid #EFEFEF;" @click="maskShow=false">取消</span>
                        <span @click="updateOrder">确定</span>
                    </div>
                </div>
           </section>
        </div>
        <!--随picker出现的遮罩-->
        <div class="picker-mask" v-show="pickerShow" @click="setpicker"></div>
    </div>
</template>
<script>
    import headTop from '../../components/header/head.vue';
    import pdSelectItem from '@/components/reel/selectitem.vue'
    import pdSelectBox from '@/components/reel/slectBox.vue'
    import { formatDate } from '@/config/mUtils'
    import { queryRegularEndDate,addRegularPlan1,addRegularPlan2 } from '@/service/getData.js'
    import { Toast } from 'mint-ui'
	export default {
		data(){
			return {
                  productId: '',//定投产品Id
                weightOrRmb: '',//按克重为1 按资金为2
                     budget: '',//定投的数量（单位为金额或克重）
                 willInvest: '每月将投入活期黄金(克)',
            willInvestCount: null,//总共将要投入的克重或金额
                    endTime: '',//实现梦想的时间
                     depend: '克',//每周存入元还是克重
                   monthYes: true,//默认每月投
                    weekYes: false, //默认每周投
                   nextDate: '',//下次转入日期
                   rateText: '每月1日',//定投时间
                 monthLenth: '6个月',//默认六个月
                 pickerShow: false,//时间选取滚轮的开关
           pickerShow_month: false,//月份选取滚轮开关
            pickerShow_date: false,//日期选取滚轮开关
                   maskShow: false,//修改定投订单确定弹窗
                         bg: true,  //是否阅读了协议(默认阅读)
                    monthes: ['1个月','2个月','3个月','4个月','5个月','6个月','7个月','8个月','9个月','10个月','11个月','12个月','13个月','14个月','15个月','16个月','17个月','18个月','19个月','20个月','21个月','22个月','23个月','24个月','25个月','26个月','27个月','28个月','29个月','30个月','31个月','32个月','33个月','34个月','35个月','36个月'],
                      datas: ['每月1日','每月2日','每月3日','每月4日','每月5日','每月6日','每月7日','每月8日','每月9日','每月10日','每月11日','每月12日','每月13日','每月14日','每月15日','每月16日','每月17日','每月18日','每月19日','每月20日','每月21日','每月22日','每月23日','每月24日','每月25日','每月26日','每月27日','每月28日'],
                   listData: ['每月1日'],//给数组设置一个初始值
                       term: 180,//定投期限天数,页面默认是6个月，默认期限就是6*30=180天
                 regularDay: 1,//定投执行日，定投周期是一周，执行日的范围就是1~7，定投周期是一个月，执行日期的范围就是1~28，默认值是1
                     period: 28,//定投执行周期，7表示按周，28表示按月
                btnCtroller: true,//订单频繁提交按钮控制
			}
		},
        created(){
            this.weightOrRmb=this.$route.query.refer//按克重为1 按资金为2
            this.budget=this.$route.query.budget//定投的数量（单位为金额或克重）
            this.productId=this.$route.query.productId//定投的产品ID
        },
		mounted() {
            this.queryRegularDate(180,28,1);//查询定投期限天数和下次执行日，日期查询完后格式化时间(参数一表示期限天数（默认6个月，一个月按30天计算），参数二表示周期（默认是按周），参数三表示定投日)
            if(this.$route.query.refer==2){
                this.willInvest='每月将投入金额(元)';
                this.depend='元'
            }
            this.willInvestCount=this.$route.query.budget || 0;
		},
		computed:{
            //每周存入
			weekCount(){
                var month=this.monthLenth.split('个')[0];
                if(this.depend=='克'){
                    //先将小数变成整数，再将整数恢复成
                    return Math.ceil((this.willInvestCount/month/4)*10000)/10000
                }
                return Math.ceil((this.willInvestCount/month/4)*100)/100
            },
            //每月存入
            monthCount(){
                var month=this.monthLenth.split('个')[0];
                if(this.depend=='克'){
                    return Math.ceil((this.willInvestCount/month)*10000)/10000
                }
                return Math.ceil((this.willInvestCount/month)*100)/100;
            }
		},
        filters:{
            weekCount_3:function(val){
                if(val+''.length==5){
                    return Math.ceil(parseInt((val)*1000))/1000
                }
                return Math.ceil(parseInt((val)*100))/100
            },
            monthCount_3:function(val){
                if(val+''.length==5){
                    return Math.ceil(parseInt((val)*1000))/1000
                }
                return Math.ceil(parseInt((val)*100))/100
            }
        },
		methods:{
            //点击减号
			minusCount(){
                var month=this.monthLenth.split('个')[0];
                if(month==1){
                    return;
                }
                month--;
                this.monthLenth=month+'个月'
            },
            //点击加号
           plusCount(){
                var month=this.monthLenth.split('个')[0];
                if(month==36){
                    return;
                }
                month++;
                this.monthLenth=month+'个月'
            },
            //定投期限时间选择按钮点击
            openPicker(){
                if(!this.pickerShow&&!this.pickerShow_month){
                    this.pickerShow=true;
                    this.pickerShow_month=true;
                }
            },
            //点击每周存入
            // chooseWeek(){
            //     this.weekYes=true;
            //     this.monthYes=false;
            //     this.rateText='每周一';
            //     this.period=7;
            //     this.regularDay=1; 
            //     this.queryRegularDate(this.term,7,1);
            // },
            //点击每月存入
            // chooseMonth(){
            //     this.monthYes=true;
            //     this.weekYes=false;
            //     this.rateText='每月1日';
            //     this.period=28;
            //     this.regularDay=1;
            //     this.queryRegularDate(this.term,28,1);
            // },
            //打开执行频率选取模态框
            openSubPicker(){
                if(!this.pickerShow&&!this.pickerShow_date){
                    this.pickerShow=true;
                    this.pickerShow_date=true;
                }
            },
            //关闭模态框
            setpicker(){
                this.pickerShow=false
                this.pickerShow_month=false
                this.pickerShow_date=false
            },
            //确定
            goToSuc(){
                if(!this.bg){
                    Toast({
                        message: '请阅读相关协议', 
                        position: 'bottom',
                        duration: 3000
                   });
                    return;
                }
                this.maskShow=true;
            },
            //查询定投到期日和下次投资的时间
            async queryRegularDate(val1,val2,val3){
                const res = await queryRegularEndDate(val1,val2,val3);
                if(res.code==100){
                    var endDate = res.content.endDate
                    var nextDate = res.content.nextDate
                }
                this.setEndDate(endDate,nextDate);//定投完成日期(参数一完成期限，参数二下次投资时间)
            },
            //设置结束时间
            setEndDate(val1,val2){
                this.endTime = val1.split('-')[0]+'年'+val1.split('-')[1]+'月'+val1.split('-')[2]+'日'
                this.nextDate = val2.split('-')[0]+'年'+val2.split('-')[1]+'月'+val2.split('-')[2]+'日'
            },
            //定投订单提交
            async updateOrder(){
                if(this.btnCtroller){
                    this.btnCtroller=false
                    if(this.weightOrRmb==1){//按克重为1 按资金为2
                        let regularAmount=this.monthYes==true?this.monthCount:this.weekCount
                        const res = await addRegularPlan1(this.productId,this.budget,this.term,this.period,this.regularDay,regularAmount)
                        this.maskShow=false;
                        if(res.code==100){
                            this.$router.push({
                                path: '/investSuc',
                                query:{
                                    result:res.content
                                }
                            })
                        }else if(res.code==10006 || res.code==10007){
                            Toast({
                                message: res.message,
                               position: 'middle',
                               duration: 4000,
                            })
                        }
                    }else if(this.weightOrRmb==2){//按资金
                        let regularAmount=this.monthYes==true?this.monthCount:this.weekCount
                        const res = await addRegularPlan2(this.productId,this.budget,this.term,this.period,this.regularDay,regularAmount);
                        this.maskShow=false;
                        if(res.code==100){
                            this.$router.push({
                                path: '/investSuc',
                                query:{
                                    result:res.content
                                }
                            })
                        }else if(res.code==10004 || res.code==10005){
                            Toast({
                                message: res.message,
                               position: 'middle',
                               duration: 4000,
                            })
                        }
                    }
                }else{
                    Toast("频繁提交")
                }
            },
		},
        watch:{
            //监听期限---月为单位
            monthLenth(val){
                var data=(val.split('个')[0])*1;
                this.term=val.split('个')[0]*30;
                this.queryRegularDate(this.term,this.period,this.regularDay);
            },
            //执行频率
            rateText(val){
                //
                if(this.weekYes){
                    var selectDay=val=='每周一'?1:(val=='每周二'?2:(val=='每周三'?3:(val=='每周四'?4:5)));
                    this.regularDay=selectDay
                    //重新请求完成时间
                    this.queryRegularDate(this.term,this.period,this.regularDay);
                }
                if(this.monthYes){
                    var selectDate=val=='每月1日'?1:(val=='每月2日'?2:(val=='每月3日'?3:(val=='每月4日'?4:(val=='每月5日'?5:(val=='每月6日'?6:(val=='每月7日'?7:(val=='每月8日'?8:(val=='每月9日'?9:(val=='每月10日'?10:(val=='每月11日'?11:(val=='每月12日'?12:(val=='每月13日'?13:(val=='每月14日'?14:(val=='每月15日'?15:(val=='每月16日'?16:(val=='每月17日'?17:(val=='每月18日'?18:(val=='每月19日'?19:(val=='每月20日'?20:(val=='每月21日'?21:(val=='每月22日'?22:(val=='每月23日'?23:(val=='每月24日'?24:(val=='每月25日'?25:(val=='每月26日'?26:(val=='每月27日'?27:28))))))))))))))))))))))))));
                    this.regularDay = selectDate
                    //重新请求完成时间
                    this.queryRegularDate(this.term,this.period,this.regularDay);
                }
            },
        },
		components:{
            headTop,
            pdSelectItem,
            pdSelectBox
		}
	}
</script>

<style scoped>
    .investementMess{
        background-color: #fff;
        padding-top:.88rem;
        position: relative;
        padding-bottom: .2rem;
    }
    .investementMess .picker-mask{
        position:absolute;
        width:100%;
        height:100%;
        background-color: rgba(0,0,0,.5);
        top:0;
        z-index:14;
    }
    .detailSetUp{
        padding-left:.3rem;
        padding-right:.3rem;
    }
    .detailSetUp .totalCount{
        height:2.9rem;
        padding-top:.8rem;
        text-align: center;
    }
    .totalCount .investTitle{
        font-size:.3rem;
        line-height:.3rem;
        margin-bottom:.33rem;
    }
    .totalCount .investCount{
        /* font-size:.66rem; */
        font-size:.88rem;
        color:#EDA835;
        font-weight: bold;
        line-height:.72rem;
    }
    .setUpTime{
        margin-bottom: 1.57rem;
    }
    .setUpTime .long{
        height:2.68rem;
    }
    .long .longTitle{
        height:.58rem;
        font-size:.3rem;
        color:#666666;
    }
    .long .length{
        height:.9rem;
        background-color: #F5F5F5;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -o-border-radius: 4px;
    }
    .long .length span{
        position: relative;
    }
    .long .length .minus,.long .length .plus{
        width:1rem;
    }
    .length .months{
        width:5.3rem;
        text-align: center;
        line-height: .9rem;
        font-size:.32rem;
    }
    .minus img{
        width:.48rem;
        height:.04rem;
        position: absolute;
        top:50%;
        left:50%;
        margin-top:-.02rem;
        margin-left:-.24rem;
    }
    .minus:active,.plus:active{
        background-color: rgba(0,0,0,0.3);
    }
    .plus img{
        width:.5rem;
        height:.5rem;
        position: absolute;
        top:50%;
        left:50%;
        margin-top:-.25rem;
        margin-left:-.25rem;
    }
    .long .end{
        font-size:.24rem;
        color:#A3A3A3;
        line-height:.24rem;
        margin-top:.2rem;
    }
    .perMonthOrWeek{
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .perMonthOrWeek .perMonth,.perMonthOrWeek .perWeek{
        width:3.38rem;
        text-align:center;
        padding-top:.18rem;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -o-border-radius: 4px;
    }
    .perMonthOrWeek .perWeek{
        margin-right:.2rem;
    }
    .perMonthOrWeek .checked{
        background-color:#F2B643;
        color:#fff;
    }
    .perMonthOrWeek .notchecked{
        background-color:#F5F5F5;
        color:#000;
    }
    .perMonthOrWeek .perMonth .p1,.perMonthOrWeek .perWeek .p1{
        font-size:.24rem;
        height:.44rem;
    }
    .perMonthOrWeek .perMonth .p2,.perMonthOrWeek .perWeek .p2{
        font-size:.24rem;
        font-weight: bold;
        height:.38rem;
    }
    .frequency{
       /* padding-top:.8rem; */
       padding-top:.0rem;
    }
    .frequency .subTitle{
        height:.58rem;
        font-size:.3rem;
        color:#666666;
    }
    .frequency .rate{
        height: .9rem;
        background-color: #F5F5F5;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -o-border-radius: 4px;
        line-height: .9rem;
        text-align: center;
        font-size:.34rem;
        font-weight: bold;
        position: relative;
    }
    .frequency .nextInvest{
        font-size: .24rem;
        color: #A3A3A3;
        line-height: .24rem;
        margin-top: .2rem;
    }
    .rate .pullDown{
        position: absolute;
        width:.36rem;
        height:.19rem;
        top:50%;
        margin-top:-.1rem;
        right:0.18rem;
    }
    .ok{
        height:.9rem;
        width:6.92rem;
        background-color:#F2B643;
        font-size:.38rem;
        color:#fff;
        text-align: center;
        line-height: .9rem;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -o-border-radius: 4px;
        position: fixed;
        bottom:0.3rem;
    }
    .picker{
        height:4rem;
        position: fixed;
        bottom: 0;
        width:100%;
        left:0;
        background-color: #fff;
        z-index:15;
    }
     .investementMess .mask{
      position: absolute;
      width:100%;
      /* height:104%; */
      height:125%;
      top:0;
      left:0;
      background-color: rgba(0,0,0,.5);
      z-index: 11;
    }
    .investementMess .mask .smallWindow{
      width:4.94rem;
      background-color:#fff;
      border-radius: 10px;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      -o-border-radius: 10px;
      position: absolute;
      left:50%;
      margin-left:-2.47rem;
      top:4.4rem;
    }
    .investementMess .mask .smallWindow h4{
      height:.72rem;
      padding-top:.38rem;
      text-align: center;
      font-size:.36rem;
    }
    .investementMess .mask .smallWindow p{
      text-align: center;
      font-size:.24rem;
      margin-top:.2rem;
      color:#4D4D4D;
    }
    .investementMess .mask .smallWindow .btns{
      margin-top:.4rem;
      border-top: 1px solid #EFEFEF;
    }
    .investementMess .mask .smallWindow .btns span{
      display: inline-block;
      width:2.47rem;
      text-align: center;
      line-height: .8rem;
      color:#EDA835;
      font-size:.32rem;
      float: left;
    }
    .btns{
      width: 4.94rem;
    }
    /*可点击按钮背景颜色*/
    #click_btn.lightBtn{
        background-color:#F2B643!important;
    }
    /*不可点击按钮背景颜色*/
    #click_btn.darkBtn{
        background-color: #f8daa1!important;
    }
    .argument{
        margin-top:.18rem;
        font-size:.24rem;
        color:#9E9E9E;
        position: relative;
    }
    .argument .check{
        display:none;
    }
    .argument strong{
        width:.24rem;
        height:.24rem;
        position:absolute;
        left:0rem;
        top:.03rem;
    }
    .change1{
        background: url('../../images/readed.png') no-repeat;
        background-size: 100% 100%;
    }
    .change2{
        background: url('../../images/reading.png') no-repeat;
        background-size: 100% 100%;
    }
    .investementMess .argument .txt{
        margin-left:.38rem;
    }
</style>

<style>
  div.picker-selected{
    color: #EDA835;
  }
  .picker-toolbar{
    height:.54rem;
  }
</style>