const { getSpeciesDetail } = require("../../services/api/speciesDetail");

const MOBILE_CONTEXT = {
  childHomePage: "kid",
  teacherClassroomPage: "teacher"
};

function fetchChildSpeciesCard(taxonId) {
  return getSpeciesDetail(taxonId, { context: MOBILE_CONTEXT.childHomePage });
}

function fetchTeacherLessonSpecies(taxonId) {
  return getSpeciesDetail(taxonId, {
    context: MOBILE_CONTEXT.teacherClassroomPage
  });
}

module.exports = {
  MOBILE_CONTEXT,
  fetchChildSpeciesCard,
  fetchTeacherLessonSpecies
};
