# ทดสอบ Scale ยี่ห้อ SUNFORD TCS-SW31

# ภาพรวมการทำงาน
ขอขั้นตอนการทดสอบการดึงข้อมูลจาก Scale SUNFORD รุ่น TCS-SW31 เข้ามาแสดงผลที่ คอมพิวเตอร์ระบบ Linux Ubuntu 24.04.2 LTS

# ขั้นตอนการทดสอบ
 
  ## เตรียมสภาพแวดล้อ

  1. ตรวจสอบการเชื่อมต่ออุปกรณ์ Scale ผ่าน USB-to-Serial เสียบสาย USB-to-RS232 แล้วตรวจสอบอุปกรณ์ `ls /dev/ttyUSB*` หรือ `dmesg | grep tty`
  2. ติดตั้งเครื่องมือสำหรับทดสอบ Serial
    - `sudo apt update` และ `sudo apt install minicom screen python3-serial`
  3. ทดสอบรับค่าผ่าน minicom หรือ screen
    3.1 เปิด minicom ด้วยพอร์ตที่พบ
        - `sudo minicom -D /dev/ttyUSB0 -b 9600`
    3.2 ตั้งค่า baud rate และพารามิเตอร์ตามคู่มือเครื่องชั่ง โดยทั่วไปของ SUNFORD TCS-SW31 คือ
    .yaml
        Baud rate: 9600  
        Data bits: 8  
        Parity: None  
        Stop bits: 1  
        Flow control: None
    3.3 ถ้าเครื่องชั่งเชื่อมถูกต้อง เมื่อวางของบนเครื่องชั่ง จะเห็นข้อความลักษณะนี้บนหน้าจอ minicom
    `+001.25kg` หรื
    ออาจเป็น `ST,GS,  1.25 kg`
  4. เขียนสคริปต์ Python อ่านค่าจาก Scale
     - python scripts/read_scale.py
     เมื่อวางของบนเครื่องชั่งจะเห็นค่าขึ้นเช่น `Weight: ST,GS,  1.24 kg`
