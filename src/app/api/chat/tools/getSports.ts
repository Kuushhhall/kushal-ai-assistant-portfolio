
import { tool } from "ai";
import { z } from "zod";


export const getSports = tool({
  description:
    "This tool will show Kushal's hobbies and creative interests like dancing, cinematography, and video editing",
  parameters: z.object({}),
  execute: async () => {
    return "Here's a glimpse into my creative side - dancing, cinematography, and video editing!";
  },
});