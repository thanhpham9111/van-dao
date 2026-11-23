import numpy as np, os
from PIL import Image
from scipy import ndimage
src='/tmp/b8/assets/map'; dst='/home/claude/van-dao/assets'
def load(n): return np.asarray(Image.open(f'{src}/{n}.png').convert('RGB')).astype(np.float32)
def gmask(a):
    r,g,b=a[...,0],a[...,1],a[...,2]
    return ((g>=r*0.85)&(b<g*0.72)&(g>40)).astype(np.float32)
lum=lambda a: a[...,0]*0.3+a[...,1]*0.59+a[...,2]*0.11
std=load('gp_c2_r1'); m=gmask(std)
tc=np.array([(std[...,c]*m).sum()/m.sum() for c in range(3)]); tL=(lum(std)*m).sum()/m.sum()
for f in sorted(os.listdir(src)):
    n=f[:-4]; a=load(n); m=gmask(a); sig=110
    w=ndimage.gaussian_filter(m,sig)
    Lb=ndimage.gaussian_filter(lum(a)*m,sig)/(w+1e-4)
    k=np.clip((w-0.03)/0.12,0,1)  # chỉ sửa nơi đủ cỏ quanh đó
    corr=np.clip((tL/np.maximum(Lb,1))**0.8,0.7,1.35); corr=1+(corr-1)*k
    out=a*corr[...,None]
    mc=np.array([(a[...,c]*m).sum()/max(m.sum(),1) for c in range(3)])
    gains=np.clip(tc/np.maximum(mc,1),0.9,1.1) if m.sum()>1000 else np.ones(3)
    out=out*gains
    sm=ndimage.gaussian_filter(m,2)[...,None]
    out=out*(1-sm)+out*np.array([0.95,1.0,1.12])*sm
    Image.fromarray(np.clip(out,0,255).astype(np.uint8)).save(f'{dst}/{n}.webp','WEBP',quality=84,method=4)
print('ok')
