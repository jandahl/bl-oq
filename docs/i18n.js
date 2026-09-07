const messages = {
	en: {
		"app.title": "bl-oq-ly", "theme.auto": "Theme: Auto", "display": "Display",
		"subtitle": "A block-based learning aid for building and taking apart Kalaallisut words. Prototype — nothing here is authoritative.",
		"attested": "Attested word", "deconstruct": "Deconstruct", "glossLanguage": "Gloss language",
		"english": "English", "danish": "Dansk", "both": "Both", "morphemeLabels": "Morpheme labels",
		"formGloss": "Form + gloss", "formOnly": "Form only", "glossOnly": "Gloss only", "blockStyle": "Block style",
		"classic": "Classic", "zelos": "Zelos", "showIds": "Add internal API ids", "readLast": "Read last morpheme first",
		"paletteHide": "Hide palette", "paletteFilter": "Filter by Kalaallisut form, id, or gloss…",
		"tryExample": "Try an example", "exampleDescription": "Deconstructs the word and drops the verified chain onto the canvas.",
		"extendedExamples": "Extended examples", "loading": "Loading morpheme catalog…", "morphemeChain": "Morpheme chain",
	},
	da: {
		"app.title": "bl-oq-ly", "theme.auto": "Tema: Automatisk", "display": "Visning",
		"subtitle": "Et blokbaseret læringsværktøj til at bygge og analysere kalaallisut-ord. Prototype — intet her er autoritativt.",
		"attested": "Attesteret ord", "deconstruct": "Dekonstruér", "glossLanguage": "Glossprog",
		"english": "English", "danish": "Dansk", "both": "Begge", "morphemeLabels": "Morfemlabels",
		"formGloss": "Form + gloss", "formOnly": "Kun form", "glossOnly": "Kun gloss", "blockStyle": "Blokstil",
		"classic": "Klassisk", "zelos": "Zelos", "showIds": "Tilføj interne API-id'er", "readLast": "Læs sidste morfem først",
		"paletteHide": "Skjul palette", "paletteFilter": "Filtrér efter kalaallisut-form, id eller gloss…",
		"tryExample": "Prøv et eksempel", "exampleDescription": "Analyserer ordet og lægger den verificerede kæde på lærredet.",
		"extendedExamples": "Udvidede eksempler", "loading": "Indlæser morfemkatalog…", "morphemeChain": "Morfemkæde",
	},
};

let locale = "en";
export function t(key) { return messages[locale]?.[key] ?? messages.en[key] ?? key; }
export function setLocale(value) { locale = value === "da" ? "da" : "en"; if (typeof document !== "undefined") document.documentElement.lang = locale; applyLocale(); return locale; }
export function getLocale() { return locale; }
export function applyLocale(root = typeof document === "undefined" ? null : document) {
	if (!root) return;
	root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
	root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
}
