import { describe, expect, it } from "vitest";
import { LOCALES, translate } from "./index";
import { pt } from "./pt";
import { extra } from "./extra";

describe("i18n", () => {
  it("every locale defines every key, non-empty", () => {
    for (const l of LOCALES) for (const k of [...Object.keys(pt), ...Object.keys(extra["pt-BR"])]) expect((l.dict as Record<string, string>)[k], `${l.code}:${k}`).toBeTruthy();
  });
  it("supports exactly pt-BR, en, fr, de, es", () => {
    expect(LOCALES.map((l) => l.code)).toEqual(["pt-BR", "en", "fr", "de", "es"]);
  });
  it("interpolates variables", () => {
    expect(translate("en", "common.episodes", { done: 1, total: 3 })).toBe("1 of 3 episodes");
  });
});
