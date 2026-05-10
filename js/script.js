
document.addEventListener('DOMContentLoaded',()=>{
  const $=(s,ctx=document)=>ctx.querySelector(s); const $$=(s,ctx=document)=>Array.from(ctx.querySelectorAll(s));
  // menu + lien actif
  const navToggle=$('#navToggle'), navLinks=$('#navLinks');
  if(navToggle){navToggle.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');navToggle.setAttribute('aria-expanded',open);});}
  $$('.nav-links a').forEach(a=>{if(location.pathname.endsWith(a.getAttribute('href')))a.classList.add('active')});

  // thème clair/sombre avec sauvegarde
  const themeBtn=$('#themeBtn');
  if(localStorage.getItem('theme')==='dark'){document.body.classList.add('dark'); if(themeBtn) themeBtn.textContent='☀';}
  themeBtn?.addEventListener('click',()=>{document.body.classList.toggle('dark'); const dark=document.body.classList.contains('dark'); localStorage.setItem('theme',dark?'dark':'light'); themeBtn.textContent=dark?'☀':'☾';});

  // animation au scroll
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.14});
  $$('.reveal').forEach(el=>obs.observe(el));

  // carrousel automatique + manuel + pause souris
  const slider=$('[data-slider]');
  if(slider){let i=0, timer; const slides=$$('.slide',slider), dots=$('.dots',slider);
    slides.forEach((_,idx)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Aller à l’image '+(idx+1));b.addEventListener('click',()=>show(idx));dots.appendChild(b)});
    const dotBtns=$$('button',dots);
    function show(n){slides[i].classList.remove('active'); dotBtns[i].classList.remove('active'); i=(n+slides.length)%slides.length; slides[i].classList.add('active'); dotBtns[i].classList.add('active');}
    function play(){timer=setInterval(()=>show(i+1),3500)}; function stop(){clearInterval(timer)}
    $('.next',slider).addEventListener('click',()=>show(i+1)); $('.prev',slider).addEventListener('click',()=>show(i-1));
    slider.addEventListener('mouseenter',stop); slider.addEventListener('mouseleave',play); show(0); play();
  }

  // compteurs animés
  const counters=$$('.counter'); let countersDone=false;
  if(counters.length){new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!countersDone){countersDone=true;counters.forEach(c=>{let val=0,target=+c.dataset.target,step=Math.max(1,Math.ceil(target/80)); const t=setInterval(()=>{val+=step;if(val>=target){val=target;clearInterval(t)} c.textContent=val+(target===94?'':'');},18);});}},{threshold:.4}).observe(counters[0]);}

  // pages formations : recherche + filtre + cartes dépliables
  const search=$('#formationSearch'), niveau=$('#niveauFilter'), empty=$('#emptyFormations');
  function filterFormations(){const q=(search?.value||'').toLowerCase(), niv=niveau?.value||'all'; let shown=0; $$('.formation-card').forEach(card=>{const text=(card.textContent+' '+card.dataset.keywords).toLowerCase(); const okText=text.includes(q), okNiv=niv==='all'||card.dataset.niveau===niv; card.classList.toggle('hide',!(okText&&okNiv)); if(okText&&okNiv)shown++;}); if(empty)empty.style.display=shown?'none':'block'}
  search?.addEventListener('input',filterFormations); niveau?.addEventListener('change',filterFormations);
  $$('.more-btn').forEach(btn=>btn.addEventListener('click',()=>{const c=btn.closest('.formation-card'); c.classList.toggle('open'); btn.textContent=c.classList.contains('open')?'Masquer le détail':'Voir le détail';}));


  // tableau des permanences : recherche + filtre + mise en avant
  const permSearch=$('#permanenceSearch'), jourFilter=$('#jourFilter'), emptyPerm=$('#emptyPermanences'), nextPerm=$('#nextPermanence');
  const jours=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  function filterPermanences(){
    const q=(permSearch?.value||'').toLowerCase();
    const jour=jourFilter?.value||'all';
    let shown=0;
    $$('.permanence-table tbody tr').forEach(row=>{
      const text=(row.textContent+' '+row.dataset.keywords).toLowerCase();
      const okText=text.includes(q);
      const okJour=jour==='all'||row.dataset.jour===jour;
      row.classList.toggle('hide',!(okText&&okJour));
      if(okText&&okJour) shown++;
    });
    if(emptyPerm) emptyPerm.style.display=shown?'none':'block';
  }
  function highlightNextPermanence(){
    const today=jours[new Date().getDay()];
    const rows=$$('.permanence-table tbody tr');
    let target=rows.find(r=>r.dataset.jour===today) || rows[0];
    rows.forEach(r=>r.classList.remove('next-session'));
    if(target){
      target.classList.add('next-session');
      const cells=$$('td',target).map(td=>td.textContent);
      if(nextPerm) nextPerm.textContent='Séance mise en avant : '+cells[0]+' de '+cells[1]+' en '+cells[2]+' avec '+cells[3]+'.';
    }
  }
  permSearch?.addEventListener('input',filterPermanences);
  jourFilter?.addEventListener('change',filterPermanences);
  if($('.permanence-table')){highlightNextPermanence();filterPermanences();}


  // onglets équipe
  $$('.tab').forEach(tab=>tab.addEventListener('click',()=>{$$('.tab').forEach(t=>t.classList.remove('active')); $$('.tab-panel').forEach(p=>p.classList.remove('active')); tab.classList.add('active'); $('#'+tab.dataset.tab)?.classList.add('active');}));
  $$('.expertise-grid button').forEach(btn=>btn.addEventListener('click',()=>{$('#expertiseInfo').textContent=btn.dataset.info;}));

  // filtres projets
  $$('.filter').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active'); const f=btn.dataset.filter; $$('.project').forEach(p=>p.classList.toggle('hide',f!=='all'&&p.dataset.cat!==f));}));
  const quotes=['“Les projets m’ont aidé à mieux comprendre le métier de développeur.”','“L’alternance permet de progresser vite en entreprise.”','“Les clubs tech donnent envie de tester de nouvelles idées.”']; let qi=0; const tq=$('#testimonial'); if(tq)setInterval(()=>{qi=(qi+1)%quotes.length;tq.style.opacity=.2;setTimeout(()=>{tq.textContent=quotes[qi];tq.style.opacity=1},200)},4200);

  // métiers avec range
  const jobs=[['DevOps','Automatisation, cloud, déploiement continu.'],['Data Scientist','Analyse de données, modèles et visualisation.'],['Full-stack','Interfaces web, API, bases de données.'],['Scrum Master','Organisation agile et suivi de projet.']];
  $('#jobRange')?.addEventListener('input',e=>{const j=jobs[e.target.value]; $('#jobLabel').textContent=j[0]; $('#jobText').textContent=j[1];});

  // accordéon contact
  $$('.accordion button').forEach(btn=>btn.addEventListener('click',()=>btn.nextElementSibling.classList.toggle('open')));

  // validation formulaire avec messages simples
  const form=$('#contactForm'), status=$('#formStatus');
  function checkField(field){field.classList.remove('error'); if(!field.checkValidity()){field.classList.add('error'); return false} return true}
  form?.addEventListener('input',()=>{const ok=['nom','email','message'].every(id=>checkField($('#'+id))); status.textContent=ok?'Le formulaire est prêt à être envoyé.':'Certains champs doivent être corrigés.';});
  form?.addEventListener('submit',e=>{const ok=['nom','email','message'].every(id=>checkField($('#'+id))); if(!ok){e.preventDefault(); status.textContent='Merci de vérifier les champs en rouge.';}});

  // bouton retour en haut
  const back=$('#backTop'); window.addEventListener('scroll',()=>back?.classList.toggle('visible',scrollY>450)); back?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
});
