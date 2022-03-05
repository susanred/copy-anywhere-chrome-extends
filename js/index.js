
// 保存模版
var saveUpdateTpl = function(name, ruleList){
    chrome.storage.sync.get('ruleConfig', function (data) {
        var ruleConfig = Array.isArray(data.ruleConfig) ? data.ruleConfig : []
        var current = 0
        var index = ruleConfig.findIndex(function (item) {
            return item.name == name
        })
        if(index === -1){
            ruleConfig.push({
                name: name,
                ruleList: ruleList
            })
            current = name
        }else{
            var obj = ruleConfig[index]
            ruleConfig[index] = {
                name: name || obj.name,
                ruleList: ruleList
            }
            current = obj.name
        }
        chrome.storage.sync.set({ruleConfig: ruleConfig}, function () {
            renderTplSelect(ruleConfig)
        });
        $('#CA-currentTpl').val(current)
    });
}
// 获取规则数据
var getRuleTableValue = function(){
    var config = []
    var obj = {}
    $('input[name="selector"]').each(function (i, ele) {
        obj = {}
        if($(ele).val()){
            obj.rule = $(ele).val()
            obj.bgColor = $($('input[name="bgColor"]')[i]).val()
            config.push(obj)
        }
    })
    return config
}


$('document').ready(function () {
    // 点击添加
    $('#CA-add').click(function () {
        console.log('添加')
        var newLine = `<tr>
            <td><input type="text" class="form-control form-control-sm" name="selector"/></td>
            <td><input type="text" class="form-control form-control-sm" name="bgColor"></td>
            <td><button type="button" class="btn btn-link btn-sm" name="deleteBtn">删除</button></td>
        </tr>`
        $('#CA-rule').append(newLine)
    })

    // 点击更新
    $('#CA-updateTpl').click(function () {
        saveUpdateTpl($('input[name="tplName"]').val(), getRuleTableValue())
    })

    // 点击保存
    $('#CA-saveTpl').click(function () {
        saveUpdateTpl($('input[name="tplName"]').val(), getRuleTableValue())
    })

    //  改变模版
    $('#CA-currentTpl').change(function (e) {
        const value = e.target.value
        chrome.storage.sync.get('ruleConfig', function (data) {
            var currentSetting = data.ruleConfig.find(function (item) {
                return item.name == value
            })
            $('input[name="tplName"]').val(currentSetting.name)
            renderRuleTable(currentSetting.ruleList)
        });
    })


    // 点击删除
    $('button[name="deleteBtn"]').click(function () {
        $(this).parents('tr').remove()
    })
})

const renderTplSelect = (list)=>{
    var str = ''
    list.forEach(item=>{
        str+=`<option value="${item.name}">${item.name || '（未设置网址）'}</option>`
    })
    $('#CA-currentTpl').html(str)
}

const renderRuleTable = (list)=>{
    var str = ''
    list.forEach((item, i)=>{
        if(i===0){
            str+=`<tr>
                <td><input type="text" class="form-control form-control-sm" name="selector" value="${item.rule}"/></td>
                <td><input type="text" class="form-control form-control-sm" name="bgColor" value="${item.bgColor}"></td>
                <td></td>
            </tr>`
        }else{
            str+=`<tr>
                <td><input type="text" class="form-control form-control-sm" name="selector" value="${item.rule}"/></td>
                <td><input type="text" class="form-control form-control-sm" name="bgColor" value="${item.bgColor}"></td>
                <td><button type="button" class="btn btn-link btn-sm" name="deleteBtn">删除</button></td>
            </tr>`
        }

    })
    $('#CA-rule').html(str)
}


// 初始化配置
chrome.storage.sync.get('ruleConfig', function (data) {
    const ruleConfig = data.ruleConfig
    console.log(location)
    if(Array.isArray(ruleConfig) && ruleConfig.length > 0){
        renderTplSelect(ruleConfig)
        // 获取当前tab,废弃了。需要看最新文档
        // chrome.tabs.getSelected(null, function (tabData) {
        //     chrome.tabs.get(tabData.id, function (tabData2) {
        //         console.log(tabData2);
        //     })
        // })
        var currentSetting = ruleConfig[0]
        $('#CA-currentTpl').val(currentSetting.name)
        $('input[name="tplName"]').val(currentSetting.name)
        renderRuleTable(currentSetting.ruleList)
    }
});


