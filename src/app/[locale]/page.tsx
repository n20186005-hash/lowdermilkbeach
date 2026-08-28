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
import AudienceRouteSection from '@/components/AudienceRouteSection';
import RouteSection from '@/components/RouteSection';
import PhotoSpotsSection from '@/components/PhotoSpotsSection';
import HotelsSection from '@/components/HotelsSection';
import VisitorAmenitiesSection from '@/components/VisitorAmenitiesSection';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import LegendLocalSection from '@/components/LegendLocalSection';
import EcoSection from '@/components/EcoSection';
import LntSection from '@/components/LntSection';
import FaqSection from '@/components/FaqSection';
import FurtherReadingSection from '@/components/FurtherReadingSection';
import MapEmbed from '@/components/MapEmbed';
import Footer from '@/components/Footer';

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
        <Hero />
        <QuickFactsCard />
        <Intro />
        <BasicInfo />
        <HoursSection />
        <TicketsSection />
        <TransportSection />
        <InfoSection />
        <SeasonalSection />
        <AudienceRouteSection />
        <RouteSection />
        <PhotoSpotsSection />
        <HotelsSection />
        <VisitorAmenitiesSection />
        <Gallery />
        <Reviews />
        <LegendLocalSection />
        <EcoSection />
        <LntSection />
        <FaqSection />
        <FurtherReadingSection />
        <MapEmbed />
      </main>
      <Footer />
    </>
  );
}
