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
        const colors=['#64748b','#8b5cf6','#a855f7','#ec4899','#ef4444','#2563eb','#06b6d4','#10b981','#f59e0b','#f43f5e'];
        const subjectCharts=Array.from(document.querySelectorAll('.subject')).map(subject=>{
          const rows=Array.from(subject.querySelectorAll('tbody tr'));
          const counts=rows.map(row=>Number(row.querySelector('td').textContent));
          const total=counts.reduce((sum,count)=>sum+count,0);
          const values=rows.map((row,index)=>({label:row.querySelector('th').textContent,
            color:colors[index%colors.length],value:total?100*counts[index]/total:0}));
          const chart=document.createElement('div');chart.className='subject-chart';
          subject.append(chart);return {chart,values};
        });
        function renderSubjectCharts(){subjectCharts.forEach(({chart,values})=>
          chart.replaceChildren(distributionChart(values,chartMode.value)));}
        chartMode.addEventListener('change',renderSubjectCharts);
        renderSubjectCharts();
        chartMode.closest('label').hidden=false;
        document.documentElement.classList.add('charts-ready');
      }
