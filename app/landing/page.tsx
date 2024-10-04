import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

interface FeatureProps {
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ title, description }) => (
  <div className="bg-gray-800 p-6 rounded-lg">
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

const Home: React.FC = () => {
  const features: FeatureProps[] = [
    { title: "Emotionally Responsive Learning", description: "Our system detects your emotional state and adapts content to keep you engaged." },
    { title: "Personalized Content Delivery", description: "Lessons align in real-time, offering materials that align with your current mood and focus." },
    { title: "Interactive Support", description: "If disengagement is sensed, the platform offers interactive puzzles or exercises to re-engage." },
    { title: "Privacy and Ethics", description: "We prioritize your privacy, using emotional data responsibly and with your explicit consent." }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Adaptive Intelligence (AI) - Smart, personalized learning experiences</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-image.png"
            alt="AI Network Background"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>

        <header className="relative z-10">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <div className="flex items-center">
              <Image src="/logo.png" alt="AI Logo" width={40} height={40} />
              <span className="ml-2 text-xl font-bold">Adaptive Intelligence (AI)</span>
            </div>
            <p className="text-sm">Smart, personalized learning experiences</p>
          </div>
        </header>

        <main>
          <section className="relative min-h-screen flex items-center">
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Experience Learning That Understands You</h1>
                <p className="text-lg mb-6">A groundbreaking approach bringing emotional awareness to education.</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full">Learn more</button>
              </div>
            </div>
          </section>

          <section className="py-20 text-center relative z-10">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-4">The Need for Change</h2>
              <p className="text-lg max-w-3xl mx-auto">Traditional education often overlooks individual emotional and cognitive needs, leading to disengagement and less effective learning experiences.</p>
            </div>
          </section>

          <section className="py-20 text-center relative z-10">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-4">Our Solution</h2>
              <p className="text-lg max-w-3xl mx-auto mb-4">Adaptive Intelligence uses real-time emotion recognition to tailor educational content to how you feel at any given moment.</p>
              <p className="text-lg max-w-3xl mx-auto">By integrating advanced AI technologies like emotion analysis from Hume AI, we create a learning environment that responds uniquely to each student.</p>
            </div>
          </section>
        </main>
      </div>

      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-800 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Join the Transformation</h2>
          <p className="text-lg mb-6">We&apos;re on a mission to make education more responsive and effective. We&apos;re seeking partners and investors who share our vision of personalized, emotion-aware learning.</p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg">Contact us</button>
        </div>
      </section>

      <footer className="bg-gray-900 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Adaptive Intelligence (AI). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;