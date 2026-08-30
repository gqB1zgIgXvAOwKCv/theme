'use strict';

var invitePoster = function () {
    var downloadImage = function (button) {
        var inviteUrl = button.getAttribute('data-invite-url');
        var posterUrl = button.getAttribute('data-poster-url');
        var buttonText = button.innerHTML;
        var poster = new Image();

        button.innerHTML = '正在生成...';
        button.disabled = true;

        poster.onload = function () {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var qrcodeBox = document.createElement('div');

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

            canvas.toBlob(function (blob) {
                var link = document.createElement('a');
                var imageUrl = URL.createObjectURL(blob);

                link.href = imageUrl;
                link.download = '邀请图片.png';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(imageUrl);

                button.innerHTML = buttonText;
                button.disabled = false;
            }, 'image/png');
        };

        poster.onerror = function () {
            button.innerHTML = buttonText;
            button.disabled = false;

            Swal.fire({
                icon: 'error',
                title: '邀请图片生成失败',
                confirmButtonText: '确定'
            });
        };

        poster.src = posterUrl;
    };

    return {
        download: function (button) {
            downloadImage(button);
        }
    };
}();