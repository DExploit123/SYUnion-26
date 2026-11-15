/**
 * ==============================================================================
 * WEDDING WEBSITE CONFIGURATION - SAMUEL & YEMISI
 * ==============================================================================
 * All editable text, dates, venue details, photos, and RSVP destinations
 * are consolidated in this single configuration file for effortless updates.
 */

export interface LoveStoryMilestone {
  year: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface ScheduleEvent {
  id: string;
  name: string;
  time: string;
  venue: string;
  address: string;
  description: string;
  mapUrl: string;
  calendarTitle: string;
  calendarDetails: string;
  startTime: string; // ISO 8601 string for calendar
  endTime: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
  alt: string;
}

export interface GiftRegistryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  badge?: string;
}

export interface CashDonationMethod {
  id: string;
  name: string;
  type: 'bank' | 'app';
  currency: string;
  accountName: string;
  accountNumber?: string;
  bankName?: string;
  sortCode?: string;
  handleOrEmail?: string;
  notes?: string;
}

export const WEDDING_CONFIG = {
  // Couple Information
  couple: {
    groomFirst: "Samuel",
    groomFull: "Oluwasegun Samuel Onasanya",
    brideFirst: "Yemisi",
    brideFull: "Yemisi Akinlolu",
    combinedShort: "Samuel & Yemisi",
    hashtag: "#ForeverSamuelYemisi",
    secondaryHashtag: "#SY2026",
    quote: "From FUTA fellowship to a sacred lifetime covenant: bound by prayer, purposeful love, and faith.",
    bibleVerse: "“Two are better than one; because they have a good reward for their labour.” — Ecclesiastes 4:9",
  },

  // Wedding Date & Time (December 12, 2026)
  date: {
    targetIso: "2026-12-12T10:00:00",
    displayDate: "December 12, 2026",
    dayOfWeek: "Saturday",
    year: "2026",
  },

  // Theme & Color Palette (Featuring #C8A2C8 Lilac)
  palette: {
    lilacBackground: "#C8A2C8",
    lilacSoft: "#DFBFDF",
    lilacLight: "#EAD5EA",
    royalPurple: "#240B47",
    deepPurpleCard: "#1F0A3A",
    champagneGold: "#D4AF37",
    goldHighlight: "#F3E5AB",
    darkText: "#1F073A",
    bodyText: "#2E1065",
    offWhite: "#FBF9F5",
  },

  // Hero Section
  hero: {
    tagline: "Are getting married",
    names: "Samuel & Yemisi",
    dateText: "December 12, 2026",
    subtitle: "Together with their families, invite you to celebrate their holy matrimony",
    scrollHint: "Scroll to explore our journey",
  },

  // Our Love Story Timeline (Verified with Samuel's Marriage Conviction Letter & Yemisi's Adjustments)
  loveStory: [
    {
      year: "2020 – 2022",
      title: "Fellowship & Ajo Partnership at FUTA",
      description:
        "Samuel and Yemisi first met in 2020 at the Federal University of Technology, Akure (FUTA), when Yemisi was a 200-level student and Samuel was serving as the General Secretary of MFMCF FUTA. In 2022, when Samuel was in 400-level and Yemisi was in 300-level, she joined his campus Ajo (savings thrift) business so it could continue smoothly while he went away for Industrial Training (IT).",
      image: "/assets/aistudio/d46b0807-64c5-45a4-a393-01663fe77ca3_0492cf9d.png",
      imageAlt: "Samuel and Yemisi smiling together on campus during their university days at FUTA",
    },
    {
      year: "February 10, 2024",
      title: "A Song in the Night & Divine Conviction",
      description:
        "At midnight on February 10, 2024, Samuel woke with a song in his heart and an earnest burden to pray. After four hours of praying in tongues, God's still, small voice brought unmistakable peace and clarity that his trusted friend and partner in prayer was the woman God had chosen for his life.",
      image: "/assets/aistudio/Elegant_Couple_in_Traditional_Attire_e53ebaad.png",
      imageAlt: "Samuel and Yemisi in bespoke white tops and Ankara print studio portrait",
    },
    {
      year: "February 14, 2024",
      title: "A Prayerful Valentine's 'Yes'",
      description:
        "When Samuel shared his intentions, Yemisi took it to God in prayer. On Valentine's Day, February 14, 2024, she said 'Yes' and their relationship officially began. It was a step of faith affirmed and blessed by their spiritual mentor Bro. Niyi, their parents, and spiritual leaders in MFM.",
      image: "/assets/aistudio/RET-Untitled-1_da414ce8.jpg",
      imageAlt: "Samuel kissing Yemisi's hand in navy blue suit and blush pink rose gown",
    },
    {
      year: "December 12, 2026",
      title: "Two Lives, One Divine Purpose",
      description:
        "United by deep-rooted Christian faith, discipline, and sacrificial love, Samuel and Yemisi step into holy matrimony. A marriage founded on Genesis 2:24, ready to raise a godly home that honors Christ and becomes an enduring blessing to generations.",
      image: "/assets/aistudio/IMG-20261113-WA0006_5451450b.jpg",
      imageAlt: "Samuel and Yemisi in sky-blue traditional attire with royal blue fila and gele",
    },
  ] as LoveStoryMilestone[],

  // Wedding Details & Schedule (Engagement at 9am, Church Wedding at 12pm, Reception at Same Venue)
  schedule: [
    {
      id: "engagement-ceremony",
      name: "Traditional Engagement Ceremony",
      time: "9:00 AM – 11:30 AM",
      venue: "MFM SW 24, Regional Headquarters",
      address: "8, Baale Salisu street off Ago Igbala Bus stop, Ibafo, Ogun State",
      description:
        "The customary engagement, traditional introductions, and ancestral blessings uniting the Onasanya and Akinlolu families.",
      mapUrl: "https://maps.google.com/?q=8+Baale+Salisu+street+off+Ago+Igbala+Bus+stop+Ibafo+Ogun+State",
      calendarTitle: "Samuel & Yemisi Traditional Engagement",
      calendarDetails: "Traditional Engagement Ceremony at MFM SW 24, Regional Headquarters, Ibafo, Ogun State.",
      startTime: "2026-12-12T09:00:00",
      endTime: "2026-12-12T11:30:00",
    },
    {
      id: "church-wedding",
      name: "The Church Holy Matrimony",
      time: "12:00 PM – 2:00 PM",
      venue: "MFM SW 24, Regional Headquarters",
      address: "8, Baale Salisu street off Ago Igbala Bus stop, Ibafo, Ogun State",
      description:
        "The sacred exchange of vows, blessing of rings, and solemnization of holy matrimony before God and the church congregation.",
      mapUrl: "https://maps.google.com/?q=8+Baale+Salisu+street+off+Ago+Igbala+Bus+stop+Ibafo+Ogun+State",
      calendarTitle: "Samuel & Yemisi Church Wedding",
      calendarDetails: "Church Holy Matrimony at MFM SW 24, Regional Headquarters, Ibafo, Ogun State.",
      startTime: "2026-12-12T12:00:00",
      endTime: "2026-12-12T14:00:00",
    },
    {
      id: "wedding-reception",
      name: "Wedding Reception & Celebration",
      time: "2:00 PM – 6:00 PM (Immediately Following Service)",
      venue: "MFM SW 24, Regional Headquarters (Same Venue)",
      address: "8, Baale Salisu street off Ago Igbala Bus stop, Ibafo, Ogun State",
      description:
        "Joyful reception, wedding dinner, royal toasts, traditional cake cutting, and thanksgiving dancing right at the same venue grounds.",
      mapUrl: "https://maps.google.com/?q=8+Baale+Salisu+street+off+Ago+Igbala+Bus+stop+Ibafo+Ogun+State",
      calendarTitle: "Samuel & Yemisi Wedding Reception",
      calendarDetails: "Wedding Reception dinner & thanksgiving celebration at MFM SW 24, Regional Headquarters, Ibafo, Ogun State.",
      startTime: "2026-12-12T14:00:00",
      endTime: "2026-12-12T18:00:00",
    },
  ] as ScheduleEvent[],

  // Dress Code (Guest attire: White and Blue only; Lilac is reserved privately for the couple)
  dressCode: {
    theme: "Guest Attire",
    coloursText: "White & Blue",
    swatches: [
      { name: "White", hex: "#FFFFFF", textLight: false },
      { name: "Blue", hex: "#2563EB", textLight: true },
    ],
    note: "Guests are warmly invited to celebrate with us dressed in White and Blue. Traditional attire (Aso-Ebi, Agbada, Gele) or elegant formal wear.",
  },

  // Gift Registry & Cash Blessings (Palmpay Cash Account & Home Wishlist from Questionnaire)
  registry: {
    subtitle: "Your presence, prayers, and love are the greatest gifts. For friends and loved ones who have asked how to bless us materially, our verified Palmpay account and couple's home wishlist are provided below.",
    wishlistItems: [
      {
        id: "smart-tv",
        name: "Smart Television (TV)",
        category: "Living Room",
        description: "For our family living room and shared movie evenings.",
        icon: "tv",
      },
      {
        id: "sofa-chair",
        name: "Living Room Sofa Chair Set",
        category: "Home Comfort",
        description: "Cozy seating for welcoming family, fellowship, and guests.",
        icon: "sofa",
      },
      {
        id: "solar-fan",
        name: "Solar Fan System",
        category: "Home Utilities",
        description: "Reliable eco-friendly solar ventilation and cooling.",
        icon: "fan",
      },
      {
        id: "microwave",
        name: "Microwave Oven",
        category: "Kitchen",
        description: "For quick everyday meal prep, reheating, and warm family hospitality.",
        icon: "microwave",
      },
      {
        id: "washing-machine",
        name: "Washing Machine",
        category: "Home Care",
        description: "Effortless, time-saving laundry care for our new home.",
        icon: "washing-machine",
      },
    ],

    cashDonations: {
      title: "Cash Gifts & Bank Transfer",
      description: "Direct monetary gifts are gratefully received through the couple's verified Palmpay account.",
      methods: [
        {
          id: "palmpay-naira",
          name: "Palmpay Account (Naira Transfer)",
          type: "bank",
          currency: "NGN (₦)",
          accountName: "Oluwasegun Samuel Onasanya (7053257418)",
          accountNumber: "7053257418",
          bankName: "Palmpay",
          sortCode: "PalmPay Digital Bank",
          notes: "Account verified from wedding questionnaire. Reference: Samuel & Yemisi Wedding",
        },
      ] as CashDonationMethod[],
    },
  },

  // Gallery (Populating from the new photo uploads)
  gallery: {
    row1: [
      {
        src: "/assets/aistudio/d46b0807-64c5-45a4-a393-01663fe77ca3_0492cf9d.png",
        caption: "Where Our Story Began at FUTA",
        alt: "Samuel and Yemisi smiling together on campus during their university days at FUTA",
      },
      {
        src: "/assets/aistudio/Elegant_Couple_in_Traditional_Attire_e53ebaad.png",
        caption: "Two Hearts, Hand in Hand",
        alt: "Samuel and Yemisi in white tops and Ankara print sitting together",
      },
      {
        src: "/assets/aistudio/c3e48b19-e77a-4e63-8557-c313e5ae793e_f45b8ffd.png",
        caption: "Elegance, Devotion & Grace",
        alt: "Samuel in navy blue suit and Yemisi in blush pink rose gown holding hands",
      },
      {
        src: "/assets/aistudio/WhatsApp_Image_2026-11-13_at_19.55.30_c9fc3bed.jpeg",
        caption: "Anchored by the Holy Bible",
        alt: "Samuel and Yemisi smiling together holding the Holy Bible at the registry desk",
      },
    ] as GalleryImage[],
    row2: [
      {
        src: "/assets/aistudio/IMG-20261113-WA0006_5451450b.jpg",
        caption: "Eyes Fixed on Forever",
        alt: "Samuel and Yemisi in sky-blue traditional attire looking into each other's eyes",
      },
      {
        src: "/assets/aistudio/IMG-20261113-WA0013_65f15b70.jpg",
        caption: "Standing Together in Joy",
        alt: "Full-length studio embrace in white tops and Ankara cargo trousers",
      },
      {
        src: "/assets/aistudio/IMG-20261113-WA0007_bb37c7a0.jpg",
        caption: "Peace on Your Shoulder",
        alt: "Yemisi resting her head on Samuel's shoulder in sky-blue and royal-blue traditional attire",
      },
      {
        src: "/assets/aistudio/WhatsApp_Image_2026-11-13_at_19.55.30__1__bd0d0e4b.jpeg",
        caption: "Lifting My Bride in Pure Joy",
        alt: "Samuel lifting Yemisi in his arms outside the Federal Marriage Registry Ikoyi",
      },
    ] as GalleryImage[],
    row3: [
      {
        src: "/assets/aistudio/RET-Untitled-1_da414ce8.jpg",
        caption: "A Promise Sealed with Devotion",
        alt: "Samuel kissing Yemisi's hand in navy suit and blush pink gown",
      },
      {
        src: "/assets/aistudio/RET-Untitled-2_2eb2bb69.jpg",
        caption: "Close to My Heart",
        alt: "Close-up studio portrait in crisp white outfits with radiant smiles",
      },
      {
        src: "/assets/aistudio/RET_1_8261aa3a.jpg",
        caption: "Arm in Arm Forever",
        alt: "Samuel and Yemisi standing arm-in-arm smiling in navy suit and blush pink gown",
      },
      {
        src: "/assets/aistudio/WhatsApp_Image_2026-11-13_at_19.55.31_2b1b89c3.jpeg",
        caption: "Signing with the Word of God",
        alt: "Samuel and Yemisi signing their marriage registry certificate together",
      },
    ] as GalleryImage[],
  },

  // RSVP Settings & Destination
  rsvp: {
    deadline: "November 15, 2026",
    maxGuestsPerSubmission: 4,
    // Backend endpoint or webhook destination:
    // When deploying, you can set this to your Supabase table, Google Sheets webhook URL, or Firebase function.
    // By default, this applet sends to `/api/rsvp` (Express server) and stores locally for instantaneous testing.
    apiEndpoint: "/api/rsvp",
    googleSheetsWebhookPlaceholder: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
  },

  // Background Music
  music: {
    title: "Canon in D & Royal Chimes (Acoustic Ambient)",
    enabledByDefault: false,
    tooltip: "Toggle romantic background music",
  },

  // Footer & Credits
  footer: {
    note: "We cannot wait to celebrate this sacred milestone with our dearest loved ones.",
    copyrightYear: "2026",
  },
};
