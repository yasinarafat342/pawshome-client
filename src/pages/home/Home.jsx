import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import PetCard from '../../components/pets/PetCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { FiArrowRight, FiHeart, FiShield, FiStar, FiUsers } from 'react-icons/fi';

// --- Banner ---
const Banner = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
    {/* Decorative blobs */}
    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 dark:bg-primary-900/20 rounded-full filter blur-3xl opacity-60 animate-bounce-slow" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-100 dark:bg-orange-900/20 rounded-full filter blur-3xl opacity-40" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="animate-slide-up">
        <span className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
          🐾 Find Your Perfect Companion
        </span>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
          Every Pet{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
            Deserves
          </span>{' '}
          a Home
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-lg">
          Thousands of loving pets are waiting for their forever family.
          Browse dogs, cats, birds, and more — and give someone a second chance at happiness.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/pets" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
            Adopt Now <FiArrowRight size={18} />
          </Link>
          <Link to="/register" className="btn-secondary text-base px-8 py-3.5">
            List Your Pet
          </Link>
        </div>

        <div className="mt-12 flex items-center gap-8">
          {[
            { value: '2,400+', label: 'Pets Adopted' },
            { value: '850+', label: 'Happy Families' },
            { value: '50+', label: 'Partner Shelters' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hero image grid */}
      <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in">
        {[
          'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
          'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&q=80',
          'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&q=80',
        ].map((src, i) => (
          <div key={i} className={`rounded-2xl overflow-hidden shadow-lg ${i === 1 ? 'mt-8' : ''} ${i === 3 ? '-mt-8' : ''}`}>
            <img src={src} alt="Happy pet" className="w-full h-44 object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- Featured Pets ---
const FeaturedPets = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['featured-pets'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/pets/featured');
      return data.pets;
    },
  });

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2 block">
            Meet Our Pets
          </span>
          <h2 className="section-title mb-4">Featured Pets for Adoption</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            These adorable animals are looking for their forever home. Could you be the one?
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner fullScreen={false} />
        ) : error ? (
          <p className="text-center text-gray-400">Failed to load pets.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.map(pet => <PetCard key={pet._id} pet={pet} />)}
            </div>
            <div className="text-center mt-10">
              <Link to="/pets" className="btn-primary inline-flex items-center gap-2">
                View All Pets <FiArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// --- Why Adopt ---
const WhyAdopt = () => {
  const reasons = [
    { icon: '❤️', title: 'Save a Life', desc: 'Every adoption creates space for another animal in need at shelters.' },
    { icon: '🏡', title: 'Gain a Friend', desc: 'Pets provide unconditional love, reducing stress and loneliness.' },
    { icon: '💰', title: 'Affordable', desc: 'Adoption fees are much lower than buying from breeders.' },
    { icon: '✅', title: 'Health Checked', desc: 'All our pets are vaccinated, spayed/neutered, and health-checked.' },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Why Adopt a Pet?</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Choosing adoption is one of the most rewarding decisions you'll ever make.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="card p-6 text-center hover:scale-105 transition-transform duration-300">
              <span className="text-4xl mb-4 block">{r.icon}</span>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{r.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Success Stories ---
const SuccessStories = () => {
  const stories = [
    { name: 'Sarah & Max', pet: 'Golden Retriever', story: 'Max changed our family completely. He\'s the best thing that happened to us.', avatar: 'https://ui-avatars.com/api/?name=Sarah&background=c026d3&color=fff' },
    { name: 'James & Luna', pet: 'Persian Cat', story: 'Luna is our therapy cat now. She knows when I\'m stressed and always comes to cuddle.', avatar: 'https://ui-avatars.com/api/?name=James&background=7c3aed&color=fff' },
    { name: 'The Millers', pet: 'Parrot', story: 'Our kids learned responsibility and empathy through caring for our parrot Rio.', avatar: 'https://ui-avatars.com/api/?name=Miller&background=ea580c&color=fff' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Success Stories</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Real families, real love. See how adoption changed their lives.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((s) => (
            <div key={s.name} className="card p-6 border-l-4 border-primary-500">
              <p className="text-gray-600 dark:text-gray-300 italic mb-6 leading-relaxed">"{s.story}"</p>
              <div className="flex items-center gap-3">
                <img src={s.avatar} className="w-10 h-10 rounded-full" alt={s.name} />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{s.name}</p>
                  <p className="text-xs text-primary-500">{s.pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Pet Care Tips ---
const PetCareTips = () => {
  const tips = [
    { icon: '🍎', title: 'Balanced Nutrition', desc: 'Feed age-appropriate, high-quality food. Fresh water must always be available.' },
    { icon: '🏃', title: 'Daily Exercise', desc: 'Regular walks and playtime keep pets physically and mentally healthy.' },
    { icon: '🏥', title: 'Regular Vet Visits', desc: 'Annual checkups and vaccinations prevent illnesses and detect issues early.' },
    { icon: '🛁', title: 'Proper Grooming', desc: 'Regular brushing, bathing, and nail trimming maintains hygiene and bonding.' },
    { icon: '🧸', title: 'Mental Stimulation', desc: 'Toys and training activities keep your pet engaged and prevent boredom.' },
    { icon: '💊', title: 'Parasite Prevention', desc: 'Monthly treatments for fleas, ticks, and worms protect your pet\'s health.' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-orange-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Pet Care Tips</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            A happy pet is a healthy pet. Follow these tips for the best care.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div key={tip.title} className="flex gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-2xl flex-shrink-0">{tip.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- How It Works ---
const HowItWorks = () => {
  const steps = [
    { step: '01', title: 'Browse Pets', desc: 'Explore our wide selection of pets looking for a home using our smart search and filter tools.' },
    { step: '02', title: 'Submit Request', desc: 'Found your match? Submit an adoption request with your pickup date and a message.' },
    { step: '03', title: 'Get Approved', desc: 'The pet owner or shelter reviews your request and approves it if it\'s a good fit.' },
    { step: '04', title: 'Welcome Home', desc: 'Pick up your new family member and start your journey together!' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">How It Works</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Adopting a pet through PawsHome is simple, safe, and fulfilling.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center p-6">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 right-0 w-1/2 h-0.5 bg-primary-100 dark:bg-primary-900" />
              )}
              <div className="relative z-10 w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200 dark:shadow-primary-900">
                <span className="font-display font-bold text-lg">{s.step}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- CTA Banner ---
const CTABanner = () => (
  <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
        Ready to Find Your Perfect Pet?
      </h2>
      <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
        Join thousands of families who found their best friend through PawsHome.
      </p>
      <Link to="/pets" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
        Browse All Pets <FiArrowRight size={18} />
      </Link>
    </div>
  </section>
);

// --- Main Home ---
const Home = () => {
  return (
    <div>
      <Banner />
      <FeaturedPets />
      <WhyAdopt />
      <HowItWorks />
      <SuccessStories />
      <PetCareTips />
      <CTABanner />
    </div>
  );
};

export default Home;
/ /   H o m e   P a g e  
 