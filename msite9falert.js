/*!
    version: 1.0.0
    date: 2016-08-16
    author: hammer110
    github：https://github.com/liujinjian1016/
*/

;(function() {
    var win = $(window),
        doc = $(document),
        count = 1,
        isLock = false;

    var Dialog = function(options) {

        this.settings = $.extend({}, Dialog.defaults, options);

        this.init();

    }

    Dialog.prototype = {

        /**
         * 初始化
         */
        init () {

            this.create();



            if (!isNaN(this.settings.time)&&this.settings.time!=null) {
                this.time();
            }

            if (this.settings.lock) {
                this.lock();
            }

        },

        /**
         * 创建
         */
        create () {
			var themeclass = this.settings.theme
            var divHeader = (this.settings.title=='')?'':'<div class="m9fDialog-header">'+ this.settings.title +'</div>';
            var dialogclass ='m9fDialog-content m9fDialog-contentp';
            /*吐司弹框*/
            if(this.settings.type=='toast'){
            	dialogclass='m9fDialog-content';
            }
             var footer = '<div class="m9fDialog-footer clear"></div>'

            if(this.settings.type=='topclose'){
            	dialogclass='m9fDialog-content m9fDialog-contentp';
            	footer = "";
            }

            if(this.settings.type=='loading'){
            	dialogclass='m9fDialog-content m9fDialog-contentp';
            	footer = "";
            }

            // HTML模板
            var templates = $("<div>",{
            	class:'m9fDialog-wrap m9fDialog-wrap-theme-'+themeclass,

            	html:divHeader + '<div class="'+dialogclass+'">'+ this.settings.content +'</div>' +footer
            })
           /* '<div class="m9fDialog-wrap m9fDialog-wrap-theme-'+themeclass+'">' +
                                divHeader +
                                '<div class="'+dialogclass+'">'+ this.settings.content +'</div>' +
                                '<div class="m9fDialog-footer"></div>' +
                            '</div>';*/
            // 追回到body
            this.dialog = $('<div>').addClass('m9fDialog').css({ zIndex : this.settings.zIndex + (count++) }).html(templates).prependTo('body');

            if(this.settings.type=='topclose'){
                        this.topclose();
            }

            // 设置cancel按钮
            if (this.settings.cancelText) {
               this.cancel();
            }


            // 设置ok按钮
            if (this.settings.okText) {
                this.ok();
            }





            // 设置大小
            this.size();

            // 设置位置
            this.position();

        },

        /**
         * ok
         */
        ok () {
            var _this = this,
                footer = this.dialog.find('.m9fDialog-footer');
            var classes = "m9fDialog-ok";
                // 设置cancel按钮
            if (this.settings.cancelText) {
               classes = "butcl2";
            }

            $('<a>', {
                href : 'javascript:;',
                text : this.settings.okText
            }).on("click", function() {
            		if ($.isFunction(_this.settings.ok)) {
                		 _this.settings.ok();
            	     }
                    _this.close();
            }).addClass(classes).appendTo(footer);

        },

        /**
         * cancel
         */
        cancel () {

            var _this = this,
                footer = this.dialog.find('.m9fDialog-footer');
            var classes = "m9fDialog-cancel";
                // 设置cancel按钮
            if (this.settings.okText) {
               classes = "butcl2";
            }

            $('<a>', {
                href : 'javascript:;',
                text : this.settings.cancelText
            }).on("click",function() {
            		if ($.isFunction(_this.settings.cancel)) {
                		 _this.settings.cancel();
            	     }
                    _this.close();

            }).addClass(classes).prependTo(footer);


        },

        /**
         *设置顶部关闭按钮
         */
        topclose (){
        	var _this = this,
        		wrap = this.dialog.find('.m9fDialog-wrap');
        		wrap.css({position:"relative"});//<i class="bill-topclose"></i> <i class="warning-line"></i>
            $('<i>',{
            	class:"bill-topclose"
            }).on("click",function(){
            	_this.close();
            }).appendTo(wrap);
            $('<i>',{
            	class:"warning-line"
            }).appendTo(wrap);


        },

        /**
         * 设置大小
         */
        size () {

            var content = this.dialog.find('.m9fDialog-content'),
            	wrap = this.dialog.find('.m9fDialog-wrap');

            var width =  win.width() - 50;
           /* content.css({
                width : width,//this.settings.width,
                height : this.settings.height
            });*/
            wrap.css({width:width,height : this.settings.height})

        },

        /**
         * 设置位置
         */
        position () {
            var wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width : window.innerWidth : window.innerWidth
            var wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ? screen.height : window.innerHeight : window.innerHeight;
            var _this = this,
                winWidth = win.width(),
                winHeight = win.height(),
                scrollTop = 0;
            var dialogtop = (winHeight - _this.dialog.height()) / 2 ;
            this.dialog.css({
                left : (winWidth - _this.dialog.width()) / 2,
                top : dialogtop
            });

           	var left = parseInt(_this.dialog.css("left"));
           	if(left==0){
           		_this.dialog.css({"left":"7%","top":"35%"});
           	}

           	if(parseInt(_this.dialog.width())==0){
           		_this.dialog.css({"left":"7%","top":"35%"});

           	}


            if(this.settings.type=='topclose'){
             	if(dialogtop>52){
             		var wrap = this.dialog.find('.m9fDialog-wrap');
             		var topclose = wrap.find('.bill-topclose');
             		var line = wrap.find('.warning-line');
             		topclose.css({top:(-52)+"px"});
             		line.css({height:23+"px",top:(-23)+"px"});
             		$(".m9fDialog").css({top:"76px"})
             	}
             }else{
            	//this.dialog.append((winWidth - _this.dialog.width()) / 2+"   "+dialogtop));
             }

        },

        /**
         * 设置锁屏
         */
        lock () {
            if (isLock) return;

            this.lockdom = $('<div>').css({ zIndex : this.settings.zIndex }).addClass('m9fDialog-mask');
             //禁止移动背景模板
	         	this.lockdom.on("touchmove",function(e){
	                      e.preventDefault();
	                 });
            this.lockdom.appendTo('body');

            isLock = true;

        },

        /**
         * 关闭锁屏
         */
        unLock () {
           var _this = this;
           try{
    		if (this.settings.lock) {
    			if (isLock && _this.lockdom && !$(".m9fDialog")) {
	                _this.lockdom.remove();
	                isLock = false;
                }else if($(".m9fDialog-mask")){
                	if($(".m9fDialog").length==0){
    				$(".m9fDialog-mask").remove();
    				isLock = false;
    				}
    			}
            }
    		}catch(e){
    			alert(e.message);
    		}
        },

        /**
         * 关闭方法
         */
        close () {
        	try{
        		//alert("12321");
            this.dialog.remove();
            this.unLock();
           }catch(e){
           	alert(e.message);
           }
        },

        /**
         * 定时关闭
         */
        time () {

            var _this = this;

            this.closeTimer = setTimeout(function() {
                _this.close();

                  if($.isFunction(_this.settings.autofn)){
                  	_this.settings.autofn();
                  }

            }, this.settings.time);

        }

    }

    /**
     * 默认配置
     */
    Dialog.defaults = {
        theme:'black',
        // 内容
        content: '加载中...',

        // 标题
        title: '小玖提示',

        // 宽度
        width: 'auto',

        // 高度
        height: 'auto',

        // 取消按钮回调函数
        cancel: null,

        // 确定按钮回调函数
        ok: null,


        // 确定按钮文字
        okText: '',

        // 取消按钮文字
        cancelText: '',

        // 自动关闭时间(毫秒)
        time: null,

        // 是否锁屏
        lock: true,

        // z-index值
        zIndex: 9999,
        //提示类别
        type:null

    }

    var m9fDialog = function(options) {
        return new Dialog(options);
    }

    window.m9fDialog = $.m9fDialog = $.dialog = m9fDialog;

   //自定义dialog
   let dialog = {};
   dialog.install = function(Vue) {
       Object.defineProperties(Vue.prototype, {
         //吐司
         toast:{
           get (){
               try{
                  return function(message,callback){
                       $.dialog({
                           content : message,
                           title : '',
                           lock : false,
                          // 宽度
                           width: 'auto',
                           // 高度
                           height: 'auto',
                           // 自动关闭时间(毫秒)
                           time: 2000,
                           autofn:callback,
                           type:'toast'
                       });
                  }
               }catch(e){
               }
           }
         },
         customAlert:{
           get (){
              return function(message,title,btntext,callback,type,height,width){
              	    title  = title ||""
              	    height = height||"auto"
              	    width = width|| "auto"
              	    btntext = btntext||"我知道了"
              		  $.dialog({
              	      	theme:'white',
                          content : message,
                          title : title,
                          cancelText: btntext,
                          cancel : callback,
                          lock : true,
                          height:height,
                          width:width,
                          type:type
                      });
               }
           }
         },
         customConfirm:{
            get (){
               return function(message,title,okfun,canclefun,height,width){
               	    title  = title ||"小玖提示"
               	    height = height||"auto"
               	    width = width|| "auto"
               	   	$.dialog({
               	      	theme:'white',
                           content : message,
                           title : title,
                           cancelText: '不允许',
                           cancel : canclefun,
                           okText: '允许',
                           ok : okfun,
                           lock : true,
                           height:height,
                           width:width
                       });
               }
            }
         },
         dialogClose:{
            get (){
               return function(){
               	  window.dialog.close()
               }
            }
         },
         loadingAlert:{
            get (){
               return function(message,title,okfun,canclefun,height,width){
                     window.dialog = $.dialog({
                       theme:'white',
                       content : '<p class="loadingtop"><img src="//static.9f.cn/img/icon/h5/loading/pull.gif" ><br/>授权信息更新中...</p>',
                       title :'',
                       lock : true,
                       width: 'auto',
                       height: 'auto',
                       type:"loading"
                });
               }
            }
         }


       })

   };

   if (typeof exports == "object") {
       module.exports = dialog;
   } else if (typeof define == "function" && define.amd) {
       define([], function(){ return dialog })
   } else if (window.Vue) {
       window.dialog = dialog;
       Vue.use(dialog);
   }

})();
