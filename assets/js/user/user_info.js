$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: [/^[\S]{1,6}$/, '用户昵称只能是1~6个字符，且不能包含空格']
    })
    initUserInfo()
        // 初始化用户信息

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.msg)
                }

                // 调用form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
                    // console.log(res);
            }
        })
    }
    //  重置表单的数据
    $('#btnReset').on('click', function(e) {
            // 阻止表单的默认重置行为
            e.preventDefault()
            initUserInfo()
        })
        //    监听表单的提交事件 
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
            // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                layer.msg(res.msg)
                if (res.status !== 0)
                    return
                layer.msg('更新个人信息成功！')
                    // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }
        })
    })
})