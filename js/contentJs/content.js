// 复制文本到剪贴板
var copyText = (str)=>{
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', str);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        console.log('复制成功');
        $('#copySuccess .text').text(str)
        $('#copySuccess').toast('show')
    }
    document.body.removeChild(input);
}


// 匹配当前文本
var selectText = (e) => {
    e.preventDefault()
    e.stopPropagation()
    var $currentEle = $(e.currentTarget)
    var contents = $currentEle.contents()
    var text = ''
    if(contents.length > 1){
        // this.text() 无法处理<div>文本<div>子文本</div></div>
        text = contents.filter(function(){
            return this.nodeType == 3;
        })[0].nodeValue
    }else{
        text = $currentEle.text()
    }
    copyText(text)
}


var renderSelect = function (config) {
    var selectName = config.rule // 当前选择规则

    var $selectEle = $(selectName) // 当前选择元素

    $selectEle.css({
        backgroundColor: config.bgColor || '#ffc107',
        cursor: 'copy'
    })

    if($selectEle){
        $selectEle.bind('click', selectText)
    }else{
        $('body').delegate(selectName,'click',selectText)
    }
}

function injectCustomJs(jsPath) { // 注入函数
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.src = chrome.extension.getURL(jsPath);
    console.log(temp.src, '路径');
    // temp.onload = function () {
    //     // 放在页面不好看，执行完后移除掉
    //     this.parentNode.removeChild(this);
    // };
    document.head.appendChild(temp);
}

function injectCustomCSS(cssPath) { // 注入css
    var temp = document.createElement('link');
    temp.setAttribute('rel', 'stylesheet');
    temp.src = chrome.extension.getURL(cssPath);
    console.log(temp.src, '路径');
    document.head.appendChild(temp);
}

function importLib() { // 引入三方库
    // 避免与外部的jquery冲突
    if(typeof jQuery === 'undefined'){
        injectCustomJs('js/baseJs/jquery-3.6.0.js'); // jquery
        injectCustomCSS('css/bootstrap.min.css');
    }
    if(typeof bootstrap === 'undefined'){
        injectCustomJs('js/baseJs/bootstrap-5.1.3.bundle.min.js');
    }
}

// 引入html
function importHtml(){
    var toast = `<div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" id="copySuccess" data-bs-delay="3000">
    <div class="d-flex">
        <div class="toast-body">
            复制成功：
            <small class="text"></small>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
</div>`
    $(toast).css({
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 99999
    }).appendTo($('body'))
}


function getChromeSetting(){
    chrome.storage.sync.get('ruleConfig', function (data) {
        var ruleConfig = data.ruleConfig
        if(Array.isArray(ruleConfig)){
            // 根据当前网址，查找配置
            const host = location.host
            var currentSetting = ruleConfig.find(function (item) {
                return item.name.indexOf(host)!==-1
            })
            console.log('currentSetting',currentSetting);
            if(currentSetting){
                var rule = currentSetting.ruleList
                if(rule){
                    rule.forEach(function (r) {
                        renderSelect(r)
                    })
                }
            }else{

            }
        }
    })
}

window.onload = function () {
    importLib();
    importHtml();
    getChromeSetting()
} // 入口函数
