
1. แก้ไข docker-compose.yml
6304 เป็น 6313 ทั้งหมด

2. แก้ไขไฟล์ apiKEY.ts และ swagger.ts

3. CAPTURE_INGEST_API_KEY=admin-key

4. yarn install

5. npx prisma generate

6. npx prisma migrate dev --name init