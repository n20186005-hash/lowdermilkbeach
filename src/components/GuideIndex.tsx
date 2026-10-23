import { getMessages } from 'next-intl/server';
import { TOPICS, TOPIC_CATEGORIES, type TopicCategory } from '@/lib/topics';

export default async function GuideIndex({ locale }: { locale: string }) {
  const messages = (await getMessages()) as any;
  const prefix = locale === 'zh' ? '/zh' : '/en';

  const groups = TOPIC_CATEGORIES.map((cat) => ({
    id: cat.id as TopicCategory,
    label: locale === 'zh' ? cat.labelZh : cat.labelEn,
    topics: TOPICS.filter((t) => t.category === cat.id).map((t) => ({
      slug: t.slug,
      title: messages?.[t.namespace]?.title || t.slug,
    })),
  }));

  return (
    <section id="guides" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {locale === 'zh' ? '访客指南' : 'Visitor Guides'}
        </h2>
        <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
          {locale === 'zh'
            ? '按主题浏览停车、开放时间、海滩状况、家庭活动与那不勒斯周边海滩比较。'
            : 'Browse parking, hours, beach conditions, family activities and Naples beach comparisons by topic.'}
        </p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.id}>
              <h3
                className="font-display text-xl font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {group.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {group.topics.map((topic) => (
                  <a
                    key={topic.slug}
                    href={`${prefix}/${topic.slug}`}
                    className="rounded-xl border p-4 text-sm font-medium transition-all hover:-translate-y-0.5"
                    style={{
                      borderColor: 'var(--border-color)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {topic.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
