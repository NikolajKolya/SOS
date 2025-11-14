import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import './App.css'

type ChatMessage = {
  id: string
  sender: 'user' | 'ally'
  body: string
  timestamp: string
}

type LetterFormState = {
  topic: string
  setting: string
  details: string
  preferredContact: string
  allowFollowUp: boolean
}

const supportPillars = [
  {
    title: 'Povjerljivi chat uživo',
    description:
      'Spoji se sa obučenim saveznikom u realnom vremenu bez otkrivanja imena ili lokacije.',
    badge: 'dostupno sada',
    accent: '#86efac',
  },
  {
    title: 'Vođeno pisanje pisma',
    description:
      'Opiši šta se dogodilo, dodaj kontekst i usmjerićemo poruku pravom savjetniku.',
    badge: 'do 12h',
    accent: '#fcd34d',
  },
  {
    title: 'Planiranje oporavka',
    description:
      'Personalizovani koraci, savjeti za dokumentovanje i sigurna eskalacija kada ti je potrebno.',
    badge: 'korak po korak',
    accent: '#93c5fd',
  },
]

const heroStats = [
  {
    value: '4.200+',
    label: 'povjerljivih provjera',
    detail: 'podrška širom Crne Gore',
  },
  {
    value: '92%',
    label: 'se osjeća smirenije',
    detail: 'poslije sesije od 10 min',
  },
  {
    value: '24/7',
    label: 'odgovor ljudi',
    detail: 'obučeni saveznici u smjenama',
  },
]

const resourceGuides = [
  {
    icon: '💬',
    title: 'Alat za hrabri razgovor',
    description:
      'Mikro-koraci za razgovor sa odraslom osobom od povjerenja, školom ili HR timom.',
    tag: 'plan akcije',
    linkLabel: 'Preuzmi vodič',
  },
  {
    icon: '🛡️',
    title: 'Digitalni sigurnosni paket',
    description:
      'Snimci ekrana, prijavljivanje nasilja i čuvanje dokaza bez panike.',
    tag: 'online',
    linkLabel: 'Pregledaj listu',
  },
  {
    icon: '🤝',
    title: 'Saveznici u zajednici',
    description:
      'Provjerene NVO, psiholozi i omladinski centri spremni da saslušaju.',
    tag: 'partneri',
    linkLabel: 'Upoznaj mrežu',
  },
  {
    icon: '🌱',
    title: 'Vježbe za smirenje',
    description: 'Vježbe prizemljenja i disanja za povratak kontrole odmah.',
    tag: 'briga o sebi',
    linkLabel: 'Započni sesiju',
  },
]

const emergencyContacts = [
  {
    title: 'Nacionalni SOS telefon',
    number: '080 123 456',
    note: 'Državna linija za podršku u slučajevima nasilja i vršnjačkog zlostavljanja.',
    availability: '24/7',
    type: 'Poziv i SMS',
  },
  {
    title: 'Plava linija za djecu',
    number: '080 567 890',
    note: 'Posvećena djeci i mladima kojima je hitno potrebna smjernica.',
    availability: '08:00 – 22:00',
    type: 'Poziv',
  },
  {
    title: 'Centar za socijalni rad Podgorica',
    number: '+382 20 123 456',
    note: 'Za hitne intervencije ili koordinaciju sa službama.',
    availability: 'Radni dani',
    type: 'Poziv',
  },
]

const supportiveReplies = [
  'Hvala ti što si podijelio/la ovo. Brinem se za tvoj osjećaj sigurnosti i možemo zajedno da prođemo naredne korake.',
  'Nisi sam/a u ovome. Hajde da razložimo situaciju i jasno odredimo kako te možemo zaštititi već danas.',
  'Tvoje granice su važne. Možemo pripremiti poruku ili plan razgovora prije nego što se obratiš odrasloj osobi.',
  'Dišem sa tobom. Ako želiš, mogu ti poslati kratke vježbe umirivanja dok osmisliš sljedeći korak.',
  'Ovo što prolaziš nije tvoja krivica. Bilježenje detalja je hrabar potez i već si na polovini rješenja.',
]

const journeySteps = [
  {
    title: 'Ispričaj šta se desilo',
    detail: 'Piši slobodno; svaku rečenicu čitamo pažljivo i bez osude.',
    timeframe: '< 5 minuta',
  },
  {
    title: 'Dobijaš odgovor po mjeri',
    detail: 'Obučeni saveznik sažima šta je čuo i nudi 2-3 jasna koraka.',
    timeframe: 'u roku od 12 sati',
  },
  {
    title: 'Biraj naredne korake',
    detail:
      'Od dokumentovanja događaja do kontaktiranja institucija – samo kada ti odlučiš.',
    timeframe: 'tvoj ritam',
  },
  {
    title: 'Ostajemo povezani',
    detail:
      'Podsjetnici, provjere dobrobiti i resursi svaki put kada ti zatrebaju.',
    timeframe: 'koliko god želiš',
  },
]

const quickTips = [
  {
    icon: '🧠',
    title: 'Imenuj osjećaj',
    detail: 'Rečenice poput “Osjećam se nesigurno kada…” pomažu odraslima da reaguju brže.',
  },
  {
    icon: '📷',
    title: 'Sačuvaj dokaze bezbjedno',
    detail: 'Koristi skrivenu fasciklu ili cloud bilješku neutralnog naziva.',
  },
  {
    icon: '🫶',
    title: 'Pronađi savezničku osobu',
    detail: 'Dovoljan je jedan prijatelj, trener ili nastavnik da potvrdi tvoje iskustvo.',
  },
]

const gratitudeNotes = [
  {
    name: 'Anonimni srednjoškolac, Bar',
    quote:
      '“Chat je djelovao kao da pišem starijoj sestri. Pomogli su mi da uvježbam što da kažem direktoru.”',
  },
  {
    name: 'Mladi profesionalac, Nikšić',
    quote:
      '“Funkcija pošalji pismo mi je omogućila da smireno dokumentujem uznemiravanje. Osjećao/la sam se viđeno prije ikakvog sastanka.”',
  },
]

const letterTopics = [
  'Nasilje u školi',
  'Onlajn uznemiravanje',
  'Porodično nasilje',
  'Pritisak na poslu',
  'Nasilje u zajednici',
  'Nešto drugo',
]

const environments = ['škola', 'internet', 'dom', 'radno mjesto', 'javni prostor']

const createLetterState = (): LetterFormState => ({
  topic: '',
  setting: 'škola',
  details: '',
  preferredContact: 'email',
  allowFollowUp: true,
})

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

const formatTime = () =>
  new Intl.DateTimeFormat('sr-Latn-ME', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

function App() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      sender: 'ally',
      body: 'Hej, ja sam tvoj SOS saveznik. Slobodno napiši sve što te muči – pratimo s puno pažnje.',
      timestamp: formatTime(),
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [isAllyTyping, setIsAllyTyping] = useState(false)
  const [letterForm, setLetterForm] = useState<LetterFormState>(() =>
    createLetterState(),
  )
  const [letterStatus, setLetterStatus] = useState<'idle' | 'sending' | 'sent'>(
    'idle',
  )
  const [letterFeedback, setLetterFeedback] = useState<string | null>(null)
  const chatListRef = useRef<HTMLDivElement>(null)
  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null
  const isFullChatView = searchParams?.get('fullChat') === 'true'
  const [sessionCode] = useState(() => {
    const sanitized = createId().replace(/[^a-z0-9]/gi, '').toUpperCase()
    return sanitized.slice(-6)
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.title = isFullChatView
      ? 'SOS Chat – puni prozor'
      : 'SOS | Siguran prostor podrške'
  }, [isFullChatView])

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight
    }
  }, [chatMessages])

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const enqueueMessage = (message: ChatMessage) => {
    setChatMessages((prev) => [...prev, message])
  }

  const openChatWindow = () => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    url.searchParams.set('fullChat', 'true')
    window.open(
      url.toString(),
      'sos-chat-window',
      'width=960,height=720,resizable=yes,scrollbars=yes',
    )
  }

  const exitFullChatView = () => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    url.searchParams.delete('fullChat')
    window.location.href = url.toString()
  }

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextMessage = chatInput.trim()
    if (!nextMessage) return

    enqueueMessage({
      id: createId(),
      sender: 'user',
      body: nextMessage,
      timestamp: formatTime(),
    })
    setChatInput('')
    setIsAllyTyping(true)

    window.setTimeout(() => {
      const reply =
        supportiveReplies[Math.floor(Math.random() * supportiveReplies.length)]
      enqueueMessage({
        id: createId(),
        sender: 'ally',
        body: reply,
        timestamp: formatTime(),
      })
      setIsAllyTyping(false)
    }, 900)
  }

  const handleLetterChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target =
      event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    const { name, value } = target
    const isCheckbox =
      target instanceof HTMLInputElement && target.type === 'checkbox'
    const nextValue = isCheckbox ? target.checked : value
    setLetterForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }))
  }

  const handleLetterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!letterForm.topic || letterForm.details.trim().length < 30) {
      setLetterFeedback(
        'Molimo izaberi temu i napiši makar 30 karaktera kako bi tim razumio situaciju.',
      )
      return
    }

    setLetterFeedback(null)
    setLetterStatus('sending')

    window.setTimeout(() => {
      setLetterStatus('sent')
      setLetterFeedback(
        'Pismo je stiglo. Obučeni savjetnik iz Crne Gore odgovoriće u roku od 12 sati.',
      )
      setLetterForm(createLetterState())
    }, 900)
  }

  const chatPanelElement = (
    <article
      className={`chat-panel section-card ${
        isFullChatView ? 'chat-panel-full' : ''
      }`}
    >
      <div className="section-heading chat-heading">
        <div>
          <p className="eyebrow">Chat sa saveznikom</p>
          <h2>Napiši kako se osjećaš. Slušamo odmah.</h2>
          {!isFullChatView && (
            <p className="chat-popout-note">
              Za duže sesije i bolji fokus otvori chat u posebnom prozoru.
            </p>
          )}
        </div>
        <div className="chat-popout-controls">
          {isFullChatView ? (
            <>
              <span className="chat-status-badge">
                Anonimni kod: {sessionCode}
              </span>
              <button
                className="ghost-btn small"
                type="button"
                onClick={exitFullChatView}
              >
                ← Nazad na portal
              </button>
            </>
          ) : (
            <button
              className="ghost-btn small"
              type="button"
              onClick={openChatWindow}
            >
              Otvori u novom prozoru
            </button>
          )}
        </div>
      </div>
      <div className="chat-window" ref={chatListRef} aria-live="polite">
        {chatMessages.map((message) => (
          <div key={message.id} className={`chat-message ${message.sender}`}>
            <div className="message-meta">
              <span>{message.sender === 'ally' ? 'Saveznik' : 'Ti'}</span>
              <time>{message.timestamp}</time>
            </div>
            <p>{message.body}</p>
          </div>
        ))}
        {isAllyTyping && (
          <div className="typing-indicator">
            <span />
            <span />
            <span />
            <p>Saveznik piše</p>
          </div>
        )}
      </div>
      <form className="chat-form" onSubmit={handleChatSubmit}>
        <input
          type="text"
          name="chat"
          placeholder="Opiši šta se dogodilo ili kako se osjećaš..."
          value={chatInput}
          onChange={(event) => setChatInput(event.target.value)}
          aria-label="Poruka u chatu"
        />
        <button type="submit">Pošalji</button>
      </form>
      {isFullChatView && (
        <p className="chat-safety-hint">
          Sesija je anonimna i prati vrijeme svake poruke. Zatvori prozor kada
          završiš ili klikni „Nazad na portal”.
        </p>
      )}
    </article>
  )

  if (isFullChatView) {
    return (
      <div className="full-chat-shell">
        <header className="full-chat-header section-card">
          <div className="brand-mark">
            <span className="brand-icon">SOS</span>
            <div>
              <p className="brand-title">Siguran prostor podrške</p>
            </div>
          </div>
          <div className="full-chat-header-actions">
            <span className="chat-status-badge">Anonimni kod: {sessionCode}</span>
            <button
              className="outline-btn"
              type="button"
              onClick={exitFullChatView}
            >
              ← Nazad na portal
            </button>
          </div>
        </header>
        {chatPanelElement}
        <section className="section-card full-chat-reminders">
          <h3>Podsjetnici za siguran razgovor</h3>
          <ul>
            <li>Prozor je odvojen kako bi ostali na uređaju vidjeli samo glavnu stranicu.</li>
            <li>Sve poruke imaju satnicu i možeš ih kopirati za svoju evidenciju.</li>
            <li>Po završetku zatvori prozor ili klikni „Nazad na portal”.</li>
          </ul>
          <p className="muted">
            Ako ti je potreban hitan broj, vrati se na glavni portal i otvori
            sekciju SOS brojevi.
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="hero section-card" id="hero">
        <nav className="primary-nav">
          <div className="brand-mark">
            <span className="brand-icon">SOS</span>
            <div>
              <p className="brand-title">Siguran prostor podrške</p>
            </div>
          </div>
          <div className="nav-actions">
            <button
              className="ghost-btn"
              type="button"
              onClick={() => scrollToSection('resources')}
            >
              Baza resursa
            </button>
            <button
              className="solid-btn"
              type="button"
              onClick={() => scrollToSection('chat-support')}
            >
              Pokreni anonimni chat
            </button>
          </div>
        </nav>

        {!isFullChatView && (
          <div className="chat-spotlight">
            <div>
              <p className="chat-spotlight-eyebrow">Trebaš da te neko čuje odmah?</p>
              <h2>Jedan klik do SOS chata uživo</h2>
              <p>
                Anonimno, bez prijave i spremno da se otvori u posebnom prozoru kako bi
                razgovor bio na prvom mjestu.
              </p>
            </div>
            <div className="chat-spotlight-actions">
              <button
                className="primary-chat-btn"
                type="button"
                onClick={openChatWindow}
              >
                Pokreni chat odmah
              </button>
              <button
                className="outline-btn small"
                type="button"
                onClick={() => scrollToSection('chat-support')}
              >
                Pogledaj chat na stranici
              </button>
            </div>
          </div>
        )}

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Saslušavamo svaki glas</p>
            <h1>Progovori, ostani bezbjedno i osjeti podršku na svakom koraku.</h1>
            <p className="lead">
              Naša mreža savezničkih volontera vodi mlade, roditelje i
              profesionalce kroz vršnjačko nasilje, uznemiravanje ili bilo koji
              oblik nasilja. Podijeli priču anonimno, dobij koučing i poveži se
              sa hitnim kontaktima kad god zatreba.
            </p>
            <div className="hero-cta">
              <button
                className="solid-btn"
                type="button"
                onClick={() => scrollToSection('chat-support')}
              >
                Otvori siguran chat
              </button>
              <button
                className="outline-btn"
                type="button"
                onClick={() => scrollToSection('letter')}
              >
                Pošalji detaljno pismo
              </button>
            </div>
            <div className="hero-stats">
              {heroStats.map((stat) => (
                <article key={stat.label}>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-detail">{stat.detail}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="safety-card">
              <p className="safety-title">Lista sigurnosti</p>
              <ul>
                <li>Anonimno po defaultu</li>
                <li>Transkripti spremni za dokaze</li>
                <li>Partneri za eskalaciju u pripravnosti</li>
              </ul>
              <p className="safety-note">
                Tvoje riječi čuvamo šifrovano, a odgovori dolaze od ljudi obučenih
                za traumatske situacije.
              </p>
            </div>
            <div className="gratitude-stack">
              {gratitudeNotes.map((note) => (
                <article key={note.name} className="gratitude-card">
                  <p>{note.quote}</p>
                  <span>{note.name}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section-card pillars" id="pillars">
          <div className="section-heading">
            <p className="eyebrow">Kako čuvamo prostor</p>
            <h2>Tri stuba podrške</h2>
            <p>
              Trenutno smirivanje, promišljeno planiranje i stalno praćenje – tu
              smo dok se ne osjetiš sigurno.
            </p>
          </div>
          <div className="pillars-grid">
            {supportPillars.map((pillar) => (
              <article key={pillar.title} className="pillar-card">
                <span className="pillar-badge" style={{ color: pillar.accent }}>
                  {pillar.badge}
                </span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="support-grid" id="chat-support">
          {chatPanelElement}
          <article className="letter-panel section-card" id="letter">
            <div className="section-heading">
              <p className="eyebrow">Pošalji detaljno pismo</p>
              <h2>Odgovaramo sa empatijom i konkretnim opcijama.</h2>
            </div>
            <form onSubmit={handleLetterSubmit} className="letter-form">
              <label>
                Tema problema
                <select
                  name="topic"
                  value={letterForm.topic}
                  onChange={handleLetterChange}
                  required
                >
                  <option value="">Odaberi jednu opciju</option>
                  {letterTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Gdje se ovo dešava?
                <select
                  name="setting"
                  value={letterForm.setting}
                  onChange={handleLetterChange}
                >
                  {environments.map((env) => (
                    <option key={env} value={env}>
                      {env}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Podijeli cijelu priču
                <textarea
                  name="details"
                  minLength={30}
                  rows={6}
                  placeholder="Ispričaj situaciju, ko je uključen i kako utiče na tebe..."
                  value={letterForm.details}
                  onChange={handleLetterChange}
                  required
                />
              </label>

              <label>
                Željeni način odgovora
                <select
                  name="preferredContact"
                  value={letterForm.preferredContact}
                  onChange={handleLetterChange}
                >
                  <option value="email">Email (anonimni prosljeđivač)</option>
                  <option value="sms">SMS provjera</option>
                  <option value="school">Povezivanje sa školskim savjetnikom</option>
                  <option value="phone">Telefonski poziv</option>
                </select>
              </label>

              <label className="checkbox-field">
                <input
                  type="checkbox"
                  name="allowFollowUp"
                  checked={letterForm.allowFollowUp}
                  onChange={handleLetterChange}
                />
                Slažem se da dobijam naknadne poruke o ovom slučaju.
              </label>

              <button
                type="submit"
                className="solid-btn full-width"
                disabled={letterStatus === 'sending'}
              >
                {letterStatus === 'sending' ? 'Šaljemo...' : 'Pošalji pismo'}
              </button>

              {letterFeedback && (
                <p
                  className={`letter-feedback ${
                    letterStatus === 'sent' ? 'success' : 'warning'
                  }`}
                >
                  {letterFeedback}
                </p>
              )}
            </form>
          </article>
        </section>

        <section className="section-card resources" id="resources">
          <div className="section-heading">
            <p className="eyebrow">Kutak za resurse</p>
            <h2>Vodiči koji olakšavaju teške razgovore.</h2>
          </div>
          <div className="resource-grid">
            {resourceGuides.map((resource) => (
              <article key={resource.title} className="resource-card">
                <span className="resource-icon" aria-hidden="true">
                  {resource.icon}
                </span>
                <p className="resource-tag">{resource.tag}</p>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <button type="button" className="ghost-link">
                  {resource.linkLabel}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section-card emergency" id="emergency">
          <div className="section-heading">
            <p className="eyebrow">Hitni kontakti</p>
            <h2>SOS brojevi u Crnoj Gori</h2>
            <p>
              Sačuvaj ove kontakte. Zamijeni privremene brojeve provjerenim
              kontaktima u svojoj opštini prije objave.
            </p>
          </div>
          <div className="emergency-grid">
            {emergencyContacts.map((contact) => (
              <article key={contact.title} className="emergency-card">
                <div>
                  <p className="emergency-title">{contact.title}</p>
                  <p className="emergency-number">{contact.number}</p>
                </div>
                <p className="emergency-note">{contact.note}</p>
                <div className="emergency-meta">
                  <span>{contact.availability}</span>
                  <span>{contact.type}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-card journey" id="journey">
          <div className="section-heading">
            <p className="eyebrow">Šta da očekuješ</p>
            <h2>Smiren i ljudski proces od prve poruke do rješenja.</h2>
          </div>
          <div className="journey-grid">
            {journeySteps.map((step, index) => (
              <article key={step.title} className="journey-card">
                <span className="journey-step">Korak {index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
                <small>{step.timeframe}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="section-card quick-tips">
          <div className="section-heading">
            <p className="eyebrow">Brza podrška</p>
            <h2>Uradi bar jednu malu stvar nakon ovoga.</h2>
          </div>
          <div className="tip-grid">
            {quickTips.map((tip) => (
              <article key={tip.title} className="tip-card">
                <span className="tip-icon">{tip.icon}</span>
                <h3>{tip.title}</h3>
                <p>{tip.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="section-card footer">
        <div>
          <p className="eyebrow">Tu smo kada god zatreba</p>
          <h2>Tvoj tempo, naš siguran kanal.</h2>
          <p>
            SOS (Safe Outreach Space) okuplja savjetnike i partnere koji nude
            diskretnu podršku svima koji se susreću sa vršnjačkim nasiljem,
            uznemiravanjem ili bilo kojim oblikom zlostavljanja u Crnoj Gori.
            Čuvamo povjerljiv razgovor, nudimo jasne korake i ostajemo uz tebe
            onoliko koliko želiš.
          </p>
        </div>
        <div className="footer-actions">
          <button
            className="solid-btn"
            type="button"
            onClick={() => scrollToSection('chat-support')}
          >
            Pokreni chat
          </button>
          <button
            className="outline-btn"
            type="button"
            onClick={() => scrollToSection('emergency')}
          >
            Pogledaj SOS brojeve
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App
