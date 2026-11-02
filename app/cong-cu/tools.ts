import { Calculator, CalendarDays, Scale, ShoppingBasket, type LucideIcon } from "lucide-react";

export const TOOLS: { href: string; title: string; description: string; icon: LucideIcon }[] = [
  {
    href: "/cong-cu/tinh-dinh-duong/",
    title: "Tính dinh dưỡng",
    description: "Chọn nguyên liệu, nhập khối lượng – xem ngay năng lượng, đạm, bột đường, chất béo, chất xơ cho cả món và từng khẩu phần.",
    icon: Calculator,
  },
  {
    href: "/cong-cu/lap-thuc-don/",
    title: "Lập thực đơn 7 ngày",
    description: "Chọn món cho bữa sáng, trưa, tối cả tuần. Tự lưu trên máy và tạo danh sách đi chợ chỉ với một lần bấm.",
    icon: CalendarDays,
  },
  {
    href: "/cong-cu/danh-sach-di-cho/",
    title: "Danh sách đi chợ",
    description: "Gộp nguyên liệu trùng, đánh dấu đã mua, chỉnh số lượng, in hoặc sao chép gửi người thân qua Zalo, Messenger.",
    icon: ShoppingBasket,
  },
  {
    href: "/cong-cu/quy-doi-khau-phan/",
    title: "Quy đổi khẩu phần",
    description: "Nấu cho 2 người hay 8 người? Nhập định lượng gốc và số khẩu phần mong muốn, công cụ tự tính lại.",
    icon: Scale,
  },
];
