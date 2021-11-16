$(function() {
    // 点击“>去注册账号”的你链接
    $('#link-reg').on('click', function() {
        $('.reg-box').show();
        $('.login-box').hide();
    });
    $('#link-login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 从layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过 form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框的内容
            // 还需拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败则 return 一个提示消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码输入不一致!'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 1.阻止默认提交行为
        e.preventDefault()
        var data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            }
            // 2.发起Ajax的POST请求
            /* $.ajax({
                type: "post",
                url: 'http://ajax.frontend.itheima.net/api/reguser',
                contentType: "application/x-www-form-urlencoded",
                data: data,
                dataType: "json",
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('注册成功，请登录！');
                    // 模拟人的点击行为
                    $('#link-login').click();
                }
            }); */
        $.post('/api/reguser',
            data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！');
                // 模拟人的点击行为
                $('#link-login').click();
            })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功！')
                    // 将登录成功得到的 token 字符串，保存到
                    // localStorage 中 
                localStorage.setItem('token', res.token)
                    // console.log(res.token);
                    // 跳转到后台主页
                location.href = 'index.html'
            }
        })
    })
})