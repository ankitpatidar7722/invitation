/**
 * ─────────────────────────────────────────────────────────────
 *  CENTRAL WEDDING CONFIGURATION
 *  Every name, date, event, phone number, photo and music file
 *  shown on the site comes from this one file. Edit here only.
 *
 *  Text shown to guests is bilingual: { hi: "हिन्दी", en: "English" }.
 * ─────────────────────────────────────────────────────────────
 */

export type Lang = "hi" | "en";

/** A piece of guest-facing text in both languages. */
export type Txt = Record<Lang, string>;

export type Person = {
  name: Txt;
  grandfather: Txt;
  father: Txt;
};

export type ScheduleItem = {
  name: Txt;
  /** Only set when a time was actually supplied — never invent one. */
  time?: Txt;
};

export type EventDay = {
  /** ISO calendar date (YYYY-MM-DD) in the wedding timezone. */
  date: string;
  items: ScheduleItem[];
  /** Marks the main wedding day for special styling. */
  highlight?: boolean;
};

export type GalleryPhoto = {
  /**
   * Path under /public, e.g. "/photos/couple-1.jpg".
   * Leave undefined to show an elegant placeholder tile.
   */
  src?: string;
  alt: Txt;
  caption?: Txt;
};

export type WeddingConfig = {
  /** Language shown on first visit. Guests can switch with the हिं / EN button. */
  defaultLang: Lang;
  groom: Person;
  bride: Person;
  /** Short traditional invocation shown above the names. Set to "" to hide. */
  invocation: string;
  invitationLine: Txt;
  /** Start of the wedding day in IST — the countdown target. */
  weddingDateTime: string;
  weddingDate: string;
  timeZone: string;
  venue: {
    /** Short place name shown beside the date in the hero. */
    shortName: Txt;
    lines: Txt[];
    /** Text used for the Google Maps search link when no pin is set. */
    mapsQuery: string;
    /**
     * Exact location of the house / venue. When set, "Get Directions" starts
     * navigation to this point and the venue card shows a small map.
     * Copy it from Google Maps (long-press the spot → numbers like 23.81234, 76.12345).
     */
    pin: { lat: number; lng: number } | null;
  };
  contacts: string[];
  /** Country calling code used for tel: and WhatsApp links. */
  countryCode: string;
  whatsappMessage: Txt;
  events: EventDay[];
  gallery: GalleryPhoto[];
  music: {
    /** e.g. "/music/shehnai.mp3" — only a user-provided or licensed file. null = no music control. */
    src: string | null;
  };
  closing: {
    blessing: string;
    message: Txt;
    signOff: Txt;
    families: Txt;
  };
  site: {
    /** Browser tab / WhatsApp link-preview title and description (one string, both languages). */
    title: string;
    description: string;
    themeColor: string;
  };
};

export const wedding: WeddingConfig = {
  defaultLang: "hi",

  groom: {
    name: { hi: "अंकित", en: "Ankit" },
    grandfather: { hi: "पटेल तुलसीराम जी चौधरी", en: "Patel Tulsiram Ji Choudhary" },
    father: { hi: "गिरिराज जी चौधरी", en: "Giriraj Ji Choudhary" },
  },
  bride: {
    name: { hi: "यशस्वी", en: "Yashasvi" },
    grandfather: { hi: "पटेल कैलाश चंद्र जी कलसोडे", en: "Patel Kailash Chandra Ji Kalsode" },
    father: { hi: "महेश जी कलसोडे", en: "Mahesh Ji Kalsode" },
  },

  invocation: "॥ श्री गणेशाय नमः ॥",
  invitationLine: {
    hi: "ईश्वर की असीम कृपा एवं बड़ों के आशीर्वाद से, हम आपको सपरिवार इस शुभ विवाह में सादर आमंत्रित करते हैं",
    en: "With the blessings of the Almighty and our elders, we joyfully invite you and your family to celebrate the wedding of",
  },

  weddingDateTime: "2027-01-19T00:00:00+05:30",
  weddingDate: "2027-01-19",
  timeZone: "Asia/Kolkata",

  venue: {
    shortName: { hi: "गोठड़ा", en: "Gothada" },
    lines: [
      { hi: "ग्राम गोठड़ा, तहसील नलखेड़ा,", en: "Village Gothada, Tehsil Nalkheda," },
      { hi: "जिला आगर मालवा,", en: "District Agar Malwa," },
      { hi: "मध्य प्रदेश, भारत", en: "Madhya Pradesh, India" },
    ],
    mapsQuery:
      "Village Gothada, Tehsil Nalkheda, District Agar Malwa, Madhya Pradesh, India",
    // Groom's home, W7RR+33R Gothada (from Google Maps).
    pin: { lat: 23.940243, lng: 76.2901501 },
  },

  contacts: ["7722818772", "8103785807", "9977982765"],
  countryCode: "91",
  whatsappMessage: {
    hi: "नमस्ते! अंकित एवं यशस्वी (19 जनवरी 2027) का विवाह निमंत्रण मिल गया है।",
    en: "Namaste! We have received the wedding invitation of Ankit & Yashasvi (19 January 2027).",
  },

  events: [
    { date: "2027-01-14", items: [{ name: { hi: "माता पूजन", en: "Mata Pujan" } }] },
    {
      date: "2027-01-16",
      items: [{ name: { hi: "हल्दी", en: "Haldi" } }, { name: { hi: "मेहंदी", en: "Mehandi" } }],
    },
    {
      date: "2027-01-17",
      items: [
        { name: { hi: "मंडप छाया", en: "Mandap Chhaya" }, time: { hi: "सुबह", en: "Morning" } },
        { name: { hi: "गंगा चरी", en: "Ganga Chari" }, time: { hi: "दोपहर", en: "Afternoon" } },
        { name: { hi: "ढोली कलश", en: "Dholi Kalash" }, time: { hi: "शाम 5:00 बजे से", en: "5:00 PM onwards" } },
        { name: { hi: "निकासी", en: "Nikasi" }, time: { hi: "रात 8:00 बजे से", en: "8:00 PM onwards" } },
      ],
    },
    {
      date: "2027-01-18",
      items: [{ name: { hi: "मामेरा", en: "Mamera" } }, { name: { hi: "प्रीतिभोज", en: "Pritibhoj" } }],
    },
    { date: "2027-01-19", items: [{ name: { hi: "बारात", en: "Bharat (Baraat)" } }], highlight: true },
  ],

  // Replace placeholders by adding files to /public/photos and setting `src`.
  gallery: [
    { alt: { hi: "अंकित एवं यशस्वी", en: "Ankit and Yashasvi" }, caption: { hi: "हमारी कहानी", en: "Our Story" } },
    { alt: { hi: "अंकित एवं यशस्वी साथ में", en: "Ankit and Yashasvi together" }, caption: { hi: "साथ-साथ", en: "Together" } },
    { alt: { hi: "मुस्कुराते अंकित एवं यशस्वी", en: "Ankit and Yashasvi smiling" }, caption: { hi: "मुस्कान", en: "Smiles" } },
    { alt: { hi: "परिवार के साथ अंकित एवं यशस्वी", en: "Ankit and Yashasvi with family" }, caption: { hi: "परिवार", en: "Family" } },
    { alt: { hi: "प्री-वेडिंग", en: "Ankit and Yashasvi pre-wedding" }, caption: { hi: "प्री-वेडिंग", en: "Pre-Wedding" } },
    { alt: { hi: "उत्सव के पल", en: "Ankit and Yashasvi celebrations" }, caption: { hi: "उत्सव", en: "Celebrations" } },
  ],

  music: {
    src: null,
  },

  closing: {
    blessing: "शुभ विवाह",
    message: {
      hi: "आपकी उपस्थिति एवं आशीर्वाद से ही हमारा उत्सव पूर्ण होगा। आपके आगमन की प्रतीक्षा रहेगी।",
      en: "Your presence and blessings will make our celebration complete. We look forward to welcoming you.",
    },
    signOff: { hi: "स्नेहाकांक्षी", en: "With love & warm regards" },
    families: { hi: "चौधरी एवं कलसोडे परिवार", en: "The Choudhary & Kalsode Families" },
  },

  site: {
    title: "शुभ विवाह · अंकित & यशस्वी · Ankit & Yashasvi Wedding · 19 January 2027",
    description:
      "आप सपरिवार सादर आमंत्रित हैं — अंकित एवं यशस्वी का शुभ विवाह, 19 जनवरी 2027, ग्राम गोठड़ा, तहसील नलखेड़ा, जिला आगर मालवा (म.प्र.)। You are warmly invited to the wedding of Ankit & Yashasvi.",
    themeColor: "#F9E6E7",
  },
};
