// ============================================================
// ANCHORED VERSE — Verse Database
// Elora Radiance Co.
// ------------------------------------------------------------
// 10-17 verses per emotion (30 emotions, 394 passages), in one translation:
// the Berean Standard Bible (BSB), which is in the public domain.
//
// TEXT (2026-11-24): every passage was built from the published BSB
// (USFM files, github.com/usfm-bible/examples.bsb) and follows its
// wording and capitals, including LORD for the divine name.
// A passage that quotes only part of a verse is labeled a or b
// ("Joel 2:13a"). Stand-alone quotes may begin with a capital and
// end with a period where the verse runs on; quotation marks left
// open by quoting part of a speech are dropped, and speech inside a
// passage uses single marks because the app wraps each passage in
// double ones. When adding or editing a verse, copy it from the BSB
// and keep those conventions.
//
// WHY ONE TRANSLATION: until 2026-11-24 the app also carried the
// NKJV, ESV and NIV. Their publishers require a licence to store
// the text in an app (Crossway's reply, 2026-11-23), so those texts
// were removed. Do not add a copyrighted translation back without a
// written licence.
//
// STRUCTURE: to add/edit, just edit this array. This file is
// also your Supabase seed — the shape maps 1:1 to a table.
// ============================================================

export const BRAND = {
  navy: "#1C2B39",
  teal: "#2A8C8C",
  amber: "#E8A33D",
  cream: "#E3E5D8",
};

export const TRANSLATIONS = ["BSB"];

// Reference labels corrected on 2026-11-17 (a passage that quotes part of a verse is marked a or b).
// Old label -> new label, so verses people saved before the change keep their place.
// Keys with "feeling::" apply to that feeling only.
export const REF_RENAMES = {
  "Deuteronomy 33:27": "Deuteronomy 33:27a",
  "Isaiah 61:1-3": "Isaiah 61:1b-3a",
  "Nehemiah 8:10": "Nehemiah 8:10b",
  "Isaiah 43:1": "Isaiah 43:1b",
  "Isaiah 43:4": "Isaiah 43:4a",
  "Isaiah 53:3": "Isaiah 53:3a",
  "Jeremiah 1:5": "Jeremiah 1:5a",
  "Joel 2:13": "Joel 2:13a",
  "Matthew 17:20": "Matthew 17:20b",
  "Matthew 18:21-22": "Matthew 18:21b-22",
  "Luke 23:34": "Luke 23:34a",
  "John 11:25-26": "John 11:25b-26a",
  "Romans 5:3-4": "Romans 5:3b-4",
  "1 Corinthians 14:33": "1 Corinthians 14:33a",
  "1 Corinthians 15:54-55": "1 Corinthians 15:54b-55",
  "2 Corinthians 1:3-4": "2 Corinthians 1:3-4a",
  "Ephesians 1:4-5": "Ephesians 1:4-5a",
  "Hebrews 6:19": "Hebrews 6:19a",
  "1 Peter 5:8-9": "1 Peter 5:8-9a",
  "1 John 3:1": "1 John 3:1a",
  "grieving::Psalm 30:5": "Psalm 30:5b",
  "happy::Galatians 5:22-23": "Galatians 5:22-23a",
  "faith::Galatians 2:20": "Galatians 2:20b"
};

export const BANDS = [
  { id: "heavy", label: "Heavy", hint: "When the weight is pressing", color: BRAND.navy },
  { id: "friction", label: "Friction", hint: "When something needs to give", color: BRAND.amber },
  { id: "light", label: "Light", hint: "When you want to stay anchored", color: BRAND.teal },
];

// The Feelings Wheel: six core emotions at the center, each feeling (EMOTIONS below) around its core.
// Order is clockwise from the top-left; every feeling id appears exactly once.
export const CORES = [
  { id: "sorrow",   name: "Sorrow",   band: "heavy",    color: "#7FA4C8", hint: "When your heart is heavy",          emotions: ["sad", "grieving", "lonely", "hurt", "rejected", "discouraged", "weary"] },
  { id: "fear",     name: "Fear",     band: "heavy",    color: "#A99AD6", hint: "When worry won't let go",           emotions: ["anxious", "stressed", "fearful", "overwhelmed", "insecure"] },
  { id: "anger",    name: "Anger",    band: "friction", color: "#E0875A", hint: "When something needs to give",      emotions: ["angry", "frustrated", "irritated", "impatient", "jealous"] },
  { id: "struggle", name: "Struggle", band: "friction", color: "#D98C9A", hint: "When you're wrestling within",       emotions: ["confused", "tempted", "ashamed", "repentant"] },
  { id: "joy",      name: "Joy",      band: "light",    color: "#D6A55A", hint: "When your cup is full",             emotions: ["happy", "grateful", "loved", "hopeful"] },
  { id: "peace",    name: "Peace",    band: "light",    color: "#6BB3AE", hint: "When you want to stay anchored",    emotions: ["peaceful", "content", "faith", "bold", "forgiving"] },
];

export const EMOTIONS = [
  // ==========================================================
  // HEAVY BAND
  // ==========================================================
  {
    id: "anxious",
    name: "Anxious",
    band: "heavy",
    reflections: [
      "Anxiety lives in tomorrow. Scripture keeps pulling you back to today, where God actually is. Trade the rehearsal of fear for the practice of prayer.",
      "Anxiety is you trying to carry tomorrow on today's strength. God hands out grace by the day, never in advance — you'll have what you need exactly when you need it.",
      "Most of what you rehearse never arrives, and what does, He's already standing in. Hand Him the worry by name. He invites the weight because He can actually carry it.",
    ],
    verses: [
      {
        ref: "Philippians 4:6-7",
        BSB: "Be anxious for nothing, but in everything, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
      },
      {
        ref: "1 Peter 5:7",
        BSB: "Cast all your anxiety on Him, because He cares for you.",
      },
      {
        ref: "Matthew 6:34",
        BSB: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Today has enough trouble of its own.",
      },
      {
        ref: "Psalm 94:19",
        BSB: "When anxiety overwhelms me, Your consolation delights my soul.",
      },
      {
        ref: "Psalm 55:22",
        BSB: "Cast your burden upon the LORD and He will sustain you; He will never let the righteous be shaken.",
      },
      {
        ref: "Matthew 6:25",
        BSB: "Therefore I tell you, do not worry about your life, what you will eat or drink; or about your body, what you will wear. Is not life more than food, and the body more than clothes?",
      },
      {
        ref: "John 14:27",
        BSB: "Peace I leave with you; My peace I give to you. I do not give to you as the world gives. Do not let your hearts be troubled; do not be afraid.",
      },
      {
        ref: "Isaiah 41:10",
        BSB: "Do not fear, for I am with you; do not be afraid, for I am your God. I will strengthen you; I will surely help you; I will uphold you with My righteous right hand.",
      },
      {
        ref: "Psalm 34:4",
        BSB: "I sought the LORD, and He answered me; He delivered me from all my fears.",
      },
      {
        ref: "Proverbs 12:25",
        BSB: "Anxiety weighs down the heart of a man, but a good word cheers it up.",
      },
      {
        ref: "Isaiah 26:3",
        BSB: "You will keep in perfect peace the steadfast of mind, because he trusts in You.",
      },
      {
        ref: "Matthew 11:28",
        BSB: "Come to Me, all you who are weary and burdened, and I will give you rest.",
      },
      {
        ref: "Psalm 121:1-2",
        BSB: "I lift up my eyes to the hills. From where does my help come? My help comes from the LORD, the Maker of heaven and earth.",
      },
      {
        ref: "2 Thessalonians 3:16",
        BSB: "Now may the Lord of peace Himself give you peace at all times and in every way. The Lord be with all of you.",
      },
      {
        ref: "Psalm 46:1",
        BSB: "God is our refuge and strength, an ever-present help in times of trouble.",
      },
      {
        ref: "Deuteronomy 31:6",
        BSB: "Be strong and courageous; do not be afraid or terrified of them, for it is the LORD your God who goes with you; He will never leave you nor forsake you.",
      },
      {
        ref: "John 16:33",
        BSB: "I have told you these things so that in Me you may have peace. In the world you will have tribulation. But take courage; I have overcome the world!",
      },
    ],
  },
  {
    id: "sad",
    name: "Sad",
    band: "heavy",
    reflections: [
      "God doesn't rush your sorrow. He sits in it with you and promises the morning is coming. Grief and faith can share the same room.",
      "God keeps your tears in a bottle — none of this is wasted on Him. You're not too much for the One who counts every one. Let it out; the morning He promised is still coming.",
      "Sadness isn't weak faith — half the Psalms are written in it. Bring the ache unedited; He can hold your whole heart. You don't have to dress it up to be welcome.",
    ],
    verses: [
      {
        ref: "Psalm 34:18",
        BSB: "The LORD is near to the brokenhearted; He saves the contrite in spirit.",
      },
      {
        ref: "Psalm 147:3",
        BSB: "He heals the brokenhearted and binds up their wounds.",
      },
      {
        ref: "Psalm 30:5",
        BSB: "For His anger is fleeting, but His favor lasts a lifetime. Weeping may stay the night, but joy comes in the morning.",
      },
      {
        ref: "Matthew 5:4",
        BSB: "Blessed are those who mourn, for they will be comforted.",
      },
      {
        ref: "Psalm 42:11",
        BSB: "Why are you downcast, O my soul? Why the unease within me? Put your hope in God, for I will yet praise Him, my Savior and my God.",
      },
      {
        ref: "Revelation 21:4",
        BSB: "‘He will wipe away every tear from their eyes,’ and there will be no more death or mourning or crying or pain, for the former things have passed away.",
      },
      {
        ref: "Psalm 73:26",
        BSB: "My flesh and my heart may fail, but God is the strength of my heart and my portion forever.",
      },
      {
        ref: "2 Corinthians 1:3-4a",
        BSB: "Blessed be the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles.",
      },
      {
        ref: "Psalm 56:8",
        BSB: "You have taken account of my wanderings. Put my tears in Your bottle—are they not in Your book?",
      },
      {
        ref: "Isaiah 53:3a",
        BSB: "He was despised and rejected by men, a man of sorrows, acquainted with grief.",
      },
      {
        ref: "Psalm 31:9",
        BSB: "Be merciful to me, O LORD, for I am in distress; my eyes fail from sorrow, my soul and body as well.",
      },
      {
        ref: "John 14:1",
        BSB: "Do not let your hearts be troubled. You believe in God; believe in Me as well.",
      },
      {
        ref: "Psalm 23:4",
        BSB: "Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me; Your rod and Your staff, they comfort me.",
      },
      {
        ref: "Isaiah 43:2",
        BSB: "When you pass through the waters, I will be with you; and when you go through the rivers, they will not overwhelm you. When you walk through the fire, you will not be scorched; the flames will not set you ablaze.",
      },
      {
        ref: "Matthew 11:28-29",
        BSB: "Come to Me, all you who are weary and burdened, and I will give you rest. Take My yoke upon you and learn from Me, for I am gentle and humble in heart, and you will find rest for your souls.",
      },
      {
        ref: "Lamentations 3:22-23",
        BSB: "Because of the loving devotion of the LORD we are not consumed, for His mercies never fail. They are new every morning; great is Your faithfulness!",
      },
    ],
  },
  {
    id: "overwhelmed",
    name: "Overwhelmed",
    band: "heavy",
    reflections: [
      "Overwhelm is a capacity problem. The invitation isn't to do more — it's to be carried. Lay the load down before it lays you down.",
      "Overwhelm often means you've picked up an assignment God never handed you. His yoke fits; the extra weight was never yours. Do the next right thing, not all the things.",
      "You can't carry the whole week in one afternoon. Shrink it to the next single step and give Him the rest. He runs the universe — He can be trusted with your list.",
    ],
    verses: [
      {
        ref: "Matthew 11:28-29",
        BSB: "Come to Me, all you who are weary and burdened, and I will give you rest. Take My yoke upon you and learn from Me, for I am gentle and humble in heart, and you will find rest for your souls.",
      },
      {
        ref: "Psalm 61:2",
        BSB: "From the ends of the earth I call out to You whenever my heart is faint. Lead me to the rock that is higher than I.",
      },
      {
        ref: "Psalm 55:22",
        BSB: "Cast your burden upon the LORD and He will sustain you; He will never let the righteous be shaken.",
      },
      {
        ref: "2 Corinthians 12:9",
        BSB: "My grace is sufficient for you, for My power is perfected in weakness.",
      },
      {
        ref: "Psalm 42:7",
        BSB: "Deep calls to deep in the roar of Your waterfalls; all Your breakers and waves have rolled over me.",
      },
      {
        ref: "Isaiah 40:31",
        BSB: "But those who wait upon the LORD will renew their strength; they will mount up with wings like eagles; they will run and not grow weary, they will walk and not faint.",
      },
      {
        ref: "Psalm 18:6",
        BSB: "In my distress I called upon the LORD; I cried to my God for help. From His temple He heard my voice, and my cry for His help reached His ears.",
      },
      {
        ref: "Exodus 14:14",
        BSB: "The LORD will fight for you; you need only to be still.",
      },
      {
        ref: "Psalm 46:1-2",
        BSB: "God is our refuge and strength, an ever-present help in times of trouble. Therefore we will not fear, though the earth is transformed and the mountains are toppled into the depths of the seas.",
      },
      {
        ref: "Deuteronomy 33:27a",
        BSB: "The eternal God is your dwelling place, and underneath are the everlasting arms.",
      },
      {
        ref: "Psalm 142:3",
        BSB: "Although my spirit grows faint within me, You know my way. Along the path I travel they have hidden a snare for me.",
      },
      {
        ref: "1 Peter 5:7",
        BSB: "Cast all your anxiety on Him, because He cares for you.",
      },
      {
        ref: "Psalm 34:17",
        BSB: "The righteous cry out, and the LORD hears; He delivers them from all their troubles.",
      },
      {
        ref: "John 14:27",
        BSB: "Peace I leave with you; My peace I give to you. I do not give to you as the world gives. Do not let your hearts be troubled; do not be afraid.",
      },
      {
        ref: "Psalm 121:1-2",
        BSB: "I lift up my eyes to the hills. From where does my help come? My help comes from the LORD, the Maker of heaven and earth.",
      },
      {
        ref: "Philippians 4:13",
        BSB: "I can do all things through Christ who gives me strength.",
      },
    ],
  },
  {
    id: "fearful",
    name: "Fearful",
    band: "heavy",
    reflections: [
      "Fear shrinks the world to the threat in front of you. God's nearness widens it back out. Courage isn't the absence of fear — it's the presence of God.",
      "Scripture says 'do not fear' more than any other command — not because it's easy, but because He keeps showing up. Fear pictures a future with God edited out. He's already there.",
      "Fear and faith both ask you to bet on something unseen. The surer you are that He's for you, the less the threat gets the final word. Name it, then move anyway.",
    ],
    verses: [
      {
        ref: "Isaiah 41:10",
        BSB: "Do not fear, for I am with you; do not be afraid, for I am your God. I will strengthen you; I will surely help you; I will uphold you with My righteous right hand.",
      },
      {
        ref: "Psalm 56:3",
        BSB: "When I am afraid, I put my trust in You.",
      },
      {
        ref: "Psalm 27:1",
        BSB: "The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—whom shall I dread?",
      },
      {
        ref: "2 Timothy 1:7",
        BSB: "For God has not given us a spirit of fear, but of power, love, and self-control.",
      },
      {
        ref: "Joshua 1:9",
        BSB: "Have I not commanded you to be strong and courageous? Do not be afraid; do not be discouraged, for the LORD your God is with you wherever you go.",
      },
      {
        ref: "Psalm 23:4",
        BSB: "Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me; Your rod and Your staff, they comfort me.",
      },
      {
        ref: "Isaiah 43:1b",
        BSB: "Do not fear, for I have redeemed you; I have called you by your name; you are Mine!",
      },
      {
        ref: "Psalm 34:4",
        BSB: "I sought the LORD, and He answered me; He delivered me from all my fears.",
      },
      {
        ref: "Psalm 118:6",
        BSB: "The LORD is on my side; I will not be afraid. What can man do to me?",
      },
      {
        ref: "1 John 4:18",
        BSB: "There is no fear in love, but perfect love drives out fear, because fear involves punishment. The one who fears has not been perfected in love.",
      },
      {
        ref: "Deuteronomy 31:6",
        BSB: "Be strong and courageous; do not be afraid or terrified of them, for it is the LORD your God who goes with you; He will never leave you nor forsake you.",
      },
      {
        ref: "Psalm 91:1-2",
        BSB: "He who dwells in the shelter of the Most High will abide in the shadow of the Almighty. I will say to the LORD, ‘You are my refuge and my fortress, my God, in whom I trust.’",
      },
      {
        ref: "Isaiah 41:13",
        BSB: "For I am the LORD your God, who takes hold of your right hand and tells you: Do not fear, I will help you.",
      },
      {
        ref: "Matthew 10:28",
        BSB: "Do not be afraid of those who kill the body but cannot kill the soul. Instead, fear the One who can destroy both soul and body in hell.",
      },
      {
        ref: "Psalm 46:1-2",
        BSB: "God is our refuge and strength, an ever-present help in times of trouble. Therefore we will not fear, though the earth is transformed and the mountains are toppled into the depths of the seas.",
      },
      {
        ref: "Proverbs 29:25",
        BSB: "The fear of man is a snare, but whoever trusts in the LORD is set securely on high.",
      },
    ],
  },
  {
    id: "lonely",
    name: "Lonely",
    band: "heavy",
    reflections: [
      "Loneliness lies about your worth and God's absence. He has staked His name on never leaving. You are seen even when you feel unseen.",
      "Alone and forsaken are not the same thing. Jesus was forsaken so you would never have to be. The room may feel empty — the covenant holding you isn't.",
      "Loneliness is real data, not a life sentence. You were made for connection, and the first thread runs upward. Reach for Him tonight, then reach for one person tomorrow.",
    ],
    verses: [
      {
        ref: "Deuteronomy 31:8",
        BSB: "The LORD Himself goes before you; He will be with you. He will never leave you nor forsake you. Do not be afraid or discouraged.",
      },
      {
        ref: "Psalm 68:6",
        BSB: "God settles the lonely in families; He leads the prisoners out to prosperity, but the rebellious dwell in a sun-scorched land.",
      },
      {
        ref: "Hebrews 13:5",
        BSB: "Keep your lives free from the love of money and be content with what you have, for God has said: ‘Never will I leave you, never will I forsake you.’",
      },
      {
        ref: "Psalm 25:16",
        BSB: "Turn to me and be gracious, for I am lonely and afflicted.",
      },
      {
        ref: "Isaiah 41:10",
        BSB: "Do not fear, for I am with you; do not be afraid, for I am your God. I will strengthen you; I will surely help you; I will uphold you with My righteous right hand.",
      },
      {
        ref: "Matthew 28:20",
        BSB: "Teaching them to obey all that I have commanded you. And surely I am with you always, even to the end of the age.",
      },
      {
        ref: "Psalm 139:7-10",
        BSB: "Where can I go to escape Your Spirit? Where can I flee from Your presence? If I ascend to the heavens, You are there; if I make my bed in Sheol, You are there. If I rise on the wings of the dawn, if I settle by the farthest sea, even there Your hand will guide me; Your right hand will hold me fast.",
      },
      {
        ref: "Psalm 27:10",
        BSB: "Though my father and mother forsake me, the LORD will receive me.",
      },
      {
        ref: "John 14:18",
        BSB: "I will not leave you as orphans; I will come to you.",
      },
      {
        ref: "Psalm 34:18",
        BSB: "The LORD is near to the brokenhearted; He saves the contrite in spirit.",
      },
      {
        ref: "Isaiah 43:2",
        BSB: "When you pass through the waters, I will be with you; and when you go through the rivers, they will not overwhelm you. When you walk through the fire, you will not be scorched; the flames will not set you ablaze.",
      },
      {
        ref: "Romans 8:38-39",
        BSB: "For I am convinced that neither death nor life, neither angels nor principalities, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.",
      },
      {
        ref: "Zephaniah 3:17",
        BSB: "The LORD your God is among you; He is mighty to save. He will rejoice over you with gladness; He will quiet you with His love; He will rejoice over you with singing.",
      },
      {
        ref: "1 Peter 5:7",
        BSB: "Cast all your anxiety on Him, because He cares for you.",
      },
      {
        ref: "Psalm 73:23",
        BSB: "Yet I am always with You; You hold my right hand.",
      },
    ],
  },
  {
    id: "grieving",
    name: "Grieving",
    band: "heavy",
    reflections: [
      "Grief is love with nowhere to go. God promises a day when every tear gets accounted for. Mourn fully — you don't grieve as those without hope.",
      "Grief doesn't move in a straight line or keep your schedule. God isn't timing your healing. The God of all comfort meets you on the worst days, not only the composed ones.",
      "You aren't grieving into nothing. Death is real, but in Christ it's a door, not a wall. Hold the sorrow and the hope at once — they were never meant to be enemies.",
    ],
    verses: [
      {
        ref: "Revelation 21:4",
        BSB: "‘He will wipe away every tear from their eyes,’ and there will be no more death or mourning or crying or pain, for the former things have passed away.",
      },
      {
        ref: "Matthew 5:4",
        BSB: "Blessed are those who mourn, for they will be comforted.",
      },
      {
        ref: "1 Thessalonians 4:13",
        BSB: "Brothers, we do not want you to be uninformed about those who sleep in death, so that you will not grieve like the rest, who are without hope.",
      },
      {
        ref: "Psalm 34:18",
        BSB: "The LORD is near to the brokenhearted; He saves the contrite in spirit.",
      },
      {
        ref: "John 11:25b-26a",
        BSB: "I am the resurrection and the life. Whoever believes in Me will live, even though he dies. And everyone who lives and believes in Me will never die.",
      },
      {
        ref: "Psalm 147:3",
        BSB: "He heals the brokenhearted and binds up their wounds.",
      },
      {
        ref: "2 Corinthians 1:3-4a",
        BSB: "Blessed be the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles.",
      },
      {
        ref: "Psalm 30:5b",
        BSB: "Weeping may stay the night, but joy comes in the morning.",
      },
      {
        ref: "Isaiah 61:1b-3a",
        BSB: "He has sent Me to bind up the brokenhearted... to comfort all who mourn... to give them a crown of beauty for ashes, the oil of joy for mourning, and a garment of praise for a spirit of despair.",
      },
      {
        ref: "Psalm 23:4",
        BSB: "Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me; Your rod and Your staff, they comfort me.",
      },
      {
        ref: "John 14:1-3",
        BSB: "Do not let your hearts be troubled. You believe in God; believe in Me as well. In My Father’s house are many rooms. If it were not so, would I have told you that I am going there to prepare a place for you? And if I go and prepare a place for you, I will come back and welcome you into My presence, so that you also may be where I am.",
      },
      {
        ref: "Psalm 116:15",
        BSB: "Precious in the sight of the LORD is the death of His saints.",
      },
      {
        ref: "Romans 8:18",
        BSB: "I consider that our present sufferings are not comparable to the glory that will be revealed in us.",
      },
      {
        ref: "Psalm 56:8",
        BSB: "You have taken account of my wanderings. Put my tears in Your bottle—are they not in Your book?",
      },
      {
        ref: "1 Corinthians 15:54b-55",
        BSB: "Death has been swallowed up in victory. Where, O Death, is your victory? Where, O Death, is your sting?",
      },
    ],
  },
  {
    id: "insecure",
    name: "Insecure",
    band: "heavy",
    reflections: [
      "Your identity was assigned before you performed anything. Insecurity argues with God's craftsmanship. You are not a draft — you are His workmanship.",
      "Insecurity keeps auditing a verdict God already handed down. You were chosen before you achieved anything. The One whose vote outranks the room calls you His — stop relitigating a settled case.",
      "Comparison is the thief that feeds insecurity. He made no one else to be you, doing what you're here to do. Run your lane — the assignment is yours, not the room's.",
    ],
    verses: [
      {
        ref: "Psalm 139:14",
        BSB: "I praise You, for I am fearfully and wonderfully made. Marvelous are Your works, and I know this very well.",
      },
      {
        ref: "Ephesians 2:10",
        BSB: "For we are God’s workmanship, created in Christ Jesus to do good works, which God prepared in advance as our way of life.",
      },
      {
        ref: "Jeremiah 1:5a",
        BSB: "Before I formed you in the womb I knew you, and before you were born I set you apart.",
      },
      {
        ref: "2 Corinthians 12:9",
        BSB: "My grace is sufficient for you, for My power is perfected in weakness.",
      },
      {
        ref: "1 Peter 2:9",
        BSB: "But you are a chosen people, a royal priesthood, a holy nation, a people for God’s own possession, to proclaim the virtues of Him who called you out of darkness into His marvelous light.",
      },
      {
        ref: "Galatians 2:20",
        BSB: "I have been crucified with Christ, and I no longer live, but Christ lives in me. The life I live in the body, I live by faith in the Son of God, who loved me and gave Himself up for me.",
      },
      {
        ref: "Zephaniah 3:17",
        BSB: "The LORD your God is among you; He is mighty to save. He will rejoice over you with gladness; He will quiet you with His love; He will rejoice over you with singing.",
      },
      {
        ref: "Romans 8:1",
        BSB: "Therefore, there is now no condemnation for those who are in Christ Jesus.",
      },
      {
        ref: "Colossians 2:10",
        BSB: "And you have been made complete in Christ, who is the head over every ruler and authority.",
      },
      {
        ref: "1 John 3:1a",
        BSB: "Behold what manner of love the Father has given to us, that we should be called children of God. And that is what we are!",
      },
      {
        ref: "Isaiah 43:4a",
        BSB: "Because you are precious and honored in My sight, and because I love you.",
      },
      {
        ref: "Philippians 1:6",
        BSB: "Being confident of this, that He who began a good work in you will carry it on to completion until the day of Christ Jesus.",
      },
      {
        ref: "Psalm 34:5",
        BSB: "Those who look to Him are radiant with joy; their faces shall never be ashamed.",
      },
      {
        ref: "2 Corinthians 5:17",
        BSB: "Therefore if anyone is in Christ, he is a new creation. The old has passed away. Behold, the new has come!",
      },
      {
        ref: "Ephesians 1:4-5a",
        BSB: "For He chose us in Him before the foundation of the world to be holy and blameless in His presence. In love He predestined us for adoption as His sons through Jesus Christ.",
      },
    ],
  },
  {
    id: "discouraged",
    name: "Discouraged",
    band: "heavy",
    reflections: [
      "Discouragement whispers that nothing is changing. But the inner you is being renewed day by day, even when the outside looks the same. Don't lose heart over what you can't see yet.",
      "The righteous fall seven times and rise again. The falling is assumed; the rising is the point. You're not finished because you got knocked down. Get up one more time.",
      "David was surrounded by grief and blame, and he strengthened himself in the Lord. Sometimes no one else will lift you first. Open the Word, say the truth out loud, and let God steady your heart.",
    ],
    verses: [
      {
        ref: "2 Corinthians 4:16",
        BSB: "Therefore we do not lose heart. Though our outer self is wasting away, yet our inner self is being renewed day by day.",
      },
      {
        ref: "Hebrews 12:3",
        BSB: "Consider Him who endured such hostility from sinners, so that you will not grow weary and lose heart.",
      },
      {
        ref: "Isaiah 42:3",
        BSB: "A bruised reed He will not break and a smoldering wick He will not extinguish; He will faithfully bring forth justice.",
      },
      {
        ref: "Micah 7:8",
        BSB: "Do not gloat over me, my enemy! Though I have fallen, I will arise; though I sit in darkness, the LORD will be my light.",
      },
      {
        ref: "Psalm 27:13",
        BSB: "Still I am certain to see the goodness of the LORD in the land of the living.",
      },
      {
        ref: "Psalm 31:24",
        BSB: "Be strong and courageous, all you who hope in the LORD.",
      },
      {
        ref: "Proverbs 24:16",
        BSB: "For though a righteous man may fall seven times, he still gets up; but the wicked stumble in bad times.",
      },
      {
        ref: "2 Corinthians 4:8-9",
        BSB: "We are hard pressed on all sides, but not crushed; perplexed, but not in despair; persecuted, but not forsaken; struck down, but not destroyed.",
      },
      {
        ref: "1 Samuel 30:6",
        BSB: "And David was greatly distressed because the people spoke of stoning him, because the soul of every man grieved for his sons and daughters. But David found strength in the LORD his God.",
      },
      {
        ref: "Psalm 40:2",
        BSB: "He lifted me up from the pit of despair, out of the miry clay; He set my feet upon a rock, and made my footsteps firm.",
      },
    ],
  },
  {
    id: "weary",
    name: "Weary",
    band: "heavy",
    reflections: [
      "Weariness isn't failure; it's your body and soul telling the truth. Even Elijah needed sleep and a meal before anything else. Rest isn't quitting. It's obedience.",
      "Jesus told His busiest followers to come away and rest a while. If He made room for it, you can too. Step back before you burn out, not after.",
      "You were never meant to run on your own strength. He gives power to the weak and refreshes the weary soul. Return to your rest; He has been good to you, and He isn't done.",
    ],
    verses: [
      {
        ref: "Isaiah 40:29",
        BSB: "He gives power to the faint and increases the strength of the weak.",
      },
      {
        ref: "Psalm 23:2-3",
        BSB: "He makes me lie down in green pastures; He leads me beside quiet waters. He restores my soul; He guides me in the paths of righteousness for the sake of His name.",
      },
      {
        ref: "Jeremiah 31:25",
        BSB: "For I will refresh the weary soul and replenish all who are weak.",
      },
      {
        ref: "Psalm 127:2",
        BSB: "In vain you rise early and stay up late, toiling for bread to eat—for He gives sleep to His beloved.",
      },
      {
        ref: "Mark 6:31",
        BSB: "And He said to them, ‘Come with Me privately to a solitary place, and let us rest for a while.’ For many people were coming and going, and they did not even have time to eat.",
      },
      {
        ref: "Exodus 33:14",
        BSB: "And the LORD answered, ‘My Presence will go with you, and I will give you rest.’",
      },
      {
        ref: "Psalm 116:7",
        BSB: "Return to your rest, O my soul, for the LORD has been good to you.",
      },
      {
        ref: "Hebrews 4:9",
        BSB: "There remains, then, a Sabbath rest for the people of God.",
      },
      {
        ref: "1 Kings 19:5",
        BSB: "Then he lay down under the broom tree and fell asleep. Suddenly an angel touched him and said, ‘Get up and eat.’",
      },
      {
        ref: "Matthew 11:30",
        BSB: "For My yoke is easy and My burden is light.",
      },
    ],
  },
  {
    id: "ashamed",
    name: "Ashamed",
    band: "heavy",
    reflections: [
      "Shame says you are the worst thing you've done. God says you're His, and He is the One who lifts your head. Look up. He knows everything and still calls you His own.",
      "Jesus despised the shame of the cross so you wouldn't have to carry yours. Whoever believes in Him will not be put to shame. Bring it into the light; it loses its grip there.",
      "Even when your heart condemns you, God is greater than your heart. The prodigal's father ran to him before he finished his speech. You're not being kept at a distance. Come home.",
    ],
    verses: [
      {
        ref: "Isaiah 54:4",
        BSB: "Do not be afraid, for you will not be put to shame; do not be intimidated, for you will not be humiliated. For you will forget the shame of your youth and will remember no more the reproach of your widowhood.",
      },
      {
        ref: "Hebrews 12:2",
        BSB: "Let us fix our eyes on Jesus, the author and perfecter of our faith, who for the joy set before Him endured the cross, scorning its shame, and sat down at the right hand of the throne of God.",
      },
      {
        ref: "Isaiah 61:7",
        BSB: "Instead of shame, My people will have a double portion, and instead of humiliation, they will rejoice in their share; and so they will inherit a double portion in their land, and everlasting joy will be theirs.",
      },
      {
        ref: "Romans 10:11",
        BSB: "It is just as the Scripture says: ‘Anyone who believes in Him will never be put to shame.’",
      },
      {
        ref: "Psalm 25:3",
        BSB: "Surely none who wait for You will be put to shame; but those who engage in treachery without cause will be disgraced.",
      },
      {
        ref: "Psalm 3:3",
        BSB: "But You, O LORD, are a shield around me, my glory, and the One who lifts my head.",
      },
      {
        ref: "John 8:11",
        BSB: "‘No one, Lord,’ she answered. ‘Then neither do I condemn you,’ Jesus declared. ‘Now go and sin no more.’",
      },
      {
        ref: "Isaiah 50:7",
        BSB: "Because the Lord GOD helps Me, I have not been disgraced; therefore I have set My face like flint, and I know that I will not be put to shame.",
      },
      {
        ref: "1 John 3:20",
        BSB: "Even if our hearts condemn us, God is greater than our hearts, and He knows all things.",
      },
      {
        ref: "Luke 15:20",
        BSB: "So he got up and went to his father. But while he was still in the distance, his father saw him and was filled with compassion. He ran to his son, embraced him, and kissed him.",
      },
    ],
  },
  {
    id: "angry",
    name: "Angry",
    band: "friction",
    reflections: [
      "Anger isn't the sin — what you do in the next ten seconds is. Slow is strength. A man who rules his spirit outranks one who takes a city.",
      "Anger is a signal, not a strategy. It usually points at something you love or something that's wrong — listen to it, but don't hand it the wheel. Be angry, and do not sin.",
      "God is slow to anger and abounding in love — the slowness is strength, not weakness. Cool the engine before you steer. Name the wrong without becoming it.",
    ],
    verses: [
      {
        ref: "Proverbs 15:1",
        BSB: "A gentle answer turns away wrath, but a harsh word stirs up anger.",
      },
      {
        ref: "James 1:19-20",
        BSB: "My beloved brothers, understand this: Everyone should be quick to listen, slow to speak, and slow to anger, for man’s anger does not bring about the righteousness that God desires.",
      },
      {
        ref: "Proverbs 16:32",
        BSB: "He who is slow to anger is better than a warrior, and he who controls his temper is greater than one who captures a city.",
      },
      {
        ref: "Ephesians 4:26-27",
        BSB: "‘Be angry, yet do not sin.’ Do not let the sun set upon your anger, and do not give the devil a foothold.",
      },
      {
        ref: "Proverbs 14:29",
        BSB: "A patient man has great understanding, but a quick-tempered man promotes folly.",
      },
      {
        ref: "Proverbs 19:11",
        BSB: "A man’s insight gives him patience, and his virtue is to overlook an offense.",
      },
      {
        ref: "Psalm 37:8",
        BSB: "Refrain from anger and abandon wrath; do not fret—it can only bring harm.",
      },
      {
        ref: "Ecclesiastes 7:9",
        BSB: "Do not be quickly provoked in your spirit, for anger settles in the lap of a fool.",
      },
      {
        ref: "Colossians 3:8",
        BSB: "But now you must put aside all such things as these: anger, rage, malice, slander, and filthy language from your lips.",
      },
      {
        ref: "Proverbs 29:11",
        BSB: "A fool vents all his anger, but a wise man holds it back.",
      },
      {
        ref: "Psalm 103:8",
        BSB: "The LORD is compassionate and gracious, slow to anger, abounding in loving devotion.",
      },
      {
        ref: "Romans 12:19",
        BSB: "Do not avenge yourselves, beloved, but leave room for God’s wrath. For it is written: ‘Vengeance is Mine; I will repay, says the Lord.’",
      },
      {
        ref: "Galatians 5:22-23",
        BSB: "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control. Against such things there is no law.",
      },
      {
        ref: "Proverbs 15:18",
        BSB: "A hot-tempered man stirs up strife, but he who is slow to anger calms dispute.",
      },
      {
        ref: "Proverbs 25:28",
        BSB: "Like a city whose walls are broken down is a man who does not control his temper.",
      },
    ],
  },
  {
    id: "frustrated",
    name: "Frustrated",
    band: "friction",
    reflections: [
      "Frustration is friction against your timeline. The harvest has its own season — don't quit before it. Faithfulness now, fruit in due time.",
      "Frustration is the gap between what you want and what you control. Narrow it — pour everything into your part, release the part that was never yours. He isn't slow; He's thorough.",
      "What feels like delay is often unseen preparation. God wastes nothing, the wait included. Keep showing up — the reps you resent are the ones building you.",
    ],
    verses: [
      {
        ref: "Galatians 6:9",
        BSB: "Let us not grow weary in well-doing, for in due time we will reap a harvest if we do not give up.",
      },
      {
        ref: "Isaiah 40:31",
        BSB: "But those who wait upon the LORD will renew their strength; they will mount up with wings like eagles; they will run and not grow weary, they will walk and not faint.",
      },
      {
        ref: "Romans 8:28",
        BSB: "And we know that God works all things together for the good of those who love Him, who are called according to His purpose.",
      },
      {
        ref: "Proverbs 3:5-6",
        BSB: "Trust in the LORD with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He will make your paths straight.",
      },
      {
        ref: "James 1:2-4",
        BSB: "Consider it pure joy, my brothers, when you encounter trials of many kinds, because you know that the testing of your faith develops perseverance. Allow perseverance to finish its work, so that you may be mature and complete, not lacking anything.",
      },
      {
        ref: "Psalm 37:7",
        BSB: "Be still before the LORD and wait patiently for Him; do not fret when men prosper in their ways, when they carry out wicked schemes.",
      },
      {
        ref: "Philippians 4:13",
        BSB: "I can do all things through Christ who gives me strength.",
      },
      {
        ref: "2 Corinthians 4:17",
        BSB: "For our light and momentary affliction is producing for us an eternal weight of glory that is far beyond comparison.",
      },
      {
        ref: "Habakkuk 2:3",
        BSB: "For the vision awaits an appointed time; it testifies of the end and does not lie. Though it lingers, wait for it, since it will surely come and will not delay.",
      },
      {
        ref: "Psalm 27:14",
        BSB: "Wait patiently for the LORD; be strong and courageous. Wait patiently for the LORD!",
      },
      {
        ref: "Romans 5:3b-4",
        BSB: "We also rejoice in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope.",
      },
      {
        ref: "Matthew 11:28-29",
        BSB: "Come to Me, all you who are weary and burdened, and I will give you rest. Take My yoke upon you and learn from Me, for I am gentle and humble in heart, and you will find rest for your souls.",
      },
      {
        ref: "Lamentations 3:25-26",
        BSB: "The LORD is good to those who wait for Him, to the soul who seeks Him. It is good to wait quietly for the salvation of the LORD.",
      },
      {
        ref: "Isaiah 41:10",
        BSB: "Do not fear, for I am with you; do not be afraid, for I am your God. I will strengthen you; I will surely help you; I will uphold you with My righteous right hand.",
      },
      {
        ref: "2 Corinthians 12:9",
        BSB: "My grace is sufficient for you, for My power is perfected in weakness.",
      },
    ],
  },
  {
    id: "irritated",
    name: "Irritated",
    band: "friction",
    reflections: [
      "Irritation is small things stacking up until one more tips you over. The prudent overlook an insult, not because it didn't sting, but because not everything deserves a response. Let this one pass.",
      "Before you fire back, check your own eye first. The speck in theirs is real, but the plank in yours is closer. Gentleness isn't weakness; it's strength that chooses its moment.",
      "A short fuse usually points to an empty tank: tired, hungry, rushed, stretched thin. Guard your mouth for the next hour, then tend to what's actually running low. Love covers more than you think it can.",
    ],
    verses: [
      {
        ref: "Proverbs 12:16",
        BSB: "A fool’s anger is known at once, but a prudent man overlooks an insult.",
      },
      {
        ref: "Proverbs 17:14",
        BSB: "To start a quarrel is to release a flood; so abandon the dispute before it breaks out.",
      },
      {
        ref: "Philippians 4:5",
        BSB: "Let your gentleness be apparent to all. The Lord is near.",
      },
      {
        ref: "1 Corinthians 13:4-5",
        BSB: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It is not rude, it is not self-seeking, it is not easily angered, it keeps no account of wrongs.",
      },
      {
        ref: "Proverbs 20:3",
        BSB: "It is honorable for a man to resolve a dispute, but any fool will quarrel.",
      },
      {
        ref: "Psalm 141:3",
        BSB: "Set a guard, O LORD, over my mouth; keep watch at the door of my lips.",
      },
      {
        ref: "Proverbs 21:23",
        BSB: "He who guards his mouth and tongue keeps his soul from distress.",
      },
      {
        ref: "Matthew 7:3",
        BSB: "Why do you look at the speck in your brother’s eye, but fail to notice the beam in your own eye?",
      },
      {
        ref: "1 Peter 4:8",
        BSB: "Above all, love one another deeply, because love covers over a multitude of sins.",
      },
      {
        ref: "Romans 15:7",
        BSB: "Accept one another, then, just as Christ accepted you, in order to bring glory to God.",
      },
    ],
  },
  {
    id: "impatient",
    name: "Impatient",
    band: "friction",
    reflections: [
      "Impatience assumes God is late. He isn't. He makes everything beautiful in its time, and His timing sees what yours can't. The wait is part of the work, not a pause from it.",
      "The farmer can't rush the rain, but he doesn't sit idle either. Do today's part faithfully and leave the harvest date with God. Patience isn't passive; it's trust that keeps working.",
      "What feels like slowness is often patience toward you. God keeps His promises on His schedule, not yours, and He hasn't forgotten them. Pray it plainly: my times are in Your hands.",
    ],
    verses: [
      {
        ref: "Ecclesiastes 3:11",
        BSB: "He has made everything beautiful in its time. He has also set eternity in the hearts of men, yet they cannot fathom the work that God has done from beginning to end.",
      },
      {
        ref: "2 Peter 3:9",
        BSB: "The Lord is not slow in keeping His promise as some understand slowness, but is patient with you, not wanting anyone to perish but everyone to come to repentance.",
      },
      {
        ref: "Psalm 40:1",
        BSB: "I waited patiently for the LORD; He inclined to me and heard my cry.",
      },
      {
        ref: "Hebrews 10:36",
        BSB: "You need to persevere, so that after you have done the will of God, you will receive what He has promised.",
      },
      {
        ref: "Isaiah 30:18",
        BSB: "Therefore the LORD longs to be gracious to you; therefore He rises to show you compassion, for the LORD is a just God. Blessed are all who wait for Him.",
      },
      {
        ref: "James 5:7",
        BSB: "Be patient, then, brothers, until the Lord’s coming. See how the farmer awaits the precious fruit of the soil—how patient he is for the fall and spring rains.",
      },
      {
        ref: "Psalm 130:5",
        BSB: "I wait for the LORD; my soul does wait, and in His word I put my hope.",
      },
      {
        ref: "Ecclesiastes 7:8",
        BSB: "The end of a matter is better than the beginning, and a patient spirit is better than a proud one.",
      },
      {
        ref: "Micah 7:7",
        BSB: "But as for me, I will look to the LORD; I will wait for the God of my salvation. My God will hear me.",
      },
      {
        ref: "Psalm 31:15",
        BSB: "My times are in Your hands; deliver me from my enemies and from those who pursue me.",
      },
    ],
  },
  {
    id: "jealous",
    name: "Jealous",
    band: "friction",
    reflections: [
      "Envy looks at someone else's blessing and sees your lack. It rots from the inside, stealing joy you already have. Name it honestly, then bring your eyes back to your own lane.",
      "Jesus' answer to comparison was simple: what is that to you? You follow Me. Their story isn't your assignment. Run your race, and rejoice with them when they win theirs.",
      "Delight yourself in the Lord and watch what happens to your wants. Envy shrinks when your heart is full of Him. Celebrate someone today on purpose; it's the fastest cure there is.",
    ],
    verses: [
      {
        ref: "Proverbs 14:30",
        BSB: "A tranquil heart is life to the body, but envy rots the bones.",
      },
      {
        ref: "James 3:16",
        BSB: "For where jealousy and selfish ambition exist, there will be disorder and every evil practice.",
      },
      {
        ref: "Galatians 5:26",
        BSB: "Let us not become conceited, provoking and envying one another.",
      },
      {
        ref: "Psalm 37:1",
        BSB: "Do not fret over those who do evil; do not envy those who do wrong.",
      },
      {
        ref: "Proverbs 23:17",
        BSB: "Do not let your heart envy sinners, but always continue in the fear of the LORD.",
      },
      {
        ref: "Galatians 6:4",
        BSB: "Each one should test his own work. Then he will have reason to boast in himself alone, and not in someone else.",
      },
      {
        ref: "John 21:22",
        BSB: "Jesus answered, ‘If I want him to remain until I return, what is that to you? You follow Me!’",
      },
      {
        ref: "Romans 12:15",
        BSB: "Rejoice with those who rejoice; weep with those who weep.",
      },
      {
        ref: "Philippians 2:3",
        BSB: "Do nothing out of selfish ambition or empty pride, but in humility consider others more important than yourselves.",
      },
      {
        ref: "Psalm 37:4",
        BSB: "Delight yourself in the LORD, and He will give you the desires of your heart.",
      },
    ],
  },
  {
    id: "tempted",
    name: "Tempted",
    band: "friction",
    reflections: [
      "Temptation always overstates its power and hides the exit. God guarantees there's a door. Resist at the doorway, not the destination.",
      "Temptation grows on attention — what you feed gets stronger, what you starve gets weaker. Being tempted isn't failing; even Jesus was. Win it early, in the small yes and no.",
      "Every temptation is common, and so is the exit — God always builds one. Say it out loud to someone; secrecy is where it grows teeth. Light kills what the dark keeps alive.",
    ],
    verses: [
      {
        ref: "1 Corinthians 10:13",
        BSB: "No temptation has seized you except what is common to man. And God is faithful; He will not let you be tempted beyond what you can bear. But when you are tempted, He will also provide an escape, so that you can stand up under it.",
      },
      {
        ref: "James 4:7",
        BSB: "Submit yourselves, then, to God. Resist the devil, and he will flee from you.",
      },
      {
        ref: "James 1:13-14",
        BSB: "When tempted, no one should say, ‘God is tempting me.’ For God cannot be tempted by evil, nor does He tempt anyone. But each one is tempted when by his own evil desires he is lured away and enticed.",
      },
      {
        ref: "Matthew 26:41",
        BSB: "Watch and pray so that you will not enter into temptation. For the spirit is willing, but the body is weak.",
      },
      {
        ref: "Hebrews 4:15-16",
        BSB: "For we do not have a high priest who is unable to sympathize with our weaknesses, but we have one who was tempted in every way that we are, yet was without sin. Let us then approach the throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need.",
      },
      {
        ref: "1 Peter 5:8-9a",
        BSB: "Be sober-minded and alert. Your adversary the devil prowls around like a roaring lion, seeking someone to devour. Resist him, standing firm in your faith.",
      },
      {
        ref: "Psalm 119:11",
        BSB: "I have hidden Your word in my heart that I might not sin against You.",
      },
      {
        ref: "2 Timothy 2:22",
        BSB: "Flee from youthful passions and pursue righteousness, faith, love, and peace, together with those who call on the Lord out of a pure heart.",
      },
      {
        ref: "Galatians 5:16",
        BSB: "So I say, walk by the Spirit, and you will not gratify the desires of the flesh.",
      },
      {
        ref: "Romans 6:14",
        BSB: "For sin shall not be your master, because you are not under law, but under grace.",
      },
      {
        ref: "Proverbs 4:14-15",
        BSB: "Do not set foot on the path of the wicked or walk in the way of evildoers. Avoid it; do not travel on it. Turn from it and pass on by.",
      },
      {
        ref: "James 1:12",
        BSB: "Blessed is the man who perseveres under trial, because when he has stood the test, he will receive the crown of life that God has promised to those who love Him.",
      },
      {
        ref: "1 John 2:16",
        BSB: "For all that is in the world—the desires of the flesh, the desires of the eyes, and the pride of life—is not from the Father but from the world.",
      },
      {
        ref: "Psalm 1:1-2",
        BSB: "Blessed is the man who does not walk in the counsel of the wicked, or set foot on the path of sinners, or sit in the seat of mockers. But his delight is in the Law of the LORD, and on His law he meditates day and night.",
      },
    ],
  },
  {
    id: "repentant",
    name: "Repentant",
    band: "friction",
    reflections: [
      "Conviction is a doorway, not a verdict. Confession moves you through it into clean ground. God doesn't shame the returning — He runs to meet them.",
      "Conviction names a specific thing so you can be free of it; condemnation just whispers you're hopeless. One is God's voice, the other isn't. Confess the specific, then let it go.",
      "Repentance isn't groveling — it's turning around. The blood already covers it; you're not repaying a debt that's been canceled. Walk forward clean, not crawling.",
    ],
    verses: [
      {
        ref: "1 John 1:9",
        BSB: "If we confess our sins, He is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.",
      },
      {
        ref: "Psalm 51:10",
        BSB: "Create in me a clean heart, O God, and renew a right spirit within me.",
      },
      {
        ref: "Psalm 32:5",
        BSB: "Then I acknowledged my sin to You and did not hide my iniquity. I said, ‘I will confess my transgressions to the LORD,’ and You forgave the guilt of my sin. Selah",
      },
      {
        ref: "2 Chronicles 7:14",
        BSB: "If My people who are called by My name humble themselves and pray and seek My face and turn from their wicked ways, then I will hear from heaven, forgive their sin, and heal their land.",
      },
      {
        ref: "Isaiah 1:18",
        BSB: "Come now, let us reason together, says the LORD. Though your sins are like scarlet, they will be as white as snow; though they are as red as crimson, they will become like wool.",
      },
      {
        ref: "Psalm 103:12",
        BSB: "As far as the east is from the west, so far has He removed our transgressions from us.",
      },
      {
        ref: "Acts 3:19",
        BSB: "Repent, then, and turn back, so that your sins may be wiped away.",
      },
      {
        ref: "Joel 2:13a",
        BSB: "So rend your hearts and not your garments, and return to the LORD your God. For He is gracious and compassionate, slow to anger, abounding in loving devotion.",
      },
      {
        ref: "Psalm 34:18",
        BSB: "The LORD is near to the brokenhearted; He saves the contrite in spirit.",
      },
      {
        ref: "Psalm 51:17",
        BSB: "The sacrifices of God are a broken spirit; a broken and a contrite heart, O God, You will not despise.",
      },
      {
        ref: "Luke 15:7",
        BSB: "I tell you that in the same way there will be more joy in heaven over one sinner who repents than over ninety-nine righteous ones who do not need to repent.",
      },
      {
        ref: "2 Corinthians 7:10",
        BSB: "Godly sorrow brings repentance that leads to salvation without regret, but worldly sorrow brings death.",
      },
      {
        ref: "Proverbs 28:13",
        BSB: "He who conceals his sins will not prosper, but whoever confesses and renounces them will find mercy.",
      },
      {
        ref: "1 John 2:1",
        BSB: "My little children, I am writing these things to you so that you will not sin. But if anyone does sin, we have an advocate before the Father—Jesus Christ, the Righteous One.",
      },
      {
        ref: "Lamentations 3:40",
        BSB: "Let us examine and test our ways, and turn back to the LORD.",
      },
    ],
  },
  {
    id: "happy",
    name: "Happy",
    band: "light",
    reflections: [
      "Joy isn't denial of hardship — it's a deeper current under it. Anchor it in the Source, not the circumstance, and it won't drain when the day turns.",
      "Happiness tracks your circumstances; joy is anchored deeper and holds when they shift. Enjoy the good thing fully — then thank the Giver, not just the gift. Shared joy only multiplies.",
      "Don't rush past a good day waiting on the next thing. This is the day the Lord made — actually be in it. Gladness is one way of honoring the One who handed it to you.",
    ],
    verses: [
      {
        ref: "Psalm 118:24",
        BSB: "This is the day that the LORD has made; we will rejoice and be glad in it.",
      },
      {
        ref: "Philippians 4:4",
        BSB: "Rejoice in the Lord always. I will say it again: Rejoice!",
      },
      {
        ref: "Psalm 16:11",
        BSB: "You have made known to me the path of life; You will fill me with joy in Your presence, with eternal pleasures at Your right hand.",
      },
      {
        ref: "Nehemiah 8:10b",
        BSB: "Do not grieve, for the joy of the LORD is your strength.",
      },
      {
        ref: "John 15:11",
        BSB: "I have told you these things so that My joy may be in you and your joy may be complete.",
      },
      {
        ref: "Proverbs 17:22",
        BSB: "A joyful heart is good medicine, but a broken spirit dries up the bones.",
      },
      {
        ref: "Psalm 126:3",
        BSB: "The LORD has done great things for us; we are filled with joy.",
      },
      {
        ref: "Romans 15:13",
        BSB: "Now may the God of hope fill you with all joy and peace as you believe in Him, so that you may overflow with hope by the power of the Holy Spirit.",
      },
      {
        ref: "Psalm 28:7",
        BSB: "The LORD is my strength and my shield; my heart trusts in Him, and I am helped. Therefore my heart rejoices, and I give thanks to Him with my song.",
      },
      {
        ref: "Isaiah 12:2",
        BSB: "Surely God is my salvation; I will trust and not be afraid. For the LORD GOD is my strength and my song, and He also has become my salvation.",
      },
      {
        ref: "Psalm 30:11",
        BSB: "You turned my mourning into dancing; You peeled off my sackcloth and clothed me with joy.",
      },
      {
        ref: "1 Peter 1:8",
        BSB: "Though you have not seen Him, you love Him; and though you do not see Him now, you believe in Him and rejoice with an inexpressible and glorious joy.",
      },
      {
        ref: "Habakkuk 3:17-18",
        BSB: "Though the fig tree does not bud and no fruit is on the vines, though the olive crop fails and the fields produce no food, though the sheep are cut off from the fold and no cattle are in the stalls, yet I will exult in the LORD; I will rejoice in the God of my salvation!",
      },
      {
        ref: "Psalm 144:15",
        BSB: "Blessed are the people of whom this is so; blessed are the people whose God is the LORD.",
      },
      {
        ref: "Galatians 5:22-23a",
        BSB: "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.",
      },
    ],
  },
  {
    id: "grateful",
    name: "Grateful",
    band: "light",
    reflections: [
      "Gratitude is a discipline before it's a feeling. Name the gift and the giver, in any circumstance, and it reorders how you see everything else.",
      "Gratitude and anxiety can't share the same breath. Thanksgiving is what turns a request into peace. Count what's already in your hands before you tally what's missing.",
      "Every good gift came from upstream — none of it is self-made. Gratitude keeps you honest about that. Say it out loud; a named blessing lands deeper than an assumed one.",
    ],
    verses: [
      {
        ref: "1 Thessalonians 5:18",
        BSB: "Give thanks in every circumstance, for this is God’s will for you in Christ Jesus.",
      },
      {
        ref: "Psalm 100:4",
        BSB: "Enter His gates with thanksgiving and His courts with praise; give thanks to Him and bless His name.",
      },
      {
        ref: "Colossians 3:15",
        BSB: "Let the peace of Christ rule in your hearts, for to this you were called as members of one body. And be thankful.",
      },
      {
        ref: "Psalm 107:1",
        BSB: "Give thanks to the LORD, for He is good; His loving devotion endures forever.",
      },
      {
        ref: "Colossians 3:17",
        BSB: "And whatever you do, in word or deed, do it all in the name of the Lord Jesus, giving thanks to God the Father through Him.",
      },
      {
        ref: "James 1:17",
        BSB: "Every good and perfect gift is from above, coming down from the Father of the heavenly lights, with whom there is no change or shifting shadow.",
      },
      {
        ref: "Psalm 9:1",
        BSB: "I will give thanks to the LORD with all my heart; I will recount all Your wonders.",
      },
      {
        ref: "1 Chronicles 16:34",
        BSB: "Give thanks to the LORD, for He is good; His loving devotion endures forever.",
      },
      {
        ref: "Ephesians 5:20",
        BSB: "Always giving thanks to God the Father for everything in the name of our Lord Jesus Christ.",
      },
      {
        ref: "Psalm 95:2",
        BSB: "Let us enter His presence with thanksgiving; let us make a joyful noise to Him in song.",
      },
      {
        ref: "2 Corinthians 9:15",
        BSB: "Thanks be to God for His indescribable gift!",
      },
      {
        ref: "1 Corinthians 15:57",
        BSB: "But thanks be to God, who gives us the victory through our Lord Jesus Christ!",
      },
      {
        ref: "Hebrews 12:28",
        BSB: "Therefore, since we are receiving an unshakable kingdom, let us be filled with gratitude, and so worship God acceptably with reverence and awe.",
      },
      {
        ref: "Psalm 136:1",
        BSB: "Give thanks to the LORD, for He is good. His loving devotion endures forever.",
      },
      {
        ref: "Philippians 4:6",
        BSB: "Be anxious for nothing, but in everything, by prayer and petition, with thanksgiving, present your requests to God.",
      },
    ],
  },
  {
    id: "hopeful",
    name: "Hopeful",
    band: "light",
    reflections: [
      "Hope isn't optimism — it's confidence in a faithful God regardless of the odds in front of you. It's an anchor, not a wish.",
      "Hope isn't wishful — it's evidence-based, resting on a God who hasn't broken a promise yet. Look back at what He's already carried you through; that's your reason to expect morning.",
      "Hope lifts your eyes past this chapter to the One writing the whole book. The story isn't over and the Author is good. Hold the line — what's coming outweighs what's here.",
    ],
    verses: [
      {
        ref: "Romans 15:13",
        BSB: "Now may the God of hope fill you with all joy and peace as you believe in Him, so that you may overflow with hope by the power of the Holy Spirit.",
      },
      {
        ref: "Jeremiah 29:11",
        BSB: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, to give you a future and a hope.",
      },
      {
        ref: "Hebrews 6:19a",
        BSB: "We have this hope as an anchor for the soul, firm and secure.",
      },
      {
        ref: "Romans 5:5",
        BSB: "And hope does not disappoint us, because God has poured out His love into our hearts through the Holy Spirit, whom He has given us.",
      },
      {
        ref: "Isaiah 40:31",
        BSB: "But those who wait upon the LORD will renew their strength; they will mount up with wings like eagles; they will run and not grow weary, they will walk and not faint.",
      },
      {
        ref: "Psalm 39:7",
        BSB: "And now, O Lord, for what do I wait? My hope is in You.",
      },
      {
        ref: "Lamentations 3:21-22",
        BSB: "Yet I call this to mind, and therefore I have hope: Because of the loving devotion of the LORD we are not consumed, for His mercies never fail.",
      },
      {
        ref: "Romans 8:24-25",
        BSB: "For in this hope we were saved; but hope that is seen is no hope at all. Who hopes for what he can already see? But if we hope for what we do not yet see, we wait for it patiently.",
      },
      {
        ref: "Psalm 42:11",
        BSB: "Why are you downcast, O my soul? Why the unease within me? Put your hope in God, for I will yet praise Him, my Savior and my God.",
      },
      {
        ref: "1 Peter 1:3",
        BSB: "Blessed be the God and Father of our Lord Jesus Christ! By His great mercy He has given us new birth into a living hope through the resurrection of Jesus Christ from the dead.",
      },
      {
        ref: "Titus 2:13",
        BSB: "As we await the blessed hope and glorious appearance of our great God and Savior Jesus Christ.",
      },
      {
        ref: "Psalm 71:14",
        BSB: "But I will always hope and will praise You more and more.",
      },
      {
        ref: "Proverbs 23:18",
        BSB: "For surely there is a future, and your hope will not be cut off.",
      },
      {
        ref: "Romans 12:12",
        BSB: "Be joyful in hope, patient in affliction, persistent in prayer.",
      },
      {
        ref: "Hebrews 10:23",
        BSB: "Let us hold resolutely to the hope we profess, for He who promised is faithful.",
      },
    ],
  },
  {
    id: "peaceful",
    name: "Peaceful",
    band: "light",
    reflections: [
      "Peace isn't the absence of storm — it's a settled mind staying fixed on God in the middle of one. Guard it; it's a gift, not a mood.",
      "Peace isn't something you manufacture — it's something He gives, the kind the world can't hand out or take back. Fix your mind on Him and it stands guard over your heart like a sentry.",
      "The mind stayed on God is kept in peace — attention is the lever. You can't still the storm, but you can choose what you fix on inside it. Trade the scroll for the quiet.",
    ],
    verses: [
      {
        ref: "Isaiah 26:3",
        BSB: "You will keep in perfect peace the steadfast of mind, because he trusts in You.",
      },
      {
        ref: "John 14:27",
        BSB: "Peace I leave with you; My peace I give to you. I do not give to you as the world gives. Do not let your hearts be troubled; do not be afraid.",
      },
      {
        ref: "Philippians 4:7",
        BSB: "And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
      },
      {
        ref: "Colossians 3:15",
        BSB: "Let the peace of Christ rule in your hearts, for to this you were called as members of one body. And be thankful.",
      },
      {
        ref: "Psalm 4:8",
        BSB: "I will lie down and sleep in peace, for You alone, O LORD, make me dwell in safety.",
      },
      {
        ref: "John 16:33",
        BSB: "I have told you these things so that in Me you may have peace. In the world you will have tribulation. But take courage; I have overcome the world!",
      },
      {
        ref: "Romans 5:1",
        BSB: "Therefore, since we have been justified through faith, we have peace with God through our Lord Jesus Christ.",
      },
      {
        ref: "Numbers 6:24-26",
        BSB: "May the LORD bless you and keep you; may the LORD cause His face to shine upon you and be gracious to you; may the LORD lift up His countenance toward you and give you peace.",
      },
      {
        ref: "Psalm 29:11",
        BSB: "The LORD gives His people strength; the LORD blesses His people with peace.",
      },
      {
        ref: "Isaiah 32:17",
        BSB: "The work of righteousness will be peace; the service of righteousness will be quiet confidence forever.",
      },
      {
        ref: "Romans 8:6",
        BSB: "The mind of the flesh is death, but the mind of the Spirit is life and peace.",
      },
      {
        ref: "Psalm 119:165",
        BSB: "Abundant peace belongs to those who love Your law; nothing can make them stumble.",
      },
      {
        ref: "Isaiah 54:10",
        BSB: "Though the mountains may be removed and the hills may be shaken, My loving devotion will not depart from you, and My covenant of peace will not be broken, says the LORD, who has compassion on you.",
      },
      {
        ref: "2 Thessalonians 3:16",
        BSB: "Now may the Lord of peace Himself give you peace at all times and in every way. The Lord be with all of you.",
      },
      {
        ref: "Matthew 5:9",
        BSB: "Blessed are the peacemakers, for they will be called sons of God.",
      },
    ],
  },
  {
    id: "content",
    name: "Content",
    band: "light",
    reflections: [
      "Contentment is learned, not found. Paul learned it in plenty and in need, and his peace wasn't tied to either. Count what's already in your hands before you tally what's missing.",
      "Better a handful with quietness than two hands full of striving. Enough is a real place, and you can live there. Godliness with contentment is the gain that lasts.",
      "Contentment isn't settling; it's trusting that the Shepherd knows what you need. The lines have fallen in pleasant places. Rest in what He's given you today.",
    ],
    verses: [
      {
        ref: "Philippians 4:11-12",
        BSB: "I am not saying this out of need, for I have learned to be content regardless of my circumstances. I know how to live humbly, and I know how to abound. In any and every situation I have learned the secret of being filled and being hungry, of having plenty and having need.",
      },
      {
        ref: "Hebrews 13:5",
        BSB: "Keep your lives free from the love of money and be content with what you have, for God has said: ‘Never will I leave you, never will I forsake you.’",
      },
      {
        ref: "1 Timothy 6:6",
        BSB: "Of course, godliness with contentment is great gain.",
      },
      {
        ref: "1 Timothy 6:8",
        BSB: "But if we have food and clothing, we will be content with these.",
      },
      {
        ref: "Psalm 23:1",
        BSB: "The LORD is my shepherd; I shall not want.",
      },
      {
        ref: "Psalm 16:6",
        BSB: "The lines of my boundary have fallen in pleasant places; surely my inheritance is delightful.",
      },
      {
        ref: "Proverbs 15:16",
        BSB: "Better a little with the fear of the LORD than great treasure with turmoil.",
      },
      {
        ref: "Ecclesiastes 4:6",
        BSB: "Better one handful with tranquility than two handfuls with toil and pursuit of the wind.",
      },
      {
        ref: "Psalm 131:2",
        BSB: "Surely I have stilled and quieted my soul; like a weaned child with his mother, like a weaned child is my soul within me.",
      },
      {
        ref: "Psalm 90:14",
        BSB: "Satisfy us in the morning with Your loving devotion, that we may sing for joy and be glad all our days.",
      },
    ],
  },
  {
    id: "faith",
    name: "Faith-Filled",
    band: "light",
    reflections: [
      "Faith acts before it sees. It's not certainty about outcomes — it's conviction about who God is. Build it by hearing, then move on it.",
      "Faith the size of a seed moves mountains — it's never the size that works, it's the One it's attached to. Small faith in a great God beats great confidence in yourself.",
      "Faith gets proven in the dark, not the daylight. The test isn't punishment — it's what turns belief into muscle. Keep walking when you can't see the step; the ground holds.",
    ],
    verses: [
      {
        ref: "Hebrews 11:1",
        BSB: "Now faith is the assurance of what we hope for and the certainty of what we do not see.",
      },
      {
        ref: "2 Corinthians 5:7",
        BSB: "For we walk by faith, not by sight.",
      },
      {
        ref: "Proverbs 3:5-6",
        BSB: "Trust in the LORD with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He will make your paths straight.",
      },
      {
        ref: "Hebrews 11:6",
        BSB: "And without faith it is impossible to please God. For anyone who approaches Him must believe that He exists and that He rewards those who earnestly seek Him.",
      },
      {
        ref: "Romans 10:17",
        BSB: "Consequently, faith comes by hearing, and hearing by the word of Christ.",
      },
      {
        ref: "Matthew 17:20b",
        BSB: "If you have faith the size of a mustard seed, you can say to this mountain, ‘Move from here to there,’ and it will move. Nothing will be impossible for you.",
      },
      {
        ref: "Mark 11:24",
        BSB: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.",
      },
      {
        ref: "Ephesians 2:8-9",
        BSB: "For it is by grace you have been saved through faith, and this not from yourselves; it is the gift of God, not by works, so that no one can boast.",
      },
      {
        ref: "James 1:6",
        BSB: "But he must ask in faith, without doubting, because he who doubts is like a wave of the sea, blown and tossed by the wind.",
      },
      {
        ref: "1 John 5:4",
        BSB: "Everyone born of God overcomes the world. And this is the victory that has overcome the world: our faith.",
      },
      {
        ref: "Galatians 2:20b",
        BSB: "The life I live in the body, I live by faith in the Son of God, who loved me and gave Himself up for me.",
      },
      {
        ref: "Habakkuk 2:4",
        BSB: "Look at the proud one; his soul is not upright—but the righteous will live by faith.",
      },
      {
        ref: "Matthew 21:22",
        BSB: "If you believe, you will receive whatever you ask for in prayer.",
      },
      {
        ref: "Luke 1:37",
        BSB: "For no word from God will ever fail.",
      },
      {
        ref: "2 Corinthians 4:18",
        BSB: "So we fix our eyes not on what is seen, but on what is unseen. For what is seen is temporary, but what is unseen is eternal.",
      },
    ],
  },
  {
    id: "forgiving",
    name: "Forgiving",
    band: "light",
    reflections: [
      "Forgiveness isn't excusing the wrong — it's releasing your right to collect the debt, because you've been released too. Free them; free yourself.",
      "Forgiveness is a decision, not a feeling, and it can come long before the other person earns it — they may never. It isn't the same as trust; you can cancel the debt and still rebuild slowly.",
      "Bitterness drinks poison and waits for the other person to feel it. You forgive from a full cup — you were pardoned a debt you could never repay. Pass on what you've been given.",
    ],
    verses: [
      {
        ref: "Ephesians 4:32",
        BSB: "Be kind and tenderhearted to one another, forgiving each other just as in Christ God forgave you.",
      },
      {
        ref: "Colossians 3:13",
        BSB: "Bear with one another and forgive any complaint you may have against someone else. Forgive as the Lord forgave you.",
      },
      {
        ref: "Matthew 6:14-15",
        BSB: "For if you forgive men their trespasses, your heavenly Father will also forgive you. But if you do not forgive men their trespasses, neither will your Father forgive yours.",
      },
      {
        ref: "Mark 11:25",
        BSB: "And when you stand to pray, if you hold anything against another, forgive it, so that your Father in heaven will forgive your trespasses as well.",
      },
      {
        ref: "Luke 6:37",
        BSB: "Do not judge, and you will not be judged. Do not condemn, and you will not be condemned. Forgive, and you will be forgiven.",
      },
      {
        ref: "Matthew 18:21b-22",
        BSB: "Lord, how many times shall I forgive my brother who sins against me? Up to seven times? Jesus answered, ‘I tell you, not just seven times, but seventy-seven times!’",
      },
      {
        ref: "1 John 1:9",
        BSB: "If we confess our sins, He is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.",
      },
      {
        ref: "Psalm 103:12",
        BSB: "As far as the east is from the west, so far has He removed our transgressions from us.",
      },
      {
        ref: "Colossians 1:14",
        BSB: "In whom we have redemption, the forgiveness of sins.",
      },
      {
        ref: "Micah 7:18-19",
        BSB: "Who is a God like You, who pardons iniquity and passes over the transgression of the remnant of His inheritance—who does not retain His anger forever, because He delights in loving devotion? He will again have compassion on us; He will vanquish our iniquities. You will cast out all our sins into the depths of the sea.",
      },
      {
        ref: "Proverbs 10:12",
        BSB: "Hatred stirs up dissension, but love covers all transgressions.",
      },
      {
        ref: "Romans 12:21",
        BSB: "Do not be overcome by evil, but overcome evil with good.",
      },
      {
        ref: "Luke 23:34a",
        BSB: "Then Jesus said, ‘Father, forgive them, for they do not know what they are doing.’",
      },
      {
        ref: "Acts 10:43",
        BSB: "All the prophets testify about Him that everyone who believes in Him receives forgiveness of sins through His name.",
      },
      {
        ref: "Psalm 86:5",
        BSB: "For You, O Lord, are kind and forgiving, rich in loving devotion to all who call on You.",
      },
    ],
  },
  {
    id: "loved",
    name: "Loved",
    band: "light",
    reflections: [
      "You didn't earn God's love, and you can't lose it on a bad day. He loved you while you were still a sinner, before you cleaned anything up. Let that settle before you do anything else.",
      "His love isn't a mood; it's everlasting. He has drawn you with lovingkindness and engraved you on the palms of His hands. You're not forgotten. You're held.",
      "We love because He first loved us. Receive it before you try to give it away. Today, act from being loved, not for it.",
    ],
    verses: [
      {
        ref: "John 3:16",
        BSB: "For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life.",
      },
      {
        ref: "Jeremiah 31:3",
        BSB: "The LORD appeared to us in the past, saying: I have loved you with an everlasting love; therefore I have drawn you with loving devotion.",
      },
      {
        ref: "Romans 5:8",
        BSB: "But God proves His love for us in this: While we were still sinners, Christ died for us.",
      },
      {
        ref: "1 John 4:19",
        BSB: "We love because He first loved us.",
      },
      {
        ref: "1 John 4:10",
        BSB: "And love consists in this: not that we loved God, but that He loved us and sent His Son as the atoning sacrifice for our sins.",
      },
      {
        ref: "Psalm 103:13",
        BSB: "As a father has compassion on his children, so the LORD has compassion on those who fear Him.",
      },
      {
        ref: "John 15:9",
        BSB: "As the Father has loved Me, so have I loved you. Remain in My love.",
      },
      {
        ref: "Isaiah 49:16",
        BSB: "Behold, I have inscribed you on the palms of My hands; your walls are ever before Me.",
      },
      {
        ref: "Psalm 63:3",
        BSB: "Because Your loving devotion is better than life, my lips will glorify You.",
      },
      {
        ref: "1 John 4:16",
        BSB: "And we have come to know and believe the love that God has for us. God is love; whoever abides in love abides in God, and God in him.",
      },
    ],
  },
  // ==========================================================
  // ADDED 2026-11-14 — Hurt, Rejected, Stressed, Confused, Bold
  // ==========================================================
  {
    id: "hurt",
    name: "Hurt",
    band: "heavy",
    reflections: [
      "Jesus knows what it is to be wounded by people He loved. You don't have to pretend it didn't hurt. Bring Him the wound by name; He binds it up before He asks anything of you.",
      "Hurt wants to replay the moment until it becomes who you are. Let God keep the record instead. He saw all of it, and He is better at justice than you will ever need to be.",
      "What they meant for harm doesn't get the last word. God has a long history of taking what was done to His people and weaving it into something that saves. Let Him heal you first.",
    ],
    verses: [
      {
        ref: "Psalm 147:3",
        BSB: "He heals the brokenhearted and binds up their wounds.",
      },
      {
        ref: "Psalm 34:18",
        BSB: "The LORD is near to the brokenhearted; He saves the contrite in spirit.",
      },
      {
        ref: "Psalm 56:8",
        BSB: "You have taken account of my wanderings. Put my tears in Your bottle—are they not in Your book?",
      },
      {
        ref: "Psalm 31:7",
        BSB: "I will be glad and rejoice in Your loving devotion, for You have seen my affliction; You have known the anguish of my soul.",
      },
      {
        ref: "Hebrews 4:15",
        BSB: "For we do not have a high priest who is unable to sympathize with our weaknesses, but we have one who was tempted in every way that we are, yet was without sin.",
      },
      {
        ref: "1 Peter 2:23",
        BSB: "When they heaped abuse on Him, He did not retaliate; when He suffered, He made no threats, but entrusted Himself to Him who judges justly.",
      },
      {
        ref: "Romans 12:19",
        BSB: "Do not avenge yourselves, beloved, but leave room for God’s wrath. For it is written: ‘Vengeance is Mine; I will repay, says the Lord.’",
      },
      {
        ref: "Genesis 50:20",
        BSB: "As for you, what you intended against me for evil, God intended for good, in order to accomplish a day like this—to preserve the lives of many people.",
      },
      {
        ref: "2 Corinthians 1:3-4a",
        BSB: "Blessed be the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles.",
      },
      {
        ref: "Colossians 3:13",
        BSB: "Bear with one another and forgive any complaint you may have against someone else. Forgive as the Lord forgave you.",
      },
      {
        ref: "Revelation 21:4",
        BSB: "‘He will wipe away every tear from their eyes,’ and there will be no more death or mourning or crying or pain, for the former things have passed away.",
      },
    ],
  },
  {
    id: "rejected",
    name: "Rejected",
    band: "heavy",
    reflections: [
      "Their no is not God's no. The One whose opinion actually decides your worth has already chosen you, and He has never once turned away anyone who came to Him.",
      "Jesus was rejected by the very people He came to save. He isn't surprised by your rejection and He isn't distant from it. He stood in that place so you would never stand there alone.",
      "Rejection tells you to shrink and hide. Scripture says you are chosen, called by name, and engraved on His hands. Let the true voice be the loudest one.",
    ],
    verses: [
      {
        ref: "Isaiah 53:3a",
        BSB: "He was despised and rejected by men, a man of sorrows, acquainted with grief.",
      },
      {
        ref: "Psalm 27:10",
        BSB: "Though my father and mother forsake me, the LORD will receive me.",
      },
      {
        ref: "John 6:37",
        BSB: "Everyone the Father gives Me will come to Me, and the one who comes to Me I will never drive away.",
      },
      {
        ref: "Psalm 118:22",
        BSB: "The stone the builders rejected has become the cornerstone.",
      },
      {
        ref: "Isaiah 41:9",
        BSB: "I brought you from the ends of the earth and called you from its farthest corners. I said, ‘You are My servant.’ I have chosen and not rejected you.",
      },
      {
        ref: "Isaiah 49:15-16",
        BSB: "Can a woman forget her nursing child, or lack compassion for the son of her womb? Even if she could forget, I will not forget you! Behold, I have inscribed you on the palms of My hands; your walls are ever before Me.",
      },
      {
        ref: "John 15:16",
        BSB: "You did not choose Me, but I chose you. And I appointed you to go and bear fruit—fruit that will remain—so that whatever you ask the Father in My name, He will give you.",
      },
      {
        ref: "Psalm 94:14",
        BSB: "For the LORD will not forsake His people; He will never abandon His heritage.",
      },
      {
        ref: "John 15:18",
        BSB: "If the world hates you, understand that it hated Me first.",
      },
      {
        ref: "Deuteronomy 31:8",
        BSB: "The LORD Himself goes before you; He will be with you. He will never leave you nor forsake you. Do not be afraid or discouraged.",
      },
      {
        ref: "1 Peter 2:9",
        BSB: "But you are a chosen people, a royal priesthood, a holy nation, a people for God’s own possession, to proclaim the virtues of Him who called you out of darkness into His marvelous light.",
      },
    ],
  },
  {
    id: "stressed",
    name: "Stressed",
    band: "heavy",
    reflections: [
      "Stress is often a sign you're carrying what was never yours to carry. Name the one thing that matters today, like Mary did, and hand the rest of the list back to God.",
      "Jesus told tired, busy people to come away and rest a while. Rest isn't falling behind. It's trusting that God keeps the world turning while you breathe.",
      "Pressure narrows your vision until the problem is all you can see. Be still for a moment. He is still God, and none of what's pressing on you is pressing on Him.",
    ],
    verses: [
      {
        ref: "Luke 10:41-42",
        BSB: "‘Martha, Martha,’ the Lord replied, ‘you are worried and upset about many things. But only one thing is necessary. Mary has chosen the good portion, and it will not be taken away from her.’",
      },
      {
        ref: "Psalm 127:2",
        BSB: "In vain you rise early and stay up late, toiling for bread to eat—for He gives sleep to His beloved.",
      },
      {
        ref: "Matthew 11:28-30",
        BSB: "Come to Me, all you who are weary and burdened, and I will give you rest. Take My yoke upon you and learn from Me, for I am gentle and humble in heart, and you will find rest for your souls. For My yoke is easy and My burden is light.",
      },
      {
        ref: "Mark 6:31",
        BSB: "And He said to them, ‘Come with Me privately to a solitary place, and let us rest for a while.’ For many people were coming and going, and they did not even have time to eat.",
      },
      {
        ref: "Ecclesiastes 4:6",
        BSB: "Better one handful with tranquility than two handfuls with toil and pursuit of the wind.",
      },
      {
        ref: "Psalm 118:5",
        BSB: "In my distress I called to the LORD, and He answered and set me free.",
      },
      {
        ref: "Psalm 46:10",
        BSB: "Be still and know that I am God; I will be exalted among the nations, I will be exalted over the earth.",
      },
      {
        ref: "Exodus 14:14",
        BSB: "The LORD will fight for you; you need only to be still.",
      },
      {
        ref: "2 Corinthians 4:8-9",
        BSB: "We are hard pressed on all sides, but not crushed; perplexed, but not in despair; persecuted, but not forsaken; struck down, but not destroyed.",
      },
      {
        ref: "Psalm 94:19",
        BSB: "When anxiety overwhelms me, Your consolation delights my soul.",
      },
      {
        ref: "Psalm 62:1-2",
        BSB: "In God alone my soul finds rest; my salvation comes from Him. He alone is my rock and my salvation. He is my fortress; I will never be shaken.",
      },
    ],
  },
  {
    id: "confused",
    name: "Confused",
    band: "friction",
    reflections: [
      "God isn't hiding the way from you. Ask Him for wisdom plainly. He gives it generously, and He never makes you feel foolish for asking.",
      "You don't need the whole map, just the next step. His Word is a lamp for your feet, not a floodlight on the next ten years. Take the step that's lit.",
      "Confusion isn't the opposite of faith. 'I believe; help my unbelief' is a prayer Jesus answered. Bring Him your questions honestly and let Him lead you through them.",
    ],
    verses: [
      {
        ref: "James 1:5",
        BSB: "Now if any of you lacks wisdom, he should ask God, who gives generously to all without finding fault, and it will be given to him.",
      },
      {
        ref: "Proverbs 3:5-6",
        BSB: "Trust in the LORD with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He will make your paths straight.",
      },
      {
        ref: "1 Corinthians 14:33a",
        BSB: "For God is not a God of disorder, but of peace.",
      },
      {
        ref: "Psalm 32:8",
        BSB: "I will instruct you and teach you the way you should go; I will give you counsel and watch over you.",
      },
      {
        ref: "Isaiah 30:21",
        BSB: "And whether you turn to the right or to the left, your ears will hear this command behind you: ‘This is the way. Walk in it.’",
      },
      {
        ref: "Psalm 119:105",
        BSB: "Your word is a lamp to my feet and a light to my path.",
      },
      {
        ref: "Proverbs 16:9",
        BSB: "A man’s heart plans his course, but the LORD determines his steps.",
      },
      {
        ref: "Isaiah 55:8-9",
        BSB: "For My thoughts are not your thoughts, neither are your ways My ways, declares the LORD. For as the heavens are higher than the earth, so My ways are higher than your ways and My thoughts than your thoughts.",
      },
      {
        ref: "Jeremiah 33:3",
        BSB: "Call to Me, and I will answer and show you great and unsearchable things you do not know.",
      },
      {
        ref: "John 16:13",
        BSB: "However, when the Spirit of truth comes, He will guide you into all truth. For He will not speak on His own, but He will speak what He hears, and He will declare to you what is to come.",
      },
      {
        ref: "Mark 9:24",
        BSB: "Immediately the boy’s father cried out, ‘I do believe; help my unbelief!’",
      },
    ],
  },
  {
    id: "bold",
    name: "Bold",
    band: "light",
    reflections: [
      "Boldness isn't the absence of fear. It's remembering who goes with you. The God who told Joshua to be strong and courageous goes with you everywhere you go today.",
      "The early church didn't pray for the danger to disappear. They prayed for boldness, and God filled them. Ask for the same, then open your mouth.",
      "You can stand with confidence before people because you've already been welcomed before the throne of grace. Grace made you bold. Walk into today like it's true.",
    ],
    verses: [
      {
        ref: "Joshua 1:9",
        BSB: "Have I not commanded you to be strong and courageous? Do not be afraid; do not be discouraged, for the LORD your God is with you wherever you go.",
      },
      {
        ref: "Proverbs 28:1",
        BSB: "The wicked flee when no one pursues, but the righteous are as bold as a lion.",
      },
      {
        ref: "2 Timothy 1:7",
        BSB: "For God has not given us a spirit of fear, but of power, love, and self-control.",
      },
      {
        ref: "Acts 4:31",
        BSB: "After they had prayed, their meeting place was shaken, and they were all filled with the Holy Spirit and spoke the word of God boldly.",
      },
      {
        ref: "Hebrews 4:16",
        BSB: "Let us then approach the throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need.",
      },
      {
        ref: "Ephesians 3:12",
        BSB: "In Him and through faith in Him we may enter God’s presence with boldness and confidence.",
      },
      {
        ref: "Psalm 138:3",
        BSB: "On the day I called, You answered me; You emboldened me and strengthened my soul.",
      },
      {
        ref: "Romans 1:16",
        BSB: "I am not ashamed of the gospel, because it is the power of God for salvation to everyone who believes, first to the Jew, then to the Greek.",
      },
      {
        ref: "Psalm 27:1",
        BSB: "The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—whom shall I dread?",
      },
      {
        ref: "1 Corinthians 16:13",
        BSB: "Be on the alert. Stand firm in the faith. Be men of courage. Be strong.",
      },
      {
        ref: "Philippians 1:20",
        BSB: "I eagerly expect and hope that I will in no way be ashamed, but will have complete boldness so that now as always Christ will be exalted in my body, whether by life or by death.",
      },
    ],
  },
];
