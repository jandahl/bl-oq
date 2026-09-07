import test from "node:test";
import assert from "node:assert/strict";
import { buildNounEndingIndex, nounCandidatesFor, parseNominalCoordinate } from "../../docs/noun-endings.js";

const ending = (id, caseName, meaning = id) => ({ id, meaning, lexical_facts: { morpheme_type: "inflectional_ending", case: caseName } });

test("parseNominalCoordinate recognizes explicit case, number, and possessor coordinates", () => {
	assert.deepEqual(parseNominalCoordinate(ending("N_ABS_POSS3SG_PL", "absolutive")), { case: "absolutive", possessor: "3SG", number: "PL" });
	assert.deepEqual(parseNominalCoordinate({ id: "N_ABS_SG", morpheme_type: "inflectional_ending", case: "absolutive" }), { case: "absolutive", possessor: "none", number: "SG" });
	assert.equal(parseNominalCoordinate(ending("N_DEM_EXCL_A", "")), null);
	assert.equal(parseNominalCoordinate(ending("N_ABS_POSS9SG_SG", "absolutive")), null);
});

test("buildNounEndingIndex groups structured nominal endings and keeps duplicate candidates", () => {
	const index = buildNounEndingIndex([
		ending("N_ABS_SG", "absolutive", "absolutive singular"),
		ending("N_ABS_POSS1SG_PL", "absolutive", "possessed plural"),
		ending("N_ABS_POSS1SG_PL_ARCHAIC", "absolutive", "archaic possessed plural"),
		ending("N_ERG_SG", "ergative"),
		{ id: "N_OTHER", lexical_facts: { morpheme_type: "inflectional_ending", case: "absolutive" } },
	]);
	assert.deepEqual(index.cases, ["absolutive", "ergative"]);
	assert.deepEqual(nounCandidatesFor(index, "absolutive", "none", "SG").map((x) => x.id), ["N_ABS_SG"]);
	assert.deepEqual(nounCandidatesFor(index, "absolutive", "1SG", "PL").map((x) => x.id), ["N_ABS_POSS1SG_PL", "N_ABS_POSS1SG_PL_ARCHAIC"]);
});
