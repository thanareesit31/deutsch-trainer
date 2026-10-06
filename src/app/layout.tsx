import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ContentProvider } from "@/components/content-provider";
import { StoreProvider } from "@/components/store";
import { LessonStateProvider } from "@/components/lesson-state-provider";
import { LearningProvider } from "@/components/learning-store";

export const metadata: Metadata = {
  title: "Deutsch mit Sun — ฝึกเยอรมันทีละนิด ทุกวัน",
  description:
    "พื้นที่ฝึกภาษาเยอรมัน A1.1–A1.2 สำหรับซัน คำศัพท์ ไวยากรณ์ และสำนวน พร้อมทบทวนและติดตามความก้าวหน้า",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#214d3d",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <ContentProvider>
          <StoreProvider>
            <LessonStateProvider>
              <LearningProvider>{children}</LearningProvider>
            </LessonStateProvider>
          </StoreProvider>
        </ContentProvider>
      </body>
    </html>
  );
}
