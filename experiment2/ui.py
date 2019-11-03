import board
import digitalio
from PIL import Image, ImageDraw, ImageFont
import adafruit_ssd1306
import requests
import signal
import time
import sys

RESET_PIN = digitalio.DigitalInOut(board.D4)

i2c = board.I2C()
oled = adafruit_ssd1306.SSD1306_I2C(128,64,i2c,addr=0x3c,reset=RESET_PIN)

# clear screen when done
# good suggestion at https://gist.github.com/rtfpessoa/e3b1fe0bbfcd8ac853bf
# but not actually working once program has entered main loop?
def signal_handler(signal, frame):
    oled.fill(0)
    oled.show()
    sys.exit(0)

# create scratch frame

image = Image.new('1', (oled.width, oled.height))
draw = ImageDraw.Draw(image)

# load default font
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 10)

if __name__ == '__main__':
    signal.signal(signal.SIGINT, signal_handler)

    # clear screen at start
    oled.fill(0)
    oled.show()

while True:
    # Clear image
    draw.rectangle((0, 0, oled.width, oled.height), outline=0, fill=0)

    # Query experiment2.js to get current program & history

    currentStatus = requests.get('http://localhost:4400/current').json()
   
    # draw current program
    draw.text((0,0), 
        "Playing: {} {}".format(currentStatus['playing'], currentStatus['currentProgram']),
        font=font,
        fill=255)

    history = requests.get('http://localhost:4400/history').json()
    draw.text((0,32),
        "{}".format(history['history'][-5:]),
        font=font,
        fill=255)

    # draw last 8 history

    oled.image(image)
    oled.show()
    time.sleep(.05) # 20 updates per second
