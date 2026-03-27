const MAX_SENTENCE_LENGTH = 60;
const MAX_TERMINOLOGY_DENSITY = 0.18;
const TECHNICAL_TERMS = [
  "larva",
  "metamorphosis",
  "taxonomy",
  "instar",
  "proboscis",
  "nymphalidae",
  "lepidoptera"
];

function splitSentences(text) {
  return text
    .split(/[。！？!?\.]/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function containsSalientFeatureDescription(text, salientFeatures) {
  const normalizedText = text.toLowerCase();

  return salientFeatures.some((feature) => {
    const tokens = feature
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((token) => token.length >= 2);

    return tokens.some((token) => normalizedText.includes(token));
  });
}

function checkKidCopyCompliance(profile) {
  const kidSummary = profile.kid_summary || "";
  const salientFeatures = Array.isArray(profile.salient_features)
    ? profile.salient_features
    : [];

  const sentences = splitSentences(kidSummary);
  const sentenceLengths = sentences.map((item) => item.length);
  const longSentenceIndexes = sentenceLengths
    .map((length, index) => (length > MAX_SENTENCE_LENGTH ? index : -1))
    .filter((index) => index >= 0);

  const words = kidSummary.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const termHits = words.filter((word) => TECHNICAL_TERMS.includes(word));
  const terminologyDensity = words.length === 0 ? 0 : termHits.length / words.length;

  const hasSalientFeatureDescription = containsSalientFeatureDescription(
    kidSummary,
    salientFeatures
  );

  return {
    passed:
      longSentenceIndexes.length === 0 &&
      terminologyDensity <= MAX_TERMINOLOGY_DENSITY &&
      hasSalientFeatureDescription,
    checks: {
      sentence_length: {
        passed: longSentenceIndexes.length === 0,
        max_allowed: MAX_SENTENCE_LENGTH,
        over_limit_sentence_indexes: longSentenceIndexes
      },
      terminology_density: {
        passed: terminologyDensity <= MAX_TERMINOLOGY_DENSITY,
        ratio: Number(terminologyDensity.toFixed(3)),
        max_allowed: MAX_TERMINOLOGY_DENSITY
      },
      salient_feature_description: {
        passed: hasSalientFeatureDescription,
        message: hasSalientFeatureDescription
          ? "Detected at least one salient feature reference."
          : "Kid summary should mention at least one salient species feature."
      }
    }
  };
}

module.exports = {
  checkKidCopyCompliance,
  MAX_SENTENCE_LENGTH,
  MAX_TERMINOLOGY_DENSITY,
  TECHNICAL_TERMS
};
