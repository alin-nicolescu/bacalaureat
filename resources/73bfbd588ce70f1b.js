const $=id=>document.getElementById(id), filters=["search","year","sort-pass","sort-secondary"];
if($("county"))filters.push("county");
const years=[...new Set(data.map(x=>x.year))].sort((a,b)=>b-a);
const counties=[...new Map(data.map(x=>[x.county,x.countyName])).entries()].sort((a,b)=>a[1].localeCompare(b[1],"ro"));
$("chart-mode").options[0].textContent="Circulară";
function options(el,items,all){ el.replaceChildren(); if(all) el.add(new Option(all,"")); items.forEach(([v,t])=>el.add(new Option(t,v))); }
options($("year"),years.map(x=>[x,x]));
const currentYear=new Date().getFullYear(); if(years.includes(currentYear))$("year").value=String(currentYear);
if($("county"))options($("county"),counties,"Toate județele");
const fmt=n=>n==null?"—":Number(n).toLocaleString("ro-RO",{minimumFractionDigits:2,maximumFractionDigits:2});
const percentage=(count,total)=>total?100*count/total:0;
const grade9Count=x=>(Number(x.n9)||0)+(Number(x.n10)||0);
const grade9Rate=x=>percentage(grade9Count(x),["n6","n7","n8","n9","n10"].reduce((sum,key)=>sum+(Number(x[key])||0),0));
function stat(label,value){const d=document.createElement("div"),s=document.createElement("strong"),separator=document.createElement("span");d.className="stat";s.textContent=value;separator.className="text-separator";separator.setAttribute("aria-hidden","true");separator.textContent=" — ";d.append(s,separator,label);return d;}
const bucketInfo=[["6,00–6,99","n6","#2563eb"],["7,00–7,99","n7","#06b6d4"],["8,00–8,99","n8","#10b981"],["9,00–9,99","n9","#f59e0b"],["10","n10","#f43f5e"]];
function bucketChart(x){const chart=document.createElement("div"),title=document.createElement("p");chart.className="chart";title.className="chart-title";title.textContent="Distribuția mediilor (% din total reușiți)";chart.append(title);
  const total=bucketInfo.reduce((sum,[,key])=>sum+(Number(x[key])||0),0);
  const values=bucketInfo.map(([label,key,color])=>({label,color,value:percentage(Number(x[key])||0,total)}));
  chart.append(distributionChart(values,$("chart-mode").value));return chart;}
function card(x,position,total){const a=document.createElement("article");a.className="card";const badge=document.createElement("span");badge.className="badge";badge.textContent=`${x.countyName} · ${x.year} · S${x.session}${previousCohort?" · promoții anterioare":""}`;
  const h=document.createElement("h2");h.textContent=x.name;const p=document.createElement("p");p.className="place";p.textContent=x.town;
  const rate=document.createElement("div");rate.className="rate";rate.textContent=`${fmt(x.passRate)}% `;const sm=document.createElement("small");sm.textContent="promovabilitate";rate.append(sm);
  const stats=document.createElement("div"),separator=document.createElement("div");stats.className="stats";separator.className="bucket-separator";stats.append(stat("poziție în selecție",`${position}/${total}`),stat("reușiți",`${x.passed}/${x.candidates}`),stat("media min.",fmt(x.minGrade)),stat("media max.",fmt(x.maxGrade)),stat("medii ≥ 9",`${grade9Count(x)} (${fmt(grade9Rate(x))}%)`));if(Number(x.n10)>0)stats.append(stat("note de 10",x.n10));stats.append(separator,bucketChart(x));a.append(badge,h,p,rate,stats);return a;}
function render(){const q=$("search").value.trim().toLocaleLowerCase("ro"),year=$("year").value,session=fixedSession,county=$("county")?.value||"";
  const shown=data.filter(x=>(!q||x.name.toLocaleLowerCase("ro").includes(q))&&(!year||x.year==year)&&(!session||x.session==session)&&(!county||x.county===county));
  const passSort=$("sort-pass").value,secondarySort=$("sort-secondary").value;
  shown.sort((a,b)=>(passSort?(Number(a.passRate)-Number(b.passRate))*(passSort==="asc"?1:-1):0)||(secondarySort==="min"?(Number(b.minGrade??-Infinity)-Number(a.minGrade??-Infinity)):0)||(secondarySort==="max"?(Number(b.maxGrade??-Infinity)-Number(a.maxGrade??-Infinity)):0)||(secondarySort==="grade9"?(grade9Rate(b)-grade9Rate(a)):0)||((passSort||secondarySort)?a.name.localeCompare(b.name,"ro"):0));
  const countyName=reportCounty||(county?$("county").selectedOptions[0].textContent:"toate județele");
  const activeFilters=[countyName];if(q)activeFilters.push(`nume: „${$("search").value.trim()}”`);else activeFilters.push("fără filtrare după nume");
  $("active-filters").textContent=activeFilters.join(" · ");
  const activeSorts=[];if(passSort)activeSorts.push(`promovabilitate ${passSort==="asc"?"crescător":"descrescător"}`);if(secondarySort)activeSorts.push(`${$("sort-secondary").selectedOptions[0].textContent.replace(" ↓","")} descrescător`);$("active-sorts").textContent=activeSorts.length?activeSorts.join(" · "):"niciun criteriu activ";
  $("count").textContent=`${shown.length} ${shown.length===1?"rezultat":"rezultate"}`; $("context").textContent=data.length?`${data.length} înregistrări în raport`:"Raportul nu conține date";
  $("cards").replaceChildren(...(shown.length?shown.map((item,index)=>card(item,index+1,shown.length)):[Object.assign(document.createElement("div"),{className:"empty",textContent:"Nicio unitate nu corespunde filtrelor selectate."})]));}
filters.forEach(id=>$(id).addEventListener(id==="search"?"input":"change",render));
$("chart-mode").addEventListener("change",render);
const root=document.documentElement,theme=$("theme"); function setTheme(dark){root.dataset.theme=dark?"dark":"light";theme.textContent=dark?"☀️ Mod luminos":"🌙 Mod întunecat";}
let saved;try{saved=localStorage.getItem("bac-theme")}catch(e){} setTheme(saved?saved==="dark":matchMedia("(prefers-color-scheme: dark)").matches);
theme.addEventListener("click",()=>{const dark=root.dataset.theme!=="dark";setTheme(dark);try{localStorage.setItem("bac-theme",dark?"dark":"light")}catch(e){}});render();
