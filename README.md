# -
一个支持多人的画布，我小时候看过一个视频让我非常好奇，所以借助ai写出了这个

环境安装
pip install -r requirements.txt

启动
python app.py


下面是docker镜像

容器端口是：9191

拉取 ARM64 镜像：
docker pull hiit417/pixel-canvas:arm64

拉取 x86 镜像：
docker pull hiit417/pixel-canvas:x86

清空画布数据在根目录执行

echo "" > block_colors.json

体验：https://1f29c8b8.r7.vip.cpolar.cn/


![效果图](https://github.com/fhgfhgfj/-/blob/main/效果.png)
