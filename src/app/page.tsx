'use client'
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

export default function Home() {

  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/suggest-messages', { prompt: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment." });
      setStory(response.data.response);
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Magic Story Generator</h1>
      <button onClick={generateStory} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Story'}
      </button>
      {story && <p>{story}</p>}
    </div>
  );
}
