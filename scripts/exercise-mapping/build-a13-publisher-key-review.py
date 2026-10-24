"""Join source audit units to publisher key locations without inventing answer checks.

The output is internal metadata. A located key is not a reviewed web answer.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / "docs/exercise-mapping/a13-item-level-source-audit.json"
OUT = ROOT / "docs/exercise-mapping/a13-publisher-key-review.json"
AB_KEY = "https://edit.hueber.de/media/36/Momente_AB_A1_2_Loesungen.pdf"

KEY_SECTIONS = {
    "MOMENTE_A1_2_AB": {"kind": "publisher_pdf", "uri": AB_KEY, "pages": {15: 2, 16: 3, 17: 4, 18: "4–5"}},
    "GRAMMATIK_AKTIV_A1_B1": {"kind": "supplied_book_solution_section", "pdfPages": "198–230"},
    "GRAMMATIK_A1_DAS_TRAINING": {"kind": "supplied_book_solution_section", "pdfPages": "75–80"},
    "SCHREIBEN_A1_DAS_TRAINING": {"kind": "supplied_book_solution_section", "pdfPages": "71–76"},
}
GA_KEY_PAGES = {6: 199, 9: 200, 17: 204, 19: 204, 21: 205, 23: 205, 32: 209, 33: 209, 34: 209, 35: 209, 36: 209}
DT_KEY_PAGES = {4: 75, 16: 77, 17: 77, 21: 78, 24: 78, 28: 79, 30: 79, 34: 79, 35: 79, 36: 79}
SCH_KEY_PAGES = {6: 72, 10: 72, 14: 73, 17: 74}
SOURCE_DISPOSITION = {
    "in_scope": "a13_source_candidate",
    "partial": "filter_individual_response_and_prerequisites",
    "adapt": "adapt_for_another_skill_or_context",
    "review_only": "prerequisite_or_review_reference",
    "asset_required": "new_asset_or_assessment_required",
    "exclude_level": "exclude_from_a13_level",
    "worked_example": "exclude_printed_model",
}

# Hueber distinguishes individual or possible answers from a fixed answer key.
OPEN_AB = {
    15: {"1b": "individual", "2": "individual", "6c": "individual", "8b": "individual", "11": "possible"},
    16: {"1a": "individual", "1b": "possible", "4c": "possible", "5a": "possible", "8c": "individual", "9b": "possible"},
    17: {"5a": "possible", "5b": "individual", "6b": "individual", "11c": "individual"},
    18: {"1b": "individual", "5": "possible", "7b": "individual", "9b": "possible", "11": "possible", "13b": "possible"},
}
NO_AB_KEY_ENTRY = {15: {"6b"}, 16: {"5b"}, 17: set(), 18: {"6c"}}
OPEN_OTHER = {("GRAMMATIK_AKTIV_A1_B1", 18, "9/2"): "possible"}

# Each of these was checked against both the pictured source response slot and
# the activity's publisher solution. The book's text is not copied into this file.
AB_CROSSCHECKED = {
    15: {
        "7a": dict(zip(map(str, range(2, 9)), ["ihr", "ihre", "ihre", "sein", "sein", "seine", "seine"])),
        "7b": dict(zip(map(str, range(2, 9)), ["ihr", "Ihre", "ihre", "seinen", "sein", "Seine", "seine"])),
    },
    16: {
        "6b": {"2": "In", "3": "In", "4": "Nach", "5": "Vor", "6": "vor"},
        "7": dict(zip("bcdefghi", ["der", "einer", "dem", "der", "dem", "einer", "einem", "der"])),
    },
    17: {
        "1b": {"du": "wirst", "er-sie-es": "wird"},
        "2": {"2": "auf jeden Fall", "3": "werdet", "4": "werde", "5": "auf keinen Fall", "6": "wirst", "7": "wird"},
        "7a": {"2": "ohne", "3": "ohne", "4": "Mit", "5": "ohne", "6": "Mit", "7": "Mit"},
        "9": {"2": "will", "3": "will", "4": "willst", "5": "will", "6": "wollt", "7": "wollen"},
        "11b": {"2": "lerne", "3": "steige", "4": "mache", "5": "fahre / reise", "6": "verdienen", "7": "gründen"},
    },
    18: {
        "3": {"2": "gesund", "3": "sogar", "4": "müde", "5": "schlimm", "6": "sitze", "7": "Bewegung", "8": "Übungen"},
        "10a": {"1": "soll", "2": "kann", "3": "will"},
        "13a": {"1": "Trinken Sie", "2": "Essen Sie", "3": "Machen Sie", "4": "Essen Sie", "5": "Trinken Sie", "7": "Gehen Sie", "8": "Nehmen Sie", "9": "Bleiben Sie"},
    },
}
GA_CROSSCHECKED = {
    33: {"33/5": {"3": "nach"}},
    19: {
        "19/1": {"3": "seine", "4": "ihre"},
        "19/2-Joerg": {"2": "seine", "3": "sein", "4": "seine", "5": "sein", "6": "seine"},
        "19/2-Jasmin": {"1": "ihr", "2": "ihre", "3": "ihr", "4": "ihre", "5": "ihr", "6": "ihre"},
        "19/2-Joerg-Jasmin": {"1": "ihre", "2": "ihre", "3": "ihr", "4": "ihr"},
    },
    35: {
        "35/1": {"2": "an", "3": "auf", "4": "über", "5": "unter", "6": "vor", "7": "hinter", "8": "neben", "9": "zwischen"},
        "35/2": {"1": "In", "2": "Auf", "3": "An", "4": "Auf", "5": "In", "6": "An", "7": "An", "8": "Auf"},
    },
}
ROW_CROSSCHECKED = {
    ("MOMENTE_A1_2_AB", 17, "10/b"): "question order: wollen + werden",
    ("MOMENTE_A1_2_AB", 17, "10/c"): "question order: wollt + leben",
    ("MOMENTE_A1_2_AB", 17, "10/d"): "statement bracket: will + lernen",
    ("MOMENTE_A1_2_AB", 17, "10/e"): "statement: werde + profession noun",
    ("MOMENTE_A1_2_AB", 18, "10b/1"): "statement bracket: soll + machen",
    ("MOMENTE_A1_2_AB", 18, "10b/2"): "negative statement bracket: kann + machen",
    ("MOMENTE_A1_2_AB", 18, "10b/3"): "negative statement bracket: will + machen",
    **{("GRAMMATIK_A1_DAS_TRAINING", 18, f"4/3-Sie/{n}"): feature for n, feature in enumerate([
        "formal imperative: Kommen Sie", "formal imperative: Fahren Sie", "separable formal imperative: Rufen Sie ... an",
        "formal imperative: Kommen Sie", "separable formal imperative: Füllen Sie ... aus",
        "separable formal imperative: Bringen Sie ... mit", "formal imperative: Überweisen Sie",
    ], start=1)},
}
ACTIVITY_CROSSCHECKED = {
    ("MOMENTE_A1_2_AB", 15, "7c"): "masculine accusative possessive ending",
    ("MOMENTE_A1_2_AB", 16, "6a"): "time relation: before, after, ago, and future interval",
    ("MOMENTE_A1_2_AB", 16, "6c"): "dative forms after temporal prepositions",
    ("MOMENTE_A1_2_AB", 17, "7b"): "accusative after ohne and dative after mit",
    ("MOMENTE_A1_2_AB", 18, "4"): "position of formal imperative Sie and separable verb",
}

rows = json.loads(AUDIT.read_text(encoding="utf-8"))["items"]
review = []
for row in rows:
    source = row["sourceId"]
    lesson = int(row["lessonId"][1:])
    activity, _, slot = row["sourceRef"].partition("/")
    section = KEY_SECTIONS[source]
    key = {"kind": section["kind"], "activity": activity if source == "MOMENTE_A1_2_AB" else "/".join(row["sourceRef"].split("/")[:2])}
    if source == "MOMENTE_A1_2_AB":
        key.update({"uri": section["uri"], "keyPrintedPage": section["pages"][lesson]})
        if lesson == 16 and activity in {"9a", "9b"}:
            key["keyPrintedPage"] = 4
        if lesson == 18:
            key["keyPrintedPage"] = 4 if activity in {"1a", "1b", "2", "3", "4", "5", "6a", "6b", "6c"} else 5
    elif source == "GRAMMATIK_AKTIV_A1_B1":
        key["pdfPage"] = GA_KEY_PAGES[int(activity)]
    elif source == "GRAMMATIK_A1_DAS_TRAINING":
        key["pdfPage"] = DT_KEY_PAGES[int(activity)]
    elif source == "SCHREIBEN_A1_DAS_TRAINING":
        key["pdfPage"] = SCH_KEY_PAGES[int(activity)]
    else:
        raise AssertionError(source)

    if row["decision"] == "worked_example":
        state = "printed_model_excluded"
    elif (source, lesson, row["sourceRef"]) in ROW_CROSSCHECKED:
        state = "source_row_and_publisher_solution_compared"
    elif (source, lesson, row["sourceRef"]) in ACTIVITY_CROSSCHECKED:
        state = "source_activity_and_publisher_solution_compared"
    elif source == "MOMENTE_A1_2_AB" and activity in NO_AB_KEY_ENTRY[lesson]:
        state = "publisher_no_answer_entry"
    elif source == "MOMENTE_A1_2_AB" and activity in OPEN_AB[lesson]:
        state = "publisher_open_answer"
        key["answerType"] = OPEN_AB[lesson][activity]
    elif (source, lesson, row["sourceRef"]) in OPEN_OTHER:
        state = "publisher_open_answer"
        key["answerType"] = OPEN_OTHER[(source, lesson, row["sourceRef"])]
    elif source == "MOMENTE_A1_2_AB" and slot in AB_CROSSCHECKED.get(lesson, {}).get(activity, {}):
        state = "source_slot_and_publisher_fixed_key_crosschecked"
    elif source == "GRAMMATIK_AKTIV_A1_B1" and row["sourceRef"].rsplit("/", 1)[-1] in GA_CROSSCHECKED.get(int(activity), {}).get(row["sourceRef"].rsplit("/", 1)[0], {}):
        state = "source_slot_and_publisher_fixed_key_crosschecked"
    elif source == "MOMENTE_A1_2_AB":
        state = "publisher_activity_key_located_answer_not_crosschecked"
    else:
        state = "publisher_solution_section_located_item_not_crosschecked"

    review.append({
        "sourceItemId": row["id"],
        "lessonId": row["lessonId"],
        "sourceId": source,
        "sourceRef": row["sourceRef"],
        "publisherKey": key,
        "reviewState": state,
        "a13SourceDisposition": SOURCE_DISPOSITION[row["decision"]],
        "publisherFixedAnswer": (
            AB_CROSSCHECKED.get(lesson, {}).get(activity, {}).get(slot)
            if source == "MOMENTE_A1_2_AB" else
            GA_CROSSCHECKED.get(int(activity), {}).get(row["sourceRef"].rsplit("/", 1)[0], {}).get(row["sourceRef"].rsplit("/", 1)[-1])
            if source == "GRAMMATIK_AKTIV_A1_B1" else None
        ) if state == "source_slot_and_publisher_fixed_key_crosschecked" else None,
        "publisherCheckedFeature": ROW_CROSSCHECKED.get((source, lesson, row["sourceRef"])) if state == "source_row_and_publisher_solution_compared" else None,
        "publisherCheckedActivityFeature": ACTIVITY_CROSSCHECKED.get((source, lesson, row["sourceRef"])) if state == "source_activity_and_publisher_solution_compared" else None,
        "webQuestionReady": False,
        "reviewNote": (
            "Publisher key is a model or accepts individual answers; a fixed-answer web item needs newly authored context and an independent answer review."
            if state == "publisher_open_answer" else
            "This source slot is a printed model, not a fresh question."
            if state == "printed_model_excluded" else
            "The official solution PDF has no entry for this listening, speaking, or repetition activity."
            if state == "publisher_no_answer_entry" else
            "Compared the numbered source response with the publisher key; no original book question is licensed for direct reuse and no new web question is approved by this check."
            if state == "source_slot_and_publisher_fixed_key_crosschecked" else
            "Compared the source row and publisher solution for the recorded grammar feature. The full source sentence is not copied into metadata; this does not approve a web question."
            if state == "source_row_and_publisher_solution_compared" else
            "Compared the source activity and publisher solution for the recorded grammar pattern. This activity has multiple response parts and is not itemized as a web question."
            if state == "source_activity_and_publisher_solution_compared" else
            "Key location recorded; the individual answer and any newly authored web question still need comparison."
        ),
    })

assert len(review) == len(rows) == len({entry["sourceItemId"] for entry in review})
payload = {
    "schemaVersion": 1,
    "auditDate": "2026-10-21",
    "scope": "Publisher-key review of 545 source audit units, not a bank of 545 learner questions.",
    "keySections": KEY_SECTIONS,
    "countByReviewState": dict(Counter(entry["reviewState"] for entry in review)),
    "countBySourceDisposition": dict(Counter(entry["a13SourceDisposition"] for entry in review)),
    "webQuestionReadyCount": 0,
    "items": review,
}
OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {len(review)} publisher-key review records to {OUT.relative_to(ROOT)}")
