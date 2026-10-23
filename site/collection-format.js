import {validateTheme} from './theme-studio.js';
export function parseCollection(text,known){
 if(text.length>1000000)throw new Error('Файл превышает 1 МБ.');
 let value;try{value=JSON.parse(text);}catch{throw new Error('Некорректный JSON.');}
 if(value?.schema!=='luma-collection'||value.version!==1||typeof value.name!=='string'||!value.name.trim()||value.name.length>80||!Array.isArray(value.ids)||!value.ids.length||value.ids.length>1000||value.ids.some(id=>typeof id!=='string'))throw new Error('Неподдерживаемый формат подборки.');
 const checked=validateTheme(value.theme);if(!checked.valid)throw new Error('Некорректная тема подборки.');
 const ids=[...new Set(value.ids)].filter(id=>known.has(id));if(!ids.length)throw new Error('В этом атласе нет компонентов из файла.');
 return{name:value.name.trim(),ids,theme:checked.state,skipped:new Set(value.ids.filter(id=>!known.has(id))).size};
}
