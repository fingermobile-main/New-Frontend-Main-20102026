import React, { useState } from 'react';
import { 
  EmojiHappyIcon, 
  EmojiSadIcon, 
  EmojiAngryIcon, 
  EmojiWinkIcon, 
  EmojiGrinningIcon,
  EmojiCoolIcon,
  EmojiMoneyMouthIcon
} from './icons';

// Placeholder emoji icon component generator
const createPlaceholderEmoji = (name: string) => {
  const PlaceholderEmoji: React.FC<{ className?: string }> = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <circle cx="12" cy="12" r="10" className="opacity-20" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">
        {name.charAt(0)}
      </text>
    </svg>
  );
  return PlaceholderEmoji;
};

// Generate all missing emoji icons as placeholders
const EmojiTongueIcon = createPlaceholderEmoji('T');
const EmojiZanyIcon = createPlaceholderEmoji('Z');
const EmojiNeutralIcon = createPlaceholderEmoji('N');
const EmojiExpressionlessIcon = createPlaceholderEmoji('E');
const EmojiUnamusedIcon = createPlaceholderEmoji('U');
const EmojiRollingEyesIcon = createPlaceholderEmoji('R');
const EmojiFlushedIcon = createPlaceholderEmoji('F');
const EmojiDisappointedIcon = createPlaceholderEmoji('D');
const EmojiAstonishedIcon = createPlaceholderEmoji('A');
const EmojiSleepingIcon = createPlaceholderEmoji('S');
const EmojiDizzyIcon = createPlaceholderEmoji('D');
const EmojiNauseatedFaceIcon = createPlaceholderEmoji('N');
const EmojiSneezingFaceIcon = createPlaceholderEmoji('S');
const EmojiThermometerFaceIcon = createPlaceholderEmoji('T');
const EmojiZipperMouthFaceIcon = createPlaceholderEmoji('Z');
const EmojiMoneyFaceIcon = createPlaceholderEmoji('M');
const EmojiCowboyHatFaceIcon = createPlaceholderEmoji('C');
const EmojiPartyingFaceIcon = createPlaceholderEmoji('P');
const EmojiPleadingFaceIcon = createPlaceholderEmoji('P');
const EmojiAnxiousFaceSweatingIcon = createPlaceholderEmoji('A');
const EmojiSadButRelievedFaceIcon = createPlaceholderEmoji('S');
const EmojiCryingFaceIcon = createPlaceholderEmoji('C');
const EmojiLoudlyCryingFaceIcon = createPlaceholderEmoji('L');
const EmojiSleepyFaceIcon = createPlaceholderEmoji('S');
const EmojiTiredFaceIcon = createPlaceholderEmoji('T');
const EmojiYawningFaceIcon = createPlaceholderEmoji('Y');
const EmojiFaceWithSteamFromNoseIcon = createPlaceholderEmoji('F');
const EmojiPoutingFaceIcon = createPlaceholderEmoji('P');
const EmojiAngryFaceIcon = createPlaceholderEmoji('A');
const EmojiFaceWithSymbolsOverMouthIcon = createPlaceholderEmoji('F');
const EmojiSmilingFaceWithHeartsIcon = createPlaceholderEmoji('S');
const EmojiSmilingFaceWithSunglassesIcon = createPlaceholderEmoji('S');
const EmojiFaceBlowingAKissIcon = createPlaceholderEmoji('F');
const EmojiFaceWithTearsOfJoyIcon = createPlaceholderEmoji('F');
const EmojiGrinningFaceWithBigEyesIcon = createPlaceholderEmoji('G');
const EmojiGrinningFaceWithStarEyesIcon = createPlaceholderEmoji('G');
const EmojiGrinningFaceWithOneLargeEyeIcon = createPlaceholderEmoji('G');
const EmojiGrinningFaceWithSmilingEyesIcon = createPlaceholderEmoji('G');
const EmojiGrinningFaceWithSweatIcon = createPlaceholderEmoji('G');
const EmojiGrinningSquintingFaceIcon = createPlaceholderEmoji('G');
const EmojiRollingOnTheFloorLaughingIcon = createPlaceholderEmoji('R');
const EmojiSmilingFaceWithSmilingEyesIcon = createPlaceholderEmoji('S');
const EmojiSmilingFaceWithHaloIcon = createPlaceholderEmoji('S');
const EmojiSmirkingFaceIcon = createPlaceholderEmoji('S');
const EmojiFaceWithTongueIcon = createPlaceholderEmoji('F');
const EmojiSquintingFaceWithTongueIcon = createPlaceholderEmoji('S');
const EmojiMoneyMouthFaceIcon = createPlaceholderEmoji('M');
const EmojiHuggingFaceIcon = createPlaceholderEmoji('H');
const EmojiFaceWithHandOverMouthIcon = createPlaceholderEmoji('F');
const EmojiShushingFaceIcon = createPlaceholderEmoji('S');
const EmojiFaceWithFingerCoveringClosedEyesIcon = createPlaceholderEmoji('F');
const EmojiFaceWithOpenEyesAndHandOverMouthIcon = createPlaceholderEmoji('F');
const EmojiFaceWithPeekingEyeIcon = createPlaceholderEmoji('F');
const EmojiFaceWithRaisedEyebrowIcon = createPlaceholderEmoji('F');
const EmojiFaceWithMonocleIcon = createPlaceholderEmoji('F');
const EmojiNerdFaceIcon = createPlaceholderEmoji('N');
const EmojiSmilingFaceWithHornsIcon = createPlaceholderEmoji('S');
const EmojiAngryFaceWithHornsIcon = createPlaceholderEmoji('A');
const EmojiSkullIcon = createPlaceholderEmoji('S');
const EmojiSkullAndCrossbonesIcon = createPlaceholderEmoji('S');
const EmojiPileOfPooIcon = createPlaceholderEmoji('P');
const EmojiAlienIcon = createPlaceholderEmoji('A');
const EmojiAlienMonsterIcon = createPlaceholderEmoji('A');
const EmojiRobotIcon = createPlaceholderEmoji('R');
const EmojiCatFaceIcon = createPlaceholderEmoji('C');
const EmojiDogFaceIcon = createPlaceholderEmoji('D');
const EmojiMouseFaceIcon = createPlaceholderEmoji('M');
const EmojiHamsterFaceIcon = createPlaceholderEmoji('H');
const EmojiRabbitFaceIcon = createPlaceholderEmoji('R');
const EmojiFoxFaceIcon = createPlaceholderEmoji('F');
const EmojiBearFaceIcon = createPlaceholderEmoji('B');
const EmojiPandaFaceIcon = createPlaceholderEmoji('P');
const EmojiKoalaFaceIcon = createPlaceholderEmoji('K');
const EmojiLionFaceIcon = createPlaceholderEmoji('L');
const EmojiTigerFaceIcon = createPlaceholderEmoji('T');
const EmojiCowFaceIcon = createPlaceholderEmoji('C');
const EmojiPigFaceIcon = createPlaceholderEmoji('P');
const EmojiFrogFaceIcon = createPlaceholderEmoji('F');
const EmojiMonkeyFaceIcon = createPlaceholderEmoji('M');
const EmojiSeeNoEvilMonkeyIcon = createPlaceholderEmoji('S');
const EmojiHearNoEvilMonkeyIcon = createPlaceholderEmoji('H');
const EmojiSpeakNoEvilMonkeyIcon = createPlaceholderEmoji('S');
const EmojiMonkeyIcon = createPlaceholderEmoji('M');
const EmojiChickenIcon = createPlaceholderEmoji('C');
const EmojiPenguinIcon = createPlaceholderEmoji('P');
const EmojiBirdIcon = createPlaceholderEmoji('B');
const EmojiBabyChickIcon = createPlaceholderEmoji('B');
const EmojiFrontFacingBabyChickIcon = createPlaceholderEmoji('F');
const EmojiHatchingChickIcon = createPlaceholderEmoji('H');
const EmojiDuckIcon = createPlaceholderEmoji('D');
const EmojiEagleIcon = createPlaceholderEmoji('E');
const EmojiOwlIcon = createPlaceholderEmoji('O');
const EmojiBatIcon = createPlaceholderEmoji('B');
const EmojiWolfFaceIcon = createPlaceholderEmoji('W');
const EmojiBoarIcon = createPlaceholderEmoji('B');
const EmojiHorseFaceIcon = createPlaceholderEmoji('H');
const EmojiUnicornFaceIcon = createPlaceholderEmoji('U');
const EmojiHoneybeeIcon = createPlaceholderEmoji('H');
const EmojiBugIcon = createPlaceholderEmoji('B');
const EmojiButterflyIcon = createPlaceholderEmoji('B');
const EmojiSnailIcon = createPlaceholderEmoji('S');
const EmojiShellIcon = createPlaceholderEmoji('S');
const EmojiLadyBeetleIcon = createPlaceholderEmoji('L');
const EmojiAntIcon = createPlaceholderEmoji('A');

const ComboEmoticonDisplay: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Group emojis by categories
  const emojiCategories = {
    all: [
      { icon: EmojiHappyIcon, name: 'Happy', category: 'positive' },
      { icon: EmojiSadIcon, name: 'Sad', category: 'negative' },
      { icon: EmojiAngryIcon, name: 'Angry', category: 'negative' },
      { icon: EmojiWinkIcon, name: 'Wink', category: 'playful' },
      { icon: EmojiGrinningIcon, name: 'Grinning', category: 'positive' },
      { icon: EmojiCoolIcon, name: 'Cool', category: 'positive' },
      { icon: EmojiMoneyMouthIcon, name: 'Money Mouth', category: 'positive' },
      { icon: EmojiTongueIcon, name: 'Tongue', category: 'playful' },
      { icon: EmojiZanyIcon, name: 'Zany', category: 'playful' },
      { icon: EmojiNeutralIcon, name: 'Neutral', category: 'neutral' },
      { icon: EmojiExpressionlessIcon, name: 'Expressionless', category: 'neutral' },
      { icon: EmojiUnamusedIcon, name: 'Unamused', category: 'negative' },
      { icon: EmojiRollingEyesIcon, name: 'Rolling Eyes', category: 'negative' },
      { icon: EmojiFlushedIcon, name: 'Flushed', category: 'negative' },
      { icon: EmojiDisappointedIcon, name: 'Disappointed', category: 'negative' },
      { icon: EmojiAstonishedIcon, name: 'Astonished', category: 'surprised' },
      { icon: EmojiSleepingIcon, name: 'Sleeping', category: 'tired' },
      { icon: EmojiDizzyIcon, name: 'Dizzy', category: 'sick' },
      { icon: EmojiNauseatedFaceIcon, name: 'Nauseated', category: 'sick' },
      { icon: EmojiSneezingFaceIcon, name: 'Sneezing', category: 'sick' },
      { icon: EmojiThermometerFaceIcon, name: 'Thermometer', category: 'sick' },
      { icon: EmojiZipperMouthFaceIcon, name: 'Zipper Mouth', category: 'silenced' },
      { icon: EmojiMoneyFaceIcon, name: 'Money Face', category: 'positive' },
      { icon: EmojiCowboyHatFaceIcon, name: 'Cowboy Hat', category: 'positive' },
      { icon: EmojiPartyingFaceIcon, name: 'Partying', category: 'positive' },
      { icon: EmojiPleadingFaceIcon, name: 'Pleading', category: 'emotional' },
      { icon: EmojiAnxiousFaceSweatingIcon, name: 'Anxious Sweating', category: 'stressed' },
      { icon: EmojiSadButRelievedFaceIcon, name: 'Sad But Relieved', category: 'emotional' },
      { icon: EmojiCryingFaceIcon, name: 'Crying', category: 'sad' },
      { icon: EmojiLoudlyCryingFaceIcon, name: 'Loudly Crying', category: 'sad' },
      { icon: EmojiSleepyFaceIcon, name: 'Sleepy', category: 'tired' },
      { icon: EmojiTiredFaceIcon, name: 'Tired', category: 'tired' },
      { icon: EmojiYawningFaceIcon, name: 'Yawning', category: 'tired' },
      { icon: EmojiFaceWithSteamFromNoseIcon, name: 'Steam from Nose', category: 'angry' },
      { icon: EmojiPoutingFaceIcon, name: 'Pouting', category: 'angry' },
      { icon: EmojiAngryFaceIcon, name: 'Angry Face', category: 'angry' },
      { icon: EmojiFaceWithSymbolsOverMouthIcon, name: 'Symbols Over Mouth', category: 'emotional' },
      { icon: EmojiSmilingFaceWithHeartsIcon, name: 'Smiling with Hearts', category: 'positive' },
      { icon: EmojiSmilingFaceWithSunglassesIcon, name: 'Smiling with Sunglasses', category: 'positive' },
      { icon: EmojiFaceBlowingAKissIcon, name: 'Blowing a Kiss', category: 'positive' },
      { icon: EmojiFaceWithTearsOfJoyIcon, name: 'Tears of Joy', category: 'happy' },
      { icon: EmojiGrinningFaceWithBigEyesIcon, name: 'Grinning Big Eyes', category: 'happy' },
      { icon: EmojiGrinningFaceWithStarEyesIcon, name: 'Grinning Star Eyes', category: 'happy' },
      { icon: EmojiGrinningFaceWithOneLargeEyeIcon, name: 'Grinning One Large Eye', category: 'funny' },
      { icon: EmojiGrinningFaceWithSmilingEyesIcon, name: 'Grinning Smiling Eyes', category: 'happy' },
      { icon: EmojiGrinningFaceWithSweatIcon, name: 'Grinning Sweat', category: 'nervous' },
      { icon: EmojiGrinningSquintingFaceIcon, name: 'Grinning Squinting', category: 'funny' },
      { icon: EmojiRollingOnTheFloorLaughingIcon, name: 'Rolling Floor Laughing', category: 'happy' },
      { icon: EmojiSmilingFaceWithSmilingEyesIcon, name: 'Smiling Smiling Eyes', category: 'happy' },
      { icon: EmojiSmilingFaceWithHaloIcon, name: 'Smiling Halo', category: 'positive' },
      { icon: EmojiSmirkingFaceIcon, name: 'Smirking', category: 'playful' },
      { icon: EmojiFaceWithTongueIcon, name: 'Face Tongue', category: 'playful' },
      { icon: EmojiSquintingFaceWithTongueIcon, name: 'Squinting Tongue', category: 'playful' },
      { icon: EmojiMoneyMouthFaceIcon, name: 'Money Mouth Face', category: 'positive' },
      { icon: EmojiHuggingFaceIcon, name: 'Hugging', category: 'positive' },
      { icon: EmojiFaceWithHandOverMouthIcon, name: 'Hand Over Mouth', category: 'surprised' },
      { icon: EmojiShushingFaceIcon, name: 'Shushing', category: 'silenced' },
      { icon: EmojiFaceWithFingerCoveringClosedEyesIcon, name: 'Finger Covering Closed Eyes', category: 'silly' },
      { icon: EmojiFaceWithOpenEyesAndHandOverMouthIcon, name: 'Open Eyes Hand Over Mouth', category: 'surprised' },
      { icon: EmojiFaceWithPeekingEyeIcon, name: 'Peeking Eye', category: 'sneaky' },
      { icon: EmojiFaceWithRaisedEyebrowIcon, name: 'Raised Eyebrow', category: 'skeptical' },
      { icon: EmojiFaceWithMonocleIcon, name: 'Monocle', category: 'skeptical' },
      { icon: EmojiNerdFaceIcon, name: 'Nerd Face', category: 'smart' },
      { icon: EmojiSmilingFaceWithHornsIcon, name: 'Smiling Horns', category: 'mischievous' },
      { icon: EmojiAngryFaceWithHornsIcon, name: 'Angry Horns', category: 'angry' },
      { icon: EmojiSkullIcon, name: 'Skull', category: 'dead' },
      { icon: EmojiSkullAndCrossbonesIcon, name: 'Skull Crossbones', category: 'danger' },
      { icon: EmojiPileOfPooIcon, name: 'Pile of Poo', category: 'silly' },
      { icon: EmojiAlienIcon, name: 'Alien', category: 'alien' },
      { icon: EmojiAlienMonsterIcon, name: 'Alien Monster', category: 'monster' },
      { icon: EmojiRobotIcon, name: 'Robot', category: 'robot' },
      { icon: EmojiCatFaceIcon, name: 'Cat Face', category: 'animal' },
      { icon: EmojiDogFaceIcon, name: 'Dog Face', category: 'animal' },
      { icon: EmojiMouseFaceIcon, name: 'Mouse Face', category: 'animal' },
      { icon: EmojiHamsterFaceIcon, name: 'Hamster Face', category: 'animal' },
      { icon: EmojiRabbitFaceIcon, name: 'Rabbit Face', category: 'animal' },
      { icon: EmojiFoxFaceIcon, name: 'Fox Face', category: 'animal' },
      { icon: EmojiBearFaceIcon, name: 'Bear Face', category: 'animal' },
      { icon: EmojiPandaFaceIcon, name: 'Panda Face', category: 'animal' },
      { icon: EmojiKoalaFaceIcon, name: 'Koala Face', category: 'animal' },
      { icon: EmojiLionFaceIcon, name: 'Lion Face', category: 'animal' },
      { icon: EmojiTigerFaceIcon, name: 'Tiger Face', category: 'animal' },
      { icon: EmojiCowFaceIcon, name: 'Cow Face', category: 'animal' },
      { icon: EmojiPigFaceIcon, name: 'Pig Face', category: 'animal' },
      { icon: EmojiFrogFaceIcon, name: 'Frog Face', category: 'animal' },
      { icon: EmojiMonkeyFaceIcon, name: 'Monkey Face', category: 'animal' },
      { icon: EmojiSeeNoEvilMonkeyIcon, name: 'See No Evil Monkey', category: 'animal' },
      { icon: EmojiHearNoEvilMonkeyIcon, name: 'Hear No Evil Monkey', category: 'animal' },
      { icon: EmojiSpeakNoEvilMonkeyIcon, name: 'Speak No Evil Monkey', category: 'animal' },
      { icon: EmojiMonkeyIcon, name: 'Monkey', category: 'animal' },
      { icon: EmojiChickenIcon, name: 'Chicken', category: 'animal' },
      { icon: EmojiPenguinIcon, name: 'Penguin', category: 'animal' },
      { icon: EmojiBirdIcon, name: 'Bird', category: 'animal' },
      { icon: EmojiBabyChickIcon, name: 'Baby Chick', category: 'animal' },
      { icon: EmojiFrontFacingBabyChickIcon, name: 'Front Facing Baby Chick', category: 'animal' },
      { icon: EmojiHatchingChickIcon, name: 'Hatching Chick', category: 'animal' },
      { icon: EmojiDuckIcon, name: 'Duck', category: 'animal' },
      { icon: EmojiEagleIcon, name: 'Eagle', category: 'animal' },
      { icon: EmojiOwlIcon, name: 'Owl', category: 'animal' },
      { icon: EmojiBatIcon, name: 'Bat', category: 'animal' },
      { icon: EmojiWolfFaceIcon, name: 'Wolf Face', category: 'animal' },
      { icon: EmojiBoarIcon, name: 'Boar', category: 'animal' },
      { icon: EmojiHorseFaceIcon, name: 'Horse Face', category: 'animal' },
      { icon: EmojiUnicornFaceIcon, name: 'Unicorn Face', category: 'animal' },
      { icon: EmojiHoneybeeIcon, name: 'Honeybee', category: 'insect' },
      { icon: EmojiBugIcon, name: 'Bug', category: 'insect' },
      { icon: EmojiButterflyIcon, name: 'Butterfly', category: 'insect' },
      { icon: EmojiSnailIcon, name: 'Snail', category: 'insect' },
      { icon: EmojiShellIcon, name: 'Shell', category: 'nature' },
      { icon: EmojiLadyBeetleIcon, name: 'Lady Beetle', category: 'insect' },
      { icon: EmojiAntIcon, name: 'Ant', category: 'insect' }
    ],
    positive: [
      { icon: EmojiHappyIcon, name: 'Happy', category: 'positive' },
      { icon: EmojiGrinningIcon, name: 'Grinning', category: 'positive' },
      { icon: EmojiCoolIcon, name: 'Cool', category: 'positive' },
      { icon: EmojiMoneyMouthIcon, name: 'Money Mouth', category: 'positive' },
      { icon: EmojiCowboyHatFaceIcon, name: 'Cowboy Hat', category: 'positive' },
      { icon: EmojiPartyingFaceIcon, name: 'Partying', category: 'positive' },
      { icon: EmojiMoneyFaceIcon, name: 'Money Face', category: 'positive' },
      { icon: EmojiSmilingFaceWithHeartsIcon, name: 'Smiling with Hearts', category: 'positive' },
      { icon: EmojiSmilingFaceWithSunglassesIcon, name: 'Smiling with Sunglasses', category: 'positive' },
      { icon: EmojiFaceBlowingAKissIcon, name: 'Blowing a Kiss', category: 'positive' },
      { icon: EmojiGrinningFaceWithSmilingEyesIcon, name: 'Grinning Smiling Eyes', category: 'positive' },
      { icon: EmojiRollingOnTheFloorLaughingIcon, name: 'Rolling Floor Laughing', category: 'positive' },
      { icon: EmojiSmilingFaceWithSmilingEyesIcon, name: 'Smiling Smiling Eyes', category: 'positive' },
      { icon: EmojiSmilingFaceWithHaloIcon, name: 'Smiling Halo', category: 'positive' },
      { icon: EmojiHuggingFaceIcon, name: 'Hugging', category: 'positive' }
    ],
    animal: [
      { icon: EmojiCatFaceIcon, name: 'Cat Face', category: 'animal' },
      { icon: EmojiDogFaceIcon, name: 'Dog Face', category: 'animal' },
      { icon: EmojiMouseFaceIcon, name: 'Mouse Face', category: 'animal' },
      { icon: EmojiHamsterFaceIcon, name: 'Hamster Face', category: 'animal' },
      { icon: EmojiRabbitFaceIcon, name: 'Rabbit Face', category: 'animal' },
      { icon: EmojiFoxFaceIcon, name: 'Fox Face', category: 'animal' },
      { icon: EmojiBearFaceIcon, name: 'Bear Face', category: 'animal' },
      { icon: EmojiPandaFaceIcon, name: 'Panda Face', category: 'animal' },
      { icon: EmojiKoalaFaceIcon, name: 'Koala Face', category: 'animal' },
      { icon: EmojiLionFaceIcon, name: 'Lion Face', category: 'animal' },
      { icon: EmojiTigerFaceIcon, name: 'Tiger Face', category: 'animal' },
      { icon: EmojiCowFaceIcon, name: 'Cow Face', category: 'animal' },
      { icon: EmojiPigFaceIcon, name: 'Pig Face', category: 'animal' },
      { icon: EmojiFrogFaceIcon, name: 'Frog Face', category: 'animal' },
      { icon: EmojiMonkeyFaceIcon, name: 'Monkey Face', category: 'animal' },
      { icon: EmojiChickenIcon, name: 'Chicken', category: 'animal' },
      { icon: EmojiPenguinIcon, name: 'Penguin', category: 'animal' },
      { icon: EmojiBirdIcon, name: 'Bird', category: 'animal' },
      { icon: EmojiDuckIcon, name: 'Duck', category: 'animal' },
      { icon: EmojiEagleIcon, name: 'Eagle', category: 'animal' },
      { icon: EmojiOwlIcon, name: 'Owl', category: 'animal' },
      { icon: EmojiBatIcon, name: 'Bat', category: 'animal' },
      { icon: EmojiWolfFaceIcon, name: 'Wolf Face', category: 'animal' },
      { icon: EmojiBoarIcon, name: 'Boar', category: 'animal' },
      { icon: EmojiHorseFaceIcon, name: 'Horse Face', category: 'animal' },
      { icon: EmojiUnicornFaceIcon, name: 'Unicorn Face', category: 'animal' }
    ],
    // Add more categories as needed
  };

  const filteredEmojis = selectedCategory === 'all' 
    ? emojiCategories.all 
    : emojiCategories[selectedCategory as keyof typeof emojiCategories] || [];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Emoji Collection</h2>
      
      <div className="mb-6">
        <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category:
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Categories</option>
          <option value="positive">Positive Emotions</option>
          <option value="animal">Animals</option>
          <option value="negative">Negative Emotions</option>
          <option value="playful">Playful</option>
          <option value="neutral">Neutral</option>
          <option value="surprised">Surprised</option>
          <option value="tired">Tired</option>
          <option value="sick">Sick</option>
          <option value="silenced">Silenced</option>
          <option value="emotional">Emotional</option>
          <option value="stressed">Stressed</option>
          <option value="sad">Sad</option>
          <option value="angry">Angry</option>
          <option value="happy">Happy</option>
          <option value="funny">Funny</option>
          <option value="nervous">Nervous</option>
          <option value="silly">Silly</option>
          <option value="alien">Alien</option>
          <option value="monster">Monster</option>
          <option value="robot">Robot</option>
          <option value="insect">Insects</option>
          <option value="nature">Nature</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filteredEmojis.map((emoji, index) => {
          const IconComponent = emoji.icon;
          return (
            <div 
              key={index} 
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <IconComponent className="w-10 h-10 text-indigo-600" />
              </div>
              <span className="mt-2 text-xs text-center text-gray-600">{emoji.name}</span>
            </div>
          );
        })}
      </div>

      {filteredEmojis.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No emojis found in this category
        </div>
      )}
    </div>
  );
};

export default ComboEmoticonDisplay;