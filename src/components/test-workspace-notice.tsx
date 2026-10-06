"use client";

export function TestWorkspaceNotice() {
  if (!process.env.NEXT_PUBLIC_TEST_WORKSPACE_ID) return null;
  return (
    <aside className="test-workspace-notice" aria-label="พื้นที่ทดสอบ">
      <strong>พื้นที่ทดสอบบนเครื่อง — ข้อมูลแยกจากบัญชีจริง</strong>
      <span>บัญชี tester@deutsch.test · รหัสผ่าน TestOnly123!</span>
      <span>เริ่มใหม่: Ctrl+C แล้วเปิด npm run dev:test อีกครั้ง</span>
    </aside>
  );
}
