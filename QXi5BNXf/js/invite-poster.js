'use strict';

var invitePoster = function () {
    var showError = function (title, text) {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text || '',
            confirmButtonText: '确定'
        });
    };

    var openImage = function (button) {
        var inviteUrl = button.getAttribute('data-invite-url');
        var buttonText = button.innerHTML;
        var imageWindow = window.open('', '_blank');
        var poster = new Image();

        if (imageWindow === null) {
            showError('新窗口被拦截', '请允许本站打开新窗口后重试');
            return;
        }

        if (typeof INVITE_POSTER_IMAGE === 'undefined') {
            imageWindow.close();
            showError('邀请图片生成失败', '海报底图数据未加载');
            return;
        }

        imageWindow.document.write(
            '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '<meta charset="utf-8">' +
            '<title>正在生成邀请图片</title>' +
            '</head>' +
            '<body style="margin:0;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">' +
            '<div>正在生成邀请图片...</div>' +
            '</body>' +
            '</html>'
        );
        imageWindow.document.close();

        button.innerHTML = '正在生成...';
        button.disabled = true;

        poster.onload = function () {
            try {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var qrcodeBox = document.createElement('div');
                var imageUrl;

                canvas.width = poster.naturalWidth;
                canvas.height = poster.naturalHeight;
                context.drawImage(poster, 0, 0);

                $(qrcodeBox).qrcode({
                    render: 'canvas',
                    text: inviteUrl,
                    size: 330,
                    fill: '#000000',
                    background: '#ffffff',
                    ecLevel: 'H',
                    quiet: 2
                });

                context.drawImage(
                    qrcodeBox.getElementsByTagName('canvas')[0],
                    378,
                    757,
                    330,
                    330
                );

                imageUrl = canvas.toDataURL('image/png');

                imageWindow.document.open();
                imageWindow.document.write(
                    '<!DOCTYPE html>' +
                    '<html>' +
                    '<head>' +
                    '<meta charset="utf-8">' +
                    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
                    '<title>邀请图片</title>' +
                    '</head>' +
                    '<body style="margin:0;background:#111;text-align:center;">' +
                    '<img src="' + imageUrl + '" style="display:block;width:420px;max-width:90%;height:auto;margin:30px auto;" alt="邀请图片">' +
                    '</body>' +
                    '</html>'
                );
                imageWindow.document.close();

                button.innerHTML = buttonText;
                button.disabled = false;
            } catch (error) {
                imageWindow.close();
                button.innerHTML = buttonText;
                button.disabled = false;
                showError('邀请图片生成失败');
            }
        };

        poster.onerror = function () {
            imageWindow.close();
            button.innerHTML = buttonText;
            button.disabled = false;
            showError('海报底图加载失败');
        };

        poster.src = INVITE_POSTER_IMAGE;
    };

    return {
        open: function (button) {
            openImage(button);
        }
    };
}();
