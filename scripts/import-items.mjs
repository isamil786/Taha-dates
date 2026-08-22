import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const XLSX_PATH = path.join(process.cwd(), "Items.xlsx");
const DATA_PATH = path.join(process.cwd(), "data", "items.json");

function parseXlsxWithPython() {
  const script = `
import openpyxl, json, sys
wb = openpyxl.load_workbook(sys.argv[1], data_only=True)
ws = wb.active
rows = list(ws.iter_rows(values_only=True))[1:]
items = []
for i, row in enumerate(rows, start=1):
    barcode, name, uom, category, cost, mrp, our_price, hsn, gst = row
    if not name or str(name).strip() == '':
        continue
    cat = category
    if cat in (None, 0, '0', ''):
        cat = 'Other'
    else:
        cat = str(cat).strip()
    price = our_price if our_price else (mrp or 0)
    items.append({
        'id': i,
        'barcode': str(barcode or ''),
        'name': str(name).strip(),
        'uom': str(uom or 'Pcs'),
        'category': cat,
        'category_slug': '',
        'cost_price': float(cost or 0),
        'mrp': float(mrp or 0),
        'price': float(price or 0),
        'hsn_code': str(hsn or ''),
        'gst_group': str(gst or ''),
    })
for item in items:
    item['category_slug'] = __import__('re').sub(r'[^a-z0-9]+', '-', item['category'].lower()).strip('-')
print(json.dumps(items))
`;

  const result = spawnSync("python3", ["-c", script, XLSX_PATH], {
    encoding: "utf-8",
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.error) {
    throw new Error(`Failed to run Python: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`Python import failed: ${result.stderr}`);
  }

  return JSON.parse(result.stdout);
}

async function main() {
  if (!fs.existsSync(XLSX_PATH)) {
    console.error("Items.xlsx not found at", XLSX_PATH);
    process.exit(1);
  }

  console.log("Reading Items.xlsx...");
  const items = parseXlsxWithPython();
  console.log(`Found ${items.length} items`);

  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2));

  const stats = new Map();
  for (const item of items) {
    if (item.price > 0) {
      stats.set(item.category, (stats.get(item.category) || 0) + 1);
    }
  }

  console.log("\nImported successfully to data/items.json!");
  console.log("Categories with priced items:");
  for (const [cat, count] of [...stats.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
