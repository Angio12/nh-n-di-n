import { MeatSample } from '../types';

export const MEAT_DATASET: MeatSample[] = [
  // Lần thử nghiệm 1
  { time: "0h", group: "A", r: 200, g: 176, b: 178, obs: "hồng nhạt", status: "tươi", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 1 },
  { time: "12h", group: "A", r: 199, g: 175, b: 181, obs: "hồng nhạt", status: "tươi", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 1 },
  { time: "24h", group: "A", r: 204, g: 182, b: 188, obs: "hồng nhạt", status: "rỉ nước", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 1 },
  { time: "36h", group: "A", r: 205, g: 185, b: 189, obs: "hồng nhạt", status: "xỉn màu", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 1 },
  { time: "48h", group: "A", r: 205, g: 185, b: 189, obs: "hồng nhạt", status: "có mùi thối", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 1 },
  { time: "60h", group: "A", r: 171, g: 178, b: 180, obs: "xanh dương", status: "thối rõ", label: "đỏ", conclusion: "KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG", experiment: 1 },
  { time: "72h", group: "A", r: 171, g: 176, b: 158, obs: "xanh lá nhẹ", status: "thối rõ", label: "đỏ", conclusion: "KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG", experiment: 1 },

  { time: "0h", group: "B", r: 211, g: 189, b: 192, obs: "hồng nhạt", status: "tươi", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 1 },
  { time: "6h", group: "B", r: 200, g: 178, b: 180, obs: "hồng nhạt", status: "rỉ nước", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 1 },
  { time: "12h", group: "B", r: 211, g: 190, b: 184, obs: "hồng nhạt", status: "có mùi thối", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 1 },
  { time: "18h", group: "B", r: 197, g: 180, b: 179, obs: "hồng nhạt", status: "thối rõ", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 1 },
  { time: "24h", group: "B", r: 193, g: 180, b: 176, obs: "hồng pha xanh", status: "thối rõ", label: "đỏ", conclusion: "KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG", experiment: 1 },
  { time: "30h", group: "B", r: 184, g: 185, b: 179, obs: "xanh dương", status: "thối rõ", label: "đỏ", conclusion: "KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG", experiment: 1 },
  { time: "36h", group: "B", r: 156, g: 167, b: 159, obs: "xanh dương", status: "thối rõ", label: "đỏ", conclusion: "KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG", experiment: 1 },

  // Lần thử nghiệm 2
  { time: "0h", group: "A", r: 200, g: 179, b: 183, obs: "hồng nhạt", status: "tươi", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 2 },
  { time: "12h", group: "A", r: 187, g: 159, b: 166, obs: "hồng nhạt", status: "tươi", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 2 },
  { time: "24h", group: "A", r: 185, g: 155, b: 160, obs: "hồng nhạt", status: "rỉ nước", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 2 },
  { time: "36h", group: "A", r: 187, g: 161, b: 162, obs: "hồng nhạt", status: "xỉn màu", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 2 },
  { time: "48h", group: "A", r: 187, g: 161, b: 162, obs: "hồng nhạt", status: "có mùi thối", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 2 },
  { time: "60h", group: "A", r: 167, g: 171, b: 172, obs: "xanh dương", status: "thối rõ", label: "đỏ", conclusion: "KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG", experiment: 2 },
  { time: "72h", group: "A", r: 162, g: 166, b: 152, obs: "xanh lá nhẹ", status: "thối rõ", label: "đỏ", conclusion: "KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG", experiment: 2 },

  { time: "0h", group: "B", r: 205, g: 187, b: 189, obs: "hồng nhạt", status: "tươi", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 2 },
  { time: "6h", group: "B", r: 198, g: 176, b: 177, obs: "hồng nhạt", status: "rỉ nước", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 2 },
  { time: "12h", group: "B", r: 216, g: 195, b: 189, obs: "hồng nhạt", status: "có mùi thối", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 2 },
  { time: "18h", group: "B", r: 189, g: 171, b: 167, obs: "hồng nhạt", status: "thối rõ", label: "xanh lá", conclusion: "THỊT TƯƠI SẠCH – NÊN ĂN NGAY", experiment: 2 },
  { time: "24h", group: "B", r: 176, g: 174, b: 171, obs: "hồng pha xanh", status: "thối rõ", label: "đỏ", conclusion: "KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG", experiment: 2 },
  { time: "30h", group: "B", r: 173, g: 175, b: 163, obs: "xanh dương", status: "thối rõ", label: "đỏ", conclusion: "KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG", experiment: 2 },
  { time: "36h", group: "B", r: 173, g: 182, b: 168, obs: "xanh dương", status: "thối rõ", label: "đỏ", conclusion: "KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG", experiment: 2 }
];
