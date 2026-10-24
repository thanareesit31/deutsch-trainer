import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
import {NounText} from '../../src/components/noun-text.tsx';
const {items}=JSON.parse(readFileSync('supabase/seed/catalog.json','utf8'));
const colors={der:'#1686B2',die:'#D94B77',das:'#40A66B',plural:'#E6B83E'};
let nouns=0,plurals=0;
for(const item of items.filter(i=>i.skill==='vocabulary'&&(i.article||i.pluralOnly))){
 const html=renderToStaticMarkup(React.createElement(NounText,{text:item.answer,item}));
 const article=item.pluralOnly?'die':item.article;assert(html.includes('article-dot'),item.id);assert(html.includes(article+' '),item.id);assert(html.toLowerCase().includes(colors[item.pluralOnly?'plural':article].toLowerCase()),item.id);nouns++;
 if(item.plural){const html=renderToStaticMarkup(React.createElement(NounText,{text:'die '+item.plural,items}));assert(html.includes('die '+item.plural),item.id);assert(html.toLowerCase().includes(colors.plural.toLowerCase()),item.id);plurals++;}
}
for(const text of ['zum Café','Kann ich zu Fuß zum Café gehen?','Berlin gefällt mir.','Deutschland'])assert.equal(renderToStaticMarkup(React.createElement(NounText,{text,items})),text);
console.log(JSON.stringify({catalogNouns:nouns,catalogPlurals:plurals,colors:true,contextPreserved:true}));
