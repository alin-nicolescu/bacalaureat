const distributionColors=["#2563eb","#06b6d4","#10b981","#f59e0b","#f43f5e","#7c3aed","#be185d","#854d0e","#64748b","#84cc16"];
const distributionObserver=typeof IntersectionObserver==="undefined"?null:new IntersectionObserver(entries=>{
  entries.forEach(({target,isIntersecting})=>{if(isIntersecting){distributionObserver.unobserve(target);target.drawDistribution();}});
},{rootMargin:"250px"});
function scheduleDistribution(chart,draw){
  chart.drawDistribution=draw;
  if(distributionObserver){distributionObserver.unobserve(chart);distributionObserver.observe(chart);}else draw();
}
function distributionChart(values,mode){
  const chart=document.createElement("div");
  const format=value=>Number(value).toLocaleString("ro-RO",{minimumFractionDigits:2,maximumFractionDigits:2});
  if(mode==="bar"){
    chart.className="bars";
    values.forEach(item=>{
      const row=document.createElement("div"),label=document.createElement("span"),track=document.createElement("div"),fill=document.createElement("div"),value=document.createElement("strong");
      row.className="bar-row";label.textContent=item.label;track.className="bar-track";fill.className="bar-fill";
      fill.style.width=`${item.value}%`;fill.style.background=item.color;value.textContent=`${format(item.value)}%`;
      track.append(fill);row.append(label,track,value);chart.append(row);
    });
    return chart;
  }
  chart.className="pie-layout";
  const disc=document.createElement("div"),legend=document.createElement("div");
  disc.className="pie-disc";legend.className="legend";
  let cursor=0;const stops=[],positive=values.filter(item=>item.value>0);
  positive.forEach((item,index)=>{
    const end=index===positive.length-1?100:cursor+item.value;
    stops.push(`${item.color} ${cursor}% ${end}%`);cursor=end;
  });
  values.forEach(item=>{
    const row=document.createElement("div"),swatch=document.createElement("span"),label=document.createElement("span"),value=document.createElement("strong");
    row.className="legend-row";swatch.className="swatch";swatch.style.background=item.color;
    label.textContent=item.label;value.textContent=`${format(item.value)}%`;
    row.append(swatch,label,value);legend.append(row);
  });
  disc.style.background=stops.length?`conic-gradient(${stops.join(",")})`:`color-mix(in srgb,var(--muted) 15%,transparent)`;
  disc.setAttribute("role","img");disc.setAttribute("aria-label",values.map(item=>`${item.label}: ${format(item.value)}%`).join(", "));
  chart.append(disc,legend);return chart;
}
