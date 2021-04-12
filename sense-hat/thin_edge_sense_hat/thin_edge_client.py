import time
import json
import logging
import signal
import paho.mqtt.client as mqtt
from sense_hat import SenseHat, ACTION_PRESSED

bg = [11, 159, 233]
bl = [3, 40, 88]
ye = [255, 228, 0]

image = [
    bg, bl, bg, bg, bg, bg, bg, ye,
    bl, bl, bl, bg, bg, bg, ye, bg,
    bg, bl, bg, bg, bg, ye, bg, bg,
    bg, bl, bg, bg, ye, bg, bl, bg,
    bg, bl, bg, ye, bg, bl, bg, bl,
    bg, bg, ye, bg, bg, bl, bl, bl,
    bg, ye, bg, bg, bg, bl, bg, bg,
    ye, bg, bg, bg, bg, bg, bl, bl
]

class SenseHatThinEdgeClient():

    def __init__(self, interval = 10, showImage = True):
        signal.signal(signal.SIGTERM, self.stop)
        self.sense = SenseHat()
        self.client = mqtt.Client()
        self.running = True
        self.interval = interval
        self.showImage = showImage

    def joystick_up(self, event):
        if event.action == ACTION_PRESSED:
            move = {
                'move': 1
            }
            self.client.publish('tedge/measurements', json.dumps(move))
    
    def joystick_down(self, event):
        if event.action == ACTION_PRESSED:
            move = {
                'move': 2
            }
            self.client.publish('tedge/measurements', json.dumps(move))

    def joystick_left(self, event):
        if event.action == ACTION_PRESSED:
            move = {
                'move': 3
            }
            self.client.publish('tedge/measurements', json.dumps(move))

    def joystick_right(self, event):
        if event.action == ACTION_PRESSED:
            move = {
                'move': 4
            }
            self.client.publish('tedge/measurements', json.dumps(move))

    def joystick_middle(self, event):
        global client
        if event.action == ACTION_PRESSED:
            move = {
                'move': 5
            }
            self.client.publish('tedge/measurements', json.dumps(move))

    def stop(self, signum, frame):
        self.running = False

    def start(self):
        try:
            logging.info('Start thin-edge-sense-hat...')
            self.client.connect("127.0.0.1", 1883, 60)
            self.client.loop_start()
          
            self.sense.stick.direction_up = self.joystick_up
            self.sense.stick.direction_down = self.joystick_down
            self.sense.stick.direction_left = self.joystick_left
            self.sense.stick.direction_right = self.joystick_right
            self.sense.stick.direction_middle = self.joystick_middle

            self.sense.show_message("thin-edge.io sense-hat", text_colour=bl)
            time.sleep(10)

            if self.showImage:
                self.sense.low_light = True
                self.sense.set_pixels(image)

            while self.running:
                time.sleep(self.interval)
                compass = self.sense.compass_raw
                gyro = self.sense.gyro_raw
                accelerometer = self.sense.accelerometer_raw
                measurements = {
                    'temperature': self.sense.temperature,
                    'humidity': self.sense.humidity,
                    'pressure': self.sense.pressure,
                    'compass': {
                        'x': compass['x'],
                        'y': compass['y'],
                        'z': compass['z']
                    } ,
                    'gyro': {
                        'x': gyro['x'],
                        'y': gyro['y'],
                        'z': gyro['z']            
                    },
                    'accelerometer': {
                        'x': accelerometer['x'],
                        'y': accelerometer['y'],
                        'z': accelerometer['z']            
                    }
                }
                self.client.publish('tedge/measurements', json.dumps(measurements))
        except Exception as e:
            logging.error(str(e))
        finally:
            logging.info('Stopping thin-edge-sense-hat...')
            self.sense.clear() 
