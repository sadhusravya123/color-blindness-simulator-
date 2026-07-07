const upload=document.getElementById("imageUpload");
const o=document.getElementById("originalCanvas");
const f=document.getElementById("filteredCanvas");
const octx=o.getContext("2d");
const fctx=f.getContext("2d");
const buttons=document.querySelectorAll(".controls button");
const about=document.getElementById("aboutText");
const res=document.getElementById("resolution");
const size=document.getElementById("size");
const drop=document.getElementById("dropArea");

let img=new Image();

const info={
normal:"Original image without simulation.",
protanopia:"Red-blind vision.",
deuteranopia:"Green-blind vision.",
tritanopia:"Blue-blind vision.",
achromatopsia:"Complete color blindness."
};

function load(file){
if(!file)return;
size.textContent="File Size : "+(file.size/1024).toFixed(1)+" KB";
let reader=new FileReader();
reader.onload=e=>img.src=e.target.result;
reader.readAsDataURL(file);
}

upload.onchange=e=>load(e.target.files[0]);

drop.ondragover=e=>{
e.preventDefault();
drop.classList.add("drag");
};

drop.ondragleave=()=>{
drop.classList.remove("drag");
};

drop.ondrop=e=>{
e.preventDefault();
drop.classList.remove("drag");
load(e.dataTransfer.files[0]);
};

img.onload=()=>{
o.width=f.width=img.width;
o.height=f.height=img.height;
octx.drawImage(img,0,0);
fctx.drawImage(img,0,0);
res.textContent=`Resolution : ${img.width} × ${img.height}`;
apply("normal");
};

buttons.forEach(btn=>{
btn.onclick=()=>{
buttons.forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
apply(btn.dataset.filter);
};
});

function apply(type){

fctx.drawImage(img,0,0);

let image=fctx.getImageData(0,0,f.width,f.height);
let d=image.data;

for(let i=0;i<d.length;i+=4){

let r=d[i],g=d[i+1],b=d[i+2];

if(type=="protanopia"){
d[i]=0.56*r+0.44*g;
d[i+1]=0.56*r+0.44*g;
}

else if(type=="deuteranopia"){
d[i]=0.63*r+0.37*g;
d[i+1]=0.70*r+0.30*g;
}

else if(type=="tritanopia"){
d[i+1]=0.43*g+0.57*b;
d[i+2]=0.47*g+0.53*b;
}

else if(type=="achromatopsia"){
let gray=.299*r+.587*g+.114*b;
d[i]=d[i+1]=d[i+2]=gray;
}

}

fctx.putImageData(image,0,0);
about.textContent=info[type];

}

document.getElementById("download").onclick=()=>{
let a=document.createElement("a");
a.download="simulation.png";
a.href=f.toDataURL();
a.click();
};

document.getElementById("reset").onclick=()=>{
upload.value="";
octx.clearRect(0,0,o.width,o.height);
fctx.clearRect(0,0,f.width,f.height);
res.textContent="Resolution : -";
size.textContent="File Size : -";
about.textContent="Normal image.";
};

document.getElementById("theme").onclick=()=>{
document.body.classList.toggle("dark");
};
