# raspi-dexter-lex-ai

Watch the demo video below.

[![Alt text for your video](https://img.youtube.com/vi/OO2m5dOIiR4/0.jpg)](http://www.youtube.com/watch?v=OO2m5dOIiR4)

This is the codebase which runs on Raspberry pi and communicate with AWS Lex APIs

To communicate with Lex API , you need to capture voice through a connected Speaker ( I used one 3.5 USB power speaker ) and send the voice to Lex API.

Follow below article from Amazon which explains step by step how to install all different sofwares on Raspberry Pi to connect to Lex API.
In this article author used 12C 3W Stereo Speaker. You can use any 3.5 USB speaker you have in your house instead as I did.

https://aws.amazon.com/blogs/machine-learning/build-a-voice-kit-with-amazon-lex-and-a-raspberry-pi/

Follow the instructions till the end where it talks about wake word. You definitely don't want you Raspberry pi to capture all the noises in your home and call Lex API,
rather you would like to initiate the conversation when you say a wake word, same as you say "alexa" to start talking to your Amazon Echo devices.


Once you have installed all the softwares following above link , clone this repo (https://github.com/just4give/raspi-dexter-lex-ai.git) to your Raspberry pi /home/pi directory.

Along with your lex client , you need to run a nodejs express server (https://github.com/just4give/raspi-image-server.git) which will expose one REST API. Your lambda function ( which is invoked by Lex Bot to fullfill the request) will call this API asking Raspberry Pi to capture an image and load to S3 bucket. Checkout https://github.com/just4give/raspi-dexter-lambda.git for more about how I configured lambda with Lex.

```


python /home/pi/snowboy/rpi-arm-raspbian-8.0-1.2.0/tintin-wake.py /home/pi/snowboy/rpi-arm-raspbian-8.0-1.2.0/resources/Tintin.pmdl &
sudo forever start /home/pi/raspi-image-server/server.js -o /home/pi/raspi-image-server.log

```

**You need to make the port running your image processing sever accessible through internet**
You can achive this in few different ways.
1. You can visit your home router admin page and add a port forward to make the port accessible through your gateway IP
2. You can take a look at https://docs.dataplicity.com/docs  . They have very very simple installation process and make your PI accessible throug internet. Then you need to create a warmhole ( basically port forwarding) which will make port 80 accessible. Remember your image processing web server must be running on port 80. Usually Pi won't let you run your web server on port 80. So you need to start your server using sudo.

### 
