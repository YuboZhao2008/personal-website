import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';
import { profile, navigation } from '../src/data/profile.ts';
import { publicHref, projectEvidence } from '../src/data/links.ts';

const require = createRequire(import.meta.url);
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:3113';
const executablePath = process.env.BROWSER_PATH || chromium.executablePath();
const widths = process.env.BROWSER_VIEWPORTS ? process.env.BROWSER_VIEWPORTS.split(',').map(Number) : [320,360,390,430,768,870,1024,1280,1440,1920];
const expectedOrder = ['warcraft-rl','brain-tumor','jarvis','roomread','gesture','future-sim'];
const report = { viewports:[], checks:[], errors:[], requestFailures:[], accessibility:[], performance:{} };
fs.mkdirSync('test-results',{recursive:true});
assert.deepEqual(profile.projects.map(p=>p.id), expectedOrder, 'User-specified project order');
for (const bad of [null,'','#','javascript:alert(1)','file:///resume.pdf','C:/private/resume.pdf','https://user:pass@example.test','not-a-url']) {
  assert.equal(publicHref(bad),null); assert.equal(publicHref(bad,true),null);
}
assert.equal(publicHref('/resume.pdf',true),'/resume.pdf');
assert.equal(publicHref('//example.test/resume.pdf',true),null);
assert.deepEqual(projectEvidence({repositoryUrl:'#',demoUrl:'javascript:alert(1)'}),[]);

function observe(page, noJS=false) {
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error') report.errors.push(m.text());});
  page.on('requestfailed',r=>{if(!(noJS && r.resourceType()==='script' && r.failure()?.errorText==='csp')) report.requestFailures.push({url:r.url(),reason:r.failure()?.errorText});});
}
async function settled(page) { await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))); }
async function overflow(page, label) {
  const result = await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
    elements:[...document.querySelectorAll('main *')].filter(e=>{
      if(e instanceof SVGElement || !e.checkVisibility())return false;
      const r=e.getBoundingClientRect();return r.width>0&&(r.left < -1 || r.right > document.documentElement.clientWidth+1);
    }).map(e=>({tag:e.tagName,class:e.className})).slice(0,8)}));
  assert(result.scroll<=result.width+1,`${label}: document overflow ${JSON.stringify(result)}`);
  assert.deepEqual(result.elements,[],`${label}: element overflow`);
}
async function openRecords(page) { await page.locator('.gallery-record').evaluateAll(es=>es.forEach(e=>e.open=true)); }
async function axe(page,label) {
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const violations=await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
  report.accessibility.push({label,violations});
  assert.deepEqual(violations,[],`${label}: accessibility failures`);
}
async function menu(page) {
  const toggle=page.getByRole('button',{name:'Open navigation'});
  await toggle.focus(); await page.keyboard.press('Enter');
  const dialog=page.getByRole('dialog',{name:'Site index'});
  await dialog.waitFor({state:'visible'});
  assert(await page.locator(':focus').evaluate(e=>!!e.closest('dialog')),'Menu traps focus');
  for(let i=0;i<navigation.length+3;i++) {await page.keyboard.press('Tab');assert(await page.locator(':focus').evaluate(e=>!!e.closest('dialog')),'Tab remains modal');}
  await page.keyboard.press('Escape');
  await dialog.waitFor({state:'hidden'});
  assert(await toggle.evaluate(e=>e===document.activeElement),'Escape returns focus');
  await toggle.click();
  await dialog.getByRole('link',{name:'Skills',exact:true}).click();
  assert.equal(new URL(page.url()).hash,'#skills');
  assert(await page.locator('#skills').evaluate(e=>e===document.activeElement),'Section receives focus');
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'','Body scroll restored');
}

const browser=await chromium.launch({executablePath,headless:true});
try {
  for(const width of widths) {
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    observe(page);
    assert.equal((await page.goto(baseURL,{waitUntil:'networkidle'})).status(),200);
    await settled(page);
    assert.equal(await page.locator('h1').count(),1);
    assert.deepEqual(await page.locator('.gallery-record').evaluateAll(es=>es.map(e=>e.id.replace('project-',''))),expectedOrder);
    assert.deepEqual(await page.locator('.exhibition-selector > span:nth-child(2)').allTextContents(),profile.projects.map(p=>p.title));
    await overflow(page,`${width} initial`);
    for(let i=0;i<6;i++) {
      await page.locator('.exhibition-selector').nth(i).click();
      assert.equal(await page.locator('.exhibition-project-heading h3').textContent(),profile.projects[i].title);
      assert.equal(await page.locator('.exhibition-selector[aria-pressed=true]').count(),1);
      assert(await page.locator('.exhibition-figure svg').isVisible());
      await overflow(page,`${width} project ${i}`);
    }
    await page.getByRole('button',{name:'Next project',exact:true}).click();
    assert.equal(await page.locator('.exhibition-project-heading h3').textContent(),profile.projects[0].title,'Next wraps');
    await page.getByRole('button',{name:'Previous project',exact:true}).focus(); await page.keyboard.press('Space');
    assert.equal(await page.locator('.exhibition-project-heading h3').textContent(),profile.projects[5].title,'Keyboard previous wraps');
    await page.locator('.exhibition-selector').first().click();
    await page.locator('.exhibition-copy > a').click();
    assert.equal(new URL(page.url()).hash,'#project-warcraft-rl');
    assert(await page.locator('#project-warcraft-rl').evaluate(e=>e.open),'Explore opens notes');
    await openRecords(page);
    await overflow(page,`${width} expanded`);
    for (const diagram of await page.locator('.project-visual svg,.world-grid').all()) {
      assert(await diagram.evaluate(e=>{const r=e.getBoundingClientRect(),p=e.closest('.project-visual').getBoundingClientRect();return !r.width||(r.left>=p.left-1&&r.right<=p.right+1);}),`${width}: diagram inside frame`);
    }
    const body=await page.locator('body').innerText();
    assert(!body.includes('\uFFFD'),'No replacement characters');
    assert(body.includes('not presented as a clinically validated diagnostic tool'));
    assert(body.includes('Learned policies are in development'));
    assert(body.includes('team result'));
    for(const title of profile.projects.map(p=>p.title))assert(body.includes(title));
    if([320,768,1440].includes(width)) await axe(page,`${width} all notes open`);
    await page.screenshot({path:`test-results/expanded-${width}.png`,fullPage:true});
    await page.locator('.gallery-record').evaluateAll(es=>es.forEach(e=>e.open=false));
    await menu(page);
    await page.evaluate(()=>scrollTo(0,0));
    await settled(page);
    assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0,'Reduced motion has no running animations');
    await page.screenshot({path:`test-results/hero-${width}.png`});
    await page.locator('#projects').screenshot({path:`test-results/projects-${width}.png`,style:'.site-header,.skip-link,nextjs-portal {visibility:hidden!important}'});
    if([390,1440].includes(width)){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`test-results/page-${width}.png`,fullPage:true});}
    report.viewports.push({width,height:900,expanded:true});
    await page.close();
  }
  report.checks.push('Requested order in data, selectors and notes; six selections; next/previous wrap; keyboard; expanded diagrams; modal focus/Escape/section navigation; reduced motion across widths');

  const page=await browser.newPage({viewport:{width:1440,height:900}});observe(page);
  await page.goto(baseURL,{waitUntil:'networkidle'});
  await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Skip to content');
  await page.keyboard.press('Enter');assert(await page.locator('#main').evaluate(e=>e===document.activeElement));
  const stages=page.locator('.loop-controls button');
  for(let i=0;i<3;i++){await stages.nth(i).focus();await page.keyboard.press('Space');assert.equal(await stages.nth(i).getAttribute('aria-pressed'),'true');}
  await page.getByRole('button',{name:'Pause ambient motion'}).click();
  assert.equal(await page.locator('html').getAttribute('data-motion'),'paused');
  await page.locator('.exhibition-selector').nth(2).click();
  assert.equal(await page.locator('.exhibition-figure').evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.getByRole('button',{name:'Resume ambient motion'}).click();
  await page.locator('.exhibition-selector').first().click();
  assert.notEqual(await page.locator('.exhibition-figure').evaluate(e=>getComputedStyle(e).animationName),'none');
  await openRecords(page);
  for(const name of ['Open hand','Closed hand','Pointing']) {const b=page.getByRole('button',{name,exact:true});await b.focus();await page.keyboard.press('Space');assert.equal(await b.getAttribute('aria-pressed'),'true');}
  await page.getByRole('button',{name:'Step state',exact:true}).click();
  assert((await page.locator('.simulation-visual .visual-topline').textContent()).includes('t = 1'));
  await page.getByRole('button',{name:'Reset world state'}).click();
  assert((await page.locator('.simulation-visual .visual-topline').textContent()).includes('t = 0'));
  const links=await page.locator('a[href]').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),target:e.target,rel:e.rel})));
  for(const l of links) {assert(!l.href.startsWith('javascript:'));if(l.target==='_blank'){assert(l.rel.includes('noopener'));assert(l.rel.includes('noreferrer'));}}
  for(const href of [profile.socials.github,profile.socials.linkedin,profile.socials.resume,`mailto:${profile.socials.email}`])assert(links.some(l=>l.href===href));
  for(const p of profile.projects)for(const evidence of projectEvidence(p))assert(links.some(l=>l.href===evidence.href));
  const resume=await page.request.get(baseURL+'/resume.pdf');assert.equal(resume.status(),200);assert(resume.headers()['content-type'].includes('pdf'));
  for(const route of ['/robots.txt','/sitemap.xml','/share-image'])assert.equal((await page.request.get(baseURL+route)).status(),200);
  report.checks.push('Skip link, study controls, pause/resume, gesture/simulation controls, preserved external links, resume PDF and SEO routes');

  for(const id of expectedOrder) {
    await page.goto(`${baseURL}/#project-${id}`,{waitUntil:'networkidle'});
    await page.waitForFunction(id=>document.getElementById(`project-${id}`).open,id);
    assert.equal(await page.locator('.exhibition-project-heading h3').textContent(),profile.projects.find(p=>p.id===id).title);
    const y=await page.locator(`#project-${id}`).evaluate(e=>e.getBoundingClientRect().top);
    assert(y>=0&&y<200,`Deep link ${id} aligned below header: ${y}`);
  }
  await page.goto(baseURL+'/#projects');await page.goto(baseURL+'/#contact');await page.goBack();assert.equal(new URL(page.url()).hash,'#projects');await page.goForward();assert.equal(new URL(page.url()).hash,'#contact');
  report.checks.push('All six project deep links and native Back/Forward');

  for(const [width,height] of [[870,540],[1024,600],[1920,1080],[740,360],[320,568]]) {
    await page.setViewportSize({width,height});await page.goto(baseURL,{waitUntil:'networkidle'});await openRecords(page);await overflow(page,`${width}x${height}`);report.viewports.push({width,height,expanded:true});
  }
  // CSS zoom plus a layout-viewport matrix exercises enlarged text and reflow.
  // It is not a claim about an actual device or browser UI zoom setting.
  await page.setViewportSize({width:1440,height:900});await page.goto(baseURL,{waitUntil:'networkidle'});
  for(const zoom of [1.25,1.5,2]) {await page.evaluate(z=>document.documentElement.style.zoom=String(z),zoom);await openRecords(page);await overflow(page,`CSS zoom ${zoom}`);report.viewports.push({width:1440,height:900,cssZoom:zoom});}
  await page.evaluate(()=>document.documentElement.style.zoom='');
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');await overflow(page,'200% root text');await page.evaluate(()=>document.documentElement.style.fontSize='');
  report.checks.push('Short screens, landscape, CSS zoom 125/150/200%, root text enlargement');
  await page.close();

  const touch=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:3});observe(touch);
  await touch.goto(baseURL,{waitUntil:'networkidle'});await touch.locator('.exhibition-selector').nth(1).tap();assert.equal(await touch.locator('.exhibition-selector').nth(1).getAttribute('aria-pressed'),'true');await overflow(touch,'touch DPR3');await touch.close();
  const noJS=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:false});observe(noJS,true);
  await noJS.goto(baseURL,{waitUntil:'networkidle'});
  assert(await noJS.getByRole('navigation',{name:'Main navigation'}).isVisible());
  for(const id of expectedOrder){await noJS.locator(`#project-${id} > summary`).click();assert(await noJS.locator(`#project-${id}`).evaluate(e=>e.open));}
  await overflow(noJS,'No JS expanded');assert(await noJS.locator('.loop-study').isVisible());await noJS.close();
  report.checks.push('Touch at DPR3; no-JS native navigation, diagram and all project disclosures');
  const perf=await browser.newPage({viewport:{width:1440,height:900}});observe(perf);
  await perf.goto(baseURL,{waitUntil:'networkidle'});
  await perf.locator('#projects').scrollIntoViewIfNeeded();
  await perf.locator('.exhibition-selector').nth(1).click();
  report.performance = await perf.evaluate(async()=>{
    const deltas=[];let previous=performance.now();
    await new Promise(resolve=>{const tick=now=>{deltas.push(now-previous);previous=now;if(deltas.length<90)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});
    const ordered=deltas.slice(1).sort((a,b)=>a-b);
    return {environment:'Headless Chromium, local host; not physical-device FPS',medianFrameMs:ordered[Math.floor(ordered.length/2)],p95FrameMs:ordered[Math.floor(ordered.length*.95)],scriptBytes:performance.getEntriesByType('resource').filter(e=>e.initiatorType==='script').reduce((s,e)=>s+e.transferSize,0),canvasCount:document.querySelectorAll('canvas').length};
  });
  const before=await perf.evaluate(()=>scrollY);await perf.mouse.wheel(0,450);await perf.waitForFunction(y=>scrollY>y+100,before);
  report.checks.push('Native wheel scroll advances immediately over project section; bounded frame sampling');await perf.close();
  assert.deepEqual(report.errors,[],'Browser console errors');
  assert.deepEqual(report.requestFailures,[],'Failed requests');
} finally { await browser.close();fs.writeFileSync('test-results/browser-report.json',JSON.stringify(report,null,2)); }
console.log(JSON.stringify(report,null,2));
