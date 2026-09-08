import test from "node:test";
import assert from "node:assert/strict";
import { getLocale, setLocale, t } from "../../docs/i18n.js";

test("i18n exposes the main page's English and Danish UI labels", () => {
	setLocale("en");
	assert.equal(t("buildHeading"), "Build a word");
	assert.equal(t("clearFilter"), "Clear filter");
	setLocale("da");
	assert.equal(t("buildHeading"), "Byg et ord");
	assert.equal(t("clearFilter"), "Ryd filter");
	setLocale("en");
});

test("i18n falls back safely for unsupported locales and missing keys", () => {
	setLocale("sv");
	assert.equal(getLocale(), "en");
	assert.equal(t("settingsHeading"), "Display and language");
	assert.equal(t("missing-key"), "missing-key");
});
