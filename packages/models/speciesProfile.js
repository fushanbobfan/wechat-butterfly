const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

function normalizeDifficultyLevel(level) {
  const normalized = normalizeText(level).toLowerCase();

  if (!DIFFICULTY_LEVELS.includes(normalized)) {
    return "medium";
  }

  return normalized;
}

function normalizeSpeciesProfile(raw) {
  const profile = {
    taxon_id: normalizeText(raw?.taxon_id),
    common_name: normalizeText(raw?.common_name),
    scientific_name: normalizeText(raw?.scientific_name),
    headline: normalizeText(raw?.headline),
    summary: normalizeText(raw?.summary),
    kid_summary: normalizeText(raw?.kid_summary),
    teacher_summary: normalizeText(raw?.teacher_summary),
    child_friendly_title: normalizeText(raw?.child_friendly_title),
    difficulty_level: normalizeDifficultyLevel(raw?.difficulty_level),
    salient_features: Array.isArray(raw?.salient_features)
      ? raw.salient_features.map(normalizeText).filter(Boolean)
      : [],
    habitat: normalizeText(raw?.habitat),
    quiz_hints: Array.isArray(raw?.quiz_hints)
      ? raw.quiz_hints.map(normalizeText).filter(Boolean)
      : [],
    references: Array.isArray(raw?.references)
      ? raw.references.map(normalizeText).filter(Boolean)
      : []
  };

  if (!profile.kid_summary) {
    profile.kid_summary = profile.summary;
  }

  if (!profile.teacher_summary) {
    profile.teacher_summary = profile.summary;
  }

  if (!profile.child_friendly_title) {
    profile.child_friendly_title = profile.common_name;
  }

  return profile;
}

module.exports = {
  DIFFICULTY_LEVELS,
  normalizeSpeciesProfile,
  normalizeDifficultyLevel
};
