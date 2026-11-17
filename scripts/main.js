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
      'footer.tag': 'Сделай так, чтобы тебя услышали',
      /* Partners Page */
      'p.nav.opp': 'Возможность',
      'p.nav.ben': 'Выгоды',
      'p.nav.mod': 'Модели',
      'p.nav.faq': 'FAQ',
      'p.nav.cta': 'Стать партнёром ↗',
      'p.hero.eyebrow': 'CHVRTK · Партнёрство для менторов и IT-проектов',
      'p.hero.t1': 'Ваша программа<br>готовит специалистов.',
      'p.hero.t2': 'Мы делаем так,<br>чтобы их услышали.',
      'p.hero.lead': 'Профессиональный английский и коммуникация для IT-специалистов, выходящих на международный рынок.',
      'p.hero.cta': 'Обсудить партнёрство <span aria-hidden="true">↗</span>',
      'p.hero.scroll': 'Как это работает ↓',
      'p.opp.label': '02 / Бизнес-возможность',
      'p.opp.title': 'Ваши клиенты готовятся к международной карьере.<br><span class="text-accent">Готовы ли они говорить?</span>',
      'p.opp.c1.t': 'Техническая база.',
      'p.opp.c1.d': 'Они умеют создавать продукты.',
      'p.opp.c2.t': 'Карьерная стратегия.',
      'p.opp.c2.d': 'Они знают, куда двигаться.',
      'p.opp.c3.t': 'Профессиональная коммуникация.',
      'p.opp.c3.d': 'Смогут ли они объяснить свою ценность?',
      'p.opp.body': 'Кандидат может обладать сильными техническими навыками и всё равно теряться, когда нужно защитить решение, пройти интервью или встроиться в международную команду.',
      'p.opp.punch': 'Эту задачу берём на себя мы.',
      'p.ben.label': '03 / Ценность для партнёра',
      'p.ben.sub': 'Больше ценности для ваших клиентов. Больше ценности для вашего бизнеса.',
      'p.ben.b1.k': 'Преимущество 01',
      'p.ben.b1.t': 'Дополните свой<br><span class="text-accent">продукт.</span>',
      'p.ben.b1.d': 'Добавьте профессиональный английский в вашу программу менторства или обучения. Дайте клиентам комплексную подготовку без создания языкового отдела.',
      'p.ben.b2.k': 'Преимущество 02',
      'p.ben.b2.t': 'Усильте ценность<br><span class="text-accent">программы.</span>',
      'p.ben.b2.d': 'Укрепите позиционирование, запустите премиальный тариф и создайте основу для более дорогих пакетов сопровождения.',
      'p.ben.b3.k': 'Преимущество 03',
      'p.ben.b3.t': 'Создайте новый<br><span class="text-accent">источник выручки.</span>',
      'p.ben.b3.d': 'Монетизируйте целевой запрос вашей аудитории через прозрачную реферальную или интегрированную модель.',
      'p.del.label': '04 / Зона ответственности',
      'p.del.title': 'Мы закрываем<br><span class="text-accent">коммуникацию.</span>',
      'p.del.d1.t': 'Прохождение интервью',
      'p.del.d1.d': 'Технические и поведенческие собеседования, самопрезентация, структурные ответы.',
      'p.del.d2.t': 'Профессиональная речь',
      'p.del.d2.d': 'Беглость, ясность формулировок, аргументация и спонтанный диалог.',
      'p.del.d3.t': 'Рабочая коммуникация',
      'p.del.d3.d': 'Созвоны, дискуссии, обмен обратной связью, design review и командная работа.',
      'p.del.d4.t': 'Профессиональная позиция',
      'p.del.d4.d': 'Презентация опыта, защита архитектурных решений и трансляция экспертизы.',
      'p.del.statement': 'Мы не преподаём «общий английский». Мы готовим людей к коммуникации в той среде, в которую они стремятся.',
      'p.proof.1': 'Студенты уже работают на международных рынках.',
      'p.proof.2': 'IT-специалисты целенаправленно готовятся к глобальным позициям.',
      'p.proof.3': 'Практика построена вокруг реальных рабочих ситуаций.',
      'p.mod.label': '05 / Форматы работы',
      'p.mod.title': 'Модели <span class="text-accent">партнёрства.</span>',
      'p.mod.m1.badge': 'Рекомендуемый старт',
      'p.mod.m1.t': 'Реферальное партнёрство',
      'p.mod.m1.d': 'Вы рекомендуете заинтересованных клиентов. Мы берём на себя диагностику, зачисление и обучение. Вы получаете согласованное вознаграждение за каждого студента.',
      'p.mod.m2.t': 'Интегрированная программа',
      'p.mod.m2.d': 'Английский становится частью вашего менторства или образовательного продукта. Мы проектируем и ведём коммуникационный модуль совместно.',
      'p.mod.m3.t': 'Индивидуальный формат',
      'p.mod.m3.d': 'Персональная модель для крупных сообществ, потоков и организаций. Объём, экономика и условия согласовываются индивидуально.',
      'p.terms.title': 'Коммерческие принципы',
      'p.terms.1': 'Размер вознаграждения фиксируется до старта сотрудничества.',
      'p.terms.2': 'Прозрачная отчётность по клиентским оплатам.',
      'p.terms.3': 'Объём и сроки согласовываются заранее.',
      'p.terms.4': 'Преподавание и качество результата — 100% на стороне CHVRTK.',
      'p.terms.5': 'Никаких обязательных минимальных объёмов на старте.',
      'p.faq.label': '06 / Вопросы',
      'p.faq.title': 'Частые вопросы.',
      'p.faq.q1': 'Работаете ли вы с частными менторами?',
      'p.faq.a1': 'Да. Мы сотрудничаем с независимыми карьерными менторами, IT-преподавателями, профессиональными сообществами и образовательными проектами.',
      'p.faq.q2': 'Нужно ли нам создавать свою программу по английскому?',
      'p.faq.a2': 'Нет. CHVRTK полностью предоставляет методологию, преподавателей и ведение учебного процесса.',
      'p.faq.q3': 'Кто ведёт и контролирует студентов?',
      'p.faq.a3': 'CHVRTK берёт на себя оценку уровня, зачисление, занятия и трекинг прогресса. Модель партнёрства определяет только формат передачи клиентов и коммерческие условия.',
      'p.faq.q4': 'Можно ли встроить CHVRTK в наш текущий продукт?',
      'p.faq.a4': 'Да. Мы можем запустить реферальный формат, встроенный модуль или кастомное образовательное партнёрство.',
      'p.end.title': 'Сделаем вашу<br>программу <span class="text-accent">сильнее.</span>',
      'p.end.sub': 'Расскажите о вашей аудитории и продукте. Мы предложим формат, который органично дополнит ваше предложение.',
      'p.end.tgHint': 'Удобнее написать напрямую?',
      'p.form.name': 'Имя / Проект',
      'p.form.contact': 'Сайт или Telegram',
      'p.form.program': 'Расскажите о вашей программе',
      'p.form.submit': 'Обсудить партнёрство <span aria-hidden="true">↗</span>',
      'p.form.note': 'Прямой контакт · Без обязательств',
      'p.footer': 'Специализированный образовательный партнёр',
      /* English for IT Page */
      'it.nav.stages': 'Интервью',
      'it.nav.program': 'Программа',
      'it.nav.sample': 'Пример',
      'it.nav.faq': 'FAQ',
      'it.nav.cta': 'Заявка ↗',
      'it.hero.eyebrow': 'CHVRTK / ПРОФЕССИОНАЛЬНОЕ РАЗВИТИЕ',
      'it.hero.t1': 'Ваша экспертиза.',
      'it.hero.t2': 'На их языке.',
      'it.hero.sub': 'Системная подготовка к международным IT-интервью для специалистов, выходящих на глобальный рынок.',
      'it.hero.cta': 'Изучить программу <span aria-hidden="true">↘</span>',
      'it.obj.label': 'ЦЕЛЬ ПРОГРАММЫ',
      'it.obj.title': 'Объяснять. Дискутировать. Защищать.',
      'it.obj.text': 'Техническая экспертиза — лишь часть успешного интервью.',
      'it.ch.label': '01 / Реальная проблема',
      'it.ch.title': 'Знать свою область — не то же самое,<br><span class="text-accent">что уметь её донести.</span>',
      'it.ch.c1.t': 'Вы знаете ответ.',
      'it.ch.c1.d': 'Но сложно чётко и структурно объяснить ход мыслей.',
      'it.ch.c2.t': 'У вас есть сильный опыт.',
      'it.ch.c2.d': 'Но самопрезентация не отражает ваш реальный уровень.',
      'it.ch.c3.t': 'Вы разбираетесь в технологиях.',
      'it.ch.c3.d': 'Но технические дискуссии на английском звучат скованно.',
      'it.ch.c4.t': 'Вы можете отвечать на вопросы.',
      'it.ch.c4.d': 'Но трудно самому управлять ходом беседы.',
      'it.ch.punch': 'Цель не просто говорить по-английски. <span class="text-accent">Цель — транслировать свою экспертизу.</span>',
      'it.st.label': '02 / К чему мы готовим',
      'it.st.title': 'Ко всему интервью.<br><span class="text-accent">А не только к шаблонам ответов.</span>',
      'it.st.s1.name': 'Презентация профессионального бэкграунда',
      'it.st.s2.name': 'Объяснение опыта и принятых решений',
      'it.st.s3.name': 'Обсуждение концепций, архитектуры и компромиссов',
      'it.st.s4.name': 'Умение задавать вопросы и вести дискуссию',
      'it.st.s5.name': 'Демонстрация навыков на mock-интервью',
      'it.st.taskLabel': 'ПРИМЕР ЗАДАЧИ',
      'it.pr.label': '03 / Программа',
      'it.pr.title': 'Структурная подготовка.<br><span class="text-accent">Реальный рабочий контекст.</span>',
      'it.pr.p1.t': 'Позиционируйте себя.',
      'it.pr.p1.d': 'Представляйте опыт, говорите о результатах и выстраивайте убедительную профессиональную историю.',
      'it.pr.p1.tags': 'Позиционирование · Карьерный нарратив · Презентация проектов',
      'it.pr.p2.t': 'Отвечайте осознанно.',
      'it.pr.p2.d': 'Проходите поведенческие интервью, структурируйте ответы и уверенно справляйтесь со сложными вопросами.',
      'it.pr.p2.tags': 'Метод STAR · Behavioral-интервью · Сложные вопросы',
      'it.pr.p3.t': 'Объясняйте экспертизу.',
      'it.pr.p3.d': 'Обсуждайте технические концепции, архитектуру, сравнивайте подходы и защищайте инженерные решения.',
      'it.pr.p3.tags': 'Технические объяснения · Решение задач · Инженерные дискуссии',
      'it.pr.p4.t': 'Управляйте диалогом.',
      'it.pr.p4.d': 'Задавайте точные вопросы, уточняйте требования и рассуждайте вслух под давлением.',
      'it.pr.p4.tags': 'Уточнение требований · Follow-up вопросы · Thinking aloud',
      'it.pr.f1': 'А затем мы проверяем всё на практике.',
      'it.pr.f2': 'Mock-интервью встроены в процесс подготовки.',
      'it.tr.label': '04 / Технические треки',
      'it.tr.title': 'Ваша сфера. <span class="text-accent">Ваш язык.</span>',
      'it.tr.t1': 'JavaScript, React, рендеринг, производительность, архитектура.',
      'it.tr.t2': 'API, базы данных, распределённые системы, масштабирование.',
      'it.tr.t3': 'Оценка моделей, обучение, инференс, ML-системы.',
      'it.tr.boundary': 'Мы не учим вас писать код. <span class="text-accent">Мы учим вас говорить о том, что вы уже умеете.</span>',
      'it.smp.fu': 'Уточняющие вопросы (Follow-up)',
      'it.smp.look': 'ЧТО МЫ ОЦЕНИВАЕМ',
      'it.smp.items': 'Ясность · Структура · Техническая точность · Аргументация',
      'it.smp.cap': 'Пример коммуникационных задач, которые разбираются на программе.',
      'it.mt.label': '05 / Метод CHVRTK',
      'it.mt.title': 'Больше, чем словарный запас.<br><span class="text-accent">Больше, чем грамматика.</span>',
      'it.mt.m1.t': 'Реалистичные симуляции',
      'it.mt.m1.d': 'Работаем со сценариями, которые действительно встречаются на международных интервью.',
      'it.mt.m2.t': 'Индивидуальный разбор',
      'it.mt.m2.d': 'Разбираем не только ошибки в языке, но и структуру, ясность и убедительность ответов.',
      'it.mt.m3.t': 'Профессиональный контекст',
      'it.mt.m3.d': 'Реальные архитектурные и продуктовые темы вместо искусственных диалогов из учебников.',
      'it.mt.m4.t': 'Стратегия коммуникации',
      'it.mt.m4.d': 'Учимся не просто отвечать, а строить диалог, аргументировать и транслировать свой уровень.',
      'it.who.label': '06 / Для кого',
      'it.who.title': 'Для амбициозных<br><span class="text-accent">IT-специалистов.</span>',
      'it.who.note': 'Создано для специалистов, у которых уже есть техническая база и которым нужно уверенно транслировать её на английском.',
      'it.faq.label': '07 / Практические детали',
      'it.faq.q1': 'Какой уровень английского нужен?',
      'it.faq.a1': 'Уверенная база от B1+, чтобы участвовать в профессиональных обсуждениях. Точную отправную точку определяем на диагностике.',
      'it.faq.q2': 'Это курс по программированию?',
      'it.faq.a2': 'Нет. Мы исходим из того, что техническая база у вас уже есть. Наша задача — научить вас структурировать и защищать её на английском.',
      'it.faq.q3': 'Включены ли mock-интервью?',
      'it.faq.a3': 'Да. Реалистичные тренировочные интервью с подробным разбором структуры и языка — ключевая часть программы.',
      'it.faq.q4': 'Нужно ли выбирать технический трек?',
      'it.faq.a4': 'Да, мы адаптируем дискуссии и симуляции под вашу специализацию — Frontend, Backend, ML или Product/QA.',
      'it.faq.q5': 'Как оценивается прогресс?',
      'it.faq.a5': 'Через серию mock-интервью, записи самопрезентаций и точечную обратную связь по ясности, структуре и аргументации.',
      'it.end.title': 'Ваш следующий шаг начинается<br><span class="text-accent">с разговора.</span>',
      'it.end.sub': 'Подготовьтесь представлять свою экспертизу без границ. Make Them Hear YOU.',
      'it.end.cta': 'Подать заявку на программу <span aria-hidden="true">↗</span>',
      'it.end.diag': 'Проверить уровень английского →',
      'it.footer': 'Подготовка к международным IT-интервью'
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

  /* 7. Partners Hero Entrance & Subtle Magnetic CTA */
  const partnersHero = document.querySelector('.partners-hero');
  if (partnersHero) {
    requestAnimationFrame(() => partnersHero.classList.add('is-ready'));
  }

  if (!prefersReducedMotion) {
    document.querySelectorAll('.magnetic-cta').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.16;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.22;
        btn.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* 8. Partner Inquiry Form Handler */
  const partnerForm = document.getElementById('partnerForm');
  const formStatus = document.getElementById('formStatus');
  if (partnerForm && formStatus) {
    partnerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const lang = document.documentElement.lang || 'en';
      formStatus.textContent = lang === 'ru'
        ? 'Заявка принята. Мы изучим ваш проект и свяжемся в ближайшее время.'
        : 'Inquiry received. We will review your program and reach out shortly.';
      partnerForm.reset();
    });
  }

  /* 9. English for IT: Hero Entrance, Parallax, Stages Explorer & Sample Interview */
  const itHero = document.querySelector('.it-hero');
  const heroBackdrop = document.querySelector('.hero-backdrop');
  if (itHero) {
    requestAnimationFrame(() => itHero.classList.add('is-ready'));

    if (!prefersReducedMotion && heroBackdrop) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroBackdrop.style.transform = `translate3d(0, ${(y * 0.18).toFixed(1)}px, 0)`;
        }
      }, { passive: true });
    }
  }

  // Interactive 5-Stage Interview Explorer
  const stageButtons = document.querySelectorAll('.stage-btn');
  const stageDetailPanel = document.getElementById('stageDetailPanel');
  if (stageButtons.length && stageDetailPanel) {
    const stagesData = {
      en: [
        {
          code: 'STAGE 01 / INTRODUCTION',
          title: 'Positioning your seniority in 90 seconds.',
          desc: 'Move beyond a chronological resume readout. Frame your impact, ownership, and technical focus so the interviewer immediately sees your level.',
          task: '"Walk me through your most impactful engineering project over the last year and what you personally owned."'
        },
        {
          code: 'STAGE 02 / BEHAVIORAL',
          title: 'Structuring high-stakes decisions and conflict.',
          desc: 'Use tight STAR framing without rambling. Show how you handle ambiguity, push back on flawed requirements, and take accountability.',
          task: '"Tell me about a time you disagreed with a technical decision on your team. How did you handle it?"'
        },
        {
          code: 'STAGE 03 / TECHNICAL',
          title: 'Articulating architecture and trade-offs.',
          desc: 'Explain complex systems clearly, compare alternatives objectively, and justify why you chose one engineering trade-off over another.',
          task: '"How would you design a rate limiter for a high-throughput API, and where would it fail first?"'
        },
        {
          code: 'STAGE 04 / INTERACTION',
          title: 'Turning an interrogation into a peer dialogue.',
          desc: 'Clarify ambiguous constraints, think aloud coherently while solving problems, and ask sharp questions that evaluate the engineering culture.',
          task: '"Before jumping into the schema, what read-to-write ratio and latency SLA are we optimizing for?"'
        },
        {
          code: 'STAGE 05 / PERFORMANCE',
          title: 'Pressure-testing under real interview conditions.',
          desc: 'Full-cycle mock interviews with realistic follow-ups, time constraints, and granular feedback on clarity, structure, and executive presence.',
          task: '45-minute live simulation combining system design defense + behavioral deep-dive + debrief.'
        }
      ],
      ru: [
        {
          code: 'ЭТАП 01 / ЗНАКОМСТВО',
          title: 'Позиционирование вашего уровня за 90 секунд.',
          desc: 'Уходим от сухого пересказа резюме. Формулируем зону ответственности, масштаб задач и технический фокус так, чтобы интервьюер сразу видел ваш грейд.',
          task: '«Расскажите о вашем самом значимом проекте за последний год и о том, за какие решения отвечали лично вы».'
        },
        {
          code: 'ЭТАП 02 / ПОВЕДЕНЧЕСКИЙ',
          title: 'Структура сложных решений и рабочих конфликтов.',
          desc: 'Используем чёткий STAR без воды. Показываем, как вы работаете в условиях неопределённости, аргументируете несогласие и берёте ответственность.',
          task: '«Вспомните случай, когда вы были не согласны с техническим решением команды. Как вы действовали?»'
        },
        {
          code: 'ЭТАП 03 / ТЕХНИЧЕСКИЙ',
          title: 'Аргументация архитектуры и компромиссов.',
          desc: 'Учимся ясно объяснять сложные системы, объективно сравнивать подходы и защищать выбранные инженерные trade-offs.',
          task: '«Как бы вы спроектировали rate limiter для высоконагруженного API и где находится его узкое место?»'
        },
        {
          code: 'ЭТАП 04 / ВЗАИМОДЕЙСТВИЕ',
          title: 'Перевод допроса в диалог равных инженеров.',
          desc: 'Уточняем размытые требования, рассуждаем вслух при решении задач и задаём сильные вопросы о процессах и культуре команды.',
          task: '«Прежде чем перейти к схеме данных — под какое соотношение чтения/записи и какой SLA мы оптимизируемся?»'
        },
        {
          code: 'ЭТАП 05 / СИМУЛЯЦИЯ',
          title: 'Проверка в условиях реального интервью.',
          desc: 'Полноценные mock-интервью с неожиданными уточняющими вопросами и детальным разбором структуры, ясности и убедительности.',
          task: '45-минутная живая симуляция: защита архитектурного решения + behavioral-блок + подробный разбор.'
        }
      ]
    };

    let currentStageIdx = 0;

    const renderStage = (idx) => {
      currentStageIdx = idx;
      const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
      const item = stagesData[lang][idx];
      if (!item) return;

      stageButtons.forEach((btn, i) => {
        const active = i === idx;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });

      stageDetailPanel.classList.add('is-updating');
      setTimeout(() => {
        document.getElementById('stageDetailCode').textContent = item.code;
        document.getElementById('stageDetailTitle').textContent = item.title;
        document.getElementById('stageDetailDesc').textContent = item.desc;
        document.getElementById('stageDetailTask').textContent = item.task;
        stageDetailPanel.classList.remove('is-updating');
      }, 140);
    };

    stageButtons.forEach((btn) => {
      const idx = Number(btn.dataset.stageIdx);
      btn.addEventListener('click', () => renderStage(idx));
      btn.addEventListener('mouseenter', () => {
        if (window.innerWidth > 960) renderStage(idx);
      });
    });

    // Re-render active stage when language switches
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => setTimeout(() => renderStage(currentStageIdx), 190));
    });
  }

  // Interactive Sample Mock Interview Tabs
  const sampleTabs = document.querySelectorAll('.sample-tab');
  if (sampleTabs.length) {
    const samplesData = {
      en: {
        backend: {
          badge: 'BACKEND ENGINEERING',
          question: 'How would you explain database indexing?',
          context: "Imagine you're discussing database performance with a senior engineer.",
          followups: [
            'What are the trade-offs?',
            'How does indexing affect write performance?',
            'When would you avoid adding an index?'
          ]
        },
        frontend: {
          badge: 'FRONTEND ENGINEERING',
          question: 'How do you diagnose and fix a slow React render?',
          context: "Imagine you're walking a tech lead through a production UI bottleneck.",
          followups: [
            'How do you isolate unnecessary re-renders vs. expensive computations?',
            'When does memoization hurt more than it helps?',
            'How do you measure the impact after shipping?'
          ]
        },
        ml: {
          badge: 'MACHINE LEARNING',
          question: 'Why would high offline accuracy fail in production?',
          context: "Imagine you're defending your evaluation pipeline during an ML system review.",
          followups: [
            'How do you detect data leakage or distribution shift early?',
            'What latency vs. model complexity trade-offs matter at inference?',
            'Which business metrics override offline F1 or AUC?'
          ]
        }
      },
      ru: {
        backend: {
          badge: 'BACKEND ENGINEERING',
          question: 'Как бы вы объяснили работу индексов в базах данных?',
          context: 'Представьте, что вы обсуждаете производительность БД с senior-инженером.',
          followups: [
            'В чём заключаются компромиссы (trade-offs)?',
            'Как индексирование влияет на скорость записи?',
            'В каких случаях вы бы отказались от добавления индекса?'
          ]
        },
        frontend: {
          badge: 'FRONTEND ENGINEERING',
          question: 'Как вы диагностируете и исправляете медленный рендер в React?',
          context: 'Представьте, что вы разбираете узкое место производительности с техлидом.',
          followups: [
            'Как отделить лишние ре-рендеры от тяжёлых вычислений?',
            'Когда мемоизация приносит больше вреда, чем пользы?',
            'Как вы замеряете результат после выкатки в прод?'
          ]
        },
        ml: {
          badge: 'MACHINE LEARNING',
          question: 'Почему высокая точность модели на оффлайн-тестах может провалиться в продакшене?',
          context: 'Представьте, что вы защищаете пайплайн валидации на ревью ML-системы.',
          followups: [
            'Как заранее отловить утечку данных (data leakage) или сдвиг распределений?',
            'Какие компромиссы между latency и сложностью модели критичны на инференсе?',
            'Какие продуктовые метрики важнее оффлайн-показателей F1 или AUC?'
          ]
        }
      }
    };

    let currentSampleKey = 'backend';

    const renderSample = (key) => {
      currentSampleKey = key;
      const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
      const data = samplesData[lang][key];
      if (!data) return;

      sampleTabs.forEach((t) => t.classList.toggle('is-active', t.dataset.sample === key));
      document.getElementById('sampleTrackLabel').textContent = data.badge;
      document.getElementById('sampleQuestion').textContent = data.question;
      document.getElementById('sampleContext').textContent = data.context;

      const listEl = document.getElementById('sampleList');
      listEl.innerHTML = data.followups.map((item) => `<li>${item}</li>`).join('');
    };

    sampleTabs.forEach((tab) => {
      tab.addEventListener('click', () => renderSample(tab.dataset.sample));
    });

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => setTimeout(() => renderSample(currentSampleKey), 190));
    });
  }
});