"use client";

import { useRef, useEffect } from "react";
import { X, Shield } from "lucide-react";
import gsap from "gsap";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.4, ease: "power2.out" });
      gsap.fromTo(panelRef.current,
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", delay: 0.1 }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(panelRef.current, { y: -20, opacity: 0, scale: 0.97, duration: 0.25, ease: "power3.in" });
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3, delay: 0.1 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6"
      style={{ opacity: 0, pointerEvents: "none" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <div
        ref={panelRef}
        data-dark-ui
        className="relative w-full max-w-2xl max-h-[85vh] border border-white/10 bg-[#0d0e12]/95 backdrop-blur-xl overflow-hidden flex flex-col"
        style={{ opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-teal-400" strokeWidth={1.5} />
            <h2 className="text-lg font-bold tracking-tight">Политика конфиденциальности</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 sm:px-8 py-6 text-sm text-neutral-400 leading-relaxed privacy-scroll">
          <p className="text-neutral-500 text-xs mb-6">
            Последнее обновление: {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <Section title="1. Общие положения">
            <p>
              Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки
              и защиты персональных данных пользователей сайта <strong className="text-white/70">аурачистоты.рф</strong> (далее — «Сайт»).
            </p>
            <p>
              Оператором персональных данных является индивидуальный предприниматель,
              осуществляющий деятельность под торговой маркой «АураЧистоты» (далее — «Оператор»).
            </p>
            <p>
              Используя Сайт и предоставляя свои персональные данные через формы обратной связи,
              Пользователь выражает согласие с условиями настоящей Политики.
            </p>
          </Section>

          <Section title="2. Какие данные мы собираем">
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>Имя (фамилия, имя, отчество — при указании)</li>
              <li>Номер телефона</li>
              <li>Текст сообщения (при использовании формы обратной связи)</li>
              <li>IP-адрес, тип браузера, параметры устройства — собираются автоматически</li>
              <li>Данные о посещении — через сервис Яндекс.Метрика</li>
            </ul>
          </Section>

          <Section title="3. Цели обработки">
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>Обработка заявок и обращений пользователей</li>
              <li>Обратная связь — звонок или сообщение в мессенджере</li>
              <li>Расчёт стоимости и формирование коммерческого предложения</li>
              <li>Улучшение качества сервиса и работы Сайта</li>
              <li>Выполнение обязательств, предусмотренных законодательством РФ</li>
            </ul>
          </Section>

          <Section title="4. Правовое основание">
            <p>
              Обработка персональных данных осуществляется на основании согласия субъекта персональных данных
              (пункт 1 части 1 статьи 6 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»).
            </p>
            <p>
              Согласие предоставляется путём активации чекбокса при заполнении формы на Сайте.
            </p>
          </Section>

          <Section title="5. Сроки хранения">
            <p>
              Персональные данные хранятся в течение <strong className="text-white/70">1 (одного) года</strong> с момента
              последнего обращения пользователя, после чего безвозвратно удаляются.
            </p>
            <p>
              Пользователь вправе отозвать согласие на обработку в любое время, направив
              запрос на электронную почту Оператора.
            </p>
          </Section>

          <Section title="6. Передача данных третьим лицам">
            <p>
              Оператор <strong className="text-white/70">не передаёт и не продаёт</strong> персональные данные
              третьим лицам, за исключением случаев:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>По требованию уполномоченных органов государственной власти в соответствии с законодательством РФ</li>
              <li>Для технической доставки уведомлений — через защищённые каналы (email, мессенджеры)</li>
            </ul>
          </Section>

          <Section title="7. Защита данных">
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>Передача данных осуществляется по защищённому протоколу HTTPS (TLS 1.3)</li>
              <li>Данные хранятся на серверах, расположенных на территории Российской Федерации</li>
              <li>Доступ к данным ограничен и предоставляется только уполномоченным сотрудникам</li>
              <li>Применяются организационные и технические меры для предотвращения несанкционированного доступа</li>
            </ul>
          </Section>

          <Section title="8. Права пользователя">
            <p>В соответствии со статьёй 14 Федерального закона № 152-ФЗ вы имеете право:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>Получить информацию об обработке ваших персональных данных</li>
              <li>Потребовать уточнения, блокирования или уничтожения данных</li>
              <li>Отозвать согласие на обработку персональных данных</li>
              <li>Обжаловать действия Оператора в Роскомнадзор</li>
            </ul>
            <p>
              Для реализации указанных прав направьте запрос на электронную почту,
              указанную в разделе «Контакты» на Сайте.
            </p>
          </Section>

          <Section title="9. Файлы cookie и аналитика">
            <p>
              Сайт использует сервис веб-аналитики <strong className="text-white/70">Яндекс.Метрика</strong>,
              предоставляемый ООО «Яндекс». Яндекс.Метрика использует файлы cookie для анализа
              использования Сайта. Собранная информация обрабатывается в обезличенном виде.
            </p>
            <p>
              Вы можете отключить cookie в настройках браузера, однако это может повлиять
              на функциональность Сайта.
            </p>
          </Section>

          <Section title="10. Изменение Политики">
            <p>
              Оператор оставляет за собой право вносить изменения в настоящую Политику.
              Актуальная версия размещена на Сайте. Продолжение использования Сайта после
              внесения изменений означает согласие с новой редакцией Политики.
            </p>
          </Section>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/[0.06] shrink-0">
          <button
            onClick={onClose}
            className="btn-primary w-full py-3"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-[13px] font-semibold text-white/80 uppercase tracking-wide mb-3">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}
