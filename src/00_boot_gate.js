'use strict';
// CỔNG KHỞI ĐỘNG — giữ đúng hành vi của bản 1 file gốc.
// Code chia thành nhiều file src/NN_*.js. Giữa hai file, trình duyệt có thể chạy khung hình
// (requestAnimationFrame) hoặc hẹn giờ (setTimeout/setInterval) trước khi các file sau kịp nạp
// → lỗi "X is not defined" (ví dụ BUILD_VERSION ở file 48). Cổng này giữ lại mọi lời gọi đó
// cho tới khi file cuối (99_boot_ready.js) chạy, rồi thả ra theo đúng thứ tự.
// KHÔNG xoá, KHÔNG đổi thứ tự: file này phải là file src đầu tiên, 99_boot_ready.js là file cuối.
(function(){
  const raf=window.requestAnimationFrame.bind(window),caf=window.cancelAnimationFrame.bind(window);
  const st=window.setTimeout.bind(window),ct=window.clearTimeout.bind(window);
  const si=window.setInterval.bind(window),ci=window.clearInterval.bind(window);
  const queue=[],real=new Map();let ready=false,fake=-1;
  const hold=(start)=>{const id=fake--;queue.push([id,start]);return id;};
  const cancel=(orig)=>(id)=>{if(id<0){const i=queue.findIndex(q=>q[0]===id);if(i>=0)queue.splice(i,1);else if(real.has(id))orig(real.get(id));}else orig(id);};
  window.requestAnimationFrame=(cb)=>ready?raf(cb):hold(()=>raf(cb));
  window.setTimeout=(cb,ms,...a)=>ready?st(cb,ms,...a):hold(()=>st(cb,ms,...a));
  window.setInterval=(cb,ms,...a)=>ready?si(cb,ms,...a):hold(()=>si(cb,ms,...a));
  window.cancelAnimationFrame=cancel(caf);window.clearTimeout=cancel(ct);window.clearInterval=cancel(ci);
  window.__vdttBootReady=function(){
    if(ready)return;ready=true;
    window.requestAnimationFrame=raf;window.setTimeout=st;window.setInterval=si;
    for(const [id,start] of queue.splice(0))real.set(id,start());
  };
})();
