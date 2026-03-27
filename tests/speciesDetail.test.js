const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { getSpeciesDetail } = require("../services/api/speciesDetail");
const { fetchChildSpeciesCard, fetchTeacherLessonSpecies } = require("../apps/mobile/contextUsage");
const { checkKidCopyCompliance } = require("../apps/admin/kidCopyCompliance");
const { normalizeSpeciesProfile } = require("../packages/models/speciesProfile");
const { RAW_SPECIES_DATA } = require("../services/api/data/speciesData");

const snapshotPath = path.join(__dirname, "speciesDetail.snapshot.json");
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));

test("same taxon_id returns stable structures under each context", () => {
  const taxonId = snapshot.taxon_id;

  const actual = {
    public: getSpeciesDetail(taxonId, { context: "public" }),
    kid: getSpeciesDetail(taxonId, { context: "kid" }),
    teacher: getSpeciesDetail(taxonId, { context: "teacher" })
  };

  assert.deepEqual(actual, snapshot.contexts);
});

test("mobile uses kid context for children and teacher context for classroom", () => {
  const taxonId = snapshot.taxon_id;

  const childData = fetchChildSpeciesCard(taxonId);
  const teacherData = fetchTeacherLessonSpecies(taxonId);

  assert.ok("kid_summary" in childData);
  assert.ok("child_friendly_title" in childData);
  assert.ok(!("teacher_summary" in childData));

  assert.ok("teacher_summary" in teacherData);
  assert.ok(!("kid_summary" in teacherData));
});

test("admin kid copy compliance check passes for seeded profile", () => {
  const profile = normalizeSpeciesProfile(RAW_SPECIES_DATA[0]);
  const report = checkKidCopyCompliance(profile);

  assert.equal(report.passed, true);
  assert.equal(report.checks.sentence_length.passed, true);
  assert.equal(report.checks.terminology_density.passed, true);
  assert.equal(report.checks.salient_feature_description.passed, true);
});
