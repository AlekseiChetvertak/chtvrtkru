document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Home Hero Word Stagger */
  const heroWords = document.querySelectorAll('.hero .word');
  heroWords.forEach((word, index) => {
    if (prefersReducedMotion) {
      word.classList.add('show');
    } else {
      setTimeout(() => word.classList.add('show'), 350 + index * 480);
    }
  });

  /* 2. Speaking Lab Character Drop */
  const labHero = document.querySelector('.lab-hero');
  const labTitle = document.querySelector('.lab-title');
  if (labHero && labTitle) {
    const chars = labTitle.querySelectorAll('.char');
    chars.forEach((char, idx) => {
      char.style.animationDelay = `${120 + idx * 42}ms`;
    });
    requestAnimationFrame(() => {
      labHero.classList.add('is-ready');
      labTitle.classList.add('is-ready');
    });
  }

  /* 3. Standard Reveal (для главной страницы) */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealEls.forEach((el) => revealObs.observe(el));
  }

  /* 4. Reversible Brand Finale (играет вперед и назад при скролле) */
  const brandWords = document.querySelectorAll('.brand-word');
  if (brandWords.length) {
    const brandObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in', entry.isIntersecting);
      });
    }, { threshold: 0.25 });
    brandWords.forEach((el) => brandObs.observe(el));
  }

  if (prefersReducedMotion) return;

  /* 5. Apple-style Reversible Scrub & Sticky Stages */
  const scrubItems = document.querySelectorAll('.scrub-item');
  const stages = document.querySelectorAll('[data-stage]');

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  let ticking = false;

  const updateScrollAnimations = () => {
    const vh = window.innerHeight;

    // A. Обратимые элементы: проявляются от 92% до 52% высоты экрана, затем замирают
    scrubItems.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const start = vh * 0.94;
      const end = vh * 0.52;
      const raw = (start - rect.top) / (start - end);
      const progress = easeOutCubic(clamp(raw, 0, 1));
      el.style.setProperty('--p', progress.toFixed(3));
    });

    // B. Sticky-сцены (экран стоит на месте, кадры сменяются по скроллу в обе стороны)
    stages.forEach((stage) => {
      const rect = stage.getBoundingClientRect();
      const scrollableDistance = rect.height - vh;
      if (scrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = clamp(scrolled / scrollableDistance, 0, 1);

      const slides = stage.querySelectorAll('.stage-slide');
      const count = slides.length;
      if (!count) return;

      const activeIndex = Math.min(Math.floor(progress * count), count - 1);

      slides.forEach((slide, idx) => {
        slide.classList.toggle('is-active', idx === activeIndex);
        slide.classList.toggle('is-past', idx < activeIndex);
      });

      const counterEl = stage.querySelector('.stage-current');
      if (counterEl) {
        counterEl.textContent = String(activeIndex + 1).padStart(2, '0');
      }

      const barEl = stage.querySelector('.stage-progress-bar');
      if (barEl) {
        barEl.style.transform = `scaleX(${progress.toFixed(3)})`;
      }
    });

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollAnimations);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateScrollAnimations();

  /* 6. Bilingual EN / RU Switcher (Default: EN) */
  const translations = {
    ru: {
      'nav.inside': 'Внутри',
      'nav.method': 'Метод',
      'nav.format': 'Формат',
      'nav.faq': 'FAQ',
      'nav.apply': 'Заявка ↗',
      'hero.eyebrow': 'CHVRTK · Английский для IT и бизнеса',
      'hero.tag': 'Сделай так, чтобы тебя услышали.',
      'hero.lead': 'У тебя уже есть английский.<br>Пора сделать так, чтобы услышали <strong class="text-accent">ТЕБЯ.</strong>',
      'hero.weeks': '8–10 НЕДЕЛЬ',
      'hero.people': '4 ЧЕЛОВЕКА',
      'hero.cta': 'Подать заявку <span aria-hidden="true">↗</span>',
      'prob.label': '01 / Проблема',
      'prob.title': 'ТЫ ЗНАЕШЬ<br>ЯЗЫК.<br><span class="text-accent">НО ГОВОРИШЬ ЛИ<br>ТЫ НА НЁМ?</span>',
      'prob.p1': 'Ты свободно читаешь документацию и понимаешь созвоны.',
      'prob.p2': 'Ты знаешь грамматику и имеешь словарный запас.',
      'prob.p3': 'Но в живом диалоге мысль начинает тормозить.',
      'prob.p4': 'Ты упрощаешь идеи до базовых фраз вместо того, чтобы сказать то, что действительно думаешь.',
      'conc.label': '02 / Концепция',
      'conc.title': 'МЕНЬШЕ ТЕОРИИ.<br><span class="text-accent">БОЛЬШЕ РЕЧИ.</span>',
      'conc.manifesto': 'Тебе не нужно ещё одно объяснение правил. Тебе нужно начать использовать английский, который ты уже знаешь.',
      'conc.p1': 'Живая практика вместо лекций.',
      'conc.p2': 'Реальные дискуссии вместо упражнений из учебника.',
      'conc.p3': 'Спонтанная речь вместо заготовленных шаблонов.',
      'conc.p4': 'Работа с тем, что ты реально говоришь — а не с абстрактными ошибками.',
      'exp.label': '03 / Внутри лаборатории',
      'exp.m1.k': 'Режим 01',
      'exp.m1.t': 'ДИСКУССИИ<span class="text-accent">.</span>',
      'exp.m1.d': 'Реальные позиции. Неудобные вопросы. Разговоры без сценария.',
      'exp.m2.k': 'Режим 02',
      'exp.m2.t': 'ДЕБАТЫ<span class="text-accent">.</span>',
      'exp.m2.d': 'Строй аргументацию. Оспаривай идеи. Защищай свою точку зрения.',
      'exp.m3.k': 'Режим 03',
      'exp.m3.t': 'ПЕРЕГОВОРЫ<span class="text-accent">.</span>',
      'exp.m3.d': 'Принимай решения. Ищи компромиссы. Приходи к соглашениям.',
      'exp.m4.k': 'Режим 04',
      'exp.m4.t': 'ОБЪЯСНЕНИЕ<span class="text-accent">.</span>',
      'exp.m4.d': 'Доноси сложные архитектурные и бизнес-идеи просто и убедительно.',
      'meth.label': '04 / Практика как метод',
      'meth.s1.k': 'Шаг 01',
      'meth.s1.t': 'ПОГРУЖЕНИЕ<span class="text-accent">.</span>',
      'meth.s1.d': 'Живые диалоги. Неожиданные вопросы. Разные точки зрения.',
      'meth.s2.k': 'Шаг 02',
      'meth.s2.t': 'АКТИВАЦИЯ<span class="text-accent">.</span>',
      'meth.s2.d': 'Используй тот английский, который уже есть. Выражай мысли без перевода в голове.',
      'meth.s3.k': 'Шаг 03',
      'meth.s3.t': 'ОСОЗНАННОСТЬ<span class="text-accent">.</span>',
      'meth.s3.d': 'Замечай повторяющиеся барьеры и узкие места в своей коммуникации.',
      'meth.s4.k': 'Шаг 04',
      'meth.s4.t': 'ОБРАТНАЯ СВЯЗЬ<span class="text-accent">.</span>',
      'meth.s4.d': 'Точечный разбор. Самокоррекция. Более сильная и точная подача.',
      'meth.principle': '<span class="text-accent">ГЛАВНЫЙ ПРИНЦИП:</span> Передавай мысль, а не подбирай идеальное слово.',
      'fmt.label': '05 / Формат',
      'fmt.title': '4 ЧЕЛОВЕКА.<br>8–10 НЕДЕЛЬ.<br><span class="text-accent">БЕЗ ПАССИВНЫХ<br>СЛУШАТЕЛЕЙ.</span>',
      'fmt.note': 'Не бесконечный разговорный клуб. И не индивидуальные уроки, замаскированные под группу.',
      'fmt.k1': 'Размер группы',
      'fmt.v1': 'Максимум 4 участника',
      'fmt.k2': 'График',
      'fmt.v2': '2 живые встречи в неделю',
      'fmt.k3': 'Длительность',
      'fmt.v3': '8–10 недель · фиксированный старт и финиш',
      'fmt.k4': 'Модерация',
      'fmt.v4': 'Активный Host управляет динамикой и темпом',
      'fmt.k5': 'Разбор',
      'fmt.v5': 'Индивидуальная обратная связь по итогам встреч',
      'out.label': '06 / Результат',
      'out.title': 'ЯЗЫКОВОЙ БАРЬЕР<br><span class="text-accent">ИСЧЕЗАЕТ.</span>',
      'out.o1': 'Перестаёшь переводить каждую мысль в голове перед тем, как сказать.',
      'out.o2': 'Не зависаешь, если забыл конкретное слово — легко перефразируешь.',
      'out.o3': 'Быстрее реагируешь на неожиданные вопросы на созвонах и интервью.',
      'out.o4': 'Свободно объясняешь сложные технические и продуктовые решения.',
      'out.caps': 'ИНТЕРВЬЮ. СОЗВОНЫ. ТЕХНИЧЕСКИЕ ДИСКУССИИ.',
      'out.sub': 'Говори, когда это важно. Объясняй то, в чём разбираешься. Будь услышанным.',
      'faq.label': '07 / FAQ',
      'faq.title': 'Частые вопросы.',
      'faq.q1': 'Для кого создан Speaking Lab?',
      'faq.a1': 'Для IT-специалистов и предпринимателей, которые уже понимают английский, но хотят свободно и убедительно говорить на нём в работе.',
      'faq.q2': 'Какой уровень английского нужен?',
      'faq.a2': 'Нужно уметь поддерживать базовый разговор на английском. Программа не рассчитана на обучение с нуля.',
      'faq.q3': 'Это разговорный клуб?',
      'faq.a3': 'Нет. Встречи активно ведёт Host, выстраивая их вокруг дебатов, переговоров и реальных рабочих задач.',
      'faq.q4': 'Будем ли мы учить грамматику?',
      'faq.a4': 'Традиционных уроков грамматики нет. Вся обратная связь строится на вашей реальной речи во время встреч.',
      'faq.q5': 'Сколько времени я буду говорить?',
      'faq.a5': 'В потоке максимум 4 человека. Отсидеться не получится — формат требует активного участия каждого.',
      'faq.q6': 'Что происходит после окончания программы?',
      'faq.a6': 'Поток завершается по расписанию. Вы уходите с плотной разговорной практикой, обратной связью и навыками для самостоятельного роста.',
      'cta.title': 'ТВОЯ ОЧЕРЕДЬ<br><span class="text-accent">ГОВОРИТЬ.</span>',
      'cta.m1': 'Четыре места.',
      'cta.m2': 'Один поток.',
      'cta.m3': 'Ограниченный набор.',
      'cta.btn': 'ВСТУПИТЬ В SPEAKING LAB <span aria-hidden="true">↗</span>',
      'brand.sub': 'Сделай так, чтобы <b class="text-accent">тебя услышали.</b>',
      'footer.tag': 'Сделай так, чтобы тебя услышали'
    }
  };

  // Сохраняем исходный английский текст прямо из DOM при загрузке
  const enCache = new Map();
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    enCache.set(el, { type: 'text', value: el.textContent });
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    enCache.set(el, { type: 'html', value: el.innerHTML });
  });

  const applyLanguage = (lang, animate = true) => {
    const switcher = document.querySelector('.lang-switch');
    const buttons = document.querySelectorAll('.lang-btn');

    if (switcher) switcher.dataset.lang = lang;
    buttons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset.setLang === lang));
    document.documentElement.lang = lang;
    localStorage.setItem('chvrtk_lang', lang);

    const swapText = () => {
      enCache.forEach((entry, el) => {
        const key = entry.type === 'text' ? el.dataset.i18n : el.dataset.i18nHtml;
        const nextVal = lang === 'ru' && translations.ru[key] ? translations.ru[key] : entry.value;
        if (entry.type === 'text') {
          el.textContent = nextVal;
        } else {
          el.innerHTML = nextVal;
        }
      });
    };

    if (!animate) {
      swapText();
      return;
    }

    document.body.classList.add('is-switching');
    setTimeout(() => {
      swapText();
      document.body.classList.remove('is-switching');
    }, 180);
  };

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetLang = btn.dataset.setLang;
      const currentLang = document.documentElement.lang || 'en';
      if (targetLang !== currentLang) {
        applyLanguage(targetLang, true);
      }
    });
  });

  // По умолчанию всегда EN, если пользователь ранее не выбрал RU
  const savedLang = localStorage.getItem('chvrtk_lang');
  if (savedLang === 'ru') {
    applyLanguage('ru', false);
  }
});