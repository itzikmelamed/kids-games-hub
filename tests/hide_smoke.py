import asyncio,os,threading,http.server,socketserver,json
from playwright.async_api import async_playwright
from pathlib import Path
os.chdir(Path(__file__).resolve().parents[1])
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
s=socketserver.TCPServer(('127.0.0.1',8781),Quiet);threading.Thread(target=s.serve_forever,daemon=True).start()
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,reduced_motion='reduce')
  errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  await pg.goto(os.getenv('TEST_URL','http://127.0.0.1:8781'))
  await pg.wait_for_selector('.game-card')
  assert await pg.locator('.game-card').count()==8
  await pg.get_by_role('button',name='🌿 מחבואים עם חיות',exact=True).click()
  await pg.screenshot(path='/tmp/hide-intro.png')
  await pg.get_by_role('button',name='מתחילים מחבואים',exact=True).click()
  await pg.screenshot(path='/tmp/hide-look.png')
  # Entire new spoken vocabulary has an embedded audio plan.
  plans=await pg.evaluate('Object.keys(AUDIO_CLIPS).filter(x=>x.includes("שיח")||x.includes("מחבואים")||x.includes("לחצי")||x.includes("מסתתרת")).map(x=>KidsAudio.plan(x))')
  assert all(plans)
  for n in range(6):
   assert await pg.locator('.hide-bush').count()==(2 if n<2 else 3)
   target=await pg.locator('.hide-critter svg').locator('..').locator('..').get_attribute('data-slot')
   await pg.get_by_role('button',name='להסתיר את החיה',exact=True).click()
   if n==0:
    await pg.screenshot(path='/tmp/hide-covered.png')
    await pg.wait_for_function('AUDIO_DEBUG.events.some(x=>x.startsWith("ended:h-find"))',timeout=20000)
   assert await pg.locator('.hide-field.covered').count()==1
   await pg.get_by_role('button',name='להציץ שוב',exact=True).click()
   assert await pg.locator('.hide-field.covered').count()==0
   await pg.get_by_role('button',name='להסתיר את החיה',exact=True).click()
   wrong=pg.locator('.hide-bush:not([data-slot="'+target+'"])').first
   await wrong.click();assert await wrong.is_disabled()
   await pg.locator('.hide-bush[data-slot="'+target+'"]').click()
   assert await pg.locator('.hide-progress .found').count()==n+1
   if n==2:
    await pg.wait_for_function('document.querySelectorAll(".confetti-bit").length===0')
    await pg.screenshot(path='/tmp/hide-found-three.png')
   await pg.get_by_role('button',name='לחיה הבאה',exact=True).click()
  await pg.wait_for_function('document.querySelectorAll(".confetti-bit").length===0')
  await pg.screenshot(path='/tmp/hide-finish.png')
  assert await pg.locator('.hide-collection svg').count()==6
  await pg.get_by_role('button',name='מחבואים עוד פעם',exact=True).click()
  await pg.get_by_role('button',name='מתחילים מחבואים',exact=True).click()
  await pg.get_by_role('button',name='קול',exact=True).click()
  await pg.get_by_role('button',name='שמעי את המשימה שוב',exact=True).click(force=True)
  await pg.wait_for_function('!KidsAudio.audioEl.paused')
  for width in [320,360,1280]:
   await pg.set_viewport_size({'width':width,'height':844})
   assert await pg.evaluate('document.documentElement.scrollWidth<=innerWidth')
   await pg.screenshot(path='/tmp/hide-look-'+str(width)+'.png')
  print(json.dumps({'errors':errors,'audio':await pg.evaluate('AUDIO_DEBUG'),'rounds':6,'peekAndReplay':True}))
  assert not errors
  await b.close()
asyncio.run(main());s.shutdown()
