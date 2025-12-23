import { tool } from 'ai';
import { z } from 'zod';

export const getInternship = tool({
  description:
    "Gives a summary of what kind of opportunities I'm looking for, plus my contact info and how to reach me. Use this tool when the user asks about my internship search or how to contact me for opportunities.",
  parameters: z.object({}),
  execute: async () => {
    return `Here's what I'm looking for 👇

- 📅 **Availability**: Open to immediate opportunities (2024-2025)
- 🌍 **Location**: **Mumbai, Maharashtra** (Open to Remote)
- 🧑‍💻 **Focus**: Data Science, AI/ML, Full-stack development
- 🛠️ **Stack**: Python, PyTorch, TensorFlow, LangChain, Flask, FastAPI, Docker, Kubernetes
- ✅ **What I bring**: Winner of BITS Pilani National Hackathon, built AI tutors with 40% engagement boost, CV systems with 94% accuracy, and production-ready auto-scaling systems.
- 🔥 I move fast, learn faster, and I'm HUNGRYYYYY for big challenges

📬 **Contact me** via:
- Email: kushalpugalia15@gmail.com
- LinkedIn: [linkedin.com/in/kuushhhall](https://www.linkedin.com/in/kuushhhall/)
- GitHub: [github.com/Kuushhhall](https://github.com/Kuushhhall)

Let's build cool shit together ✌️
    `;
  },
});
