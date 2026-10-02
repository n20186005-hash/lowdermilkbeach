import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import QuickFactsCard from '@/components/QuickFactsCard';
import Intro from '@/components/Intro';
import BasicInfo from '@/components/BasicInfo';
import HoursSection from '@/components/HoursSection';
import TicketsSection from '@/components/TicketsSection';
import TransportSection from '@/components/TransportSection';
import InfoSection from '@/components/InfoSection';
import SeasonalSection from '@/components/SeasonalSection';
import WeatherTideSection from '@/components/WeatherTideSection';
import AudienceRouteSection from '@/components/AudienceRouteSection';
import RouteSection from '@/components/RouteSection';
import PhotoSpotsSection from '@/components/PhotoSpotsSection';
import HotelsSection from '@/components/HotelsSection';
import VisitorAmenitiesSection from '@/components/VisitorAmenitiesSection';
import OpenToday from '@/components/OpenToday';
import VisitorDirectory from '@/components/VisitorDirectory';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import LegendLocalSection from '@/components/LegendLocalSection';
import EcoSection from '@/components/EcoSection';
import LntSection from '@/components/LntSection';
import FaqSection from '@/components/FaqSection';
import FurtherReadingSection from '@/components/FurtherReadingSection';
import MapEmbed from '@/components/MapEmbed';
import Footer from '@/components/Footer';

// The home page embeds live weather and tide data fetched by a Server
// Component, so it must be rendered on demand instead of frozen at build time.
export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main id="home">
        {/* Visit-intent first: status, directory, hours, parking, getting here */}
        <Hero />
        <QuickFactsCard />
        <OpenToday />
        <VisitorDirectory />
        <HoursSection />
        <TicketsSection />
        <TransportSection />
        <VisitorAmenitiesSection />
        <WeatherTideSection />
        <Reviews />
        <Gallery />
        <PhotoSpotsSection />
        <MapEmbed />
        <FaqSection />

        {/* Background, ecology and long-form reference material below the fold */}
        <BasicInfo />
        <AudienceRouteSection />
        <RouteSection />
        <Intro />
        <InfoSection />
        <EcoSection />
        <SeasonalSection />
        <LegendLocalSection />
        <LntSection />
        <HotelsSection />
        <FurtherReadingSection />
      </main>
      <Footer />
    </>
  );
}
