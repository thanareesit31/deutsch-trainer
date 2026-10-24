"""Build the internal, visual-checked source item ledger for A1.3.

Descriptions record exercise mechanics, never reproduce the source questions.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs/exercise-mapping/a13-item-level-source-audit.json"
rows: list[dict] = []


def record(source: str, lesson: int, printed: int, pdf: int, activity: str,
           items: str, mechanic: str, target: str, decision: str,
           web: str, note: str = "", label_kind: str = "printed") -> None:
    """Expand numbered responses; a dash keeps one activity-level record."""
    if items == "-":
        labels = [""]
    elif "-" in items and items.replace("-", "").isdigit():
        first, last = map(int, items.split("-"))
        labels = [str(number) for number in range(first, last + 1)]
    else:
        labels = items.split(",")
    for label in labels:
        ref = f"{activity}/{label}" if label else activity
        rows.append({
            "id": f"{source}-L{lesson}-{ref.replace('/', '-')}",
            "sourceId": source,
            "lessonId": f"L{lesson}",
            "printedPage": printed,
            "pdfPage": pdf,
            "sourceRef": ref,
            "granularity": ("numbered_group" if label and activity == "9/1" else "response_slot") if label else "activity_or_subactivity",
            "labelKind": label_kind if label else "activity_label",
            "itemizationStatus": "response_identified" if label else "activity_only",
            "mechanic": mechanic,
            "target": target,
            "decision": decision,
            "webAdaptation": web,
            "auditNote": note,
            "inspectionStatus": "visual_verified",
            "answerKeyStatus": "see_a13-publisher-key-review.json",
        })


AB = "MOMENTE_A1_2_AB"
GA = "GRAMMATIK_AKTIV_A1_B1"
DT = "GRAMMATIK_A1_DAS_TRAINING"
SCH = "SCHREIBEN_A1_DAS_TRAINING"

# Momente Arbeitsbuch L15, printed pages 14-17; PDF pages 13-16.
record(AB,15,14,13,"1a","-","complete_opinion_comment","phrases: housing opinions","adapt","contextual_choice","Opinion adjectives, not possessive forms")
record(AB,15,14,13,"1b","-","write_opinion_comment","writing: housing opinions","adapt","guided_writing")
record(AB,15,14,13,"2","-","comment_on_partner_photo","speaking and writing","asset_required","guided_writing","Requires a newly authored image")
record(AB,15,14,13,"3","-","match_home_parts_to_pictures","vocabulary: rooms and articles","adapt","image_match")
record(AB,15,15,14,"4","-","picture_crossword","vocabulary: household objects","adapt","image_word_recall")
record(AB,15,15,14,"5","-","position_wordbank_cloze","vocabulary: spatial adverbs","adapt","wordbank_cloze")
record(AB,15,15,14,"6a","-","write_plural_then_listen","vocabulary: plural forms","asset_required","plural_input","New audio required for listening component")
record(AB,15,15,14,"6b","-","listen_repeat_poem","pronunciation","asset_required","audio_repeat","New audio required")
record(AB,15,15,14,"6c","-","write_poem","creative writing","review_only","open_writing","Requires a human or rubric review")
record(AB,15,16,15,"7a","1-8","picture_possessive_cloze","grammar: sein/ihr, nominative","in_scope","possessive_form_choice","Eight unnumbered table cells; slot 1 is printed as a model", "internal_table_slot")
record(AB,15,16,15,"7b","1-8","picture_possessive_cloze","grammar: sein/ihr, accusative","in_scope","possessive_form_input","Eight unnumbered table cells; slot 1 is printed as a model", "internal_table_slot")
record(AB,15,16,15,"7c","-","compare_possessive_endings","grammar: gender and case contrast","in_scope","ending_pattern_mark")
record(AB,15,16,15,"8a","-","trace_owner_to_object_and_complete","grammar: owner referent and possessive form","adapt","owner_object_match","New artwork required")
record(AB,15,16,15,"8b","-","write_object_opinion","grammar and writing: possessive in an opinion","adapt","guided_sentence")
record(AB,15,17,16,"9","-","hidden_words_and_question_cloze","vocabulary: housing questions","adapt","word_recall")
record(AB,15,17,16,"10","-","match_advert_abbreviation","reading: housing adverts","adapt","term_meaning_match")
record(AB,15,17,16,"11","-","listen_then_write_housing_email","listening and writing","asset_required","audio_then_email","New audio and assessment rubric required")
record(AB,15,17,16,"12","-","odd_one_out","vocabulary: housing","adapt","odd_one_out")
record(AB,15,17,16,"13","-","wordbank_blog_cloze","reading and vocabulary: housing","adapt","context_cloze")

# Momente Arbeitsbuch L16, printed pages 26-29; PDF pages 25-28.
record(AB,16,26,25,"1a","-","choose_problem_reaction","phrases: service problems","adapt","situation_choice")
record(AB,16,26,25,"1b","-","write_reaction_from_cues","phrases and writing","adapt","guided_sentence")
record(AB,16,26,25,"2a","-","order_emergency_dialogue","phrases: asking for help","adapt","dialogue_order")
record(AB,16,26,25,"2b","-","match_follow_up_reply","phrases: conversation response","adapt","dialogue_match")
record(AB,16,27,26,"3a","-","listen_match_fault_and_helper","listening: service problems","asset_required","audio_picture_match","New audio required")
record(AB,16,27,26,"3b","-","note_faults_from_listening","listening and writing","asset_required","audio_note","Depends on 3a")
record(AB,16,27,26,"4a","-","hear_o_u_vowels","pronunciation","asset_required","audio_discrimination","New audio required")
record(AB,16,27,26,"4b","-","complete_o_u_and_repeat","pronunciation and spelling","asset_required","audio_spelling","New audio required")
record(AB,16,27,26,"4c","-","write_and_say_short_dialogues","speaking","review_only","guided_speaking","Needs speaking assessment")
record(AB,16,28,27,"5a","-","note_replies_in_emergency_call","listening and phrases","asset_required","audio_dialogue","New audio required")
record(AB,16,28,27,"5b","-","listen_and_respond","listening and speaking","asset_required","audio_response","New audio required")
record(AB,16,28,27,"6a","-","timeline_preposition_table","grammar: in/vor/nach meaning","in_scope","timeline_sort")
record(AB,16,28,27,"6b","1-6","choose_temporal_preposition_in_text","grammar: in/vor/nach meaning","in_scope","context_preposition_choice","Slot 1 is printed as a model")
record(AB,16,28,27,"6c","-","complete_dative_endings_table","grammar: temporal prepositions and dative","in_scope","ending_table")
record(AB,16,29,28,"7","a,b,c,d,e,f,g,h,i","temporal_ending_cloze","grammar: in/vor/nach plus dative","in_scope","two_part_cloze","Printed labels are letters a-i; a is a worked example. Separate meaning and ending in feedback")
record(AB,16,29,28,"8a","-","match_appointment_message_reply","reading: appointment messages","adapt","message_match")
record(AB,16,29,28,"8b","-","mark_reschedule_functions","phrases: cancel, defer, propose","adapt","function_tag")
record(AB,16,29,28,"8c","-","record_reschedule_message","speaking: reschedule","asset_required","record_short_message","Needs new scenario and speaking assessment")
record(AB,16,29,28,"9a","-","complete_work_email_from_phrases","writing: appointment email","adapt","guided_email")
record(AB,16,29,28,"9b","-","write_email_reply","writing: appointment reply","review_only","open_email","Needs a rubric or human review")

# Momente Arbeitsbuch L17, printed pages 30-33; PDF pages 29-32.
record(AB,17,30,29,"1a","-","read_statements_match_job_images","reading: future jobs","adapt","image_text_match")
record(AB,17,30,29,"1b","du,er-sie-es","complete_werden_table","grammar: werden present tense","in_scope","conjugation_table","Two unnumbered empty cells; ich is printed as a model", "internal_table_row")
record(AB,17,30,29,"2","1-7","interview_wordbank_cloze","grammar: werden in context","in_scope","form_choice","Slot 1 is printed as a model")
record(AB,17,31,30,"3","-","match_expression_to_paraphrase","phrases: life plans","adapt","meaning_match")
record(AB,17,31,30,"4","-","complete_plan_dialogue","phrases: life plans","adapt","dialogue_cloze")
record(AB,17,31,30,"5a","-","answer_chat_from_coursebook","reading and writing","review_only","short_answer","Needs the linked coursebook source text")
record(AB,17,31,30,"5b","-","write_question_about_coursebook_text","reading and writing","review_only","question_writing","Needs the linked coursebook source text")
record(AB,17,32,31,"6a","-","hear_international_words","pronunciation","asset_required","audio_discrimination","New audio required")
record(AB,17,32,31,"6b","-","translate_international_words","vocabulary","adapt","meaning_recall")
record(AB,17,32,31,"7a","1-7","complete_mit_ohne_in_adverts","grammar: mit plus dative, ohne plus accusative","in_scope","preposition_choice")
record(AB,17,32,31,"7b","-","complete_mit_ohne_article_table","grammar: case after mit/ohne","in_scope","case_table")
record(AB,17,32,31,"8","a,b,c,d,e,f","choose_possessive_ending","grammar: mit/ohne plus possessive article","partial","form_choice","Some noun forms add a second learning burden")
record(AB,17,33,32,"9","1-7","complete_wollen_dialogue","grammar: wollen present tense","in_scope","form_input")
record(AB,17,33,32,"10","a,b,c,d,e","order_cued_sentence","grammar: wollen or werden word order","in_scope","word_order")
record(AB,17,33,32,"11a","-","match_plan_phrase_to_verb","vocabulary and writing","adapt","phrase_match")
record(AB,17,33,32,"11b","1-7","complete_plan_blog","writing: plans and experience","partial","guided_cloze","Includes tense and vocabulary outside the grammar target")
record(AB,17,33,32,"11c","-","write_own_plan_blog","writing","review_only","open_writing","Needs writing rubric")

# Momente Arbeitsbuch L18, printed pages 34-37; PDF pages 33-36.
record(AB,18,34,33,"1a","-","match_picture_to_comment","reading: health situations","adapt","picture_comment_match")
record(AB,18,34,33,"1b","-","write_opinion_comments","writing: health situations","review_only","open_writing","Needs rubric")
record(AB,18,34,33,"2","-","find_and_sort_health_words","vocabulary: health and fitness","adapt","category_sort")
record(AB,18,34,33,"3","1-8","choose_word_in_health_dialogue","vocabulary and reading","adapt","dialogue_choice")
record(AB,18,35,34,"4","-","mark_sentence_endings_and_complete","grammar: formal imperative position","in_scope","sentence_pattern")
record(AB,18,35,34,"5","-","write_three_formal_advice_sentences","grammar: Imperativ Sie","in_scope","guided_sentence","Multiple sensible tips need accepted variants")
record(AB,18,35,34,"6a","-","hear_intonation_mark","pronunciation: formal imperative","asset_required","audio_intonation","New audio required")
record(AB,18,35,34,"6b","1-6","add_punctuation_from_audio","pronunciation and formal imperative","asset_required","audio_punctuation","New audio required")
record(AB,18,35,34,"6c","-","listen_repeat","pronunciation","asset_required","audio_repeat","New audio required")
record(AB,18,35,34,"7a","-","body_part_word_cards","vocabulary: body parts","adapt","picture_word_match","New artwork required")
record(AB,18,35,34,"7b","-","send_body_part_picture","vocabulary and speaking","review_only","image_prompt","Not a core grammar response")
record(AB,18,36,35,"8","-","picture_cued_symptom_sentences","phrases: describing symptoms","adapt","guided_sentence")
record(AB,18,36,35,"9a","-","sort_speaker_lines","phrases: health advice","adapt","dialogue_order")
record(AB,18,36,35,"9b","-","write_health_dialogue","speaking and writing","review_only","guided_dialogue","Multiple valid responses")
record(AB,18,36,35,"10a","1-3","order_kann_soll_will_comic","grammar: modal meaning","partial","situation_choice","Only the sollen slot directly trains target modal")
record(AB,18,37,36,"10b","1-3","complete_modal_position_table","grammar: sollen and infinitive bracket","in_scope","sentence_pattern","Each printed numbered row requires multiple parts; row 1 has only partial model text")
record(AB,18,37,36,"11","-","write_reported_doctor_advice","grammar: sollen plus infinitive","in_scope","guided_sentence")
record(AB,18,37,36,"12","a,b,c,d","match_remedy_to_symptom","vocabulary: health remedies","adapt","meaning_match")
record(AB,18,37,36,"13a","1-9","complete_formal_imperative_letters","grammar: Imperativ Sie","in_scope","verb_form_input")
record(AB,18,37,36,"13b","-","record_or_tell_health_tips","speaking: formal advice","asset_required","record_short_message","Needs recording and speaking assessment")

# Grammatik aktiv. PDF page is four lower than the printed page on every cited pair below.
record(GA,13,46,42,"17/1","1-12","definite_accusative_article_cloze","review: accusative articles","review_only","article_choice","No es gibt structure")
record(GA,13,46,42,"17/2","1-9","indefinite_accusative_article_cloze","review: accusative articles","review_only","article_choice","No es gibt structure")
record(GA,13,54,50,"21/3","1-6","replace_dative_noun_with_pronoun","dative pronoun","partial","pronoun_choice","Also requires an accusative object")
record(GA,13,55,51,"21/4","1-6","answer_with_dative_pronoun","dative pronoun in health expression","review_only","short_answer")
record(GA,13,58,54,"23/1","1-4","picture_sentence_with_dative","dative verb","exclude_level","sentence_order","Chapter is marked A2; only mechanics may inform an original A1 prompt")
record(GA,13,58,54,"23/2","1-7","cue_sentence_with_dative","dative verb","exclude_level","sentence_order","Chapter is marked A2; only mechanics may inform an original A1 prompt")
record(GA,13,59,55,"23/3","1-6","sentence_transformation","dative verb","exclude_level","guided_sentence","Chapter is marked A2; some helfen/danken content overlaps but the printed task exceeds A1 scope")
record(GA,13,59,55,"23/5","1-8","sentence_transformation","dative verb","exclude_level","guided_sentence","Chapter is marked A2; do not put source items into A1 practice")
record(GA,14,82,78,"33/1","1-7","preposition_wordbank_cloze","review: prepositions with dative","partial","preposition_choice","Most items are not static position")
record(GA,14,86,82,"35/1","1-9","picture_position_label","grammar: Wo plus dative","in_scope","picture_preposition_choice","Requires new illustrations")
record(GA,14,86,82,"35/2","1-8","static_location_dialogue_cloze","grammar: static preposition","in_scope","preposition_choice")
record(GA,14,87,83,"35/3","1-11","static_location_ending_cloze","grammar: Wo plus dative","partial","preposition_article_cloze","Some forms are in a denser text")
record(GA,14,87,83,"35/4","1-12","picture_cued_location_sentence","grammar: static position","exclude_level","sentence_order","Printed A2 marker")
record(GA,14,88,84,"36/1","1-9","picture_motion_location_phrase","Wo versus Wohin","exclude_level","picture_preposition_choice","Printed A2 marker; adds direction with accusative")
record(GA,15,50,46,"19/1","1-8","possessive_article_cloze","grammar: possessive stem, nominative","partial","possessive_form_choice","Only sein/ihr items match L15 narrow target")
record(GA,15,51,47,"19/2-Joerg","1-6","owner_picture_possessive_cloze","grammar: sein, nominative","in_scope","possessive_form_choice","Joerg is a printed owner group within exercise 2, not a publisher subexercise label", "internal_group_slot")
record(GA,15,51,47,"19/2-Jasmin","1-6","owner_picture_possessive_cloze","grammar: ihr, nominative","in_scope","possessive_form_choice","Jasmin is a printed owner group within exercise 2, not a publisher subexercise label", "internal_group_slot")
record(GA,15,51,47,"19/2-Joerg-Jasmin","1-4","owner_picture_possessive_cloze","grammar: ihr/sein, nominative plural","partial","possessive_form_choice","Combined-owner group; select only items fitting the L15 target", "internal_group_slot")
record(GA,15,51,47,"19/3","1-8","dialogue_possessive_cloze","grammar: possessive stem, nominative","partial","possessive_form_choice","Also includes other persons")
record(GA,15,51,47,"19/5","1-16","mixed_case_possessive_cloze","grammar: possessive forms","exclude_level","possessive_form_input","Printed A2 marker")
record(GA,16,80,76,"32/1","1-12","time_expression_preposition_cloze","review: am/im/um","review_only","time_choice","Does not target in/vor/nach contrast")
record(GA,16,80,76,"32/2","1-15","time_context_preposition_cloze","grammar: time relations","partial","preposition_choice","Only a minority of slots use the L16 target forms")
record(GA,16,81,77,"32/6","1-7","temporal_context_cloze","grammar: vor/nach and other time words","exclude_level","preposition_choice","Printed A2 marker")
record(GA,16,83,79,"33/5","1-3","temporal_preposition_cloze","grammar: nach dem Essen","partial","preposition_choice","Only item 3 is target; others are seit and zum")
record(GA,17,20,16,"6/2","1-6","wollen_moechten_choice","grammar: wish versus request","partial","modal_choice","Some items permit both; accept alternatives")
record(GA,17,21,17,"6/3","1-3","wollen_koennen_context_cloze","grammar: will versus ability","partial","modal_choice","Mixed modal focus")
record(GA,17,82,78,"33/2","1-4","bei_mit_choice","grammar: mit plus dative","partial","preposition_choice","Not every item tests mit")
record(GA,17,84,80,"34/1","1-5","accusative_preposition_picture_cloze","grammar: ohne plus accusative","partial","preposition_choice","Only item 4 explicitly tests ohne")
record(GA,17,85,81,"34/3","1-5","preposition_article_cloze","grammar: ohne plus accusative","partial","two_part_cloze","Only item 5 explicitly tests ohne")
record(GA,18,26,22,"9/1","1-5","make_three_imperative_persons","grammar: formal imperative Sie","partial","imperative_form_input","Each line has several verbs; use only formal form")
record(GA,18,27,23,"9/2","-","form_formal_imperative_from_cues","grammar: formal imperative Sie","in_scope","guided_sentence","Open word bank, no printed item numbers")
record(GA,18,27,23,"9/3","1-7","identify_imperative_addressee","grammar: formal versus informal imperative","partial","person_choice")
record(GA,18,27,23,"9/4","1-9","write_health_advice_imperative","grammar: Imperativ Sie","exclude_level","guided_sentence","Printed A2 marker")

# Grammatik A1 - das Training. PDF/printed offsets vary in this scan.
record(DT,13,51,51,"28/2","1-8","match_verb_accusative_object","review: accusative case","review_only","sentence_match","No es gibt construction")
record(DT,14,59,59,"34/1-Verkehr","1-8","choose_preposition_in_route_context","route language and preposition case","partial","preposition_choice","Mixed Wo, Wohin, time, and transport")
record(DT,14,61,61,"36/1","1-11","local_preposition_cloze","static location and direction","partial","preposition_choice","Select Wo items only")
record(DT,15,54,54,"30/1","-","identify_possessive_owner","grammar: owner referent","partial","owner_choice","Contains other possessive stems and dative forms")
record(DT,16,60,60,"35/1","1-12","temporal_preposition_cloze","grammar: in/vor/nach and other time words","partial","preposition_choice","Slots 5 and 7 involve an event relation; context may permit more than one temporal relation")
record(DT,17,26,25,"16/2","-","present_tense_verb_cloze","review: present conjugation","review_only","verb_form_input","No werden target")
record(DT,17,29,28,"17/1","-","irregular_verb_table","review: present conjugation","review_only","conjugation_table","No werden target")
record(DT,17,59,59,"34/1-Beruf","1-8","preposition_choice","grammar: mit/ohne mixed with time","partial","preposition_choice","Only target occurrences can be adapted")
record(DT,18,12,11,"4/3-Sie","1-7","formal_imperative_from_cues","grammar: Imperativ Sie","in_scope","guided_sentence","Items 3, 5, 6, 7 include separable verbs")
record(DT,18,45,45,"24/1","1-18","write_imperative_three_persons","grammar: Imperativ Sie","partial","imperative_form_input","Use only formal form of each item")
record(DT,18,38,37,"21/examples","-","modal_meaning_examples","grammar: meaning of sollen","review_only","rule_card","Not an exercise")
record(DT,18,39,38,"21/1","1-14","choose_modal_from_context","grammar: modal meaning","partial","situation_choice","Instruction allows two correct options in some cases")
record(DT,18,39,38,"21/2","1-5","complete_modal_in_context","grammar: modal meaning","partial","modal_choice","Instruction explicitly allows several solutions")

# Schreiben A1 - das Training: writing and situation mechanics, not a grammar key.
record(SCH,16,23,19,"6/1a","-","order_appointment_messages_by_calendar","writing: appointment sequence","adapt","message_order","Eight message cards; calendar is the source context")
record(SCH,16,23,19,"6/1b","-","enter_appointment_in_calendar","reading: date and time","adapt","calendar_entry")
record(SCH,16,24,20,"6/2a","-","write_appointment_message","writing: propose appointment","review_only","guided_message","Needs accepted variants or human review")
record(SCH,16,24,20,"6/2b","-","write_appointment_reply","writing: appointment reply","review_only","guided_message","Needs accepted variants or human review")
record(SCH,14,36,32,"10/1","-","form_route_search_query","reading: map search","adapt","search_query_choice")
record(SCH,14,36,32,"10/2","-","name_transport_options","vocabulary: travel","adapt","word_picture_match")
record(SCH,14,36,32,"10/3","-","order_scrambled_route_words","writing: route sentence order","adapt","word_order")
record(SCH,14,37,33,"10/4","1-3","complete_route_dialogue","phrases: asking directions","adapt","dialogue_cloze","Printed dialogues; individual blanks require a separate transcription audit")
record(SCH,14,37,33,"10/5","1-3","complete_direction_word","phrases: direction words","adapt","word_choice")
record(SCH,14,38,34,"10/6a","-","order_route_message_sentences","writing: route message","adapt","sentence_order")
record(SCH,14,39,35,"10/6b","-","order_route_message_sentences","writing: route message","adapt","sentence_order")
record(SCH,14,40,36,"10/7a","-","trace_route_from_text","reading: route and map","asset_required","map_path","Create a new map for web use")
record(SCH,14,40,36,"10/7b","1-5","write_route_from_sentence_cues","writing: route sequence","adapt","guided_route","Open answers need accepted variants")
record(SCH,18,49,45,"14/1","-","label_medicine_from_picture","vocabulary: health","asset_required","picture_word_match","Create new artwork")
record(SCH,18,49,45,"14/2","-","match_remedy_to_symptom","vocabulary: health advice","adapt","situation_match")
record(SCH,18,49,45,"14/3","-","unscramble_health_words","vocabulary: health","adapt","word_order")
record(SCH,18,49,45,"14/4","-","sort_doctor_patient_phrases","phrases: doctor visit","adapt","speaker_sort")
record(SCH,18,50,46,"14/5","a,b,c,d,e,f,g","complete_doctor_dialogue","phrases: doctor visit","adapt","dialogue_cloze","Do not treat every blank as sollen practice")
record(SCH,18,50,46,"14/6","-","extract_medicine_schedule","reading: dosage and time","adapt","information_table")
record(SCH,18,50,46,"14/7","-","complete_spelling_fragments","vocabulary: health","adapt","word_input")
record(SCH,18,56,52,"17/7a","1-6","complete_work_email","writing: work instructions","partial","context_cloze","One slot includes sollen; workplace context is separate from L18 health")
record(SCH,18,56,52,"17/7b","-","order_work_email_sentences","writing: email structure","adapt","sentence_order")
record(SCH,18,56,52,"17/8","-","write_positive_negative_reply","writing: work email","review_only","guided_email","Needs a rubric or accepted variants")

# A response shown as a worked example is evidence of a mechanic, not a new item.
worked_examples = {
    f"{GA}-L13-17-1-1", f"{GA}-L13-17-2-1",
    f"{GA}-L14-35-1-1", f"{DT}-L18-24-1-1",
    f"{GA}-L15-19-2-Joerg-1",
    f"{AB}-L15-7a-1", f"{AB}-L15-7b-1",
    f"{AB}-L16-6b-1", f"{AB}-L16-7-a",
    f"{AB}-L17-2-1", f"{AB}-L17-7a-1",
    f"{AB}-L17-9-1", f"{AB}-L17-10-a", f"{AB}-L17-11b-1",
    f"{AB}-L18-3-1", f"{AB}-L18-13a-6",
}
for row in rows:
    if row["granularity"] == "numbered_group":
        row["itemizationStatus"] = "group_contains_multiple_responses"
    if row["sourceId"] == AB and row["sourceRef"].startswith("10b/") and row["lessonId"] == "L18":
        row["itemizationStatus"] = "row_contains_multiple_response_parts"
    if row["sourceId"] == DT and row["lessonId"] == "L18" and row["sourceRef"] in {"21/1/1", "21/2/1", "21/2/4", "21/2/5"}:
        row["itemizationStatus"] = "row_contains_multiple_response_parts"
        row["auditNote"] = (row["auditNote"] + "; " if row["auditNote"] else "") + "This numbered line has more than one response; separate the parts before web authoring"
    if row["id"] in worked_examples:
        row["decision"] = "worked_example"
        row["auditNote"] = (row["auditNote"] + "; " if row["auditNote"] else "") + "Printed worked example; exclude from item pool"
    if row["sourceId"] == AB and row["lessonId"] == "L18" and row["sourceRef"] == "10b/1":
        row["auditNote"] += "; partial printed model: subject and object shown, modal and infinitive remain to be supplied"
    if row["sourceId"] == GA and row["lessonId"] == "L16" and row["sourceRef"].startswith("33/5/"):
        row["decision"] = "in_scope" if row["sourceRef"] == "33/5/3" else "review_only"
    if row["sourceId"] == GA and row["lessonId"] == "L16" and row["sourceRef"].startswith("32/2/"):
        row["decision"] = "partial" if row["sourceRef"] == "32/2/7" else "review_only"
        row["auditNote"] = "Only slot 7 involves a relation to a named event; it still needs context to disambiguate vor/nach" if row["sourceRef"] == "32/2/7" else "Time-of-day, date, month, season, or interval review outside the L16 in/vor/nach contrast"
    if row["sourceId"] == GA and row["lessonId"] == "L15" and row["sourceRef"].startswith("19/1/"):
        row["decision"] = "in_scope" if row["sourceRef"] in {"19/1/3", "19/1/4"} else "review_only"
        row["auditNote"] = "Owner is Thomas or Judy; sein/ihr with nominative noun" if row["decision"] == "in_scope" else "Other possessive owner than singular er/sie in the L15 target"
    if row["sourceId"] == DT and row["lessonId"] == "L16" and row["sourceRef"].startswith("35/1/"):
        row["decision"] = "worked_example" if row["sourceRef"] == "35/1/1" else ("partial" if row["sourceRef"] in {"35/1/5", "35/1/7"} else "review_only")
        row["auditNote"] = "Printed worked example" if row["decision"] == "worked_example" else ("Event-relative time expression; original context can allow competing temporal readings" if row["decision"] == "partial" else "Other temporal preposition or date/time review")
    if row["sourceId"] == GA and row["lessonId"] == "L17" and row["sourceRef"].startswith("34/1/"):
        row["decision"] = "partial" if row["sourceRef"] == "34/1/4" else "review_only"
    if row["sourceId"] == GA and row["lessonId"] == "L17" and row["sourceRef"].startswith("34/3/"):
        row["decision"] = "partial" if row["sourceRef"] == "34/3/5" else "review_only"

ids = [row["id"] for row in rows]
if len(ids) != len(set(ids)):
    raise SystemExit("Duplicate source item id in audit")
payload = {
    "schemaVersion": 1,
    "auditDate": "2026-10-21",
    "scope": "Selected A1.3-relevant, visually checked source activities and numbered responses. This is source mapping, not copied web question content or an independently verified answer key.",
    "itemizationLimit": "An activity_or_subactivity record is not proof that the page contains only one answer. Only response_identified records isolate a response slot. Internal table/group labels are indexing aids, not printed exercise numbers.",
    "publisherAnswerKeyStatus": "Publisher key locations and per-record review states are in a13-publisher-key-review.json. The supplied Kursbuch excerpt lacks its referenced solutions page 105; Hueber publishes separate Kursbuch and Arbeitsbuch keys online.",
    "sources": {
        AB: "Momente A1.2 Arbeitsbuch, original PDF pages 13-16 and 25-36",
        GA: "Grammatik aktiv A1-B1, 2. aktualisierte Ausgabe, original PDF supplied by user",
        DT: "Grammatik A1 - das Training, scanned original PDF",
        SCH: "Schreiben A1 - das Training, scanned original PDF",
    },
    "decisionLegend": {
        "in_scope": "The underlying skill matches the lesson; write original web content and verify answers before publication.",
        "partial": "Only named slots or part of the mechanic match; filter prerequisites and difficulty.",
        "adapt": "The activity skill fits another practice category; replace source wording and assets.",
        "review_only": "Useful as review or reference, not a main target item for this lesson.",
        "asset_required": "Requires new audio, art, or an assessment method before a web exercise exists.",
        "exclude_level": "The publisher labels the exercise A2, or it adds a higher-level skill.",
        "worked_example": "The book prints this response as a model; do not count it as a fresh task.",
    },
    "countBySource": dict(Counter(row["sourceId"] for row in rows)),
    "items": rows,
}
OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {len(rows)} audited source records to {OUT.relative_to(ROOT)}")
