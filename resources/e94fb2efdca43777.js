const choice=document.getElementById('specialization');
      function filterSpecializations(){document.querySelectorAll('[data-panel]').forEach(
        panel=>panel.hidden=panel.dataset.panel!==(choice.dataset.value||choice.value));}
      if(choice){
        choice.addEventListener('change',filterSpecializations);
        choice.querySelectorAll('button[data-value]').forEach(button=>button.addEventListener('click',()=>{
          choice.dataset.value=button.dataset.value;
          choice.querySelector('.school-menu-heading').textContent=button.textContent;
          choice.querySelectorAll('button[data-value]').forEach(option=>
            option.setAttribute('aria-pressed',String(option===button)));
          filterSpecializations();choice.open=false;choice.querySelector('summary').focus();
        }));
        filterSpecializations();
      }
      const chartMode=document.getElementById('chart-mode');
      if(chartMode){
        const subjectCharts=Array.from(document.querySelectorAll('.subject')).map(subject=>{
          const rows=Array.from(subject.querySelectorAll('tbody tr'));
          const colors=rows.length===3?[distributionColors[0],distributionColors[2],distributionColors[3]]:
            rows.length===4?[distributionColors[0],distributionColors[2],distributionColors[3],distributionColors[4]]:distributionColors;
          const counts=rows.map(row=>Number(row.querySelector('td').textContent));
          const total=counts.reduce((sum,count)=>sum+count,0);
          const values=rows.map((row,index)=>({label:row.querySelector('th').textContent,
            color:colors[index%colors.length],value:total?100*counts[index]/total:0}));
          const chart=document.createElement('div');chart.className='subject-chart';
          subject.append(chart);return {chart,values};
        });
        function renderSubjectCharts(){subjectCharts.forEach(({chart,values})=>{
          const mode=chartMode.value;
          scheduleDistribution(chart,()=>chart.replaceChildren(distributionChart(values,mode)));
        });}
        chartMode.addEventListener('change',renderSubjectCharts);
        renderSubjectCharts();
        chartMode.closest('label').hidden=false;
        document.documentElement.classList.add('charts-ready');
      }
