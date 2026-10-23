// Independent inventory of authored examples. No DOM, runtime or generated manifest is trusted for these counts.
import {typeSamples} from '../../scripts/typography.mjs';
import assert from 'node:assert/strict';
import {uiGroups} from '../../scripts/ui-atlas-section.mjs';
import {htmlElements,inputTypes,htmlAtlasSection} from '../../scripts/html-atlas-section.mjs';
import {motionExamples} from '../../scripts/motion-atlas-section.mjs';
import {patterns,userReferences,sources} from '../../site/catalog.js';
import {variationCount} from '../../scripts/variation-atlas.mjs';
import {finishes} from '../../scripts/material-finishes.mjs';

export function expectedCoverage(){
 const ui=uiGroups.flatMap(g=>g.specimens);
 const html=htmlAtlasSection();
 const states=[...html.matchAll(/class="ha-state"/g)].length;
 const optical=['frost','smoke','liquid'].flatMap(kind=>['light','dark'].map(theme=>({kind,theme})));
 const collections={typography:typeSamples.length,variation:variationCount,ui:ui.length,html:htmlElements.length,input:inputTypes.length,state:states,motion:motionExamples.length,composition:patterns.length,finish:finishes.length,optical:optical.length};
 return {collections,total:Object.values(collections).reduce((a,b)=>a+b,0),references:userReferences.length,sources:Object.keys(sources).length,htmlKinds:Object.fromEntries(Object.entries(Object.groupBy(htmlElements,r=>r.kind)).map(([key,rows])=>[key,rows.length])),ids:{ui:ui.map(s=>s.id),html:htmlElements.map(s=>s.id),input:inputTypes,motion:motionExamples.map(s=>s.id),composition:patterns.map(p=>String(p.id)),finish:finishes.map(f=>f.id),optical:optical.map(s=>`${s.kind}-${s.theme}`)}};
}
if(process.argv[1]?.endsWith('expected-coverage.mjs')){
 const actual=expectedCoverage();
 assert.deepEqual(actual.collections,{typography:24,variation:44,ui:76,html:115,input:22,state:12,motion:39,composition:48,finish:4,optical:6});
 assert.equal(actual.total,390);
 for(const [kind,ids]of Object.entries(actual.ids))assert.equal(new Set(ids).size,ids.length,`${kind}: duplicate authored IDs`);
 const {ids,...summary}=actual;console.log(JSON.stringify(summary,null,2));
}
