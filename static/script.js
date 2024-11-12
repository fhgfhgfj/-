document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const blockSize = 10; // 设置每个方块的大小
    const gridColor = 'rgba(0, 0, 0, 0.1)'; // 边框颜色设置为半透明
    const canvasWidth = canvas.width / blockSize;
    const canvasHeight = canvas.height / blockSize;

    // 初始化画布，绘制半透明边框的网格
    function initCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height); // 清除画布
        context.strokeStyle = gridColor; // 边框颜色设置为半透明
        for (let x = 0; x < canvasWidth; x++) {
            for (let y = 0; y < canvasHeight; y++) {
                context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
            }
        }
    }

    // 在画布上填充方块，重新绘制边框
    function fillBlock(x, y, color) {
        context.fillStyle = color;
        context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);

        // 每次填充后重新绘制边框，确保边框保持半透明
        context.strokeStyle = gridColor; // 重新设置边框颜色
        context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }

    // 监听画布点击事件
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / blockSize);
        const y = Math.floor((event.clientY - rect.top) / blockSize);
        const color = colorPicker.value;
        fillBlock(x, y, color); // 在本地画布上填充方块
        socket.emit('color_block', { x, y, color }); // 将填充信息发送到服务器
    });

    // 接收来自服务器的填充方块事件
    socket.on('color_block', (data) => {
        fillBlock(data.x, data.y, data.color);
    });

    initCanvas(); // 页面加载完成后初始化画布
});
