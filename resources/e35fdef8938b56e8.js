document.querySelectorAll('.subject-county-select').forEach(select=>{
  select.disabled=false;
  const card=select.closest('.subject-year-card');
  function chooseCounty(){card.querySelectorAll('[data-subject-county]').forEach(
    panel=>panel.hidden=panel.dataset.subjectCounty!==select.value);}
  select.addEventListener('change',chooseCounty);chooseCounty();
});
const root=document.documentElement,theme=document.getElementById("theme");
function setTheme(dark){root.dataset.theme=dark?"dark":"light";theme.textContent=dark?"☀️ Mod luminos":"🌙 Mod întunecat";}
let saved;try{saved=localStorage.getItem("bac-theme")}catch(e){}setTheme(saved?saved==="dark":matchMedia("(prefers-color-scheme: dark)").matches);
theme.addEventListener("click",()=>{const dark=root.dataset.theme!=="dark";setTheme(dark);try{localStorage.setItem("bac-theme",dark?"dark":"light")}catch(e){}});
