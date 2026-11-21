'use strict';
// T28 — VẼ SẮC NÉT THEO MÀN HÌNH (HiDPI).
// Toàn bộ code vẫn vẽ bằng toạ độ logic 1280×720 (W×H). File này chỉ đổi kích thước bộ đệm thật của canvas
// theo cỡ hiển thị × devicePixelRatio, rồi đặt g.setTransform(k) đầu mỗi khung hình → chữ, viền, HUD, sprite nét hơn.
// Hệ số tối đa theo cài đặt Đồ họa sẵn có (v41Quality): 0 Tiết kiệm = ×1 (như cũ), 1 Cân bằng ≤ ×1,5, 2 Cao ≤ ×2.
// Chuột không đổi (pointer() đã quy đổi theo W/rect.width). Muốn tắt hẳn: đặt RS.enabled=false.
const RS={enabled:true,k:1};
function rsTarget(){
  if(!RS.enabled)return 1;
  const r=cv.getBoundingClientRect();if(!r.width)return RS.k;
  const dpr=window.devicePixelRatio||1,q=typeof v41Quality==='function'?v41Quality():1;
  const maxK=q>=2?2:q>=1?1.5:1;
  return clamp(Math.round(r.width*dpr/W*4)/4,1,maxK); // làm tròn 0,25 để không đổi kích thước liên tục
}
function rsPrepare(){
  const k=rsTarget(),bw=Math.round(W*k),bh=Math.round(H*k);
  if(cv.width!==bw||cv.height!==bh){cv.width=bw;cv.height=bh;}
  RS.k=k;g.setTransform(k,0,0,k,0,0);
}
