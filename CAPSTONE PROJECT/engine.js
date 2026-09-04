/**
 * AI Campus Assistant - Core AI Engine
 * -------------------------------------
 * Module 1: Natural Language Understanding (NLU), Entity Extraction (NER), Intent Classification
 * Module 2: Dialogue Management, Multi-Turn Context Tracking, Slot Filling, Dynamic Response Generation
 */

(function (global) {
  'use strict';

  // =========================================================================
  // KNOWLEDGE BASE (Campus Domain Database)
  // =========================================================================
  const CAMPUS_KB = {
    departments: [
      { id: 'cse', name: 'Computer Science and Engineering', code: 'CSE', hod: 'Dr. Sarah Jenkins', office: 'Tech Block 3, Room 302', email: 'hod.cse@campus.edu', phone: '+1 (555) 234-5601', programs: ['B.Tech CSE', 'M.Tech AI & Data Science', 'Ph.D. Computer Science'] },
      { id: 'ai', name: 'Artificial Intelligence & Machine Learning', code: 'AIML', hod: 'Dr. Robert Vance', office: 'Tech Block 4, Room 410', email: 'hod.ai@campus.edu', phone: '+1 (555) 234-5602', programs: ['B.Tech AI & ML', 'M.Tech Robotics'] },
      { id: 'ece', name: 'Electronics and Communication Engineering', code: 'ECE', hod: 'Dr. Anita Roy', office: 'Tech Block 2, Room 204', email: 'hod.ece@campus.edu', phone: '+1 (555) 234-5603', programs: ['B.Tech ECE', 'M.Tech VLSI Design'] },
      { id: 'me', name: 'Mechanical Engineering', code: 'MECH', hod: 'Dr. Daniel Morales', office: 'Engineering Block 1, Room 105', email: 'hod.mech@campus.edu', phone: '+1 (555) 234-5604', programs: ['B.Tech Mechanical', 'M.Tech Thermal Eng.'] },
      { id: 'mba', name: 'Department of Management Studies', code: 'MBA', hod: 'Dr. Priya Nambiar', office: 'Management Block, Room 201', email: 'hod.mba@campus.edu', phone: '+1 (555) 234-5605', programs: ['MBA Finance', 'MBA Marketing', 'MBA Business Analytics'] }
    ],

    examSchedules: [
      {
        semester: 'Semester 4',
        type: 'End-Semester Theory Examinations (Regular & Arrear)',
        startDate: 'October 15, 2026',
        endDate: 'October 30, 2026',
        sessionTime: 'Forenoon: 09:30 AM - 12:30 PM | Afternoon: 01:30 PM - 04:30 PM',
        hallTicketRelease: 'October 05, 2026 via Student Portal',
        timetables: [
          { date: '15-Oct-2026', course: 'B.Tech CSE / AIML', subject: 'CSA1709 - Artificial Intelligence', slot: 'FN (09:30 AM)' },
          { date: '18-Oct-2026', course: 'B.Tech CSE', subject: 'CS1402 - Database Management Systems', slot: 'FN (09:30 AM)' },
          { date: '21-Oct-2026', course: 'B.Tech CSE / ECE', subject: 'MA1401 - Discrete Mathematics', slot: 'FN (09:30 AM)' },
          { date: '25-Oct-2026', course: 'B.Tech AIML', subject: 'AI1403 - Deep Learning Architectures', slot: 'FN (09:30 AM)' },
          { date: '28-Oct-2026', course: 'All Branches', subject: 'HS1401 - Universal Human Values', slot: 'AN (01:30 PM)' }
        ]
      },
      {
        semester: 'Semester 6',
        type: 'End-Semester Examinations',
        startDate: 'November 02, 2026',
        endDate: 'November 16, 2026',
        sessionTime: '09:30 AM - 12:30 PM',
        hallTicketRelease: 'October 24, 2026 via Student Portal',
        timetables: [
          { date: '02-Nov-2026', course: 'B.Tech CSE', subject: 'CS1601 - Cloud Computing & DevOps', slot: 'FN' },
          { date: '05-Nov-2026', course: 'B.Tech CSE', subject: 'CS1604 - Cyber Security & Cryptography', slot: 'FN' },
          { date: '09-Nov-2026', course: 'B.Tech AIML', subject: 'AI1602 - Natural Language Processing', slot: 'FN' }
        ]
      },
      {
        semester: 'Semester 2',
        type: 'Continuous Assessment Test 2 (CAT-2)',
        startDate: 'September 22, 2026',
        endDate: 'September 28, 2026',
        sessionTime: '10:00 AM - 11:30 AM',
        hallTicketRelease: 'Not required (Bring Student ID card)'
      }
    ],

    hostels: {
      boys: [
        { name: 'APJ Abdul Kalam Hostel (Block A)', type: 'Boys (AC & Non-AC)', warden: 'Prof. S. Raman', phone: '+1 (555) 450-1001', rooms: 'Single, Double, 3-Sharing', mess: 'North & South Indian' },
        { name: 'Aryabhatta Hostel (Block B)', type: 'Boys (Non-AC)', warden: 'Dr. K. George', phone: '+1 (555) 450-1002', rooms: 'Double, 4-Sharing', mess: 'Multi-Cuisine Buffet' }
      ],
      girls: [
        { name: 'Kalpana Chawla Hostel (Block C)', type: 'Girls (AC & Non-AC)', warden: 'Dr. Meenakshi S.', phone: '+1 (555) 450-2001', rooms: 'Single, Double, 3-Sharing', mess: 'North & South Indian' },
        { name: 'Gargi Hostel (Block D)', type: 'Girls (Non-AC)', warden: 'Mrs. L. Anthony', phone: '+1 (555) 450-2002', rooms: 'Double, 3-Sharing', mess: 'Hygienic Catered Mess' }
      ],
      fees: {
        acDouble: '$2,200 / semester (including mess)',
        nonAcDouble: '$1,500 / semester (including mess)',
        nonAcTriple: '$1,200 / semester (including mess)',
        cautionDeposit: '$200 (Refundable)'
      },
      curfew: 'In-time: 08:30 PM (Weekdays), 09:30 PM (Weekends). Late pass must be requested on Student Portal 24h in advance.',
      messTimings: 'Breakfast: 07:30 AM - 09:15 AM | Lunch: 12:15 PM - 02:00 PM | Snacks: 04:45 PM - 05:45 PM | Dinner: 07:30 PM - 09:15 PM'
    },

    fees: {
      btechTuition: '$4,800 per semester ($9,600 / academic year)',
      mtechTuition: '$3,600 per semester ($7,200 / academic year)',
      mbaTuition: '$5,200 per semester ($10,400 / academic year)',
      examFee: '$45 per subject / theory paper | $60 per practical lab',
      paymentDueDates: 'Fall Semester: September 10, 2026 | Spring Semester: February 10, 2027',
      paymentPortal: 'https://campus.edu/fees/pay-online',
      scholarships: [
        { name: 'Merit Academic Excellence Award', criteria: 'CGPA >= 9.0 (50% tuition waiver)', applyBy: 'September 15, 2026' },
        { name: 'Sports & Cultural Scholarship', criteria: 'State/National representation (Up to 75% fee waiver)', applyBy: 'August 31, 2026' },
        { name: 'Need-Based Financial Assistance', criteria: 'Annual household income < $15,000', applyBy: 'September 30, 2026' }
      ]
    },

    library: {
      name: 'Central Knowledge & Digital Library',
      location: 'Opposite Admin Block, 4 Floors',
      timings: 'Monday - Friday: 08:00 AM to 11:00 PM | Weekends & Holidays: 09:00 AM to 06:00 PM',
      duringExams: 'Open 24/7 during Mid-term & Final Exam weeks',
      services: 'Borrowing up to 6 books per UG student for 21 days; IEEE, Springer, ACM Digital Portal access; 40 Quiet Study Cubicles; Discussion Rooms; RFID Self-Checkout.',
      digitalLibraryURL: 'https://elibrary.campus.edu',
      librarianContact: 'library.help@campus.edu | +1 (555) 789-0120'
    },

    placements: {
      statsYear: '2025-2026',
      highestPackage: '$64,000 / annum (International Offer) | $42,000 (Domestic)',
      averagePackage: '$12,800 / annum',
      placementRate: '94.2% across engineering & computing programs',
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Deloitte', 'Accenture', 'TCS Research', 'Infosys', 'Qualcomm', 'Cisco', 'Texas Instruments'],
      trainingCell: 'Career Development Centre (CDC), Admin Block Floor 2',
      internshipPolicy: 'Mandatory 8-week summer internship for 3rd-year students with academic credits.'
    },

    events: [
      { name: 'INNOVENT 2026 - Annual National Hackathon', date: 'September 26 - 27, 2026', venue: 'Campus Auditorium & CS Labs', prizePool: '$10,000', registerUrl: 'https://campus.edu/hackathon2026' },
      { name: 'AURA 2026 - Inter-College Cultural Fest', date: 'October 22 - 24, 2026', venue: 'Open Air Amphitheatre', highlights: 'Battle of the Bands, Fashion Show, DJ Night, Drama' },
      { name: 'AI & Robotics Expo 2026', date: 'November 12, 2026', venue: 'Convention Centre', guests: 'Industry leaders from OpenAI, Google DeepMind & NVIDIA' },
      { name: 'Annual Sports Meet - Olympic Pride', date: 'December 04 - 06, 2026', venue: 'Main Sports Complex' }
    ],

    transport: {
      buses: '60+ air-conditioned campus buses covering 18 city routes.',
      morningArrival: 'All buses arrive at campus between 08:20 AM - 08:35 AM.',
      eveningDeparture: 'Batch 1: 04:45 PM (Standard) | Batch 2: 06:30 PM (Special lab / club bus).',
      passBooking: 'https://campus.edu/transport/bus-pass (Annual fee: $650).',
      officerContact: 'transport@campus.edu | Phone: +1 (555) 345-8900'
    },

    itSupport: {
      wifiSSID: 'Campus-Secure-5G or Campus-Student-IoT',
      loginPortal: 'portal.wifi.campus.edu (Use Student ID & campus email password)',
      quota: '150 GB high-speed bandwidth / month per registered student',
      helpdesk: 'IT Operations Center, Ground Floor, Library Building',
      email: 'ithelpdesk@campus.edu',
      ticketUrl: 'https://helpdesk.campus.edu'
    }
  };

  // =========================================================================
  // MODULE 1: NLP PREPROCESSING, TOKENIZER, LEMMATIZER & FUZZY MATCHER
  // =========================================================================

  const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as',
    'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cant', 'cannot',
    'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
    'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
    'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
    'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
    'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
    'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
    'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
    'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
    'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
    'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
    'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d',
    'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'please', 'tell', 'want', 'know', 'give'
  ]);

  const LEMMA_MAP = {
    'exams': 'exam',
    'examinations': 'exam',
    'examination': 'exam',
    'papers': 'paper',
    'tests': 'exam',
    'testing': 'exam',
    'timetables': 'timetable',
    'schedules': 'schedule',
    'scheduled': 'schedule',
    'dates': 'date',
    'results': 'result',
    'scores': 'result',
    'grades': 'result',
    'marks': 'result',
    'fees': 'fee',
    'costs': 'fee',
    'payments': 'payment',
    'paid': 'pay',
    'paying': 'pay',
    'scholarships': 'scholarship',
    'hostels': 'hostel',
    'dorm': 'hostel',
    'dorms': 'hostel',
    'dormitory': 'hostel',
    'rooms': 'room',
    'libraries': 'library',
    'books': 'book',
    'courses': 'course',
    'subjects': 'subject',
    'syllabi': 'syllabus',
    'syllabuses': 'syllabus',
    'professors': 'faculty',
    'teachers': 'faculty',
    'lecturers': 'faculty',
    'faculties': 'faculty',
    'instructors': 'faculty',
    'buses': 'bus',
    'transports': 'transport',
    'events': 'event',
    'fests': 'fest',
    'festivals': 'fest',
    'hackathons': 'hackathon',
    'placements': 'placement',
    'jobs': 'placement',
    'internships': 'internship',
    'hires': 'placement',
    'wifis': 'wifi',
    'internets': 'internet',
    'humans': 'human',
    'agents': 'agent',
    'supports': 'support',
    'helps': 'help',
    'departments': 'department',
    'semesters': 'semester',
    'sems': 'semester'
  };

  /**
   * Levenshtein Distance for typo tolerance
   */
  function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j + 1]      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  const DOMAIN_VOCABULARY = [
    'exam', 'examination', 'timetable', 'schedule', 'result', 'grade', 'hallticket',
    'course', 'syllabus', 'department', 'curriculum', 'credits', 'faculty', 'professor',
    'hod', 'hostel', 'mess', 'curfew', 'room', 'warden', 'fee', 'tuition', 'scholarship',
    'library', 'books', 'timing', 'digital', 'placement', 'salary', 'recruiter', 'internship',
    'event', 'hackathon', 'fest', 'aura', 'innovent', 'bus', 'transport', 'route',
    'wifi', 'network', 'password', 'login', 'human', 'agent', 'support', 'grievance',
    'canteen', 'sports', 'admission', 'semester', 'grade', 'cgpa', 'attendance'
  ];

  /**
   * Correct minor typographical errors using domain lexicon
   */
  function correctTypo(word) {
    if (word.length <= 3) return word;
    let closest = word;
    let minDistance = 2; // threshold max edits

    for (const vocab of DOMAIN_VOCABULARY) {
      const dist = levenshteinDistance(word, vocab);
      if (dist < minDistance) {
        minDistance = dist;
        closest = vocab;
      }
    }
    return closest;
  }

  /**
   * NLP Pipeline: Normalization, Tokenization, Stop-word removal, Lemmatization, Spelling correction
   */
  function preprocessText(text) {
    if (!text || typeof text !== 'string') return { original: '', rawTokens: [], cleanTokens: [], lemmas: [], textNormalized: '' };

    const original = text.trim();
    // Clean punctuation, lower case
    const cleaned = original.toLowerCase().replace(/[^\w\s\-\.@]/g, ' ');
    const rawTokens = cleaned.split(/\s+/).filter(Boolean);

    const cleanTokens = [];
    const lemmas = [];

    for (const raw of rawTokens) {
      const corrected = correctTypo(raw);
      cleanTokens.push(corrected);
      if (!STOP_WORDS.has(corrected)) {
        const lemma = LEMMA_MAP[corrected] || corrected;
        lemmas.push(lemma);
      }
    }

    return {
      original,
      rawTokens,
      cleanTokens,
      lemmas,
      textNormalized: lemmas.join(' ')
    };
  }

  // =========================================================================
  // MODULE 1: NAMED ENTITY RECOGNITION (NER)
  // =========================================================================

  const ENTITY_PATTERNS = {
    course: [
      /\b(b\.?tech|m\.?tech|b\.?sc|m\.?sc|bba|mba|bca|mca|ph\.?d)\b/i,
      /\b(computer science|artificial intelligence|machine learning|data science|robotics|mechanical|electrical|electronics|civil|cyber security)\b/i,
      /\b(csa1709|cs1402|ma1401|ai1403|hs1401|cs1601|ai1602)\b/i
    ],
    department: [
      /\b(cse|aiml|ai & ml|ai|ece|mech|mechanical|management|mba|civil|it|biotech)\b/i,
      /\b(computer science and engineering|artificial intelligence & machine learning|electronics and communication)\b/i
    ],
    semester: [
      /\b(sem|semester)\s*([1-8]|one|two|three|four|five|six|seven|eight|1st|2nd|3rd|4th|5th|6th|7th|8th)\b/i,
      /\b([1-8](st|nd|rd|th))\s*(sem|semester)?\b/i
    ],
    exam_type: [
      /\b(cat-?1|cat-?2|cat-?3|mid-?term|midterm|end-?sem|endsem|final|finals|arrear|regular|supplementary|practical|lab)\b/i
    ],
    facility: [
      /\b(library|hostel|mess|canteen|cafeteria|gym|sports complex|auditorium|amphitheatre|wifi|bus|transport|parking|lab|clinic|hospital)\b/i
    ],
    date_time: [
      /\b(today|tomorrow|yesterday|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
      /\b(morning|afternoon|evening|night|fn|an)\b/i,
      /\b(\d{1,2}(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(\s+\d{4})?)\b/i
    ],
    hostel_block: [
      /\b(block\s*[a-d]|apj kalam|aryabhatta|kalpana chawla|gargi)\b/i
    ],
    person_role: [
      /\b(hod|head of department|warden|director|dean|professor|faculty|teacher|librarian|mentor|counselor)\b/i
    ]
  };

  /**
   * Extract Named Entities from query
   */
  function extractEntities(text) {
    const entities = [];
    const foundKeys = new Set();

    for (const [entityType, patterns] of Object.entries(ENTITY_PATTERNS)) {
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          const value = match[0].trim();
          const key = `${entityType}:${value.toLowerCase()}`;
          if (!foundKeys.has(key)) {
            foundKeys.add(key);
            entities.push({
              type: entityType,
              value: value,
              normalized: normalizeEntityValue(entityType, value),
              start: match.index,
              end: match.index + value.length
            });
          }
        }
      }
    }

    return entities;
  }

  function normalizeEntityValue(type, val) {
    const lower = val.toLowerCase();
    if (type === 'semester') {
      const digit = lower.match(/[1-8]/);
      if (digit) return `Semester ${digit[0]}`;
      if (lower.includes('one') || lower.includes('1st')) return 'Semester 1';
      if (lower.includes('two') || lower.includes('2nd')) return 'Semester 2';
      if (lower.includes('three') || lower.includes('3rd')) return 'Semester 3';
      if (lower.includes('four') || lower.includes('4th')) return 'Semester 4';
      if (lower.includes('five') || lower.includes('5th')) return 'Semester 5';
      if (lower.includes('six') || lower.includes('6th')) return 'Semester 6';
      if (lower.includes('seven') || lower.includes('7th')) return 'Semester 7';
      if (lower.includes('eight') || lower.includes('8th')) return 'Semester 8';
    }
    if (type === 'department') {
      if (lower.includes('cse') || lower.includes('computer')) return 'CSE';
      if (lower.includes('ai') || lower.includes('machine learning')) return 'AIML';
      if (lower.includes('ece') || lower.includes('electronics')) return 'ECE';
      if (lower.includes('mech')) return 'MECH';
      if (lower.includes('mba') || lower.includes('management')) return 'MBA';
    }
    return val;
  }

  // =========================================================================
  // MODULE 1: INTENT DATASET & CLASSIFIER (TF-IDF + COSINE SIMILARITY + PATTERNS)
  // =========================================================================

  const INTENT_DATASET = [
    {
      intent: 'greeting',
      description: 'User greets the bot',
      examples: [
        'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
        'hey there', 'howdy', 'greetings', 'sup', 'namaste', 'hola', 'start conversation'
      ],
      keywords: ['hello', 'hi', 'hey', 'morning', 'afternoon', 'evening', 'greetings']
    },
    {
      intent: 'goodbye',
      description: 'User leaves or ends the conversation',
      examples: [
        'bye', 'goodbye', 'see you later', 'have a good day', 'exit', 'quit',
        'thanks bye', 'catch you later', 'farewell', 'end chat'
      ],
      keywords: ['bye', 'goodbye', 'farewell', 'exit', 'quit', 'night']
    },
    {
      intent: 'bot_identity',
      description: 'Questions regarding the AI bot identity and capabilities',
      examples: [
        'who are you', 'what are you', 'what can you do', 'what is your name',
        'who made you', 'how can you help me', 'tell me about yourself', 'features', 'help me'
      ],
      keywords: ['who', 'what', 'identity', 'help', 'features', 'capabilities', 'creator']
    },
    {
      intent: 'exam_schedule',
      description: 'Queries regarding exam dates, timetables, hall tickets, and sessions',
      examples: [
        'when is the semester exam', 'exam timetable', 'show me the exam schedule',
        'when does sem 4 exam start', 'end semester dates', 'cat 2 timetable',
        'when is CSA1709 exam', 'exam hall ticket release date', 'final exam routine',
        'when are mid terms', 'examination timing', 'btech exam schedule'
      ],
      keywords: ['exam', 'timetable', 'schedule', 'date', 'hallticket', 'timing', 'test', 'cat', 'endsem', 'midterm']
    },
    {
      intent: 'exam_results',
      description: 'Inquiries about GPA, grade sheets, and published exam results',
      examples: [
        'where can i check my exam results', 'when will sem 3 results be announced',
        'how to download grade card', 'cgpa calculation', 'revaluation process',
        'how to apply for answer sheet photocopy', 'result portal link', 'semester marks'
      ],
      keywords: ['result', 'grade', 'marks', 'cgpa', 'gpa', 'score', 'revaluation', 'photocopy', 'marksheet']
    },
    {
      intent: 'course_info',
      description: 'Academic programs, syllabus, subjects, and eligibility details',
      examples: [
        'what courses are offered in cse', 'tell me about btech ai ml syllabus',
        'course curriculum for semester 4', 'how many credits for graduation',
        'prerequisites for deep learning course', 'elective courses available',
        'mtech data science syllabus', 'undergraduate degree options', 'course details'
      ],
      keywords: ['course', 'syllabus', 'curriculum', 'credit', 'degree', 'subject', 'elective', 'btech', 'mtech', 'program']
    },
    {
      intent: 'faculty_directory',
      description: 'Information about professors, HODs, office locations, and emails',
      examples: [
        'who is the hod of computer science', 'how to contact dr sarah jenkins',
        'faculty email address', 'who teaches artificial intelligence',
        'office room number of cse department head', 'meet my professor',
        'dr robert vance contact', 'faculty directory'
      ],
      keywords: ['faculty', 'professor', 'hod', 'teacher', 'contact', 'email', 'office', 'room', 'head', 'dr']
    },
    {
      intent: 'timetable',
      description: 'Daily class schedule, lecture hours, and weekly timetable',
      examples: [
        'what is my class timetable', 'class schedule for today', 'what time does college start',
        'lecture timings', 'when is the lunch break', 'daily class routine', 'friday timetable'
      ],
      keywords: ['timetable', 'class', 'lecture', 'timing', 'routine', 'schedule', 'period', 'break']
    },
    {
      intent: 'fees_scholarship',
      description: 'Tuition fees, payment portal, due dates, and scholarship criteria',
      examples: [
        'what is the tuition fee for btech', 'how to pay semester fees online',
        'last date for fee payment', 'are there any merit scholarships',
        'scholarship eligibility criteria', 'examination fee details',
        'fee structure for mba', 'sports scholarship discount'
      ],
      keywords: ['fee', 'tuition', 'pay', 'payment', 'scholarship', 'cost', 'due', 'online', 'financial', 'waiver']
    },
    {
      intent: 'hostel_mess',
      description: 'Hostel accommodation, room types, wardens, curfew, and mess food timings',
      examples: [
        'how to apply for hostel accommodation', 'what are the mess timings',
        'girls hostel warden contact', 'curfew time for boys hostel',
        'is ac room available in apj hostel', 'hostel room rent per semester',
        'mess menu for dinner', 'hostel rules and regulations', 'late pass procedure'
      ],
      keywords: ['hostel', 'mess', 'room', 'warden', 'curfew', 'food', 'dinner', 'breakfast', 'stay', 'dorm', 'bed']
    },
    {
      intent: 'library_facility',
      description: 'Library operating hours, book borrowing rules, e-resources, and study rooms',
      examples: [
        'what are library opening hours', 'is library open on sunday',
        'how many books can i borrow', 'how to access ieee digital library',
        'library timings during exams', 'renew borrowed book online',
        'central library quiet cubicles', 'where is the library located'
      ],
      keywords: ['library', 'book', 'borrow', 'timing', 'hours', 'digital', 'ieee', 'springer', 'cubicle', 'renew']
    },
    {
      intent: 'events_workshops',
      description: 'College fests, hackathons, guest lectures, and student club events',
      examples: [
        'upcoming campus events', 'when is the annual cultural fest aura',
        'how to register for innovent hackathon', 'robotics workshop dates',
        'sports meet registration', 'techfest 2026', 'guest lectures this month',
        'what events are happening this week'
      ],
      keywords: ['event', 'fest', 'hackathon', 'aura', 'innovent', 'workshop', 'cultural', 'sports', 'competition', 'register']
    },
    {
      intent: 'placement_internship',
      description: 'Campus placement statistics, highest packages, recruiters, and internships',
      examples: [
        'what was the highest package last year', 'which companies visit for placements',
        'placement statistics for cse', 'average package for btech',
        'how to apply for summer internships', 'career development centre location',
        'campus recruitment drives'
      ],
      keywords: ['placement', 'internship', 'package', 'salary', 'recruiter', 'job', 'company', 'highest', 'average', 'career']
    },
    {
      intent: 'bus_transport',
      description: 'College bus routes, pickup points, bus pass registration, and timing',
      examples: [
        'college bus timings', 'how to apply for campus bus pass',
        'what are the bus routes available', 'bus departure time in evening',
        'route 12 pickup locations', 'transport office contact'
      ],
      keywords: ['bus', 'transport', 'route', 'pickup', 'travel', 'pass', 'departure', 'arrival']
    },
    {
      intent: 'campus_wifi_it',
      description: 'Connecting to university Wi-Fi, bandwidth quota, IT helpdesk, password reset',
      examples: [
        'how to connect to campus wifi', 'wifi password for student portal',
        'wifi login page not opening', 'monthly internet quota',
        'contact it helpdesk', 'reset student portal password'
      ],
      keywords: ['wifi', 'internet', 'network', 'login', 'portal', 'ssid', 'bandwidth', 'it', 'helpdesk', 'password']
    },
    {
      intent: 'grievance_support',
      description: 'Submitting student grievances, anti-ragging cell, student welfare',
      examples: [
        'i want to report a problem', 'how to file a grievance',
        'anti ragging helpline number', 'student welfare committee',
        'complaint about hostel water', 'counseling center appointment'
      ],
      keywords: ['grievance', 'complaint', 'ragging', 'welfare', 'report', 'issue', 'counseling', 'problem']
    },
    {
      intent: 'human_escalation',
      description: 'Requesting to talk with a live human administrator or support staff',
      examples: [
        'i want to talk to a human', 'connect me to support agent',
        'speak to a real person', 'human assistance', 'talk to advisor',
        'escalate this query', 'representative', 'customer support'
      ],
      keywords: ['human', 'person', 'agent', 'representative', 'talk', 'connect', 'escalate', 'advisor', 'staff']
    },
    {
      intent: 'thanks',
      description: 'User expresses appreciation',
      examples: [
        'thank you', 'thanks a lot', 'appreciate it', 'awesome thanks',
        'that was very helpful', 'cool thanks', 'thx'
      ],
      keywords: ['thank', 'thanks', 'thx', 'helpful', 'appreciate', 'great']
    }
  ];

  /**
   * Build Vocabulary and TF-IDF vectors for dataset
   */
  const ALL_INTENTS_VOCAB = new Set();
  const PROCESSED_DATASET = [];

  INTENT_DATASET.forEach(item => {
    const docLemmas = [];
    item.examples.forEach(ex => {
      const p = preprocessText(ex);
      docLemmas.push(...p.lemmas);
    });
    // Add keywords
    item.keywords.forEach(kw => docLemmas.push(LEMMA_MAP[kw] || kw));

    docLemmas.forEach(w => ALL_INTENTS_VOCAB.add(w));

    PROCESSED_DATASET.push({
      intent: item.intent,
      description: item.description,
      lemmas: docLemmas,
      keywords: item.keywords
    });
  });

  const VOCAB_LIST = Array.from(ALL_INTENTS_VOCAB);

  function computeTfIdfVector(lemmas) {
    const tf = {};
    lemmas.forEach(w => { tf[w] = (tf[w] || 0) + 1; });
    const vector = VOCAB_LIST.map(vocabWord => {
      const count = tf[vocabWord] || 0;
      return count > 0 ? (1 + Math.log(count)) : 0;
    });
    return vector;
  }

  function cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecA[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Pre-calculate TF-IDF vectors for each intent
  PROCESSED_DATASET.forEach(item => {
    item.vector = computeTfIdfVector(item.lemmas);
  });

  /**
   * Classify Intent with confidence scoring and fallback detection
   */
  function classifyIntent(preprocessedQuery) {
    const queryLemmas = preprocessedQuery.lemmas;
    if (queryLemmas.length === 0 && preprocessedQuery.rawTokens.length === 0) {
      return {
        intent: 'fallback',
        confidence: 0,
        scores: [],
        reason: 'Empty query'
      };
    }

    const queryVec = computeTfIdfVector(queryLemmas);
    const scoredIntents = [];

    PROCESSED_DATASET.forEach(item => {
      let sim = cosineSimilarity(queryVec, item.vector);

      // Keyword boost
      let keywordHits = 0;
      item.keywords.forEach(kw => {
        const normKw = LEMMA_MAP[kw] || kw;
        if (queryLemmas.includes(normKw) || preprocessedQuery.cleanTokens.includes(kw)) {
          keywordHits++;
        }
      });

      if (keywordHits > 0) {
        sim = Math.min(1.0, sim * 0.7 + (keywordHits * 0.25));
      }

      scoredIntents.push({
        intent: item.intent,
        description: item.description,
        score: Math.round(sim * 100) / 100
      });
    });

    scoredIntents.sort((a, b) => b.score - a.score);

    const top = scoredIntents[0] || { intent: 'fallback', score: 0 };
    const CONFIDENCE_THRESHOLD = 0.30;

    let finalIntent = top.score >= CONFIDENCE_THRESHOLD ? top.intent : 'fallback';
    let confidence = top.score;

    // Special exact matches for short greetings/goodbyes/thanks
    const cleanStr = preprocessedQuery.cleanTokens.join(' ');
    if (/^(hi|hello|hey|greetings|morning)$/.test(cleanStr)) {
      finalIntent = 'greeting';
      confidence = 0.98;
    } else if (/^(bye|goodbye|cya|exit)$/.test(cleanStr)) {
      finalIntent = 'goodbye';
      confidence = 0.98;
    } else if (/^(thanks|thank you|thx)$/.test(cleanStr)) {
      finalIntent = 'thanks';
      confidence = 0.98;
    }

    return {
      intent: finalIntent,
      confidence: confidence,
      topScores: scoredIntents.slice(0, 4)
    };
  }

  // =========================================================================
  // MODULE 2: DIALOGUE MANAGEMENT, CONTEXT STATE MACHINE & RESPONSE GENERATION
  // =========================================================================

  class DialogueManager {
    constructor() {
      this.context = {
        lastIntent: null,
        activeCourse: null,
        activeDepartment: 'CSE',
        activeSemester: 'Semester 4',
        missingSlot: null,
        pendingAction: null,
        turnCount: 0,
        history: [],
        escalationTickets: []
      };
    }

    resetContext() {
      this.context.lastIntent = null;
      this.context.activeCourse = null;
      this.context.missingSlot = null;
      this.context.pendingAction = null;
      this.context.turnCount = 0;
      this.context.history = [];
    }

    /**
     * Process User Message through complete pipeline
     */
    process(userMessage) {
      const startTime = performance.now();
      this.context.turnCount++;

      // 1. Module 1: Preprocessing & NLU
      const preprocessed = preprocessText(userMessage);
      const entities = extractEntities(userMessage);
      const classification = classifyIntent(preprocessed);

      // Update contextual slots from entities
      entities.forEach(ent => {
        if (ent.type === 'department') this.context.activeDepartment = ent.normalized;
        if (ent.type === 'semester') this.context.activeSemester = ent.normalized;
        if (ent.type === 'course') this.context.activeCourse = ent.normalized;
      });

      // 2. Handle Pending Slots (Slot-filling flow)
      let responsePayload = null;

      if (this.context.missingSlot && classification.intent !== 'fallback' && classification.intent !== 'goodbye') {
        responsePayload = this.handleSlotResolution(userMessage, entities, preprocessed);
      }

      // 3. Dialogue State Machine & Response Generation
      if (!responsePayload) {
        responsePayload = this.generateResponse(classification.intent, entities, preprocessed, userMessage);
      }

      this.context.lastIntent = classification.intent;
      const latencyMs = Math.max(12, Math.round(performance.now() - startTime));

      // Append to turn history
      const turnRecord = {
        turn: this.context.turnCount,
        query: userMessage,
        intent: classification.intent,
        confidence: classification.confidence,
        entities: entities,
        latencyMs: latencyMs,
        timestamp: new Date().toLocaleTimeString()
      };
      this.context.history.push(turnRecord);

      return {
        userMessage,
        nlu: {
          preprocessed,
          entities,
          intent: classification.intent,
          confidence: classification.confidence,
          topScores: classification.topScores,
          latencyMs
        },
        dialogue: {
          state: {
            activeDepartment: this.context.activeDepartment,
            activeSemester: this.context.activeSemester,
            activeCourse: this.context.activeCourse,
            missingSlot: this.context.missingSlot,
            turnCount: this.context.turnCount
          },
          response: responsePayload.text,
          html: responsePayload.html,
          quickReplies: responsePayload.quickReplies || [],
          actionType: responsePayload.actionType || 'standard',
          cardData: responsePayload.cardData || null
        }
      };
    }

    /**
     * Slot Filling logic when an entity was missing in prior turn
     */
    handleSlotResolution(userMessage, entities, preprocessed) {
      if (this.context.missingSlot === 'semester') {
        const semEnt = entities.find(e => e.type === 'semester');
        if (semEnt) {
          this.context.activeSemester = semEnt.normalized;
          this.context.missingSlot = null;
          return this.buildExamScheduleResponse(this.context.activeSemester);
        }
      } else if (this.context.missingSlot === 'department') {
        const deptEnt = entities.find(e => e.type === 'department');
        if (deptEnt) {
          this.context.activeDepartment = deptEnt.normalized;
          this.context.missingSlot = null;
          return this.buildFacultyResponse(this.context.activeDepartment);
        }
      }
      return null;
    }

    /**
     * Main response generator mapping intent to rich dynamic widgets
     */
    generateResponse(intent, entities, preprocessed, rawQuery) {
      switch (intent) {
        case 'greeting':
          return {
            text: 'Hello! I am your AI Campus Assistant. How can I help you today?',
            html: `
              <div class="bot-msg-body">
                <p>≡ƒæï <strong>Welcome to the AI Campus Assistant!</strong></p>
                <p>I can provide instant real-time information regarding:</p>
                <div class="badge-grid">
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('When is the semester exam timetable?')">≡ƒôà Exam Timetables</span>
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('Tell me about CSE courses and syllabus')">≡ƒôÜ Courses & Syllabus</span>
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('What is the tuition fee for BTech?')">≡ƒÆ│ Tuition & Fees</span>
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('Hostel fee structure and mess timings')">≡ƒÅó Hostel & Mess</span>
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('Library timings and book borrowing')">≡ƒôû Library Access</span>
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('Campus placement package and recruiters')">≡ƒÆ╝ Placements</span>
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('College bus routes and timings')">≡ƒÜî Campus Bus Routes</span>
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('How to connect to campus wifi?')">≡ƒô╢ Wi-Fi Support</span>
                </div>
                <p style="margin-top: 10px; font-size: 0.9em; color: var(--muted);">Tap a quick reply or type any question below.</p>
              </div>
            `,
            quickReplies: [
              'Exam Timetable',
              'CSE Department Info',
              'Hostel & Mess Fees',
              'Placement Highlights',
              'Campus Events 2026'
            ]
          };

        case 'goodbye':
          return {
            text: 'Goodbye! Feel free to ask whenever you need campus information. Have a great day!',
            html: `<div class="bot-msg-body"><p>≡ƒæï <strong>Goodbye!</strong> Have a productive day on campus. Reach back anytime!</p></div>`,
            quickReplies: ['Start New Conversation', 'Check Campus Events']
          };

        case 'thanks':
          return {
            text: 'You are welcome! Let me know if there is anything else you need help with.',
            html: `<div class="bot-msg-body"><p>Γ£¿ <strong>Always happy to help!</strong> Is there any other campus information you need?</p></div>`,
            quickReplies: ['Exam Schedule', 'Library Timings', 'Placements']
          };

        case 'bot_identity':
          return {
            text: 'I am the AI Student Query Assistant for your university, built using Natural Language Understanding, Named Entity Recognition, and Dialogue Management.',
            html: `
              <div class="bot-msg-body">
                <div class="rich-card info-card">
                  <div class="card-header">
                    <span class="card-tag">Capstone Project CSA1709</span>
                    <h4>≡ƒñû AI Campus Assistant</h4>
                  </div>
                  <p>I am an intelligent conversational system built for <strong>Student Query Assistance & Campus Information</strong>.</p>
                  <ul class="clean-list">
                    <li><strong>Module 1:</strong> NLU, Fuzzy Tokenization & Intent Classification</li>
                    <li><strong>Module 2:</strong> Contextual Multi-Turn Dialogue & Slot Filling</li>
                    <li><strong>Module 3:</strong> Multi-Channel Integration & Real-Time Analytics</li>
                  </ul>
                </div>
              </div>
            `,
            quickReplies: ['Show Exam Timetable', 'Campus FAQ Explorer', 'Talk to Human Support']
          };

        case 'exam_schedule': {
          const semEnt = entities.find(e => e.type === 'semester');
          if (semEnt) {
            this.context.activeSemester = semEnt.normalized;
            return this.buildExamScheduleResponse(semEnt.normalized);
          } else {
            // Check if user just said "exam timetable" without specifying semester
            this.context.missingSlot = 'semester';
            return {
              text: 'Which semester examination schedule would you like to view?',
              html: `
                <div class="bot-msg-body">
                  <p>≡ƒôà <strong>Examination Schedule Inquirer</strong></p>
                  <p>Please select your semester to view the verified examination timetable:</p>
                </div>
              `,
              quickReplies: ['Semester 4 Exams', 'Semester 6 Exams', 'Semester 2 (CAT-2)', 'All Exam Schedules']
            };
          }
        }

        case 'exam_results':
          return {
            text: 'Semester examination results are published on the official University Student Portal under Academic Records.',
            html: `
              <div class="bot-msg-body">
                <div class="rich-card">
                  <div class="card-header">
                    <span class="card-tag tag-success">Active Portal</span>
                    <h4>≡ƒôè Semester Results & Grade Cards</h4>
                  </div>
                  <p>Results for the recent examinations are available online.</p>
                  <ul class="clean-list">
                    <li><strong>Online Portal:</strong> <a href="https://results.campus.edu" target="_blank" class="chat-link">results.campus.edu</a></li>
                    <li><strong>Credentials:</strong> Student Register Number & Date of Birth</li>
                    <li><strong>Revaluation Window:</strong> Open until <strong>August 30, 2026</strong> ($30/paper)</li>
                    <li><strong>Grade Sheet:</strong> Digital copy with QR verification can be downloaded instantly.</li>
                  </ul>
                  <div class="card-actions">
                    <button class="action-btn-sm" onclick="alert('Redirecting to University Results Portal (Demo Simulation)')">≡ƒîÉ Open Results Portal</button>
                  </div>
                </div>
              </div>
            `,
            quickReplies: ['Revaluation Fee Details', 'Exam Timetable', 'Academic Calendar']
          };

        case 'course_info': {
          const dept = CAMPUS_KB.departments.find(d => d.code === this.context.activeDepartment) || CAMPUS_KB.departments[0];
          return {
            text: `Information for ${dept.name} (${dept.code}): HOD is ${dept.hod}, offering programs: ${dept.programs.join(', ')}.`,
            html: `
              <div class="bot-msg-body">
                <div class="rich-card">
                  <div class="card-header">
                    <span class="card-tag tag-primary">${dept.code} Department</span>
                    <h4>≡ƒÄô ${dept.name}</h4>
                  </div>
                  <p><strong>Head of Department:</strong> ${dept.hod}</p>
                  <p><strong>Office Location:</strong> ${dept.office}</p>
                  <p><strong>Contact:</strong> ${dept.email} | ${dept.phone}</p>
                  <div style="margin-top: 10px;">
                    <strong>Academic Programs Offered:</strong>
                    <div class="badge-grid" style="margin-top: 6px;">
                      ${dept.programs.map(p => `<span class="pill-badge">${p}</span>`).join('')}
                    </div>
                  </div>
                  <div class="card-actions" style="margin-top: 12px;">
                    <button class="action-btn-sm" onclick="CampusApp.triggerQuery('What are the faculty members in ${dept.code}?')">≡ƒæ¿ΓÇì≡ƒÅ½ Faculty Directory</button>
                    <button class="action-btn-sm" onclick="CampusApp.triggerQuery('Tuition fees for ${dept.code}')">≡ƒÆ│ Fee Details</button>
                  </div>
                </div>
              </div>
            `,
            quickReplies: [
              'Computer Science Courses',
              'AI & ML Program Details',
              'Mechanical Department',
              'MBA Programs'
            ]
          };
        }

        case 'faculty_directory': {
          const dept = CAMPUS_KB.departments.find(d => d.code === this.context.activeDepartment) || CAMPUS_KB.departments[0];
          return this.buildFacultyResponse(dept.code);
        }

        case 'timetable':
          return {
            text: 'Campus academic lectures run Monday through Friday from 08:30 AM to 04:30 PM with an afternoon lunch break.',
            html: `
              <div class="bot-msg-body">
                <div class="rich-card">
                  <div class="card-header">
                    <span class="card-tag">Regular Hours</span>
                    <h4>ΓÅ░ Daily Academic Lecture Timetable</h4>
                  </div>
                  <table class="data-table">
                    <thead>
                      <tr><th>Period / Slot</th><th>Timing</th><th>Activity</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Period 1 - 2</td><td>08:30 AM - 10:15 AM</td><td>Theory Lectures</td></tr>
                      <tr><td>Tea Break</td><td>10:15 AM - 10:30 AM</td><td>Recess</td></tr>
                      <tr><td>Period 3 - 4</td><td>10:30 AM - 12:15 PM</td><td>Lab & Interactive Sessions</td></tr>
                      <tr><td>Lunch Break</td><td>12:15 PM - 01:15 PM</td><td>Dining & Cafeteria</td></tr>
                      <tr><td>Period 5 - 6</td><td>01:15 PM - 03:00 PM</td><td>Major Subject / Project</td></tr>
                      <tr><td>Period 7</td><td>03:15 PM - 04:30 PM</td><td>Tutorials & Library Hour</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            `,
            quickReplies: ['Exam Timetable', 'Library Hours', 'Campus Bus Departure']
          };

        case 'fees_scholarship':
          return {
            text: `B.Tech tuition is ${CAMPUS_KB.fees.btechTuition}. Multiple merit and need-based scholarships are active.`,
            html: `
              <div class="bot-msg-body">
                <div class="rich-card">
                  <div class="card-header">
                    <span class="card-tag tag-warning">Fall 2026 Schedule</span>
                    <h4>≡ƒÆ│ Tuition Fees & Scholarships</h4>
                  </div>
                  <ul class="clean-list">
                    <li><strong>B.Tech Programs:</strong> ${CAMPUS_KB.fees.btechTuition}</li>
                    <li><strong>M.Tech Programs:</strong> ${CAMPUS_KB.fees.mtechTuition}</li>
                    <li><strong>MBA Programs:</strong> ${CAMPUS_KB.fees.mbaTuition}</li>
                    <li><strong>Exam Fee:</strong> ${CAMPUS_KB.fees.examFee}</li>
                    <li><strong>Fall Payment Due:</strong> <strong>${CAMPUS_KB.fees.paymentDueDates}</strong></li>
                  </ul>
                  <div style="margin-top: 10px;">
                    <strong>Available Scholarships:</strong>
                    <div style="margin-top: 6px; font-size: 0.88em;">
                      ${CAMPUS_KB.fees.scholarships.map(s => `
                        <div class="sub-card">
                          <strong>≡ƒÅå ${s.name}</strong><br>
                          <span style="color: var(--muted);">${s.criteria} (Apply by ${s.applyBy})</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>
            `,
            quickReplies: ['Hostel Accommodation Fee', 'Scholarship Application', 'Payment Portal']
          };

        case 'hostel_mess':
          return {
            text: `Hostel facilities include AC & Non-AC rooms with mess. Curfew is ${CAMPUS_KB.hostels.curfew}`,
            html: `
              <div class="bot-msg-body">
                <div class="rich-card">
                  <div class="card-header">
                    <span class="card-tag tag-info">Campus Residence</span>
                    <h4>≡ƒÅó Hostel & Dining Services</h4>
                  </div>
                  <p><strong>Curfew:</strong> ${CAMPUS_KB.hostels.curfew}</p>
                  <p><strong>Mess Timings:</strong> ${CAMPUS_KB.hostels.messTimings}</p>
                  
                  <div style="margin-top: 10px;">
                    <strong>Fee Structure:</strong>
                    <ul class="clean-list">
                      <li><strong>Double AC Room:</strong> ${CAMPUS_KB.hostels.fees.acDouble}</li>
                      <li><strong>Double Non-AC Room:</strong> ${CAMPUS_KB.hostels.fees.nonAcDouble}</li>
                      <li><strong>Triple Sharing:</strong> ${CAMPUS_KB.hostels.fees.nonAcTriple}</li>
                    </ul>
                  </div>

                  <div style="margin-top: 10px;">
                    <strong>Warden Contacts:</strong>
                    <ul class="clean-list">
                      <li><strong>Boys Warden:</strong> Prof. S. Raman (+1 555-450-1001)</li>
                      <li><strong>Girls Warden:</strong> Dr. Meenakshi S. (+1 555-450-2001)</li>
                    </ul>
                  </div>
                </div>
              </div>
            `,
            quickReplies: ['Hostel Fee Details', 'Mess Timings', 'Campus Wi-Fi Setup']
          };

        case 'library_facility':
          return {
            text: `Central Library is open from 08:00 AM to 11:00 PM weekdays and 24/7 during exam weeks.`,
            html: `
              <div class="bot-msg-body">
                <div class="rich-card">
                  <div class="card-header">
                    <span class="card-tag tag-success">Open Today</span>
                    <h4>≡ƒôû Central Knowledge & Digital Library</h4>
                  </div>
                  <p><strong>Location:</strong> ${CAMPUS_KB.library.location}</p>
                  <p><strong>Regular Hours:</strong> ${CAMPUS_KB.library.timings}</p>
                  <p><strong>Exam Weeks:</strong> <span style="color: #10b981; font-weight: bold;">${CAMPUS_KB.library.duringExams}</span></p>
                  <p><strong>Facilities:</strong> ${CAMPUS_KB.library.services}</p>
                  <p><strong>Digital Access:</strong> <a href="${CAMPUS_KB.library.digitalLibraryURL}" target="_blank" class="chat-link">${CAMPUS_KB.library.digitalLibraryURL}</a></p>
                </div>
              </div>
            `,
            quickReplies: ['Digital Library Access', 'Borrowing Rules', 'Quiet Study Rooms']
          };

        case 'events_workshops':
          return {
            text: `Exciting upcoming campus events include INNOVENT Hackathon ($10,000 prize) and AURA Cultural Fest.`,
            html: `
              <div class="bot-msg-body">
                <div class="rich-card">
                  <div class="card-header">
                    <span class="card-tag tag-warning">Semester Highlights</span>
                    <h4>≡ƒÄë Upcoming Campus Events & Fests</h4>
                  </div>
                  ${CAMPUS_KB.events.map(ev => `
                    <div class="sub-card">
                      <strong>≡ƒÜÇ ${ev.name}</strong><br>
                      <span style="font-size:0.85em; color:var(--muted);">≡ƒôà ${ev.date} | ≡ƒôì ${ev.venue}</span>
                      ${ev.prizePool ? `<br><span class="pill-code" style="color:#059669; background:#d1fae5;">Prize Pool: ${ev.prizePool}</span>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            `,
            quickReplies: ['Register for Hackathon', 'AURA Fest Details', 'Sports Meet']
          };

        case 'placement_internship':
          return {
            text: `Campus Placements (2025-26): Highest package is ${CAMPUS_KB.placements.highestPackage}, average is ${CAMPUS_KB.placements.averagePackage} with 94.2% placement rate.`,
            html: `
              <div class="bot-msg-body">
                <div class="rich-card">
                  <div class="card-header">
                    <span class="card-tag tag-primary">CDC Report 2025-26</span>
                    <h4>≡ƒÆ╝ Placement & Career Records</h4>
                  </div>
                  <div class="stats-mini-grid">
                    <div class="mini-stat">
                      <span class="mini-val">$64K</span>
                      <span class="mini-lbl">Highest Package</span>
                    </div>
                    <div class="mini-stat">
                      <span class="mini-val">$12.8K</span>
                      <span class="mini-lbl">Average Package</span>
                    </div>
                    <div class="mini-stat">
                      <span class="mini-val">94.2%</span>
                      <span class="mini-lbl">Placed Rate</span>
                    </div>
                  </div>
                  <p style="margin-top: 10px;"><strong>Top Recruiters:</strong> ${CAMPUS_KB.placements.topRecruiters.join(', ')}</p>
                  <p><strong>Office:</strong> ${CAMPUS_KB.placements.trainingCell}</p>
                </div>
              </div>
            `,
            quickReplies: ['Placement Companies', 'Summer Internship Rules', 'Resume Building Sessions']
          };

        case 'bus_transport':
          return {
            text: `Campus runs 60+ AC buses across 18 city routes arriving by 08:30 AM and departing at 04:45 PM & 06:30 PM.`,
            html: `
              <div class="bot-msg-body">
                <div class="rich-card">
                  <div class="card-header">
                    <span class="card-tag">Transit System</span>
                    <h4>≡ƒÜî Campus Bus & Transportation</h4>
                  </div>
                  <p><strong>Fleet:</strong> ${CAMPUS_KB.transport.buses}</p>
                  <p><strong>Morning Arrival:</strong> ${CAMPUS_KB.transport.morningArrival}</p>
                  <p><strong>Evening Trips:</strong> ${CAMPUS_KB.transport.eveningDeparture}</p>
                  <p><strong>Annual Bus Pass:</strong> $650 / academic year</p>
                  <p><strong>Helpdesk:</strong> ${CAMPUS_KB.transport.officerContact}</p>
                </div>
              </div>
            `,
            quickReplies: ['Bus Route Details', 'Bus Pass Registration', 'Late Evening Bus']
          };

        case 'campus_wifi_it':
          return {
            text: `Connect to 'Campus-Secure-5G' using your Student ID and portal password for 150 GB monthly high-speed quota.`,
            html: `
              <div class="bot-msg-body">
                <div class="rich-card">
                  <div class="card-header">
                    <span class="card-tag tag-success">IT Operations</span>
                    <h4>≡ƒô╢ High-Speed Campus Wi-Fi & IT Support</h4>
                  </div>
                  <ul class="clean-list">
                    <li><strong>Network SSID:</strong> <code>${CAMPUS_KB.itSupport.wifiSSID}</code></li>
                    <li><strong>Login Page:</strong> <code>${CAMPUS_KB.itSupport.loginPortal}</code></li>
                    <li><strong>Monthly Quota:</strong> ${CAMPUS_KB.itSupport.quota}</li>
                    <li><strong>IT Helpdesk:</strong> ${CAMPUS_KB.itSupport.helpdesk} (${CAMPUS_KB.itSupport.email})</li>
                  </ul>
                </div>
              </div>
            `,
            quickReplies: ['Reset Wi-Fi Password', 'Bandwidth Quota', 'IT Helpdesk Ticket']
          };

        case 'grievance_support':
        case 'human_escalation': {
          const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
          const ticket = {
            id: ticketId,
            query: rawQuery,
            timestamp: new Date().toLocaleString(),
            status: 'Assigned to Student Helpdesk',
            priority: 'High'
          };
          this.context.escalationTickets.push(ticket);

          return {
            text: `I have raised ticket ${ticketId} for your inquiry. A human campus advisor will contact you within 24 hours.`,
            html: `
              <div class="bot-msg-body">
                <div class="rich-card warning-card">
                  <div class="card-header">
                    <span class="card-tag tag-danger">Escalation Generated</span>
                    <h4>≡ƒÄ½ Support Ticket Raised: ${ticketId}</h4>
                  </div>
                  <p>Your query has been escalated to the <strong>Student Welfare & Support Office</strong>.</p>
                  <ul class="clean-list">
                    <li><strong>Ticket ID:</strong> <code>${ticketId}</code></li>
                    <li><strong>Status:</strong> Assigned to Duty Officer</li>
                    <li><strong>Direct Helpline:</strong> +1 (555) 019-2830</li>
                    <li><strong>Email:</strong> support@campus.edu</li>
                  </ul>
                  <p style="font-size:0.85em; margin-top:8px; color:var(--muted);">You will also receive a confirmation on your registered student email.</p>
                </div>
              </div>
            `,
            quickReplies: ['View Raised Tickets', 'Return to Main Menu', 'Call Student Helpline']
          };
        }

        case 'fallback':
        default:
          return {
            text: 'I am not completely sure about that query. Could you try rephrasing or choose one of these popular campus topics?',
            html: `
              <div class="bot-msg-body">
                <p>≡ƒñö <strong>I didn't quite catch that.</strong></p>
                <p>Here are some common topics you can ask me about:</p>
                <div class="badge-grid" style="margin-top: 8px;">
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('When are the semester exams?')">≡ƒôà Exam Dates</span>
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('Hostel fee structure')">≡ƒÅó Hostel & Mess</span>
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('Tuition fee payment')">≡ƒÆ│ Fees & Scholarships</span>
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('Placement statistics')">≡ƒÆ╝ Placements</span>
                  <span class="pill-badge" onclick="CampusApp.triggerQuery('Connect me with human support')">≡ƒæ¿ΓÇì≡ƒÆ╝ Talk to Human</span>
                </div>
              </div>
            `,
            quickReplies: [
              'Semester Exam Timetable',
              'Course Syllabus & Credits',
              'Hostel & Mess Details',
              'Talk to Human Support'
            ]
          };
      }
    }

    buildExamScheduleResponse(semesterName) {
      const schedule = CAMPUS_KB.examSchedules.find(s => s.semester.toLowerCase() === semesterName.toLowerCase()) || CAMPUS_KB.examSchedules[0];

      let tableHtml = '';
      if (schedule.timetables && schedule.timetables.length > 0) {
        tableHtml = `
          <table class="data-table" style="margin-top: 10px;">
            <thead>
              <tr><th>Date</th><th>Course</th><th>Subject Code & Name</th><th>Slot</th></tr>
            </thead>
            <tbody>
              ${schedule.timetables.map(t => `
                <tr>
                  <td><strong>${t.date}</strong></td>
                  <td><span class="pill-code">${t.course}</span></td>
                  <td>${t.subject}</td>
                  <td>${t.slot}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }

      return {
        text: `${schedule.semester} (${schedule.type}) starts on ${schedule.startDate} and concludes on ${schedule.endDate}.`,
        html: `
          <div class="bot-msg-body">
            <div class="rich-card">
              <div class="card-header">
                <span class="card-tag tag-primary">${schedule.semester}</span>
                <h4>≡ƒôà ${schedule.type}</h4>
              </div>
              <p><strong>Examination Window:</strong> ${schedule.startDate} to ${schedule.endDate}</p>
              <p><strong>Session Timing:</strong> ${schedule.sessionTime}</p>
              <p><strong>Hall Ticket Release:</strong> ${schedule.hallTicketRelease}</p>
              ${tableHtml}
              <div class="card-actions" style="margin-top: 12px;">
                <button class="action-btn-sm" onclick="CampusApp.downloadSchedule('${schedule.semester}')">≡ƒôÑ Download PDF Timetable</button>
                <button class="action-btn-sm" onclick="CampusApp.triggerQuery('Exam rules and regulations')">≡ƒôï Exam Guidelines</button>
              </div>
            </div>
          </div>
        `,
        quickReplies: ['Semester 6 Exams', 'Semester 2 CAT-2', 'Revaluation Process', 'Grade Calculation']
      };
    }

    buildFacultyResponse(deptCode) {
      const dept = CAMPUS_KB.departments.find(d => d.code === deptCode) || CAMPUS_KB.departments[0];
      return {
        text: `Faculty contact for ${dept.name}: HOD is ${dept.hod}, located at ${dept.office}.`,
        html: `
          <div class="bot-msg-body">
            <div class="rich-card">
              <div class="card-header">
                <span class="card-tag">${dept.code} Faculty</span>
                <h4>≡ƒæ¿ΓÇì≡ƒÅ½ ${dept.name} - Directory</h4>
              </div>
              <div class="faculty-card-inner">
                <div class="avatar-ph">HOD</div>
                <div>
                  <strong>${dept.hod}</strong><br>
                  <span style="font-size:0.85em; color:var(--muted);">Professor & Head of Department</span><br>
                  <span style="font-size:0.85em;">≡ƒôì ${dept.office}</span><br>
                  <span style="font-size:0.85em;">Γ£ë∩╕Å <a href="mailto:${dept.email}">${dept.email}</a></span>
                </div>
              </div>
              <p style="margin-top: 10px; font-size: 0.9em;"><strong>Office Hours:</strong> Monday - Thursday: 02:30 PM - 04:30 PM (Prior appointment recommended).</p>
            </div>
          </div>
        `,
        quickReplies: ['CSE Faculty', 'AI & ML Faculty', 'ECE Faculty', 'Mechanical Faculty']
      };
    }
  }

  // Export to global scope
  global.CampusNLU = {
    preprocessText,
    extractEntities,
    classifyIntent,
    INTENT_DATASET,
    CAMPUS_KB
  };

  global.CampusDialogue = DialogueManager;

})(typeof window !== 'undefined' ? window : global);
