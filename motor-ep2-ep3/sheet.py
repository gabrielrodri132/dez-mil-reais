import sys
from PIL import Image
ts=sys.argv[2].split(); out=sys.argv[1]
ims=[Image.open("snaps/t_%s.jpg"%t).resize((270,480)) for t in ts]
cols=6; rows=(len(ims)+cols-1)//cols
sheet=Image.new('RGB',(270*cols,480*rows))
for i,im in enumerate(ims): sheet.paste(im,((i%cols)*270,(i//cols)*480))
sheet.save(out,quality=85)
