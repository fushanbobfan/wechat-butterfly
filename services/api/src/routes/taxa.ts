import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';

const taxaRouter = Router();
const taxaPath = path.resolve(__dirname, '../data/taxa.json');

type Taxon = {
  taxon_id: string;
  display_name_zh: string;
  scientific_name: string;
  primary_color: string;
  temperature_preference: string[];
  habitat: string[];
  kid_summary: string;
};

function loadTaxa(): Taxon[] {
  const raw = fs.readFileSync(taxaPath, 'utf-8');
  return JSON.parse(raw) as Taxon[];
}

taxaRouter.get('/api/v1/taxa', (req, res) => {
  const keyword = String(req.query.q || '').trim().toLowerCase();
  const temperature = String(req.query.temperature || '').trim().toLowerCase();

  const rows = loadTaxa().filter((row) => {
    const keywordMatched =
      !keyword ||
      [row.taxon_id, row.display_name_zh, row.scientific_name, row.kid_summary].join(' ').toLowerCase().includes(keyword);
    const temperatureMatched = !temperature || row.temperature_preference.map((x) => x.toLowerCase()).includes(temperature);
    return keywordMatched && temperatureMatched;
  });

  res.json({ total: rows.length, rows });
});

taxaRouter.post('/api/v1/search/species', (req, res) => {
  const payload = req.body as { query_text?: string; filters?: { temperature_preference?: string } };
  const query = String(payload.query_text || '').toLowerCase();
  const temperature = String(payload.filters?.temperature_preference || '').toLowerCase();

  const rows = loadTaxa().filter((row) => {
    const keywordMatched = !query || [row.display_name_zh, row.scientific_name, row.kid_summary].join(' ').toLowerCase().includes(query);
    const temperatureMatched = !temperature || row.temperature_preference.map((x) => x.toLowerCase()).includes(temperature);
    return keywordMatched && temperatureMatched;
  });

  res.json({ parsed_query: { query_text: query, temperature_preference: temperature || null }, results: rows });
});

export default taxaRouter;
