'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Code, Cpu, PenTool, Users, Database, Cloud } from 'lucide-react';

const Skills = () => {
  const skillsData = [
    {
      category: 'Languages',
      icon: <Code className="h-5 w-5" />,
      skills: [
        'Python',
        'C++',
        'C',
        'SQL',
        'JavaScript',
      ],
      color: 'bg-blue-50 text-blue-600 border border-blue-200',
    },
    {
      category: 'ML & AI',
      icon: <Cpu className="h-5 w-5" />,
      skills: [
        'PyTorch',
        'TensorFlow',
        'scikit-learn',
        'OpenCV',
        'YOLO',
        'Transformers',
        'LangChain',
        'RAG',
        'LLM Fine-tuning',
      ],
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    },
    {
      category: 'Data Science',
      icon: <Database className="h-5 w-5" />,
      skills: [
        'Pandas',
        'NumPy',
        'Matplotlib',
        'Seaborn',
        'Hypothesis Testing',
        'A/B Testing',
        'EDA',
        'Feature Engineering',
      ],
      color: 'bg-purple-50 text-purple-600 border border-purple-200',
    },
    {
      category: 'Backend & DevOps',
      icon: <Cloud className="h-5 w-5" />,
      skills: [
        'Flask',
        'FastAPI',
        'Docker',
        'Kubernetes',
        'Git',
        'CI/CD',
        'REST APIs',
      ],
      color: 'bg-orange-50 text-orange-600 border border-orange-200',
    },
    {
      category: 'Databases',
      icon: <Database className="h-5 w-5" />,
      skills: [
        'MySQL',
        'MongoDB',
        'Neo4j',
        'Hadoop',
        'Query Optimization',
      ],
      color: 'bg-red-50 text-red-600 border border-red-200',
    },
    {
      category: 'Tools & Platforms',
      icon: <PenTool className="h-5 w-5" />,
      skills: [
        'Power BI',
        'Tableau',
        'Jupyter',
        'GCP',
        'AWS',
        'Grafana',
      ],
      color: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
    },
    {
      category: 'Soft Skills',
      icon: <Users className="h-5 w-5" />,
      skills: [
        'Data-driven decision making',
        'Problem-solving',
        'Analytical thinking',
        'Communication',
        'Teamwork',
        'Quick learner',
      ],
      color: 'bg-amber-50 text-amber-600 border border-amber-200',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="w-full border-none bg-transparent px-0 pb-12 text-black shadow-none dark:text-white">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-primary px-0 text-4xl font-bold">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <motion.div
            className="space-y-8 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillsData.map((section, index) => (
              <motion.div
                key={index}
                className="space-y-3 px-0"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="text-accent-foreground text-lg font-semibold">
                    {section.category}
                  </h3>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {section.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{
                        scale: 1.04,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge className={`border px-3 py-1.5 font-normal`}>
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;
