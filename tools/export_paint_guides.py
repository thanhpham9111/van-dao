"""Xuất ảnh hướng dẫn vẽ nền tay (hướng 2) cho từng mảnh lưới L.paint.
Cần server: (cd repo && python3 -m http.server 8123 &)  rồi:  python3 tools/export_paint_guides.py [thư_mục_ra]
Mỗi mảnh gp_c<c>_r<r>: ảnh 1536x1024 = nền code hiện tại (đường, quảng trường, thềm, bậc, nước) +
khung đỏ = chỗ công trình đứng (sprite sẽ phủ lên, chỉ cần nền đá/hiên thấp dưới chân), chấm xanh = gốc cây,
đường đứt trắng = ô lưới chính (ngoài nó là lề chồng 90/60 px sẽ mờ dần).
"""
import sys, os, base64
sys.path.insert(0, os.path.dirname(__file__))
import test_suite as T
from playwright.sync_api import sync_playwright
out = sys.argv[1] if len(sys.argv) > 1 else 'ops/specs/img/paint_guides'
os.makedirs(out, exist_ok=True)
JS = r"""(arg)=>{
 const L=townLayout(),P=L.paint,c=arg[0],r=arg[1],R=townPaintRect(P,c,r),IW=P.img_w,IH=P.img_h,k=IW/R.w;
 const cv=document.createElement('canvas');cv.width=IW;cv.height=IH;const x=cv.getContext('2d');
 x.fillStyle='#2b3a22';x.fillRect(0,0,IW,IH);x.save();x.scale(k,k);x.translate(-R.x,-R.y);
 const t0x=Math.floor(Math.max(0,R.x)/TOWN_TILE),t1x=Math.floor((R.x+R.w)/TOWN_TILE),t0y=Math.floor(Math.max(0,R.y)/TOWN_TILE),t1y=Math.floor((R.y+R.h)/TOWN_TILE);
 for(let ty=t0y;ty<=t1y;ty++)for(let tx=t0x;tx<=t1x;tx++){if(tx*TOWN_TILE>=L.w||ty*TOWN_TILE>=L.h)continue;x.drawImage(townGroundTile(tx,ty),tx*TOWN_TILE,ty*TOWN_TILE);}
 if(R.x<0){x.fillStyle='rgba(20,30,15,.85)';x.fillRect(R.x,R.y,-R.x,R.h);}
 if(R.x+R.w>L.w){x.fillStyle='rgba(20,30,15,.85)';x.fillRect(L.w,R.y,R.x+R.w-L.w,R.h);}
 x.lineWidth=4/k;x.font=(22/k)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';
 for(const o of L.objects){
  const a=o.asset||'';if(o.back||a.indexOf('bg_cliff')===0)continue;
  if(a.indexOf('t_')===0||a.indexOf('p_bush')===0){x.fillStyle='rgba(40,200,60,.85)';x.beginPath();x.arc(o.x,o.y-6,a.indexOf('t_bamboo')===0?8/k:14/k,0,Math.PI*2);x.fill();continue;}
  const dw=o._dw||o.w,dh=o._dh||o.h;
  if(a.indexOf('b_')===0||a.indexOf('s_')===0){
   x.strokeStyle='rgba(255,60,60,.95)';x.setLineDash([12/k,8/k]);x.strokeRect(o.x-dw/2,o.y-dh,dw,dh);x.setLineDash([]);
   const f=o.foot&&o.foot.w?o.foot:null;if(f){x.fillStyle='rgba(255,60,60,.35)';x.fillRect(o.x+f.x,o.y+f.y,f.w,f.h);}
   x.fillStyle='#fff';x.strokeStyle='#000';x.lineWidth=5/k;const nm=a.replace(/^b_|^s_/,'');x.strokeText(nm,o.x,o.y-dh/2);x.fillText(nm,o.x,o.y-dh/2);x.lineWidth=4/k;
  }else{x.fillStyle='rgba(255,200,40,.9)';x.fillRect(o.x-6/k,o.y-6/k,12/k,12/k);}
 }
 x.restore();
 x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=3;x.setLineDash([16,10]);x.strokeRect(P.pad_x*k,P.pad_y*k,P.cw*k,P.ch*k);x.setLineDash([]);
 x.fillStyle='rgba(0,0,0,.6)';x.fillRect(8,8,260,40);x.fillStyle='#fff';x.font='bold 26px sans-serif';x.textAlign='left';x.fillText('gp_c'+c+'_r'+r,18,36);
 return cv.toDataURL('image/jpeg',0.86);
}"""
with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True, args=["--no-sandbox"]); pg = b.new_page(viewport={"width": 1280, "height": 720})
    s = T.Suite(pg); s.current = 'x'
    s.goto_menu(); s.go_to_create(); s.enter_world(0); pg.wait_for_timeout(2500)
    pg.evaluate("()=>{const L=townLayout();for(const o of L.objects)townImg(o.asset);for(const t of ['grass_a','grass_b','stone','dirt','sand','water','soil'])townImg('tile_'+t);}")
    pg.wait_for_timeout(3500)
    pg.evaluate("()=>{townGroundCache={};const L=townLayout();for(const o of L.objects){const im=townImg(o.fallback&&!townImg(o.asset)?o.fallback:o.asset);if(im&&im.ready){const iw=im.img.naturalWidth,ih=im.img.naturalHeight,kk=Math.max(o.w/iw,o.h/ih);o._dw=iw*kk;o._dh=ih*kk;}}}")
    P = pg.evaluate("()=>townLayout().paint")
    for r in range(P['rows']):
        for c in range(P['cols']):
            d = pg.evaluate(JS, [c, r])
            open(f"{out}/guide_gp_c{c}_r{r}.jpg", 'wb').write(base64.b64decode(d.split(',')[1]))
    print('xong', P['cols'] * P['rows'], 'ảnh ->', out)
    b.close()
