const S=require(__dirname+'/../1301/tools/sqp-checks.js'),D=require(__dirname+'/../1301/tools/sqp-data.js');
const m=D.models; let fail=0, n=0;
function t(name,fn,text,exp,contains){
  const r=fn(text); n++;
  const ok=r.label===exp && (!contains||r.fix.some(f=>f.text.includes(contains)));
  if(!ok){fail++;console.log('FAIL',name,'got',r.label,'want',exp,contains||'');r.fix.forEach(f=>console.log('    -',f.level,f.text.slice(0,110)))}
  else console.log('ok  ',name,'=>',r.label);
}
const Q=(s)=>s;
// handout models
t('summary model',S.checkSummary,m.summary,'Strong');
t('paraphrase model',S.checkParaphrase,m.paraphrase,'Strong');
t('quote model',S.checkQuote,m.quote,'Strong');
t('weak paraphrase',S.checkParaphrase,m.weakParaphrase,'Weak','patchwriting');
t('strong paraphrase',S.checkParaphrase,m.strongParaphrase,'Strong');
// quote variants
const q='"water footprint is defined as the consumptive blue water use (i.e. surface water and groundwater)"';
t('quote parenthetical form',S.checkQuote,'Water footprint is defined as "the consumptive blue water use (i.e. surface water and groundwater)" (Siddik et al. 2).','Strong'); // quote integrated into the sentence, parenthetical form
t('quote missing cite',S.checkQuote,'Siddik et al. state that '+q+'.','Weak','Add an in-text citation');
t('quote no marks',S.checkQuote,'Siddik et al. state that water footprint is defined as the consumptive blue water use (i.e. surface water and groundwater) (2).','Weak','quotation marks');
t('quote inexact',S.checkQuote,'Siddik et al. state that "water footprint means the consumed blue water use" (2).','Weak','not in the passage');
t('quote case',S.checkQuote,'Siddik et al. state that "Water footprint is defined as the consumptive blue water use (i.e. surface water and groundwater)" (2).','Medium','almost matches');
t('quote comma cite',S.checkQuote,'Siddik et al. state that '+q+' (Siddik et al., 2).','Medium','comma');
t('quote doubled author',S.checkQuote,'Siddik et al. state that '+q+' (Siddik et al. 2).','Medium','already name');
t('quote doubled cite',S.checkQuote,'Siddik et al. state that '+q+' (2) (2).','Medium','doubled');
t('quote period before',S.checkQuote,'Siddik et al. state that '+q+'. (2)','Medium','period comes after');
t('quote period inside',S.checkQuote,'Siddik et al. state that "water footprint is defined as the consumptive blue water use (i.e. surface water and groundwater)." (2)','Medium','period');
t('quote no final period',S.checkQuote,'Siddik et al. state that '+q+' (2)','Medium','End the sentence');
t('quote p. 2',S.checkQuote,'Siddik et al. state that '+q+' (p. 2).','Medium','p.');
t('quote wrong page',S.checkQuote,'Siddik et al. state that '+q+' (5).','Weak','page 2');
t('quote no page',S.checkQuote,'Siddik et al. state that '+q+' (Siddik et al.).','Weak','page');
t('quote no author at all',S.checkQuote,'The study states that '+q+' (2).','Weak','Name the author');
t('quote etal no period',S.checkQuote,'Water footprint is "the consumptive blue water use" (Siddik et al 2).','Medium','et al');
t('quote year',S.checkQuote,'Siddik et al. state that '+q+' (2021).','Weak');
t('quote full names parens',S.checkQuote,'Water footprint is "the consumptive blue water use" (Siddik, Shehabi, and Marston 2).','Medium','et al.');
t('quote curly',S.checkQuote,'Siddik et al. state that \u201cwater footprint is defined as the consumptive blue water use (i.e. surface water and groundwater)\u201d (2).','Strong');
t('quote ellipsis',S.checkQuote,'Siddik et al. state that "water footprint is defined as ... surface water and groundwater" (2).','Strong');
t('quote whole passage',S.checkQuote,'Siddik et al. state that "'+D.passage+'" (2).','Medium','Shorten');
t('quote unpaired',S.checkQuote,'Siddik et al. state that "water footprint is defined as the consumptive blue water use (2).','Weak','not paired');
t('quote as...explain',S.checkQuote,'As Siddik, Shehabi, and Marston explain, "the first sub-national estimates of data center water and carbon footprints" (2).','Strong');
// paraphrase variants
t('para no cite',S.checkParaphrase,m.strongParaphrase.replace(' (2)',''),'Weak','Add an in-text citation');
t('para no author',S.checkParaphrase,m.strongParaphrase.replace('Siddik et al.','The researchers'),'Weak','Name the author');
t('para parenthetical ok',S.checkParaphrase,m.strongParaphrase.replace('Siddik et al.','the researchers').replace('Using records','Using records').replace('(2)','(Siddik et al. 2)'),'Strong');
t('para doubled author',S.checkParaphrase,m.strongParaphrase.replace('(2)','(Siddik et al. 2)'),'Medium','already name');
t('para short',S.checkParaphrase,'Siddik et al. studied data centers (2).','Weak');
t('para copy verbatim',S.checkParaphrase,D.passage+' (Siddik et al. 2).','Weak','patchwriting');
t('para one idea only',S.checkParaphrase,'Using records of where data centers are, Siddik et al. give water use numbers that count only consumed blue water, which means surface water and groundwater, and these figures are reported for each facility in the study (2).','Weak','leaves out most');
t('para comma',S.checkParaphrase,m.strongParaphrase.replace('Siddik et al.','the researchers').replace('(2)','(Siddik et al., 2)'),'Medium','comma');
t('para with quote marks',S.checkParaphrase,m.strongParaphrase.replace('whole nation','"whole nation"'),'Medium','quotation marks');
t('para off topic',S.checkParaphrase,'Siddik et al. wrote about lots of things that happen in many places around the world and they gave many details about each one of them across several years of work (2).','Weak');
// summary variants
t('summary no cite',S.checkSummary,m.summary.replace(' (2)',''),'Weak');
t('summary long',S.checkSummary,m.paraphrase,'Weak','must be shorter');
t('summary slightly short',S.checkSummary,D.models.summary+' They also say it twice over in a longer way for the reader here and now.','Weak','must be shorter');
t('summary copy',S.checkSummary,D.passage+' (Siddik et al. 2).','Weak');
t('summary opinion',S.checkSummary,m.summary.replace('(2)','(2)')+' I think this is wrong.','Medium','opinion');
t('summary short good',S.checkSummary,'Siddik et al. estimate the water and carbon footprints of data centers across the United States (2).','Strong');
t('summary no author',S.checkSummary,m.summary.replace('Siddik et al. use','The team uses'),'Weak','Name the author');
t('summary parenthetical',S.checkSummary,'The first estimates of the water and carbon footprints of data centers below the national level are now available (Siddik et al. 2).','Strong');
t('summary empty',S.checkSummary,'','Weak');
// extra citation cases
t('quote parenthetical built example',S.checkQuote,D.parentheticalExample,'Strong');
t('quote (Siddik et al. p. 2)',S.checkQuote,'Siddik et al. state that '+q+' (Siddik et al. p. 2).','Medium','p., pg., or page');
t('quote (Siddik, 2)',S.checkQuote,'Water footprint is "the consumptive blue water use" (Siddik, 2).','Medium','three authors');
t('summary parenthetical no period',S.checkSummary,'The first estimates of the water and carbon footprints of data centers below the national level are now available (Siddik et al. 2)','Medium','End the sentence');
t('summary bare citation',S.checkSummary,'Siddik et al. estimate the water and carbon footprints of data centers across the United States. Siddik et al. 2.','Weak','Add an in-text citation');
t('paraphrase period before parens',S.checkParaphrase,m.strongParaphrase.replace(' (2).','. (2)'),'Medium','period comes after');
// sandwich
const mk=(i,qq,e)=>S.checkSandwich({introduce:i,quote:qq,explain:e});
function ts(name,res,exp,part,contains){n++;const ok=res.label===exp&&(!part||res.parts[part].fix.some(f=>f.text.includes(contains)));if(!ok){fail++;console.log('FAIL',name,res.label);for(const k in res.parts)console.log('  ',k,res.parts[k].label,res.parts[k].fix.map(f=>f.text.slice(0,80)))}else console.log('ok  ',name,'=>',res.label)}
ts('sandwich handout',mk(m.introduce,m.sandwichQuote,m.explain),'Strong');
ts('sandwich no explain',mk(m.introduce,m.sandwichQuote,''),'Weak','explain','Explain in your own words');
ts('sandwich explain repeats',mk(m.introduce,m.sandwichQuote,'Water footprint is defined as the consumptive blue water use (i.e. surface water and groundwater) as the authors say here.'),'Weak','explain','repeats');
ts('sandwich no author anywhere',mk('The study sets up a definition before its results are given.','The authors write that "water footprint is defined as the consumptive blue water use" (2).',m.explain),'Weak','introduce','Name the author');
ts('sandwich author in quote lead',mk('The study sets up a definition before its results are given.','Siddik et al. write that "water footprint is defined as the consumptive blue water use" (2).',m.explain),'Strong');
ts('sandwich quote bad',mk(m.introduce,'They write that "water footprint is the water use" (2).',m.explain),'Weak','quote','not in the passage');
ts('sandwich medium',mk(m.introduce,m.sandwichQuote,'This means the study counts only some water so the number is smaller than the total.'),'Medium','explain','Connect');
// docx build test
const vm=require('vm'),fs=require('fs');
const ctx={Blob,TextEncoder,Uint8Array,Uint32Array,DataView,ArrayBuffer};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../1301/tools/sqp-docx.js','utf8'),ctx);
(async()=>{const b=ctx.SQPDocx.buildMlaDocx({name:'A B',instructor:'I',course:'C',date:'D',paragraphs:['One.'],worksCited:D.worksCited,worksCitedItalic:D.worksCitedItalic});
 const buf=Buffer.from(await b.arrayBuffer()); n++; if(buf.slice(0,2).toString()!=='PK'||!buf.includes(Buffer.from(D.worksCited.replace(/"/g,'"').slice(0,40)))){fail++;console.log('FAIL docx');}else console.log('ok   docx builds');
 console.log(`\n${n-fail}/${n} passed`); process.exit(fail?1:0);})();
// process.exit(fail?1:0);
