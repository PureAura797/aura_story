#!/usr/bin/env node
/**
 * Migration v2: Client-corrected 4-category media structure.
 * Removes: Плесень, Результат, Объекты
 * Adds: Расхламление
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...v] = line.split('=');
  if (key && v.length) env[key.trim()] = v.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const newPortfolio = [
  { id: "1", type: "Уборка после пожара", area: "65 кв.м", time: "2 дня", description: "Двухкомнатная квартира после пожара. Полный демонтаж повреждённых покрытий, шлифовка стен и потолков, химическая нейтрализация копоти, трёхкратная озонация.", beforeImg: "/assets/pozhar/fire-damage-01.webp", afterImg: "/assets/pozhar/fire-damage-02.webp", published: true, sort_order: 0 },
  { id: "2", type: "Восстановление квартиры", area: "78 кв.м", time: "3 дня", description: "Квартира после сильного пожара. Зачистка стен и потолков от сажи, демонтаж полов, обработка всех поверхностей биоцидами, озонация.", beforeImg: "/assets/pozhar/fire-damage-03.webp", afterImg: "/assets/pozhar/fire-damage-04.webp", published: true, sort_order: 1 },
  { id: "3", type: "Восстановление кухни", area: "12 кв.м", time: "1 день", description: "Кухня после возгорания. Удаление копоти с мебели и стен, химическая нейтрализация запаха гари, полировка фасадов.", beforeImg: "/assets/pozhar/fire-damage-05.webp", afterImg: "/assets/pozhar/fire-damage-06.webp", published: true, sort_order: 2 },
  { id: "4", type: "Полный цикл после пожара", area: "95 кв.м", time: "4 дня", description: "Трёхкомнатная квартира. Демонтаж обгоревших материалов, шлифовка бетона, STP-обработка, восстановление вентиляции, озонация.", beforeImg: "/assets/pozhar/fire-damage-07.webp", afterImg: "/assets/pozhar/fire-damage-08.webp", published: true, sort_order: 3 },
];

const newStories = [
  { id: "1", title: "Кейс", subtitle: "Пожар", color: "#fb7185", cover: "/assets/pozhar/fire-damage-01.webp", videos: [], media: [
    { type: "photo", src: "/assets/pozhar/fire-damage-01.webp" },
    { type: "photo", src: "/assets/pozhar/fire-damage-02.webp" },
    { type: "photo", src: "/assets/pozhar/fire-damage-03.webp" },
    { type: "photo", src: "/assets/pozhar/fire-damage-04.webp" },
    { type: "photo", src: "/assets/pozhar/fire-damage-05.webp" },
    { type: "photo", src: "/assets/pozhar/fire-damage-06.webp" },
    { type: "photo", src: "/assets/pozhar/fire-damage-07.webp" },
    { type: "photo", src: "/assets/pozhar/fire-damage-08.webp" },
    { type: "photo", src: "/assets/pozhar/fire-damage-09.webp" },
    { type: "photo", src: "/assets/pozhar/fire-damage-10.webp" },
  ], published: true, sort_order: 0 },
  { id: "2", title: "Кейс", subtitle: "Процесс", color: "#5eead4", cover: "/assets/process/work-process-01.webp", videos: [], media: [
    { type: "photo", src: "/assets/process/work-process-01.webp" },
    { type: "photo", src: "/assets/process/work-process-02.webp" },
    { type: "photo", src: "/assets/process/work-process-03.webp" },
    { type: "photo", src: "/assets/process/work-process-04.webp" },
    { type: "photo", src: "/assets/process/work-process-05.webp" },
    { type: "photo", src: "/assets/process/work-process-06.webp" },
    { type: "photo", src: "/assets/process/work-process-07.webp" },
    { type: "photo", src: "/assets/process/work-process-08.webp" },
  ], published: true, sort_order: 1 },
  { id: "3", title: "Кейс", subtitle: "Дезинфекция", color: "#d4a574", cover: "/assets/dezinfekcia/disinfection-01.webp", videos: [], media: [
    { type: "photo", src: "/assets/dezinfekcia/disinfection-01.webp" },
    { type: "video", src: "/stories/dezinfekcia-01.mp4" },
    { type: "photo", src: "/assets/dezinfekcia/disinfection-02.webp" },
    { type: "video", src: "/stories/dezinfekcia-02.mp4" },
    { type: "photo", src: "/assets/dezinfekcia/disinfection-03.webp" },
    { type: "video", src: "/stories/dezinfekcia-03.mp4" },
    { type: "photo", src: "/assets/dezinfekcia/disinfection-04.webp" },
    { type: "video", src: "/stories/dezinfekcia-04.mp4" },
  ], published: true, sort_order: 2 },
  { id: "4", title: "Кейс", subtitle: "Расхламление", color: "#a78bfa", cover: "/assets/rashlam/declutter-01.webp", videos: [], media: [
    { type: "photo", src: "/assets/rashlam/declutter-01.webp" },
    { type: "photo", src: "/assets/rashlam/declutter-02.webp" },
    { type: "photo", src: "/assets/rashlam/declutter-03.webp" },
    { type: "photo", src: "/assets/rashlam/declutter-04.webp" },
    { type: "photo", src: "/assets/rashlam/declutter-05.webp" },
    { type: "photo", src: "/assets/rashlam/declutter-06.webp" },
    { type: "photo", src: "/assets/rashlam/declutter-07.webp" },
    { type: "photo", src: "/assets/rashlam/declutter-08.webp" },
  ], published: true, sort_order: 3 },
];

async function upsert(key, value) {
  const { error } = await supabase.from('admin_data').upsert({ key, value }, { onConflict: 'key' });
  if (error) { console.error(`✗ "${key}":`, error.message); return false; }
  console.log(`✓ "${key}" updated`);
  return true;
}

async function main() {
  console.log('\n🔄 Migration v2: 4-category structure...\n');
  const r1 = await upsert('portfolio', newPortfolio);
  const r2 = await upsert('stories', newStories);
  console.log(`\n📊 portfolio=${r1?'✓':'✗'} stories=${r2?'✓':'✗'}\n`);
}

main();
