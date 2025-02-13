// 打印类属性、方法定义
/* eslint-disable */
const Prints = function (dom, options) {
    if (!(this instanceof Prints)) return new Prints(dom, options);
  
    this.options = this.extend({
      'noPrint': '.no-print'
    }, options);
  
    if ((typeof dom) === "string") {
      this.dom = document.querySelector(dom);
    } else {
      this.isDOM(dom)
      this.dom = this.isDOM(dom) ? dom : dom.$el;
    }
  
    this.init();
  };
  Prints.prototype = {
    init: function () {
      var content = this.getStyle() + this.getHtml();
      this.writeIframe(content);
    },
    extend: function (obj, obj2) {
      for (var k in obj2) {
        obj[k] = obj2[k];
      }
      return obj;
    },
  
    getStyle: function () {
      var str = "",
        styles = document.querySelectorAll('style,link');
      for (var i = 0; i < styles.length; i++) {
        str += styles[i].outerHTML;
      }
        str +=
        "<style>" +
        (this.options.noPrint ? this.options.noPrint : ".no-print") +
        "{display:none;}</style>";
        
        str += `<style>
        @media print { 
          @page { size: auto; margin: ${this.options.margin || '0'}; padding: ${this.options.padding || '0'}; width:${this.options.width };height:${this.options.height}}
          body {  
            -webkit-print-color-adjust:exact;-moz-print-color-adjust:exact;-ms-print-color-adjust:exact;print-color-adjust:exact; 
          } 
          html,body{
            height:auto;
            margin: 0;
            padding: 0;
          }
        }
        #printSection{padding: 136px 0 0 !important;}.example{padding:8px 68px 0 54px !important;}  .sidePage1{padding:124px 48px 0 38px !important;}  .sidePage2{padding:66px 48px 0 40px !important;}
        </style>`;
      return str;
    },
  
    getHtml: function () {
      var inputs = document.querySelectorAll('input');
      var textareas = document.querySelectorAll('textarea');
      var selects = document.querySelectorAll('select');
  
      for (var k = 0; k < inputs.length; k++) {
        if (inputs[k].type == "checkbox" || inputs[k].type == "radio") {
          if (inputs[k].checked == true) {
            inputs[k].setAttribute('checked', "checked")
          } else {
            inputs[k].removeAttribute('checked')
          }
        } else if (inputs[k].type == "text") {
          inputs[k].setAttribute('value', inputs[k].value)
        } else {
          inputs[k].setAttribute('value', inputs[k].value)
        }
      }
  
      for (var k2 = 0; k2 < textareas.length; k2++) {
        if (textareas[k2].type == 'textarea') {
          textareas[k2].innerHTML = textareas[k2].value
        }
      }
  
      for (var k3 = 0; k3 < selects.length; k3++) {
        if (selects[k3].type == 'select-one') {
          var child = selects[k3].children;
          for (var i in child) {
            if (child[i].tagName == 'OPTION') {
              if (child[i].selected == true) {
                child[i].setAttribute('selected', "selected")
              } else {
                child[i].removeAttribute('selected')
              }
            }
          }
        }
      }
        return this.dom.outerHTML;
    },
    // 向父级元素循环，包裹当前需要打印的元素
    // 防止根级别开头的 css 选择器不生效
    wrapperRefDom: function (refDom) {
      let prevDom = null
      let currDom = refDom
      while (currDom && currDom.tagName.toLowerCase() !== 'body') {
        if (prevDom) {
          let element = currDom.cloneNode(false)
            console.log(element,currDom,prevDom)
          element.appendChild(prevDom)
          prevDom = element
        } else {
          prevDom = currDom.cloneNode(true)
        }
  
        currDom = currDom.parentElement
      }
  
      return currDom.tagName.toLowerCase() === 'body' ? currDom : prevDom
    },
  
    writeIframe: function (content) {
      var w, doc, iframe = document.createElement('iframe'),
        f = document.body.appendChild(iframe);
      iframe.id = "myIframe";
      iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;');
      w = f.contentWindow || f.contentDocument;
      doc = f.contentDocument || f.contentWindow.document;
      doc.open();
      doc.write(content);
      doc.close();
      var _this = this
      iframe.onload = function(){
        _this.toPrint(w);
        setTimeout(function () {
          document.body.removeChild(iframe)
        }, 100)
      }
    },
  
    toPrint: function (frameWindow) {
      try {
        setTimeout(function () {
          frameWindow.focus();
          try {
            if (!frameWindow.document.execCommand('print', false, null)) {
              frameWindow.print();
            }
          } catch (e) {
            frameWindow.print();
          }
          frameWindow.close();
        }, 10);
      } catch (err) {
        console.log('err', err);
      }
    },
    isDOM: (typeof HTMLElement === 'object') ?
      function (obj) {
        return obj instanceof HTMLElement;
      } :
      function (obj) {
        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
      }
  };
  const MyPlugin = {}
  MyPlugin.install = function (Vue, options) {
    // 4. 添加实例方法
    Vue.prototype.$print = Prints
  }
  export default MyPlugin
  