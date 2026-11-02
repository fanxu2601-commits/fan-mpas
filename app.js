window.CONTENT_READY.then(() => {
  const profile = window.PROFILE;
  let language = 'en';
  const translated = value => typeof value === 'string' ? value : (value?.[language] || value?.zh || value?.en || '');
  const element = (tag, text, className) => { const node = document.createElement(tag); node.textContent = text; if(className) node.className = className; return node; };
  const safeUrl = value => { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; } catch { return null; } };
  function empty(target, zh, en, zhDetail, enDetail) { const node = element('div', '', 'empty'); node.append(element('strong', language === 'zh' ? zh : en), element('span', language === 'zh' ? zhDetail : enDetail)); target.append(node); }
  function render() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-zh]').forEach(node => node.textContent = node.dataset[language]);
    ['name','nameAlt','affiliation','intro','bio'].forEach(id => document.getElementById(id).textContent = translated(profile[id]));
    document.getElementById('bioDetail').textContent = translated(profile.bioDetail);
    document.querySelector('.draft').hidden = !profile.isDraft;
    document.getElementById('footerName').textContent = translated(profile.name);
    document.title = translated(profile.name) + (language === 'zh' ? ' · 科研个人主页' : ' · Academic Profile');
    const button = document.getElementById('language'); button.textContent = language === 'zh' ? 'EN ↗' : '中文 ↗'; button.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
    const links = document.getElementById('profileLinks'); links.replaceChildren();
    profile.links.forEach(item => { const url = safeUrl(item.url); if(url) { const a=element('a',item.label+' ↗'); a.href=url; a.target='_blank'; a.rel='noopener noreferrer'; links.append(a); } });
    const research = document.getElementById('researchList'); research.replaceChildren();
    if(!profile.research.length) empty(research,'研究方向待补充','Research interests to be added','将在这里展示核心科学问题、研究方法与研究项目。','Scientific questions, methods and research projects will appear here.');
    profile.research.forEach((item,i) => { const row=element('article','','research-item'); const body=element('div',''); body.append(element('h3',translated(item.title)),element('p',translated(item.description))); row.append(element('span',String(i+1).padStart(2,'0'),'number'),body); research.append(row); });
    const pubs = document.getElementById('publicationList'); pubs.replaceChildren();
    if(!profile.publications.length) empty(pubs,'论文列表待补充','Publications to be added','提供论文题目、作者、期刊及 DOI 后，即可展示完整成果。','Titles, authors, journals and DOI links will appear here.');
    [...profile.publications].sort((a,b)=>b.year-a.year).forEach(item => { const row=element('article','','publication'); row.append(element('span',String(item.year),'small-label'),element('h3',item.title),element('p',item.authors),element('p',item.venue)); const url=safeUrl(item.url); if(url){ const a=element('a',language==='zh'?'阅读论文 ↗':'Read article ↗'); a.href=url; a.target='_blank'; a.rel='noopener noreferrer'; row.append(a); } pubs.append(row); });
    const experience = document.getElementById('experienceList'); experience.replaceChildren();
    if(!profile.experience.length) empty(experience,'教育与工作经历待补充','Education & appointments to be added','学位、研究机构、任职经历及起止时间。','Degrees, institutions, appointments and dates.');
    profile.experience.forEach(item => { const row=element('article','','experience'); const body=element('div',''); body.append(element('h3',translated(item.title)),element('p',translated(item.institution))); row.append(element('time',item.period),body); experience.append(row); });
    const activities=document.getElementById('activityList'); activities.replaceChildren();
    profile.activities.forEach(item => { const row=element('article','','experience'); const body=element('div',''); body.append(element('h3',translated(item.title)),element('p',translated(item.institution))); row.append(element('time',item.period),body); activities.append(row); });
    document.getElementById('skills').textContent=profile.skills;
    const contact=document.getElementById('contactDetails'); contact.replaceChildren();
    if(profile.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) { const a=element('a',profile.email+' ↗'); a.href='mailto:'+profile.email; contact.append(a); } else contact.append(element('span',language==='zh'?'学术邮箱待补充':'Academic email to be added','empty'));
  }
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('language').addEventListener('click',()=>{language=language==='zh'?'en':'zh';render();});
  render();
});