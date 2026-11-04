const { chromium } = require('playwright');
const path='/home/claude/aitools-training/vocab-flashcards/index.html';
(async()=>{
 const b=await chromium.launch(); const p=await (await b.newContext()).newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path);
 await p.click('[data-view=manage]');
 const base=await p.locator('.word-item').count();
 // C1: import file with duplicate words inside the file
 const json=JSON.stringify([{word:'zebra',meaning:'an animal'},{word:'zebra',meaning:'an animal again'}]);
 await p.setInputFiles('#import',{name:'dup.json',mimeType:'application/json',buffer:Buffer.from(json)});
 await p.waitForTimeout(300);
 const afterImport=await p.locator('.word-item').count();
 const zebras=await p.locator('.word-item .w',{hasText:/^zebra$/}).count();
 console.log('C1 base',base,'after',afterImport,'zebra rows',zebras,'toast',await p.locator('#toast').innerText());
 // C2: edit an existing word to the name of another word
 await p.screenshot({path:'c1.png',fullPage:true});
 await p.locator('.word-item',{has:p.locator('.w',{hasText:/^ephemeral$/})}).locator('button',{hasText:/edit/i}).first().click();
 await p.fill('#f-word','zebra');
 await p.click('#save-btn');
 await p.waitForTimeout(300);
 const confirmShown=await p.locator('#confirm-overlay').isVisible();
 const z2=await p.locator('.word-item .w',{hasText:/^zebra$/}).count();
 console.log('C2 confirmShown',confirmShown,'zebra rows now',z2);
 await p.screenshot({path:'c2.png',fullPage:true});
 // C3: csv with comma in meaning
 await p.reload(); await p.click('[data-view=manage]');
 await p.setInputFiles('#import',{name:'c.csv',mimeType:'text/csv',buffer:Buffer.from('quokka,a small marsupial, found in Australia\n')});
 await p.waitForTimeout(300);
 const q=await p.locator('.word-item',{has:p.locator('.w',{hasText:/^quokka$/})}).innerText().catch(()=> 'none');
 console.log('C3 quokka row:',JSON.stringify(q));
 console.log('errors',errs);
 await b.close();
})();
