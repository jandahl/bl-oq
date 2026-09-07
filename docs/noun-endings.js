// Indexes structured nominal inflectional endings. The grammarian catalog
// currently exposes case on lexical_facts and encodes number/possessor in the
// entry id; only entries with explicit case and a parseable N_* shape are
// eligible for the picker. Everything else remains an individual block.

const CASE_ORDER = ["absolutive", "ergative", "instrumental", "allative", "locative", "ablative", "equalis", "vialis"];
const NUMBER_ORDER = ["SG", "PL"];
const POSSESSOR_ORDER = ["none", "1SG", "2SG", "3SG", "4SG", "1PL", "2PL", "3PL", "4PL"];
const CASE_BY_CODE = { ABS: "absolutive", ERG: "ergative", INS: "instrumental", ALL: "allative", LOC: "locative", ABL: "ablative", EQU: "equalis", VIA: "vialis" };

function parseNominalCoordinate(preset) {
	const facts = preset?.lexical_facts ?? preset;
	const match = /^N_[A-Z]+(?:_POSS(1SG|2SG|3SG|4SG|1PL|2PL|3PL|4PL))?_(SG|PL)(?:_[A-Z]+)?$/.exec(preset?.id ?? "");
	const caseName = facts.case || CASE_BY_CODE[preset?.id?.split("_")[1]];
	if (facts.morpheme_type !== "inflectional_ending" || !caseName || !match) return null;
	return { case: caseName, possessor: match[1] ?? "none", number: match[2] };
}

export function buildNounEndingIndex(presets) {
	const index = new Map();
	const cases = [];
	for (const preset of presets ?? []) {
		const coordinate = parseNominalCoordinate(preset);
		if (!coordinate) continue;
		if (!cases.includes(coordinate.case)) cases.push(coordinate.case);
		const key = `${coordinate.case}|${coordinate.possessor}|${coordinate.number}`;
		const list = index.get(key) ?? [];
		list.push({ id: preset.id, label: preset.meaning || preset.glossShort || preset.id });
		index.set(key, list);
	}
	return {
		index,
		cases: CASE_ORDER.filter((value) => cases.includes(value)).concat(cases.filter((value) => !CASE_ORDER.includes(value))),
		possessors: POSSESSOR_ORDER.filter((value) => [...index.keys()].some((key) => key.includes(`|${value}|`))),
		numbers: NUMBER_ORDER.filter((value) => [...index.keys()].some((key) => key.endsWith(`|${value}`))),
	};
}

export function nounCandidatesFor(index, caseName, possessor = "none", number = "SG") {
	return index?.index?.get(`${caseName}|${possessor}|${number}`) ?? [];
}

export { parseNominalCoordinate };
