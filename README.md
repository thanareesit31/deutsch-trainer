# Deutsch mit Sun

เว็บฝึกภาษาเยอรมันสำหรับผู้เรียนไทย A1.1–A1.2 สร้างด้วย Next.js App Router, React, TypeScript และ Bun สำหรับ Vercel

## เริ่มใช้งาน

```sh
bun install
bun run dev
```

เปิด http://localhost:3000

**รีสตาร์ตเว็บบน Mac:** ดับเบิลคลิก `restart.command` ในโฟลเดอร์โปรเจกต์ หรือรัน `npm run dev:restart` ใน Terminal หน้าต่าง Terminal จะแสดง log และปล่อยเปิดค้างไว้ขณะเว็บทำงาน ใช้ `Ctrl+C` เพื่อปิดเว็บ

```sh
bun run typecheck
bun run test
bun run build
bun run start
```

## ฟังก์ชันที่ใช้งานได้

- คำศัพท์หลักเดิมครบ 181 คำ / 12 บท รักษารหัส V001–V181 และแยกศัพท์เสริม 16 คำ
- เส้นทางเลือกระดับ → บท → ทักษะ → แบบฝึก → รอบ 5/10/20/ทั้งหมด
- Flashcards, Quiz สองทิศทาง, Artikel และ Adaptive Typing พร้อม Artikel และป้าย Plural
- L01: ไวยากรณ์แยกหัวข้อ ผัน kommen/heißen/lernen/sein, Personalpronomen, Satzbau
- L01: สำนวนตามสถานการณ์, Flashcards ประโยค, เติมบทสนทนา และเรียงประโยค
- L01: เขียนประโยคตามคำใบ้, อ่านเรื่องต้นฉบับพร้อมคำถาม และฟังคำทักทายด้วยเสียงสังเคราะห์
- บันทึกผลทุกคำตอบทันที แยกจำนวนถูก/ผิด ความชำนาญ และกำหนดทบทวนรายข้อ
- หน้าผลลัพธ์พร้อมฝึกเฉพาะข้อผิด / หน้าทบทวน / สถิติที่กดดูข้อมูลและฝึกข้อเดียวได้
- Export/Import JSON รวมประวัติที่ใหม่กว่ารายข้อ รองรับไฟล์เดิม `{version:1, progress:{V001:...}}` และ raw progress
- Reset ต้องยืนยันสองขั้น และพิมพ์ RESET

## ขอบเขตเนื้อหา

L02–L12 มีคำศัพท์หลักเดิมครบ ทักษะอื่นแสดงสถานะกำลังเตรียมเนื้อหา ตามแผนเริ่ม L01 ก่อนในแชตต้นทาง

การเขียนใช้ประโยคตามคำใบ้และคำตอบทางเลือกที่กำหนด ยังไม่ใช่การตรวจงานเขียนอิสระด้วย AI การฟังใช้ Web Speech API และต้องมีเสียงภาษาเยอรมันบนอุปกรณ์ ไม่ใช่ไฟล์เสียงจากหนังสือ แบบฝึกใหม่เป็นตัวอย่างที่แต่งขึ้นตามหัวข้อที่ระบุในแชต

## บัญชีและ Progress

ใช้ Supabase Auth สำหรับสมัคร/เข้าสู่ระบบ และเก็บความก้าวหน้ารายข้อ การตั้งค่า และสถิติรายวันใน Supabase Postgres โดย Row Level Security จำกัดข้อมูลให้เจ้าของบัญชีเท่านั้น ผู้เรียนเข้าสู่ระบบจากอุปกรณ์ใดก็ได้เพื่อโหลดข้อมูลชุดเดียวกัน

ตั้งค่า `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ใน `.env.local` สำหรับพัฒนา และเพิ่มค่าทั้งสองเป็น Environment Variables ใน Vercel ก่อน deploy จากนั้นรัน SQL migration ใน `supabase/migrations/20261001000000_learner_data.sql` ผ่าน Supabase SQL Editor เปิดใช้งาน Email ใน Supabase Auth และตั้ง Site URL / Redirect URL ให้ตรงกับโดเมนเว็บ

เมื่อเข้าสู่ระบบ ระบบจะรวม Progress เก่าจาก `deutsch-mit-sun-v5` หรือ `deutschProgress` ในเบราว์เซอร์นั้นเข้าไปในบัญชีโดยอัตโนมัติ โดยเก็บประวัติที่ใหม่กว่ารายข้อ หากย้ายข้อมูลจากอุปกรณ์ที่ไม่มีข้อมูลในเบราว์เซอร์ ให้ Export JSON จากอุปกรณ์เดิม แล้ว Import หลังเข้าสู่บัญชีเดียวกัน

การนำเข้าใช้ประวัติรายข้อที่มี `lastPracticed` / `lastSeen` ใหม่กว่า ไม่บวกจำนวนซ้ำ หากเวลาตรงกันเลือกชุดที่มีคำตอบมากกว่า ข้อมูลข้ออื่นและการตั้งค่าปัจจุบันคงอยู่ ไฟล์ผิดรูปแบบจะถูกปฏิเสธก่อนเขียนข้อมูล

ความชำนาญให้น้ำหนัก typing/order/dialogue มากกว่าตัวเลือก การตอบถูกครั้งเดียวไม่ถือว่าจำได้ กำหนดทบทวนขยับจาก 1 ไป 3/7/14/30 วันเมื่อถูกต่อเนื่อง และคำตอบผิดเข้าคิวทบทวนทันที

## Deploy บน Vercel

นำเข้า Git repository/branch นี้เป็น Next.js project และใช้ root directory ของโปรเจกต์ จากนั้น Deploy การตั้งค่าใน `vercel.json` ใช้:

```json
{
  "framework": "nextjs",
  "bunVersion": "1.x",
  "installCommand": "bun install",
  "buildCommand": "bun run build"
}
```

หรือรัน `bunx vercel --prod` หลัง login ต้องตั้งค่า Supabase environment variables ตามหัวข้อบัญชีและ Progress ก่อน deploy

ตรวจ `GET /api/health` หลัง deploy: ต้องได้ `status: "ok"`, `runtime: "bun"` และ `vocabulary: 181`

Vercel ใช้ `bunVersion` เพื่อเลือก Bun เป็น runtime ของ server functions ส่วน development/build ใช้ `bun run --bun next ...` ตาม [เอกสาร Vercel](https://vercel.com/docs/functions/runtimes/bun)

## โครงสร้าง

```text
src/data/                 ข้อมูลเดิมจาก German Trainer V1
src/lib/content.ts        ชนิดข้อมูลและการตั้งค่าโหมด
src/components/content-provider.tsx โหลดคลังเนื้อหาจาก Supabase
supabase/seed/catalog.json สำเนาเนื้อหาเดิมสำหรับ seed/กู้คืน (ใช้ชั่วคราวเฉพาะก่อนติดตั้งตาราง)
src/lib/engine.ts         Session, Progress, review และ backup validation
src/components/           หน้าเว็บและการฝึก
src/app/                  Next.js layout, routes, styles และ health endpoint
tests/engine.test.ts      ทดสอบข้อมูล/คะแนน/ทบทวน/นำเข้าข้อมูล
tests/browser.mjs         ทดสอบ browser และสร้างภาพหน้าจอ
```

ทดสอบ browser หลังเปิด production server ด้วย `bun run test:e2e` โดยกำหนด `CHROME_PATH` หาก Chrome อยู่คนละที่ และ `TEST_BASE_URL` หากไม่ได้ใช้ localhost:3000

Mac เครื่องที่ใช้พัฒนาปัจจุบันเป็น macOS 10.15 จึงทดสอบในเครื่องด้วย Node 20.20.2 ที่เก็บเฉพาะใน `.tools/` และ `next build --webpack` Bun รุ่นปัจจุบันต้อง macOS 13 ขึ้นไป การตั้งค่า production ยังคงเป็น Bun ตามที่ระบุข้างต้น

## คลังเนื้อหาในฐานข้อมูล

ก่อนเปิดเว็บเวอร์ชันนี้ ให้รัน `supabase/migrations/20261003010000_content_catalog.sql` ตาม [คู่มือย้ายเนื้อหา](docs/content-database.md) เนื้อหาทั้งหมดอ่านจาก Supabase โดยคงรหัสและประวัติเดิม
