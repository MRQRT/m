<template>
  <div class="storOrderDet">
    <head-top headTitle='订单详情' class="head-top" ref="topHead">
      <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="toBack">
    </head-top>
    <!--订单信息-->
    <div class="store_order_info">
      <img :src="storePics[0]">
      <div class="store_info_text">
        <p class="store_info_p1">订单编号：{{orderDetail.code || '--'}}</p>
        <p class="store_info_p2">状态：<span style="color:#EDA835;">{{orderDetail.status==0?'审核中':(orderDetail.status==1?'已取消':(orderDetail.status==2?'审核中':(orderDetail.status==3?'物流中':(orderDetail.status==4?'检验中':(orderDetail.status==5?'已取消':(orderDetail.status==6?'待确认':(orderDetail.status==8?'已完成':(orderDetail.status==9?'已取消':(orderDetail.status==10?'已取消':(orderDetail.status==11?'物流中':'已取消'))))))))))}}</span></p>
        <p class="store_info_p3">提交时间：{{orderDetail.createTime | formatTime}}</p>
      </div>
    </div>
    <!--订单状态-->
    <div class="state_text" v-if="stateShow">
       <div v-for="(item,index) in states" class="each_status" :id="index" :state="item.state" v-join @click="viewStateInfo($event)">
         <img :src="item.imgUrl">
         <p>{{item.text}}</p>
       </div>
    </div>
    <!--点击状态时显示的提示浮窗-->
    <!--审核状态-->
    <div class="tipWindow one" v-if="clickIndex==0 && examine">
        <!--待审核0-->
        <div v-if="orderDetail.status==0" class="tip_text">
          <p>我们正在马不停蹄地审核您的订单哦，审核结果将在2个</p>
          <p>工作日内通知到您！请耐心等待～</p>
          <p>您可以：<a id="editOrder" @click="editOrder">编辑订单>></a></p>
        </div>
        <!--审核未通过1-->
        <div v-if="orderDetail.status==1" class="tip_text">
          <p>订单已取消，</p>
          <p>您可以<a id="afreshOrder" @click="afreshOrder">重新填写订单>></a>，风里雨里我们在这里等您！</p>
        </div>
        <!--待取货2 物流中 3 检测中 4 检测不通过5 待用户确认6 已取消 9 已完成 8 已退货10 取货物流异常11 退货物流异常12-->
        <div v-if="orderDetail.status==2 || orderDetail.status==3 || orderDetail.status==4 || orderDetail.status==5 || orderDetail.status==6 || orderDetail.status==8 || orderDetail.status==9 || orderDetail.status==10 || orderDetail.status==11 || orderDetail.status==12" class="tip_text">
           <p>恭喜您，订单审核通过！</p>
           <p>我们已经安排快递小哥上门取件啦，请留意接听取件电话。</p>
        </div>
    </div>
    <!--物流运输-->
    <div class="tipWindow two" v-if="clickIndex==1 && delivery">
        <!--物流中 3-->
        <div v-if="orderDetail.status==3" class="tip_text">
          <p style="padding-bottom:.1rem;">快递小哥正在用心传递速度，物流单号：<a class="viewDelivery" @click="viewDelivery(orderDetail.expressNo)">{{orderDetail.expressNo}}</a></p>
        </div>
        <!--检测中 4  检测不通过5  待用户确认6  已完成 8  已取消 9  已退货10  退货物流异常12-->
        <div v-if="orderDetail.status==4 || orderDetail.status==5 || orderDetail.status==6 || orderDetail.status==8 || orderDetail.status==9 || orderDetail.status==10 || orderDetail.status==12" class="tip_text">
           <p style="padding-bottom:.1rem;">已签收！</p>
           <p style="padding-bottom:0;">亲爱的用户，您的宝贝我们收到啦 ~</p>
           <p>物流单号：<a class="viewDelivery" @click="viewDelivery(orderDetail.expressNo)">{{orderDetail.expressNo}}</a></p>
        </div>
        <!--取货物流异常11-->
        <div v-if="orderDetail.status==11" class="tip_text">
            <p style="padding-bottom:0;">宝贝不知道跑哪去了，已启动保险理赔程序，我们会尽快</p>
            <p style="padding-bottom:0.1rem;">为您处理！</p>
            <p>物流单号：<a class="viewDelivery" @click="viewDelivery(orderDetail.expressNo)">{{orderDetail.expressNo}}</a></p>
       </div>
    </div>
    <!--存金检验-->
    <div class="tipWindow three" v-if="clickIndex==2 && testing">
       <!--检测中 4-->
       <div v-if="orderDetail.status==4" class="tip_text">
          <p>亲，专业检测师紧锣密鼓地开工啦！1个工作日内就会有结果哦！</p>
       </div>
       <!--检测不通过5  待用户确认6  已取消 9  已完成 8  已退货10  退货物流异常12-->
       <div v-if="orderDetail.status==5 || orderDetail.status==6 || orderDetail.status==8 || orderDetail.status==9 || orderDetail.status==10 || orderDetail.status==12" class="tip_text">
          <p>您的订单检测完毕！请尽快查看并确认<a class="viewReport" @click="viewReport">检测报告</a>哦！</p>
       </div>
    </div>
    <!--订单确认-->
    <div class="tipWindow four" v-if="clickIndex==3 && conformOrder">
        <!--检测不通过5  待用户确认6-->
        <div v-if="orderDetail.status==5 || orderDetail.status==6" class="tip_text">
          <p>亲，只差最后一步啦,快来看看您的<a class="viewReport" @click="viewReport">检测报告</a>吧~</p>
          <p>三个工作日后将自动确认，如您对检测结果有任何疑问，</p>
          <p>请联系客服：<a @click="tele" class="telephone">4008-196-199</a></p>
        </div>
        <!--已取消 9 已退货10  退货物流异常12-->
        <div v-if="orderDetail.status==9 || orderDetail.status==10 || orderDetail.status==12" class="tip_text">
          <p>订单已取消！</p>
          <p>您的黄金已经在回家的路上啦，请注意查收！</p>
          <p>退货物流单号：<a class="returnGoods" @click="viewDelivery(orderDetail.expressNoReturn)">{{orderDetail.expressNoReturn}}</a></p>
        </div>
        <!--已完成 8-->
        <!--未提现-->
        <div v-if="orderDetail.status==8 && (isCash==2)" class="tip_text">
           <p>太棒啦，您的黄金克重会在一个工作日内到账，请到黄金</p>
           <p>管家-黄金账户中查看哦！</p>
        </div>
        <!--提现-->
        <div v-if="orderDetail.status==8 && (isCash==1 || isCash==3 || isCash==5)" class="tip_text">
            <p>恭喜啦，您的黄金克重提现成功， 2-5个工作日内到账，</p>
            <p>具体以银行实际到账时间为准哦！</p>
        </div>
        <!--提现失败-->
        <div v-if="orderDetail.status==8 && (isCash==4)" class="tip_text">
            <p>您的黄金克重提现失败，{{cashAmount || '0.00'}}元已经存入黄金现金账户！</p>
        </div>
    </div>
    <!--存金信息-->
    <div class="store_info">
      <h4>存金信息</h4>
      <p class="valuation">存金方式：<span>{{orderDetail.isCash==2?'存入克重':'直接变现'}}</span></p>
      <p class="other_info">{{orderDetail.brandType==1?'周大福':(orderDetail.brandType==2?'老凤祥':(orderDetail.brandType==3?'菜百':(orderDetail.brandType==4?'周生生':(orderDetail.brandType==5?'周大生':(orderDetail.brandType==6?'老庙':(orderDetail.brandType==7?'中国黄金':(orderDetail.brandType==8?'山东黄金':(orderDetail.brandType==9?'中金':orderDetail.brandName))))))))}}{{(orderDetail.brandType==10 && !orderDetail.brandName)? '':'/'}}{{orderDetail.productName}}/{{orderDetail.applyWeight || '--'}}克</p>
      <div class="picture_container">
        <img v-for="item in storePics" :src="item" @click="enlargeImg(item)">
      </div>
    </div>
    <!--查看物流-->
    <mt-popup
     v-model="popupVisible"
     position="bottom" id="logistics" v-if="logisticsShow">
        <section class='logistics_container'>
           <h3 class="logistics_title">物流信息</h3>
           <div v-for="(item,index) in logistics" class="each_logistics" :class="{'gray':index!=0}">
              <div class="logistics_time">
                <p style="font-size:.2rem;">{{item.time | formatExpressTime(1)}}</p>
                <p style="font-size:.18rem;">{{item.time | formatExpressTime(2)}}</p>
              </div>
              <div class="logistics_info"  v-points :id="index">
                <p v-fit>{{item.status}}</p>
              </div>
           </div>
           <div class="logistics_line"></div>
        </section>
        <div class="close_logistics" @click="close">
            <img src="../../images/closeWl.png">
        </div>
    </mt-popup>
    <!--点击图片放大图层-->
    <mt-popup
       v-model="popupVisibleImg"
       position="bottom" id="popupVisibleImg">
       <img :src="maxImg">
    </mt-popup>
    <!--点击查看检测报告-->
    <mt-popup
       v-model="popupVisibleReport"
       position="middle" id="popupVisibleReport">
       <section class="view_report">
           <h3 class="report_title">检测报告</h3>
           <p>订单号：{{orderDetail.code || '--'}}</p>
           <p>实测总毛重：{{orderDetail.realGrossWeight || '--'}}克</p>
           <p>实测总净重：{{orderDetail.realNetWeight || '--'}}克</p>
           <p>产品成色：{{orderDetail.productCondition | formatPoint}}‰</p>
           <p>检测人：{{orderDetail.verifyBy || '--'}}</p>
           <p>检测时间：{{orderDetail.verifyTime || '--'}}</p>
           <p>检测说明：{{orderDetail.verifyRemark || '--'}}</p>
           <p>检测结果：{{orderDetail.verifyResult==0?'通过':'不通过'}}</p>
           <img :src="checkImg">
           <div class="report_btns">
               <p style="border-right:1px solid #EEEEEE;" @click="confirmStor" :class="{'hasConfirm':orderDetail.status==8}" v-if="orderDetail.status==6 || orderDetail.status==8">{{orderDetail.status==8?'已确认':'确认订单'}}</p>
               <p @click="tele" :class="{'contact':orderDetail.status!=6 && orderDetail.status!=8}">联系客服</p>
           </div>
       </section>
    </mt-popup>
    <!--联系客服-->
    <mt-button type="primary" class="contact_service" @click="tele">联系客服</mt-button>
  </div>
</template>
<script type="text/javascript">
  import headTop from '@/components/header/head.vue'
  import { Button,Popup,Indicator,Toast } from 'mint-ui';
  import deliverying from '@/images/deliverying.png' //物流中
  import examining from '@/images/examining.png' //待审核
  import finished from '@/images/finished.png' //订单确认
  import noFinish from '@/images/noFinish.png' //订单待确认
  import cancelOrder from '@/images/cancelOrder.png' //订单确认失败
  import storeLightLine from '@/images/storeLightLine.png' //状态连线亮色
  import storLine from '@/images/storLine.png' //状态连线灰色
  import testFail from '@/images/testFail.png' //审核不通过
  import testing from '@/images/testing.png' //监测中
  import testSuccess from '@/images/testSuccess.png' //审核通过
  import waitingDeli from '@/images/waitingDeli.png' //待物流
  import waitingTest from '@/images/waitingTest.png' //待检测 
  import deliveryFail from '@/images/deliveryFail.png' //取货物流失败
  import current from '@/images/current.png' //最新物流信息
  import old from '@/images/old.png' //旧的物流信息
  import {mapState} from 'vuex'
  import { getRem,checkAgent } from '@/config/mUtils'
  import {queryRecycleOrderDetail, confirmationResult,queryExpress} from '@/service/getData.js'
  export default{
    data(){
      return {
        orderId: null,//存金订单Id
        stateShow:false,//状态默认不显示(延迟渲染)
        orderDetail:{},//存金订单
        states:[  //确定状态图片显示和连接线
          {
            imgUrl:examining,
            text:'订单审核',
            state:0
          },
          {
            imgUrl:waitingDeli,
            text:'物流运输',
            state:0
          },
          {
            imgUrl:waitingTest,
            text:'存金检验',
            state:0
          },
          {
            imgUrl:noFinish,
            text:'订单确认',
            state:0
          }
        ],
        storePics:[],//存金实物图片
        examine:false, //审核点击浮窗是否展示(判断状态是否到这)
        delivery:false, //物流点击浮窗是否展示(判断状态是否到这)
        testing:false, //检测点击浮窗是否展示(判断状态是否到这)
        conformOrder:false, //订单确认点击浮窗是否展示(判断状态是否到这)
        isCash:null, //是否提现 1是2否3已变现4变现失败
        clickIndex:null,//点击那个状态
        popupVisible:false,//物流框显示隐藏
        popupVisibleImg:false,//点击放大图片框出现
        logistics:[],//物流信息
        logisticsShow:false, //物流信息是否显示
        equipment:null,//手机设备
        maxImg: null,//放大图片
        popupVisibleReport:false,//检测报告弹窗
        checkImg:null,//检测报告图片
        comfirmLimit:true,//确认按钮避免重复提交
        cashAmount:null,//提现金额
      }
    },
    mounted(){
      let agent=checkAgent();
      this.equipment=agent  //拨打电话时有用
      this.orderId = this.$route.query.id
      this.orderDet()//存金详情订单
    },
    computed:{
      ...mapState([
         'currentPrice',
      ]),
    },
    directives: {
      join: {
        bind: function (el,binding, vnode) {
          var id=el.id
          if(id && id!=3){
            var img=document.createElement('img')
            if(!vnode.context.states[id].state){
              img.src=storLine
            }else{
              img.src=storeLightLine
            }

            img.style.height='.04rem'
            img.style.width='1.04rem'
            img.style.position='absolute'
            img.style.top='0.38rem'
            img.style.left='.94rem'
            el.appendChild(img)
          }
        }
      },
      points:{
        bind:function(el){
            var dv=document.createElement('div');
            dv.style.position="absolute"
            dv.style.zIndex="2"
            var id=el.id;
            if(id==0){
                dv.style.width='0.24rem'
                dv.style.height='0.24rem'
                dv.style.left="0.2rem"
                dv.style.top=".15rem"
                dv.style.backgroundImage='url('+current+')'
            }else{
                dv.style.width='0.14rem'
                dv.style.height='0.14rem'
                dv.style.top=".14rem"
                dv.style.left="0.26rem"
                dv.style.backgroundImage='url('+old+')'
            }
            dv.style.backgroundSize='100% 100%'
            el.appendChild(dv)
        }
      },
      fit:{
        bind:function(el,binding,vnode){
            setTimeout(function(){
                var myreg=/[1][3,4,5,7,8][0-9]{9}/g;  
                if(!el.parentNode) return
                var parentId=el.parentNode.id;
                var text=vnode.context.logistics[parentId].text
                if(!text) return
                var result=text.match(myreg)
                if(result){
                    var index=text.indexOf(result[0])  //判断手机号在文本中出现的位置
                    var arrString=text.split(result[0])
                    el.innerHTML='';
                    for(var i=0;i<arrString.length;i++){
                        var span=document.createElement('span')
                        span.innerHTML=arrString[i]
                        el.appendChild(span)
                    }
                    var a=document.createElement('a')
                    var tel=result[0]
                    var length=text.length-1-11  
                    a.style.color='#EDA835'
                    a.innerHTML=result[0];
                    a.onclick=vnode.context.tele;
                    var children=el.children
                    if(index==0){  //出现在首位
                        el.insertBefore(a,children[0])
                    }else if(index==length){//出现在后面
                        el.appendChild(a)
                    }else{  //出现在中间
                        el.insertBefore(a,children[1])
                    }
                }
            },500)
        }
      }
    },
    filters:{
      formatTime(val){
        if(!val) return;
        var arrTime=val.split(':')
        return arrTime.splice(0,arrTime.length-1).join(':')
      },
      formatExpressTime(val,parmas){
        if(!val) return;
        var arr=val.split(' ')
        if(parmas==1){
            var day=arr[0].split('-')
            return day.splice(1,day.length).join('-')
        }
        if(parmas==2){
            var hour=arr[1].split(':')
            return hour.splice(1,hour.length).join(':')
        }
      },
      formatPoint(val){
			  if(!val) return '--'
			  return (val*1).toFixed(1)
		  }
    },
    methods: {
      //返回上一级
      toBack(){
        Indicator.close();
        this.$router.push('/storOrder')
      },
      //查询用户订单详情
      async orderDet(){
        this.storePics=[]
        const res = await queryRecycleOrderDetail(this.orderId);
        if (res.code == 100) {
          this.orderDetail = res.content
          this.isCash=res.content.isCash
          if(this.isCash==4) this.cashAmount=res.content.cashAmount
          var arrDocument=res.content.recycleDocumentVos;
          for(var i=0,length=arrDocument.length;i<length;i++){
            if(arrDocument[i].type==0){
                this.storePics.push(arrDocument[i].url)
            }
            if(arrDocument[i].type==2){  //检测报告
                this.checkImg=arrDocument[i].url
            }
          }
          switch(this.orderDetail.status){  //绘制状态
            case 0://待审核 
            this.states[0].imgUrl=examining;
            this.states[0].text='订单审核'
            this.states[0].state=0
            this.states[1].imgUrl=waitingDeli;
            this.states[1].text='物流运输';
            this.states[1].state=0
            this.states[2].imgUrl=waitingTest;
            this.states[2].text='存金检验';
            this.states[2].state=0
            this.states[3].imgUrl=noFinish;
            this.states[3].text='订单确认';
            this.clickIndex=0
            this.examine=true
            this.delivery=false
            this.testing=false
            this.conformOrder=false
            break;
            case 1://审核未通过
            this.states[0].imgUrl=testFail;
            this.states[0].text='订单审核'
            this.states[0].state=0
            this.states[1].imgUrl=waitingDeli;
            this.states[1].text='物流运输';
            this.states[1].state=0
            this.states[2].imgUrl=waitingTest;
            this.states[2].text='存金检验';
            this.states[2].state=0
            this.states[3].imgUrl=noFinish;
            this.states[3].text='订单确认';
            this.clickIndex=0
            this.examine=true
            this.delivery=false
            this.testing=false
            this.conformOrder=false
            break;
            case 2://待取货
            this.states[0].imgUrl=testSuccess;
            this.states[0].text='订单审核'
            this.states[0].state=1
            this.states[1].imgUrl=waitingDeli;
            this.states[1].text='物流运输';
            this.states[1].state=0
            this.states[2].imgUrl=waitingTest;
            this.states[2].text='存金检验';
            this.states[2].state=0
            this.states[3].imgUrl=noFinish;
            this.states[3].text='订单确认';
            this.clickIndex=0
            this.examine=true
            this.delivery=false
            this.testing=false
            this.conformOrder=false
            break;
            case 3://物流中
            this.states[0].imgUrl=testSuccess;
            this.states[0].text='订单审核'
            this.states[0].state=1
            this.states[1].imgUrl=deliverying;
            this.states[1].text='物流运输';
            this.states[1].state=1
            this.states[2].imgUrl=waitingTest;
            this.states[2].text='存金检验';
            this.states[2].state=0
            this.states[3].imgUrl=noFinish;
            this.states[3].text='订单确认';
            this.clickIndex=1
            this.examine=false
            this.delivery=true
            this.testing=false
            this.conformOrder=false
            break;
            case 4://检测中
            this.states[0].imgUrl=testSuccess;
            this.states[0].text='订单审核'
            this.states[0].state=1
            this.states[1].imgUrl=deliverying;
            this.states[1].text='物流运输';
            this.states[1].state=1
            this.states[2].imgUrl=testing;
            this.states[2].text='存金检验';
            this.states[2].state=0
            this.states[3].imgUrl=noFinish;
            this.states[3].text='订单完成';
            this.clickIndex=2
            this.examine=false
            this.delivery=false
            this.testing=true
            this.conformOrder=false
            break;
            case 5://检测不通过
            case 6://待用户确认
            case 8://已完成
            this.states[0].imgUrl=testSuccess;
            this.states[0].text='订单审核'
            this.states[0].state=1
            this.states[1].imgUrl=deliverying;
            this.states[1].text='物流运输';
            this.states[1].state=1
            this.states[2].imgUrl=testing;
            this.states[2].text='存金检验';
            this.states[2].state=1
            this.states[3].imgUrl=finished;
            this.states[3].text='订单确认'
            this.clickIndex=3
            this.examine=false
            this.delivery=false
            this.testing=false
            this.conformOrder=true
            break;
            case 9://已取消
            case 10://已退货
            case 12://退货物流异常
            this.states[0].imgUrl=testSuccess;
            this.states[0].text='订单审核'
            this.states[0].state=1
            this.states[1].imgUrl=deliverying;
            this.states[1].text='物流运输';
            this.states[1].state=1
            this.states[2].imgUrl=testing;
            this.states[2].text='存金检验';
            this.states[2].state=1
            this.states[3].imgUrl=cancelOrder;
            this.states[3].text='订单确认'
            this.clickIndex=3
            this.examine=false
            this.delivery=false
            this.testing=false
            this.conformOrder=true
            break;
            case 11://取货物流异常
            this.states[0].imgUrl=testSuccess;
            this.states[0].text='订单审核'
            this.states[0].state=1
            this.states[1].imgUrl=deliveryFail;
            this.states[1].text='物流运输';
            this.states[1].state=0
            this.states[2].imgUrl=waitingTest;
            this.states[2].text='存金检验';
            this.states[2].state=0
            this.states[3].imgUrl=noFinish;
            this.states[3].text='订单确认'
            this.clickIndex=1
            this.examine=false
            this.delivery=true
            this.testing=false
            this.conformOrder=false
            break;
          }
          this.stateShow=true;
        }
      },
      //编辑订单
      editOrder(){
        //跳到修改订单页面
        this.$router.push({
            path:'/modifiRecycleOrder',
            query:{
                id:this.orderDetail.id
            }
        })
      },
      //重新填写订单
      afreshOrder(){
        sessionStorage.setItem('toStor','storeOrder') //填写订单页点击返回时需要这个参数
        this.$router.push({
            path:'/stor',
            query:{
                from:'storOrderDet',
                id:this.orderDetail.id
            }
        })
      },
      //查看取货物流/退货物流
      async viewDelivery(val){
        Indicator.open({
          text: '请求中...',
          spinnerType: 'fading-circle'
        });
        //调用物流接口绘制物流窗口
        var result=await queryExpress(val)
        if(result.code==100){
            Indicator.close();
            this.logistics=result.content.result.list
            this.popupVisible=true
            this.logisticsShow=true
        }else{
           Indicator.close(); 
        }
      },
      //查看检测报告
      viewReport(){
        this.popupVisibleReport=true
      },
      //查看状态描述
      viewStateInfo(e){
        var id=e.currentTarget.id;
        switch(id){
            case 0: //点击订单审核
            case '0': //点击订单审核
            this.clickIndex=0;
            this.examine=true;
            this.delivery=false;
            this.testing=false;
            this.conformOrder=false;
            break;
            case 1: //点击物流
            case '1': //点击物流
            if(this.orderDetail.status==0 || this.orderDetail.status==1 || this.orderDetail.status==2) return;
            this.clickIndex=1;
            this.examine=false;
            this.delivery=true;
            this.testing=false;
            this.conformOrder=false;
            break;
            case 2: //存金检验
            case '2': //存金检验
            if(this.orderDetail.status==0 || this.orderDetail.status==1 || this.orderDetail.status==2 || this.orderDetail.status==3 || this.orderDetail.status==11) return;
            this.clickIndex=2;
            this.examine=false;
            this.delivery=false;
            this.testing=true;
            this.conformOrder=false;
            break;
            case 3: //订单确认
            case '3': //订单确认
            if(this.orderDetail.status==0 || this.orderDetail.status==1 || this.orderDetail.status==2 || this.orderDetail.status==3 || this.orderDetail.status==4 || this.orderDetail.status==11) return;
            this.clickIndex=3;
            this.examine=false;
            this.delivery=false;
            this.testing=false;
            this.conformOrder=true;
            break;
        }
      },
      tele(){  //拨打电话
        if(this.equipment=="IOS"){
            if(phone){
                phone("400-819-6199");
            }
        }else{
            if(window.getPhonePer){
                window.getPhonePer("400-819-6199");
            }
        }
      },
      close(){  //关闭物流展示框
            this.popupVisible=false
            this.logisticsShow=false
      },
      enlargeImg(v){  //点击图片放大
        this.popupVisibleImg=true;
        this.maxImg=v
      },
      //用户确认订单
      async confirmStor(val){
        if(this.orderDetail.status==8) return;
        if(!this.comfirmLimit) return;  //限制重复提交
        this.comfirmLimit=false;
        var res=await confirmationResult(this.orderDetail.id, 0)
        if(res.code==100){
            this.popupVisibleReport=false
            // Toast({
            //     message: '订单确认成功',
            //     position: 'bottom',
            //     duration: 3000
            // });
            this.orderDet()
            this.examine=false;
            this.delivery=false;
            this.testing=false;
            this.conformOrder=false;
            this.clickIndex=null;
            this.comfirmLimit=true;
        }else{
            this.comfirmLimit=true;
        }
      },
    },
    watch:{
        popupVisible(val){
            if(val){  //绘制物流信息连接线
              this.$nextTick(function(){
                var container=document.querySelector(".logistics_container")
                var height=container.scrollHeight;
                document.querySelector('.logistics_line').style.height=(height-0.9*getRem())+'px'
              })
            }
        }
    },
    components: {
      headTop
    }
  }
</script>
<style type="text/css" scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .storOrderDet {
    margin-top:.88rem;
  }
  .store_order_info{
    padding-top:.4rem;
    padding-left:.3rem;
    display: flex;
  }
  .store_order_info img{
    width:1.2rem;
    height:1.2rem;
  }
  .store_order_info .store_info_text{
    width:100%;
    padding-left:.3rem;
  }
  .store_info_text .store_info_p1{
    font-size:.24rem;
    color:#000000;
  }
  .store_info_text .store_info_p2{
    font-size:.24rem;
    color:#666666;
    margin-top:.08rem;
  }
  .store_info_text .store_info_p3{
    font-size:.24rem;
    color:#666666;
    margin-top:.08rem;
  }
  .state_text{
    text-align: center;
    margin-top:.82rem;
    overflow: hidden;
    display: -webkit-flex;
    display: -o-flex;
    display: -moz-flex;
    display: flex;
    -webkit-justify-content: center;
    -o-justify-content: center;
    -moz-justify-content: center;
    justify-content: center;
  }
  .state_text img{
    width:.8rem;
    height:.8rem;
  }
  .state_text p{
    font-size:.22rem;
    color:#666666;
  }
  .each_status{
    float:left;
    position: relative;
    width:.96rem;
  }
  .each_status:nth-child(2){
    margin-left:0.95rem;
    margin-right:0.95rem;
  }
  .each_status:nth-child(3){
    margin-right:0.95rem;
  }
  .tipWindow{
    width:92%;
    background-color: #F5F5F5;
    font-size:.22rem;
    color:#666666;
    padding-left:.2rem;
    position: relative;
    text-align: left;
    margin:0 auto;
    margin-top:.24rem;
    border-radius: 2px;
  }
  .tipWindow .tip_text{
    padding-top:.14rem;
    border-radius: 2px;
  }
  .tip_text #editOrder,.tip_text #afreshOrder,.tip_text .viewDelivery,.tip_text .viewReport,.tip_text .telephone,.tip_text .returnGoods{
    color:#EDA835;
    text-decoration: underline;
  }
  .tip_text p{
    padding-bottom:.08rem;
  }
  .tipWindow.one:before,.tipWindow.two:before,.tipWindow.three:before,.tipWindow.four:before{
    content:'';
    width:.2rem;
    height:.2rem;
    background-color:#F5F5F5;
    position: absolute;
    top:-.1rem;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    left:0.48rem;
  }
  .tipWindow.two:before{
    left:2.48rem;
  }
  .tipWindow.three:before{
    left:4.48rem;
  }
  .tipWindow.four:before{
    left:6.48rem;
  }
  .store_info{
    margin-top:.84rem;
    padding-left:.3rem;
  }
  .store_info h4{
    font-size:.3rem;
    color:#333333;
    padding-bottom:.4rem;
  }
  .store_info .valuation{
    font-size:.24rem;
    color:#666666;
    padding-bottom:.18rem;
    letter-spacing:1px;
  }
  .store_info .other_info{
    font-size:.24rem;
    color:#666666;
    letter-spacing:2px;
  }
  .picture_container{
    margin-top:.3rem;
    overflow: hidden;
  }
  .picture_container img{
    width:2.14rem;
    height:2.14rem;
    float:left;
    margin-right:.24rem;
    margin-bottom:.1rem;
  }
  .contact_service{
    width:2.2rem;
    height:.7rem;
    font-size:.28rem;
    color:#fff;
    text-align: center;
    line-height:.7rem;
    background-color: #F2B643;
    margin-top:.74rem;
    margin-bottom:.64rem;
    margin-left:5rem;
    border-radius: 2px;
  }
  .logistics_container{
    padding-top:.4rem;
    height:9.2rem;
    overflow-y: scroll;
    position: relative;
  }
  .logistics_container .logistics_title{
    font-size:.32rem;
    color:#000000;
    font-weight:700;
    text-align: center;
    padding-bottom:.5rem;
  }
  .logistics_container .each_logistics{
    display: flex;
    color:#EDA835;
    margin-bottom:.6rem;
    padding-left:.24rem;
  }
  #logistics,#popupVisibleImg{
    height:9.2rem;
    top:50%;
    margin-top:-4.6rem;
  }
  #popupVisibleImg img{
    width:100%;
    height:9.2rem;
  }
  #logistics .close_logistics{
    position: absolute;
    bottom:-.8rem;
    left:50%;
    margin-left:-.22rem;
  }
  #logistics .close_logistics img{
    width:.44rem;
    height:.44rem;
  }
  .each_logistics .logistics_time{
    width:.8rem;
    text-align: right;
  }
  .logistics_container .each_logistics.gray{
    color:#999999;
  }
  .each_logistics .logistics_info{
    font-size:.22rem;
    width:100%;
    padding-left:.54rem;
    padding-right:.46rem;
    padding-top:.1rem;
    position: relative;
  }
  .storOrderDet #head_top{
    border-bottom:none;
  }
  .logistics_line{
    background-color: #999999;
    border-radius: 10px;
    position: absolute;
    width:0.02rem;
    top:1.6rem;
    left:1.26rem;
    z-index: 1;
  }
  #popupVisibleReport{
    padding-top:.34rem;
  }
  #popupVisibleReport img{
    width:5.64rem;
    height:3.8rem;
  }
  .view_report .report_title{
    font-size:.32rem;
    color:#000000;
    text-align: center;
    font-weight:700;
    padding-bottom:.2rem;
  }
  .view_report p{
    font-size:.26rem;
    color:#666666;
    padding-bottom:.08rem;
    padding-left:.4rem;
  }
  .view_report img{
    margin-left:.4rem;
    display: block;
    margin-top:.32rem;
  }
  .view_report .report_btns{
    height:.9rem;
    line-height:.9rem;
    border-top:1px solid #EEEEEE;
    font-size:.32rem;
    margin-top:.4rem;
  }
  .view_report .report_btns p{
    display: inline-block;
    width:50%;
    float:left;
    text-align: center;
    color:#EDA835;
  }
  .view_report .report_btns .hasConfirm{
    color:#999999;
  }
  .view_report .report_btns .contact{
    width:100%;
  }
</style>
<style>
  .mint-popup{
    width:6.7rem;
    border-radius: 10px;
  }
  .mint-popup#popupVisibleReport{
    width:6.7rem;
    height:auto;
  }
  .mint-button:after{
    border-radius: 2px;
  }
</style>