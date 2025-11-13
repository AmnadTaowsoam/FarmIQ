import serial

# ตั้งค่าพอร์ตตามที่ตรวจพบ
port = '/dev/ttyUSB0'
baudrate = 9600

ser = serial.Serial(port, baudrate, timeout=1)

print(f"Listening on {port}... Press Ctrl+C to stop.")
try:
    while True:
        data = ser.readline().decode('utf-8', errors='ignore').strip()
        if data:
            print("Weight:", data)
except KeyboardInterrupt:
    print("\nStopped.")
finally:
    ser.close()
