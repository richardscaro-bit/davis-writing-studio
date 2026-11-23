/* ENGL 1301 summary, paraphrase, and quote practice: source text.
   Every string below is copied character for character from the handout
   "1301 Summaries, Paraphrases, and Quotes" (Fall 2026). Do not edit by hand.
   A test script compares these strings with the handout. */
(function (root) {
  var DATA = {
    passage:
      "In this study we utilize spatially-detailed records of data center operations to provide the first sub-national estimates of data center water and carbon footprints. Here, water footprint is defined as the consumptive blue water use (i.e. surface water and groundwater). The carbon footprint of a data center, expressed as equivalent CO2, is used to represent its global warming potential.",
    sourceLine:
      "Siddik, Shehabi, and Marston, \"The Environmental Footprint of Data Centers in the United States,\" page 2.",
    worksCited:
      "Siddik, Md Abu Bakar, et al. \"The Environmental Footprint of Data Centers in the United States.\" Environmental Research Letters, vol. 16, no. 6, 2021, article 064017, https://doi.org/10.1088/1748-9326/abfba1.",
    worksCitedItalic: "Environmental Research Letters",
    page: "2",
    narrativeForm: "(2)",
    parentheticalForm: "(Siddik et al. 2)",
    summaryStarters: [
      "Siddik et al. find that...",
      "According to Siddik, Shehabi, and Marston,..."
    ],
    quoteStarters: [
      "Siddik et al. state that \"...\"",
      "As Siddik, Shehabi, and Marston explain, \"...\""
    ],
    /* Built only from words in the handout quote example (not a handout line itself).
       Used to show the parenthetical form next to the handout's narrative form. */
    parentheticalExample:
      "Water footprint is defined as \"the consumptive blue water use (i.e. surface water and groundwater)\" (Siddik et al. 2).",
    models: {
      summary:
        "Siddik et al. use detailed location records to produce the first sub-national estimates of the water and carbon footprints of data centers. They measure water as the amount consumed from surface water and groundwater, and they measure carbon as equivalent carbon dioxide, a way of stating global warming potential (2).",
      paraphrase:
        "Siddik, Shehabi, and Marston use location-specific records of data center operations to estimate, for the first time at a sub-national scale, both the water and the carbon footprints of those facilities. They treat the water footprint as the blue water actually consumed, meaning surface water and groundwater, and they treat the carbon footprint as equivalent carbon dioxide in order to express global warming potential (2).",
      quote:
        "Siddik et al. state that \"water footprint is defined as the consumptive blue water use (i.e. surface water and groundwater)\" (2).",
      weakParaphrase:
        "In this study the authors utilize spatially-detailed records of data center operations to provide the first sub-national estimates of data center water and carbon footprints. Here, water footprint is defined as the consumptive blue water use (surface water and groundwater). The carbon footprint of a data center, expressed as equivalent CO2, represents its global warming potential (Siddik et al. 2).",
      strongParaphrase:
        "Using records that track data centers by location, Siddik et al. offer the first estimates of those centers' water and carbon footprints at a scale smaller than the whole nation. They count only consumed blue water, which they define as surface water and groundwater, and they report the carbon footprint as equivalent carbon dioxide so that it can stand for global warming potential (2).",
      introduce:
        "Siddik, Shehabi, and Marston specify what they mean by water footprint before they report their results.",
      sandwichQuote:
        "They write that \"water footprint is defined as the consumptive blue water use (i.e. surface water and groundwater)\" (2).",
      explain:
        "This definition limits the study to consumed blue water, which the authors define as surface water and groundwater. When you use this source for Evidence or Limits, stay inside that definition so you do not claim the study measured a wider kind of water use."
    }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
  else root.SQP_DATA = DATA;
})(typeof window !== "undefined" ? window : this);
