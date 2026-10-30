import threading,http.server,socketserver,os,asyncio,json
from playwright.async_api import async_playwright
from pathlib import Path
os.chdir(Path(__file__).resolve().parents[1])
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=socketserver.TCPServer(('127.0.0.1',8776),Quiet)
threading.Thread(target=server.serve_forever,daemon=True).start()
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=await browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto('http://127.0.0.1:8776')
  assert await page.locator('.game-card').count()==7
  # Every new line must have an embedded clip plan; Android cannot rely on fallback.
  plans=await page.evaluate('Object.keys(window.AUDIO_CLIPS).filter(x=>x.includes("התינוק")||x.includes("לגורים")||x.includes("המשפחות")||x.includes("בחץ")).map(x=>[x,KidsAudio.plan(x)])')
  assert plans and all(x[1] for x in plans),plans
  await page.get_by_role('button',name='🐣 חיות והגורים שלהן').click()
  await page.screenshot(path='/tmp/families-intro.png')
  await page.get_by_role('button',name='מתחילים').click()
  await page.screenshot(path='/tmp/families-round-mobile.png')
  await page.wait_for_function('window.AUDIO_DEBUG.events.some(x=>x.startsWith("playing:f-"))')
  await page.wait_for_function('window.AUDIO_DEBUG.events.some(x=>x.startsWith("ended:f-"))',timeout=15000)
  audio=await page.evaluate('window.AUDIO_DEBUG')
  assert not audio['lastError'],audio
  # Test gentle retry, correct answer, no double scoring and all six rounds.
  for n in range(6):
   target=await page.locator('.family-parent-label').inner_text()
   id=await page.evaluate('ANIMAL_FAMILIES.find(x=>x.parent===document.querySelector(".family-parent-label").textContent).id')
   wrong=page.locator('.family-choice:not([data-animal="'+id+'"])').first
   await wrong.click()
   assert await wrong.is_disabled()
   await page.locator('.family-choice[data-animal="'+id+'"]').click()
   assert await page.locator('.family-progress .filled').count()==n+1
   if n==0:await page.screenshot(path='/tmp/families-match-mobile.png')
   await page.get_by_role('button',name='למשפחה הבאה').click()
  assert await page.locator('.family-collected').count()==6
  await page.screenshot(path='/tmp/families-finish-mobile.png')
  await page.get_by_role('button',name='עוד פעם',exact=True).click()
  await page.get_by_role('button',name='מתחילים').click()
  # Repeat audio works even in muted mode.
  await page.get_by_role('button',name='קול',exact=True).click()
  await page.get_by_role('button',name='שמעי את המשימה שוב').click(force=True)
  await page.wait_for_function('!KidsAudio.audioEl.paused')
  await page.get_by_role('button',name='בית',exact=True).click()
  for name in ['🎨 בונים עולם','🎈 בלונים','🧠 משחק זיכרון','🍎 חנות הפירות','🔤 אותיות','🔢 מספרים']:
   await page.get_by_role('button',name=name,exact=True).click()
   await page.get_by_role('button',name='בית',exact=True).click()
  # Narrow handset layout.
  await page.set_viewport_size({'width':360,'height':740})
  await page.get_by_role('button',name='🐣 חיות והגורים שלהן').click()
  await page.get_by_role('button',name='מתחילים').click()
  assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  await page.screenshot(path='/tmp/families-round-small.png')
  print(json.dumps({'errors':errors,'audio':audio,'clipPlans':len(plans),'games':7,'rounds':6},ensure_ascii=False))
  assert not errors,errors
  await browser.close()
asyncio.run(main())
server.shutdown()
