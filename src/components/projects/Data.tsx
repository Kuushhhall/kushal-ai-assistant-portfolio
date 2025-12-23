// File: data.tsx

import Image from 'next/image';
import { ChevronRight, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// --- PROJECT DATABASE ---
// This array holds the detailed information for each project.
const PROJECT_CONTENT = [
  {
    // --- AI TUTOR PROJECT ---
    title: 'AI Tutor: Voice-Interactive Learning Platform',
    description:
      'Designed an interactive AI tutor with multimodal capabilities including speech-to-text, text-to-speech, and whiteboard visualization, improving learner engagement by 40%. Engineered Neo4j knowledge graph with 50+ concept nodes enabling adaptive difficulty and personalized learning paths based on individual performance patterns. Integrated LangChain for structured LLM responses, organizing content into concepts.',
    techStack: [
      'Python',
      'Flask',
      'React',
      'Neo4j',
      'VAPI',
      'ElevenLabs',
      'LangChain',
    ],
    date: 'Jan 2024 - Present',
    links: [
      {
        name: 'GitHub Repository',
        url: 'https://github.com/Kuushhhall/ai-tutor',
      },
    ],
    images: [
      { src: '/projects/ai-tutor-preview.png', alt: 'AI Tutor Platform Interface' },
    ],
  },
  {
    // --- WORKLOAD SPIKE PREDICTION PROJECT ---
    title: 'Workload Spike Prediction & Auto-Scaling System',
    description:
      'Debugged and optimized batch prediction pipeline combining Prophet time-series forecasting with LLM-based anomaly detection, reducing false-positives by 35%. Deployed containerized solution with Docker and real-time monitoring dashboards in Grafana for production visibility.',
    techStack: [
      'Python',
      'Kubernetes',
      'Prophet',
      'Docker',
      'Grafana',
      'LLMs',
    ],
    date: 'Jan 2025 - Feb 2025',
    links: [
      {
        name: 'GitHub Repository',
        url: 'https://github.com/Kuushhhall/workload-prediction',
      },
    ],
    images: [
      { src: '/projects/workload-prediction-preview.png', alt: 'Workload Prediction Dashboard' },
    ],
  },
  {
    // --- PARKING OCCUPANCY PROJECT ---
    title: 'Real-Time Parking Occupancy Detection System',
    description:
      'Built computer vision system achieving 94% detection accuracy for real-time parking slot monitoring across varied lighting and weather conditions. Developed modular architecture supporting multiple camera feeds with centralized occupancy dashboard for urban parking management.',
    techStack: [
      'Python',
      'OpenCV',
      'YOLOv5',
      'Docker',
    ],
    date: 'Sep 2024 - Dec 2024',
    links: [
      {
        name: 'GitHub Repository',
        url: 'https://github.com/Kuushhhall/parking-detection',
      },
    ],
    images: [
      { src: '/projects/parking-detection-preview.png', alt: 'Parking Occupancy Detection System' },
    ],
  },
  {
    // --- AI-NATIVE PORTFOLIO PROJECT ---
    title: 'AI-Native Portfolio',
    description:
      'Static portfolios are boring. Mine talks back. An AI-native portfolio where an AI avatar answers your questions about me in real time, powered by DeepSeek AI.',
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'DeepSeek AI',
      'Vercel AI SDK',
      'Node.js',
      'Vercel',
    ],
    date: 'December 2024',
    links: [
      {
        name: 'Live Demo - You Are Here!',
        url: 'https://kushal.bio',
      },
      {
        name: 'GitHub Repository',
        url: 'https://github.com/Kuushhhall/ai-native-portfolio',
      },
    ],
    images: [
      { src: '/projects/ai-portfolio-chat.png', alt: 'The AI Native Portfolio chat interface in action' },
      { src: '/projects/ai-portfolio-home.png', alt: 'Homepage of the AI Native Portfolio' },
    ],
  },
];

// --- COMPONENT & INTERFACE DEFINITIONS ---
// Define interface for project prop
interface ProjectProps {
  title: string;
}

// This component dynamically renders the project details
const ProjectContent = ({ project }: { project: ProjectProps }) => {
  // Find the matching project data from the database
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title);

  if (!projectData) {
    return <div>Project details not available</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header section with description */}
      <div className="rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{projectData.date}</span>
          </div>

          <p className="text-secondary-foreground font-sans text-base leading-relaxed md:text-lg">
            {projectData.description}
          </p>

          {/* Tech stack */}
          <div className="pt-4">
            <h3 className="mb-3 text-sm tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Links section */}
      {projectData.links && projectData.links.length > 0 && (
        <div className="mb-24">
          <div className="px-6 mb-4 flex items-center gap-2">
            <h3 className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
              Links
            </h3>
            <Link className="text-muted-foreground w-4" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            {projectData.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#F5F5F7] flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[#E5E5E7] dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                <span className="font-light capitalize">{link.name}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Images gallery */}
      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {projectData.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN DATA EXPORT ---
// This is the data used by your main portfolio page.
export const data = [
  {
    category: 'AI & EdTech',
    title: 'AI Tutor: Voice-Interactive Learning Platform',
    src: '/projects/ai-tutor-preview.png',
    content: (
      <ProjectContent project={{ title: 'AI Tutor: Voice-Interactive Learning Platform' }} />
    ),
  },
  {
    category: 'MLOps & DevOps',
    title: 'Workload Spike Prediction & Auto-Scaling System',
    src: '/projects/workload-prediction-preview.png',
    content: (
      <ProjectContent project={{ title: 'Workload Spike Prediction & Auto-Scaling System' }} />
    ),
  },
  {
    category: 'Computer Vision',
    title: 'Real-Time Parking Occupancy Detection System',
    src: '/projects/parking-detection-preview.png',
    content: (
      <ProjectContent project={{ title: 'Real-Time Parking Occupancy Detection System' }} />
    ),
  },
  {
    category: 'AI & Next.js',
    title: 'AI-Native Portfolio',
    src: '/projects/ai-portfolio-preview.png',
    content: (
      <ProjectContent project={{ title: 'AI-Native Portfolio' }} />
    ),
  },
];