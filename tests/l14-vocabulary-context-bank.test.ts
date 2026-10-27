import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { l14VocabularyContextCases } from "../src/lib/l14-vocabulary-context-bank";

const require = createRequire(import.meta.url);
const catalog: { items: { id: string; answer: string; group: string }[] } = require("../supabase/seed/catalog.json");
const taught = new Map(catalog.items.filter(item => item.id.startsWith("L14-V")).map(item => [item.id, item]));

test("every taught L14 word has one answerable context task with learned-word choices", () => {
  assert.equal(l14VocabularyContextCases.length, 25);
  assert.deepEqual(new Set(l14VocabularyContextCases.map(entry => entry.targetId)), new Set(taught.keys()));
  for (const entry of l14VocabularyContextCases) {
    const target = taught.get(entry.targetId);
    assert(target, `missing target ${entry.targetId}`);
    assert.equal(entry.optionIds.length, 3);
    assert.equal(new Set(entry.optionIds).size, 3);
    assert(entry.optionIds.includes(entry.targetId));
    assert(entry.prompt.endsWith("?"));
    assert(entry.translation.endsWith("?"));
    const choices = entry.optionIds.map(id => taught.get(id));
    assert(choices.every(Boolean));
    assert.equal(new Set(choices.map(choice => choice?.answer)).size, 3);
    assert(!(entry.optionIds.includes("L14-V010") && entry.optionIds.includes("L14-V017")), "city-center synonyms cannot compete");
  }
});
