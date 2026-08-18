export type ConvictionPhase =
  | 'prediction'
  | 'rupture'
  | 'pressure'
  | 'recovery'
  | 'proof';

export type ConvictionChapter = {
  id: string;
  year: string;
  phase: ConvictionPhase;
  headline: string;
  statement: string;
  evidence: string;
  sourceLabel: string;
  sourceHref: string;
  scene: {
    energy: number;
    density: number;
    drift: number;
  };
};

export type ConvictionStory = {
  id: string;
  eyebrow: string;
  title: string;
  subject: string;
  deck: string;
  activeLine: string;
  contextLines: string[];
  chapters: ConvictionChapter[];
};

/**
 * Editorial proof seed.
 *
 * The three lyric excerpts below were supplied directly by the user in the
 * design conversation. The factual timeline is independently source-linked.
 * The component consuming this data is intentionally generic so future
 * stories can represent players, clubs, founders and community projects.
 */
export const areeceConvictionStory: ConvictionStory = {
  id: 'areece-paradise-to-now',
  eyebrow: 'Conviction / South African hip-hop',
  title: 'Paradise → Proof',
  subject: 'A-Reece',
  deck:
    'A prediction made before the bad hand. A career that kept moving after the hand changed.',
  activeLine:
    "I'm living in a future I predicted somewhere back in 2011",
  contextLines: [
    'Always quick to move cause I was told its now or never',
    'If the weather ever changes then my reign has elevated',
    "If you ain't even know it, now you know it",
  ],
  chapters: [
    {
      id: 'paradise-2016',
      year: '2016',
      phase: 'prediction',
      headline: 'The prediction becomes public',
      statement:
        'Paradise arrives while A-Reece is still a teenager and moves him from a rising Pretoria lyricist into national visibility.',
      evidence:
        'Paradise was released on 21 October 2016 through Ambitiouz Entertainment. Contemporary platform notes describe the record as his transition from bubbling under to superstardom.',
      sourceLabel: 'Apple Music — Paradise',
      sourceHref: 'https://music.apple.com/us/album/paradise/1578966373',
      scene: { energy: 0.72, density: 0.82, drift: 0.18 },
    },
    {
      id: 'independent-2017',
      year: '2017',
      phase: 'rupture',
      headline: 'The machine changes underneath him',
      statement:
        'Within roughly a year, the label chapter breaks. Independence is no longer branding; it becomes the operating condition.',
      evidence:
        'A-Reece left Ambitiouz Entertainment in 2017. Reporting on the period notes that Paradise was removed from major streaming surfaces for a time after the split, forcing the next chapter to stand without the original machine.',
      sourceLabel: 'OkayAfrica — Today’s Tragedy review',
      sourceHref:
        'https://www.okayafrica.com/a-reece-todays-tragedy-tomorrows-memory-review/',
      scene: { energy: 0.42, density: 0.36, drift: -0.22 },
    },
    {
      id: 'loss-2020',
      year: '2020',
      phase: 'pressure',
      headline: 'Life deals the bad hand',
      statement:
        'The pressure stops being industry mythology. His father dies; writing stalls; releasing music stops feeling automatic.',
      evidence:
        'A-Reece told Apple Music that his father’s death put him in a dark place, triggered writer’s block and discouraged him from releasing music during 2020.',
      sourceLabel: 'Apple Music — Today’s Tragedy, Tomorrow’s Memory',
      sourceHref:
        'https://music.apple.com/us/album/todays-tragedy-tomorrows-memory-the-mixtape/1548945683',
      scene: { energy: 0.18, density: 0.2, drift: -0.08 },
    },
    {
      id: 'memory-2021',
      year: '2021',
      phase: 'recovery',
      headline: 'Pain becomes material instead of an endpoint',
      statement:
        'The comeback is not framed as pretending the loss never happened. The project turns the loss into memory and movement.',
      evidence:
        'For Today’s Tragedy, Tomorrow’s Memory, A-Reece described the process as moving from grey clouds toward clear sky and said the lesson was to keep going regardless of what happened.',
      sourceLabel: 'Apple Music — 2021 mixtape notes',
      sourceHref:
        'https://music.apple.com/us/album/todays-tragedy-tomorrows-memory-the-mixtape/1548945683',
      scene: { energy: 0.58, density: 0.54, drift: 0.12 },
    },
    {
      id: 'p2-2023',
      year: '2023',
      phase: 'proof',
      headline: 'Paradise gets a sequel on his own terms',
      statement:
        'Seven years after the debut, P2 arrives through Revenge Club Records under license to ONErpm.',
      evidence:
        'P2: THE BIG HEARTED BAD GUY was released on 20 October 2023 with Revenge Club Records credited as the label under exclusive license to ONErpm.',
      sourceLabel: 'Apple Music — P2',
      sourceHref:
        'https://music.apple.com/us/album/p2-the-big-hearted-bad-guy/1778326058',
      scene: { energy: 0.78, density: 0.72, drift: 0.24 },
    },
    {
      id: 'ktk-2024',
      year: '2024',
      phase: 'proof',
      headline: 'The run keeps compounding',
      statement:
        'Kill The King extends the independent catalogue rather than treating P2 as the finish line.',
      evidence:
        'Kill The King: the mixtape was released in September 2024 and sits in the current official catalogue alongside the earlier independent projects.',
      sourceLabel: 'Apple Music — A-Reece catalogue',
      sourceHref: 'https://music.apple.com/za/artist/a-reece/914928001',
      scene: { energy: 0.86, density: 0.8, drift: 0.32 },
    },
    {
      id: 'business-2025',
      year: '2025',
      phase: 'proof',
      headline: 'Business becomes usual',
      statement:
        'The catalogue keeps moving after the sequel and mixtape cycles instead of becoming a nostalgia loop around Paradise.',
      evidence:
        'Business As Usual followed in 2025, extending the run into another release year.',
      sourceLabel: 'Apple Music — A-Reece catalogue',
      sourceHref: 'https://music.apple.com/us/artist/a-reece/914928001',
      scene: { energy: 0.9, density: 0.88, drift: 0.36 },
    },
    {
      id: 'bojack-2026',
      year: '2026',
      phase: 'proof',
      headline: 'The prediction is still producing output',
      statement:
        'A decade after Paradise, the catalogue is still receiving new work. The prediction did not require an easy decade to remain alive.',
      evidence:
        'Apple Music lists Bojack as a March 2026 release, keeping A-Reece active in the current release cycle.',
      sourceLabel: 'Apple Music — latest release',
      sourceHref: 'https://music.apple.com/za/artist/a-reece/914928001',
      scene: { energy: 1, density: 1, drift: 0.42 },
    },
  ],
};
