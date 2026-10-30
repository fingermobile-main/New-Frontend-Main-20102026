const { pool } = require('./db');

const initialVoiceLines = [
  { title: 'Sweet!', category: 'forum', audioUrl: '/audio/african/sweet.mp3', tags: ['forum', 'celebratory'], keywords: ['sweet', 'praise', 'awesome'] },
  { title: 'Wonderful!', category: 'blogs', audioUrl: '/audio/african/wonderful.mp3', tags: ['blogs', 'excellence'], keywords: ['wonderful', 'great', 'content'] },
  { title: 'Divine!', category: 'hallmarks', audioUrl: '/audio/african/divine.mp3', tags: ['hallmarks', 'tribute'], keywords: ['divine', 'honor', 'sacred'] },
  { title: 'Sensational!', category: 'mii', audioUrl: '/audio/african/sensational.mp3', tags: ['mii', 'stories'], keywords: ['sensational', 'vibes', 'social'] },
  { title: 'Phenomenal!', category: 'groups', audioUrl: '/audio/african/phenomenal.mp3', tags: ['groups', 'community'], keywords: ['phenomenal', 'unity', 'team'] },
  { title: 'Incredible!', category: 'lushpressies', audioUrl: '/audio/african/incredible.mp3', tags: ['lushpressies', 'gifting'], keywords: ['incredible', 'gift', 'generous'] },
  { title: 'Wereey!', category: 'achievement', audioUrl: '/audio/african/wereey.mp3', tags: ['achievement', 'witty'], keywords: ['wereey', 'legendary', 'achievement'] },
  { title: 'Oshey!', category: 'general', audioUrl: '/audio/african/oshey.mp3', tags: ['gratitude', 'celebration'], keywords: ['oshey', 'thanks', 'salute'] },
  { title: 'Oya na!', category: 'general', audioUrl: '/audio/african/oyana.mp3', tags: ['momentum', 'action'], keywords: ['oya', 'momentum', 'action'] },
  { title: 'Gbaski!', category: 'general', audioUrl: '/audio/african/gbaski.mp3', tags: ['power', 'boss'], keywords: ['gbaski', 'authority', 'big'] },
  { title: 'Otilo!', category: 'achievement', audioUrl: '/audio/african/otilo.mp3', tags: ['achievement', 'gone'], keywords: ['otilo', 'ahead', 'fast'] },
  { title: 'O por gan!', category: 'general', audioUrl: '/audio/african/opor.mp3', tags: ['plenty', 'rich'], keywords: ['opor', 'plenty', 'abundance'] },
  { title: 'E choke!', category: 'general', audioUrl: '/audio/african/echoke.mp3', tags: ['heavy', 'speechless'], keywords: ['choke', 'impact', 'massive'] },
  { title: 'Buga won!', category: 'achievement', audioUrl: '/audio/african/buga.mp3', tags: ['flex', 'confidence'], keywords: ['buga', 'swagger', 'proud'] },
  { title: 'No shaking!', category: 'general', audioUrl: '/audio/african/noshaking.mp3', tags: ['calm', 'confidence'], keywords: ['unmoved', 'steady', 'calm'] },
  { title: 'Weldone o!', category: 'general', audioUrl: '/audio/african/weldone.mp3', tags: ['praise', 'courtesy'], keywords: ['weldone', 'respect', 'effort'] },
  { title: 'Oga at the top!', category: 'general', audioUrl: '/audio/african/oga.mp3', tags: ['leadership', 'boss'], keywords: ['oga', 'top', 'executive'] },
  { title: 'Correct person!', category: 'general', audioUrl: '/audio/african/correct.mp3', tags: ['approval', 'genuine'], keywords: ['correct', 'real', 'authentic'] },
  { title: 'Sharp guy!', category: 'general', audioUrl: '/audio/african/sharp.mp3', tags: ['smart', 'witty'], keywords: ['sharp', 'intelligent', 'fast'] },
  { title: 'Too much!', category: 'general', audioUrl: '/audio/african/toomuch.mp3', tags: ['applause', 'grand'], keywords: ['excess', 'grand', 'talent'] },
  { title: 'E sharp!', category: 'general', audioUrl: '/audio/african/esharp.mp3', tags: ['precision', 'clever'], keywords: ['sharp', 'neat', 'precise'] },
  { title: 'Top tier!', category: 'general', audioUrl: '/audio/african/toptier.mp3', tags: ['elite', 'premium'], keywords: ['top', 'tier', 'luxury'] },
  { title: 'Agba!', category: 'general', audioUrl: '/audio/african/agba.mp3', tags: ['mastery', 'elder'], keywords: ['agba', 'elder', 'veteran'] },
  { title: 'Odogwu!', category: 'general', audioUrl: '/audio/african/odogwu.mp3', tags: ['champion', 'titan'], keywords: ['odogwu', 'mighty', 'giant'] },
  { title: 'Kpa!', category: 'general', audioUrl: '/audio/african/kpa.mp3', tags: ['cash', 'impact'], keywords: ['kpa', 'money', 'direct'] },
  { title: 'Solid!', category: 'general', audioUrl: '/audio/african/solid.mp3', tags: ['reliable', 'firm'], keywords: ['solid', 'firm', 'trustworthy'] },
  { title: 'Level up!', category: 'achievement', audioUrl: '/audio/african/levelup.mp3', tags: ['growth', 'milestone'], keywords: ['level', 'up', 'progress'] },
  { title: 'Fire!', category: 'general', audioUrl: '/audio/african/fire.mp3', tags: ['hot', 'exciting'], keywords: ['fire', 'flames', 'heat'] },
  { title: 'Mad oh!', category: 'general', audioUrl: '/audio/african/madoh.mp3', tags: ['astounding', 'wild'], keywords: ['mad', 'wild', 'unbelievable'] },
  { title: 'Baller!', category: 'general', audioUrl: '/audio/african/baller.mp3', tags: ['lifestyle', 'wealth'], keywords: ['baller', 'rich', 'play'] },
  { title: 'Ajeh!', category: 'general', audioUrl: '/audio/african/ajeh.mp3', tags: ['truth', 'pledge'], keywords: ['ajeh', 'truth', 'real'] },
  { title: 'Smooth!', category: 'general', audioUrl: '/audio/african/smooth.mp3', tags: ['flow', 'effortless'], keywords: ['smooth', 'easy', 'clean'] },
  { title: 'Original!', category: 'general', audioUrl: '/audio/african/original.mp3', tags: ['unique', 'authentic'], keywords: ['original', 'legit', 'first'] },
  { title: 'E sweet die!', category: 'general', audioUrl: '/audio/african/esweetdie.mp3', tags: ['pleasure', 'pure joy'], keywords: ['sweet', 'enjoyment', 'thrill'] },
  { title: 'Confirm!', category: 'general', audioUrl: '/audio/african/confirm.mp3', tags: ['verified', 'vouched'], keywords: ['confirm', 'valid', 'approved'] },
  { title: 'Clean sheet!', category: 'achievement', audioUrl: '/audio/african/cleansheet.mp3', tags: ['perfection', 'flawless'], keywords: ['clean', 'sheet', 'flawless'] },
  { title: 'Standard!', category: 'general', audioUrl: '/audio/african/standard.mp3', tags: ['quality', 'benchmark'], keywords: ['standard', 'benchmark', 'high'] },
  { title: 'Sovereign moves!', category: 'general', audioUrl: '/audio/african/sovereign.mp3', tags: ['sovereign', 'majestic'], keywords: ['sovereign', 'protocol', 'moves'] },
  { title: 'Pure gold!', category: 'gems', audioUrl: '/audio/african/puregold.mp3', tags: ['gems', 'treasure'], keywords: ['gold', 'pure', 'value'] },
  { title: 'Chai!', category: 'general', audioUrl: '/audio/african/chai.mp3', tags: ['amazement', 'cultural'], keywords: ['chai', 'wonder', 'reaction'] },
  { title: 'Kudos!', category: 'general', audioUrl: '/audio/african/kudos.mp3', tags: ['honor', 'credit'], keywords: ['kudos', 'credit', 'respect'] },
  { title: 'Take your flowers!', category: 'hallmarks', audioUrl: '/audio/african/flowers.mp3', tags: ['hallmarks', 'tribute'], keywords: ['flowers', 'honor', 'tribute'] },
  { title: 'Energy!', category: 'general', audioUrl: '/audio/african/energy.mp3', tags: ['vibes', 'pulse'], keywords: ['energy', 'pulse', 'vibes'] },
  { title: 'Unstoppable!', category: 'achievement', audioUrl: '/audio/african/unstoppable.mp3', tags: ['strength', 'victory'], keywords: ['unstoppable', 'force', 'win'] },
  { title: 'Maximum respect!', category: 'general', audioUrl: '/audio/african/maxrespect.mp3', tags: ['respect', 'honor'], keywords: ['respect', 'honor', 'salute'] },
  { title: 'Boss moves!', category: 'general', audioUrl: '/audio/african/bossmoves.mp3', tags: ['strategy', 'king'], keywords: ['boss', 'moves', 'king'] },
  { title: 'You do this one!', category: 'general', audioUrl: '/audio/african/youdothisone.mp3', tags: ['compliment', 'hit'], keywords: ['victory', 'accomplishment'] },
  { title: 'Senior man!', category: 'general', audioUrl: '/audio/african/seniorman.mp3', tags: ['dignity', 'respected'], keywords: ['senior', 'man', 'respected'] },
  { title: 'Tuale!', category: 'general', audioUrl: '/audio/african/tuale.mp3', tags: ['salute', 'street praise'], keywords: ['tuale', 'salute', 'bow'] },
  { title: 'Banger!', category: 'general', audioUrl: '/audio/african/banger.mp3', tags: ['music', 'hit'], keywords: ['banger', 'smash', 'hit'] },
  { title: 'Wahala for who no like this!', category: 'general', audioUrl: '/audio/african/wahalaforwho.mp3', tags: ['witty', 'pride'], keywords: ['wahala', 'love', 'post'] },
  { title: 'Gbedu dey enter!', category: 'general', audioUrl: '/audio/african/gbedu.mp3', tags: ['rhythm', 'enjoyment'], keywords: ['gbedu', 'rhythm', 'sound'] },
  { title: 'O shap gan ni!', category: 'general', audioUrl: '/audio/african/oshapganni.mp3', tags: ['sharp', 'perfect'], keywords: ['sharp', 'crisp', 'clean'] },
  { title: 'You too much my brother!', category: 'general', audioUrl: '/audio/african/youtoomuch.mp3', tags: ['warmth', 'brotherhood'], keywords: ['brother', 'praise', 'kindness'] },
  { title: 'Blessing follow you!', category: 'tribut', audioUrl: '/audio/african/blessing.mp3', tags: ['tribut', 'blessing'], keywords: ['blessing', 'grace', 'prayer'] },
  { title: 'Sharp sharp!', category: 'general', audioUrl: '/audio/african/sharpsharp.mp3', tags: ['speed', 'prompt'], keywords: ['sharp', 'prompt', 'quick'] },
  { title: 'As e dey hot!', category: 'general', audioUrl: '/audio/african/asedeyhot.mp3', tags: ['fresh', 'trending'], keywords: ['hot', 'fresh', 'breaking'] },
  { title: 'Legend in the making!', category: 'achievement', audioUrl: '/audio/african/legend.mp3', tags: ['destiny', 'greatness'], keywords: ['legend', 'making', 'great'] },
  { title: 'Gbe body e!', category: 'general', audioUrl: '/audio/african/gbebodye.mp3', tags: ['dance', 'hype'], keywords: ['dance', 'move', 'hype'] },
  { title: 'Ope o!', category: 'general', audioUrl: '/audio/african/opeo.mp3', tags: ['thanksgiving', 'joy'], keywords: ['gratitude', 'ope', 'relief'] },
  { title: 'Better talk!', category: 'forum', audioUrl: '/audio/african/bettertalk.mp3', tags: ['forum', 'wisdom'], keywords: ['wisdom', 'truth', 'forum'] },
  { title: 'E get why!', category: 'general', audioUrl: '/audio/african/egetwhy.mp3', tags: ['mystery', 'purpose'], keywords: ['reason', 'purpose', 'why'] },
  { title: 'No cap!', category: 'general', audioUrl: '/audio/african/nocap.mp3', tags: ['truth', 'facts'], keywords: ['facts', 'true', 'honest'] },
  { title: 'I salute you!', category: 'tribut', audioUrl: '/audio/african/salute.mp3', tags: ['tribut', 'hallmarks'], keywords: ['salute', 'respect', 'honor'] },
  { title: 'Masterpiece!', category: 'blogs', audioUrl: '/audio/african/masterpiece.mp3', tags: ['blogs', 'art'], keywords: ['art', 'masterpiece', 'craft'] },
  { title: 'Sound mind!', category: 'general', audioUrl: '/audio/african/soundmind.mp3', tags: ['intellect', 'peace'], keywords: ['mind', 'intellect', 'calm'] },
  { title: 'Full vibration!', category: 'general', audioUrl: '/audio/african/fullvibration.mp3', tags: ['frequency', 'life'], keywords: ['vibration', 'energy', 'alive'] },
  { title: 'E legit!', category: 'general', audioUrl: '/audio/african/elegit.mp3', tags: ['authentic', 'real'], keywords: ['legit', 'real', 'true'] },
  { title: 'Higher levels!', category: 'achievement', audioUrl: '/audio/african/higherlevels.mp3', tags: ['ascension', 'promotion'], keywords: ['levels', 'high', 'win'] },
  { title: 'Grace abundant!', category: 'tribut', audioUrl: '/audio/african/grace.mp3', tags: ['tribut', 'favor'], keywords: ['grace', 'favor', 'abundant'] },
  { title: 'Victory parade!', category: 'achievement', audioUrl: '/audio/african/victory.mp3', tags: ['conquest', 'champ'], keywords: ['victory', 'champ', 'parade'] },
  { title: 'Touch of class!', category: 'general', audioUrl: '/audio/african/touchofclass.mp3', tags: ['elegance', 'style'], keywords: ['class', 'style', 'luxury'] },
  { title: 'Pure excellence!', category: 'blogs', audioUrl: '/audio/african/pureexcellence.mp3', tags: ['blogs', 'excellence'], keywords: ['excellence', 'pure', 'skill'] },
  { title: 'Champion sound!', category: 'general', audioUrl: '/audio/african/championsound.mp3', tags: ['anthem', 'win'], keywords: ['champion', 'sound', 'trophy'] },
  { title: 'Unmatched energy!', category: 'general', audioUrl: '/audio/african/unmatched.mp3', tags: ['peerless', 'power'], keywords: ['unmatched', 'power', 'vibe'] },
  { title: 'Royalty vibes!', category: 'hallmarks', audioUrl: '/audio/african/royalty.mp3', tags: ['hallmarks', 'nobility'], keywords: ['royalty', 'crown', 'noble'] },
  { title: 'Power moves!', category: 'general', audioUrl: '/audio/african/powermoves.mp3', tags: ['bold', 'strategy'], keywords: ['power', 'bold', 'strategy'] },
  { title: 'Sovereign glory!', category: 'general', audioUrl: '/audio/african/sovereignglory.mp3', tags: ['protocol', 'glory'], keywords: ['sovereign', 'glory', 'crown'] },
  { title: 'We outside!', category: 'groups', audioUrl: '/audio/african/weoutside.mp3', tags: ['groups', 'gathering'], keywords: ['outside', 'active', 'present'] },
  { title: 'Heavy duty!', category: 'general', audioUrl: '/audio/african/heavyduty.mp3', tags: ['weight', 'impact'], keywords: ['heavy', 'duty', 'solid'] },
  { title: 'Over standing!', category: 'forum', audioUrl: '/audio/african/overstanding.mp3', tags: ['forum', 'understanding'], keywords: ['insight', 'deep', 'standing'] },
  { title: 'Vibes on vibes!', category: 'mii', audioUrl: '/audio/african/vibesonvibes.mp3', tags: ['mii', 'mood'], keywords: ['vibes', 'feeling', 'music'] },
  { title: 'No dulling!', category: 'general', audioUrl: '/audio/african/nodulling.mp3', tags: ['awake', 'speed'], keywords: ['sharp', 'dull', 'fast'] },
  { title: 'Clear road!', category: 'general', audioUrl: '/audio/african/clearroad.mp3', tags: ['pioneer', 'lead'], keywords: ['road', 'open', 'pioneer'] },
  { title: 'Na you biko!', category: 'general', audioUrl: '/audio/african/nayoubiko.mp3', tags: ['respect', 'praise'], keywords: ['na you', 'biko', 'standout'] },
  { title: 'Action speaks!', category: 'general', audioUrl: '/audio/african/actionspeaks.mp3', tags: ['deeds', 'execution'], keywords: ['action', 'execution', 'deed'] },
  { title: 'Grace on grace!', category: 'tribut', audioUrl: '/audio/african/graceongrace.mp3', tags: ['tribut', 'gratitude'], keywords: ['grace', 'honor', 'life'] },
  { title: 'Elevation time!', category: 'achievement', audioUrl: '/audio/african/elevation.mp3', tags: ['elevation', 'ascent'], keywords: ['elevation', 'growth', 'up'] },
  { title: 'Full option!', category: 'general', audioUrl: '/audio/african/fulloption.mp3', tags: ['complete', 'loaded'], keywords: ['complete', 'loaded', 'premium'] },
  { title: 'Unto the next one!', category: 'achievement', audioUrl: '/audio/african/nextone.mp3', tags: ['progress', 'goals'], keywords: ['next', 'continuation', 'aim'] },
  { title: 'Oya dance!', category: 'general', audioUrl: '/audio/african/oyadance.mp3', tags: ['celebration', 'joy'], keywords: ['dance', 'joy', 'happy'] },
  { title: 'Big flex!', category: 'general', audioUrl: '/audio/african/bigflex.mp3', tags: ['flex', 'confidence'], keywords: ['flex', 'bold', 'presence'] },
  { title: 'Untouchable!', category: 'achievement', audioUrl: '/audio/african/untouchable.mp3', tags: ['defense', 'champion'], keywords: ['untouchable', 'secure', 'top'] },
  { title: 'Full current!', category: 'general', audioUrl: '/audio/african/fullcurrent.mp3', tags: ['electric', 'active'], keywords: ['current', 'electric', 'power'] },
  { title: 'Original specimen!', category: 'general', audioUrl: '/audio/african/originalspecimen.mp3', tags: ['unique', 'one-of-one'], keywords: ['one of one', 'rare', 'gold'] },
  { title: 'Certified classic!', category: 'hallmarks', audioUrl: '/audio/african/certifiedclassic.mp3', tags: ['hallmarks', 'timeless'], keywords: ['classic', 'timeless', 'legend'] },
  { title: 'Show stopper!', category: 'general', audioUrl: '/audio/african/showstopper.mp3', tags: ['grand', 'spectacle'], keywords: ['spectacle', 'show', 'headline'] },
  { title: 'Crown fits well!', category: 'hallmarks', audioUrl: '/audio/african/crownfits.mp3', tags: ['hallmarks', 'royalty'], keywords: ['crown', 'queen', 'king'] },
  { title: 'Top boy!', category: 'general', audioUrl: '/audio/african/topboy.mp3', tags: ['distinction', 'leader'], keywords: ['boy', 'top', 'lead'] },
  { title: 'Pure vibes!', category: 'mii', audioUrl: '/audio/african/purevibes.mp3', tags: ['mii', 'mood'], keywords: ['vibes', 'pure', 'feeling'] },
  { title: 'Na so we see am!', category: 'forum', audioUrl: '/audio/african/nasoweseeam.mp3', tags: ['forum', 'agreement'], keywords: ['agreement', 'consensus', 'truth'] },
  { title: 'Sound check 100!', category: 'general', audioUrl: '/audio/african/soundcheck.mp3', tags: ['audio', 'clarity'], keywords: ['audio', 'crisp', 'sound'] },
  { title: 'Full throttle!', category: 'achievement', audioUrl: '/audio/african/fullthrottle.mp3', tags: ['speed', 'momentum'], keywords: ['throttle', 'fast', 'surge'] },
  { title: 'God speed!', category: 'tribut', audioUrl: '/audio/african/godspeed.mp3', tags: ['tribut', 'prayer'], keywords: ['godspeed', 'protection', 'blessing'] }
];

async function seed() {
  try {
    for (const item of initialVoiceLines) {
      const exists = await pool.query('SELECT id FROM voicelines_clips WHERE title = $1', [item.title]);
      if (exists.rows.length === 0) {
        await pool.query(
          'INSERT INTO voicelines_clips (id, title, audio_url, duration_seconds, category, tags, keywords, is_published, created_at) VALUES (gen_random_uuid(), $1, $2, 3, $3, $4, $5, true, NOW())',
          [item.title, item.audioUrl, item.category, JSON.stringify(item.tags), JSON.stringify(item.keywords)]
        );
      }
    }
    const count = await pool.query('SELECT COUNT(*) FROM voicelines_clips');
    console.log('Seeding completed! Total voicelines in PostgreSQL:', count.rows[0].count);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    process.exit();
  }
}

seed();

