import snowboydecoder
import os
import sys
import signal
import subprocess

interrupted = False
TOP_DIR = os.path.dirname(os.path.abspath(__file__))
DETECT_DING = os.path.join(TOP_DIR, "resources/ding.wav")

def signal_handler(signal, frame):
     global interrupted
     interrupted = True

def interrupt_callback():
     global interrupted
     return interrupted

def on_hot_word():
        detector.terminate()
        snowboydecoder.play_audio_file(DETECT_DING)
        pro = subprocess.Popen(["node", "/home/pi/raspi-dexter-lex-ai/bot.js"]).wait()
        print("Restarting...")
        os.execv(sys.executable, ['python'] + sys.argv)

if len(sys.argv) == 1:
     print("Error: need to specify model name")
     print("Usage: python demo.py your.model")
     sys.exit(-1)

model = sys.argv[1]

# capture SIGINT signal, e.g., Ctrl+C signal.signal(signal.SIGINT, signal_handler)

detector = snowboydecoder.HotwordDetector(model, sensitivity=0.5)
print('Listening... Press Ctrl+C to exit')

# main loop
detector.start(detected_callback=on_hot_word,
                interrupt_check=interrupt_callback,
                sleep_time=0.03)

detector.terminate()
