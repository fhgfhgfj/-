from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, logger=True, engineio_logger=True)

# 存储画布上方块的颜色，使用字典格式 {'x_y': 'color'}
block_colors = {}

# 颜色信息存储文件名
colors_file = 'block_colors.json'

def save_colors():
    """将颜色信息保存到文件中"""
    with open(colors_file, 'w') as file:
        json.dump(block_colors, file)

def load_colors():
    """从文件中加载颜色信息"""
    try:
        with open(colors_file, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}  # 如果文件不存在或内容为空，则返回空字典

@app.route('/')
def index():
    # 渲染并返回 index.html 模板
    return render_template('index.html')

@socketio.on('color_block')
def handle_color_block(data):
    # data 应包含 x, y 坐标和颜色
    key = f"{data['x']}_{data['y']}"
    block_colors[key] = data['color']
    # 保存更新后的颜色信息
    save_colors()
    # 广播绘制动作到所有连接的客户端
    emit('color_block', data, broadcast=True)

@socketio.on('connect')
def handle_connect():
    # 向新连接的客户端发送整个画布的颜色信息
    for key, color in block_colors.items():
        x, y = key.split('_')
        emit('color_block', {'x': int(x), 'y': int(y), 'color': color})

if __name__ == '__main__':
    # 从文件加载颜色信息到内存
    block_colors = load_colors()
    socketio.run(app, host='0.0.0.0', port=80)
