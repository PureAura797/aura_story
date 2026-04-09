#!/usr/bin/env node
/**
 * Migration script: Update Supabase admin_data with new client-media paths.
 * Replaces AI-generated placeholder image paths with real client photos.
 * 
 * Usage: node scripts/migrate-media-paths.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) env[key.trim()] = valueParts.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

// ─── New Portfolio Data ─────────────────────────────────
const newPortfolio = [
  { id: "1", type: "Уборка после пожара", area: "65 кв.м", time: "2 дня", description: "Двухкомнатная квартира после пожара. Полный демонтаж повреждённых покрытий, шлифовка стен и потолков, химическая нейтрализация копоти, трёхкратная озонация.", beforeImg: "/assets/before/fire/fire-severe-kitchen-destroyed.webp", afterImg: "/assets/portfolio/fire-room-before-after.webp", published: true, sort_order: 0 },
  { id: "2", type: "Восстановление квартиры", area: "78 кв.м", time: "3 дня", description: "Квартира после сильного пожара. Зачистка стен и потолков от сажи, демонтаж полов, обработка всех поверхностей биоцидами, озонация.", beforeImg: "/assets/before/fire/fire-kitchen-appliances.webp", afterImg: "/assets/portfolio/fire-room-balcony-before-after.webp", published: true, sort_order: 1 },
  { id: "3", type: "Восстановление кухни", area: "12 кв.м", time: "1 день", description: "Кухня после возгорания. Удаление копоти с мебели и стен, химическая нейтрализация запаха гари, полировка фасадов.", beforeImg: "/assets/before/fire/fire-ceiling-soot-window.webp", afterImg: "/assets/portfolio/fire-kitchen-corner-before-after.webp", published: true, sort_order: 2 },
  { id: "4", type: "Полный цикл после пожара", area: "95 кв.м", time: "4 дня", description: "Трёхкомнатная квартира. Демонтаж обгоревших материалов, шлифовка бетона, STP-обработка, восстановление вентиляции, озонация.", beforeImg: "/assets/before/fire/fire-severe-kitchen-destroyed.webp", afterImg: "/assets/portfolio/fire-kitchen-wide-before-after.webp", published: true, sort_order: 3 },
];

// ─── New Stories Data ─────────────────────────────────
const newStories = [
  { id: "1", title: "Кейс", subtitle: "Пожар", color: "#fb7185", cover: "/assets/before/fire/fire-severe-kitchen-destroyed.webp", videos: [], media: [
    { type: "photo", src: "/assets/before/fire/fire-severe-kitchen-destroyed.webp" },
    { type: "photo", src: "/assets/before/fire/fire-kitchen-appliances.webp" },
    { type: "photo", src: "/assets/portfolio/fire-room-before-after.webp" },
    { type: "photo", src: "/assets/portfolio/fire-kitchen-wide-before-after.webp" },
  ], published: true, sort_order: 0 },
  { id: "2", title: "Кейс", subtitle: "Процесс", color: "#5eead4", cover: "/assets/process/worker-grinding-wall-goggles.webp", videos: [], media: [
    { type: "photo", src: "/assets/process/worker-grinding-wall-back.webp" },
    { type: "photo", src: "/assets/process/two-workers-wall-processing.webp" },
    { type: "photo", src: "/assets/process/worker-ceiling-ladder-vacuum.webp" },
    { type: "photo", src: "/assets/process/specialist-goggles-grinding.webp" },
  ], published: true, sort_order: 1 },
  { id: "3", title: "Кейс", subtitle: "Плесень", color: "#a78bfa", cover: "/assets/before/mold/mold-wall-corner-severe.webp", videos: [], media: [
    { type: "photo", src: "/assets/before/mold/mold-wall-corner-severe.webp" },
    { type: "photo", src: "/assets/before/mold/mold-green-wall-panel.webp" },
    { type: "photo", src: "/assets/before/mold/mold-wooden-floor-damage.webp" },
    { type: "photo", src: "/assets/before/mold/mold-pipes-wall.webp" },
  ], published: true, sort_order: 2 },
  { id: "4", title: "Кейс", subtitle: "Дезинфекция", color: "#d4a574", cover: "/assets/process/fogger-tcd-hallway.webp", videos: [], media: [
    { type: "photo", src: "/assets/process/fogger-tcd-hallway.webp" },
    { type: "photo", src: "/assets/process/fogger-tcd-bedroom.webp" },
    { type: "photo", src: "/assets/process/disinfection-childrens-room.webp" },
    { type: "photo", src: "/assets/process/room-after-treatment-wet.webp" },
  ], published: true, sort_order: 3 },
  { id: "5", title: "Кейс", subtitle: "Результат", color: "#14b8a6", cover: "/assets/portfolio/fire-room-balcony-before-after.webp", videos: [], media: [
    { type: "photo", src: "/assets/portfolio/fire-room-before-after.webp" },
    { type: "photo", src: "/assets/portfolio/fire-room-balcony-before-after.webp" },
    { type: "photo", src: "/assets/portfolio/fire-kitchen-corner-before-after.webp" },
    { type: "photo", src: "/assets/portfolio/fire-kitchen-wide-before-after.webp" },
  ], published: true, sort_order: 4 },
  { id: "6", title: "Кейс", subtitle: "Объекты", color: "#38bdf8", cover: "/assets/objects/private-house-exterior-equipment.webp", videos: [], media: [
    { type: "photo", src: "/assets/objects/private-house-exterior-equipment.webp" },
    { type: "photo", src: "/assets/objects/private-house-fire-entrance.webp" },
    { type: "photo", src: "/assets/before/hoarder/hoarder-kitchen-extreme.webp" },
    { type: "photo", src: "/assets/before/hoarder/hoarder-room-debris.webp" },
  ], published: true, sort_order: 5 },
];

async function upsert(key, value) {
  const { error } = await supabase
    .from('admin_data')
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) {
    console.error(`✗ Failed to upsert "${key}":`, error.message);
    return false;
  }
  console.log(`✓ "${key}" updated successfully`);
  return true;
}

async function main() {
  console.log('\n🔄 Migrating media paths in Supabase...\n');
  
  const r1 = await upsert('portfolio', newPortfolio);
  const r2 = await upsert('stories', newStories);
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Results: portfolio=${r1 ? '✓' : '✗'}, stories=${r2 ? '✓' : '✗'}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main();
