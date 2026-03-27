const { normalizeSpeciesProfile } = require("../../packages/models/speciesProfile");
const { RAW_SPECIES_DATA } = require("./data/speciesData");

const CONTEXTS = ["kid", "teacher", "public"];

const CONTEXT_FIELDS = {
  public: [
    "taxon_id",
    "common_name",
    "scientific_name",
    "headline",
    "summary",
    "salient_features",
    "habitat"
  ],
  kid: [
    "taxon_id",
    "child_friendly_title",
    "kid_summary",
    "difficulty_level",
    "salient_features",
    "quiz_hints"
  ],
  teacher: [
    "taxon_id",
    "common_name",
    "scientific_name",
    "teacher_summary",
    "difficulty_level",
    "salient_features",
    "habitat",
    "references"
  ]
};

const normalizedProfiles = RAW_SPECIES_DATA.map(normalizeSpeciesProfile);

function resolveContext(context) {
  if (!context) {
    return "public";
  }

  return CONTEXTS.includes(context) ? context : "public";
}

function pickFields(profile, fields) {
  const result = {};

  for (const field of fields) {
    result[field] = profile[field];
  }

  return result;
}

function getSpeciesDetail(taxonId, options = {}) {
  const context = resolveContext(options.context);
  const profile = normalizedProfiles.find((item) => item.taxon_id === taxonId);

  if (!profile) {
    return null;
  }

  return pickFields(profile, CONTEXT_FIELDS[context]);
}

module.exports = {
  CONTEXTS,
  CONTEXT_FIELDS,
  getSpeciesDetail,
  resolveContext
};
