$(function() {

    var layer = layui.layer
    var form = layui.form
    initCate();
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-select', res)
                $('[name=cate_id]').html(htmlStr)
                    // 一定要记得调用 FormData.render()放发
                form.render()
            }

        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮添加点击事件
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        // 监听overFile 的change 事件， 获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 拿到用户选择的文件
        var file = e.target.files

        // 判断用户是否选中了文件
        if (file.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file[0])

        // 先 销毁 旧的裁剪区域，再 重新设置图片路径 ，之后再 创建新的裁剪区域 ：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_status = '已发布'

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave').on('click', function() {
        art_status = '草稿'
    })


    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault
            // 2.基于 form 表单快速创建一个 FormData对象
        var fd = new FormData($(this)[0])
            // 3.将文章的发布状态存到ID中
        fd.append('state', art_status)
            // 4.将裁剪后的图片，输出为文
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6.发起 ajax数据请求
                publishArticle(fd);
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            /* 注意：如果向服务器发生FormDate数据格式的ajax请求，必须要带
                contentType和processData属性，且属性值一定设置为false
            */
            contentType: false,
            processData: false,
            success: function(res) {
                layui.layer.msg(res.msg)
                if (res.status !== 0) {
                    return
                }
                window.parent.setNavSelected('#article-list', '#article-pub')
                console.log(window.parent);
                location.href = '/article/art_list.html'
            }
        })
    }
})