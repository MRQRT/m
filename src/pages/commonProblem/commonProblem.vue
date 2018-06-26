<template>
	<div class="commonProblem">
		<head-top headTitle='常见问题' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
		</head-top>
		<!--主要内容区域-->
    <section class="commonProblem-core">
        <div class="perCommon">
          <p class="commonTitle">
             <span class="title"  @click="switchShowHide($event)">重要通知</span>
             <span class="expandIcon"  @click="switchShowHide($event)"><img :src="src"></span>
          </p>
          <div class="expand-content" v-show="isShow">
              <p class="content-first">关于交易时间调整和点差调整的通知
              </p>
              <p class="content-first">尊敬的用户：
              </p>
              <p class="content-first">您好！近期由于受到人民币汇率及黄金价格双重剧烈波动的影响，黄金管家将对交易时间和点差进行调整，具体内容如下：
              </p>
              <div class="main-content">
                <p class="subTitle">一、交易时间调整内容：</p>
                <p class="detailDesc">周一至周五9:00至24:00为交易时段，周六0:00至周一9:00及国家法定节假日为非交易时段。</p>
                <p class="detailDesc">交易时段用内户可以随时买卖黄金。</p>
                <p class="subTitle">二、非交易时间段内的具体调整内容如下：</p>
                <p class="detailDesc">1、活期黄金买入和卖出交易停盘；</p>
                <p class="detailDesc">2、 现金资产买入定期黄金交易停盘，活期金转定期金正常交易；</p>
                <p class="detailDesc">3、实物提金业务交易停盘，实物存金业务可正常操作；</p>
                <p class="detailDesc">4、充值和提现可正常操作。</p>
                <p>三、点差调整如下:</p>
                <p class="detailDesc">点差调整为交易时段内0.5元/克。</p>
                <p class="detailDesc" style="margin-top:.5rem;">以上调整于2017年1月14日0：00点开始实行，请大家提前做好资产配置，避免调整给您造成的影响，感谢您对黄金管家的支持，我们将竭诚为您服务！</p>
              </div>
          </div>
        </div>
        <div class="perCommon">
          <p class="commonTitle">
             <span class="title"    @click="switchShowHide($event)">黄金买卖</span>
             <span class="expandIcon"    @click="switchShowHide($event)"><img :src="src"></span>
          </p>
          <div class="expand-content" v-show="isShow">
              <div class="main-content">
                <p class="subTitle">A、活期黄金买入:</p>
                <p>1、进入：由首页“买金”可进入“活期黄金”或“定期黄金”并点击“买入”；</p>
                <p>2、可以买入、挂单买入和定投买入，“按金额购买”或“按克数购买”；然后输入“金额”或“克数”后确认点击下一步；</p>
                <p>3、支付：检查订单详情，确认无误点击支付。</p>
                <p class="subTitle">B、活期黄金挂单买入/卖出:</p>
                <p>1、预先设置【理想的挂单价格】和【买入/卖出克数】，并设定有效期。由于金价实时波动，还需设置【最高买入/卖出价】，在可接受范围内成交。</p>
                <p>2、操作步骤： 挂单买入/卖出：</p>
                <p>(1)微信端口：首页-“买黄金”-点选顶部“挂单买入”-设置参数-确认；</p>
                <p>(2)手机APP端口：买金-“活期金”-产品详情页-点击“买入”-点选顶部“挂单买入”-设置参数-确认；</p>
                <p>(3)挂单卖出：“我的”-“卖金”-点选顶部“挂单卖出”-设置参数-确认。</p>
                <p>3、查看记录：用户在“我的”-“消息”中查看执行记录。在“我的”-“订单”-“挂单申请”中查看挂单买卖成交结果。</p>
                <p>4、挂单买卖仅支持活期黄金产品，设置克重最小1克，最大1000克，有效期最多一年。</p>
                <p>5、设置后无需实时盯盘，当市场价格第一次达到用户的设定价格时，系统将自动达成交易。</p>
                <p>6、挂单申请仅执行一次，无论成功或失败，一旦触发不再继续生效。请保证现金余额账户资金充足。</p>
                <p class="subTitle">C、活期黄金定投买入:</p>
                <p>1、为了满足用户按一定周期频率购买活期黄金的需求，黄金管家系统会按照您设定的频率自动为您买入。定投的优势是可以分散投资风险。</p>
                <p>2、操作步骤:</p>
                <p>(1)首页-“买黄金”-点选顶部“定投”-设置参数-确认；</p>
                <p>(2)买金-“活期金”-产品详情页-点击“买入”-点选顶部“定投”-设置参数-确认；</p>
                <p>3、查看记录： 用户在“我的”-“消息”中查看执行记录；在“我的”-“订单”-“定投计划”中查看定投计划成交结果。</p>
                <p>4、定投金额最低100元起，频率按周（周一至周五）、按月（1至25日）设置，有效期最长一年。</p>
                <p>5、设置成功后，系统会在每次定投执行的前一日为用户发送短信提醒，以确保用户现金账户余额充足。在定投执行日上午10:00，系统自动为用户按实时金价执行买入。如当次定投买入失败不影响下次定投的执行。</p>
                <p>D、定期黄金买入</p>
                <p>1、定期黄金可以直接在使用现金购买也可以使用活期金转入，起购1克；</p>
                <p>2、定期黄金到期后，本金和利息一同发放到您的活期金账户。</p>
                <p>E、卖出黄金</p>
                <p>1、进入：进入“我的”界面，点击“黄金账户”，再点击卖出即可 ；</p>
                <p>2、输入：要卖出的克重，点击确认，即刻完成卖出，资金回到您的“现金余额”；</p>
                <p>3、只有活期黄金才能卖出，定期黄金不能提前赎回，到期后直接转为活期金。</p>
                <p>F、手续费及交易时间</p>
                <p>1、周一至周五9:00至24:00为交易时段，周六0:00至周一9:00及国家法定节假日为非交易时段，交易时间段内可以随时买卖。</p>
                <p>2、卖出部分当天不产生收益；</p>
                <p>3、买入黄金无手续费，卖出时会在实时价格上减去点差，交易时间内点差为0.5元/克。</p>
              </div>
          </div>
        </div>
        <div class="perCommon">
          <p class="commonTitle">
             <span class="title"  @click="switchShowHide($event)">收益计算</span>
             <span class="expandIcon"  @click="switchShowHide($event)"><img :src="src"></span>
          </p>
          <div class="expand-content" v-show="isShow">
              <div class="main-content">
                <p>A 、计息方式</p>
                <p>1、活期黄金和定期黄金的利息均以黄金克重的形式发放。</p>
                <p>B 、利息计算</p>
                <p>1、活期每天金息 = 克重 X 年化生金率 ÷ 365；</p>
                <p>2、定期金息 = 克重X年化生金率X期限÷365天。</p>
                <p>C、起息时间</p>
                <p>活期黄金&定期黄金：T-1日15:30时至T日15:30时买入的黄金，T+1个工作日开始计息，T日15：30以后买入的黄金T+2个工作日开始计息；</p>
                <p>D、利率变化</p>
                <p>1、活期黄金年化收益率每日公布，请注意查询；</p>
                <p>2、定期黄金的年化收益率调整不影响已经购买的定期产品收益。</p>
                <p>E、利息查询</p>
                <p>1、活期黄金和定期黄金的收益可在“我的”-“黄金账户”-“累计收益”中查询到，双休日和国定节假日不例外；</p>
                <p>2、定期金的收益在到期之后和本金一同发放到活期金账户中。</p>
                <p>F、金息发放时间</p>
                <p>1、活期黄金：</p>
                <p>转入时间 黄金数量确认时间 计息时间 金息发放时间</p>
                <p>周一15:30至周二15:30 周三  周三  周四</p>
                <p>周二15:30至周三15:30 周四  周四  周五</p>
                <p>周三15:30至周四15:30 周五  周五  周六</p>
                <p>周四15:30至周五15:30 下周一 下周一 下周二</p>
                <p>周五15:30至周一15:30 下周二 下周二 下周三</p>
                <p>2、定期黄金：到期日后下一个自然日定期黄金收益发放到“黄金账户”中。</p>
              </div>
          </div>
        </div>
        <div class="perCommon">
          <p class="commonTitle">
             <span class="title"  @click="switchShowHide($event)">手机注册</span>
             <span class="expandIcon"  @click="switchShowHide($event)"><img :src="src"></span>
          </p>
          <div class="expand-content" v-show="isShow">
              <div class="main-content">
              <p>A、注册账号</p>
              <p>1、目前仅支持手机号注册，用户完成注册之后，登录时的用户名为手机号；</p>
              <p>2、注册时的手机号即为注册ID，如遇原手机号停用，目前无法注销，需本人清空账户资产另行注册新账号；</p>
              <p>3、只有在修改和找回密码的时候需要使用注册手机接收验证短信，如您能牢记登录名和密码，则不影响您的使用。</p>
              <p>B、注册时获取短信验证码失败原因</p>
              <p>1、手机号输入错误；</p>
              <p>2、当前信号不好；</p>
              <p>3、欠费停机；</p>
              <p>4、短信被手机安全软件拦截；</p>
              <p>5、操作频繁（十分钟内获取验证码操作超过3次，过10分钟后再试）。</p>
              <p>更多问题请拨打黄金管家客服电话400-650-6932（工作日9:00—18:00， 非工作时间如您有问题咨询，请发送邮件至service@32gold.com,客服上班后会优先处理您的问题）</p>
              </div>
          </div>
        </div>
        <div class="perCommon">
          <p class="commonTitle">
             <span class="title"  @click="switchShowHide($event)">实名认证</span>
             <span class="expandIcon"  @click="switchShowHide($event)"><img :src="src"></span>
          </p>
          <div class="expand-content" v-show="isShow">
              <div class="main-content">
                <p>为保障用户资金安全与合同的有效性，您在绑定银行卡时会同步进行实名认证，需通过实名认证才可以投资，目前仅支持18位大陆身份证认证，暂不支持护照号、军官证号、港澳居民来往内地通行证、台湾居民来往大陆通行证，后续会逐步完善；目前对于身份信息的要求是在公安系统登记且可查询到的。</p>
              </div>
          </div>
        </div>
        <div class="perCommon">
          <p class="commonTitle"  >
             <span class="title"  @click="switchShowHide($event)">银行卡绑定</span>
             <span class="expandIcon"  @click="switchShowHide($event)"><img :src="src"></span>
          </p>
          <div class="expand-content" v-show="isShow">
              <div class="main-content">
              <p>A、说明</p>
              <p>1、银行卡必须是用户本人名下的借记卡，借记卡需为活期账户；</p>
              <p>2、绑定银行卡时会同步进行实名认证；</p>
              <p>3、暂不支持信用卡、虚拟卡绑定。</p>
              <p>B、银行卡绑定失败原因</p>
              <p>1、银行卡号输入有误，请重新核对卡号输入；</p>
              <p>2、银行超时或银行系统异常，建议关闭网页后过20分钟重新操作；</p>
              <p>3、输入姓名有误，可能绑定的不是实名一致的银行卡，建议换与实名一致的银行卡尝试；</p>
              <p>4、银行预留手机号有误，可能的原因有：</p>
              <p>（1）银行柜台提供的预留手机号和绑卡时输入的手机号不一致会导致鉴权失败；</p>
              <p>（2）银行预留的手机号只保存在用户的个人基本信息记录里面，还需要用户到柜台申请该手机号作为银行预留手机号用作快捷支付才能使用。注意：能接收验证码的手机号不一定是柜台预留手机号），建议用户持身份证和银行卡去银行办理修改或者更换其他的银行卡绑定。</p>
              <p>更多问题请拨打黄金管家客服电话400-650-6932（工作日9:00—18:00 ，非工作时间如您有问题咨询，请发送邮件至service@32gold.com,客服上班后会优先处理您的问题）</p>
              <p>C、银行卡提现同卡进出规则</p>
              <p>1、为了保障用户资金安全，黄金管家实行同卡进出原则，同卡进出是指使用快捷支付的用户，充值的本金提现时将返回到原卡；</p>
              <p>2、解绑银行卡，必须将账户里的黄金资产卖出，现金资产全部提现到银行卡之后自行解绑，如遇银行卡丢失、销毁等不能自行解绑的情况，请拨打黄金管家客服电话400-650-6932（工作日9:00—18:00， 非工作时间如您有问题咨询，请发送邮件至service@32gold.com,客服上班后会优先处理您的问题），通过之后方可解绑。</p>
              </div>
          </div>
        </div>
        <div class="perCommon">
          <p class="commonTitle" >
             <span class="title"  @click="switchShowHide($event)">实物提金</span>
             <span class="expandIcon"  @click="switchShowHide($event)"><img :src="src"></span>
          </p>
          <div class="expand-content" v-show="isShow">
              <div class="main-content">
               <p>1、官网点击“黄金”，进入界面点击便携提金，选择您需要的产品； APP点击“我的—提金”进入界面选择您要提取的产品</p>
               <p>2、订单：按提示输入数量、地址、收货人、联系方式，形成订单；</p>
               <p>3、支付：黄金数量将从您的“活期黄金”余额中扣除；不同品牌和工艺产品会收取不同工费和运保费，用“现金余额”支付；</p>
               <p>4、发货：收到您的提金订单后的3到5个工作日发货；</p>
               <p>5、 收货：产品将通过顺丰速递或EMS发出，并提供全额承保；收货时请务必当面验货，并确保内外包装完好后再签收确认收货；</p>
               <p>6、质保：所有产品均为国内知名品牌并直接提供售后服务及质量保证；黄金管家平台同时提供终身质量保证。</p>
              </div>
          </div>
        </div>
        <div class="perCommon">
          <p class="commonTitle"  >
             <span class="title"  @click="switchShowHide($event)">实物存金</span>
             <span class="expandIcon"  @click="switchShowHide($event)"><img :src="src"></span>
          </p>
          <div class="expand-content" v-show="isShow">
              <div class="main-content">
                <p>A、 存金流程</p>
                <p>1、在线预约：按提示完整填写您的信息和产品信息,重量大于10克的产品可以预约存金；</p>
                <p>2、上门取货：金管家将安排顺丰速递上门取货，客户无需支付快递费用；</p>
                <p>3、产品检测：金管家收到您的黄金后，3至5个工作日内会在全程监控的环境下检测黄金（如黄金检测过程中发现非黄金产品或不符合存金标准的黄金产品，我们会将检测结果与实物寄回给客户）；</p>
                <p>4、审核通过：检测无误后，3至5个工作日内您的黄金将会充入到您的“活期黄金”中。</p>
                <p>B 、请您知悉</p>
                <p>1、根据中国法律黄金存金及回购需要实名认证，请务必填写完整个人信息；</p>
                <p>2、您存入的黄金需要进行破坏性检测，原实物状态无法恢复。您存入的黄金检测无误后，五个工作日后存金订单审核通过，并即刻显示在您的“活期黄金”，按照活期金计息规则开始计息；</p>
                <p>3、目前实物存金业务仅在顺丰速递覆盖的地区开通；</p>
                <p>4、检测后的实际黄金重量以金含量99.99%(俗称Au9999)金条重量为准。</p>
                <p>5、实物存金不收取手续费；但可能产生部分损耗，损耗比例以实际发生为准；</p>
                <p>6、损耗范围参照： 银行品牌投资金条（含金量>99.99%）损耗为2% ；商业品牌投资金条（含金量>99.9%）损耗为3% ；其他黄金饰品（含金量>99.99%）损耗为4%。</p>
              </div>
          </div>
        </div>
        <div class="perCommon">
          <p class="commonTitle" >
             <span class="title"  @click="switchShowHide($event)">充值与提现</span>
             <span class="expandIcon"  @click="switchShowHide($event)"><img :src="src"></span>
          </p>
          <div class="expand-content" v-show="isShow">
              <div class="main-content">
                <p>A 、充值</p>
                <p>1、在订单支付或现金充值时，您需要进行支付操作；</p>
                <p>2、支付由宝付第三方支付平台完成；</p>
                <p>3、下单成功后自动跳转至支付页面，按提示进行付款即可；完成后订单将保存在您的交易记录中；</p>
                <p>4、支付限额受您的开户银行及第三方支付平台限制，请您提前查询以免影响您的正常交易。
                银行名称  单笔支付额度 单日额度上线</p>
                <p>工商银行  5W 5W </p>
                <p>农业银行  2,000 1W </p>　
                <p>中国银行  5W 50W 　</p>
                <p>建设银行  5W 5W 　</p>
                <p>邮政储蓄  5,000 5,000 </p>
                <p>中信银行  5W 5W 　</p>
                <p>光大银行  5W 无 　</p>
                <p>平安银行  5W 500W 　</p>
                <p>交通银行  5W 50W 　</p>
                <p>兴业银行  5W 5W 　</p>
                <p>浦发银行  5W 5W  </p>
                <p>上海银行  5,000 5W  </p>
                <p>民生银行  50W 无限额  </p>
                <p>备注：中国邮政储蓄银行、浦发银行和上海银行需要开通银联在线支付业务。</p>
                <p>B 、提现 </p>
                <p>1、您的“现金余额”可以提现至您指定银行卡中； </p>
                <p>2、由“我的资产”点击“提现”后，请按提示添加您的银行卡；</p>
                <p>3、选择银行卡后输入提现金额及支付密码，确认后即可完成提现；</p>
                <p>4、资金会在T+1个工作日内到账；另受所属银行、第三方支付及节假日等因素影响，资金到账时间如有延迟，请注意查询相关机构公告；</p>
                <p>5、每日提现的上限为5万；每日可免费提现一次，第二次提现将收取每笔5元的手续费。</p>
              </div>
          </div>
        </div>
        <div class="perCommon">
          <p class="commonTitle" >
             <span class="title"   @click="switchShowHide($event)">安全保障</span>
             <span class="expandIcon"   @click="switchShowHide($event)"><img :src="src"></span>
          </p>
          <div class="expand-content" v-show="isShow">
              <div class="main-content">
                <p>A、 存金安全</p>
                <p>所有实物黄金均存储在中国民生银行保险箱中由银行提供安全保管服务。</p>
                <p>B 、支付安全</p>
                <p>银联、京东支付保障支付安全提供全程支付解决方案。</p>
                <p>C、安全防护</p>
                <p>黄金管家与阿里云构建多重防火墙保护系统，客户信息严格加密处理严防网络入侵最大限度保护用户隐私信息。</p>
                <p>D、同卡进出</p>
                <p>使用同一张银行卡支付和提现保证您的资产安全，即使手机丢失帐号被盗资产也只能回到您的银行卡。</p>
                <p>E、保险保障</p>
                <p>黄金管家与华海保险合作为每克实物黄金购买了财产一切险及物流运输险，一旦发生黄金实物丢失情况保险公司将进行赔偿。</p>
                <p>F、法律支持</p>
                <p>黄金管家与国内顶级律师所汉昆律师事务所合作保证平台业务的合法合规性。</p>
              </div>
          </div>
        </div>
        <div class="perCommon">
            <p class="commonTitle" >
               <span class="title"   @click="switchShowHide($event)">关于我们</span>
               <span class="expandIcon"   @click="switchShowHide($event)"><img :src="src"></span>
            </p>
            <div class="expand-content" v-show="isShow">
               <div class="main-content">
                  <p>“黄金管家”——央企安全级的互联网黄金理财平台，是由中信集团战略投资的互联网黄金投资理财服务平台；中国黄金协会理事单位。 2015年6月18日成立北京盈吉通电子商务有限公司成立；9月17日APP端正式上线，并于当日生成第一笔业务订单；10月1日客户注册用户破万；10月10日第一笔实物金回购业务生成；10月11日交易额突破1亿元；12月1日注册用户突破10万；进入2016年以来，公司不断发展；2月22日中信信托战略合作入股签约成功；5月5日黄金资产管理破10吨；7月15日京东金融合作京东淘金产品上线；8月30日京东金融移动端产品上线；9月1日黄金管家到店O2O支付第一笔业务支付成功；截止到9月中旬，累计注册用户突破25万人，累计为客户管理黄金超过17吨。</p>
                  <p>战略合作伙伴： 京东金融京东淘金产品， 腾讯理财通战略合作， 阿里旗下存金宝唯一实物黄金供应商 ；</p>
                  <p>合作伙伴： 中金集团、银河期货、中国黄金、山东黄金、豫园商城、中国金币总公司、淘当铺；</p>
                  <p>合作机构： 黄金管家通过民生银行在国家级交易机构上海黄金交易所设立黄金交易账户，为用户进行实物黄金买卖操作确保您购入的黄金都是符合国家规范的实物黄金。 上海黄金交易所 、上海期货交易所 天津贵金属交易所。</p>
                </div>
            </div>
        </div>
        <div class="perCommon">
            <p class="commonTitle">
              <span class="title"   @click="switchShowHide($event)">联系我们</span>
              <span class="expandIcon"   @click="switchShowHide($event)"><img :src="src"></span>
            </p>
            <div class="expand-content" v-show="isShow">
              <div class="main-content">
                 <p>1、客服电话：4008-196-199 客服时间：工作日9:00—18:00， 非工作时间如您有问题咨询，请发送邮件至service@32gold.com,客服上班后会优先处理您的问题；</p>
                 <p>2、客服QQ群：黄金管家分析群2018：556533099，黄金管家官方群2018：673646474；</p>
                 <p>3、微信公众号：黄金管家：hjgjdyh ，黄金管家BOSS：Master-Gold；</p>
                 <p>4、建议：首页右下角“我的”点击进入后，再点击“系统”进入，在反馈建议中可以给我们提建议。</p>
              </div>
            </div>
        </div>
    </section>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
  import up from '@/images/up.png'
  import down from '@/images/down.png'
	export default {
		data(){
			return {
				src:down,
        isShow:false
			}
		},
		mounted() {
		},
		computed:{
			
		},
		methods:{
      goBack(){
        window.toApp();
        this.$router.push('/mine');
      },
      switchShowHide($event){
        if($event.target.classList.contains('title')){
           $event.target.nextElementSibling.childNodes[0].src=$event.target.nextElementSibling.childNodes[0].src==up?down:up;
           if($event.target.nextElementSibling.childNodes[0].src==up){
              $event.target.parentNode.nextElementSibling.style.display="block";
           }else{
              $event.target.parentNode.nextElementSibling.style.display="none";
           }
       }else if($event.target.classList.contains('expandIcon')){
           $event.target.childNodes[0].src=$event.target.childNodes[0].src==up?down:up;
           if($event.target.childNodes[0].src==up){
              $event.target.parentNode.nextElementSibling.style.display="block";
           }else{
              $event.target.parentNode.nextElementSibling.style.display="none";
           }
      }else{
           $event.target.src=$event.target.src==up?down:up;
           if($event.target.src==up){
              $event.target.parentNode.parentNode.nextElementSibling.style.display="block";
           }else{
              $event.target.parentNode.parentNode.nextElementSibling.style.display="none";
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
   .commonProblem{
   	  background-color: #F5F5F5;
   	  overflow-y: scroll;
      padding-top:.88rem;
   }
   .commonProblem .commonProblem-core{
      margin-bottom:2.14rem;
   	  background-color: #fff;
   	  padding:0 .3rem;
   }
   .commonProblem-core .perCommon .commonTitle{
      height:1.12rem;
      line-height:1.12rem;
      font-size:.3rem;
      color:#333333;
      border-bottom:1px solid #EEEEEE;
      display: flex;
      display: -webkit-flex;
      display: -moz-flex;
      display: -o-flex;
   }
   .perCommon .commonTitle .title{
      flex:5;
      -webkit-flex:5;
      -moz-flex:5;
      -o-flex:5;
      padding-left:.2rem;
   }
   .perCommon .commonTitle .expandIcon{
      flex:1;
      -webkit-flex:1;
      -moz-flex:1;
      -o-flex:1;
      text-align: right;
   }
   .commonProblem-core .expandIcon img{
      width:.24rem;
      height:.13rem;
   }
   .commonProblem-core .perCommon .expand-content{
      padding:.4rem .36rem .4rem .2rem;
      font-size:.28rem;
      color:#999999;
      border-bottom:1px solid #EEEEEE;
   } 
   .perCommon .expand-content .content-first{
      /*text-indent: .48rem;*/
      /*margin-bottom:.5rem;*/
   }
   .perCommon .main-content .detailDesc{
      /*text-indent: .48rem;*/
   }
</style>