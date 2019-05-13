+++
title = "Wake on Pi - Wake on LAN via Raspberry Pi"
date = "2015-01-19"
draft = false
+++

Once my infant son became mobile, baby-proofing the house became a high priority. I covered all the basics by adding locks to kitchen cabinets, installing a baby gate at the top of the stairs, and placing all fragile items out of reach. Unfortunately, the one item that slipped my mind was protecting my desktop PC. I hadn't realized that the little guy had been cycling the PC's power until I caught him in the act. The first order of business was to disable the front power switch, and then figure out an alternate method for waking the PC from sleep.

Since I had a underutilized Raspberry Pi laying around, my first inclination was to figure out how to send a [Wake-on-LAN](http://en.wikipedia.org/wiki/Wake-on-LAN#Magic_packet) packet from the Pi. Some quick research yielded some [solid sample code](https://github.com/bentasker/Wake-On-Lan-Python) in Python. Once I had figured out how to wake my desktop via Wake-on-LAN, the next step was to make this a one-touch process if possible. The obvious solution was to wire a switch to the Raspberry Pi that, when pressed, will trigger a Wake-on-LAN packet to be sent to the machine of your choice.

The wiring for the switch is pretty basic.

<a class="th" href="/public/img/IMG_20150101_145454.jpg">
  <img src="/public/img/thumbs/IMG_20150101_145454.jpg">
</a>

Now on to the code. First of all, we need a function to send a Wake-on-LAN packet to target machine. The [sample code](https://github.com/bentasker/Wake-On-Lan-Python) mentioned earlier was used for this task.

Wake-on-LAN code
```python
def wake_on_lan(macaddress):
  # Check macaddress format and try to compensate.
  if len(macaddress) == 12:
    pass
  elif len(macaddress) == 12 + 5:
    sep = macaddress[2]
    macaddress = macaddress.replace(sep, '')
  else:
    raise ValueError('Incorrect MAC address format')

    # Pad the synchronization stream.
    data = ''.join(['FFFFFFFFFFFF', macaddress * 20])
    send_data = ''

    # Split up the hex values and pack.
    for i in range(0, len(data), 2):
      send_data = ''.join([send_data,
      struct.pack('B', int(data[i: i + 2], 16))])

      # Broadcast it to the LAN.
      sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
      sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
      sock.sendto(send_data, ('192.168.2.255', 7))
      return True
```
Once we can send a Wake-on-LAN packet, we need to write code to monitor the state of the switch. Note, the switch is wired to GPIO pin 23.

GPIO code.
```python
def monitor_switch(macaddress):
  try:
    switch = 23

    GPIO.setmode(GPIO.BCM)
    GPIO.setup(switch, GPIO.IN)

    while True:
      if GPIO.input(switch):
        pass
      else:
        print wake_on_lan(macaddress)
        time.sleep(0.1)
      finally:
        GPIO.cleanup()
```

And that's it.
