// Fetches the published grammarian morpheme catalog and converts it into the
// preset shape oq's buildWord()/analyzeWord() expect. See
// jandahl-custom-KAL-grammarian's CLAUDE.md — the exported JSON always
// carries meta.authoritative: false, which we surface to the user as-is
// rather than hiding it.
import { mergeMorphemeSources, GRAMMAR_MORPHEMES_URL } from "./oq-api.js";

/**
 * @returns {Promise<{ presets: any[], authoritative: boolean|undefined, meta: any }>}
 */
export async function loadCatalog() {
	// Revalidate the live catalog so a Pages/CDN cached response cannot hide a
	// newly published grammarian export. Unchanged bytes remain cacheable via
	// the server's validators; only a changed catalog is downloaded.
	const res = await fetch(GRAMMAR_MORPHEMES_URL, { cache: "no-cache" });
	if (!res.ok) throw new Error(`morpheme catalog fetch failed: ${res.status}`);
	const value = await res.json();
	const { presets, anyOk, failed } = mergeMorphemeSources(
		[{ status: "fulfilled", value }],
		[{ buildable: true, source: "grammarian" }],
	);
	if (!anyOk || failed.length) throw new Error("morpheme catalog failed to load");
	// Compatibility for grammarian mirrors published before the structured
	// negation gloss: keep the ordinary negator learner-facing label stable.
	const negator = presets.find((preset) => preset.id === "V_ngngit_Vb");
	if (negator && !negator.plainGloss?.en_short?.includes?.("do not")) {
		negator.plainGloss = { ...(negator.plainGloss ?? {}), en_short: "do not ___" };
	}
	return { presets, authoritative: value?.meta?.authoritative, meta: value?.meta ?? null };
}
