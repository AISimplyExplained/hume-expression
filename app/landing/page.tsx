import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Brain, Book, MessageCircle, Shield } from 'lucide-react';
import Link from 'next/link';

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Feature: React.FC<FeatureProps> = ({ title, description, icon }) => (
  <div className="p-6 rounded-lg flex flex-col items-center text-center" style={{ backgroundColor: '#131327' }}>
    <div className="text-cyan-400 mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm">{description}</p>
  </div>
);

const Home: React.FC = () => {
  const features: FeatureProps[] = [
    {
      title: "Emotionally Responsive Learning",
      description: "Our system detects your emotional state and adjusts content to keep you engaged.",
      icon: <Brain size={48} />
    },
    {
      title: "Personalized Content Delivery",
      description: "Lessons adapt in real time, offering materials that align with your current mood and focus.",
      icon: <Book size={48} />
    },
    {
      title: "Interactive Support",
      description: "If disengagement is sensed, the platform offers interactive options like quizzes or alternative explanations.",
      icon: <MessageCircle size={48} />
    },
    {
      title: "Privacy and Ethics",
      description: "We prioritize your privacy, using emotional data responsibly and with your explicit consent.",
      icon: <Shield size={48} />
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Adaptive Intelligence (AI) - Smart, personalized learning experiences</title>
        <link rel="icon" href="/favicon.ico"/>
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
              <Image src="/logo.png" alt="AI Logo" width={40} height={40}/>
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
                <Link href="/" passHref>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg">
                    Contact us
                  </button>
                </Link>
              </div>
            </div>
          </section>

          <section className="py-5 text-center relative z-10">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-4">The Need for Change</h2>
              <p className="text-lg max-w-3xl mx-auto">Traditional education often overlooks individual emotional and cognitive needs, leading to disengagement and less effective learning experiences.</p>
            </div>
          </section>

          <section className="py-5 text-center relative z-10">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-4">Our Solution</h2>
              <p className="text-lg max-w-3xl mx-auto mb-4">Adaptive Intelligence uses real-time emotion recognition to tailor educational content to how you feel at any given moment.</p>
              <p className="text-lg max-w-3xl mx-auto">By integrating advanced AI technologies like emotion analysis from Hume AI, we create a learning environment that responds uniquely to each student.</p>
            </div>
          </section>
        </main>
      </div>

      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Join the Transformation</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            We&apos;re on a mission to make education more responsive and effective.
            We&apos;re seeking partners and investors who share our vision of
            personalized, emotion-aware learning.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg">
            Contact us
          </button>
        </div>
      </section>

      <footer className="bg-[#0f0f1a] py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Alan Macdonald</h3>
              <p className="text-sm text-gray-400">Doctoral Candidate, Junia Graduate School of Science and Engineering</p>
              <a href="https://linkedin.com/in/alanmacdonald" className="text-sm text-gray-400 hover:text-white">
                LinkedIn: linkedin.com/in/alanmacdonald
              </a>
            </div>
            <div className="flex items-center">
              <Image
                src="/junia-logo.png"
                alt="Junia Logo"
                width={100}
                height={40}
                className="mr-4"
              />
              <p className="text-sm">Junia Graduate School of Science and Engineering</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;