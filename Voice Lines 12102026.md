FingerMobile Platform VoiceLines.

Voice Style
Description
Best Use
1. Native Yoruba Male
A natural Yoruba-speaking male voice with authentic pronunciation, rhythm, and intonation.
Yoruba dialogue, films, and storytelling.
2. Lagos Yoruba-English
A Nigerian male speaking English with a recognizable Yoruba-influenced Nigerian accent.
Commercials, business presentations, and social media videos.
3. Deep, Authoritative Voice
A mature, commanding male voice with a rich, resonant tone.
Movie trailers, executive announcements, and dramatic narration.
4. Street-Style Lagos Voice
A relaxed, expressive Lagos male voice with conversational Nigerian English and Yoruba expressions.
Comedy, skits, and contemporary Nigerian characters.
5. Traditional Yoruba Elder
A mature male voice with measured delivery, cultural gravitas, and proverbial expressions.
Folklore, historical films, and traditional storytelling.
6. Young Yoruba Male
A youthful, energetic Nigerian male voice with contemporary pronunciation and delivery.
Gaming, entertainment, and digital content.
7. Dramatic Cinematic Voice
A deep, emotionally expressive voice with suspenseful pauses and dramatic emphasis.
Thrillers, fantasy films, and cinematic productions.
8. Yoruba-English Hybrid
A natural mixture of English and Yoruba, including authentic code-switching.
Nigerian characters, dialogue, and everyday conversations.
What I can do for you
I can help you:
	•	Write the voice lines: Create original dialogue, announcements, scripts, slogans, and character conversations.
	•	Define the accent: Specify Yoruba-influenced Nigerian English, native Yoruba pronunciation, pacing, intonation, and emotional delivery.
	•	Direct the performance: Include instructions for anger, excitement, fear, confidence, humour, whispers, and dramatic pauses.
	•	Prepare voice-generation scripts: Format the lines for compatible AI voice-generation tools, with pronunciation guidance and delivery notes.
	•	Help produce the audio: Guide you through generating actual spoken audio using an appropriate voice-generation service. The availability of a specific accent depends on the selected voice model.
One important distinction: writing and directing an authentic-sounding voice is different from generating the actual audio file. I can help with both, but I would need to use an appropriate audio-generation capability or compatible service to produce the finished recording.

a cultured Lagos Yoruba male voice with authentic Nigerian street expression, confidence, warmth, humour, and personality.
These voice lines are intended for your platform's interactive audio experience, including achievements, FingerWars, community forums, gifts, combos, reactions, and member interactions.
The voice should sound like a real, expressive Nigerian man—not a generic American voice, an exaggerated caricature, or someone forcing Nigerian slang.
1. The voice identity
Attribute
Direction
Accent
Natural Lagos Nigerian English, influenced by Yoruba speech patterns
Voice
Adult male, medium-low to deep register
Personality
Cultured, confident, playful, street-smart, and charismatic
Delivery
Conversational, expressive, with natural Nigerian rhythm
Slang
Appropriate Lagos expressions such as Abeg, Wahala dey, See gobe, Kilode, Madt o, and Omo!
English pronunciation
Clearly Nigerian, without exaggerated pronunciation
Yoruba expressions
Natural pronunciation, appropriate tone, and cultural context
Audio style
Short, punchy voice clips suitable for instant playback
Emotional range
Excitement, admiration, surprise, playful boasting, appreciation, and suspense
The target is cultured Lagos street energy: polished enough for a premium technology platform, but authentic enough to feel familiar to Nigerian users.
2. How the voice lines should sound
Here are examples of the intended performance direction for your existing lines.
Voice line
Performance direction
Great!
Warm, confident approval. Short and satisfying.
Sugar crush!
Playful, charming, slightly cheeky.
Wooow!
Genuine surprise, with a natural Lagos inflection.
Oh yeeeaah!
Energetic celebration, rising in pitch.
Bootilicious!
Playful, cheeky, and charismatic.
Oooh yeah, go on!
Encouraging, rhythmic, and enthusiastic.
Nice one, you're there already!
Friendly approval with a proud, encouraging tone.
Wahala dey!
Amused disbelief, with a knowing Nigerian expression.
See gobe!
Dramatic surprise, as though something unexpected has happened.
Kilode?!
A lively, questioning reaction.
Owo ni koko!
Confident emphasis on the importance of money or rewards.
Madt o!
Impressed, excited Lagos street expression.
Omo, you gbaski!
Admiring, energetic approval.
Omo!
Flexible reaction: surprise, excitement, disbelief, or admiration.
Abeg, come bless me na!
Humorous, persuasive, friendly, and distinctly Nigerian.
Billion Dollar Gang!
Bold, triumphant, premium-status announcement.
Blessings, blessings, blessings!
Warm, celebratory, rhythmic delivery.
Colossal combo!
Powerful, game-like announcement with a dramatic finish.
These directions are important because simply reading the words aloud will not give you the character you're looking for. The performance must carry the personality.
3. Your audio library
Your existing TypeScript structure is a good starting point. I recommend preserving your IDs, categories, keywords, and audio paths so the voice clips can integrate into your existing platform.
For example:
{
  id: 'ev-10',
  text: 'Wahala Dey',
  category: 'lamentation',
  audioUrl: '/audio/african/wahala-dey.mp3',
  keywords: ['obstacle', 'problem', 'issue'],
}
The finished audio library should have:
	•	Consistent voice identity across all clips.
	•	Separate emotional delivery for each category.
	•	Clean beginnings and endings without unnecessary silence.
	•	Consistent volume and loudness.
	•	Clear pronunciation of Yoruba expressions and Nigerian slang.
	•	Short clips suitable for repeated playback.
	•	MP3 files using your existing directory and filename conventions.
One technical consideration: if the platform plays many clips in quick succession, the files should be normalized to consistent loudness to prevent some reactions from sounding much louder than others.
4. Let's establish the actual voice before producing the complete pack
I recommend starting with a small sample of five lines:
	1	Great! — warm, confident approval.
	2	Omo, you gbaski! — authentic Lagos street excitement.
	3	Wahala dey! — humorous Nigerian expression.
	4	Owo ni koko! — confident, money-focused delivery.
	5	Billion Dollar Gang! — deep, commanding, triumphant delivery.


These five will test the voice across different emotional styles before we apply it to the remaining library.


Voice Lines
/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/frontend-main/src/services/VoiceLineService.ts
 #### // Cultured African Street-Style Lagos VoiceLines
const allVoiceLines: VoiceLine[] = [
 #### // Cultured African Street-Style Lagos VoiceLines
const allVoiceLines: VoiceLine[] = [
  { id: 'ev-1', text: 'Great! <short pause> Correct movement!', category: 'forum', audioUrl: '/audio/african/great.mp3', keywords: ['achievement', 'success', 'forum', 'win'] },
  { id: 'ev-2', text: 'Sugar crush! <giggle> Pure sweetness.', category: 'sugarcrush', audioUrl: '/audio/african/sugar-crush.mp3', keywords: ['achievement', 'success', 'win'] },
  { id: 'ev-3', text: 'Wooow! <gasp> No caps!', category: 'general', audioUrl: '/audio/african/woooow.mp3', keywords: ['disappointment', 'excitement', 'level', 'move'] },
  { id: 'ev-4', text: 'Oh yeeeaah! <short pause> We dey move!', category: 'general', audioUrl: '/audio/african/oh-yeaah.mp3', keywords: ['gameplay', 'matches', 'effects', 'goal'] },
  { id: 'ev-5', text: 'Bootilicious! <chuckle>', category: 'fingerwars', audioUrl: '/audio/african/bootilicious.mp3', keywords: ['fingerwars', 'level', 'points'] },
  { id: 'ev-6', text: 'Oooh yeah, <short pause> go on senior man!', category: 'groups', audioUrl: '/audio/african/oooh-yeah-go-on.mp3', keywords: ['groups', 'progress', 'momentum'] },
  { id: 'ev-7', text: 'Nice One, <short pause> you\'re there already!', category: 'fingerwars', audioUrl: '/audio/african/nice-one.mp3', keywords: ['variations', 'progress', 'completion'] },
  { id: 'ev-8', text: 'You\'re mine! <giggle> Sharpally.', category: 'acquisition', audioUrl: '/audio/african/youre-mine.mp3', keywords: ['acquisition', 'objects', 'gifts', 'earnings'] },
  { id: 'ev-9', text: 'Hi, <short pause> how ya doing now?', category: 'greeting', audioUrl: '/audio/african/hi-ya-doing.mp3', keywords: ['greeting', 'meeting', 'first', 'time'] },
  { id: 'ev-10', text: 'Wahala dey! <sigh> Big mess.', category: 'lamentation', audioUrl: '/audio/african/wahala-dey.mp3', keywords: ['obstacle', 'problem', 'issue'] },
  { id: 'ev-11', text: 'See Gobe! <gasp> Match up don red.', category: 'lamentation', audioUrl: '/audio/african/see-gobe.mp3', keywords: ['obstacle', 'seeing', 'encountering'] },
  { id: 'ev-12', text: 'Kilode?! <short pause> Wetin happen?', category: 'exclamation', audioUrl: '/audio/african/kilode.mp3', keywords: ['questioning', 'activity', 'reason', 'answer'] },
  { id: 'ev-13', text: 'Owo ni Koko! <chuckle> Cash out season.', category: 'earnings', audioUrl: '/audio/african/owo-ni-koko.mp3', keywords: ['points', 'gifts', 'money', 'bonus', 'FIC'] },
  { id: 'ev-14', text: 'Wonderful! <gasp> Levels!', category: 'blogs', audioUrl: '/audio/african/wonderful.mp3', keywords: ['surprise', 'amazement', 'blogs', 'wonderful'] },
  { id: 'ev-15', text: 'Come here, <short pause> get a Hug.', category: 'lushpressies', audioUrl: '/audio/african/get-a-hug.mp3', keywords: ['affection', 'lushpressies', 'hug'] },
  { id: 'ev-16', text: 'Oya, <short pause> dance for me!', category: 'enticement', audioUrl: '/audio/african/dance-for-me.mp3', keywords: ['happy', 'retry', 'redo', 'earn', 'achieve'] },
  { id: 'ev-17', text: 'Hold on, <short pause> play my music!!', category: 'boastful', audioUrl: '/audio/african/play-my-music.mp3', keywords: ['boast', 'earned', 'achieved', 'acquired'] },
  { id: 'ev-18', text: 'Dash me naa, <sigh> Abeg come Bless me na.', category: 'request', audioUrl: '/audio/african/dash-me-abeg.mp3', keywords: ['request', 'give', 'gift', 'funding'] },
  { id: 'ev-19', text: 'Gift me! <short pause> Don\'t stingy.', category: 'request', audioUrl: '/audio/african/gift-me.mp3', keywords: ['request', 'give', 'gift'] },
  { id: 'ev-20', text: 'Thank you! <giggle> I appreciate.', category: 'appraisal', audioUrl: '/audio/african/thank-you.mp3', keywords: ['appreciation', 'receiving', 'gifts', 'achievement'] },
  { id: 'ev-21', text: 'Boss, <sigh> I need Urgent 2k.', category: 'funding', audioUrl: '/audio/african/i-need-urgent-2k.mp3', keywords: ['funding', 'begging', 'request'] },
  { id: 'ev-22', text: 'Urgent 2k! <short pause> Choke.', category: 'funding', audioUrl: '/audio/african/urgent-2k.mp3', keywords: ['funding', 'request'] },
  { id: 'ev-23', text: 'Urgent 5k! <short pause> Save a soul.', category: 'funding', audioUrl: '/audio/african/urgent-5k.mp3', keywords: ['funding', 'request'] },
  { id: 'ev-24', text: 'Abeg, <sigh> I need Urgent 5k.', category: 'funding', audioUrl: '/audio/african/i-need-urgent-5k.mp3', keywords: ['funding', 'begging', 'request'] },
  { id: 'ev-25', text: 'Miss me? <giggle> Tell me now.', category: 'lushpressies', audioUrl: '/audio/african/miss-me.mp3', keywords: ['affection', 'lushpressies', 'matching', 'return'] },
  { id: 'ev-26', text: 'I miss you, <short pause> no caps.', category: 'lushpressies', audioUrl: '/audio/african/i-miss-you.mp3', keywords: ['affection', 'lushpressies', 'match', 'return'] },
  { id: 'ev-27', text: 'Oya! <short pause> Let\'s do this.', category: 'groups', audioUrl: '/audio/african/lets-do-this.mp3', keywords: ['agreement', 'action', 'groups'] },
  { id: 'ev-28', text: 'Awesome! <gasp> Madt energy.', category: 'blogs', audioUrl: '/audio/african/awesome.mp3', keywords: ['appraisal', 'affirmation', 'blogs', 'gifts'] },
  { id: 'ev-29', text: 'Thumbs up! <short pause> Solid movement.', category: 'blogs', audioUrl: '/audio/african/thumbs-up.mp3', keywords: ['appraisal', 'blogs', 'achievement', 'thumbs'] },
  { id: 'ev-30', text: 'Say whaaaaaaa?! <gasp> No way!', category: 'expression', audioUrl: '/audio/african/say-whaaaa.mp3', keywords: ['excitement', 'shock', 'jolt', 'surprise'] },
  { id: 'ev-31', text: 'Whatever! <sigh> Free me jor.', category: 'expression', audioUrl: '/audio/african/whatever.mp3', keywords: ['restrictions', 'freedom', 'surprise'] },
  { id: 'ev-32', text: 'Stunning! <short pause> Too much steeze.', category: 'mii', audioUrl: '/audio/african/stunning.mp3', keywords: ['mii', 'affirmation', 'stunning', 'avatar'] },
  { id: 'ev-33', text: 'Omo, <giggle> you look great!', category: 'mii', audioUrl: '/audio/african/you-look-great.mp3', keywords: ['mii', 'avatar', 'style', 'great'] },
  { id: 'ev-34', text: 'Wereey! <chuckle> You bad!', category: 'achievement', audioUrl: '/audio/african/wereey.mp3', keywords: ['stunt', 'achieved', 'impossible'] },
  { id: 'ev-35', text: 'Madt o! <gasp> Brain-touching behavior!', category: 'achievement', audioUrl: '/audio/african/madt-o.mp3', keywords: ['stunt', 'achieved', 'unusual'] },
  { id: 'ev-36', text: 'Sharp! <short pause> Clean work.', category: 'forum', audioUrl: '/audio/african/sharp.mp3', keywords: ['forum', 'achieved', 'sharp'] },
  { id: 'ev-37', text: 'Oomo, <gasp> you gbaski no be small!', category: 'forum', audioUrl: '/audio/african/oomo-gbaski.mp3', keywords: ['forum', 'great', 'work', 'gbaski'] },
  { id: 'ev-38', text: 'O B O! <chuckle> Original Big Boy.', category: 'hallmarks', audioUrl: '/audio/african/o-b-o.mp3', keywords: ['hallmarks', 'big', 'status'] },
  { id: 'ev-39', text: 'Billion Dollar Gang! <short pause> We dey talk money!', category: 'hallmarks', audioUrl: '/audio/african/billion-dollar-gang.mp3', keywords: ['hallmarks', 'success', 'billion'] },
  { id: 'ev-40', text: 'Correct! <short pause> That\'s the vibe.', category: 'forum', audioUrl: '/audio/african/correct.mp3', keywords: ['forum', 'achievement', 'correct'] },
  { id: 'ev-41', text: 'oOoOO ma Gaddddd! <gasp> Unbelievable!', category: 'achievement', audioUrl: '/audio/african/ooooma-gaddddd.mp3', keywords: ['stunt', 'new', 'colossal'] },
  { id: 'ev-42', text: 'My Goodness! <sigh> See setup.', category: 'stun', audioUrl: '/audio/african/my-goodness.mp3', keywords: ['appraisal', 'surprise'] },
  { id: 'ev-43', text: 'Omo, <giggle> you\'re endowed!', category: 'mii', audioUrl: '/audio/african/youre-endowed.mp3', keywords: ['mii', 'physical', 'attributes'] },
  { id: 'ev-44', text: 'You\'re gorgeous, <short pause> full steeze.', category: 'mii', audioUrl: '/audio/african/youre-gorgeous.mp3', keywords: ['mii', 'gorgeous', 'admirations'] },
  { id: 'ev-45', text: 'Divine! <short pause> Godly tier.', category: 'hallmarks', audioUrl: '/audio/african/divine.mp3', keywords: ['hallmarks', 'divine', 'impressive'] },
  { id: 'ev-46', text: 'Blessings, <short pause> blessings, <short pause> blessings!', category: 'hallmarks', audioUrl: '/audio/african/blessings-blessings.mp3', keywords: ['hallmarks', 'blessings'] },
  { id: 'cb-1', text: 'Small combo! <chuckle> Small starter.', category: 'combo_small', audioUrl: '/audio/african/small-combo.mp3', keywords: ['small', 'combo'] },
  { id: 'cb-2', text: 'Great combo! <gasp> Hard hitting!', category: 'combo_large', audioUrl: '/audio/african/great-combo.mp3', keywords: ['great', 'combo'] },
  { id: 'cb-3', text: 'Colossal combo! <short pause> Ground shaking!', category: 'combo_colossal', audioUrl: '/audio/african/colossal-combo.mp3', keywords: ['colossal', 'combo'] },
  { id: 'cb-4', text: 'Sweet! <giggle> Sweet like honey.', category: 'lushpressies', audioUrl: '/audio/african/sweet.mp3', keywords: ['sweet', 'lushpressies'] },
  { id: 'cb-5', text: 'Boom! <short pause> Over and out.', category: 'groups', audioUrl: '/audio/african/boom.mp3', keywords: ['boom', 'groups'] },
  { id: 'cm-1', text: 'Great post! <short pause> Pure fire.', category: 'forum', audioUrl: '/audio/african/great-post.mp3', keywords: ['forum', 'post', 'community'] },
  { id: 'cm-2', text: 'Gem found! <gasp> Goldmine!', category: 'gems', audioUrl: '/audio/african/gem-found.mp3', keywords: ['gems', 'find'] }
];

OPtions: pip install google-cloud-texttospeech and pip install edge-tts



Task 1: pip install google-cloud-texttospeech
Task 2: Set Up Authentication

Before executing the script, export your Google Cloud service account JSON key path as an environment variable:
bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service_account_key.json"


Step 3: Run the Python Automation Script


import os
import re
from google.cloud import texttospeech

# 1. Define the voice lines data array
all_voice_lines = [
    { 'id': 'ev-1', 'text': 'Great! <short pause> Correct movement!', 'category': 'forum' },
    { 'id': 'ev-2', 'text': 'Sugar crush! <giggle> Pure sweetness.', 'category': 'sugarcrush' },
    { 'id': 'ev-3', 'text': 'Wooow! <gasp> No caps!', 'category': 'general' },
    { 'id': 'ev-4', 'text': 'Oh yeeeaah! <short pause> We dey move!', 'category': 'general' },
    { 'id': 'ev-10', 'text': 'Wahala dey! <sigh> Big mess.', 'category': 'lamentation' },
    { 'id': 'ev-11', 'text': 'See Gobe! <gasp> Match up don red.', 'category': 'lamentation' },
    { 'id': 'ev-12', 'text': 'Kilode?! <short pause> Wetin happen?', 'category': 'exclamation' },
    { 'id': 'ev-13', 'text': 'Owo ni Koko! <chuckle> Cash out season.', 'category': 'earnings' },
    { 'id': 'ev-35', 'text': 'Madt o! <gasp> Brain-touching behavior!', 'category': 'achievement' },
    { 'id': 'ev-37', 'text': 'Oomo, <gasp> you gbaski no be small!', 'category': 'forum' }
    # You can safely add the rest of your 48 lines here
]

def convert_to_valid_ssml(raw_text: str) -> str:
    """
    Transforms experimental Studio tags into valid W3C SSML tags 
    recognized by the core Google Cloud TTS engine.
    """
    # Replace pauses with an SSML break element
    processed = raw_text.replace("<short pause>", '<break time="500ms"/>')
    
    # Map physical breath indicators to swift pitch/volume adjustments for raw voice models
    processed = processed.replace("<gasp>", '<prosody pitch="+2st" rate="fast">Ah! </prosody>')
    processed = processed.replace("<sigh>", '<prosody pitch="-1st" rate="slow"><break time="300ms"/> </prosody>')
    processed = processed.replace("<chuckle>", '<prosody pitch="+1st" detail="expressive"> </prosody>')
    processed = processed.replace("<giggle>", '<prosody pitch="+2st" detail="expressive"> </prosody>')
    
    # Wrap inside the root speak tag
    return f"<speak>{processed}</speak>"

def batch_generate_lagos_voices(voice_lines):
    # Initialize the official Google Cloud TTS Client
    client = texttospeech.TextToSpeechClient()

    # Configure the voice parameters for Nigerian English/Pidgin cadence
    # 'en-NG-Wavenet-C' or 'en-NG-Neural2-C' are best suited for deep local inflections
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-NG",
        name="en-NG-Wavenet-C", 
        ssml_gender=texttospeech.SsmlVoiceGender.MALE
    )

    # Output audio file configurations
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=1.05,  # Slightly accelerated to capture the Lagos street tempo
        pitch=0.0
    )

    # Ensure output destination directory exists
    output_dir = "./audio/african"
    os.makedirs(output_dir, exist_ok=True)

    print(f"🚀 Starting batch generation of {len(voice_lines)} voice lines...\n")

    for line in voice_lines:
        file_name = os.path.basename(line['audioUrl']) if 'audioUrl' in line else f"{line['id']}.mp3"
        output_path = os.path.join(output_dir, file_name)
        
        # Prepare valid SSML input string
        ssml_content = convert_to_valid_ssml(line['text'])
        synthesis_input = texttospeech.SynthesisInput(ssml=ssml_content)

        try:
            # Request audio generation from Google Cloud API
            response = client.synthesize_speech(
                input=synthesis_input, voice=voice, audio_config=audio_config
            )

            # Write the binary stream to local disk
            with open(output_path, "wb") as out:
                out.write(response.audio_content)
                print(f"✅ Generated: {output_path} | Text: {line['text']}")

        except Exception as e:
            print(f"❌ Failed to generate {line['id']}: {e}")

if __name__ == "__main__":
    batch_generate_lagos_voices(all_voice_lines)


#### Completely Offline (pyttsx3)
If you need the script to run locally without internet access, pyttsx3 uses the built-in text-to-speech engine on your operating system (SAPI5 on Windows, NSSpeechSynthesizer on macOS, espeak on Linux). The voices sound more robotic, but it works instantly anywhere.
1. Install the library
code
Bash
pip install pyttsx3
2. Run the script
code
Python
import pyttsx3

engine = pyttsx3.init()

# Optional: Adjust speed and volume
engine.setProperty('rate', 160)     # Speed of speech
engine.setProperty('volume', 0.9)   # Volume (0.0 to 1.0)

VOICE_LINES = [
    ("line_01.wav", "System initialized. Stand by for instructions."),
    ("line_02.wav", "Target acquired. Engaging now.")
]

for filename, text in VOICE_LINES:
    print(f"Saving {filename}...")
    engine.save_to_file(text, filename)

engine.runAndWait()
print("All voice lines generated!")